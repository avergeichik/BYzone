import React from 'react';
import {
  FaShieldAlt,
  FaStar,
  FaTools,
  FaWindowMaximize,
  FaComments,
} from 'react-icons/fa';

const REASONS = [
  {
    icon: <FaStar size={24} />,
    title: 'Professional & Careful Work',
    description:
      'Every job is treated with the same level of care — whether it\'s a small repair or a full installation.',
  },
  {
    icon: <FaTools size={24} />,
    title: 'Clean Finish & Attention to Detail',
    description:
      'We clean up after ourselves and take pride in leaving every space better than we found it.',
  },
  {
    icon: <FaShieldAlt size={24} />,
    title: 'Interior and Exterior Services',
    description:
      'One call covers it all — from indoor handyman repairs to outdoor home maintenance.',
  },
  {
    icon: <FaWindowMaximize size={24} />,
    title: 'Windows & Doors Specialization',
    description:
      'Our featured expertise: professional window and door installation, replacement, and repair.',
  },
  {
    icon: <FaComments size={24} />,
    title: 'Honest Communication',
    description:
      'Clear quotes, no hidden fees, and straightforward updates throughout your project.',
  },
];

const WhyChooseUsSection = () => {
  return (
    <section className="py-20 bg-brand-blue">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-brand-green font-semibold text-sm uppercase tracking-widest mb-3">
            Why By Zone
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            Why Choose Us
          </h2>
          <p className="text-blue-200 max-w-xl mx-auto">
            We built BYzone construction around the values homeowners care about most.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {REASONS.map((reason) => (
            <div
              key={reason.title}
              className="bg-white/10 rounded-2xl p-6 hover:bg-white/15 transition-colors duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-brand-green/20 flex items-center justify-center text-brand-green mb-4">
                {reason.icon}
              </div>
              <h3 className="font-bold text-white text-base mb-2">{reason.title}</h3>
              <p className="text-blue-200 text-sm leading-relaxed">{reason.description}</p>
            </div>
          ))}

          {/* CTA card */}
          <div className="bg-brand-green rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-white text-base mb-2">Ready to Get Started?</h3>
              <p className="text-green-100 text-sm leading-relaxed mb-6">
                Contact us today for a free, no-obligation quote on your next home project.
              </p>
            </div>
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                const el = typeof document !== 'undefined' ? document.getElementById('contact') : null;
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-block px-6 py-3 rounded-lg text-sm font-bold text-brand-green bg-white hover:bg-gray-100 transition-colors duration-200 text-center"
            >
              Request a Free Quote
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUsSection;
