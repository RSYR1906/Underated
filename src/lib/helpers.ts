export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .substring(0, 100);
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-SG", {
    style: "currency",
    currency: "SGD",
  }).format(price);
}

export function generateOrderNumber(): string {
  const now = new Date();
  const date = now.toISOString().slice(0, 10).replace(/-/g, "");
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `UND-${date}-${rand}`;
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    pending_payment: "Pending Payment",
    paid: "Paid",
    ready_for_collection: "Ready for Collection",
    collected: "Collected",
    cancelled: "Cancelled",
  };
  return labels[status] ?? status;
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    pending_payment: "bg-yellow-100 text-yellow-800",
    paid: "bg-blue-100 text-blue-800",
    ready_for_collection: "bg-green-100 text-green-800",
    collected: "bg-gray-100 text-gray-800",
    cancelled: "bg-red-100 text-red-800",
  };
  return colors[status] ?? "bg-gray-100 text-gray-800";
}

// Standard basketball shoe sizes (US)
export const SHOE_SIZES = [
  "US 4", "US 4.5", "US 5", "US 5.5",
  "US 6", "US 6.5", "US 7", "US 7.5",
  "US 8", "US 8.5", "US 9", "US 9.5",
  "US 10", "US 10.5", "US 11", "US 11.5",
  "US 12", "US 12.5", "US 13", "US 13.5",
  "US 14", "US 15", "US 16",
];
