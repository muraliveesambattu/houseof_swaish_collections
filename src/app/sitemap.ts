import type { MetadataRoute } from "next";

// Sitemap is dynamic since it queries the DB
export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://thecoordsetstudio.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await prisma.product
    .findMany({
      where: { isActive: true },
      select: { slug: true, updatedAt: true },
    })
    .catch(() => []);

  const categories = await prisma.category
    .findMany({ select: { slug: true } })
    .catch(() => []);

  const staticPages = [
    "",
    "/collections",
    "/about",
    "/contact",
    "/size-guide",
    "/shipping-policy",
    "/return-policy",
    "/privacy-policy",
    "/terms",
  ].map((path) => ({
    url: `${BASE}${path}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: path === "" ? 1 : 0.7,
  }));

  const productPages = products.map((p) => ({
    url: `${BASE}/products/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const categoryPages = categories.map((c) => ({
    url: `${BASE}/collections/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...productPages, ...categoryPages];
}
