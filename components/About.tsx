import Image from 'next/image';

const IMAGE_BASE =
  'https://cdn.jsdelivr.net/gh/thecarstore-in/cars/about/';

export default function About() {
  return (
    <section id="about" className="py-32 bg-black text-gray-100">
      <div className="max-w-7xl mx-auto px-6">

        {/* Intro */}
        <div className="max-w-3xl mb-24">
          <h2 className="text-2xl md:text-4xl font-bold tracking-tight mb-6">
            About Us
          </h2>

          <p className="text-gray-400 leading-relaxed text-lg">
           The Car Store is a curated marketplace for premium pre-owned vehicles, built for buyers who value quality, transparency, and peace of mind. Every vehicle listed is carefully selected, fairly priced, and presented with complete clarity — so you can make confident decisions without pressure or uncertainty. Our focus is on delivering a refined buying experience that respects your time, your trust, and your expectations.
          </p>
        </div>

        {/* Section 1 */}
        <div className="grid md:grid-cols-2 gap-16 items-center mb-32">
          <div className="relative h-[420px]">
            <Image
              src={`${IMAGE_BASE}showroom.webp`}
              alt="Premium showroom"
              fill
              className="object-cover rounded-2xl"
            />
          </div>

          <div className="max-w-lg">
            <h2 className="text-3xl font-bold mb-4">
              Carefully selected vehicles
            </h2>
            <p className="text-gray-400 leading-relaxed">
             Every vehicle listed on The Car Store is carefully selected and reviewed to ensure accurate information, fair market pricing, and complete transparency — so you know exactly what to expect, with no hidden surprises or last-minute compromises.
            </p>
          </div>
        </div>

        {/* Section 2 */}
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="max-w-lg order-2 md:order-1">
            <h2 className="text-3xl font-bold mb-4">
              Built on trust, not pressure
            </h2>
            <p className="text-gray-400 leading-relaxed">
              We believe buying a pre-owned car should be a calm and informed experience. There are no aggressive sales tactics and no unnecessary middlemen — only clear details, honest listings, and the space to decide at your own pace, with complete confidence.
            </p>
          </div>

          <div className="relative h-[420px] order-1 md:order-2">
            <Image
              src={`${IMAGE_BASE}inspection.webp`}
              alt="Vehicle inspection"
              fill
              className="object-cover rounded-2xl"
            />
          </div>
        </div>

      </div>
    </section>
  );
}