import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function requireAdmin() {
  const session = await auth();
  if (!session || !["ADMIN", "MANAGER"].includes(session.user.role)) return null;
  return session;
}

export async function GET() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const variants = await prisma.productVariant.findMany({
    select: {
      id: true,
      size: true,
      color: true,
      sku: true,
      stock: true,
      product: { select: { name: true } },
    },
    orderBy: [{ product: { name: "asc" } }, { size: "asc" }],
  });

  return NextResponse.json(
    variants.map((v) => ({
      id: v.id,
      productName: v.product.name,
      size: v.size,
      color: v.color,
      sku: v.sku,
      stock: v.stock,
    }))
  );
}

export async function PATCH(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const { variantId, productId, size, color, stock } = body;

  if (variantId) {
    const variant = await prisma.productVariant.update({
      where: { id: variantId },
      data: { stock: Number(stock) },
    });
    return NextResponse.json(variant);
  }

  // Upsert by productId + size + color
  const existing = await prisma.productVariant.findFirst({
    where: { productId, size, color: color || null },
  });

  if (existing) {
    const updated = await prisma.productVariant.update({
      where: { id: existing.id },
      data: { stock: Number(stock) },
    });
    return NextResponse.json(updated);
  }

  const created = await prisma.productVariant.create({
    data: {
      productId,
      size,
      color: color || null,
      stock: Number(stock),
    },
  });
  return NextResponse.json(created);
}
