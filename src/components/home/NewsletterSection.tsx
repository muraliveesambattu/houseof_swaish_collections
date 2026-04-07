"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <section className="py-16 px-4 sm:px-6 bg-[#C9A6A6]/10">
      <div className="max-w-xl mx-auto text-center">
        <p className="font-body text-xs tracking-widest uppercase text-[#BA7517] mb-3">
          Stay in the Loop
        </p>
        <h2 className="font-heading text-3xl md:text-4xl text-[#2C2C2A] mb-3">
          Get 10% Off Your First Order
        </h2>
        <p className="font-body text-gray-500 text-sm mb-8">
          Subscribe to our newsletter for new arrivals, exclusive offers, and style inspiration.
        </p>

        {status === "success" ? (
          <p className="font-body text-green-600 font-medium">
            🎉 You&apos;re subscribed! Check your inbox for your discount code.
          </p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-3"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
              className="flex-1 px-4 py-3 text-sm bg-white border border-gray-200 rounded-sm text-[#2C2C2A] placeholder-gray-400 focus:outline-none focus:border-[#C9A6A6]"
              aria-label="Email address"
            />
            <Button
              type="submit"
              variant="primary"
              isLoading={status === "loading"}
              className="whitespace-nowrap tracking-wider uppercase text-xs"
            >
              Subscribe
            </Button>
          </form>
        )}

        {status === "error" && (
          <p className="text-red-500 text-xs font-body mt-2">
            Something went wrong. Please try again.
          </p>
        )}

        <p className="text-xs text-gray-400 font-body mt-4">
          No spam, ever. Unsubscribe anytime.
        </p>
      </div>
    </section>
  );
}
