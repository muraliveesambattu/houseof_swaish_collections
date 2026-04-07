export const SIZES = ["XS", "S", "M", "L", "XL", "XXL"] as const;
export type Size = (typeof SIZES)[number];

export const FABRICS = [
  "Cotton",
  "Georgette",
  "Chiffon",
  "Marina",
  "Lawn Cotton",
  "Organza",
  "Silk",
  "Rayon",
] as const;

export const OCCASIONS = [
  "Casual",
  "Festive",
  "Party",
  "Work",
  "Bridal",
  "Ethnic",
] as const;

export const CATEGORIES = [
  { name: "Co-Ord Sets", slug: "co-ord-sets" },
  { name: "Kurti Sets", slug: "kurti-sets" },
  { name: "Dresses", slug: "dresses" },
  { name: "New Arrivals", slug: "new-arrivals" },
] as const;

export const SORT_OPTIONS = [
  { label: "Newest", value: "newest" },
  { label: "Bestselling", value: "bestselling" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
] as const;

export const PRICE_RANGE = { min: 500, max: 5000 } as const;

export const FREE_SHIPPING_THRESHOLD =
  Number(process.env.FREE_SHIPPING_THRESHOLD) || 999;

export const ORDER_STATUS_LABELS: Record<string, string> = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  PROCESSING: "Processing",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
  REFUNDED: "Refunded",
};

export const ORDER_STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  PROCESSING: "bg-purple-100 text-purple-800",
  SHIPPED: "bg-indigo-100 text-indigo-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
  REFUNDED: "bg-gray-100 text-gray-800",
};

export const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "919876543210";
export const WHATSAPP_MESSAGE = encodeURIComponent(
  "Hi! I have a query about an international order from The Co-Ord Set Studio."
);

export const COLORS = [
  { name: "Black", hex: "#000000" },
  { name: "White", hex: "#FFFFFF" },
  { name: "Red", hex: "#E63946" },
  { name: "Pink", hex: "#F4A0AA" },
  { name: "Dusty Rose", hex: "#C9A6A6" },
  { name: "Navy", hex: "#1D3557" },
  { name: "Green", hex: "#2D6A4F" },
  { name: "Yellow", hex: "#F4D06F" },
  { name: "Orange", hex: "#F4A261" },
  { name: "Purple", hex: "#7B2D8B" },
  { name: "Maroon", hex: "#8B0000" },
  { name: "Beige", hex: "#D4C5A9" },
  { name: "Grey", hex: "#808080" },
  { name: "Blue", hex: "#457B9D" },
  { name: "Teal", hex: "#1A936F" },
] as const;

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Collections", href: "/collections" },
  { label: "New Arrivals", href: "/collections/new-arrivals" },
  { label: "Sale", href: "/collections?sale=true" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

export const FOOTER_LINKS = {
  shop: [
    { label: "Co-Ord Sets", href: "/collections/co-ord-sets" },
    { label: "Kurti Sets", href: "/collections/kurti-sets" },
    { label: "Dresses", href: "/collections/dresses" },
    { label: "New Arrivals", href: "/collections/new-arrivals" },
    { label: "Sale", href: "/collections?sale=true" },
  ],
  help: [
    { label: "Size Guide", href: "/size-guide" },
    { label: "Shipping Policy", href: "/shipping-policy" },
    { label: "Return & Exchange", href: "/return-policy" },
    { label: "Track Order", href: "/account/orders" },
    { label: "Contact Us", href: "/contact" },
  ],
  company: [
    { label: "About Us", href: "/about" },
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms & Conditions", href: "/terms" },
  ],
} as const;
