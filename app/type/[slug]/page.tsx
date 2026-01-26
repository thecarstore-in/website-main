import { notFound } from 'next/navigation';
import { getAvailableCars } from '@/lib/supabase';
import CarGrid from '@/components/CarGrid';

const TYPE_MAP: Record<string, string> = {
  hatchback: 'Hatchback',
  sedan: 'Sedan',
  suv: 'SUV',
  muv: 'MUV',
  luxury: 'Luxury',
};

export default async function TypePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const carType = TYPE_MAP[slug];

  if (!carType) notFound();

  const cars = await getAvailableCars({ carType });

  return (
    <main className="min-h-screen px-6 py-24 bg-white text-black">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mb-12">
          {carType} Cars
        </h1>

        <CarGrid cars={cars} />
      </div>
    </main>
  );
}