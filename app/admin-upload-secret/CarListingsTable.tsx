'use client';

import { useState } from 'react';
import { Car } from '@/lib/types';

interface Stats {
  total: number;
  available: number;
  sold: number;
  featured: number;
}

interface CarListingsTableProps {
  cars: Car[];
  stats: Stats;
}

export default function CarListingsTable({ cars, stats }: CarListingsTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSold, setFilterSold] = useState<'all' | 'available' | 'sold'>('all');

  const filteredCars = cars.filter(car => {
    const matchesSearch = 
      car.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.variant?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.registration_number?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSoldFilter = 
      filterSold === 'all' ? true :
      filterSold === 'sold' ? car.is_sold :
      !car.is_sold;

    return matchesSearch && matchesSoldFilter;
  });

  const getImageUrl = (img: any): string => {
    try {
      // Handle string type
      if (typeof img === 'string' && img) {
        const str = img as string;
        const trimmed = str.trim();
        
        // Check if it's a JSON string (starts with { or [)
        if (trimmed.charAt(0) === '{' || trimmed.charAt(0) === '[') {
          try {
            const parsed = JSON.parse(str);
            // Check if the parsed result is still a string (double encoding)
            if (typeof parsed === 'string') {
              const doubleParsed = JSON.parse(parsed);
              if (doubleParsed && typeof doubleParsed === 'object' && doubleParsed.url) {
                return String(doubleParsed.url);
              }
              return '';
            }
            // Single encoding
            if (parsed && typeof parsed === 'object' && parsed.url) {
              return String(parsed.url);
            }
            return '';
          } catch (parseErr) {
            // If JSON parsing fails, return the string as-is (might be a plain URL)
            return str;
          }
        }
        // Plain URL string
        return str;
      }
      
      // Handle object type
      if (img && typeof img === 'object') {
        const url = (img as Record<string, any>).url;
        if (url && typeof url === 'string') {
          // Check if the url property is itself a JSON string
          if (url.startsWith('{') || url.startsWith('[')) {
            try {
              const parsed = JSON.parse(url);
              if (parsed && typeof parsed === 'object' && parsed.url) {
                return String(parsed.url);
              }
            } catch {
              return url;
            }
          }
          return url;
        }
      }
    } catch (e) {
      console.error('Error parsing image:', img, e);
    }
    return '';
  };

  const formatPrice = (price: number | null) => {
    if (!price) return '-';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <>
      <div className="mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">All Car Listings ({stats.total})</h2>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <input
              type="text"
              placeholder="Search by brand, model, variant..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black w-full md:w-64"
            />
            
            <select
              value={filterSold}
              onChange={(e) => setFilterSold(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
            >
              <option value="all">All Cars</option>
              <option value="available">Available Only</option>
              <option value="sold">Sold Only</option>
            </select>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
            <p className="text-xs text-gray-600 mb-1">Total Cars</p>
            <p className="text-2xl font-bold text-black">{stats.total}</p>
          </div>
          <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
            <p className="text-xs text-green-700 mb-1">Available</p>
            <p className="text-2xl font-bold text-green-700">
              {stats.available}
            </p>
          </div>
          <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
            <p className="text-xs text-red-700 mb-1">Sold</p>
            <p className="text-2xl font-bold text-red-700">
              {stats.sold}
            </p>
          </div>
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
            <p className="text-xs text-blue-700 mb-1">Featured</p>
            <p className="text-2xl font-bold text-blue-700">
              {stats.featured}
            </p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-bold text-black uppercase tracking-wide">
                  Car Details
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold text-black uppercase tracking-wide">
                  Year / KM
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold text-black uppercase tracking-wide">
                  Price
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold text-black uppercase tracking-wide">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold text-black uppercase tracking-wide">
                  Added
                </th>
                <th className="px-4 py-3 text-right text-xs font-bold text-black uppercase tracking-wide">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredCars.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-gray-500">
                    No cars found
                  </td>
                </tr>
              ) : (
                filteredCars.map((car) => {
                  const firstImageUrl = car.images?.[0] ? getImageUrl(car.images[0]) : '';

                  return (
                    <tr key={car.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          {firstImageUrl ? (
                            <img
                              src={firstImageUrl}
                              alt={`${car.brand} ${car.model}`}
                              className="w-16 h-16 object-cover rounded border border-gray-200"
                            />
                          ) : (
                            <div className="w-16 h-16 bg-gray-200 rounded border border-gray-300 flex items-center justify-center">
                              <span className="text-xs text-gray-500">No Image</span>
                            </div>
                          )}
                          <div>
                            <p className="font-bold text-black">
                              {car.brand} {car.model}
                            </p>
                            {car.variant && (
                              <p className="text-sm text-gray-600">{car.variant}</p>
                            )}
                            {car.registration_number && (
                              <p className="text-xs text-gray-500 font-mono">
                                {car.registration_number}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm">
                          <p className="text-black font-medium">
                            {car.manufacturing_year || '-'}
                          </p>
                          <p className="text-gray-600">
                            {car.kms_driven
                              ? `${car.kms_driven.toLocaleString('en-IN')} km`
                              : '-'}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <p className="font-bold text-black">
                          {formatPrice(car.expected_price)}
                        </p>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-col gap-2">
                          {car.is_sold ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-800 w-fit">
                              Sold
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800 w-fit">
                              Available
                            </span>
                          )}
                          {car.is_featured && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 w-fit">
                              Featured
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-sm text-gray-600">
                          {formatDate(car.created_at)}
                        </p>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <a
                          href={`/admin-upload-secret?view=edit&id=${car.id}`}
                          className="inline-block px-4 py-2 bg-black text-white text-sm font-medium rounded hover:bg-gray-800 transition-colors"
                        >
                          Edit
                        </a>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}