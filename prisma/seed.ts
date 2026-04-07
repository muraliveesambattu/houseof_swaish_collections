import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const directCandidates = [
  process.env.DIRECT_URL,
  process.env.POSTGRES_URL_NON_POOLING,
  process.env.POSTGRES_URL,
  process.env.DATABASE_URL,
  process.env.POSTGRES_PRISMA_URL,
].filter((value): value is string => Boolean(value));

// Use a direct postgres:// connection for seeding, not prisma+postgres://.
const DIRECT_URL =
  directCandidates.find(
    (value) =>
      value.startsWith("postgres://") || value.startsWith("postgresql://")
  ) ?? "postgres://postgres:postgres@localhost:51214/template1?sslmode=disable";

const adapter = new PrismaPg({ connectionString: DIRECT_URL });
const prisma = new PrismaClient({ adapter });

const categories = [
  { name: "Co-Ord Sets", slug: "co-ord-sets", description: "Effortlessly matched top and bottom sets for every occasion." },
  { name: "Kurti Sets", slug: "kurti-sets", description: "Elegant kurti and palazzo / pant pairings." },
  { name: "Dresses", slug: "dresses", description: "One-piece ethnic and fusion dresses." },
  { name: "New Arrivals", slug: "new-arrivals", description: "Freshest additions to the studio." },
];

