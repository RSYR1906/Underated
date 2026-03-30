import ProductCard from "@/components/storefront/ProductCard";
import { getDemoProducts } from "@/lib/demo-products";
import { createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Shop",
  description: "Browse our collection of Li-Ning and Anta basketball shoes.",
};

export const revalidate = 60;

interface ShopPageProps {
  searchParams: Promise<{ brand?: string }>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;
  const brand = params.brand;
  let products = null;

  try {
    const supabase = await createClient();

    let query = supabase
      .from("products")
      .select("*, images:product_images(*), variants:product_variants(*)")
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (brand && (brand === "li-ning" || brand === "anta")) {
      query = query.eq("brand", brand);
    }

    const { data } = await query;
    products = data;
  } catch {
    // Supabase not configured yet
  }

  // Fall back to demo data when DB is not connected
  if (!products || products.length === 0) products = getDemoProducts(brand);

  const brands = [
    { label: "All", value: undefined },
    { label: "Li-Ning", value: "li-ning" },
    { label: "Anta", value: "anta" },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          {brand === "li-ning"
            ? "Li-Ning"
            : brand === "anta"
              ? "Anta"
              : "All Shoes"}
        </h1>
        <p className="text-muted-foreground mt-1">
          {products?.length ?? 0} product
          {(products?.length ?? 0) !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-8">
        {brands.map((b) => (
          <Link
            key={b.label}
            href={b.value ? `/shop?brand=${b.value}` : "/shop"}
          >
            <span
              className={cn(
                "inline-block px-4 py-2 rounded-full text-sm font-medium border transition-colors",
                brand === b.value || (!brand && !b.value)
                  ? "bg-black text-white border-black"
                  : "bg-white text-foreground border-gray-200 hover:border-gray-400",
              )}
            >
              {b.label}
            </span>
          </Link>
        ))}
      </div>

      {/* Products Grid */}
      {products && products.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-muted-foreground">No products found.</p>
          <Link href="/shop" className="text-sm underline mt-2 inline-block">
            View all products
          </Link>
        </div>
      )}
    </div>
  );
}
