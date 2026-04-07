import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { cookies } from "next/headers";

async function getOrCreateCart(userId?: string, sessionId?: string) {
  if (userId) {
    return await prisma.cart.upsert({
      where: { userId },
      update: {},
      create: { userId },
      include: { items: { include: { product: true, variant: true } } },
    });
  }

  if (sessionId) {
    return await prisma.cart.upsert({
      where: { sessionId },
      update: {},
      create: { sessionId },
      include: { items: { include: { product: true, variant: true } } },
    });
  }

  return null;
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("cart_session")?.value;

    const cart = await getOrCreateCart(
      session?.user.id,
      sessionId
    );

    return NextResponse.json(cart ?? { items: [] });
  } catch {
    return NextResponse.json({ items: [] });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    const cookieStore = await cookies();
    let sessionId = cookieStore.get("cart_session")?.value;

    const body = await request.json();
    const { productId, variantId, quantity = 1 } = body;

    if (!productId) {
      return NextResponse.json({ error: "Product ID required" }, { status: 400 });
    }

    // Create session ID for guests
    if (!session?.user.id && !sessionId) {
      sessionId = crypto.randomUUID();
    }

    const cart = await getOrCreateCart(session?.user.id, sessionId);
    if (!cart) return NextResponse.json({ error: "Failed to get cart" }, { status: 500 });

    // Upsert cart item
    const existingItem = cart.items.find(
      (i) => i.productId === productId && i.variantId === (variantId ?? null)
    );

    if (existingItem) {
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          variantId: variantId ?? null,
          quantity,
        },
      });
    }

    const response = NextResponse.json({ success: true });
    if (sessionId && !session?.user.id) {
      response.cookies.set("cart_session", sessionId, {
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 30, // 30 days
        sameSite: "lax",
      });
    }
    return response;
  } catch {
    return NextResponse.json({ error: "Failed to add to cart" }, { status: 500 });
  }
}
