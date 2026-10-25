import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';

import { SIZES } from '../../imageSizes';

const BASE = import.meta.env.BASE_URL;
const GALLERY_COUNT = 19;

// Two renditions per photo, both built by `npm run images`: a square crop for
// the grid and a larger uncropped one the lightbox shows on demand.
const GALLERY_IMAGES = Array.from({ length: GALLERY_COUNT }, (_, i) => {
  const name = `gallery-${String(i + 1).padStart(2, '0')}.webp`;
  return {
    thumb: `${BASE}gallery/thumb/${name}`,
    full: `${BASE}gallery/full/${name}`,
    alt: 'Project photo',
  };
});

const GallerySection = () => {
  const [lightbox, setLightbox] = useState(null);
  const [errors, setErrors] = useState({});

  const handleError = (index) => {
    setErrors((prev) => ({ ...prev, [index]: true }));
  };

  const visibleImages = GALLERY_IMAGES.filter((_, i) => !errors[i]);

  return (
    <section id="gallery" className="py-20 bg-surface-gray">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-brand-green font-semibold text-sm uppercase tracking-widest mb-3">
            Our Work
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-blue mb-4">
            Project Gallery
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Real photos of real work. Clean finishes, quality results.
          </p>
        </div>

        {visibleImages.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {GALLERY_IMAGES.map((img, index) => {
              if (errors[index]) return null;
              return (
                <button
                  key={index}
                  onClick={() => setLightbox(index)}
                  className="group relative aspect-square overflow-hidden rounded-xl bg-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-green"
                >
                  <img
                    src={img.thumb}
                    alt={img.alt}
                    width={SIZES.galleryThumb.width}
                    height={SIZES.galleryThumb.height}
                    loading="lazy"
                    decoding="async"
                    onError={() => handleError(index)}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-brand-blue/0 group-hover:bg-brand-blue/30 transition-colors duration-300 flex items-center justify-center">
                    <span className="text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/50 px-2 py-1 rounded">
                      View
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
            <p className="text-gray-400 text-lg mb-2">Gallery photos coming soon</p>
            <p className="text-gray-400 text-sm">
              Follow us on{' '}
              <a
                href="https://www.instagram.com/BYZONE_CONSTRUCTION/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-green hover:underline"
              >
                @BYZONE_CONSTRUCTION
              </a>{' '}
              for the latest work photos.
            </p>
          </div>
        )}

        <div className="text-center mt-8">
          <a
            href="https://www.instagram.com/BYZONE_CONSTRUCTION/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium text-brand-green hover:text-brand-green-light transition-colors duration-200"
          >
            See more on Instagram →
          </a>
        </div>
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-4 right-4 text-white/80 hover:text-white"
            onClick={() => setLightbox(null)}
            aria-label="Close"
          >
            <FaTimes size={28} />
          </button>
          <img
            src={GALLERY_IMAGES[lightbox].full}
            alt={GALLERY_IMAGES[lightbox].alt}
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </section>
  );
};

export default GallerySection;
