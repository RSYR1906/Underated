import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// GET all products (admin)
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("products")
    .select("*, images:product_images(*), variants:product_variants(*)")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ products: data });
}

// POST create new product
export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { name, slug, brand, description, price, is_active, is_featured, variants } = body;

  // Create product
  const { data: product, error } = await supabase
    .from("products")
    .insert({
      name,
      slug,
      brand,
      description,
      price,
      is_active,
      is_featured,
    })
    .select()
    .single();

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json(
        { error: "A product with this slug already exists" },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Create variants
  if (variants && variants.length > 0) {
    const variantRows = variants.map((v: { size: string; stock: number }) => ({
      product_id: product.id,
      size: v.size,
      stock: v.stock,
    }));
    await supabase.from("product_variants").insert(variantRows);
  }

  return NextResponse.json({ product }, { status: 201 });
}
