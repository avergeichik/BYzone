import React, { useEffect, useState } from 'react';
import { FaStar, FaGoogle } from 'react-icons/fa';

// The worker holds the Places key and the cache. The browser only ever sees
// the finished list.
const API_URL = import.meta.env.VITE_API_URL;
// Not a credential — it only builds the "see all reviews" link.
const PLACE_ID = import.meta.env.VITE_GOOGLE_PLACE_ID;

const StarRating = ({ rating }) => (
  <div className="flex gap-0.5">
    {Array.from({ length: 5 }).map((_, i) => (
      <FaStar key={i} size={16} className={i < rating ? 'text-yellow-400' : 'text-gray-200'} />
    ))}
  </div>
);

const ReviewCard = ({ review }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col gap-4 hover:shadow-md transition-shadow duration-300">
    <div className="flex items-start justify-between">
      <div>
        <p className="font-semibold text-gray-900">{review.name}</p>
        <p className="text-xs text-gray-400 mt-0.5">{review.date}</p>
      </div>
      <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-full">
        <FaGoogle size={12} className="text-blue-500" />
        <span className="text-xs text-gray-500 font-medium">Google</span>
      </div>
    </div>
    <StarRating rating={review.rating} />
    <p className="text-gray-600 text-sm leading-relaxed italic">"{review.text}"</p>
  </div>
);

const SkeletonCard = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col gap-4 animate-pulse">
    <div className="flex items-start justify-between">
      <div className="flex flex-col gap-2">
        <div className="h-4 w-28 bg-gray-200 rounded" />
        <div className="h-3 w-16 bg-gray-100 rounded" />
      </div>
      <div className="h-7 w-20 bg-gray-100 rounded-full" />
    </div>
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="h-4 w-4 bg-gray-200 rounded" />
      ))}
    </div>
    <div className="flex flex-col gap-1.5">
      <div className="h-3 w-full bg-gray-100 rounded" />
      <div className="h-3 w-5/6 bg-gray-100 rounded" />
      <div className="h-3 w-4/6 bg-gray-100 rounded" />
    </div>
  </div>
);

const TRUST_BADGES = [
  { label: '5-Star Rated', sub: 'on Google' },
  { label: '100% Satisfaction', sub: 'guarantee' },
  { label: 'Licensed & Insured', sub: 'for your peace of mind' },
];

async function fetchReviews() {
  const response = await fetch(`${API_URL}/reviews`);
  if (!response.ok) throw new Error(`Reviews endpoint: ${response.status}`);
  const data = await response.json();
  return data.reviews || [];
}

const ReviewsSection = () => {
  const [reviews, setReviews] = useState(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !API_URL) return;
    fetchReviews().then(setReviews).catch(() => setFailed(true));
  }, []);

  // Nothing to show and nothing to say about it: a missing endpoint, a failed
  // fetch or an empty list all mean the section should not be there at all.
  // The page reads perfectly well without it.
  if (!API_URL || failed) return null;

  const loading = reviews === null;
  if (!loading && reviews.length === 0) return null;

  return (
    <section id="reviews" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-brand-green font-semibold text-sm uppercase tracking-widest mb-3">
            Client Reviews
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-blue mb-4">
            What Our Clients Say
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Real feedback from real homeowners. We let our work speak for itself.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {loading
            ? Array.from({ length: 2 }).map((_, i) => <SkeletonCard key={i} />)
            : reviews.map((review, i) => <ReviewCard key={i} review={review} />)}
        </div>

        <div className="mt-8 flex justify-center">
          <a
            href={`https://search.google.com/local/reviews?placeid=${PLACE_ID}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-brand-blue font-medium hover:underline"
          >
            <FaGoogle size={14} className="text-blue-500" />
            See all reviews on Google
          </a>
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-8 text-center">
          {TRUST_BADGES.map(({ label, sub }) => (
            <div key={label} className="flex flex-col items-center">
              <div className="flex mb-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <FaStar key={i} size={14} className="text-yellow-400" />
                ))}
              </div>
              <p className="font-bold text-brand-blue text-sm">{label}</p>
              <p className="text-gray-400 text-xs">{sub}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
