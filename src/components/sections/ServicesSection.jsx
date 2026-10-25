import React, { useState } from 'react';
import { FaWindowMaximize, FaHammer, FaHome, FaChevronDown, FaChevronUp } from 'react-icons/fa';

const SERVICE_CATEGORIES = [
  {
    id: 'windows-doors',
    icon: <FaWindowMaximize size={28} />,
    title: 'Windows & Doors',
    description: 'Professional installation, replacement, and repair for all window and door types.',
    services: [
      'Window installation and replacement',
      'Door installation and replacement',
      'Door and window repair',
      'Locks, handles, hinges, and seals',
      'Caulking and sealing around windows and doors',
      'Weatherstripping replacement',
      'Storm door installation',
      'Egress window installation (turn-key service)',
      'Window opening cutting and enlargement',
      'Custom framing and resizing of window and door openings',
      'BAY and BOW window installation',
      'Structural modifications for new window installations',
    ],
  },
  {
    id: 'interior',
    icon: <FaHammer size={28} />,
    title: 'Interior Handyman Services',
    description: 'From drywall repairs to furniture assembly — reliable interior work done right.',
    services: [
      'Wall patching (holes, dents, cracks)',
      'Drywall repair and installation',
      'Ceiling repairs (cracks, water damage, stains)',
      'Floor repairs (loose boards, cracked tiles, squeaky flooring)',
      'Furniture assembly (IKEA, Wayfair, etc.)',
      'Picture, mirror, and shelf hanging',
      'Curtain and blind installation and repair',
      'Cabinet repairs (hinges, handles, alignment)',
      'Caulking and sealing (windows, tubs, sinks)',
      'Touch-up painting and stain repair',
    ],
  },
  {
    id: 'exterior',
    icon: <FaHome size={28} />,
    title: 'Exterior & Home Maintenance',
    description: 'Keep your home protected and looking great inside and out.',
    services: [
      'Grout cleaning and re-grouting',
      'Gutter cleaning and repair',
      'HVAC filter replacement',
      'Dryer vent cleaning',
      'Weatherproofing and insulation checks',
      'Holiday light installation and removal',
      'Deck building and refinishing',
      'Fence installation or painting',
      'Patio or pergola repair',
      'Shed assembly or repair',
      'Gate and latch adjustments',
      'Exterior caulking and sealing',
    ],
  },
];

const ServiceCard = ({ category }) => {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? category.services : category.services.slice(0, 4);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-300 flex flex-col">
      <div className="flex items-center gap-4 mb-4">
        <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-brand-blue/10 flex items-center justify-center text-brand-blue">
          {category.icon}
        </div>
        <h3 className="text-lg font-bold text-brand-blue">{category.title}</h3>
      </div>

      <p className="text-gray-500 text-sm mb-5 leading-relaxed">{category.description}</p>

      <ul className="space-y-2 mb-4 flex-grow">
        {visible.map((service) => (
          <li key={service} className="flex items-start gap-2 text-sm text-gray-700">
            <span className="text-brand-green mt-1 flex-shrink-0">✓</span>
            {service}
          </li>
        ))}
      </ul>

      {category.services.length > 4 && (
        <button
          onClick={() => setExpanded((e) => !e)}
          className="mt-2 flex items-center gap-1 text-sm font-medium text-brand-green hover:text-brand-green-light transition-colors duration-200"
        >
          {expanded ? (
            <>Show less <FaChevronUp size={12} /></>
          ) : (
            <>+{category.services.length - 4} more services <FaChevronDown size={12} /></>
          )}
        </button>
      )}
    </div>
  );
};

const ServicesSection = () => {
  const scrollToContact = () => {
    const el = typeof document !== 'undefined' ? document.getElementById('contact') : null;
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="services" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-brand-green font-semibold text-sm uppercase tracking-widest mb-3">
            What We Do
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-blue mb-4">
            Our Services
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            From a single repair to a full room renovation — By Zone handles it with care and
            attention to detail.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SERVICE_CATEGORIES.map((cat) => (
            <ServiceCard key={cat.id} category={cat} />
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-500 mb-4">Don't see what you need? Just ask.</p>
          <button
            onClick={scrollToContact}
            className="px-8 py-3 rounded-lg text-sm font-bold text-white bg-brand-green hover:bg-brand-green-light transition-colors duration-200 shadow"
          >
            Request a Quote
          </button>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
