import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FAF7F4] flex flex-col items-center justify-center px-4 text-center">
      <p className="font-heading text-[12rem] leading-none text-[#C9A6A6]/30 select-none">
        404
      </p>
      <h1 className="font-heading text-4xl text-[#2C2C2A] -mt-8 mb-4">
        Page Not Found
      </h1>
      <p className="font-body text-gray-500 mb-8 max-w-sm">
        The page you&apos;re looking for has moved, been removed, or never existed. Let&apos;s get you back on track.
      </p>
      <div className="flex gap-4">
        <Link
          href="/"
          className="px-6 py-3 bg-[#2C2C2A] text-white text-sm font-body font-medium tracking-wider uppercase hover:bg-[#3d3d3a] transition-colors"
        >
          Go Home
        </Link>
        <Link
          href="/collections"
          className="px-6 py-3 border border-[#2C2C2A] text-[#2C2C2A] text-sm font-body font-medium tracking-wider uppercase hover:bg-[#2C2C2A] hover:text-white transition-colors"
        >
          Shop Now
        </Link>
      </div>
    </div>
  );
}
