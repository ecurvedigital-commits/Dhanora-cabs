'use client';

import React from 'react';
import Link from 'next/link';
import {
  Mountain,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { TOUR_PACKAGES, BRAND_TOKENS } from '../lib/tokens';
import { triggerBookingSelect } from '../lib/booking-events';

export function TourPackagesSection() {
  return (
    <section id="tours" className="py-14 sm:py-20 px-4 bg-[#EAF1F7] relative border-b border-[#E2E8F0]">
      <div className="w-full max-w-[1400px] mx-auto px-2 sm:px-6 xl:px-8 space-y-10 sm:space-y-12">
        {/* Section Header */}
        <div className="tour-header text-center max-w-3xl mx-auto space-y-3">
          <h2 className="font-display font-black text-3xl sm:text-4xl text-[#14263D] tracking-tight">
            Chardham Yatra & Uttarakhand Tour Packages
          </h2>
          <p className="text-[#4B5E76] text-sm sm:text-base leading-relaxed">
            Private holiday and yatra tours from Dehradun.
            Enjoy a private cab, a caring local driver, and flexible stops at every temple and viewpoint.
          </p>
        </div>

        {/* Packages Cards Grid: Exactly 5 per row on desktop */}
        <div className="tour-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
          {[
            {
              ...TOUR_PACKAGES[0]!,
              image: '/images/tours/chardham-kedarnath.jpg',
            },
            {
              ...TOUR_PACKAGES[1]!,
              image: '/images/tours/do-dham-badrinath.jpg',
            },
            {
              ...TOUR_PACKAGES[2]!,
              image: '/images/tours/mussoorie-dhanaulti.jpg',
            },
            {
              ...TOUR_PACKAGES[3]!,
              image: '/images/tours/rishikesh-rafting.jpg',
            },
            {
              id: 'haridwar-rishikesh-divine',
              title: 'Haridwar & Rishikesh Divine Tour',
              duration: '1 Day / Return',
              startingPrice: 2499,
              placesCovered: ['Har Ki Pauri', 'Triveni Ghat', 'Ram Jhula'],
              description: 'Holy Ganga Aarti pilgrimage & temple darshan with dedicated private cab.',
              badge: 'Same Day',
              season: 'All Year Round',
              image: '/images/tours/haridwar-ganga-aarti.jpg',
            },
          ].map((pkg) => (
            <div
              key={pkg.id}
              className="tour-card rounded-2xl bg-white border border-[#E2E8F0] hover:border-[#F5BE19] overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 shadow-card hover:shadow-card-hover group"
            >
                {/* Visual Image Header with Zoom Micro-Animation */}
              <div className="relative h-32 sm:h-36 w-full overflow-hidden bg-slate-100">
                <img
                  src={pkg.image}
                  alt={pkg.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10" />

                {/* Duration Badge */}
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#0F172A] text-white border border-white/30 flex items-center gap-1 shadow-sm">
                  <Clock className="w-2.5 h-2.5 text-[#F5BE19]" />
                  {pkg.duration}
                </span>

                {/* Optional Tag Badge */}
                {pkg.badge && (
                  <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[9px] font-black bg-[#F5BE19] text-[#14263D] shadow-sm">
                    {pkg.badge}
                  </span>
                )}

                {/* Overlay Title - multi-line without truncation */}
                <div className="absolute bottom-2 left-2.5 right-2.5">
                  <span className="inline-block bg-[#0F172A] border border-white/20 px-2 py-0.5 rounded-md">
                    <h3 className="font-display font-bold text-xs sm:text-[13px] text-white leading-tight line-clamp-2">
                      {pkg.title}
                    </h3>
                  </span>
                </div>
              </div>

              {/* Content Area */}
              <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2.5">
                <div>
                  {/* Places Covered Pills */}
                  <div className="flex flex-wrap gap-1 mb-2">
                    {pkg.placesCovered.slice(0, 3).map((place, idx) => (
                      <span
                        key={idx}
                        className="text-[9px] px-1.5 py-0.5 rounded bg-[#F8F7F2] border border-[#E2E8F0] text-[#334155] font-medium"
                      >
                        {place}
                      </span>
                    ))}
                  </div>

                  <p className="text-[10px] sm:text-[11px] text-[#4B5E76] leading-relaxed line-clamp-2 min-h-[2rem]">
                    {pkg.description}
                  </p>
                </div>

                {/* Bottom Price & CTA */}
                <div className="pt-2.5 border-t border-[#E2E8F0] space-y-2">
                  <div className="flex items-baseline justify-between">
                    <span className="text-[9px] text-slate-700 uppercase font-bold">Pricing</span>
                    <span className="font-display font-bold text-xs sm:text-sm text-[#14263D]">
                      On Request
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      type="button"
                      onClick={() =>
                        triggerBookingSelect({
                          pickup: 'Dehradun / Haridwar',
                          drop: pkg.title,
                          tab: 'TOUR_PACKAGE',
                          vehicleId: 'suv-innova',
                        })
                      }
                      className="py-1.5 px-2 rounded-lg bg-[#F5BE19] hover:bg-[#DFAC13] text-[#14263D] text-[10px] font-black text-center transition-all shadow-sm cursor-pointer"
                    >
                      Book Yatra
                    </button>
                    <Link
                      href={pkg.id === 'haridwar-rishikesh-divine' ? '/routes/dehradun-rishikesh' : `/packages/${pkg.id}`}
                      className="py-1.5 px-2 rounded-lg bg-[#EAF1F7] hover:bg-[#CBD5E1] text-[#14263D] text-[10px] font-bold text-center border border-[#CBD5E1] transition-all"
                    >
                      Itinerary
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pilgrimage Support Notice */}
        <div className="p-6 sm:p-7 rounded-3xl bg-white border border-[#CBD5E1] shadow-card flex flex-col md:flex-row items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#DCFCE7] border border-[#86EFAC] flex items-center justify-center text-[#15803D] shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-display font-bold text-base text-[#14263D]">
                Chardham Bio-Metric Registration & Medical Checklist Assistance
              </h4>
              <p className="text-xs sm:text-sm text-[#4B5E76] mt-0.5">
                Our drivers guide you through Uttarakhand Tourism Yatra E-Pass registration, Sonprayag shuttle queues, and high-altitude health protocols.
              </p>
            </div>
          </div>
          <a
            href={BRAND_TOKENS.phoneCallUrl}
            className="px-5 py-3 rounded-xl bg-[#B91C1C] hover:bg-[#991B1B] text-white text-xs font-bold whitespace-nowrap shadow-sm transition-all"
          >
            Speak to Yatra Expert
          </a>
        </div>
      </div>
    </section>
  );
}