const sampleProducts = [
  {
    name: "Dusty Rose Chanderi Co-Ord Set",
    slug: "dusty-rose-chanderi-co-ord-set",
    description: "A timeless chanderi silk co-ord set in dusty rose. Featuring a relaxed fit crop top and wide-leg palazzo, this set transitions effortlessly from brunch to dinner. Hand-embroidered border detailing adds a touch of luxury.",
    shortDesc: "Chanderi silk co-ord in dusty rose with hand-embroidered border.",
    price: 3499,
    comparePrice: 4999,
    images: [
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80",
      "https://images.unsplash.com/photo-1583391733956-6c78276477e1?w=800&q=80",
    ],
    fabric: "Chanderi Silk",
    occasion: "Festive",
    careInstr: "Dry clean only",
    tags: ["chanderi", "festive", "co-ord", "rose"],
    isFeatured: true,
    isTrending: true,
    isActive: true,
    categorySlug: "co-ord-sets",
    variants: [
      { size: "XS", color: "Dusty Rose", colorHex: "#C9A6A6", stock: 5 },
      { size: "S",  color: "Dusty Rose", colorHex: "#C9A6A6", stock: 12 },
      { size: "M",  color: "Dusty Rose", colorHex: "#C9A6A6", stock: 15 },
      { size: "L",  color: "Dusty Rose", colorHex: "#C9A6A6", stock: 10 },
      { size: "XL", color: "Dusty Rose", colorHex: "#C9A6A6", stock: 6 },
    ],
  },
  {
    name: "Ivory Cotton Printed Kurti Set",
    slug: "ivory-cotton-printed-kurti-set",
    description: "A breathable pure cotton kurti set in ivory with block-print detailing. Comes with matching straight-cut pants. Perfect for everyday elegance.",
    shortDesc: "Pure cotton block-print kurti with straight pants.",
    price: 1899,
    comparePrice: 2499,
    images: [
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80",
      "https://images.unsplash.com/photo-1604575408072-a9e40a4a54dc?w=800&q=80",
    ],
    fabric: "Cotton",
    occasion: "Casual",
    careInstr: "Machine wash cold, gentle cycle",
    tags: ["cotton", "casual", "kurti", "ivory", "blockprint"],
    isFeatured: true,
    isTrending: false,
    isActive: true,
    categorySlug: "kurti-sets",
    variants: [
      { size: "S",  color: "Ivory", colorHex: "#FAF7F4", stock: 20 },
      { size: "M",  color: "Ivory", colorHex: "#FAF7F4", stock: 25 },
      { size: "L",  color: "Ivory", colorHex: "#FAF7F4", stock: 18 },
      { size: "XL", color: "Ivory", colorHex: "#FAF7F4", stock: 12 },
      { size: "2XL",color: "Ivory", colorHex: "#FAF7F4", stock: 8 },
    ],
  },
  {
    name: "Charcoal Georgette Anarkali",
    slug: "charcoal-georgette-anarkali",
    description: "A floor-length georgette anarkali in deep charcoal. The flared silhouette and subtle shimmer make it perfect for evening events. Includes a matching dupatta.",
    shortDesc: "Floor-length charcoal georgette anarkali with dupatta.",
    price: 4299,
    comparePrice: 5999,
    images: [
      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=800&q=80",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
    ],
    fabric: "Georgette",
    occasion: "Festive",
    careInstr: "Dry clean recommended",
    tags: ["georgette", "anarkali", "festive", "charcoal"],
    isFeatured: true,
    isTrending: true,
    isActive: true,
    categorySlug: "dresses",
    variants: [
      { size: "S",  color: "Charcoal", colorHex: "#2C2C2A", stock: 8 },
      { size: "M",  color: "Charcoal", colorHex: "#2C2C2A", stock: 10 },
      { size: "L",  color: "Charcoal", colorHex: "#2C2C2A", stock: 7 },
      { size: "XL", color: "Charcoal", colorHex: "#2C2C2A", stock: 5 },
    ],
  },
  {
    name: "Mustard Linen Co-Ord Set",
    slug: "mustard-linen-co-ord-set",
    description: "Earthy mustard linen co-ord featuring a boxy short kurta and relaxed tapered pants. The textured linen fabric gets better with every wash.",
    shortDesc: "Earthy mustard linen boxy kurta and tapered pants.",
    price: 2599,
    comparePrice: 3299,
    images: [
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80",
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80",
    ],
    fabric: "Linen",
    occasion: "Casual",
    careInstr: "Machine wash cold",
    tags: ["linen", "casual", "co-ord", "mustard"],
    isFeatured: false,
    isTrending: true,
    isActive: true,
    categorySlug: "co-ord-sets",
    variants: [
      { size: "S",  color: "Mustard", colorHex: "#BA7517", stock: 15 },
      { size: "M",  color: "Mustard", colorHex: "#BA7517", stock: 20 },
      { size: "L",  color: "Mustard", colorHex: "#BA7517", stock: 14 },
      { size: "XL", color: "Mustard", colorHex: "#BA7517", stock: 9 },
    ],
  },
  {
    name: "Sage Green Rayon Kurti Set",
    slug: "sage-green-rayon-kurti-set",
    description: "A soft sage green rayon kurti with subtle tonal prints. Paired with loose palazzo pants. Airy and comfortable for long days.",
    shortDesc: "Soft sage green rayon kurti with palazzo pants.",
    price: 1599,
    comparePrice: 2099,
    images: [
      "https://images.unsplash.com/photo-1614251055880-ee96e4803393?w=800&q=80",
      "https://images.unsplash.com/photo-1581338834647-b0fb40704e21?w=800&q=80",
    ],
    fabric: "Rayon",
    occasion: "Casual",
    careInstr: "Hand wash or machine wash gentle",
    tags: ["rayon", "casual", "kurti", "sage", "palazzo"],
    isFeatured: false,
    isTrending: false,
    isActive: true,
    categorySlug: "kurti-sets",
    variants: [
      { size: "S",  color: "Sage Green", colorHex: "#87A878", stock: 18 },
      { size: "M",  color: "Sage Green", colorHex: "#87A878", stock: 22 },
      { size: "L",  color: "Sage Green", colorHex: "#87A878", stock: 16 },
      { size: "XL", color: "Sage Green", colorHex: "#87A878", stock: 10 },
      { size: "2XL",color: "Sage Green", colorHex: "#87A878", stock: 6 },
    ],
  },
  {
    name: "Terracotta Silk Blend Co-Ord",
    slug: "terracotta-silk-blend-co-ord",
    description: "Rich terracotta silk blend co-ord set with gold zari border work. A statement piece for festive occasions.",
    shortDesc: "Terracotta silk blend with gold zari border — festive ready.",
    price: 5499,
    comparePrice: 7499,
    images: [
      "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=800&q=80",
      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&q=80",
    ],
    fabric: "Silk Blend",
    occasion: "Wedding",
    careInstr: "Dry clean only",
    tags: ["silk", "wedding", "co-ord", "zari", "festive"],
    isFeatured: true,
    isTrending: true,
    isActive: true,
    categorySlug: "co-ord-sets",
    variants: [
      { size: "XS", color: "Terracotta", colorHex: "#C07850", stock: 4 },
      { size: "S",  color: "Terracotta", colorHex: "#C07850", stock: 8 },
      { size: "M",  color: "Terracotta", colorHex: "#C07850", stock: 10 },
      { size: "L",  color: "Terracotta", colorHex: "#C07850", stock: 7 },
      { size: "XL", color: "Terracotta", colorHex: "#C07850", stock: 4 },
    ],
  },
  {
    name: "Lavender Chiffon Wrap Dress",
    slug: "lavender-chiffon-wrap-dress",
    description: "An ethereal lavender chiffon wrap dress with delicate floral prints. The adjustable wrap silhouette flatters all body types.",
    shortDesc: "Lavender chiffon wrap dress with floral prints.",
    price: 2999,
    comparePrice: 3999,
    images: [
      "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&q=80",
      "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&q=80",
    ],
    fabric: "Chiffon",
    occasion: "Party",
    careInstr: "Hand wash cold, lay flat to dry",
    tags: ["chiffon", "dress", "wrap", "lavender", "floral"],
    isFeatured: false,
    isTrending: true,
    isActive: true,
    categorySlug: "dresses",
    variants: [
      { size: "S",  color: "Lavender", colorHex: "#B39EC5", stock: 10 },
      { size: "M",  color: "Lavender", colorHex: "#B39EC5", stock: 14 },
      { size: "L",  color: "Lavender", colorHex: "#B39EC5", stock: 11 },
      { size: "XL", color: "Lavender", colorHex: "#B39EC5", stock: 7 },
    ],
  },
  {
    name: "Indigo Block Print Kurta Set",
    slug: "indigo-block-print-kurta-set",
    description: "Authentic indigo hand block-printed pure cotton kurta set. Each piece is unique — made by artisans in Sanganer, Jaipur.",
    shortDesc: "Hand block-printed indigo cotton kurta — artisan made.",
    price: 2199,
    comparePrice: 2799,
    images: [
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80",
      "https://images.unsplash.com/photo-1593032465175-481ac7f401a0?w=800&q=80",
    ],
    fabric: "Cotton",
    occasion: "Casual",
    careInstr: "Hand wash in cold water. Do not wring.",
    tags: ["cotton", "blockprint", "indigo", "artisan", "jaipur"],
    isFeatured: true,
    isTrending: false,
    isActive: true,
    categorySlug: "kurti-sets",
    variants: [
      { size: "S",  color: "Indigo", colorHex: "#3D5A80", stock: 8 },
      { size: "M",  color: "Indigo", colorHex: "#3D5A80", stock: 12 },
      { size: "L",  color: "Indigo", colorHex: "#3D5A80", stock: 9 },
      { size: "XL", color: "Indigo", colorHex: "#3D5A80", stock: 6 },
      { size: "2XL",color: "Indigo", colorHex: "#3D5A80", stock: 3 },
    ],
  },
];

