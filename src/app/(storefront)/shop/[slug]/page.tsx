import { getDemoProduct } from "@/lib/demo-products";
import { createClient } from "@/lib/supabase/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductDetail from "./ProductDetail";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  try {
    const { slug } = await params;

    // Try Supabase first, fall back to demo data
    let product: {
      name: string;
      description: string | null;
      brand: string;
    } | null = null;
    try {
      const supabase = await createClient();
      const { data } = await supabase
        .from("products")
        .select("name, description, brand")
        .eq("slug", slug)
        .eq("is_active", true)
        .single();
      product = data;
    } catch {
      // Supabase not configured
    }

    if (!product) {
      const demo = getDemoProduct(slug);
      if (demo)
        product = {
          name: demo.name,
          description: demo.description,
          brand: demo.brand,
        };
    }

    if (!product) return { title: "Product Not Found" };

    return {
      title: product.name,
      description:
        product.description ?? `Shop ${product.name} from ${product.brand}`,
    };
  } catch {
    return { title: "Product Not Found" };
  }
}

export const revalidate = 60;

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  let product = null;

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("products")
      .select("*, images:product_images(*), variants:product_variants(*)")
      .eq("slug", slug)
      .eq("is_active", true)
      .single();
    product = data;
  } catch {
    // Supabase not configured — try demo data
  }

  // Fall back to demo data
  if (!product) {
    product = getDemoProduct(slug) ?? null;
  }

  if (!product) notFound();

  // Sort images by display_order, primary first
  const images = (product.images ?? []).sort(
    (
      a: { is_primary: boolean; display_order: number },
      b: { is_primary: boolean; display_order: number },
    ) => {
      if (a.is_primary && !b.is_primary) return -1;
      if (!a.is_primary && b.is_primary) return 1;
      return a.display_order - b.display_order;
    },
  );

  // Sort variants by size
  const variants = (product.variants ?? []).sort(
    (a: { size: string }, b: { size: string }) => {
      const numA = parseFloat(a.size.replace("US ", ""));
      const numB = parseFloat(b.size.replace("US ", ""));
      return numA - numB;
    },
  );

  return <ProductDetail product={{ ...product, images, variants }} />;
}
