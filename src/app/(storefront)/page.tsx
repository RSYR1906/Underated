import AnimatedHero from "@/components/storefront/AnimatedHero";
import ProductCard from "@/components/storefront/ProductCard";
import { Button } from "@/components/ui/button";
import { getDemoFeatured, getDemoProducts } from "@/lib/demo-products";
import { createClient } from "@/lib/supabase/server";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export const revalidate = 60; // ISR: rebuild every 60s

export default async function HomePage() {
  let featured = null;
  let latest = null;

  try {
    const supabase = await createClient();

    const { data: featuredData } = await supabase
      .from("products")
      .select("*, images:product_images(*), variants:product_variants(*)")
      .eq("is_active", true)
      .eq("is_featured", true)
      .order("created_at", { ascending: false })
      .limit(4);
    featured = featuredData;

    const { data: latestData } = await supabase
      .from("products")
      .select("*, images:product_images(*), variants:product_variants(*)")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(8);
    latest = latestData;
  } catch {
    // Supabase not configured yet — use demo data for preview
  }

  // Fall back to demo data when DB is not connected
  if (!featured || featured.length === 0) featured = getDemoFeatured();
  if (!latest || latest.length === 0) latest = getDemoProducts().slice(0, 8);

  return (
    <div>
      {/* Hero */}
      <AnimatedHero />

      {/* Featured Products */}
      {featured && featured.length > 0 && (
        <section className="container mx-auto px-4 py-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">Featured</h2>
            <Link
              href="/shop"
              className="text-sm font-medium text-muted-foreground hover:text-foreground flex items-center"
            >
              View all <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* Latest Products */}
      {latest && latest.length > 0 && (
        <section className="container mx-auto px-4 py-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">Latest Arrivals</h2>
            <Link
              href="/shop"
              className="text-sm font-medium text-muted-foreground hover:text-foreground flex items-center"
            >
              View all <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {latest.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* Brand Banner */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4 text-center space-y-4">
          <h2 className="text-2xl font-bold">Two Brands. One Mission.</h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Li-Ning and Anta are leading the charge in performance basketball
            footwear. Trusted by professional athletes, now available in
            Singapore.
          </p>
          <div className="flex justify-center gap-8 pt-4">
            <Link href="/shop?brand=li-ning">
              <Button variant="outline" size="lg">
                Shop Li-Ning
              </Button>
            </Link>
            <Link href="/shop?brand=anta">
              <Button variant="outline" size="lg">
                Shop Anta
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
