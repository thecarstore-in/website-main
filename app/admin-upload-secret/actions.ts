'use server';

import { supabaseAdmin, isValidAdminKey } from '@/lib/supabase-admin';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { v2 as cloudinary } from 'cloudinary';

/* -----------------------------
   CLOUDINARY CONFIG
-------------------------------- */
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

/* -----------------------------
   VALIDATE ADMIN
-------------------------------- */
async function validateAdminAccess() {
  const cookieStore = await cookies();
  const apiKey = cookieStore.get('admin_api_key')?.value;

  if (!isValidAdminKey(apiKey)) {
    throw new Error('Unauthorized - Invalid API key');
  }
}

/* -----------------------------
   HELPERS
-------------------------------- */

interface ImageData {
  url: string;
  public_id?: string; // Optional for legacy images
}

function parseImages(imagesRaw: string): ImageData[] {
  try {
    let parsed: any;
    
    // Try to parse as JSON first
    try {
      parsed = JSON.parse(imagesRaw);
    } catch {
      // If JSON parsing fails, it might be a plain string URL
      if (typeof imagesRaw === 'string' && imagesRaw.startsWith('http')) {
        return [{ url: imagesRaw }];
      }
      throw new Error('Could not parse images');
    }
    
    // Handle different formats
    if (typeof parsed === 'string') {
      // Single string URL - check if it's itself JSON (double encoding)
      const trimmed = parsed.trim();
      if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
        try {
          const innerParsed = JSON.parse(parsed);
          if (typeof innerParsed === 'object' && innerParsed.url) {
            return [{ url: innerParsed.url, public_id: innerParsed.public_id }];
          }
        } catch {
          // Not valid JSON, treat as URL
        }
      }
      if (!parsed) throw new Error('Image URL cannot be empty');
      return [{ url: parsed }];
    }
    
    if (Array.isArray(parsed)) {
      if (parsed.length === 0) {
        throw new Error('Images array cannot be empty');
      }

      const validatedImages: ImageData[] = [];
      
      for (const img of parsed) {
        // Handle multiple formats in array:
        if (typeof img === 'string') {
          // Could be plain URL or JSON string
          const trimmed = img.trim();
          if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
            // Try to parse as JSON (handling double encoding)
            try {
              const innerParsed = JSON.parse(img);
              if (typeof innerParsed === 'object' && innerParsed.url) {
                validatedImages.push({
                  url: innerParsed.url,
                  public_id: innerParsed.public_id || undefined,
                });
                continue;
              }
            } catch {
              // Not valid JSON, continue
            }
          }
          // Plain URL string
          if (!img) {
            throw new Error('Image URL cannot be empty');
          }
          validatedImages.push({ url: img });
        } else if (typeof img === 'object' && img !== null) {
          // Image object - extract url
          if (!img.url || typeof img.url !== 'string') {
            console.error('Invalid image object:', img);
            throw new Error('Each image must have a valid url property');
          }
          validatedImages.push({
            url: img.url,
            public_id: img.public_id || undefined,
          });
        } else {
          throw new Error('Each image must be a URL string or image object');
        }
      }

      return validatedImages;
    }
    
    // Single object (not an array)
    if (typeof parsed === 'object' && parsed !== null) {
      if (!parsed.url || typeof parsed.url !== 'string') {
        console.error('Invalid single image object:', parsed);
        throw new Error('Image object must have a valid url property');
      }
      return [{
        url: parsed.url,
        public_id: parsed.public_id || undefined,
      }];
    }
    
    throw new Error('Invalid images format');
  } catch (err) {
    console.error('Image parsing error:', err);
    throw new Error(`Invalid images format: ${err instanceof Error ? err.message : 'Unknown error'}`);
  }
}

async function deleteImagesFromCloudinary(images: ImageData[]) {
  if (!images?.length) return;

  const errors: string[] = [];

  for (const img of images) {
    try {
      // Only delete if public_id exists (skip legacy jsDelivr images)
      if (img?.public_id) {
        await cloudinary.uploader.destroy(img.public_id);
      }
    } catch (err) {
      console.error(`Failed to delete image ${img.public_id}:`, err);
      errors.push(img.public_id || 'unknown');
    }
  }

  if (errors.length > 0) {
    console.warn(`Failed to delete ${errors.length} images from Cloudinary`);
  }
}

// Normalize images to ensure clean format (no double encoding)
function normalizeImagesForStorage(images: ImageData[]): ImageData[] {
  return images.map(img => ({
    url: String(img.url),
    public_id: img.public_id ? String(img.public_id) : undefined,
  }));
}

