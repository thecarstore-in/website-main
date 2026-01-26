import Image from 'next/image';
import Link from 'next/link';

const TYPES = [
  { name: 'Hatchback', slug: 'hatchback', image: 'hatchback.webp' },
  { name: 'Sedan', slug: 'sedan', image: 'sedan.webp' },
  { name: 'SUV', slug: 'suv', image: 'suv.webp' },
  { name: 'MUV', slug: 'muv', image: 'muv.webp' },
  { name: 'Luxury', slug: 'luxury', image: 'luxury.webp' },
];

const IMAGE_BASE =
  'https://cdn.jsdelivr.net/gh/thecarstore-in/cars/types/';

export default function BrowseByCarType() {
  return (
    <section id="types" className="px-6 py-28 bg-white text-black">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-12 text-center">
          Browse by Body Type
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 ">
          {TYPES.map((type) => (
            <Link
              key={type.slug}
              href={`/type/${type.slug}`}
              className="group relative h-[320px] overflow-hidden rounded-2xl"
            >
              <Image
                src={`${IMAGE_BASE}${type.image}`}
                alt={type.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/30" />

              {/* Label */}
              <div className="absolute inset-0 flex items-end p-6">
                <span className="text-sm uppercase tracking-widest text-gray-100">
                  {type.name}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
