// app/inventory/page.tsx
import { Suspense } from 'react';
import InventoryClient from './InventoryClient';
import { getAvailableCars, getBrands } from '@/lib/supabase';

export const metadata = {
  title: 'Inventory - Browse Our Cars',
  description: 'Browse our complete inventory of quality used cars',
};

// Add revalidation
export const revalidate = 3600;

export default async function InventoryPage() {
  const [cars, brands] = await Promise.all([
    getAvailableCars(),
    getBrands()
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-gray-600">Loading inventory...</div>
        </div>
      }>
        <InventoryClient initialCars={cars} availableBrands={brands} />
      </Suspense>
    </div>
  );
}