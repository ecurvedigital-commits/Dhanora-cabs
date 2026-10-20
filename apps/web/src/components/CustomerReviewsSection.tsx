'use client';

import React, { useState } from 'react';
import { CUSTOMER_REVIEWS } from '../lib/tokens';
import { Star, Quote, CheckCircle, ChevronLeft, ChevronRight, User } from 'lucide-react';

export const CustomerReviewsSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'outstation' | 'yatra'>('all');

  const filteredReviews = CUSTOMER_REVIEWS.filter((rev) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'yatra') return rev.route.toLowerCase().includes('yatra') || rev.route.toLowerCase().includes('kedarnath') || rev.route.toLowerCase().includes('badrinath');
    if (activeTab === 'outstation') return !rev.route.toLowerCase().includes('yatra');
    return true;
  });

  return (
    <section id="reviews" className="py-24 bg-[#EAF1F7] text-[#14263D] relative overflow-hidden border-b border-[#E2E8F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="reviews-header flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#14263D] tracking-tight">
              4.9/5 Rating Across <span className="text-[#92400E]">15,000+ Journeys</span>
            </h2>
            <p className="mt-4 text-[#4B5E76] text-base sm:text-lg leading-relaxed">
              Authentic reviews from families, pilgrims, corporate groups, and tourists who trusted us on the demanding roads of Uttarakhand.
            </p>
          </div>

          {/* Quick metric badges */}
          <div className="flex items-center gap-4 bg-white border border-[#CBD5E1] rounded-3xl p-4 shadow-card">
            <div className="text-center px-3 border-r border-[#E2E8F0]">
              <div className="text-2xl font-black text-[#92400E]">4.9 ★</div>
              <div className="text-xs text-slate-700 font-semibold">Google Reviews</div>
            </div>
            <div className="text-center px-3 border-r border-[#E2E8F0]">
              <div className="text-2xl font-black text-[#14263D]">99.4%</div>
              <div className="text-xs text-slate-700 font-semibold">On-Time Arrival</div>
            </div>
            <div className="text-center px-3">
              <div className="text-2xl font-black text-[#15803D]">100%</div>
              <div className="text-xs text-slate-700 font-semibold">Verified Drivers</div>
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex gap-2 mb-10 overflow-x-auto pb-2 scrollbar-none">
          {[
            { id: 'all', label: 'All Reviews' },
            { id: 'outstation', label: 'Outstation & Airport' },
            { id: 'yatra', label: 'Chardham & Hill Yatra' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-[#14263D] text-white shadow-sm'
                  : 'bg-white text-slate-700 hover:text-[#14263D] border border-[#CBD5E1]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Reviews Grid: Exactly 5 per row on desktop */}
        <div className="reviews-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-3.5">
          {filteredReviews.slice(0, 5).map((review, idx) => (
            <div
              key={idx}
              className="review-card group bg-white border border-[#E2E8F0] hover:border-[#F5BE19] rounded-2xl p-3.5 transition-all duration-300 hover:-translate-y-0.5 shadow-card hover:shadow-card-hover flex flex-col justify-between relative overflow-hidden"
            >
              <div>
                {/* Rating & Route */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-0.5 text-[#F5BE19]">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-[#F5BE19]" />
                    ))}
                  </div>
                  <span className="text-[9px] font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded-full border border-slate-300">
                    Verified
                  </span>
                </div>

                {/* Route & Vehicle Badge */}
                <div className="flex items-center gap-1 mb-2 flex-wrap">
                  <span className="text-xs font-semibold text-[#14263D] bg-[#EAF1F7] px-2 py-1 rounded-md border border-[#CBD5E1] leading-tight break-words">
                    {review.route}
                  </span>
                </div>

                {/* Comment */}
                <p className="text-[#334155] text-xs leading-relaxed italic line-clamp-3">
                  &ldquo;{review.review}&rdquo;
                </p>
              </div>

              {/* Author Footer */}
              <div className="mt-2.5 pt-2 border-t border-[#E2E8F0] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#EAF1F7] border border-[#CBD5E1] flex items-center justify-center text-[#14263D] font-bold text-xs">
                    {review.author.charAt(0)}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#14263D] group-hover:text-[#92400E] transition-colors truncate">
                      {review.author}
                    </div>
                    <div className="text-xs text-slate-700 font-medium truncate">{review.location}</div>
                  </div>
                </div>

                <div className="flex items-center gap-0.5 text-[#15803D] text-[9px] font-semibold bg-[#DCFCE7] px-1.5 py-0.5 rounded border border-[#86EFAC]">
                  <CheckCircle className="w-2.5 h-2.5" />
                  <span>5★</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
