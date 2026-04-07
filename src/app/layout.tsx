import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "The Co-Ord Set Studio — Indian Women's Fashion",
    template: "%s | The Co-Ord Set Studio",
  },
  description:
    "Shop premium co-ord sets, kurti sets and dresses for Indian women. Festive, occasion and everyday fashion — modern, chic and confident.",
  keywords: [
    "co-ord sets",
    "kurti sets",
    "Indian women fashion",
    "festive wear",
    "occasion wear",
    "dresses",
  ],
  authors: [{ name: "The Co-Ord Set Studio" }],
  creator: "The Co-Ord Set Studio",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: process.env.NEXT_PUBLIC_SITE_URL,
    siteName: "The Co-Ord Set Studio",
    title: "The Co-Ord Set Studio — Indian Women's Fashion",
    description:
      "Shop premium co-ord sets, kurti sets and dresses for Indian women.",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Co-Ord Set Studio",
    description: "Premium Indian women's fashion — co-ord sets, kurti sets, dresses.",
  },
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    apple: "/icons/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${dmSans.variable} h-full`}
    >
      <body className="min-h-full flex flex-col bg-[#FAF7F4] text-[#2C2C2A] font-body antialiased">
        <a href="#main-content" className="skip-to-content">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
