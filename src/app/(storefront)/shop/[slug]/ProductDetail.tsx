"use client";

import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/helpers";
import { useCartStore } from "@/lib/store/cart";
import { cn } from "@/lib/utils";
import type { Product, ProductVariant } from "@/types";
import { ArrowLeft, Check, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

interface ProductDetailProps {
  product: Product;
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const addItem = useCartStore((s) => s.addItem);

  const images = product.images ?? [];
  const variants = product.variants ?? [];

  const selectedVariant = variants.find(
    (v: ProductVariant) => v.size === selectedSize,
  );
  const isOutOfStock = selectedVariant ? selectedVariant.stock <= 0 : false;

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error("Please select a size");
      return;
    }
    if (isOutOfStock) {
      toast.error("This size is out of stock");
      return;
    }
    addItem({
      product_id: product.id,
      product_name: product.name,
      product_slug: product.slug,
      brand: product.brand,
      size: selectedSize,
      quantity: 1,
      price: product.price,
      image_url: images[0]?.url ?? null,
    });
    toast.success("Added to cart!", {
      description: `${product.name} — ${selectedSize}`,
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        href="/shop"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="mr-1 h-4 w-4" />
        Back to Shop
      </Link>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
            {images.length > 0 ? (
              <Image
                src={images[selectedImage]?.url}
                alt={images[selectedImage]?.alt_text ?? product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                No Image
              </div>
            )}
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {images.map(
                (
                  img: { id: string; url: string; alt_text: string | null },
                  i: number,
                ) => (
                  <button
                    key={img.id}
                    onClick={() => setSelectedImage(i)}
                    className={cn(
                      "relative w-20 h-20 rounded-md overflow-hidden flex-shrink-0 border-2 transition-colors",
                      selectedImage === i
                        ? "border-black"
                        : "border-transparent",
                    )}
                  >
                    <Image
                      src={img.url}
                      alt={img.alt_text ?? `${product.name} thumbnail ${i + 1}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </button>
                ),
              )}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-1">
              {product.brand === "li-ning" ? "Li-Ning" : "Anta"}
            </p>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <p className="text-2xl font-semibold mt-2">
              {formatPrice(product.price)}
            </p>
          </div>

          {product.description && (
            <p className="text-muted-foreground leading-relaxed">
              {product.description}
            </p>
          )}

          {/* Size Selector */}
          <div>
            <p className="text-sm font-medium mb-3">
              Size{selectedSize && `: ${selectedSize}`}
            </p>
            <div className="flex flex-wrap gap-2">
              {variants.map((variant: ProductVariant) => {
                const outOfStock = variant.stock <= 0;
                return (
                  <button
                    key={variant.id}
                    onClick={() => !outOfStock && setSelectedSize(variant.size)}
                    disabled={outOfStock}
                    className={cn(
                      "px-4 py-2 rounded-md border text-sm font-medium transition-colors",
                      selectedSize === variant.size
                        ? "bg-black text-white border-black"
                        : outOfStock
                          ? "bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed line-through"
                          : "bg-white text-foreground border-gray-200 hover:border-black",
                    )}
                  >
                    {variant.size}
                  </button>
                );
              })}
            </div>
            {variants.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No sizes available
              </p>
            )}
          </div>

          {/* Add to Cart */}
          <Button
            size="lg"
            className="w-full font-semibold"
            onClick={handleAddToCart}
            disabled={!selectedSize || isOutOfStock}
          >
            {isOutOfStock ? (
              "Out of Stock"
            ) : (
              <>
                <ShoppingBag className="mr-2 h-4 w-4" />
                Add to Cart
              </>
            )}
          </Button>

          {/* Self-collection note */}
          <div className="flex items-start gap-2 p-4 bg-gray-50 rounded-lg">
            <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-muted-foreground">
              <p className="font-medium text-foreground">
                Self-Collection Only
              </p>
              <p>
                All orders are available for self-collection. Collection details
                will be provided after payment.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
