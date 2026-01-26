import { getCarById } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import ImageGallery from '@/components/ImageGallery';
import BookingForm from '@/components/BookingForm';

export default async function CarDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const car = await getCarById(id);

  if (!car) {
    notFound();
  }

  const formatPrice = (price: number | null) => {
    if (!price) return 'Price on request';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatKms = (kms: number | null) => {
    if (!kms) return 'N/A';
    return new Intl.NumberFormat('en-IN').format(kms);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50 pt-10">
      {/* Premium Navigation Bar */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-40 backdrop-blur-lg bg-white/95">
        <div className="px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-medium text-black hover:text-gray-600 transition-colors group"
            >
              <svg
                className="w-5 h-5 group-hover:-translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to Inventory
            </Link>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span>Verified Listing</span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-12 md:py-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            {/* Left Column - Image Gallery */}
            <div className="lg:col-span-7">
              <div className="sticky top-24">
                <ImageGallery 
                  images={car.images} 
                  carName={`${car.brand} ${car.model}`} 
                  isSold={car.is_sold} 
                />
              </div>
            </div>

            {/* Right Column - Details & Booking */}
            <div className="lg:col-span-5">
              {/* Car Title Section */}
              <div className="mb-8">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h1 className="text-4xl md:text-5xl font-bold text-black mb-2 tracking-tight">
                      {car.brand} {car.model}
                    </h1>
                    {car.variant && (
                      <p className="text-lg text-gray-800 font-medium">{car.variant}</p>
                    )}
                  </div>
                  {!car.is_sold && (
                    <div className="bg-green-50 border border-green-200 px-3 py-1 rounded-full">
                      <span className="text-xs font-semibold text-green-700">Available</span>
                    </div>
                  )}
                </div>
                
                {/* Quick Stats Bar */}
                <div className="flex flex-wrap gap-4 mt-6 text-sm text-gray-800">
                  {car.manufacturing_year && (
                    <div className="flex items-center gap-1.5">
                      <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="font-medium">{car.manufacturing_year}</span>
                    </div>
                  )}
                  {car.kms_driven !== null && (
                    <>
                      <span className="text-gray-300">•</span>
                      <div className="flex items-center gap-1.5">
                        <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        <span className="font-medium">{formatKms(car.kms_driven)} km</span>
                      </div>
                    </>
                  )}
                  {car.owner_count !== null && (
                    <>
                      <span className="text-gray-300">•</span>
                      <div className="flex items-center gap-1.5">
                        <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span className="font-medium">{car.owner_count} {car.owner_count === 1 ? 'Owner' : 'Owners'}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Price Section */}
              <div className="mb-10 p-6 bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-lg">
                <div className="flex items-baseline justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-800 mb-1 uppercase tracking-wide">Expected Price</p>
                    <p className="text-4xl md:text-5xl font-bold text-black">
                      {formatPrice(car.expected_price)}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-md">
                      <p className="text-xs font-semibold text-blue-700">Best Value</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Key Specifications Grid */}
              <div className="mb-10">
                <h2 className="text-2xl font-bold text-black mb-6 tracking-tight">Key Specifications</h2>
                <div className="grid grid-cols-2 gap-4">
                  {car.manufacturing_year && (
                    <div className="group p-5 bg-white border border-gray-200 rounded-lg hover:border-black hover:shadow-md transition-all">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center text-white">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      </div>
                      <p className="text-xs font-semibold text-gray-800 mb-1 uppercase tracking-wide">Year</p>
                      <p className="text-lg font-bold text-black">{car.manufacturing_year}</p>
                    </div>
                  )}
                  
                  {car.kms_driven !== null && (
                    <div className="group p-5 bg-white border border-gray-200 rounded-lg hover:border-black hover:shadow-md transition-all">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center text-white">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                        </div>
                      </div>
                      <p className="text-xs font-semibold text-gray-800 mb-1 uppercase tracking-wide">Odometer</p>
                      <p className="text-lg font-bold text-black">{formatKms(car.kms_driven)} km</p>
                    </div>
                  )}

                  {car.fuel_type && (
                    <div className="group p-5 bg-white border border-gray-200 rounded-lg hover:border-black hover:shadow-md transition-all">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center text-white">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                          </svg>
                        </div>
                      </div>
                      <p className="text-xs font-semibold text-gray-800 mb-1 uppercase tracking-wide">Fuel Type</p>
                      <p className="text-lg font-bold text-black">{car.fuel_type}</p>
                    </div>
                  )}

                  {car.transmission && (
                    <div className="group p-5 bg-white border border-gray-200 rounded-lg hover:border-black hover:shadow-md transition-all">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center text-white">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                      </div>
                      <p className="text-xs font-semibold text-gray-800 mb-1 uppercase tracking-wide">Transmission</p>
                      <p className="text-lg font-bold text-black">{car.transmission}</p>
                    </div>
                  )}

                  {car.owner_count !== null && (
                    <div className="group p-5 bg-white border border-gray-200 rounded-lg hover:border-black hover:shadow-md transition-all">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center text-white">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                      </div>
                      <p className="text-xs font-semibold text-gray-800 mb-1 uppercase tracking-wide">Ownership</p>
                      <p className="text-lg font-bold text-black">{car.owner_count} {car.owner_count === 1 ? 'Owner' : 'Owners'}</p>
                    </div>
                  )}

                  {car.color && (
                    <div className="group p-5 bg-white border border-gray-200 rounded-lg hover:border-black hover:shadow-md transition-all">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center text-white">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                          </svg>
                        </div>
                      </div>
                      <p className="text-xs font-semibold text-gray-800 mb-1 uppercase tracking-wide">Exterior Color</p>
                      <p className="text-lg font-bold text-black">{car.color}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Additional Details */}
              <div className="mb-10">
                <h2 className="text-2xl font-bold text-black mb-6 tracking-tight">Additional Information</h2>
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  {car.registration_number && (
                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span className="text-sm font-medium text-gray-800">Registration Number</span>
                      </div>
                      <span className="text-sm font-bold text-black">{car.registration_number}</span>
                    </div>
                  )}
                  {car.insurance_status && (
                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        <span className="text-sm font-medium text-gray-800">Insurance Status</span>
                      </div>
                      <span className="text-sm font-bold text-black">{car.insurance_status}</span>
                    </div>
                  )}
                  {car.car_type && (
                    <div className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                        </svg>
                        <span className="text-sm font-medium text-gray-800">Body Type</span>
                      </div>
                      <span className="text-sm font-bold text-black">{car.car_type}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Trust Badges */}
              <div className="mb-10 grid grid-cols-3 gap-3">
                <div className="text-center p-4 bg-white border border-gray-200 rounded-lg">
                  <svg className="w-6 h-6 mx-auto mb-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-xs font-semibold text-black">Verified</p>
                </div>
                <div className="text-center p-4 bg-white border border-gray-200 rounded-lg">
                  <svg className="w-6 h-6 mx-auto mb-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <p className="text-xs font-semibold text-black">Warranty</p>
                </div>
                <div className="text-center p-4 bg-white border border-gray-200 rounded-lg">
                  <svg className="w-6 h-6 mx-auto mb-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-xs font-semibold text-black">Best Price</p>
                </div>
              </div>

              {/* Booking Section */}
              <div className="sticky top-24">
                {!car.is_sold ? (
                  <BookingForm car={car} />
                ) : (
                  <div className="text-center py-12 bg-gradient-to-br from-gray-100 to-gray-50 border-2 border-gray-300 rounded-lg">
                    <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <p className="text-2xl font-bold text-black mb-2">Vehicle Sold</p>
                    <p className="text-sm text-gray-800">This vehicle is no longer available</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}