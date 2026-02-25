/**
 * Image URL Resolver
 * Handles all image formats stored in database:
 * - Plain URLs: "https://..."
 * - JSON objects: {url: "...", public_id: "..."}
 * - JSON strings: '{"url":"...", "public_id":"..."}'
 * - Double encoded: "{\"url\":\"...\", \"public_id\":\"...\"}"
 */

export function resolveImageUrl(img: any): string {
  if (!img) return '';

  try {
    // Handle string type
    if (typeof img === 'string') {
      const trimmed = img.trim();

      // Check if it's a JSON string
      if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
        try {
          const parsed = JSON.parse(trimmed);

          // If parsed is a string, it's double-encoded - parse again
          if (typeof parsed === 'string') {
            const doubleParsed = JSON.parse(parsed);
            if (doubleParsed?.url) {
              return doubleParsed.url;
            }
          }

          // Single encoding
          if (parsed?.url) {
            return parsed.url;
          }

          return '';
        } catch {
          // Not valid JSON, treat as plain URL
          if (trimmed.startsWith('http')) {
            return trimmed;
          }
          return '';
        }
      }

      // Plain URL string
      if (trimmed.startsWith('http')) {
        return trimmed;
      }

      return '';
    }

    // Handle object type
    if (typeof img === 'object') {
      // Direct object with url property
      if (img.url && typeof img.url === 'string') {
        return img.url;
      }
    }
  } catch (error) {
    console.error('Error resolving image URL:', error, img);
  }

  return '';
}

/**
 * Get first valid image URL from an array
 */
export function getFirstImageUrl(images: any[]): string {
  if (!Array.isArray(images) || images.length === 0) {
    return '';
  }

  for (const img of images) {
    const url = resolveImageUrl(img);
    if (url) {
      return url;
    }
  }

  return '';
}

/**
 * Convert images array to clean URL array
 */
export function resolveImageUrls(images: any[]): string[] {
  if (!Array.isArray(images)) {
    return [];
  }

  return images
    .map(img => resolveImageUrl(img))
    .filter((url): url is string => Boolean(url) && url.length > 0);
}