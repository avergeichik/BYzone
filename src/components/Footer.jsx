import React from "react";
import { FaInstagram, FaPhone, FaEnvelope } from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <img src={`${import.meta.env.BASE_URL}logo-transparent-bg.png`} alt="BYzone construction" className="h-16 w-auto mb-4" />
            <p className="text-gray-300 text-sm font-semibold">BYzone construction</p>
            <p className="text-gray-400 text-sm mt-1">
              Handyman · Windows &amp; Doors · Home Renovation
            </p>
            <p className="text-gray-500 text-sm mt-2">
              Simple. Clean. Professional. Local service you can trust.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              {['about', 'services', 'gallery', 'reviews', 'contact'].map((id) => (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    className="hover:text-white transition-colors duration-200 capitalize"
                  >
                    {id}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-white mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-center gap-2">
                <FaPhone size={14} className="text-brand-green flex-shrink-0" />
                <a href="tel:+15879986760" className="hover:text-white transition-colors duration-200">
                  +1 587-998-6760
                </a>
              </li>
              <li className="flex items-center gap-2">
                <FaEnvelope size={14} className="text-brand-green flex-shrink-0" />
                <a href="mailto:byzoneconstruction@gmail.com" className="hover:text-white transition-colors duration-200">
                  byzoneconstruction@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <FaInstagram size={14} className="text-brand-green flex-shrink-0" />
                <a
                  href="https://www.instagram.com/BYZONE_CONSTRUCTION/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors duration-200"
                >
                  @BYZONE_CONSTRUCTION
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-700 flex flex-col sm:flex-row justify-between items-center gap-2 text-sm text-gray-500">
          <p>© {currentYear} BYzone construction. All rights reserved.</p>
          <p>Serving the local community with quality home services.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
