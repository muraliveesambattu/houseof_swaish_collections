import type { Metadata } from "next";
import { Mail, MessageCircle, Clock, MapPin } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us — The Co-Ord Set Studio",
  description: "Get in touch with us via WhatsApp, email, or our contact form.",
};

export default function ContactPage() {
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "+919876543210";
  const waLink = `https://wa.me/${whatsapp.replace(/\D/g, "")}?text=Hi!%20I%20have%20a%20question%20about%20my%20order.`;

  return (
    <div className="bg-[#FAF7F4] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <p className="font-body text-sm tracking-[0.2em] uppercase text-[#C9A6A6] mb-3">
            We&apos;re here for you
          </p>
          <h1 className="font-heading text-5xl text-[#2C2C2A]">Contact Us</h1>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Info */}
          <div className="space-y-8">
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-4 group"
            >
              <div className="w-12 h-12 rounded-sm bg-green-50 flex items-center justify-center flex-shrink-0 group-hover:bg-green-100 transition-colors">
                <MessageCircle size={20} className="text-green-600" />
              </div>
              <div>
                <p className="font-body font-semibold text-[#2C2C2A] group-hover:text-green-600 transition-colors">
                  WhatsApp (fastest)
                </p>
                <p className="font-body text-sm text-gray-500 mt-0.5">
                  {whatsapp}
                </p>
                <p className="font-body text-xs text-gray-400 mt-1">
                  Typically replies within 30 minutes
                </p>
              </div>
            </a>

            <a
              href="mailto:hello@thecoordsetstudio.com"
              className="flex items-start gap-4 group"
            >
              <div className="w-12 h-12 rounded-sm bg-[#FAF7F4] border border-gray-100 flex items-center justify-center flex-shrink-0 group-hover:border-[#C9A6A6] transition-colors">
                <Mail size={20} className="text-[#2C2C2A]" />
              </div>
              <div>
                <p className="font-body font-semibold text-[#2C2C2A]">Email</p>
                <p className="font-body text-sm text-gray-500 mt-0.5">
                  hello@thecoordsetstudio.com
                </p>
                <p className="font-body text-xs text-gray-400 mt-1">
                  We reply within 24 hours on business days
                </p>
              </div>
            </a>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-sm bg-[#FAF7F4] border border-gray-100 flex items-center justify-center flex-shrink-0">
                <Clock size={20} className="text-[#2C2C2A]" />
              </div>
              <div>
                <p className="font-body font-semibold text-[#2C2C2A]">Hours</p>
                <p className="font-body text-sm text-gray-500 mt-0.5">
                  Mon – Sat: 10am – 7pm IST
                </p>
                <p className="font-body text-xs text-gray-400 mt-1">
                  Closed on Sundays and national holidays
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-sm bg-[#FAF7F4] border border-gray-100 flex items-center justify-center flex-shrink-0">
                <MapPin size={20} className="text-[#2C2C2A]" />
              </div>
              <div>
                <p className="font-body font-semibold text-[#2C2C2A]">Registered Office</p>
                <p className="font-body text-sm text-gray-500 mt-0.5">
                  Jaipur, Rajasthan — 302001
                </p>
                <p className="font-body text-xs text-gray-400 mt-1">
                  Dispatch from Jaipur & Surat
                </p>
              </div>
            </div>
          </div>

          {/* Contact form */}
          <div className="bg-white rounded-sm border border-gray-100 p-6">
            <h2 className="font-heading text-2xl text-[#2C2C2A] mb-5">Send a Message</h2>
            <form className="space-y-4" action="/api/contact" method="POST">
              <div>
                <label className="text-sm font-medium text-[#2C2C2A] block mb-1">Name</label>
                <input
                  name="name"
                  required
                  className="w-full px-4 py-3 text-sm bg-white border border-gray-200 rounded-sm focus:outline-none focus:border-[#C9A6A6] font-body"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-[#2C2C2A] block mb-1">Email</label>
                <input
                  name="email"
                  type="email"
                  required
                  className="w-full px-4 py-3 text-sm bg-white border border-gray-200 rounded-sm focus:outline-none focus:border-[#C9A6A6] font-body"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-[#2C2C2A] block mb-1">Subject</label>
                <select
                  name="subject"
                  className="w-full px-4 py-3 text-sm bg-white border border-gray-200 rounded-sm focus:outline-none focus:border-[#C9A6A6] font-body"
                >
                  <option>Order Enquiry</option>
                  <option>Return / Exchange</option>
                  <option>Size Assistance</option>
                  <option>Product Question</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-[#2C2C2A] block mb-1">Message</label>
                <textarea
                  name="message"
                  rows={4}
                  required
                  className="w-full px-4 py-3 text-sm bg-white border border-gray-200 rounded-sm resize-none focus:outline-none focus:border-[#C9A6A6] font-body"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-[#2C2C2A] text-white text-sm font-body font-medium tracking-wider uppercase hover:bg-[#3d3d3a] transition-colors"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
