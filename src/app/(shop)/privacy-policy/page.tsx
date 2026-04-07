import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — The Co-Ord Set Studio",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-[#FAF7F4] min-h-screen">
      <div className="max-w-3xl mx-auto px-4 py-20">
        <h1 className="font-heading text-5xl text-[#2C2C2A] mb-2">Privacy Policy</h1>
        <p className="font-body text-sm text-gray-400 mb-12">Last updated: April 2026</p>

        <div className="font-body text-gray-600 space-y-8 text-sm leading-relaxed">
          {[
            {
              title: "Information We Collect",
              body: "We collect information you provide when creating an account, placing an order, or contacting us — including name, email address, phone number, and delivery address. We also automatically collect device, browser, and usage data when you visit our website.",
            },
            {
              title: "How We Use Your Information",
              body: "We use your information to process and fulfil orders, send order updates and shipping notifications, personalise your shopping experience, send promotional emails (with your consent), and improve our website and services.",
            },
            {
              title: "Sharing Your Information",
              body: "We do not sell your personal data. We share your information only with trusted service providers required to operate our business — payment processors (Razorpay), courier partners (Delhivery, Bluedart), and email providers (Resend) — under strict confidentiality agreements.",
            },
            {
              title: "Cookies",
              body: "We use cookies to maintain your session, remember your cart, and analyse website traffic via privacy-friendly analytics. You can disable cookies in your browser settings, though this may affect site functionality.",
            },
            {
              title: "Data Security",
              body: "We implement industry-standard security measures including HTTPS encryption, hashed passwords, and access controls. Payment information is handled entirely by Razorpay and is never stored on our servers.",
            },
            {
              title: "Your Rights",
              body: "You have the right to access, correct, or delete your personal data. To exercise these rights, email us at privacy@thecoordsetstudio.com or WhatsApp us. We will respond within 7 business days.",
            },
            {
              title: "Changes to This Policy",
              body: "We may update this policy from time to time. Material changes will be notified via email or a prominent notice on our website.",
            },
          ].map((section) => (
            <section key={section.title}>
              <h2 className="font-heading text-2xl text-[#2C2C2A] mb-3">{section.title}</h2>
              <p>{section.body}</p>
            </section>
          ))}

          <section>
            <h2 className="font-heading text-2xl text-[#2C2C2A] mb-3">Contact</h2>
            <p>
              For privacy-related enquiries, contact us at{" "}
              <a href="mailto:privacy@thecoordsetstudio.com" className="text-[#BA7517] underline">
                privacy@thecoordsetstudio.com
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
