'use client';

import { useState, useEffect } from 'react';
import { Car } from '@/lib/types';
import CarCard from '@/components/CarCard';
import { useRouter, useSearchParams } from 'next/navigation';

interface InventoryClientProps {
  initialCars: Car[];
  availableBrands: string[];
  carTypes: string[];
  fuelTypes: string[];
  transmissions: string[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
  initialFilters: any;
}

type SortOption = 'newest' | 'oldest' | 'price-low' | 'price-high' | 'kms-low' | 'kms-high' | 'year-new' | 'year-old';

export default function InventoryClient({
  initialCars,
  availableBrands,
  carTypes,
  fuelTypes,
  transmissions,
  currentPage,
  totalPages,
  totalCount,
  initialFilters,
}: InventoryClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [searchQuery, setSearchQuery] = useState(initialFilters.search || '');
  const [selectedBrand, setSelectedBrand] = useState(initialFilters.brand || '');
  const [selectedCarType, setSelectedCarType] = useState(initialFilters.carType || '');
  const [selectedFuelType, setSelectedFuelType] = useState(initialFilters.fuelType || '');
  const [selectedTransmission, setSelectedTransmission] = useState(initialFilters.transmission || '');
  const [priceRange, setPriceRange] = useState({ 
    min: initialFilters.minPrice || '', 
    max: initialFilters.maxPrice || '' 
  });
  const [yearRange, setYearRange] = useState({ 
    min: initialFilters.minYear || '', 
    max: initialFilters.maxYear || '' 
  });
  const [kmsRange, setKmsRange] = useState({ 
    min: initialFilters.minKms || '', 
    max: initialFilters.maxKms || '' 
  });
  const [sortBy, setSortBy] = useState<SortOption>((initialFilters.sortBy as SortOption) || 'newest');
  const [showFilters, setShowFilters] = useState(false);

  // Build URL with filters
  const buildFilterURL = () => {
    const params = new URLSearchParams();
    
    if (searchQuery) params.set('search', searchQuery);
    if (selectedBrand) params.set('brand', selectedBrand);
    if (selectedCarType) params.set('carType', selectedCarType);
    if (selectedFuelType) params.set('fuelType', selectedFuelType);
    if (selectedTransmission) params.set('transmission', selectedTransmission);
    if (priceRange.min) params.set('minPrice', priceRange.min);
    if (priceRange.max) params.set('maxPrice', priceRange.max);
    if (yearRange.min) params.set('minYear', yearRange.min);
    if (yearRange.max) params.set('maxYear', yearRange.max);
    if (kmsRange.min) params.set('minKms', kmsRange.min);
    if (kmsRange.max) params.set('maxKms', kmsRange.max);
    if (sortBy !== 'newest') params.set('sortBy', sortBy);
    
    const queryString = params.toString();
    return queryString ? `/inventory?${queryString}` : '/inventory';
  };

  // Apply filters - updates URL which triggers server-side filtering
  const applyFilters = () => {
    const url = buildFilterURL();
    router.push(url);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      applyFilters();
    }, 500);
    
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Apply filters when any filter changes (except search which is debounced)
  const handleFilterChange = () => {
    applyFilters();
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedBrand('');
    setSelectedCarType('');
    setSelectedFuelType('');
    setSelectedTransmission('');
    setPriceRange({ min: '', max: '' });
    setYearRange({ min: '', max: '' });
    setKmsRange({ min: '', max: '' });
    setSortBy('newest');
    router.push('/inventory');
  };

  const activeFilterCount = [
    searchQuery,
    selectedBrand,
    selectedCarType,
    selectedFuelType,
    selectedTransmission,
    priceRange.min,
    priceRange.max,
    yearRange.min,
    yearRange.max,
    kmsRange.min,
    kmsRange.max
  ].filter(Boolean).length;

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (page === 1) {
      params.delete('page');
    } else {
      params.set('page', page.toString());
    }
    
    const queryString = params.toString();
    const url = queryString ? `/inventory?${queryString}` : '/inventory';
    router.push(url);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 text-black">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Our Inventory</h1>
        <p className="text-gray-600">
          Browse {totalCount} available vehicles
        </p>
      </div>

