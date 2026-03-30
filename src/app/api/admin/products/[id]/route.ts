import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

interface RouteContext {
  params: Promise<{ id: string }>;
}

// PUT update product
export async function PUT(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { name, slug, brand, description, price, is_active, is_featured, variants } = body;

  // Update product
  const { error } = await supabase
    .from("products")
    .update({
      name,
      slug,
      brand,
      description,
      price,
      is_active,
      is_featured,
    })
    .eq("id", id);

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json(
        { error: "A product with this slug already exists" },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Replace variants: delete old, insert new
  if (variants) {
    await supabase.from("product_variants").delete().eq("product_id", id);

    if (variants.length > 0) {
      const variantRows = variants.map((v: { size: string; stock: number }) => ({
        product_id: id,
        size: v.size,
        stock: v.stock,
      }));
      await supabase.from("product_variants").insert(variantRows);
    }
  }

  return NextResponse.json({ success: true });
}

// DELETE product
export async function DELETE(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { error } = await supabase.from("products").delete().eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
