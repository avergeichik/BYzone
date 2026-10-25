// Mirrors the output sizes in scripts/optimize-images.mjs so components can set
// width/height on <img> and reserve the right box before the file arrives.
// Keep the two in step; the script imports nothing from here on purpose, to
// stay runnable without the app's module resolution.
export const SIZES = {
  galleryThumb: { width: 600, height: 600 },
  galleryFull: { width: 1400, height: 1400 },
  about: { width: 1200, height: 900 },
  hero: { width: 1920, height: 1080 },
  logo: { width: 267, height: 285 },
};