async function main() {
  console.log("🌱 Seeding database…");

  // Admin user
  const hashedPassword = await bcrypt.hash("Admin@1234", 12);
  await prisma.user.upsert({
    where: { email: "admin@houseofswaishq.com" },
    update: {},
    create: {
      email: "admin@houseofswaishq.com",
      name: "TCSS Admin",
      passwordHash: hashedPassword,
      role: "ADMIN",
      emailVerified: new Date(),
    },
  });
  console.log("✓ Admin user created: admin@houseofswaishq.com / Admin@1234");

  // Categories
  const createdCategories = await Promise.all(
    categories.map((cat) =>
      prisma.category.upsert({
        where: { slug: cat.slug },
        update: {},
        create: cat,
      })
    )
  );
  console.log(`✓ ${createdCategories.length} categories seeded`);

  // Products
  let productCount = 0;
  for (const product of sampleProducts) {
    const { variants, categorySlug, ...productData } = product;
    const category = createdCategories.find((c) => c.slug === categorySlug);
    if (!category) continue;

    const created = await prisma.product.upsert({
      where: { slug: productData.slug },
      update: {},
      create: {
        ...productData,
        categoryId: category.id,
        variants: {
          create: variants.map((v, i) => ({
            ...v,
            sku: `${productData.slug.slice(0, 8).toUpperCase()}-${v.size}-${String(i + 1).padStart(3, "0")}`,
          })),
        },
      },
    });
    productCount++;
    console.log(`  ✓ ${created.name}`);
  }
  console.log(`✓ ${productCount} products seeded`);

  // Sample coupon
  await prisma.coupon.upsert({
    where: { code: "WELCOME10" },
    update: {},
    create: {
      code: "WELCOME10",
      type: "PERCENTAGE",
      value: 10,
      minOrderAmount: 999,
      isActive: true,
    },
  });
  console.log("✓ Coupon WELCOME10 created (10% off, min ₹999)");

  console.log("\n✅ Seed complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
