"use client";

import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/helpers";
import { useCartStore } from "@/lib/store/cart";
import { ArrowLeft, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function CartPage() {
  const [mounted, setMounted] = useState(false);
  const { items, removeItem, updateQuantity, totalPrice } = useCartStore();

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
        <div className="text-center py-16 text-muted-foreground">
          Loading...
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
        <div className="text-center py-16">
          <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground mb-4">Your cart is empty</p>
          <Link href="/shop">
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        href="/shop"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="mr-1 h-4 w-4" />
        Continue Shopping
      </Link>

      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={`${item.product_id}-${item.size}`}
              className="flex gap-4 p-4 border rounded-lg"
            >
              <div className="relative w-24 h-24 rounded-md overflow-hidden bg-gray-100 shrink-0">
                {item.image_url ? (
                  <Image
                    src={item.image_url}
                    alt={item.product_name}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                    No Img
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <Link
                  href={`/shop/${item.product_slug}`}
                  className="font-medium hover:underline line-clamp-1"
                >
                  {item.product_name}
                </Link>
                <p className="text-sm text-muted-foreground capitalize">
                  {item.brand === "li-ning" ? "Li-Ning" : "Anta"} · {item.size}
                </p>
                <p className="font-semibold mt-1">{formatPrice(item.price)}</p>

                <div className="flex items-center gap-2 mt-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() =>
                      updateQuantity(
                        item.product_id,
                        item.size,
                        item.quantity - 1,
                      )
                    }
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="text-sm w-8 text-center">
                    {item.quantity}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() =>
                      updateQuantity(
                        item.product_id,
                        item.size,
                        item.quantity + 1,
                      )
                    }
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 ml-auto text-muted-foreground hover:text-destructive"
                    onClick={() => removeItem(item.product_id, item.size)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="border rounded-lg p-6 space-y-4 sticky top-24">
            <h2 className="text-lg font-semibold">Order Summary</h2>

            <div className="space-y-2 text-sm">
              {items.map((item) => (
                <div
                  key={`${item.product_id}-${item.size}`}
                  className="flex justify-between"
                >
                  <span className="text-muted-foreground truncate mr-2">
                    {item.product_name} ({item.size}) ×{item.quantity}
                  </span>
                  <span>{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 flex justify-between font-semibold">
              <span>Total</span>
              <span>{formatPrice(totalPrice())}</span>
            </div>

            <p className="text-xs text-muted-foreground">
              Self-collection only. Collection details provided after payment.
            </p>

            <Link href="/checkout" className="block">
              <Button className="w-full font-semibold" size="lg">
                Proceed to Checkout
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
