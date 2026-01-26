import { addCar, addCarsFromCSV } from './actions';

export default function AddCarForm() {
  return (
    <div className="space-y-12">
      {/* Add Single Car Form */}
      <div className="border border-gray-200 rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-6 text-black">Add Single Car</h2>
        <form action={addCar} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Brand *
              </label>
              <input
                type="text"
                name="brand"
                placeholder="e.g. Maruti Suzuki"
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
                placeholder="e.g. Swift"
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
                placeholder="e.g. VXi AMT"
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
                placeholder="e.g. 2021"
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
                placeholder="e.g. 28500"
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
                placeholder="e.g. 685000"
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
                placeholder="e.g. MH12AB1234"
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
                placeholder="e.g. 1"
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
                placeholder="e.g. Pearl Arctic White"
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Insurance Status
              </label>
              <select
                name="insurance_status"
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
                  value="true"
                  className="w-4 h-4"
                />
                <span className="text-sm font-medium text-black">Featured</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="is_sold"
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
              placeholder="Enter image URLs separated by commas&#10;Example:&#10;https://cdn.jsdelivr.net/gh/username/repo/cars/swift/1.webp,&#10;https://cdn.jsdelivr.net/gh/username/repo/cars/swift/2.webp"
              required
              rows={4}
              className="w-full border border-gray-300 rounded px-4 py-2 font-mono text-sm focus:outline-none focus:border-black"
            />
            <p className="text-xs text-gray-600 mt-1">
              Use jsDelivr CDN URLs from your GitHub repository
            </p>
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white px-6 py-3 font-medium rounded hover:bg-gray-800 transition-colors"
          >
            Add Car
          </button>
        </form>
      </div>

      {/* CSV Upload */}
      <div className="border border-gray-200 rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-6 text-black">Bulk Import from CSV</h2>

        <div className="mb-6 p-4 bg-gray-50 border border-gray-300 rounded">
          <h3 className="font-bold mb-2 text-sm text-black">CSV Format Instructions:</h3>
          <div className="text-xs font-mono bg-white p-2 overflow-x-auto mb-3 rounded border border-gray-200">
            brand,model,variant,manufacturing_year,fuel_type,transmission,kms_driven,expected_price,registration_number,owner_count,color,insurance_status,car_type,is_featured,is_sold,images
          </div>
          <div className="text-xs space-y-1 text-gray-700">
            <p>• First row must be the header (column names)</p>
            <p>• Use pipe character (|) to separate multiple image URLs</p>
            <p>• Use lowercase "true" or "false" for is_featured and is_sold</p>
            <p>• Leave cells empty for optional fields</p>
          </div>

          <div className="mt-4 p-3 bg-white border border-gray-200 rounded">
            <p className="text-xs font-bold mb-2 text-black">Example CSV:</p>
            <pre className="text-xs overflow-x-auto text-gray-800">
{`brand,model,variant,manufacturing_year,fuel_type,transmission,kms_driven,expected_price,registration_number,owner_count,color,insurance_status,car_type,is_featured,is_sold,images
Maruti Suzuki,Swift,VXi AMT,2021,Petrol,Automatic,28500,685000,MH12AB1234,1,Pearl Arctic White,Valid,Hatchback,true,false,https://cdn.jsdelivr.net/gh/user/repo/swift/1.webp|https://cdn.jsdelivr.net/gh/user/repo/swift/2.webp`}
            </pre>
          </div>
        </div>

        <form action={addCarsFromCSV} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-black mb-1">
              CSV Content
            </label>
            <textarea
              name="csv"
              placeholder="Paste your CSV content here..."
              rows={12}
              required
              className="w-full border border-gray-300 rounded px-4 py-2 font-mono text-sm focus:outline-none focus:border-black"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white px-6 py-3 font-medium rounded hover:bg-gray-800 transition-colors"
          >
            Import CSV
          </button>
        </form>
      </div>

      {/* Quick Reference */}
      <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
        <h3 className="text-xl font-bold mb-4 text-black">Quick Reference</h3>

        <div className="space-y-4 text-sm">
          <div>
            <h4 className="font-bold mb-1 text-black">Image Hosting Setup:</h4>
            <ol className="list-decimal list-inside space-y-1 text-gray-700">
              <li>Create a public GitHub repository (e.g., "car-images")</li>
              <li>Upload images in organized folders (e.g., /cars/swift/1.webp)</li>
              <li>Use jsDelivr CDN format: https://cdn.jsdelivr.net/gh/username/repo-name/path/to/image.webp</li>
              <li>Recommended: Use WebP format for smaller file sizes</li>
            </ol>
          </div>

          <div>
            <h4 className="font-bold mb-1 text-black">Auto-Delete Feature:</h4>
            <p className="text-gray-700">
              Cars marked as SOLD will be automatically deleted from the database after 7 days.
              This helps keep your inventory clean and up-to-date.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}