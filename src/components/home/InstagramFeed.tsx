import Image from "next/image";

const posts = [
  { id: 1, image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&q=80" },
  { id: 2, image: "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=400&q=80" },
  { id: 3, image: "https://images.unsplash.com/photo-1572804013427-4d7ca7268217?w=400&q=80" },
  { id: 4, image: "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=400&q=80" },
  { id: 5, image: "https://images.unsplash.com/photo-1508629385573-6bedb71d27f4?w=400&q=80" },
  { id: 6, image: "https://images.unsplash.com/photo-1607006344380-b6775a0824a7?w=400&q=80" },
];

export default function InstagramFeed() {
  return (
    <section className="py-12 px-4 sm:px-6 max-w-7xl mx-auto">
      <div className="text-center mb-8">
        <p className="font-body text-xs tracking-widest uppercase text-[#BA7517] mb-2">
          Follow us
        </p>
        <h2 className="font-heading text-3xl md:text-4xl text-[#2C2C2A]">
          @thecoordsetstudio
        </h2>
      </div>

      <div className="grid grid-cols-3 md:grid-cols-6 gap-2 md:gap-3">
        {posts.map((post) => (
          <a
            key={post.id}
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative aspect-square overflow-hidden rounded-sm block"
          >
            <Image
              src={post.image}
              alt="Instagram post"
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 33vw, 16vw"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 flex items-center justify-center">
              <svg
                viewBox="0 0 24 24"
                className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity fill-current"
              >
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
