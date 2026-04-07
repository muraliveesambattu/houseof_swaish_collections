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
  const coupons = await prisma.coupon.findMany({ orderBy: { validFrom: "desc" } });
  return NextResponse.json(coupons);
}

export async function POST(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const coupon = await prisma.coupon.create({
    data: {
      code: body.code.toUpperCase(),
      type: body.type,
      value: Number(body.value ?? 0),
      minOrderAmount: body.minOrderValue ? Number(body.minOrderValue) : null,
      usageLimit: body.usageLimit ? Number(body.usageLimit) : null,
      perUserLimit: body.perUserLimit ? Number(body.perUserLimit) : null,
      validUntil: body.validUntil ? new Date(body.validUntil) : null,
      isActive: true,
    },
  });
  return NextResponse.json(coupon, { status: 201 });
}
