import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { reviewSchema } from "@/lib/validations";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const data = reviewSchema.parse(body);

    const review = await prisma.review.upsert({
      where: {
        productId_userId: {
          productId: data.productId,
          userId: session.user.id,
        },
      },
      update: {
        rating: data.rating,
        title: data.title ?? null,
        body: data.body ?? null,
      },
      create: {
        productId: data.productId,
        userId: session.user.id,
        rating: data.rating,
        title: data.title ?? null,
        body: data.body ?? null,
      },
    });

    return NextResponse.json(review);
  } catch {
    return NextResponse.json({ error: "Failed to submit review" }, { status: 500 });
  }
}
