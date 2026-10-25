import React, { useState } from 'react';
import { FaCheckCircle, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

import { SIZES } from '../../imageSizes';

const highlights = [
  'Licensed and insured for your peace of mind',
  'Serving local homeowners with quality workmanship',
  'Windows & doors specialists with broader handyman expertise',
  'Honest communication and transparent pricing',
];

const BASE = import.meta.env.BASE_URL;
const ABOUT_IMAGES = [1, 2, 3, 4].map((n) => ({
  src: `${BASE}about/about-${n}.webp`,
  alt: `Byzone work photo ${n}`,
}));

const AboutSection = () => {
  const [current, setCurrent] = useState(0);
  const prev = () => setCurrent((i) => (i - 1 + ABOUT_IMAGES.length) % ABOUT_IMAGES.length);
  const next = () => setCurrent((i) => (i + 1) % ABOUT_IMAGES.length);

  return (
    <section id="about" className="py-20 bg-surface-gray">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text */}
          <div>
            <p className="text-brand-green font-semibold text-sm uppercase tracking-widest mb-3">
              About Us
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-blue mb-6 leading-tight">
              BYzone construction — Your Reliable Local Home Services Partner
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-6">
              BYzone construction provides practical home improvement services for homeowners who need quality
              work without unnecessary complications. Whether it's a window replacement, a door
              installation, or a list of handyman repairs — we show up on time, work clean, and
              finish the job right.
            </p>
            <p className="text-gray-600 leading-relaxed mb-8">
              We're a local service focused on doing one thing well: making your home better.
              No upsells, no surprises — just honest work at a fair price.
            </p>
            <ul className="space-y-3">
              {highlights.map((item) => (
                <li key={item} className="flex items-start gap-3 text-gray-700">
                  <FaCheckCircle className="text-brand-green mt-0.5 flex-shrink-0" size={18} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Image carousel */}
          <div className="relative">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-xl bg-gray-200 relative">
              <img
                key={ABOUT_IMAGES[current].src}
                src={ABOUT_IMAGES[current].src}
                alt={ABOUT_IMAGES[current].alt}
                width={SIZES.about.width}
                height={SIZES.about.height}
                decoding="async"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <button
                onClick={prev}
                aria-label="Previous photo"
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors duration-200"
              >
                <FaChevronLeft size={16} />
              </button>
              <button
                onClick={next}
                aria-label="Next photo"
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors duration-200"
              >
                <FaChevronRight size={16} />
              </button>
            </div>

            {/* Dots */}
            <div className="flex justify-center gap-2 mt-4">
              {ABOUT_IMAGES.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  aria-label={`Photo ${i + 1}`}
                  className={`w-2.5 h-2.5 rounded-full transition-colors duration-200 ${
                    i === current ? 'bg-brand-green' : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
            {/* Accent badge */}
            <div className="absolute -bottom-4 -left-4 bg-brand-green text-white px-6 py-3 rounded-xl shadow-lg">
              <p className="font-bold text-lg leading-none">Local</p>
              <p className="text-green-100 text-xs mt-1">& Trusted</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
