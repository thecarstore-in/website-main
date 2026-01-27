import 'server-only';
import { createClient } from '@supabase/supabase-js';
import { unstable_cache } from 'next/cache';
import { Car, CarFilters } from './types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// READ-ONLY client (RLS protected)
const supabase = createClient(supabaseUrl, anonKey);

// Fetch single car (no cache - for dynamic car detail pages)
export async function getCarById(id: string): Promise<Car | null> {
  const { data, error } = await supabase
    .from('cars')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return null;
  return data as Car;
}

// Featured cars with caching
export const getFeaturedCars = unstable_cache(
  async (): Promise<Car[]> => {
    const { data } = await supabase
      .from('cars')
      .select('*')
      .eq('is_featured', true)
      .eq('is_sold', false)
      .order('created_at', { ascending: false })
      .limit(6);

    return (data ?? []) as Car[];
  },
  ['featured-cars'],
  {
    revalidate: 3600, // Cache for 1 hour
    tags: ['featured-cars'],
  }
);

// Available cars with caching (note: filters affect cache key)
export async function getAvailableCars(
  filters?: CarFilters
): Promise<Car[]> {
  // Create a cache key based on filters
  const cacheKey = filters?.brand || filters?.carType 
    ? `available-cars-${filters.brand || 'all'}-${filters.carType || 'all'}`
    : 'available-cars';

  return unstable_cache(
    async () => {
      let query = supabase
        .from('cars')
        .select('*')
        .eq('is_sold', false)
        .order('created_at', { ascending: false });

      // Case-insensitive brand match (handles TOYOTA / toyota / Toyota)
      if (filters?.brand) {
        query = query.ilike('brand', filters.brand);
      }

      // Case-insensitive car type match (SUV / suv / Suv)
      if (filters?.carType) {
        query = query.ilike('car_type', filters.carType);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching available cars:', error);
        return [];
      }

      return (data ?? []) as Car[];
    },
    [cacheKey],
    {
      revalidate: 3600,
      tags: ['available-cars'],
    }
  )();
}

// Sold cars with caching
export const getSoldCars = unstable_cache(
  async (): Promise<Car[]> => {
    const { data } = await supabase
      .from('cars')
      .select('*')
      .eq('is_sold', true)
      .order('created_at', { ascending: false });

    return (data ?? []) as Car[];
  },
  ['sold-cars'],
  {
    revalidate: 3600,
    tags: ['sold-cars'],
  }
);

// Unique brands with caching
export const getBrands = unstable_cache(
  async (): Promise<string[]> => {
    const { data } = await supabase
      .from('cars')
      .select('brand');

    return [...new Set((data ?? []).map(d => d.brand))];
  },
  ['brands'],
  {
    revalidate: 3600,
    tags: ['brands'],
  }
);