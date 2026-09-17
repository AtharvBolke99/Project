import React from 'react';

export const DEFAULT_PRODUCT_THUMBNAIL = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80';

/**
 * Returns a normalized URL for thumbnails and asset images.
 * Handles relative paths, /uploads proxy, and absolute URLs.
 */
export const getAssetUrl = (url?: string): string => {
  if (!url || typeof url !== 'string' || url.trim() === '') {
    return DEFAULT_PRODUCT_THUMBNAIL;
  }
  const clean = url.trim();
  if (clean.startsWith('http://') || clean.startsWith('https://')) {
    return clean;
  }
  return clean.startsWith('/') ? clean : `/${clean}`;
};

/**
 * Image error handler that swaps broken image sources with a high-quality fallback image.
 */
export const handleImageError = (
  e: React.SyntheticEvent<HTMLImageElement, Event>,
  fallback: string = DEFAULT_PRODUCT_THUMBNAIL
) => {
  const target = e.currentTarget;
  if (target.src !== fallback) {
    target.onerror = null; // Prevent infinite recursion
    target.src = fallback;
  }
};
