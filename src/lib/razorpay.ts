import Razorpay from "razorpay";
import crypto from "crypto";

function getRequiredEnv(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function getRazorpayClient() {
  return new Razorpay({
    key_id: getRequiredEnv("RAZORPAY_KEY_ID"),
    key_secret: getRequiredEnv("RAZORPAY_KEY_SECRET"),
  });
}

export function verifyRazorpaySignature(
  orderId: string,
  paymentId: string,
  signature: string
): boolean {
  const body = `${orderId}|${paymentId}`;
  const expectedSignature = crypto
    .createHmac("sha256", getRequiredEnv("RAZORPAY_KEY_SECRET"))
    .update(body)
    .digest("hex");
  return expectedSignature === signature;
}

export function verifyWebhookSignature(
  body: string,
  signature: string
): boolean {
  const expectedSignature = crypto
    .createHmac("sha256", getRequiredEnv("RAZORPAY_WEBHOOK_SECRET"))
    .update(body)
    .digest("hex");
  return expectedSignature === signature;
}

export async function createRazorpayOrder(
  amount: number,
  currency = "INR",
  receipt: string
) {
  const order = await getRazorpayClient().orders.create({
    amount: Math.round(amount * 100), // paise
    currency,
    receipt,
  });
  return order;
}
