import React, { useEffect, useRef, useState } from 'react';
import { FaTimes } from 'react-icons/fa';

import { SIZES } from '../../imageSizes';

const BASE = import.meta.env.BASE_URL;

// One line per photo, in the order `npm run images` numbers them. The alt
// text describes what the photo actually shows: a screen reader user gets
// the work rather than eighteen identical "Project photo" labels, and image
// search gets something to index.
const GALLERY_ALTS = [
  'White bay window with a sloped seat board on a painted brick bungalow',
  'Black sliding patio door opening onto a wooden deck',
  'Dark grey sunroom addition with wide sliding glass doors onto a deck',
  'White sliding patio door set into a stucco wall above a deck',
  'Black front door with glass panels and a transom in a red brick entryway',
  'Grey panelled front door with a sidelight and transom in a brick entry',
  'Black front door with sidelights and a transom under a covered porch',
  'White bay window with red trim on a light grey home exterior',
  'White triple slider window on a red and grey panelled wall',
  'Interior view of a white bay window looking out onto an open field',
  'Blue-grey front door with a sidelight and transom on a white porch',
  'Black basement egress window set into a new window well',
  'Interior corner windows with black frames looking onto a garden',
  'Black triple casement window in beige siding on a gable wall',
  'White basement window set into a brick and concrete foundation',
  'Blue-grey craftsman front door with a decorative glass panel in red brick',
  'Black arched-top triple window on a brick gable wall',
  'Interior view of a white bay window in a basement under renovation',
];

// Two renditions per photo, both built by `npm run images`: a square crop for
// the grid and a larger uncropped one the lightbox shows on demand.
const GALLERY_IMAGES = GALLERY_ALTS.map((alt, i) => {
  const name = `gallery-${String(i + 1).padStart(2, '0')}.webp`;
  return {
    thumb: `${BASE}gallery/thumb/${name}`,
    full: `${BASE}gallery/full/${name}`,
    alt,
  };
});

const GallerySection = () => {
  const [lightbox, setLightbox] = useState(null);
  const [errors, setErrors] = useState({});
  // The tile that opened the lightbox, so focus can go back where it was.
  const opener = useRef(null);
  const closeButton = useRef(null);

  const open = (index, element) => {
    opener.current = element;
    setLightbox(index);
  };

  const close = () => {
    setLightbox(null);
    opener.current?.focus();
  };

  // Escape closes it, and the page behind stops scrolling while it is open.
  useEffect(() => {
    if (lightbox === null) return undefined;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('keydown', onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButton.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [lightbox]);

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
                  onClick={(e) => open(index, e.currentTarget)}
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
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-label={GALLERY_IMAGES[lightbox].alt}
        >
          <button
            ref={closeButton}
            className="absolute top-4 right-4 text-white/80 hover:text-white"
            onClick={close}
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
