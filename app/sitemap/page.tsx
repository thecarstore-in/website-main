import Link from 'next/link';
import { getAvailableCars, getBrands } from '@/lib/supabase';

export const metadata = {
  title: 'Sitemap',
  description: 'Complete sitemap of our website',
};

export default async function SitemapPage() {
  const [cars, brands] = await Promise.all([
    getAvailableCars(),
    getBrands()
  ]);

  const mainPages = [
    { title: 'Home', href: '/' },
    { title: 'Inventory', href: '/inventory' },
    { title: 'About Us', href: '/about' },
    { title: 'Contact', href: '/contact' },
  ];

  const legalPages = [
    { title: 'Privacy Policy', href: '/privacy-policy' },
    { title: 'Terms of Service', href: '/terms-of-service' },
    { title: 'Sitemap', href: '/sitemap' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white border border-gray-200 p-8 md:p-12 mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Sitemap</h1>
          <p className="text-gray-600 mb-8">
            Navigate through all pages and sections of our website
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Main Pages */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-black">
                Main Pages
              </h2>
              <ul className="space-y-3">
                {mainPages.map((page) => (
                  <li key={page.href}>
                    <Link 
                      href={page.href}
                      className="text-gray-700 hover:text-black hover:underline transition-colors"
                    >
                      {page.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Browse by Brand */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-black">
                Browse by Brand
              </h2>
              <ul className="space-y-3">
                {brands.length > 0 ? (
                  brands.map((brand) => (
                    <li key={brand}>
                      <Link 
                        href={`/inventory?brand=${encodeURIComponent(brand)}`}
                        className="text-gray-700 hover:text-black hover:underline transition-colors"
                      >
                        {brand}
                      </Link>
                    </li>
                  ))
                ) : (
                  <li className="text-gray-500">No brands available</li>
                )}
              </ul>
            </div>

            {/* Legal Pages */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-black">
                Legal & Information
              </h2>
              <ul className="space-y-3">
                {legalPages.map((page) => (
                  <li key={page.href}>
                    <Link 
                      href={page.href}
                      className="text-gray-700 hover:text-black hover:underline transition-colors"
                    >
                      {page.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* All Vehicles Section */}
        <div className="bg-white border border-gray-200 p-8 md:p-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-black">
            All Available Vehicles ({cars.length})
          </h2>
          
          {cars.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {cars.map((car) => (
                <Link 
                  key={car.id}
                  href={`/car/${car.id}`}
                  className="text-gray-700 hover:text-black hover:underline transition-colors"
                >
                  {car.brand} {car.model} {car.variant ? `- ${car.variant}` : ''} ({car.manufacturing_year || 'N/A'})
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No vehicles currently available</p>
          )}
        </div>

        {/* Additional Information */}
        <div className="mt-8 text-center text-gray-600 text-sm">
          <p>Last updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
      </div>
    </div>
  );
}