'use client';

import { useState } from 'react';
import { Car } from '@/lib/types';
import EditCarModal from './EditCarModal';

interface CarListingsTableProps {
  cars: Car[];
}

export default function CarListingsTable({ cars }: CarListingsTableProps) {
  const [editingCar, setEditingCar] = useState<Car | null>(null);
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

  const formatPrice = (price: number | null) => {
    if (!price) return '-';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
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
          <h2 className="text-2xl font-bold">All Car Listings ({filteredCars.length})</h2>
          
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
            <p className="text-2xl font-bold text-black">{cars.length}</p>
          </div>
          <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
            <p className="text-xs text-green-700 mb-1">Available</p>
            <p className="text-2xl font-bold text-green-700">
              {cars.filter(c => !c.is_sold).length}
            </p>
          </div>
          <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
            <p className="text-xs text-red-700 mb-1">Sold</p>
            <p className="text-2xl font-bold text-red-700">
              {cars.filter(c => c.is_sold).length}
            </p>
          </div>
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
            <p className="text-xs text-blue-700 mb-1">Featured</p>
            <p className="text-2xl font-bold text-blue-700">
              {cars.filter(c => c.is_featured).length}
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
                filteredCars.map((car) => (
                  <tr key={car.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={car.images[0]}
                          alt={`${car.brand} ${car.model}`}
                          className="w-16 h-16 object-cover rounded border border-gray-200"
                        />
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
                          {car.kms_driven ? `${car.kms_driven.toLocaleString()} km` : '-'}
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
                        {car.created_at ? formatDate(car.created_at) : '-'}
                      </p>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <button
                        onClick={() => setEditingCar(car)}
                        className="px-4 py-2 bg-black text-white text-sm font-medium rounded hover:bg-gray-800 transition-colors"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {editingCar && (
        <EditCarModal
          car={editingCar}
          onClose={() => setEditingCar(null)}
        />
      )}
    </>
  );
}