import { getStripe } from "@/lib/stripe";
import { createServiceClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const sessionId = request.nextUrl.searchParams.get("session_id");

  if (!sessionId) {
    return NextResponse.json({ error: "Missing session_id" }, { status: 400 });
  }

  try {
    // Retrieve session from Stripe
    const session = await getStripe().checkout.sessions.retrieve(sessionId);
    const orderId = session.metadata?.order_id;

    if (!orderId) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const supabase = await createServiceClient();

    // Get order
    const { data: order } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single();

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Get collection settings
    const { data: settingsRows } = await supabase
      .from("site_settings")
      .select("key, value");

    const settings: Record<string, string> = {};
    (settingsRows ?? []).forEach((s: { key: string; value: string }) => {
      settings[s.key] = s.value;
    });

    return NextResponse.json({
      order: {
        order_number: order.order_number,
        customer_name: order.customer_name,
        customer_email: order.customer_email,
        total_amount: order.total_amount,
        collection_address: settings.collection_address ?? "To be confirmed",
        collection_hours: settings.collection_hours ?? "To be confirmed",
        collection_instructions:
          settings.collection_instructions ??
          "Please bring your order confirmation email.",
      },
    });
  } catch (error) {
    console.error("Order confirmation error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve order" },
      { status: 500 }
    );
  }
}
