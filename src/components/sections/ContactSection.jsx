import React, { useState } from 'react';
import { FaPhone, FaEnvelope, FaInstagram, FaMapMarkerAlt } from 'react-icons/fa';

const SERVICE_OPTIONS = [
  'Windows & Doors',
  'Interior Handyman Services',
  'Exterior & Home Maintenance',
  'Other / Not sure',
];

const ContactSection = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [service, setService] = useState('');
  const [message, setMessage] = useState('');
  const [preferredContact, setPreferredContact] = useState('phone');
  const [isLoading, setIsLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setSubmitStatus(null);

    const data = new FormData();
    data.append('name', name);
    data.append('phone', phone);
    data.append('email', email);
    data.append('service', service);
    data.append('message', message);
    data.append('preferredContact', preferredContact);
    data.append('sheetName', 'ByZone');

    try {
      // Points to the serverless SES handler in /api/send-quote.js
      // In local dev this needs a proxy or a deployed URL.
      // Set VITE_QUOTE_API_URL in your .env to override (e.g. your Lambda Function URL).
      const apiUrl = import.meta.env.VITE_QUOTE_API_URL || '/api/send-quote';
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(data)),
      });
      if (response.ok) {
        setSubmitStatus('success');
        setName('');
        setPhone('');
        setEmail('');
        setService('');
        setMessage('');
        setPreferredContact('phone');
      } else {
        setSubmitStatus('error');
      }
    } catch {
      setSubmitStatus('error');
    }
    setIsLoading(false);
  };

  const inputClass =
    'mt-1 block w-full px-3 py-2.5 border border-gray-300 rounded-lg text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent bg-white';
  const labelClass = 'block text-sm font-medium text-gray-700';

  return (
    <section id="contact" className="py-20 bg-surface-gray">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-brand-green font-semibold text-sm uppercase tracking-widest mb-3">
            Get In Touch
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-blue mb-4">
            Request a Free Quote
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Ready to improve your home? Contact BYzone construction for handyman work, renovation support,
            and windows and doors services. Fast response, honest communication, and clean
            professional work.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Contact info */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h3 className="font-bold text-brand-blue text-lg mb-5">Contact Information</h3>
              <ul className="space-y-5">
                <li className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-brand-blue/10 flex items-center justify-center text-brand-blue flex-shrink-0">
                    <FaPhone size={16} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Phone</p>
                    <a
                      href="tel:+15879986760"
                      className="text-gray-700 hover:text-brand-green transition-colors duration-200 font-medium"
                    >
                      +1 587-998-6760
                    </a>
                    <p className="text-xs text-gray-400 mt-0.5">Click to call on mobile</p>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-brand-blue/10 flex items-center justify-center text-brand-blue flex-shrink-0">
                    <FaEnvelope size={16} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Email</p>
                    <a
                      href="mailto:byzoneconstruction@gmail.com"
                      className="text-gray-700 hover:text-brand-green transition-colors duration-200 font-medium"
                    >
                      byzoneconstruction@gmail.com
                    </a>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-brand-blue/10 flex items-center justify-center text-brand-blue flex-shrink-0">
                    <FaMapMarkerAlt size={16} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Service Area</p>
                    <p className="text-gray-700 font-medium">Ottawa, Kanata, Stittsville, Barrhaven, Nepean, Carp, and Carleton Place</p>
                    <p className="text-xs text-gray-400 mt-0.5">Local homeowners welcome</p>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-brand-blue/10 flex items-center justify-center text-brand-blue flex-shrink-0">
                    <FaInstagram size={16} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Instagram</p>
                    <a
                      href="https://www.instagram.com/BYZONE_CONSTRUCTION/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-700 hover:text-brand-green transition-colors duration-200 font-medium"
                    >
                      @BYZONE_CONSTRUCTION
                    </a>
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-brand-blue rounded-2xl p-5 text-white">
              <p className="font-bold text-base mb-1">Prefer to call?</p>
              <p className="text-blue-200 text-sm mb-4">
                Give us a ring and we'll discuss your project and provide a free estimate.
              </p>
              <a
                href="tel:+15879986760"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-brand-green hover:bg-brand-green-light text-white text-sm font-bold transition-colors duration-200"
              >
                <FaPhone size={14} />
                Call Now
              </a>
            </div>
          </div>

          {/* Quote form */}
          <div className="lg:col-span-3 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
            <h3 className="font-bold text-brand-blue text-lg mb-6">Send Us a Message</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className={labelClass}>Full Name *</label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Your name"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="phone" className={labelClass}>Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(555) 000-0000"
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className={labelClass}>Email Address *</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="service" className={labelClass}>Service Needed</label>
                <select
                  id="service"
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  className={inputClass}
                >
                  <option value="">Select a service category…</option>
                  {SERVICE_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="message" className={labelClass}>Describe Your Project *</label>
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  rows={4}
                  placeholder="Tell us what needs to be done, your address or neighbourhood, and any other details…"
                  className={inputClass}
                />
              </div>

              <div>
                <p className={`${labelClass} mb-2`}>Preferred Contact Method</p>
                <div className="flex gap-6">
                  {['phone', 'email'].map((method) => (
                    <label key={method} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="preferredContact"
                        value={method}
                        checked={preferredContact === method}
                        onChange={(e) => setPreferredContact(e.target.value)}
                        className="accent-brand-green"
                      />
                      <span className="text-sm text-gray-700 capitalize">{method}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 px-6 rounded-lg text-sm font-bold text-white bg-brand-green transition-colors duration-200 ${
                  isLoading ? 'opacity-60 cursor-not-allowed' : 'hover:bg-brand-green-light'
                }`}
              >
                {isLoading ? 'Sending…' : 'Send Quote Request'}
              </button>
            </form>

            {submitStatus === 'success' && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-700 text-sm font-medium">
                  ✓ Your message was sent! We'll be in touch shortly.
                </p>
              </div>
            )}
            {submitStatus === 'error' && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">
                  Something went wrong. Please call us directly or try again.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
