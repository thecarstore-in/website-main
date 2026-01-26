import { getAvailableCars } from '@/lib/supabase';
import CarGrid from './CarGrid';
import { CarFilters } from '@/lib/types';

interface AvailableCarsProps {
  filters?: CarFilters;
}

export default async function AvailableCars({ filters }: AvailableCarsProps) {
  const cars = await getAvailableCars(filters);

  return (
    <section id="inventory" className="px-6 py-16 md:py-20 bg-gray-50 text-black">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-12 text-center">
          All Available Cars
        </h2>

        <CarGrid cars={cars} />
      </div>
    </section>
  );
}
