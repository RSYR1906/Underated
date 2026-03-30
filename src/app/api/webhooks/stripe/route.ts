import { stripe } from "@/lib/stripe";
import { createServiceClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const supabase = await createServiceClient();

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const orderId = session.metadata?.order_id;

      if (!orderId) {
        console.error("No order_id in session metadata");
        break;
      }

      // Update order status to paid
      await supabase
        .from("orders")
        .update({
          status: "paid",
          stripe_payment_intent_id:
            typeof session.payment_intent === "string"
              ? session.payment_intent
              : session.payment_intent?.id ?? null,
        })
        .eq("id", orderId);

      // Decrement stock for each item
      const { data: orderItems } = await supabase
        .from("order_items")
        .select("product_id, size, quantity")
        .eq("order_id", orderId);

      if (orderItems) {
        for (const item of orderItems) {
          // Get current stock
          const { data: variant } = await supabase
            .from("product_variants")
            .select("id, stock")
            .eq("product_id", item.product_id)
            .eq("size", item.size)
            .single();

          if (variant) {
            await supabase
              .from("product_variants")
              .update({ stock: Math.max(0, variant.stock - item.quantity) })
              .eq("id", variant.id);
          }
        }
      }

      // Send confirmation email (optional — only if Resend is configured)
      try {
        if (process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== "your_resend_api_key") {
          const { data: order } = await supabase
            .from("orders")
            .select("*")
            .eq("id", orderId)
            .single();

          if (order) {
            // Fetch collection settings
            const { data: settingsRows } = await supabase
              .from("site_settings")
              .select("key, value");

            const settings: Record<string, string> = {};
            (settingsRows ?? []).forEach(
              (s: { key: string; value: string }) => {
                settings[s.key] = s.value;
              }
            );

            const { Resend } = await import("resend");
            const resend = new Resend(process.env.RESEND_API_KEY);

            await resend.emails.send({
              from: "Underated <onboarding@resend.dev>",
              to: [order.customer_email],
              subject: `Order Confirmed — ${order.order_number}`,
              html: `
                <h1>Thank you for your order!</h1>
                <p>Hi ${order.customer_name},</p>
                <p>Your payment has been confirmed.</p>
                <p><strong>Order Number:</strong> ${order.order_number}</p>
                <p><strong>Total:</strong> S$${Number(order.total_amount).toFixed(2)}</p>
                <h2>Collection Details</h2>
                <p><strong>Address:</strong> ${settings.collection_address ?? "To be confirmed"}</p>
                <p><strong>Hours:</strong> ${settings.collection_hours ?? "To be confirmed"}</p>
                <p><strong>Instructions:</strong> ${settings.collection_instructions ?? "Please bring your order confirmation email."}</p>
                <p>We will notify you when your order is ready for collection.</p>
                <p>— Underated</p>
              `,
            });
          }
        }
      } catch (emailError) {
        console.error("Failed to send confirmation email:", emailError);
        // Don't fail the webhook because of email errors
      }

      break;
    }

    case "checkout.session.expired": {
      const session = event.data.object as Stripe.Checkout.Session;
      const orderId = session.metadata?.order_id;

      if (orderId) {
        // Mark order as cancelled if payment was never completed
        await supabase
          .from("orders")
          .update({ status: "cancelled" })
          .eq("id", orderId)
          .eq("status", "pending_payment");
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
