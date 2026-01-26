import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabase-admin';
import CarListingsTable from './CarListingsTable';
import AddCarForm from './AddCarForm';

async function checkAdminAccess() {
  const headersList = await headers();
  const forwardedFor = headersList.get('x-forwarded-for');
  const realIp = headersList.get('x-real-ip');
  const clientIp = forwardedFor?.split(',')[0] || realIp || 'unknown';

  const allowedIps = process.env.ALLOWED_ADMIN_IPS?.split(',') || [];
  
  if (!allowedIps.includes(clientIp)) {
    return false;
  }
  
  return true;
}

async function getAllCars() {
  const { data: cars, error } = await supabaseAdmin
    .from('cars')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching cars:', error);
    return [];
  }

  return cars || [];
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string }>;
}) {
  const hasAccess = await checkAdminAccess();
  
  if (!hasAccess) {
    notFound();
  }

  const params = await searchParams;
  const view = params.view || 'listings';
  const cars = await getAllCars();

  return (
    <div className="min-h-screen bg-white text-black pt-10">
      <div className="border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Admin Panel</h1>
            <div className="flex gap-2">
              <a
                href="/admin-upload-secret?view=listings"
                className={`px-4 py-2 font-medium transition-colors ${
                  view === 'listings'
                    ? 'bg-black text-white'
                    : 'bg-gray-100 text-black hover:bg-gray-200'
                }`}
              >
                All Listings
              </a>
              <a
                href="/admin-upload-secret?view=add"
                className={`px-4 py-2 font-medium transition-colors ${
                  view === 'add'
                    ? 'bg-black text-white'
                    : 'bg-gray-100 text-black hover:bg-gray-200'
                }`}
              >
                Add Car
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {view === 'listings' ? (
          <CarListingsTable cars={cars} />
        ) : (
          <AddCarForm />
        )}
      </div>
    </div>
  );
}