import Link from "next/link";
import Image from "next/image";

const categories = [
  {
    name: "Co-Ord Sets",
    slug: "co-ord-sets",
    image: "https://images.unsplash.com/photo-1607006344380-b6775a0824a7?w=600&q=80",
  },
  {
    name: "Kurti Sets",
    slug: "kurti-sets",
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4b4a8e?w=600&q=80",
  },
  {
    name: "Dresses",
    slug: "dresses",
    image: "https://images.unsplash.com/photo-1572804013427-4d7ca7268217?w=600&q=80",
  },
  {
    name: "New Arrivals",
    slug: "new-arrivals",
    image: "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=600&q=80",
  },
];

export default function CategoryStrip() {
  return (
    <section className="py-12 px-4 sm:px-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            href={`/collections/${cat.slug}`}
            className="group relative overflow-hidden rounded-sm aspect-[3/4] block"
          >
            <Image
              src={cat.image}
              alt={cat.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-106"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h3 className="font-heading text-white text-xl md:text-2xl leading-tight">
                {cat.name}
              </h3>
              <span className="text-white/80 text-xs font-body mt-1 inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                Shop Now →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
