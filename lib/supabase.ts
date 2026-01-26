import 'server-only';
import { createClient } from '@supabase/supabase-js';
import { Car, CarFilters } from './types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// READ-ONLY client (RLS protected)
const supabase = createClient(supabaseUrl, anonKey);

// Fetch single car
export async function getCarById(id: string): Promise<Car | null> {
  const { data, error } = await supabase
    .from('cars')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return null;
  return data as Car;
}

// Featured cars
export async function getFeaturedCars(): Promise<Car[]> {
  const { data } = await supabase
    .from('cars')
    .select('*')
    .eq('is_featured', true)
    .eq('is_sold', false)
    .order('created_at', { ascending: false })
    .limit(6);

  return (data ?? []) as Car[];
}

// Available cars (filters)
export async function getAvailableCars(
  filters?: CarFilters
): Promise<Car[]> {
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
}

// Sold cars
export async function getSoldCars(): Promise<Car[]> {
  const { data } = await supabase
    .from('cars')
    .select('*')
    .eq('is_sold', true)
    .order('created_at', { ascending: false });

  return (data ?? []) as Car[];
}

// Unique brands
export async function getBrands(): Promise<string[]> {
  const { data } = await supabase
    .from('cars')
    .select('brand');

  return [...new Set((data ?? []).map(d => d.brand))];
}
