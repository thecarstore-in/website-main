'use client';

import { useState } from 'react';
import { Car } from '@/lib/types';
import { updateCar, deleteCar } from './actions';

interface EditCarModalProps {
  car: Car;
  onClose: () => void;
}

export default function EditCarModal({ car, onClose }: EditCarModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    
    const formData = new FormData(e.currentTarget);
    
    try {
      await updateCar(car.id, formData);
      window.location.reload();
    } catch (error) {
      alert('Failed to update car');
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this car? This action cannot be undone.')) {
      return;
    }

    setIsDeleting(true);
    
    try {
      await deleteCar(car.id);
      window.location.reload();
    } catch (error) {
      alert('Failed to delete car');
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg max-w-4xl w-full my-8">
        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-black">
            Edit Car: {car.brand} {car.model}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black text-2xl font-bold"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Brand *
              </label>
              <input
                type="text"
                name="brand"
                defaultValue={car.brand}
                required
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Model *
              </label>
              <input
                type="text"
                name="model"
                defaultValue={car.model}
                required
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Variant
              </label>
              <input
                type="text"
                name="variant"
                defaultValue={car.variant || ''}
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Manufacturing Year
              </label>
              <input
                type="number"
                name="manufacturing_year"
                defaultValue={car.manufacturing_year || ''}
                min="1980"
                max="2026"
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Fuel Type
              </label>
              <select
                name="fuel_type"
                defaultValue={car.fuel_type || ''}
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-black"
              >
                <option value="">Select Fuel Type</option>
                <option value="Petrol">Petrol</option>
                <option value="Diesel">Diesel</option>
                <option value="CNG">CNG</option>
                <option value="Electric">Electric</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Transmission
              </label>
              <select
                name="transmission"
                defaultValue={car.transmission || ''}
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-black"
              >
                <option value="">Select Transmission</option>
                <option value="Manual">Manual</option>
                <option value="Automatic">Automatic</option>
                <option value="AMT">AMT</option>
                <option value="CVT">CVT</option>
                <option value="DCT">DCT</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Kilometers Driven
              </label>
              <input
                type="number"
                name="kms_driven"
                defaultValue={car.kms_driven || ''}
                min="0"
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Expected Price (₹)
              </label>
              <input
                type="number"
                name="expected_price"
                defaultValue={car.expected_price || ''}
                min="0"
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Registration Number
              </label>
              <input
                type="text"
                name="registration_number"
                defaultValue={car.registration_number || ''}
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Owner Count
              </label>
              <input
                type="number"
                name="owner_count"
                defaultValue={car.owner_count || ''}
                min="1"
                max="10"
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Color
              </label>
              <input
                type="text"
                name="color"
                defaultValue={car.color || ''}
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Insurance Status
              </label>
              <select
                name="insurance_status"
                defaultValue={car.insurance_status || ''}
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-black"
              >
                <option value="">Select Status</option>
                <option value="Valid">Valid</option>
                <option value="Expired">Expired</option>
                <option value="Third Party">Third Party</option>
                <option value="Comprehensive">Comprehensive</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Car Type
              </label>
              <select
                name="car_type"
                defaultValue={car.car_type || ''}
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-black"
              >
                <option value="">Select Car Type</option>
                <option value="Hatchback">Hatchback</option>
                <option value="Sedan">Sedan</option>
                <option value="SUV">SUV</option>
                <option value="MUV">MUV</option>
                <option value="Luxury">Luxury</option>
              </select>
            </div>

            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="is_featured"
                  defaultChecked={car.is_featured}
                  value="true"
                  className="w-4 h-4"
                />
                <span className="text-sm font-medium text-black">Featured</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="is_sold"
                  defaultChecked={car.is_sold}
                  value="true"
                  className="w-4 h-4"
                />
                <span className="text-sm font-medium text-black">Sold</span>
              </label>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-black mb-1">
              Image URLs *
            </label>
            <textarea
              name="images"
              defaultValue={car.images.join(', ')}
              required
              rows={4}
              className="w-full border border-gray-300 rounded px-4 py-2 font-mono text-sm focus:outline-none focus:border-black"
            />
            <p className="text-xs text-gray-600 mt-1">
              Comma-separated image URLs
            </p>
          </div>

          {car.is_sold && (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800 font-medium">
                ⚠️ This car is marked as SOLD. It will be automatically deleted from the database after 7 days.
              </p>
            </div>
          )}

          <div className="flex items-center justify-between gap-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting || isSaving}
              className="px-6 py-2 bg-red-600 text-white font-medium rounded hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {isDeleting ? 'Deleting...' : 'Delete Car'}
            </button>
            
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isSaving}
                className="px-6 py-2 border border-gray-300 text-black font-medium rounded hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving || isDeleting}
                className="px-6 py-2 bg-black text-white font-medium rounded hover:bg-gray-800 transition-colors disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}