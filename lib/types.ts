export interface CarImage {
  url: string;
  public_id?: string; // Optional for legacy jsDelivr images
}

export interface Car {
  id: string;
  brand: string;
  model: string;
  variant: string | null;
  manufacturing_year: number | null;
  fuel_type: string | null;
  transmission: string | null;
  kms_driven: number | null;
  expected_price: number | null;
  registration_number: string | null;
  owner_count: number | null;
  color: string | null;
  insurance_status: string | null;
  car_type: string | null;
  is_featured: boolean;
  is_sold: boolean;
  sold_at: string | null;
  created_at: string;
  images: CarImage[];
}

export interface CarFilters {
  brand?: string;
  carType?: string;
}