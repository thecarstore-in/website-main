"use client";

import { useState } from "react";
import imageCompression from "browser-image-compression";
import { updateCar, deleteCar } from "./actions";
import { Car } from "@/lib/types";

interface EditCarFormProps {
  car: Car;
}

export default function EditCarForm({ car }: EditCarFormProps) {
  const [newImages, setNewImages] = useState<FileList | null>(null);
  const [preview, setPreview] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [remainingImages, setRemainingImages] = useState<any[]>(car.images || []);

  const compressImage = async (file: File) => {
    return await imageCompression(file, {
      maxSizeMB: 0.1,
      maxWidthOrHeight: 1200,
      useWebWorker: true,
      fileType: "image/webp",
    });
  };

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
      { method: "POST", body: formData }
    );

    if (!res.ok) {
      throw new Error("Failed to upload image to Cloudinary");
    }

    const data = await res.json();

    return {
      url: data.secure_url,
      public_id: data.public_id,
    };
  };

  const handleImageChange = (files: FileList | null) => {
    setNewImages(files);
    setError(null);

    if (!files) return;

    const previews = Array.from(files).map((file) =>
      URL.createObjectURL(file)
    );

    setPreview(previews);
  };

  const handleDeleteImage = (indexToDelete: number) => {
    const newRemainingImages = remainingImages.filter((_, i) => i !== indexToDelete);
    setRemainingImages(newRemainingImages);
  };

  // Helper function to extract image URL for display
  const getDisplayUrl = (img: any): string => {
    try {
      if (typeof img === "string" && img) {
        const trimmed = img.trim();
        if (trimmed.charAt(0) === "{" || trimmed.charAt(0) === "[") {
          try {
            const parsed = JSON.parse(img);
            if (typeof parsed === "string") {
              const doubleParsed = JSON.parse(parsed);
              if (doubleParsed && typeof doubleParsed === "object" && doubleParsed.url) {
                return String(doubleParsed.url);
              }
            } else if (parsed && typeof parsed === "object" && parsed.url) {
              return String(parsed.url);
            }
          } catch {
            return img;
          }
        } else {
          return img;
        }
      } else if (img && typeof img === "object") {
        const obj = img as Record<string, any>;
        if (obj.url && typeof obj.url === "string") {
          if (obj.url.startsWith("{") || obj.url.startsWith("[")) {
            try {
              const parsed = JSON.parse(obj.url);
              if (parsed && typeof parsed === "object" && parsed.url) {
                return String(parsed.url);
              }
            } catch {
              return obj.url;
            }
          } else {
            return obj.url;
          }
        }
      }
    } catch (e) {
      console.error("Error extracting display URL:", img, e);
    }
    return "";
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (remainingImages.length === 0 && (!newImages || newImages.length === 0)) {
        setError("At least one image is required");
        setLoading(false);
        return;
      }

      const formData = new FormData(e.currentTarget);

      // Combine remaining images with new uploaded images
      const finalImages: any[] = [...remainingImages];

      if (newImages && newImages.length > 0) {
        const uploadedImages: Array<{ url: string; public_id: string }> = [];

        for (let i = 0; i < newImages.length; i++) {
          const img = await uploadToCloudinary(newImages[i]);
          uploadedImages.push(img);
        }

        finalImages.push(...uploadedImages);
      }

      formData.set("images", JSON.stringify(finalImages));

      await updateCar(car.id, formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  };

  const handleDeleteClick = (e: React.FormEvent<HTMLFormElement>) => {
    if (!confirm("Are you sure you want to delete this car? This action cannot be undone.")) {
      e.preventDefault();
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-6 text-black">
        Edit Car: {car.brand} {car.model}
      </h2>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded text-red-800 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
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
              defaultValue={car.variant || ""}
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
              defaultValue={car.manufacturing_year || ""}
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
              defaultValue={car.fuel_type || ""}
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
              defaultValue={car.transmission || ""}
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
              defaultValue={car.kms_driven || ""}
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
              defaultValue={car.expected_price || ""}
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
              defaultValue={car.registration_number || ""}
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
              defaultValue={car.owner_count || ""}
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
              defaultValue={car.color || ""}
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-1">
              Insurance Status
            </label>
            <select
              name="insurance_status"
              defaultValue={car.insurance_status || ""}
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
              defaultValue={car.car_type || ""}
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
          <label className="block text-sm font-medium text-black mb-2">
            Current Images ({remainingImages?.length || 0})
          </label>

          {remainingImages && remainingImages.length > 0 ? (
            <div className="grid grid-cols-3 gap-3 mb-4">
              {remainingImages.map((img, i) => {
                const imageUrl = getDisplayUrl(img);
                if (!imageUrl) return null;

                return (
                  <div key={i} className="relative group">
                    <img
                      src={imageUrl}
                      alt={`Car ${i + 1}`}
                      className="w-full h-28 object-cover rounded border border-gray-300"
                      onError={(e) => {
                        console.error(`Failed to load image ${i}:`, imageUrl);
                        e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23ddd' width='100' height='100'/%3E%3Ctext x='50' y='50' text-anchor='middle' dy='.3em' fill='%23999' font-size='12'%3EImage Error%3C/text%3E%3C/svg%3E";
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => handleDeleteImage(i)}
                      className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded flex items-center justify-center"
                      title="Delete image"
                    >
                      <span className="text-white font-bold text-lg">✕</span>
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="w-full h-28 bg-gray-100 rounded border border-gray-300 flex items-center justify-center mb-4">
              <span className="text-gray-500">No images</span>
            </div>
          )}

          <label className="block text-sm font-medium text-black mb-1">
            Replace Images (Optional)
          </label>

          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => handleImageChange(e.target.files)}
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-black"
          />

          {preview.length > 0 && (
            <div className="grid grid-cols-3 gap-3 mt-3">
              {preview.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt={`Preview ${i + 1}`}
                  className="w-full h-28 object-cover rounded border"
                />
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-black text-white px-6 py-3 font-medium rounded hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>

          <a
            href="/admin-upload-secret?view=listings"
            className="px-6 py-3 border border-gray-300 text-black font-medium rounded hover:bg-gray-100 transition-colors"
          >
            Cancel
          </a>
        </div>
      </form>

      {/* Delete Form */}
      <form
        action={deleteCar.bind(null, car.id)}
        onSubmit={handleDeleteClick}
        className="mt-6 pt-6 border-t border-gray-200"
      >
        <button
          type="submit"
          className="px-6 py-2 bg-red-600 text-white font-medium rounded hover:bg-red-700 transition-colors"
        >
          Delete Car
        </button>
      </form>
    </div>
  );
}