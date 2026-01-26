import Image from 'next/image';
import Link from 'next/link';
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

  return (
    <Link href={`/car/${car.id}`}>
      <div
        className={`
          overflow-hidden cursor-pointer transition-all rounded-2xl
          ${isDark ? 'border border-gray-100 bg-black text-gray-100' : 'border border-black bg-white text-black'}
          ${isSold ? 'opacity-50' : 'hover:shadow-lg'}
        `}
      >
        {/* Image */}
        <div className={`relative h-64 w-full ${isDark ? 'bg-neutral-900' : 'bg-gray-100'}`}>
          <Image
            src={car.images[0]}
            alt={`${car.brand} ${car.model}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
        <div className="p-6">
          <h3 className="text-2xl font-bold mb-2">
            {car.brand} {car.model}
          </h3>

          {car.variant && (
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
              {car.variant}
            </p>
          )}

          <div className="grid grid-cols-2 gap-3 mb-6 text-sm">
            {car.manufacturing_year && (
              <Spec label="Year" value={car.manufacturing_year} dark={isDark} />
            )}
            {car.fuel_type && (
              <Spec label="Fuel" value={car.fuel_type} dark={isDark} />
            )}
            {car.kms_driven !== null && (
              <Spec label="KM" value={formatKms(car.kms_driven)} dark={isDark} />
            )}
            {car.owner_count !== null && (
              <Spec label="Owners" value={car.owner_count} dark={isDark} />
            )}
            {car.transmission && (
              <Spec label="Trans" value={car.transmission} dark={isDark} />
            )}
            {car.color && (
              <Spec label="Color" value={car.color} dark={isDark} />
            )}
          </div>

          <div className={`pt-4 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="flex items-baseline justify-between">
              <span className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
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
   Small helper for specs
-------------------------------- */
function Spec({
  label,
  value,
  dark,
}: {
  label: string;
  value: string | number;
  dark: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className={dark ? 'text-gray-500' : 'text-gray-500'}>
        {label}:
      </span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
