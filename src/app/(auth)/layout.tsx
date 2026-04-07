import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#FAF7F4] flex flex-col items-center justify-center px-4">
      <Link
        href="/"
        className="font-heading text-2xl tracking-[0.15em] uppercase text-[#2C2C2A] mb-8"
      >
        The Co-Ord Set Studio
      </Link>
      <div className="w-full max-w-md bg-white rounded-sm shadow-card p-8">
        {children}
      </div>
    </div>
  );
}
