import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// POST upload images
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await request.formData();
  const productId = formData.get("product_id") as string;
  const files = formData.getAll("files") as File[];

  if (!productId || files.length === 0) {
    return NextResponse.json(
      { error: "Missing product_id or files" },
      { status: 400 }
    );
  }

  const uploadedImages = [];

  for (const file of files) {
    const ext = file.name.split(".").pop();
    const fileName = `${productId}/${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("product-images")
      .upload(fileName, file, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      continue;
    }

    const { data: urlData } = supabase.storage
      .from("product-images")
      .getPublicUrl(fileName);

    // Save to product_images table
    const { data: imageRow, error: insertError } = await supabase
      .from("product_images")
      .insert({
        product_id: productId,
        url: urlData.publicUrl,
        alt_text: file.name,
        display_order: 0,
        is_primary: false,
      })
      .select()
      .single();

    if (!insertError && imageRow) {
      uploadedImages.push(imageRow);
    }
  }

  return NextResponse.json({ images: uploadedImages });
}

// DELETE image
export async function DELETE(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const imageId = request.nextUrl.searchParams.get("id");
  if (!imageId) {
    return NextResponse.json({ error: "Missing image id" }, { status: 400 });
  }

  // Get image URL to delete from storage
  const { data: image } = await supabase
    .from("product_images")
    .select("url")
    .eq("id", imageId)
    .single();

  if (image) {
    // Extract path from URL
    const url = new URL(image.url);
    const path = url.pathname.split("/product-images/")[1];
    if (path) {
      await supabase.storage.from("product-images").remove([path]);
    }
  }

  await supabase.from("product_images").delete().eq("id", imageId);
  return NextResponse.json({ success: true });
}

// PATCH set primary image
export async function PATCH(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { image_id, product_id } = body;

  // Unset all primary for this product
  await supabase
    .from("product_images")
    .update({ is_primary: false })
    .eq("product_id", product_id);

  // Set new primary
  await supabase
    .from("product_images")
    .update({ is_primary: true })
    .eq("id", image_id);

  return NextResponse.json({ success: true });
}
