import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { couponSchema } from "@/lib/validations";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, cartTotal } = couponSchema.parse(body);

    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!coupon || !coupon.isActive) {
      return NextResponse.json({ error: "Invalid coupon code" }, { status: 400 });
    }

    if (coupon.validUntil && new Date() > coupon.validUntil) {
      return NextResponse.json({ error: "Coupon has expired" }, { status: 400 });
    }

    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return NextResponse.json({ error: "Coupon usage limit reached" }, { status: 400 });
    }

    if (coupon.minOrderAmount && cartTotal < Number(coupon.minOrderAmount)) {
      return NextResponse.json({
        error: `Minimum order of ₹${coupon.minOrderAmount} required`,
      }, { status: 400 });
    }

    let discount = 0;
    if (coupon.type === "PERCENTAGE") {
      discount = (cartTotal * Number(coupon.value)) / 100;
      if (coupon.maxDiscount) {
        discount = Math.min(discount, Number(coupon.maxDiscount));
      }
    } else if (coupon.type === "FIXED") {
      discount = Math.min(Number(coupon.value), cartTotal);
    } else if (coupon.type === "FREE_SHIPPING") {
      discount = 0; // Handled at shipping calculation
    }

    return NextResponse.json({
      couponId: coupon.id,
      discount: Math.round(discount),
      type: coupon.type,
    });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
