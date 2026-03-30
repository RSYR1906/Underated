/**
 * Demo product data scraped from Lazada SG (Li-Ning & Anta basketball shoes).
 * Used to preview the storefront when Supabase is not yet configured.
 * These will be replaced by real data from the database once connected.
 */

import type { Product } from "@/types";

export const DEMO_PRODUCTS: Product[] = [
  // ── Li-Ning ───────────────────────────────────────────────
  {
    id: "demo-1",
    name: "Way of Wade 12",
    slug: "way-of-wade-12",
    brand: "li-ning",
    description:
      "The Way of Wade 12 is the latest signature shoe from Dwyane Wade's iconic line. Featuring Li-Ning's Boom technology for explosive cushioning, a carbon fibre plate for energy return, and a premium knit upper for breathability and lockdown. Built for elite performance on the court.",
    price: 254.99,
    is_active: true,
    is_featured: true,
    created_at: "2025-12-01T00:00:00Z",
    updated_at: "2025-12-01T00:00:00Z",
    images: [
      {
        id: "img-1",
        product_id: "demo-1",
        url: "/demo/wow12.webp",
        alt_text: "Li-Ning Way of Wade 12",
        display_order: 0,
        is_primary: true,
        created_at: "2025-12-01T00:00:00Z",
      },
    ],
    variants: [
      { id: "v-1a", product_id: "demo-1", size: "US 8", stock: 3, created_at: "2025-12-01T00:00:00Z" },
      { id: "v-1b", product_id: "demo-1", size: "US 9", stock: 5, created_at: "2025-12-01T00:00:00Z" },
      { id: "v-1c", product_id: "demo-1", size: "US 10", stock: 4, created_at: "2025-12-01T00:00:00Z" },
      { id: "v-1d", product_id: "demo-1", size: "US 11", stock: 2, created_at: "2025-12-01T00:00:00Z" },
    ],
  },
  {
    id: "demo-2",
    name: "Wade 808 5 Ultra V2",
    slug: "wade-808-5-ultra-v2",
    brand: "li-ning",
    description:
      "The Wade 808 5 Ultra V2 delivers professional-grade performance at an accessible price. Featuring lightweight cushioning, a supportive mid-top construction, and a durable rubber outsole for multi-surface traction. Perfect for guards who need speed and agility.",
    price: 204.99,
    is_active: true,
    is_featured: true,
    created_at: "2025-11-15T00:00:00Z",
    updated_at: "2025-11-15T00:00:00Z",
    images: [
      {
        id: "img-2",
        product_id: "demo-2",
        url: "/demo/wade808.webp",
        alt_text: "Li-Ning Wade 808 5 Ultra V2",
        display_order: 0,
        is_primary: true,
        created_at: "2025-11-15T00:00:00Z",
      },
    ],
    variants: [
      { id: "v-2a", product_id: "demo-2", size: "US 8", stock: 4, created_at: "2025-11-15T00:00:00Z" },
      { id: "v-2b", product_id: "demo-2", size: "US 9", stock: 6, created_at: "2025-11-15T00:00:00Z" },
      { id: "v-2c", product_id: "demo-2", size: "US 10", stock: 3, created_at: "2025-11-15T00:00:00Z" },
      { id: "v-2d", product_id: "demo-2", size: "US 11", stock: 5, created_at: "2025-11-15T00:00:00Z" },
    ],
  },
  {
    id: "demo-3",
    name: "Wade All City 14",
    slug: "wade-all-city-14",
    brand: "li-ning",
    description:
      "The Wade All City 14 is a lightweight, high-rebound basketball shoe designed for versatile players. Featuring Li-Ning's Cloud cushioning for a plush ride, a breathable mesh upper, and a herringbone traction pattern for reliable grip on any court surface.",
    price: 189.99,
    is_active: true,
    is_featured: false,
    created_at: "2026-01-10T00:00:00Z",
    updated_at: "2026-01-10T00:00:00Z",
    images: [
      {
        id: "img-3",
        product_id: "demo-3",
        url: "/demo/wadeac14.webp",
        alt_text: "Li-Ning Wade All City 14",
        display_order: 0,
        is_primary: true,
        created_at: "2026-01-10T00:00:00Z",
      },
    ],
    variants: [
      { id: "v-3a", product_id: "demo-3", size: "US 8", stock: 2, created_at: "2026-01-10T00:00:00Z" },
      { id: "v-3b", product_id: "demo-3", size: "US 9", stock: 4, created_at: "2026-01-10T00:00:00Z" },
      { id: "v-3c", product_id: "demo-3", size: "US 10", stock: 3, created_at: "2026-01-10T00:00:00Z" },
      { id: "v-3d", product_id: "demo-3", size: "US 12", stock: 1, created_at: "2026-01-10T00:00:00Z" },
    ],
  },
  {
    id: "demo-4",
    name: "Wade Shadow 6 V2",
    slug: "wade-shadow-6-v2",
    brand: "li-ning",
    description:
      "The Wade Shadow 6 V2 is a sleek, low-profile basketball shoe built for quick players. Features responsive Bounse+ cushioning, a stabilizing TPU shank, and a translucent rubber outsole. The breathable woven upper provides a sock-like fit for maximum court feel.",
    price: 198.99,
    is_active: true,
    is_featured: false,
    created_at: "2025-10-20T00:00:00Z",
    updated_at: "2025-10-20T00:00:00Z",
    images: [
      {
        id: "img-4",
        product_id: "demo-4",
        url: "/demo/shadow6.webp",
        alt_text: "Li-Ning Wade Shadow 6 V2",
        display_order: 0,
        is_primary: true,
        created_at: "2025-10-20T00:00:00Z",
      },
    ],
    variants: [
      { id: "v-4a", product_id: "demo-4", size: "US 8.5", stock: 3, created_at: "2025-10-20T00:00:00Z" },
      { id: "v-4b", product_id: "demo-4", size: "US 9.5", stock: 4, created_at: "2025-10-20T00:00:00Z" },
      { id: "v-4c", product_id: "demo-4", size: "US 10.5", stock: 2, created_at: "2025-10-20T00:00:00Z" },
    ],
  },
  {
    id: "demo-5",
    name: "Jimmy Butler 2",
    slug: "jimmy-butler-2",
    brand: "li-ning",
    description:
      "The Jimmy Butler 2 signature shoe combines toughness with versatility — just like its namesake. Featuring dual-density Boom cushioning for impact protection, a reinforced toe cap for durability, and a wide base for stability during physical play.",
    price: 184.99,
    is_active: true,
    is_featured: true,
    created_at: "2025-09-15T00:00:00Z",
    updated_at: "2025-09-15T00:00:00Z",
    images: [
      {
        id: "img-5",
        product_id: "demo-5",
        url: "/demo/jb2.webp",
        alt_text: "Li-Ning Jimmy Butler 2",
        display_order: 0,
        is_primary: true,
        created_at: "2025-09-15T00:00:00Z",
      },
    ],
    variants: [
      { id: "v-5a", product_id: "demo-5", size: "US 8", stock: 2, created_at: "2025-09-15T00:00:00Z" },
      { id: "v-5b", product_id: "demo-5", size: "US 9", stock: 5, created_at: "2025-09-15T00:00:00Z" },
      { id: "v-5c", product_id: "demo-5", size: "US 10", stock: 4, created_at: "2025-09-15T00:00:00Z" },
      { id: "v-5d", product_id: "demo-5", size: "US 11", stock: 3, created_at: "2025-09-15T00:00:00Z" },
    ],
  },
  {
    id: "demo-6",
    name: "Speed XI",
    slug: "speed-xi",
    brand: "li-ning",
    description:
      "The Li-Ning Speed XI is engineered for fast-paced guards who need lightning-quick responsiveness. Ultra-lightweight construction keeps you agile, while the cushion system absorbs impact during explosive drives. A court-ready performance shoe at a great value.",
    price: 114.99,
    is_active: true,
    is_featured: false,
    created_at: "2025-11-01T00:00:00Z",
    updated_at: "2025-11-01T00:00:00Z",
    images: [
      {
        id: "img-6",
        product_id: "demo-6",
        url: "/demo/speedxi.webp",
        alt_text: "Li-Ning Speed XI",
        display_order: 0,
        is_primary: true,
        created_at: "2025-11-01T00:00:00Z",
      },
    ],
    variants: [
      { id: "v-6a", product_id: "demo-6", size: "US 8", stock: 6, created_at: "2025-11-01T00:00:00Z" },
      { id: "v-6b", product_id: "demo-6", size: "US 9", stock: 8, created_at: "2025-11-01T00:00:00Z" },
      { id: "v-6c", product_id: "demo-6", size: "US 10", stock: 5, created_at: "2025-11-01T00:00:00Z" },
      { id: "v-6d", product_id: "demo-6", size: "US 11", stock: 3, created_at: "2025-11-01T00:00:00Z" },
    ],
  },

  // ── Anta ───────────────────────────────────────────────────
  {
    id: "demo-7",
    name: "KT 11 (Klay Thompson)",
    slug: "kt-11-klay-thompson",
    brand: "anta",
    description:
      "The Anta KT 11 is Klay Thompson's latest signature shoe, engineered for elite shooting guards. Featuring Anta's Nitrogen Speed technology for responsive energy return, a carbon fibre plate for propulsion, and an anti-skid outsole for sharp cuts and stops on the court.",
    price: 159.0,
    is_active: true,
    is_featured: true,
    created_at: "2026-02-01T00:00:00Z",
    updated_at: "2026-02-01T00:00:00Z",
    images: [
      {
        id: "img-7",
        product_id: "demo-7",
        url: "/demo/kt11.webp",
        alt_text: "Anta KT 11 Klay Thompson",
        display_order: 0,
        is_primary: true,
        created_at: "2026-02-01T00:00:00Z",
      },
    ],
    variants: [
      { id: "v-7a", product_id: "demo-7", size: "US 8", stock: 4, created_at: "2026-02-01T00:00:00Z" },
      { id: "v-7b", product_id: "demo-7", size: "US 9", stock: 6, created_at: "2026-02-01T00:00:00Z" },
      { id: "v-7c", product_id: "demo-7", size: "US 10", stock: 5, created_at: "2026-02-01T00:00:00Z" },
      { id: "v-7d", product_id: "demo-7", size: "US 11", stock: 3, created_at: "2026-02-01T00:00:00Z" },
      { id: "v-7e", product_id: "demo-7", size: "US 12", stock: 2, created_at: "2026-02-01T00:00:00Z" },
    ],
  },
  {
    id: "demo-8",
    name: "Kyrie Irving KAI 1 Speed",
    slug: "kyrie-irving-kai-1-speed",
    brand: "anta",
    description:
      "The Anta x Kyrie Irving KAI 1 Speed 'PassTheTorch' edition brings Kyrie's legendary agility to your game. Featuring a low-cut design for ankle freedom, Anta's A-FlashFoam for responsive cushioning, and a multi-directional traction pattern for handles and crossovers.",
    price: 199.0,
    is_active: true,
    is_featured: true,
    created_at: "2025-12-15T00:00:00Z",
    updated_at: "2025-12-15T00:00:00Z",
    images: [
      {
        id: "img-8",
        product_id: "demo-8",
        url: "/demo/kai1.webp",
        alt_text: "Anta Kyrie Irving KAI 1 Speed",
        display_order: 0,
        is_primary: true,
        created_at: "2025-12-15T00:00:00Z",
      },
    ],
    variants: [
      { id: "v-8a", product_id: "demo-8", size: "US 7.5", stock: 2, created_at: "2025-12-15T00:00:00Z" },
      { id: "v-8b", product_id: "demo-8", size: "US 8.5", stock: 4, created_at: "2025-12-15T00:00:00Z" },
      { id: "v-8c", product_id: "demo-8", size: "US 9.5", stock: 5, created_at: "2025-12-15T00:00:00Z" },
      { id: "v-8d", product_id: "demo-8", size: "US 10.5", stock: 3, created_at: "2025-12-15T00:00:00Z" },
    ],
  },
  {
    id: "demo-9",
    name: "Shockwave 7.0",
    slug: "shockwave-7-0",
    brand: "anta",
    description:
      "The Anta Shockwave 7.0 is a professional-performance, low-top basketball shoe designed for speed and stability. Features Anta's Nitrogen Speed cushioning for explosive energy return, a lightweight TPU cage for midfoot support, and an aggressive herringbone outsole for grip.",
    price: 139.0,
    is_active: true,
    is_featured: false,
    created_at: "2025-10-01T00:00:00Z",
    updated_at: "2025-10-01T00:00:00Z",
    images: [
      {
        id: "img-9",
        product_id: "demo-9",
        url: "/demo/shockwave7.webp",
        alt_text: "Anta Shockwave 7.0",
        display_order: 0,
        is_primary: true,
        created_at: "2025-10-01T00:00:00Z",
      },
    ],
    variants: [
      { id: "v-9a", product_id: "demo-9", size: "US 8", stock: 5, created_at: "2025-10-01T00:00:00Z" },
      { id: "v-9b", product_id: "demo-9", size: "US 9", stock: 7, created_at: "2025-10-01T00:00:00Z" },
      { id: "v-9c", product_id: "demo-9", size: "US 10", stock: 4, created_at: "2025-10-01T00:00:00Z" },
      { id: "v-9d", product_id: "demo-9", size: "US 11", stock: 3, created_at: "2025-10-01T00:00:00Z" },
    ],
  },
  {
    id: "demo-10",
    name: "KAI 1 Team",
    slug: "kai-1-team",
    brand: "anta",
    description:
      "The Anta x Kyrie Irving KAI 1 Team is a team-edition takedown of Kyrie's signature line, delivering the same court feel at a more accessible price. Features A-FlashFoam cushioning, a durable rubber outsole, and a supportive fit system for daily hoopers.",
    price: 139.0,
    is_active: true,
    is_featured: false,
    created_at: "2025-11-20T00:00:00Z",
    updated_at: "2025-11-20T00:00:00Z",
    images: [
      {
        id: "img-10",
        product_id: "demo-10",
        url: "/demo/kai1team.webp",
        alt_text: "Anta KAI 1 Team",
        display_order: 0,
        is_primary: true,
        created_at: "2025-11-20T00:00:00Z",
      },
    ],
    variants: [
      { id: "v-10a", product_id: "demo-10", size: "US 8", stock: 4, created_at: "2025-11-20T00:00:00Z" },
      { id: "v-10b", product_id: "demo-10", size: "US 9", stock: 6, created_at: "2025-11-20T00:00:00Z" },
      { id: "v-10c", product_id: "demo-10", size: "US 10", stock: 5, created_at: "2025-11-20T00:00:00Z" },
      { id: "v-10d", product_id: "demo-10", size: "US 11", stock: 2, created_at: "2025-11-20T00:00:00Z" },
    ],
  },
  {
    id: "demo-11",
    name: "Wind Tunnel 4",
    slug: "wind-tunnel-4",
    brand: "anta",
    description:
      "The Anta Wind Tunnel 4 is a budget-friendly outdoor basketball shoe designed for durability and traction on rough surfaces. Features a reinforced rubber outsole, cushioned midsole for impact absorption, and a breathable mesh upper to keep your feet cool during extended runs.",
    price: 99.0,
    is_active: true,
    is_featured: false,
    created_at: "2025-08-10T00:00:00Z",
    updated_at: "2025-08-10T00:00:00Z",
    images: [
      {
        id: "img-11",
        product_id: "demo-11",
        url: "/demo/windtunnel4.webp",
        alt_text: "Anta Wind Tunnel 4",
        display_order: 0,
        is_primary: true,
        created_at: "2025-08-10T00:00:00Z",
      },
    ],
    variants: [
      { id: "v-11a", product_id: "demo-11", size: "US 8", stock: 8, created_at: "2025-08-10T00:00:00Z" },
      { id: "v-11b", product_id: "demo-11", size: "US 9", stock: 10, created_at: "2025-08-10T00:00:00Z" },
      { id: "v-11c", product_id: "demo-11", size: "US 10", stock: 7, created_at: "2025-08-10T00:00:00Z" },
      { id: "v-11d", product_id: "demo-11", size: "US 11", stock: 5, created_at: "2025-08-10T00:00:00Z" },
    ],
  },
  {
    id: "demo-12",
    name: "Swagger 1.0",
    slug: "swagger-1-0",
    brand: "anta",
    description:
      "The Anta Swagger 1.0 combines streetwear style with on-court performance. Its retro-inspired design features modern cushioning technology, a padded collar for comfort, and a durable cupsole construction. Great as both a basketball shoe and casual lifestyle sneaker.",
    price: 119.0,
    is_active: true,
    is_featured: false,
    created_at: "2025-09-05T00:00:00Z",
    updated_at: "2025-09-05T00:00:00Z",
    images: [
      {
        id: "img-12",
        product_id: "demo-12",
        url: "/demo/swagger1.webp",
        alt_text: "Anta Swagger 1.0",
        display_order: 0,
        is_primary: true,
        created_at: "2025-09-05T00:00:00Z",
      },
    ],
    variants: [
      { id: "v-12a", product_id: "demo-12", size: "US 8", stock: 5, created_at: "2025-09-05T00:00:00Z" },
      { id: "v-12b", product_id: "demo-12", size: "US 9", stock: 7, created_at: "2025-09-05T00:00:00Z" },
      { id: "v-12c", product_id: "demo-12", size: "US 10", stock: 4, created_at: "2025-09-05T00:00:00Z" },
      { id: "v-12d", product_id: "demo-12", size: "US 11", stock: 3, created_at: "2025-09-05T00:00:00Z" },
    ],
  },
];

// Helper to get demo products with optional brand filter
export function getDemoProducts(brand?: string): Product[] {
  if (brand && (brand === "li-ning" || brand === "anta")) {
    return DEMO_PRODUCTS.filter((p) => p.brand === brand);
  }
  return DEMO_PRODUCTS;
}

// Helper to get featured demo products
export function getDemoFeatured(): Product[] {
  return DEMO_PRODUCTS.filter((p) => p.is_featured);
}

// Helper to get a single demo product by slug
export function getDemoProduct(slug: string): Product | undefined {
  return DEMO_PRODUCTS.find((p) => p.slug === slug);
}
