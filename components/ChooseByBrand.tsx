import Image from 'next/image';
import Link from 'next/link';

const BRANDS = [
  { name: 'Maruti Suzuki', slug: 'maruti-suzuki', logo: 'suzuki.webp' },
  { name: 'Hyundai', slug: 'hyundai', logo: 'hyundai.webp' },
  { name: 'Honda', slug: 'honda', logo: 'honda.webp' },
  { name: 'Tata', slug: 'tata', logo: 'tata.webp' },
  { name: 'Mahindra', slug: 'mahindra', logo: 'mahindra.webp' },
  { name: 'Toyota', slug: 'toyota', logo: 'toyota.webp' },
  { name: 'Kia', slug: 'kia', logo: 'kia.webp' },
  { name: 'Volkswagen', slug: 'volkswagen', logo: 'volkswagen.webp' },
  { name: 'Skoda', slug: 'skoda', logo: 'skoda.webp' },
  { name: 'MG', slug: 'mg', logo: 'mg.webp' },
];

const LOGO_BASE =
  'https://cdn.jsdelivr.net/gh/thecarstore-in/cars/brands/';

export default function BrowseByBrand() {
  return (
    <section id='brands' className="px-6 py-28 bg-white text-black">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-12 text-center">
          Browse by Brand
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-y-20 place-items-center">
          {BRANDS.map((brand) => (
            <Link
              key={brand.slug}
              href={`/brand/${brand.slug}`}
              className="group flex flex-col items-center gap-6"
            >
              <Image
                src={`${LOGO_BASE}${brand.logo}`}
                alt={brand.name}
                width={56}
                height={56}
                className="opacity-70 group-hover:opacity-100 transition-opacity"
              />

              <span className="text-xs uppercase tracking-widest text-neutral-500 group-hover:text-black transition-colors">
                {brand.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
