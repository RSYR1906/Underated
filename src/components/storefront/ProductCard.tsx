import { formatPrice } from "@/lib/helpers";
import type { Product } from "@/types";
import Image from "next/image";
import Link from "next/link";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const primaryImage =
    product.images?.find((img) => img.is_primary) ?? product.images?.[0];

  return (
    <Link href={`/shop/${product.slug}`} className="group">
      <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
        {primaryImage ? (
          <Image
            src={primaryImage.url}
            alt={primaryImage.alt_text ?? product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            No Image
          </div>
        )}
        {product.is_featured && (
          <span className="absolute top-2 left-2 bg-black text-white text-xs px-2 py-1 rounded">
            Featured
          </span>
        )}
      </div>
      <div className="mt-3 space-y-1">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          {product.brand === "li-ning" ? "Li-Ning" : "Anta"}
        </p>
        <h3 className="text-sm font-medium group-hover:underline">
          {product.name}
        </h3>
        <p className="text-sm font-semibold">{formatPrice(product.price)}</p>
      </div>
    </Link>
  );
}
