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

async function getPaginatedCars(page: number = 1) {
  const from = (page - 1) * ITEMS_PER_PAGE;
  const to = from + ITEMS_PER_PAGE - 1;

  // Get total count
  const { count } = await supabaseAdmin
    .from('cars')
    .select('*', { count: 'exact', head: true })
    .eq('is_sold', false);

  // Get paginated data
  const { data: cars, error } = await supabaseAdmin
    .from('cars')
    .select('*')
    .eq('is_sold', false)
    .order('created_at', { ascending: false })
    .range(from, to);

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
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const currentPage = parseInt(params.page || '1', 10);

  const [{ cars, totalCount, totalPages }, brands, filterOptions] = await Promise.all([
    getPaginatedCars(currentPage),
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
        />
      </Suspense>
    </div>
  );
}