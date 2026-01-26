import CarCard from './CarCard';
import { Car } from '@/lib/types';

interface CarGridProps {
  cars: Car[];
}

export default function CarGrid({ cars }: CarGridProps) {
  if (!cars.length) {
    return (
      <div className="text-center py-20 text-neutral-500">
        <p>No cars available.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {cars.map((car) => (
        <CarCard key={car.id} car={car} />
      ))}
    </div>
  );
}
