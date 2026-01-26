import { getFeaturedCars } from '@/lib/supabase';
import CarCard from './CarCard';
import Link from 'next/link';
import { FaArrowRight } from 'react-icons/fa';

export default async function FeaturedCars() {
  const cars = await getFeaturedCars();

  if (cars.length === 0) {
    return null;
  }

  return (
    <section id="featured" className="px-6 py-16 md:py-20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Featured Vehicles
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Handpicked premium vehicles from our exclusive collection
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {cars.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>

        {/* View More Button */}
        <div className="flex justify-center">
          <Link
            href="/inventory"
            className="bg-white group inline-flex items-center justify-center gap-3 border-2 border-black text-black px-8 py-4 text-base font-bold tracking-wide hover:bg-white-80 hover:text-black/80 hover:rounded-2xl transition-all"
          >
            View All Inventory
            <FaArrowRight className="group-hover:translate-x-1 transition-transform" size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}