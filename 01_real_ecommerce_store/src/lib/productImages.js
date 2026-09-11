/**
 * Utility functions for handling product image parsing and normalizing multi-image support.
 */

/**
 * Extracts an array of image URLs for any product representation.
 * Handles:
 * - Product objects ({ image_url: '["url1", "url2"]' }, { images: [...] }, etc.)
 * - Direct arrays of image URL strings
 * - JSON-serialized image array strings e.g. '["url1", "url2"]'
 * - Single image URL strings
 * - Default fallback placeholder image
 */
export function getProductImages(input) {
  if (!input) return ["/placeholder.png"];

  // 1. If input is already an array of strings
  if (Array.isArray(input)) {
    const valid = input.filter((img) => typeof img === "string" && img.trim() !== "");
    if (valid.length > 0) return valid;
  }

  // 2. If input is a string (JSON array string, single URL string, or comma-separated string)
  if (typeof input === "string" && input.trim()) {
    const trimmed = input.trim();

    // Check if JSON array string
    if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) {
          const validParsed = parsed.filter((img) => typeof img === "string" && img.trim() !== "");
          if (validParsed.length > 0) return validParsed;
        }
      } catch (e) {
        // Fallthrough if parse fails
      }
    }

    // Check if comma-separated string
    if (trimmed.includes(",")) {
      const split = trimmed
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      if (split.length > 0) return split;
    }

    return [trimmed];
  }

  // 3. If input is an object (e.g. product object or { images: ... } props object)
  if (typeof input === "object") {
    if (input.images) {
      const res = getProductImages(input.images);
      if (res.length > 0 && res[0] !== "/placeholder.png") return res;
    }
    if (input.image_url) {
      const res = getProductImages(input.image_url);
      if (res.length > 0 && res[0] !== "/placeholder.png") return res;
    }
    if (input.image_urls) {
      const res = getProductImages(input.image_urls);
      if (res.length > 0 && res[0] !== "/placeholder.png") return res;
    }
  }

  return ["/placeholder.png"];
}

/**
 * Returns the primary (first) image URL for a product, safe for single <img> or Next <Image> tags.
 */
export function getPrimaryImageUrl(input) {
  const images = getProductImages(input);
  return images[0] || "/placeholder.png";
}
