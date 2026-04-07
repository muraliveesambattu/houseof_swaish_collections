import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyRazorpaySignature } from "@/lib/razorpay";
import { resend, FROM_EMAIL } from "@/lib/resend";

export async function POST(request: NextRequest) {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, orderId } =
      await request.json();

    // Verify signature
    const isValid = verifyRazorpaySignature(
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature
    );

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid payment signature" },
        { status: 400 }
      );
    }

    // Update order to PAID
    const order = await prisma.order.update({
      where: { id: orderId },
      data: {
        paymentStatus: "PAID",
        status: "CONFIRMED",
        razorpayPaymentId,
        razorpaySignature,
      },
      include: {
        items: true,
        user: { select: { email: true, name: true } },
        shippingAddress: true,
      },
    });

    // Decrement stock
    for (const item of order.items) {
      if (item.variantId) {
        await prisma.productVariant.update({
          where: { id: item.variantId },
          data: { stock: { decrement: item.quantity } },
        });
      }
    }

    // Send confirmation email
    const emailTo = order.user?.email ?? order.guestEmail;
    if (emailTo) {
      await resend.emails.send({
        from: FROM_EMAIL,
        to: emailTo,
        subject: `Order Confirmed — ${order.orderNumber}`,
        html: `
          <h2>Thank you for your order!</h2>
          <p>Hi ${order.user?.name ?? "there"},</p>
          <p>Your order <strong>${order.orderNumber}</strong> has been confirmed.</p>
          <p>Total: ₹${order.total}</p>
          <p>We'll send you a shipping update soon.</p>
          <p>— The Co-Ord Set Studio</p>
        `,
      }).catch(console.error);
    }

    return NextResponse.json({ success: true, orderNumber: order.orderNumber });
  } catch (error) {
    console.error("Payment verify error:", error);
    return NextResponse.json({ error: "Failed to verify payment" }, { status: 500 });
  }
}
