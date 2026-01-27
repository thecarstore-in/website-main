import { getFeaturedCars } from '@/lib/supabase';
import FeaturedCarsClient from './FeaturedCarsClient';

export default async function FeaturedCars() {
  const cars = await getFeaturedCars();

  if (cars.length === 0) {
    return null;
  }

  return <FeaturedCarsClient cars={cars} />;
}