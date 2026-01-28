'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Car } from '@/lib/types';

interface CarCardProps {
  car: Car;
  isSold?: boolean;
  theme?: 'light' | 'dark';
}

export default function CarCard({
  car,
  isSold = false,
  theme = 'light',
}: CarCardProps) {
  const [isHovered, setIsHovered] = useState(false);

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

  const isDark = theme === 'dark';

  // Hover image logic
  const mainImage = car.images?.[0];
  const hoverImage = car.images?.[1];
  const displayImage = isHovered && hoverImage ? hoverImage : mainImage;

  return (
    <Link href={`/car/${car.id}`}>
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`
          group overflow-hidden cursor-pointer rounded-2xl
          transition-all duration-300 ease-out
          h-full flex flex-col
          ${isDark ? 'border border-gray-100 bg-black text-gray-100' : 'border border-black bg-white text-black'}
          ${isSold ? 'opacity-50' : 'hover:-translate-y-1 hover:shadow-xl'}
        `}
      >
        {/* Image */}
        <div
          className={`relative w-full overflow-hidden ${
            isDark ? 'bg-neutral-900' : 'bg-gray-100'
          }`}
          style={{ height: '240px' }}
        >
          <Image
            src={displayImage}
            alt={`${car.brand} ${car.model}`}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className={`
              object-cover transition-transform duration-500 ease-out
              group-hover:scale-105
            `}
            loading="lazy"
          />

          {isSold && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <span className="text-gray-100 text-3xl font-bold tracking-widest">
                SOLD
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6 flex-1 flex flex-col">
          <h3 className="text-2xl font-bold mb-2 line-clamp-1">
            {car.brand} {car.model}
          </h3>

          {car.variant && (
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} mb-4 line-clamp-1 min-h-[1.5rem]`}>
              {car.variant}
            </p>
          )}

          <div className="grid grid-cols-2 gap-3 mb-6 text-sm flex-1">
            {car.manufacturing_year && (
              <Spec label="Year" value={car.manufacturing_year} />
            )}
            {car.fuel_type && (
              <Spec label="Fuel" value={car.fuel_type} />
            )}
            {car.kms_driven !== null && (
              <Spec label="KM" value={formatKms(car.kms_driven)} />
            )}
            {car.owner_count !== null && (
              <Spec label="Owners" value={car.owner_count} />
            )}
            {car.transmission && (
              <Spec label="Trans" value={car.transmission} />
            )}
            {car.color && <Spec label="Color" value={car.color} />}
          </div>

          <div
            className={`pt-4 border-t ${
              isDark ? 'border-gray-700' : 'border-gray-200'
            }`}
          >
            <div className="flex items-baseline justify-between">
              <span
                className={`${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                } text-sm`}
              >
                Expected Price
              </span>
              <span className="text-2xl font-bold">
                {formatPrice(car.expected_price)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

/* -----------------------------
   Spec helper
-------------------------------- */
function Spec({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-gray-500 whitespace-nowrap">{label}:</span>
      <span className="font-medium truncate">{value}</span>
    </div>
  );
}