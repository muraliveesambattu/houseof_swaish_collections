import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { createRazorpayOrder } from "@/lib/razorpay";
import { generateOrderNumber } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    const body = await request.json();

    const {
      items,          // [{ productId, variantId, name, image, price, quantity, size, color }]
      addressId,
      guestEmail,
      couponId,
      subtotal,
      discount,
      shippingCost,
      total,
      paymentMethod,  // RAZORPAY | COD
    } = body;

    if (!items?.length || total === undefined) {
      return NextResponse.json({ error: "Invalid order data" }, { status: 400 });
    }

    const orderNumber = generateOrderNumber();

    // Create Razorpay order if not COD
    let razorpayOrderId: string | undefined;
    if (paymentMethod !== "COD") {
      const rpOrder = await createRazorpayOrder(total, "INR", orderNumber);
      razorpayOrderId = rpOrder.id;
    }

    // Create order in DB
    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: session?.user.id ?? null,
        guestEmail: guestEmail ?? null,
        status: paymentMethod === "COD" ? "CONFIRMED" : "PENDING",
        paymentStatus: paymentMethod === "COD" ? "PENDING" : "PENDING",
        paymentMethod: paymentMethod === "COD" ? "COD" : "RAZORPAY",
        razorpayOrderId: razorpayOrderId ?? null,
        subtotal,
        discount: discount ?? 0,
        shippingCost: shippingCost ?? 0,
        total,
        couponId: couponId ?? null,
        shippingAddressId: addressId ?? null,
        items: {
          create: items.map((item: {
            productId: string;
            variantId?: string;
            name: string;
            image: string;
            size?: string;
            color?: string;
            price: number;
            quantity: number;
          }) => ({
            productId: item.productId,
            variantId: item.variantId ?? null,
            name: item.name,
            image: item.image,
            size: item.size ?? null,
            color: item.color ?? null,
            price: item.price,
            quantity: item.quantity,
          })),
        },
      },
    });

    return NextResponse.json({
      orderId: order.id,
      orderNumber: order.orderNumber,
      razorpayOrderId,
      total,
    });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
