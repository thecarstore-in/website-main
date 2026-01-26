'use server';

import { supabaseAdmin } from '@/lib/supabase-admin';
import { revalidatePath } from 'next/cache';

/* -----------------------------
   ADD SINGLE CAR
-------------------------------- */
export async function addCar(formData: FormData) {
  const imagesRaw = formData.get('images') as string;

  if (!imagesRaw) {
    throw new Error('Images are required');
  }

  const images = imagesRaw
    .split(',')
    .map(url => url.trim())
    .filter(Boolean);

  if (images.length === 0) {
    throw new Error('At least one image URL is required');
  }

  const carData = {
    brand: (formData.get('brand') as string)?.trim(),
    model: (formData.get('model') as string)?.trim(),
    variant: (formData.get('variant') as string) || null,
    manufacturing_year: parseInt(formData.get('manufacturing_year') as string) || null,
    fuel_type: formData.get('fuel_type') as string || null,
    transmission: formData.get('transmission') as string || null,
    kms_driven: parseInt(formData.get('kms_driven') as string) || null,
    expected_price: parseInt(formData.get('expected_price') as string) || null,
    registration_number: formData.get('registration_number') as string || null,
    owner_count: parseInt(formData.get('owner_count') as string) || null,
    color: formData.get('color') as string || null,
    insurance_status: formData.get('insurance_status') as string || null,
    car_type: formData.get('car_type') as string || null,
    is_featured: formData.get('is_featured') === 'true',
    is_sold: formData.get('is_sold') === 'true',
    images,
  };

  if (!carData.brand || !carData.model) {
    throw new Error('Brand and model are required');
  }

  const { error } = await supabaseAdmin
    .from('cars')
    .insert(carData);

  if (error) {
    throw new Error(`Failed to add car: ${error.message}`);
  }

  revalidatePath('/');
  revalidatePath('/admin-upload-secret');
}

/* -----------------------------
   UPDATE CAR
-------------------------------- */
export async function updateCar(carId: string, formData: FormData) {
  const imagesRaw = formData.get('images') as string;

  if (!imagesRaw) {
    throw new Error('Images are required');
  }

  const images = imagesRaw
    .split(',')
    .map(url => url.trim())
    .filter(Boolean);

  if (images.length === 0) {
    throw new Error('At least one image URL is required');
  }

  const carData = {
    brand: (formData.get('brand') as string)?.trim(),
    model: (formData.get('model') as string)?.trim(),
    variant: (formData.get('variant') as string) || null,
    manufacturing_year: parseInt(formData.get('manufacturing_year') as string) || null,
    fuel_type: formData.get('fuel_type') as string || null,
    transmission: formData.get('transmission') as string || null,
    kms_driven: parseInt(formData.get('kms_driven') as string) || null,
    expected_price: parseInt(formData.get('expected_price') as string) || null,
    registration_number: formData.get('registration_number') as string || null,
    owner_count: parseInt(formData.get('owner_count') as string) || null,
    color: formData.get('color') as string || null,
    insurance_status: formData.get('insurance_status') as string || null,
    car_type: formData.get('car_type') as string || null,
    is_featured: formData.get('is_featured') === 'true',
    is_sold: formData.get('is_sold') === 'true',
    images,
  };

  if (!carData.brand || !carData.model) {
    throw new Error('Brand and model are required');
  }

  // If car is marked as sold, set sold_at timestamp for auto-deletion after 7 days
  const updateData: any = { ...carData };
  
  if (carData.is_sold) {
    // Check if it wasn't sold before
    const { data: existingCar } = await supabaseAdmin
      .from('cars')
      .select('is_sold, sold_at')
      .eq('id', carId)
      .single();
    
    // Only set sold_at if car wasn't already sold
    if (existingCar && !existingCar.is_sold) {
      updateData.sold_at = new Date().toISOString();
    }
  } else {
    // If unmarking as sold, clear the sold_at timestamp
    updateData.sold_at = null;
  }

  const { error } = await supabaseAdmin
    .from('cars')
    .update(updateData)
    .eq('id', carId);

  if (error) {
    throw new Error(`Failed to update car: ${error.message}`);
  }

  revalidatePath('/');
  revalidatePath('/admin-upload-secret');
  revalidatePath(`/car/${carId}`);
}

/* -----------------------------
   DELETE CAR
-------------------------------- */
export async function deleteCar(carId: string) {
  const { error } = await supabaseAdmin
    .from('cars')
    .delete()
    .eq('id', carId);

  if (error) {
    throw new Error(`Failed to delete car: ${error.message}`);
  }

  revalidatePath('/');
  revalidatePath('/admin-upload-secret');
}

/* -----------------------------
   ADD CARS FROM CSV
-------------------------------- */
export async function addCarsFromCSV(formData: FormData) {
  const csvText = formData.get('csv') as string;

  if (!csvText) {
    throw new Error('CSV data is required');
  }

  const lines = csvText.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim());

  const cars: any[] = [];

  for (let i = 1; i < lines.length; i++) {
    if (!lines[i]) continue;

    const values = lines[i].split(',').map(v => v.trim());
    const car: any = {};

    headers.forEach((header, index) => {
      const value = values[index];

      if (!value) {
        car[header] = null;
        return;
      }

      if (header === 'images') {
        car.images = value
          .split('|')
          .map(url => url.trim())
          .filter(Boolean);
      } else if (
        ['manufacturing_year', 'kms_driven', 'expected_price', 'owner_count'].includes(header)
      ) {
        car[header] = parseInt(value) || null;
      } else if (['is_featured', 'is_sold'].includes(header)) {
        car[header] = value.toLowerCase() === 'true';
      } else {
        car[header] = value;
      }
    });

    if (!car.brand || !car.model || !car.images?.length) {
      continue; // skip invalid rows
    }

    cars.push(car);
  }

  if (cars.length === 0) {
    throw new Error('No valid cars found in CSV');
  }

  const { error } = await supabaseAdmin
    .from('cars')
    .insert(cars);

  if (error) {
    throw new Error(`Failed to import CSV: ${error.message}`);
  }

  revalidatePath('/');
  revalidatePath('/admin-upload-secret');
}

/* -----------------------------
   AUTO-DELETE SOLD CARS (Cron Job)
   Call this from a cron endpoint
-------------------------------- */
export async function autoDeleteSoldCars() {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const { error } = await supabaseAdmin
    .from('cars')
    .delete()
    .eq('is_sold', true)
    .lt('sold_at', sevenDaysAgo.toISOString());

  if (error) {
    throw new Error(`Failed to auto-delete sold cars: ${error.message}`);
  }

  revalidatePath('/');
  revalidatePath('/admin-upload-secret');
}