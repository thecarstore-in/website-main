import Link from 'next/link';
import { getAvailableCars } from '@/lib/supabase';
import CarGrid from './CarGrid';
import { CarFilters } from '@/lib/types';
import { FaArrowRight } from 'react-icons/fa';
interface AvailableCarsProps {
  filters?: CarFilters;
}

export default async function AvailableCars({ filters }: AvailableCarsProps) {
  const cars = await getAvailableCars(filters);
  const displayedCars = cars.slice(0, 3);

  return (
    <section id="inventory" className="px-6 py-16 md:py-20 bg-gray-50 text-black">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-12 text-center">
          All Available Cars
        </h2>

        <CarGrid cars={displayedCars} />

        <div className="mt-12 text-center">
          <Link 
            href="/inventory"
           className="bg-white group inline-flex items-center justify-center gap-3 border-2 border-black text-black px-8 py-4 text-base font-bold tracking-wide hover:bg-white-80 hover:text-black/80 hover:rounded-2xl transition-all"
          >
            View All
            <FaArrowRight className="group-hover:translate-x-1 transition-transform" size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}