function buildCarData(formData: FormData, images: ImageData[]) {
  return {
    brand: (formData.get('brand') as string)?.trim(),
    model: (formData.get('model') as string)?.trim(),
    variant: formData.get('variant') || null,
    manufacturing_year: parseInt(formData.get('manufacturing_year') as string) || null,
    fuel_type: formData.get('fuel_type') || null,
    transmission: formData.get('transmission') || null,
    kms_driven: parseInt(formData.get('kms_driven') as string) || null,
    expected_price: parseInt(formData.get('expected_price') as string) || null,
    registration_number: formData.get('registration_number') || null,
    owner_count: parseInt(formData.get('owner_count') as string) || null,
    color: formData.get('color') || null,
    insurance_status: formData.get('insurance_status') || null,
    car_type: formData.get('car_type') || null,
    is_featured: formData.get('is_featured') === 'true',
    is_sold: formData.get('is_sold') === 'true',
    images: normalizeImagesForStorage(images),
  };
}

/* -----------------------------
   ADD CAR
-------------------------------- */
export async function addCar(formData: FormData) {
  await validateAdminAccess();

  const images = parseImages(formData.get('images') as string);
  const carData = buildCarData(formData, images);

  if (!carData.brand || !carData.model) {
    throw new Error('Brand and model are required');
  }

  const { error } = await supabaseAdmin
    .from('cars')
    .insert(carData);

  if (error) {
    console.error('Database error:', error);
    throw new Error(error.message || 'Failed to add car');
  }

  revalidatePath('/');
  revalidatePath('/admin-upload-secret');
  redirect('/admin-upload-secret?view=listings');
}

/* -----------------------------
   UPDATE CAR
-------------------------------- */
export async function updateCar(carId: string, formData: FormData) {
  await validateAdminAccess();

  const newImages = parseImages(formData.get('images') as string);

  // Fetch existing car
  const { data: existingCar, error: fetchError } = await supabaseAdmin
    .from('cars')
    .select('images, is_sold')
    .eq('id', carId)
    .single();

  if (fetchError || !existingCar) {
    throw new Error('Car not found');
  }

  // 🔥 If images changed → delete old Cloudinary images
  const oldImageIds = JSON.stringify(existingCar.images);
  const newImageIds = JSON.stringify(newImages);

  if (oldImageIds !== newImageIds) {
    await deleteImagesFromCloudinary(existingCar.images);
  }

  const updateData: any = buildCarData(formData, newImages);

  // Sold logic
  if (updateData.is_sold && !existingCar.is_sold) {
    updateData.sold_at = new Date().toISOString();
  } else if (!updateData.is_sold) {
    updateData.sold_at = null;
  }

  const { error } = await supabaseAdmin
    .from('cars')
    .update(updateData)
    .eq('id', carId);

  if (error) {
    console.error('Database error:', error);
    throw new Error(error.message || 'Failed to update car');
  }

  revalidatePath('/');
  revalidatePath('/admin-upload-secret');
  revalidatePath(`/car/${carId}`);
  redirect('/admin-upload-secret?view=listings');
}

/* -----------------------------
   DELETE CAR
-------------------------------- */
export async function deleteCar(carId: string) {
  await validateAdminAccess();

  const { data, error: fetchError } = await supabaseAdmin
    .from('cars')
    .select('images')
    .eq('id', carId)
    .single();

  if (fetchError || !data) {
    throw new Error('Car not found');
  }

  if (data?.images && Array.isArray(data.images)) {
    await deleteImagesFromCloudinary(data.images);
  }

  const { error } = await supabaseAdmin
    .from('cars')
    .delete()
    .eq('id', carId);

  if (error) {
    console.error('Database error:', error);
    throw new Error(error.message || 'Failed to delete car');
  }

  revalidatePath('/');
  revalidatePath('/admin-upload-secret');
  redirect('/admin-upload-secret?view=listings');
}

/* -----------------------------
   AUTO DELETE SOLD CARS
-------------------------------- */
export async function autoDeleteSoldCars() {
  await validateAdminAccess();

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const { data: cars, error } = await supabaseAdmin
    .from('cars')
    .select('id, images')
    .eq('is_sold', true)
    .lt('sold_at', sevenDaysAgo.toISOString());

  if (error) {
    console.error('Database error:', error);
    throw new Error(error.message || 'Failed to fetch sold cars');
  }

  if (!cars?.length) return;

  for (const car of cars) {
    try {
      if (car.images && Array.isArray(car.images)) {
        await deleteImagesFromCloudinary(car.images);
      }
      await supabaseAdmin.from('cars').delete().eq('id', car.id);
    } catch (err) {
      console.error(`Failed to delete car ${car.id}:`, err);
    }
  }

  revalidatePath('/');
  revalidatePath('/admin-upload-secret');
}