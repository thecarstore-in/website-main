"use client"
import { Car } from '@/lib/types';
import { updateCar, deleteCar } from './actions';

interface EditCarFormProps {
  car: Car;
}

export default function EditCarForm({ car }: EditCarFormProps) {
  return (
    <div className="border border-gray-200 rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-6 text-black">
        Edit Car: {car.brand} {car.model}
      </h2>
      
      <form action={updateCar.bind(null, car.id)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

        <div>
          <label className="block text-sm font-medium text-black mb-1">
            Image URLs *
          </label>
          <textarea
            name="images"
            defaultValue={car.images.join(', ')}
            placeholder="Enter image URLs separated by commas&#10;Example:&#10;https://cdn.jsdelivr.net/gh/username/repo/cars/swift/1.webp,&#10;https://cdn.jsdelivr.net/gh/username/repo/cars/swift/2.webp"
            required
            rows={4}
            className="w-full border border-gray-300 rounded px-4 py-2 font-mono text-sm focus:outline-none focus:border-black"
          />
          <p className="text-xs text-gray-600 mt-1">
            Use jsDelivr CDN URLs from your GitHub repository
          </p>
        </div>

        {car.is_sold && (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800 font-medium">
              ⚠️ This car is marked as SOLD. It will be automatically deleted from the database after 7 days.
            </p>
          </div>
        )}

        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="flex-1 bg-black text-white px-6 py-3 font-medium rounded hover:bg-gray-800 transition-colors"
          >
            Save Changes
          </button>
          
          <a
            href="/admin-upload-secret?view=listings"
            className="px-6 py-3 border border-gray-300 text-black font-medium rounded hover:bg-gray-100 transition-colors"
          >
            Cancel
          </a>
        </div>
      </form>

      {/* Delete Button - Separate Form */}
      <form action={deleteCar.bind(null, car.id)} className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-red-600 mb-1">Danger Zone</h3>
            <p className="text-sm text-gray-600">
              Once you delete a car, there is no going back. Please be certain.
            </p>
          </div>
          <button
            type="submit"
            onClick={(e) => {
              if (!confirm('Are you sure you want to delete this car? This action cannot be undone.')) {
                e.preventDefault();
              }
            }}
            className="px-6 py-2 bg-red-600 text-white font-medium rounded hover:bg-red-700 transition-colors"
          >
            Delete Car
          </button>
        </div>
      </form>
    </div>
  );
}