      {/* Search and Filter Toggle */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search by brand, model, variant, color..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:ring-1 focus:ring-black outline-none transition-colors"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="px-6 py-3 border border-gray-300 bg-white hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
        </button>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold">Filters</h2>
            {activeFilterCount > 0 && (
              <button
                onClick={resetFilters}
                className="text-sm text-gray-600 hover:text-black underline"
              >
                Clear all filters
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Brand Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Brand
              </label>
              <select
                value={selectedBrand}
                onChange={(e) => {
                  setSelectedBrand(e.target.value);
                  setTimeout(handleFilterChange, 0);
                }}
                className="w-full px-3 py-2 border border-gray-300 focus:border-black focus:ring-1 focus:ring-black outline-none bg-white"
              >
                <option value="">All Brands</option>
                {availableBrands.map(brand => (
                  <option key={brand} value={brand}>{brand}</option>
                ))}
              </select>
            </div>

            {/* Car Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Car Type
              </label>
              <select
                value={selectedCarType}
                onChange={(e) => {
                  setSelectedCarType(e.target.value);
                  setTimeout(handleFilterChange, 0);
                }}
                className="w-full px-3 py-2 border border-gray-300 focus:border-black focus:ring-1 focus:ring-black outline-none bg-white"
              >
                <option value="">All Types</option>
                {carTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Fuel Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fuel Type
              </label>
              <select
                value={selectedFuelType}
                onChange={(e) => {
                  setSelectedFuelType(e.target.value);
                  setTimeout(handleFilterChange, 0);
                }}
                className="w-full px-3 py-2 border border-gray-300 focus:border-black focus:ring-1 focus:ring-black outline-none bg-white"
              >
                <option value="">All Fuel Types</option>
                {fuelTypes.map(fuel => (
                  <option key={fuel} value={fuel}>{fuel}</option>
                ))}
              </select>
            </div>

            {/* Transmission Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Transmission
              </label>
              <select
                value={selectedTransmission}
                onChange={(e) => {
                  setSelectedTransmission(e.target.value);
                  setTimeout(handleFilterChange, 0);
                }}
                className="w-full px-3 py-2 border border-gray-300 focus:border-black focus:ring-1 focus:ring-black outline-none bg-white"
              >
                <option value="">All Transmissions</option>
                {transmissions.map(trans => (
                  <option key={trans} value={trans}>{trans}</option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price Range (₹)
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={priceRange.min || ''}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                  onBlur={handleFilterChange}
                  className="w-1/2 px-3 py-2 border border-gray-300 focus:border-black focus:ring-1 focus:ring-black outline-none"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={priceRange.max || ''}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                  onBlur={handleFilterChange}
                  className="w-1/2 px-3 py-2 border border-gray-300 focus:border-black focus:ring-1 focus:ring-black outline-none"
                />
              </div>
            </div>

            {/* Year Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Year Range
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={yearRange.min || ''}
                  onChange={(e) => setYearRange(prev => ({ ...prev, min: e.target.value }))}
                  onBlur={handleFilterChange}
                  className="w-1/2 px-3 py-2 border border-gray-300 focus:border-black focus:ring-1 focus:ring-black outline-none"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={yearRange.max || ''}
                  onChange={(e) => setYearRange(prev => ({ ...prev, max: e.target.value }))}
                  onBlur={handleFilterChange}
                  className="w-1/2 px-3 py-2 border border-gray-300 focus:border-black focus:ring-1 focus:ring-black outline-none"
                />
              </div>
            </div>

            {/* Kilometers Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kilometers Range
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={kmsRange.min || ''}
                  onChange={(e) => setKmsRange(prev => ({ ...prev, min: e.target.value }))}
                  onBlur={handleFilterChange}
                  className="w-1/2 px-3 py-2 border border-gray-300 focus:border-black focus:ring-1 focus:ring-black outline-none"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={kmsRange.max || ''}
                  onChange={(e) => setKmsRange(prev => ({ ...prev, max: e.target.value }))}
                  onBlur={handleFilterChange}
                  className="w-1/2 px-3 py-2 border border-gray-300 focus:border-black focus:ring-1 focus:ring-black outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Results Header with Sort */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <p className="text-gray-600">
          Showing <span className="font-semibold text-black">{initialCars.length}</span> of <span className="font-semibold text-black">{totalCount}</span> {totalCount === 1 ? 'vehicle' : 'vehicles'}
        </p>
        
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value as SortOption);
              setTimeout(handleFilterChange, 0);
            }}
            className="px-3 py-2 border border-gray-300 focus:border-black focus:ring-1 focus:ring-black outline-none bg-white"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="kms-low">Mileage: Low to High</option>
            <option value="kms-high">Mileage: High to Low</option>
            <option value="year-new">Year: Newest First</option>
            <option value="year-old">Year: Oldest First</option>
          </select>
        </div>
      </div>

      {/* Car Grid */}
      {initialCars.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {initialCars.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-12 flex items-center justify-center gap-2">
              {/* Previous Button */}
              {currentPage > 1 && (
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition-colors"
                >
                  ← Previous
                </button>
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
                    return (
                      <span key={pageNum} className="px-2 py-2 text-gray-400">
                        ...
                      </span>
                    );
                  }

                  if (!showPage) {
                    return null;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-4 py-2 font-medium rounded-lg transition-colors ${
                        pageNum === currentPage
                          ? 'bg-black text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              {/* Next Button */}
              {currentPage < totalPages && (
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition-colors"
                >
                  Next →
                </button>
              )}
            </div>
          )}

          {/* Results Info */}
          <div className="mt-6 text-center text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </div>
        </>
      ) : (
        <div className="text-center py-20 bg-white border border-gray-200">
          <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No vehicles found</h3>
          <p className="text-gray-600 mb-4">Try adjusting your filters or search query</p>
          {activeFilterCount > 0 && (
            <button
              onClick={resetFilters}
              className="px-6 py-2 bg-black text-white hover:bg-gray-800 transition-colors"
            >
              Clear all filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}