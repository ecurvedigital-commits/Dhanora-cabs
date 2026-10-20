'use client';

import React from 'react';
import Link from 'next/link';
import { BRAND_TOKENS } from '@/lib/tokens';
import { Phone, Mail, MapPin, MessageSquare, Clock, ArrowUp } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-white text-[#4B5E76] border-t border-[#E2E8F0] relative">
      {/* High-Impact CTA Banner - Pale blue-grey background with deep navy text */}
      <div className="relative border-b border-[#CBD5E1] overflow-hidden bg-[#EAF1F7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 text-center lg:text-left">
            <div className="max-w-2xl">
              <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#14263D] tracking-tight">
                Ready to Experience Uttarakhand’s <span className="text-[#92400E]">Finest Cabs?</span>
              </h3>
              <p className="mt-3 text-[#4B5E76] text-base sm:text-lg">
                Book in under 60 seconds. Guaranteed mountain-certified drivers, GPS-tracked vehicles, and completely transparent billing.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <a
                href="#booking"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#F5BE19] hover:bg-[#DFAC13] text-[#14263D] font-bold text-base text-center transition-all shadow-button-yellow hover:scale-105"
              >
                Book Cab Now
              </a>
              <a
                href={`tel:${BRAND_TOKENS.contact.phone.replace(/[^0-9+]/g, '')}`}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#B91C1C] hover:bg-[#991B1B] text-white font-bold text-base text-center transition-all shadow-sm flex items-center justify-center gap-2 focus:ring-2 focus:ring-[#B91C1C] focus:ring-offset-2"
                aria-label={`Call 24x7 support at ${BRAND_TOKENS.contact.phone}`}
              >
                <Phone className="w-5 h-5" aria-hidden="true" />
                <span>Call {BRAND_TOKENS.contact.phone}</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Col 1: Brand Info (Spans 2 cols on lg) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/images/logo.jpg"
                alt="Dhanora Cab Service"
                className="w-12 h-12 rounded-full object-cover border-2 border-[#F5BE19] shadow-sm shrink-0"
              />
              <div className="leading-tight">
                <span className="text-2xl font-black text-[#14263D] tracking-wider block">
                  DHANORA <span className="text-[#92400E]">CAB</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-700">
                  Safe • Comfortable • On Time
                </span>
              </div>
            </div>

            <p className="text-sm text-[#4B5E76] leading-relaxed max-w-sm">
              Uttarakhand&apos;s trusted taxi service for local city rides, airport transfers, outstation journeys, and Chardham Yatra pilgrimages.
            </p>

            <div className="space-y-2 pt-1 text-xs text-[#334155]">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#F5BE19] shrink-0 mt-0.5" />
                <span>Ring Road, Upper Nathanpur, Dehradun, Uttarakhand 248001</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#B91C1C] shrink-0" />
                <a href={BRAND_TOKENS.phoneCallUrl} className="text-[#14263D] hover:text-[#92400E] font-bold">
                  {BRAND_TOKENS.phonePrimary}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#92400E] shrink-0" />
                <a href={`mailto:${BRAND_TOKENS.email}`} className="text-[#14263D] hover:text-[#92400E]">
                  {BRAND_TOKENS.email}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-[#15803D] shrink-0" />
                <span className="text-[#4B5E76] font-medium">Available 24 Hours / 7 Days a Week</span>
              </div>
            </div>

            <div className="pt-2">
              <a
                href={BRAND_TOKENS.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#15803D] hover:bg-[#166534] text-white font-bold text-xs transition-all shadow-sm"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp Direct Support</span>
              </a>
            </div>
          </div>

          {/* Col 2: Taxi Services */}
          <div>
            <h4 className="text-[#14263D] font-bold text-sm mb-4 border-l-2 border-[#F5BE19] pl-2.5">
              Taxi Services
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/services" className="hover:text-[#92400E] transition-colors block py-0.5">
                  Dehradun Local Taxi
                </Link>
              </li>
              <li>
                <Link href="/routes" className="hover:text-[#92400E] transition-colors block py-0.5">
                  Outstation Cabs
                </Link>
              </li>
              <li>
                <Link href="/routes/dehradun-airport" className="hover:text-[#92400E] transition-colors block py-0.5">
                  Jolly Grant Airport Taxi
                </Link>
              </li>
              <li>
                <Link href="/packages/chardham-full" className="hover:text-[#92400E] transition-colors block py-0.5">
                  Chardham Yatra Cabs
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-[#92400E] transition-colors block py-0.5">
                  Tempo Traveller Rentals
                </Link>
              </li>
              <li>
                <Link href="/track" className="hover:text-[#92400E] text-[#14263D] font-bold transition-colors block py-0.5">
                  Track Your Booking
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Popular Intercity Routes */}
          <div>
            <h4 className="text-[#14263D] font-bold text-sm mb-4 border-l-2 border-[#B91C1C] pl-2.5">
              Popular Routes
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/routes/dehradun-delhi" className="hover:text-[#92400E] transition-colors block py-0.5">
                  Dehradun to Delhi NCR
                </Link>
              </li>
              <li>
                <Link href="/routes/dehradun-mussoorie" className="hover:text-[#92400E] transition-colors block py-0.5">
                  Dehradun to Mussoorie
                </Link>
              </li>
              <li>
                <Link href="/routes/dehradun-airport" className="hover:text-[#92400E] transition-colors block py-0.5">
                  Dehradun to Jolly Grant Airport
                </Link>
              </li>
              <li>
                <Link href="/routes/dehradun-haridwar" className="hover:text-[#92400E] transition-colors block py-0.5">
                  Dehradun to Haridwar
                </Link>
              </li>
              <li>
                <Link href="/routes/dehradun-rishikesh" className="hover:text-[#92400E] transition-colors block py-0.5">
                  Dehradun to Rishikesh
                </Link>
              </li>
              <li>
                <Link href="/routes/dehradun-chandigarh" className="hover:text-[#92400E] transition-colors block py-0.5">
                  Dehradun to Chandigarh
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Uttarakhand Pilgrimage & Tours */}
          <div>
            <h4 className="text-[#14263D] font-bold text-sm mb-4 border-l-2 border-[#15803D] pl-2.5">
              Pilgrimage & Tours
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/packages/chardham-full" className="hover:text-[#92400E] transition-colors block py-0.5">
                  Complete Chardham Yatra
                </Link>
              </li>
              <li>
                <Link href="/packages/do-dham-kedar-badri" className="hover:text-[#92400E] transition-colors block py-0.5">
                  Do Dham (Kedarnath & Badrinath)
                </Link>
              </li>
              <li>
                <Link href="/packages/mussoorie-dhanaulti" className="hover:text-[#92400E] transition-colors block py-0.5">
                  Mussoorie & Dhanaulti Tour
                </Link>
              </li>
              <li>
                <Link href="/packages/rishikesh-camping" className="hover:text-[#92400E] transition-colors block py-0.5">
                  Rishikesh Adventure & Rafting
                </Link>
              </li>
              <li>
                <Link href="/routes/dehradun-rishikesh" className="hover:text-[#92400E] transition-colors block py-0.5">
                  Haridwar & Rishikesh Divine Tour
                </Link>
              </li>
            </ul>
          </div>
        </div>


        {/* Bottom copyright and legal */}
        <div className="mt-6 pt-5 border-t border-[#E2E8F0] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-700 font-medium">
          <div>
            © {new Date().getFullYear()} Dehradun Cab. All rights reserved.
          </div>
          <div className="flex items-center gap-5">
            <Link href="/track" className="hover:text-[#14263D] font-bold text-[#14263D] transition-colors">
              Track Booking
            </Link>
            <Link href="/terms" className="hover:text-[#14263D] transition-colors">
              Terms & Policy
            </Link>
            <Link href="/privacy" className="hover:text-[#14263D] transition-colors">
              Privacy Policy
            </Link>
            <Link href="/contact" className="hover:text-[#14263D] transition-colors">
              Contact
            </Link>
            <button
              onClick={scrollToTop}
              className="p-1.5 rounded-lg bg-[#EAF1F7] hover:bg-[#CBD5E1] text-[#14263D] transition-colors flex items-center gap-1 border border-[#CBD5E1]"
              aria-label="Back to top"
            >
              <ArrowUp className="w-3 h-3" />
              <span>Top</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
