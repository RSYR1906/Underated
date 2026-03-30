"use client";

import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/store/cart";
import { CheckCircle, Clock, Info, MapPin } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

interface OrderDetails {
  order_number: string;
  customer_name: string;
  customer_email: string;
  total_amount: number;
  collection_address: string;
  collection_hours: string;
  collection_instructions: string;
}

export default function OrderConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-16 text-center">
          <p className="text-muted-foreground">Loading order details...</p>
        </div>
      }
    >
      <OrderConfirmationContent />
    </Suspense>
  );
}

function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const clearCart = useCartStore((s) => s.clearCart);

  useEffect(() => {
    // Clear the cart on successful payment
    clearCart();

    if (sessionId) {
      fetch(`/api/order-confirmation?session_id=${sessionId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.order) setOrder(data.order);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [sessionId, clearCart]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-muted-foreground">Loading order details...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl">
      <div className="text-center mb-8">
        <CheckCircle className="mx-auto h-16 w-16 text-green-600 mb-4" />
        <h1 className="text-3xl font-bold">Payment Successful!</h1>
        <p className="text-muted-foreground mt-2">
          Thank you for your order. Your payment has been confirmed.
        </p>
      </div>

      {order && (
        <div className="space-y-6">
          <div className="border rounded-lg p-6 space-y-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Order Number</p>
              <p className="text-2xl font-bold">{order.order_number}</p>
            </div>

            <div className="border-t pt-4 text-sm space-y-1">
              <p>
                <span className="text-muted-foreground">Name:</span>{" "}
                {order.customer_name}
              </p>
              <p>
                <span className="text-muted-foreground">Email:</span>{" "}
                {order.customer_email}
              </p>
              <p>
                <span className="text-muted-foreground">Total Paid:</span> S$
                {Number(order.total_amount).toFixed(2)}
              </p>
            </div>
          </div>

          <div className="border rounded-lg p-6 space-y-4">
            <h2 className="text-lg font-semibold">Collection Details</h2>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Collection Address</p>
                  <p className="text-sm text-muted-foreground">
                    {order.collection_address}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Collection Hours</p>
                  <p className="text-sm text-muted-foreground">
                    {order.collection_hours}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Instructions</p>
                  <p className="text-sm text-muted-foreground">
                    {order.collection_instructions}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <p className="text-sm text-muted-foreground text-center">
            A confirmation email with these details has been sent to{" "}
            <span className="font-medium">{order.customer_email}</span>.
          </p>
        </div>
      )}

      {!order && (
        <div className="text-center border rounded-lg p-6">
          <p className="text-muted-foreground">
            We&apos;ve received your payment. You&apos;ll receive an email with
            collection details shortly.
          </p>
        </div>
      )}

      <div className="text-center mt-8">
        <Link href="/shop">
          <Button variant="outline">Continue Shopping</Button>
        </Link>
      </div>
    </div>
  );
}
