"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { generateSlug, SHOE_SIZES } from "@/lib/helpers";
import type { Product, ProductImage, ProductVariant } from "@/types";
import { Loader2, Plus, Trash2, Upload, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface ProductFormProps {
  product?: Product;
}

export default function ProductForm({ product }: ProductFormProps) {
  const router = useRouter();
  const isEditing = !!product;

  const [loading, setLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [name, setName] = useState(product?.name ?? "");
  const [brand, setBrand] = useState<"li-ning" | "anta">(
    product?.brand ?? "li-ning",
  );
  const [description, setDescription] = useState(product?.description ?? "");
  const [price, setPrice] = useState(product?.price?.toString() ?? "");
  const [isActive, setIsActive] = useState(product?.is_active ?? true);
  const [isFeatured, setIsFeatured] = useState(product?.is_featured ?? false);
  const [variants, setVariants] = useState<{ size: string; stock: number }[]>(
    product?.variants?.map((v: ProductVariant) => ({
      size: v.size,
      stock: v.stock,
    })) ?? [],
  );
  const [images, setImages] = useState<ProductImage[]>(product?.images ?? []);

  const addVariant = () => {
    // Find first unused size
    const usedSizes = new Set(variants.map((v) => v.size));
    const nextSize = SHOE_SIZES.find((s) => !usedSizes.has(s)) ?? SHOE_SIZES[0];
    setVariants([...variants, { size: nextSize, stock: 0 }]);
  };

  const removeVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const updateVariant = (
    index: number,
    field: "size" | "stock",
    value: string | number,
  ) => {
    const updated = [...variants];
    if (field === "size") {
      updated[index].size = value as string;
    } else {
      updated[index].stock = Number(value);
    }
    setVariants(updated);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (!isEditing) {
      toast.error("Please save the product first before uploading images.");
      return;
    }

    setUploadingImages(true);
    const formData = new FormData();
    formData.append("product_id", product!.id);
    Array.from(files).forEach((file) => formData.append("files", file));

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setImages([...images, ...data.images]);
        toast.success(`${data.images.length} image(s) uploaded`);
      } else {
        toast.error(data.error || "Upload failed");
      }
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploadingImages(false);
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    const res = await fetch(`/api/admin/upload?id=${imageId}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setImages(images.filter((img) => img.id !== imageId));
      toast.success("Image deleted");
    } else {
      toast.error("Failed to delete image");
    }
  };

  const handleSetPrimary = async (imageId: string) => {
    const res = await fetch("/api/admin/upload", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image_id: imageId, product_id: product!.id }),
    });
    if (res.ok) {
      setImages(
        images.map((img) => ({
          ...img,
          is_primary: img.id === imageId,
        })),
      );
      toast.success("Primary image updated");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !price) {
      toast.error("Please fill in required fields");
      return;
    }

    setLoading(true);
    const slug = generateSlug(name);
    const payload = {
      name,
      slug,
      brand,
      description: description || null,
      price: parseFloat(price),
      is_active: isActive,
      is_featured: isFeatured,
      variants,
    };

    try {
      const url = isEditing
        ? `/api/admin/products/${product!.id}`
        : "/api/admin/products";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Failed to save product");
        setLoading(false);
        return;
      }

      toast.success(isEditing ? "Product updated" : "Product created");

      if (!isEditing) {
        // Redirect to edit page to enable image upload
        router.push(`/admin/products/${data.product.id}`);
      }
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle>Product Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Way of Wade 10"
                required
              />
              {name && (
                <p className="text-xs text-muted-foreground">
                  Slug: {generateSlug(name)}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="brand">Brand *</Label>
              <Select
                value={brand}
                onValueChange={(v) => v && setBrand(v as "li-ning" | "anta")}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="li-ning">Li-Ning</SelectItem>
                  <SelectItem value="anta">Anta</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Product description..."
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Price (SGD) *</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0.00"
              required
            />
          </div>

          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <Switch checked={isActive} onCheckedChange={setIsActive} />
              <Label>Active (visible on store)</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={isFeatured} onCheckedChange={setIsFeatured} />
              <Label>Featured</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sizes & Stock */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Sizes & Stock</CardTitle>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addVariant}
            >
              <Plus className="mr-1 h-4 w-4" />
              Add Size
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {variants.length > 0 ? (
            <div className="space-y-3">
              {variants.map((variant, index) => (
                <div key={index} className="flex items-center gap-3">
                  <Select
                    value={variant.size}
                    onValueChange={(v) => v && updateVariant(index, "size", v)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SHOE_SIZES.map((size) => (
                        <SelectItem key={size} value={size}>
                          {size}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="flex items-center gap-2">
                    <Label className="text-sm text-muted-foreground whitespace-nowrap">
                      Stock:
                    </Label>
                    <Input
                      type="number"
                      min="0"
                      value={variant.stock}
                      onChange={(e) =>
                        updateVariant(index, "stock", e.target.value)
                      }
                      className="w-24"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeVariant(index)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              No sizes added yet. Click &quot;Add Size&quot; to get started.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Images */}
      <Card>
        <CardHeader>
          <CardTitle>Images</CardTitle>
        </CardHeader>
        <CardContent>
          {!isEditing && (
            <p className="text-sm text-muted-foreground mb-4">
              Save the product first, then you can upload images.
            </p>
          )}

          {isEditing && (
            <>
              {/* Upload */}
              <div className="mb-4">
                <Label
                  htmlFor="images"
                  className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 border border-dashed rounded-lg hover:border-gray-400 transition-colors"
                >
                  {uploadingImages ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Upload className="h-4 w-4" />
                  )}
                  <span className="text-sm">
                    {uploadingImages ? "Uploading..." : "Upload Images"}
                  </span>
                </Label>
                <input
                  id="images"
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleImageUpload}
                  disabled={uploadingImages}
                />
              </div>

              {/* Image Grid */}
              {images.length > 0 && (
                <div className="grid grid-cols-4 gap-4">
                  {images.map((img) => (
                    <div key={img.id} className="relative group">
                      <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                        <Image
                          src={img.url}
                          alt={img.alt_text ?? "Product image"}
                          fill
                          className="object-cover"
                          sizes="200px"
                        />
                      </div>
                      <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={() => handleDeleteImage(img.id)}
                          className="bg-red-500 text-white rounded-full p-1"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleSetPrimary(img.id)}
                        className={`mt-1 text-xs w-full text-center rounded py-0.5 ${
                          img.is_primary
                            ? "bg-black text-white"
                            : "bg-gray-100 hover:bg-gray-200 text-muted-foreground"
                        }`}
                      >
                        {img.is_primary ? "Primary" : "Set Primary"}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Submit */}
      <div className="flex gap-3">
        <Button type="submit" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : isEditing ? (
            "Update Product"
          ) : (
            "Create Product"
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/products")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
