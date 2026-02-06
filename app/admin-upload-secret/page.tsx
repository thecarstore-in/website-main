import { headers, cookies } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import { supabaseAdmin, isValidAdminKey } from '@/lib/supabase-admin';
import CarListingsTable from './CarListingsTable';
import AddCarForm from './AddCarForm';
import EditCarForm from './EditCarModal';

// CRITICAL: Disable all caching for admin panel
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// HARDCODED ADMIN API KEY - Change this to your actual key
const ADMIN_API_KEY = 'your-secret-admin-key-here';

const ITEMS_PER_PAGE = 10;

async function checkAdminAccess() {
  const headersList = await headers();
  const cookieStore = await cookies();
  
  // Get API key from cookie or header
  const apiKey = cookieStore.get('admin_api_key')?.value || 
                 headersList.get('x-admin-key');
  
  console.log('API Key present:', !!apiKey);
  
  // Check against hardcoded key
  if (apiKey !== ADMIN_API_KEY) {
    console.log('Access denied - Invalid API key');
    return false;
  }
  
  return true;
}

async function getPaginatedCars(page: number = 1) {
  const from = (page - 1) * ITEMS_PER_PAGE;
  const to = from + ITEMS_PER_PAGE - 1;

  // Get total count and status counts in parallel
  const [
    { count: totalCount },
    { count: availableCount },
    { count: soldCount },
    { count: featuredCount },
    { data: cars, error }
  ] = await Promise.all([
    supabaseAdmin
      .from('cars')
      .select('*', { count: 'exact', head: true }),
    supabaseAdmin
      .from('cars')
      .select('*', { count: 'exact', head: true })
      .eq('is_sold', false),
    supabaseAdmin
      .from('cars')
      .select('*', { count: 'exact', head: true })
      .eq('is_sold', true),
    supabaseAdmin
      .from('cars')
      .select('*', { count: 'exact', head: true })
      .eq('is_featured', true),
    supabaseAdmin
      .from('cars')
      .select('*')
      .order('created_at', { ascending: false })
      .range(from, to)
  ]);

  if (error) {
    console.error('Error fetching cars:', error);
    return { 
      cars: [], 
      totalCount: 0, 
      totalPages: 0,
      stats: {
        total: 0,
        available: 0,
        sold: 0,
        featured: 0
      }
    };
  }

  const totalPages = totalCount ? Math.ceil(totalCount / ITEMS_PER_PAGE) : 0;

  return { 
    cars: cars || [], 
    totalCount: totalCount || 0,
    totalPages,
    stats: {
      total: totalCount || 0,
      available: availableCount || 0,
      sold: soldCount || 0,
      featured: featuredCount || 0
    }
  };
}

async function getCarById(id: string) {
  const { data, error } = await supabaseAdmin
    .from('cars')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching car:', error);
    return null;
  }

  return data;
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string; page?: string; id?: string }>;
}) {
  const hasAccess = await checkAdminAccess();
  
  if (!hasAccess) {
    notFound();
  }

  const params = await searchParams;
  const view = params.view || 'listings';
  const currentPage = parseInt(params.page || '1', 10);
  const editId = params.id;
  
  const { cars, totalCount, totalPages, stats } = await getPaginatedCars(currentPage);
  
  // If editing, fetch the car
  let carToEdit = null;
  if (view === 'edit' && editId) {
    carToEdit = await getCarById(editId);
    if (!carToEdit) {
      notFound();
    }
  }
  
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
          <>
            <div className="mb-4 text-sm text-gray-600">
              Showing {cars.length} of {totalCount} total listings
            </div>
            <CarListingsTable cars={cars} stats={stats} />
            
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-2">
                {/* Previous Button */}
                {currentPage > 1 && (
                  <a
                    href={`/admin-upload-secret?view=listings&page=${currentPage - 1}`}
                    className="px-4 py-2 bg-gray-100 text-black hover:bg-gray-200 font-medium transition-colors"
                  >
                    ← Previous
                  </a>
                )}
                
                {/* Page Numbers */}
                <div className="flex gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                    // Show first page, last page, current page, and pages around current
                    const showPage = 
                      pageNum === 1 || 
                      pageNum === totalPages || 
                      (pageNum >= currentPage - 2 && pageNum <= currentPage + 2);
                    
                    const showEllipsis = 
                      (pageNum === 2 && currentPage > 4) ||
                      (pageNum === totalPages - 1 && currentPage < totalPages - 3);
                    
                    if (showEllipsis) {
                      return <span key={pageNum} className="px-2 py-2">...</span>;
                    }
                    
                    if (!showPage) {
                      return null;
                    }
                    
                    return (
                      <a
                        key={pageNum}
                        href={`/admin-upload-secret?view=listings&page=${pageNum}`}
                        className={`px-4 py-2 font-medium transition-colors ${
                          pageNum === currentPage
                            ? 'bg-black text-white'
                            : 'bg-gray-100 text-black hover:bg-gray-200'
                        }`}
                      >
                        {pageNum}
                      </a>
                    );
                  })}
                </div>
                
                {/* Next Button */}
                {currentPage < totalPages && (
                  <a
                    href={`/admin-upload-secret?view=listings&page=${currentPage + 1}`}
                    className="px-4 py-2 bg-gray-100 text-black hover:bg-gray-200 font-medium transition-colors"
                  >
                    Next →
                  </a>
                )}
              </div>
            )}
          </>
        ) : view === 'add' ? (
          <AddCarForm />
        ) : view === 'edit' && carToEdit ? (
          <EditCarForm car={carToEdit} />
        ) : null}
      </div>
    </div>
  );
}