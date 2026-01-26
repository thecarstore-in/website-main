import { notFound } from 'next/navigation';
import CarGrid from '@/components/CarGrid';
import { getAvailableCars } from '@/lib/supabase';

const BRAND_MAP: Record<string, string> = {
  'maruti-suzuki': 'Maruti Suzuki',
  hyundai: 'Hyundai',
  honda: 'Honda',
  tata: 'Tata',
  mahindra: 'Mahindra',
  toyota: 'Toyota',
  kia: 'Kia',
  volkswagen: 'Volkswagen',
  skoda: 'Skoda',
  mg: 'MG',
};

export default async function BrandPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const brand = BRAND_MAP[slug];

  if (!brand) notFound();

  const cars = await getAvailableCars({ brand });

  return (
    <main className="min-h-screen px-6 py-24 bg-white text-black">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mb-12">
          {brand} Cars
        </h1>

        <CarGrid cars={cars} />
      </div>
    </main>
  );
}