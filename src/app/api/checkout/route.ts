import { generateOrderNumber } from "@/lib/helpers";
import { stripe } from "@/lib/stripe";
import { createServiceClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items, customer_name, customer_email, customer_phone } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "No items in cart" }, { status: 400 });
    }

    if (!customer_name || !customer_email || !customer_phone) {
      return NextResponse.json(
        { error: "Missing customer information" },
        { status: 400 }
      );
    }

    const supabase = await createServiceClient();

    // Validate items and calculate total
    let totalAmount = 0;
    const lineItems = [];

    for (const item of items) {
      // Verify product exists and get current price
      const { data: product } = await supabase
        .from("products")
        .select("id, name, price, is_active")
        .eq("id", item.product_id)
        .single();

      if (!product || !product.is_active) {
        return NextResponse.json(
          { error: `Product not found: ${item.product_name}` },
          { status: 400 }
        );
      }

      // Verify stock
      const { data: variant } = await supabase
        .from("product_variants")
        .select("stock")
        .eq("product_id", item.product_id)
        .eq("size", item.size)
        .single();

      if (!variant || variant.stock < item.quantity) {
        return NextResponse.json(
          {
            error: `Insufficient stock for ${item.product_name} (${item.size})`,
          },
          { status: 400 }
        );
      }

      totalAmount += product.price * item.quantity;

      lineItems.push({
        price_data: {
          currency: "sgd",
          product_data: {
            name: `${product.name} — ${item.size}`,
          },
          unit_amount: Math.round(product.price * 100), // Stripe uses cents
        },
        quantity: item.quantity,
      });
    }

    // Create order in DB with pending status
    const orderNumber = generateOrderNumber();
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        order_number: orderNumber,
        customer_name,
        customer_email,
        customer_phone,
        status: "pending_payment",
        total_amount: totalAmount,
      })
      .select()
      .single();

    if (orderError || !order) {
      console.error("Order creation error:", orderError);
      return NextResponse.json(
        { error: "Failed to create order" },
        { status: 500 }
      );
    }

    // Create order items
    const orderItems = items.map(
      (item: {
        product_id: string;
        product_name: string;
        size: string;
        quantity: number;
        price: number;
      }) => ({
        order_id: order.id,
        product_id: item.product_id,
        product_name: item.product_name,
        size: item.size,
        quantity: item.quantity,
        unit_price: item.price,
      })
    );

    await supabase.from("order_items").insert(orderItems);

    // Create Stripe Checkout Session
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["paynow"],
      line_items: lineItems,
      customer_email,
      metadata: {
        order_id: order.id,
        order_number: orderNumber,
      },
      success_url: `${appUrl}/order-confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/cart`,
    });

    // Update order with stripe session ID
    await supabase
      .from("orders")
      .update({ stripe_session_id: session.id })
      .eq("id", order.id);

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
