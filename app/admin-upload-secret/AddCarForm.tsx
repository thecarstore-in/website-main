"use client";

import { useState } from "react";
import imageCompression from "browser-image-compression";
import { addCar } from "./actions";

export default function AddCarForm() {
  const [images, setImages] = useState<FileList | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 🔥 Compress image under 100KB
  const compressImage = async (file: File) => {
    return await imageCompression(file, {
      maxSizeMB: 0.1,
      maxWidthOrHeight: 1200,
      useWebWorker: true,
      fileType: "image/webp",
    });
  };

  // 🔥 Upload to Cloudinary (returns full image object with public_id)
  const uploadToCloudinary = async (file: File) => {
    const compressed = await compressImage(file);

    const formData = new FormData();
    formData.append("file", compressed);
    formData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!
    );

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();
    return {
      url: data.secure_url,
      public_id: data.public_id,
    };
  };

  // 🔥 Handle submit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!images || images.length === 0) {
        setError("Please select at least one image");
        setLoading(false);
        return;
      }

      const formData = new FormData(e.currentTarget);
      const uploadedImages: Array<{ url: string; public_id: string }> = [];

      for (let i = 0; i < images.length; i++) {
        const imageObj = await uploadToCloudinary(images[i]);
        uploadedImages.push(imageObj);
      }

      // Send as JSON string
      formData.set("images", JSON.stringify(uploadedImages));

      await addCar(formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  };

  return (
    <div className="space-y-12">
      <div className="border border-gray-200 rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-6 text-black">Add Single Car</h2>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded text-red-800 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 🔹 BRAND */}
            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Brand *
              </label>
              <input
                type="text"
                name="brand"
                required
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-black"
              />
            </div>

            {/* 🔹 MODEL */}
            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Model *
              </label>
              <input
                type="text"
                name="model"
                required
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-black"
              />
            </div>

            {/* 🔹 VARIANT */}
            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Variant
              </label>
              <input
                type="text"
                name="variant"
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-black"
              />
            </div>

            {/* 🔹 MANUFACTURING YEAR */}
            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Manufacturing Year
              </label>
              <input
                type="number"
                name="manufacturing_year"
                min="1980"
                max="2026"
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-black"
              />
            </div>

            {/* 🔹 FUEL TYPE */}
            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Fuel Type
              </label>
              <select
                name="fuel_type"
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-black"
              >
                <option value="">Select</option>
                <option value="Petrol">Petrol</option>
                <option value="Diesel">Diesel</option>
                <option value="CNG">CNG</option>
                <option value="Electric">Electric</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>

            {/* 🔹 TRANSMISSION */}
            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Transmission
              </label>
              <select
                name="transmission"
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-black"
              >
                <option value="">Select</option>
                <option value="Manual">Manual</option>
                <option value="Automatic">Automatic</option>
                <option value="AMT">AMT</option>
                <option value="CVT">CVT</option>
                <option value="DCT">DCT</option>
              </select>
            </div>

            {/* 🔹 KMS DRIVEN */}
            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Kilometers Driven
              </label>
              <input
                type="number"
                name="kms_driven"
                min="0"
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-black"
              />
            </div>

            {/* 🔹 EXPECTED PRICE */}
            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Expected Price (₹)
              </label>
              <input
                type="number"
                name="expected_price"
                min="0"
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-black"
              />
            </div>

            {/* 🔹 REGISTRATION */}
            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Registration Number
              </label>
              <input
                type="text"
                name="registration_number"
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-black"
              />
            </div>

            {/* 🔹 OWNER COUNT */}
            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Owner Count
              </label>
              <input
                type="number"
                name="owner_count"
                min="1"
                max="10"
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-black"
              />
            </div>

            {/* 🔹 COLOR */}
            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Color
              </label>
              <input
                type="text"
                name="color"
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-black"
              />
            </div>

            {/* 🔹 INSURANCE */}
            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Insurance Status
              </label>
              <select
                name="insurance_status"
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-black"
              >
                <option value="">Select</option>
                <option value="Valid">Valid</option>
                <option value="Expired">Expired</option>
                <option value="Third Party">Third Party</option>
                <option value="Comprehensive">Comprehensive</option>
              </select>
            </div>

            {/* 🔹 CAR TYPE */}
            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Car Type
              </label>
              <select
                name="car_type"
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-black"
              >
                <option value="">Select</option>
                <option value="Hatchback">Hatchback</option>
                <option value="Sedan">Sedan</option>
                <option value="SUV">SUV</option>
                <option value="MUV">MUV</option>
                <option value="Luxury">Luxury</option>
              </select>
            </div>
          </div>

          {/* 🔥 IMAGE UPLOAD SECTION */}
          <div>
            <label className="block text-sm font-medium text-black mb-1">
              Upload Images (Max 12) *
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => setImages(e.target.files)}
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-black"
            />
            <p className="text-xs text-gray-600 mt-1">
              Images auto compressed under 100KB and uploaded securely.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white px-6 py-3 font-medium rounded hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Uploading..." : "Add Car"}
          </button>
        </form>
      </div>
    </div>
  );
}