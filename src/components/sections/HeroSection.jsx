import React from 'react';
import { FaPhone, FaInstagram, FaArrowDown } from 'react-icons/fa';

const HeroSection = () => {
  const scrollTo = (id) => {
    const el = typeof document !== 'undefined' ? document.getElementById(id) : null;
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center bg-gray-900 overflow-hidden"
      style={{
        backgroundImage: `url('${import.meta.env.BASE_URL}hero.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Dark charcoal overlay — contrasts with logo's blue + green */}
      <div className="absolute inset-0 bg-gray-900/85" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20 pb-16">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img
            src={`${import.meta.env.BASE_URL}logo-transparent-bg.png`}
            alt="BYzone construction"
            className="h-28 w-auto drop-shadow-xl"
          />
        </div>

        <p className="text-brand-green font-semibold text-sm uppercase tracking-widest mb-4">
          Trusted family-owned business
        </p>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-6">
          Customized Windows and Doors<br />
          Services &amp; Installation<br />
          <span className="text-gray-300">Home Renovation and Repairs</span>
        </h1>

        <p className="text-lg sm:text-xl text-gray-200 max-w-2xl mx-auto mb-3 leading-relaxed">
          BYzone construction helps homeowners with reliable interior and exterior repairs, home improvement,
          and professional windows and doors work.
        </p>

        <p className="text-base text-gray-400 mb-10 font-medium">
          Simple. Clean. Professional. Local service you can trust.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={() => scrollTo('contact')}
            className="w-full sm:w-auto px-8 py-4 rounded-lg text-base font-bold text-white bg-brand-green hover:bg-brand-green-light transition-colors duration-200 shadow-lg"
          >
            Get a Free Quote
          </button>

          <button
            onClick={() => scrollTo('gallery')}
            className="w-full sm:w-auto px-8 py-4 rounded-lg text-base font-bold text-gray-900 bg-white hover:bg-gray-100 transition-colors duration-200 shadow-lg"
          >
            View Our Work
          </button>

          <a
            href="https://www.instagram.com/BYZONE_CONSTRUCTION/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-lg text-base font-bold text-white border-2 border-white/40 hover:border-white hover:bg-white/10 transition-colors duration-200"
          >
            <FaInstagram size={18} />
            Follow on Instagram
          </a>
        </div>

        {/* Phone CTA */}
        <div className="mt-8">
          <a
            href="tel:+15879986760"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-200 text-sm"
          >
            <FaPhone size={14} />
            <span>Call us for a free estimate</span>
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <button
        onClick={() => scrollTo('about')}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50 hover:text-white transition-colors duration-200 animate-bounce"
        aria-label="Scroll down"
      >
        <FaArrowDown size={20} />
      </button>
    </section>
  );
};

export default HeroSection;
