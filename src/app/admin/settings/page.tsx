"use client";

import { useState } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function AdminSettingsPage() {
  const [form, setForm] = useState({
    storeName: "The Co-Ord Set Studio",
    storeEmail: "",
    whatsappNumber: "",
    freeShippingThreshold: "999",
    taxRate: "0",
    instagramHandle: "@thecoordsetstudio",
    returnDays: "7",
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    // In production, persist to DB / env
    await new Promise((r) => setTimeout(r, 600));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-2xl">
      <h1 className="font-heading text-3xl text-[#2C2C2A] mb-8">Settings</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-sm border border-gray-100 p-5 space-y-4">
          <h2 className="font-body font-semibold text-[#2C2C2A]">Store Info</h2>
          <Input
            label="Store Name"
            value={form.storeName}
            onChange={(e) => setForm((f) => ({ ...f, storeName: e.target.value }))}
          />
          <Input
            label="Store Email"
            type="email"
            value={form.storeEmail}
            onChange={(e) => setForm((f) => ({ ...f, storeEmail: e.target.value }))}
            placeholder="hello@thecoordsetstudio.com"
          />
          <Input
            label="Instagram Handle"
            value={form.instagramHandle}
            onChange={(e) => setForm((f) => ({ ...f, instagramHandle: e.target.value }))}
          />
        </div>

        <div className="bg-white rounded-sm border border-gray-100 p-5 space-y-4">
          <h2 className="font-body font-semibold text-[#2C2C2A]">Commerce</h2>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Free Shipping Threshold (₹)"
              type="number"
              value={form.freeShippingThreshold}
              onChange={(e) => setForm((f) => ({ ...f, freeShippingThreshold: e.target.value }))}
            />
            <Input
              label="Tax Rate (%)"
              type="number"
              value={form.taxRate}
              onChange={(e) => setForm((f) => ({ ...f, taxRate: e.target.value }))}
              helperText="0 = tax inclusive"
            />
          </div>
          <Input
            label="Return Window (days)"
            type="number"
            value={form.returnDays}
            onChange={(e) => setForm((f) => ({ ...f, returnDays: e.target.value }))}
          />
        </div>

        <div className="bg-white rounded-sm border border-gray-100 p-5 space-y-4">
          <h2 className="font-body font-semibold text-[#2C2C2A]">WhatsApp</h2>
          <Input
            label="WhatsApp Number (with country code)"
            value={form.whatsappNumber}
            onChange={(e) => setForm((f) => ({ ...f, whatsappNumber: e.target.value }))}
            placeholder="+919876543210"
          />
          <p className="text-xs font-body text-gray-400">
            Used for the WhatsApp widget and product inquiry buttons.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <Button type="submit" isLoading={saving}>
            Save Settings
          </Button>
          {saved && (
            <p className="text-sm font-body text-green-600">Settings saved!</p>
          )}
        </div>
      </form>
    </div>
  );
}
