import React from 'react';
import { Helmet } from 'react-helmet-async';

import HeroSection from '../components/sections/HeroSection';
import AboutSection from '../components/sections/AboutSection';
import ServicesSection from '../components/sections/ServicesSection';
import GallerySection from '../components/sections/GallerySection';
import ReviewsSection from '../components/sections/ReviewsSection';
import WhyChooseUsSection from '../components/sections/WhyChooseUsSection';
import ContactSection from '../components/sections/ContactSection';

const Home = () => {
  return (
    <>
      <Helmet>
        <title>BYzone construction — Handyman, Windows &amp; Doors, Home Renovation</title>
        <meta
          name="description"
          content="BYzone construction offers professional handyman services, windows and doors installation, and home renovation. Licensed and insured. Call for a free quote."
        />
        <meta name="keywords" content="handyman services, windows and doors installation, home renovation, door replacement, window replacement, drywall repair, home maintenance" />
        <meta property="og:title" content="BYzone construction — Handyman &amp; Home Renovation Services" />
        <meta
          property="og:description"
          content="Professional handyman, windows &amp; doors, and home renovation services. Licensed, insured, and locally owned."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://byzoneconstruction.ca/" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href="https://byzoneconstruction.ca/" />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'LocalBusiness',
          name: 'BYzone construction',
          description: 'Handyman, home renovation, windows and doors services',
          telephone: '+1 587-998-6760',
          email: 'byzoneconstruction@gmail.com',
          address: {
            '@type': 'PostalAddress',
            addressLocality: 'Ottawa',
            addressRegion: 'ON',
          },
          sameAs: ['https://www.instagram.com/BYZONE_CONSTRUCTION/'],
        })}</script>
      </Helmet>

      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <GallerySection />
      <ReviewsSection />
      <WhyChooseUsSection />
      <ContactSection />
    </>
  );
};

export default Home;
