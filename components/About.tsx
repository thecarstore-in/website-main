import Image from 'next/image';

const IMAGE_BASE =
  'https://cdn.jsdelivr.net/gh/thecarstore-in/cars/about/';

export default function About() {
  return (
    <section id="about" className="py-32 bg-black text-gray-100">
      <div className="max-w-7xl mx-auto px-6">

        {/* Intro */}
        <div className="mb-32">
          <h2 className="text-2xl md:text-4xl font-bold tracking-tight mb-10 text-center">
            About Us
          </h2>

          <p className="text-gray-400 leading-relaxed text-lg text-justify max-w-7xl mx-auto">
            The Car Store is a curated marketplace for premium pre-owned vehicles,
            created for buyers who value quality, transparency, and peace of mind.
            We believe purchasing a used car should feel just as refined and
            reassuring as buying a new one — without the confusion, pressure, or
            uncertainty that often comes with the process. Every vehicle listed
            on our platform is carefully evaluated, accurately presented, and
            fairly priced based on real market conditions.
            <br /><br />
            Our approach is simple: clarity over complexity, trust over tactics,
            and long-term relationships over quick transactions. From detailed
            vehicle information and honest condition disclosures to a calm,
            no-pressure browsing experience, we are committed to helping you make
            confident decisions at your own pace. The Car Store exists to set a
            higher standard in the pre-owned car market — where integrity,
            professionalism, and respect for the buyer come first.
          </p>
        </div>

        {/* Section 1 */}
        <div className="grid md:grid-cols-2 gap-16 items-center mb-32">
          <div className="relative h-[420px] mx-auto md:mx-0 w-full">
            <Image
              src={`${IMAGE_BASE}showroom.webp`}
              alt="Premium showroom"
              fill
              className="object-cover rounded-2xl"
            />
          </div>

          <div className="max-w-lg mx-auto text-center md:text-left">
            <h2 className="text-3xl font-bold mb-4">
              Carefully selected vehicles
            </h2>
            <p className="text-gray-400 leading-relaxed text-justify">
              Every vehicle listed on The Car Store is thoughtfully selected and
              reviewed to ensure accurate details, fair market pricing, and full
              transparency. What you see is what you get — no hidden compromises,
              no misleading descriptions, and no last-minute surprises.
            </p>
          </div>
        </div>

        {/* Section 2 */}
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="max-w-lg order-2 md:order-1 mx-auto text-center md:text-left">
            <h2 className="text-3xl font-bold mb-4">
              Built on trust, not pressure
            </h2>
            <p className="text-gray-400 leading-relaxed text-justify">
              We believe buying a pre-owned car should be calm, informed, and
              respectful. There are no aggressive sales tactics and no unnecessary
              middlemen — only clear information, honest listings, and the freedom
              to choose what feels right for you, without urgency or pressure.
            </p>
          </div>

          <div className="relative h-[420px] order-1 md:order-2 mx-auto md:mx-0 w-full">
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
