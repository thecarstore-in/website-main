// app/inventory/page.tsx
import { Suspense } from 'react';
import InventoryClient from './InventoryClient';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const metadata = {
  title: 'Inventory - Browse Our Cars',
  description: 'Browse our complete inventory of quality used cars',
};

// Add revalidation
export const revalidate = 3600;

const ITEMS_PER_PAGE = 12;

interface FilterParams {
  page?: string;
  search?: string;
  brand?: string;
  carType?: string;
  fuelType?: string;
  transmission?: string;
  minPrice?: string;
  maxPrice?: string;
  minYear?: string;
  maxYear?: string;
  minKms?: string;
  maxKms?: string;
  sortBy?: string;
}

async function getPaginatedCars(params: FilterParams) {
  const page = parseInt(params.page || '1', 10);
  const from = (page - 1) * ITEMS_PER_PAGE;
  const to = from + ITEMS_PER_PAGE - 1;

  // Start building query
  let query = supabaseAdmin
    .from('cars')
    .select('*', { count: 'exact' })
    .eq('is_sold', false);

  // Apply filters
  if (params.search) {
    const searchLower = params.search.toLowerCase();
    query = query.or(`brand.ilike.%${searchLower}%,model.ilike.%${searchLower}%,variant.ilike.%${searchLower}%,color.ilike.%${searchLower}%`);
  }

  if (params.brand) {
    query = query.ilike('brand', params.brand);
  }

  if (params.carType) {
    query = query.ilike('car_type', params.carType);
  }

  if (params.fuelType) {
    query = query.ilike('fuel_type', params.fuelType);
  }

  if (params.transmission) {
    query = query.ilike('transmission', params.transmission);
  }

  if (params.minPrice) {
    query = query.gte('expected_price', parseInt(params.minPrice));
  }

  if (params.maxPrice) {
    query = query.lte('expected_price', parseInt(params.maxPrice));
  }

  if (params.minYear) {
    query = query.gte('manufacturing_year', parseInt(params.minYear));
  }

  if (params.maxYear) {
    query = query.lte('manufacturing_year', parseInt(params.maxYear));
  }

  if (params.minKms) {
    query = query.gte('kms_driven', parseInt(params.minKms));
  }

  if (params.maxKms) {
    query = query.lte('kms_driven', parseInt(params.maxKms));
  }

  // Apply sorting
  const sortBy = params.sortBy || 'newest';
  switch (sortBy) {
    case 'oldest':
      query = query.order('created_at', { ascending: true });
      break;
    case 'price-low':
      query = query.order('expected_price', { ascending: true, nullsFirst: false });
      break;
    case 'price-high':
      query = query.order('expected_price', { ascending: false, nullsFirst: false });
      break;
    case 'kms-low':
      query = query.order('kms_driven', { ascending: true, nullsFirst: false });
      break;
    case 'kms-high':
      query = query.order('kms_driven', { ascending: false, nullsFirst: false });
      break;
    case 'year-new':
      query = query.order('manufacturing_year', { ascending: false, nullsFirst: false });
      break;
    case 'year-old':
      query = query.order('manufacturing_year', { ascending: true, nullsFirst: false });
      break;
    default: // newest
      query = query.order('created_at', { ascending: false });
  }

  // Apply pagination
  query = query.range(from, to);

  const { data: cars, error, count } = await query;

  if (error) {
    console.error('Error fetching cars:', error);
    return { cars: [], totalCount: 0, totalPages: 0 };
  }

  const totalPages = count ? Math.ceil(count / ITEMS_PER_PAGE) : 0;

  return {
    cars: cars || [],
    totalCount: count || 0,
    totalPages,
  };
}

async function getBrands() {
  const { data, error } = await supabaseAdmin
    .from('cars')
    .select('brand')
    .eq('is_sold', false);

  if (error) {
    console.error('Error fetching brands:', error);
    return [];
  }

  // Get unique brands
  const uniqueBrands = [...new Set(data.map((car) => car.brand))].sort();
  return uniqueBrands;
}

async function getFilterOptions() {
  const { data, error } = await supabaseAdmin
    .from('cars')
    .select('car_type, fuel_type, transmission')
    .eq('is_sold', false);

  if (error) {
    console.error('Error fetching filter options:', error);
    return { carTypes: [], fuelTypes: [], transmissions: [] };
  }

  return {
    carTypes: [...new Set(data.map(c => c.car_type).filter((t): t is string => Boolean(t)))].sort(),
    fuelTypes: [...new Set(data.map(c => c.fuel_type).filter((f): f is string => Boolean(f)))].sort(),
    transmissions: [...new Set(data.map(c => c.transmission).filter((t): t is string => Boolean(t)))].sort(),
  };
}

export default async function InventoryPage({
  searchParams,
}: {
  searchParams: Promise<FilterParams>;
}) {
  const params = await searchParams;
  const currentPage = parseInt(params.page || '1', 10);

  const [{ cars, totalCount, totalPages }, brands, filterOptions] = await Promise.all([
    getPaginatedCars(params),
    getBrands(),
    getFilterOptions(),
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-gray-600">Loading inventory...</div>
          </div>
        }
      >
        <InventoryClient
          initialCars={cars}
          availableBrands={brands}
          carTypes={filterOptions.carTypes}
          fuelTypes={filterOptions.fuelTypes}
          transmissions={filterOptions.transmissions}
          currentPage={currentPage}
          totalPages={totalPages}
          totalCount={totalCount}
          initialFilters={params}
        />
      </Suspense>
    </div>
  );
}