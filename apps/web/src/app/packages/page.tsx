import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { FloatingMobileBar } from '@/components/FloatingMobileBar';
import { TOUR_PACKAGES, BRAND_TOKENS } from '@/lib/tokens';
import {
  Compass,
  Calendar,
  Clock,
  MapPin,
  ShieldCheck,
  CheckCircle,
  ArrowRight,
  Phone,
  MessageCircle,
  Star,
  Users,
} from 'lucide-react';
import { BreadcrumbJsonLd } from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'Uttarakhand Tour Packages & Chardham Yatra 2026 | Dhanora Cab Service',
  description:
    'Book private car Chardham Yatra, Kedarnath, Badrinath, Mussoorie & Rishikesh tour packages from Dehradun. Transparent fares, expert mountain chauffeurs, 24x7 bookings: +91 75058 00684.',
  keywords: [
    'Chardham Yatra taxi package',
    'Do Dham Kedarnath Badrinath cab',
    'Mussoorie tour package',
    'Rishikesh camping package',
    'Uttarakhand tour packages from Dehradun',
    'Dhanora Cab Service packages',
  ],
  alternates: {
    canonical: '/packages',
  },
  openGraph: {
    title: 'Uttarakhand Tour Packages & Chardham Yatra 2026 — Dhanora Cab Service',
    description:
      'Private taxi tour packages across Uttarakhand. Experienced mountain chauffeurs, sanitized vehicles, zero hidden costs. Call +91 75058 00684.',
    url: 'https://www.dhanoracabs.com/packages',
    images: ['/images/logo.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Uttarakhand Tour Packages & Chardham Yatra 2026 | Dhanora Cab',
    description: 'Private car pilgrimages & hill tours with certified mountain chauffeurs.',
    images: ['/images/logo.jpg'],
  },
};

export default function PackagesListingPage() {
  return (
    <div className="min-h-screen bg-[#F8F7F2] text-[#14263D] flex flex-col antialiased">
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: '/' },
          { name: 'Tour Packages', url: '/packages' },
        ]}
      />
      <Header />

      <main className="flex-grow">
        {/* Hero Banner */}
        <section className="bg-gradient-to-b from-[#EAF1F7] via-[#F3F6F9] to-[#F8F7F2] py-12 px-4 border-b border-[#E2E8F0]">
          <div className="max-w-6xl mx-auto text-center space-y-4">
            <h1 className="font-display font-black text-3xl sm:text-5xl text-[#14263D] tracking-tight">
              Uttarakhand Tour Packages & Chardham Yatras
            </h1>
            <p className="text-sm sm:text-base text-[#4B5E76] max-w-2xl mx-auto leading-relaxed">
              Explore sacred temples, high-altitude alpine meadows, and serene hill stations with
              Dehradun’s most trusted mountain chauffeurs. Every package includes verified vehicles,
              emergency support, and transparent zero-surge pricing.
            </p>
          </div>
        </section>

        {/* Packages Grid */}
        <section className="py-12 px-4 max-w-6xl mx-auto space-y-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-[#E2E8F0] pb-4">
            <div>
              <h2 className="text-xl font-black text-[#14263D]">Featured Itineraries</h2>
              <p className="text-xs text-slate-700 font-medium">Customizable for families, senior citizens, and private groups</p>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-700 font-semibold">Filter:</span>
              <span className="px-2.5 py-1 rounded-lg bg-[#14263D] text-white font-bold">All Tours</span>
              <span className="px-2.5 py-1 rounded-lg bg-white border border-[#CBD5E1] text-[#4B5E76]">Char Dham</span>
              <span className="px-2.5 py-1 rounded-lg bg-white border border-[#CBD5E1] text-[#4B5E76]">Hill Station</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {TOUR_PACKAGES.map((pkg) => (
              <div
                key={pkg.id}
                className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-card hover:shadow-lg transition-all flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      {pkg.badge && (
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FEF8E7] text-[#92400E] border border-[#F5BE19]/40 mb-1.5 uppercase">
                          {pkg.badge}
                        </span>
                      )}
                      <h3 className="font-display font-black text-xl text-[#14263D] group-hover:text-[#92400E] transition-colors">
                        {pkg.title}
                      </h3>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-[10px] text-slate-700 uppercase font-bold">Package Tariff</div>
                      <div className="font-display font-bold text-lg text-[#14263D]">
                        On Request
                      </div>
                      <div className="text-[10px] text-[#15803D] font-bold">Call / WhatsApp for Quote</div>
                    </div>
                  </div>

                  <p className="text-xs text-[#4B5E76] leading-relaxed">{pkg.description}</p>

                  <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-[#F1F5F9]">
                    <div className="flex items-center gap-1.5 text-[#334155]">
                      <Clock className="w-3.5 h-3.5 text-[#F5BE19]" />
                      <span className="font-semibold">{pkg.duration}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[#334155]">
                      <Calendar className="w-3.5 h-3.5 text-[#15803D]" />
                      <span>Season: {pkg.season}</span>
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-1">
                    <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                      Places Covered:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {pkg.placesCovered.map((place) => (
                        <span
                          key={place}
                          className="px-2 py-0.5 rounded-md bg-[#EAF1F7] text-[#14263D] text-[11px] font-medium"
                        >
                          {place}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-6 mt-4 border-t border-[#E2E8F0] flex items-center justify-between gap-3">
                  <Link
                    href={`/packages/${pkg.id}`}
                    className="flex items-center gap-1.5 text-xs font-bold text-[#14263D] hover:text-[#92400E] transition-colors"
                  >
                    <span>View Day-by-Day Itinerary</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  <Link
                    href={`/packages/${pkg.id}#book`}
                    className="px-4 py-2 rounded-xl bg-[#F5BE19] hover:bg-[#DFAC13] text-[#14263D] font-bold text-xs shadow-button-yellow transition-all"
                  >
                    Book This Tour
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Custom Tour CTA */}
          <div className="rounded-2xl bg-gradient-to-r from-[#14263D] to-[#1E3450] p-6 sm:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <h3 className="font-display font-black text-2xl text-white">Need a Tailored Uttarakhand Itinerary?</h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
                Looking for Hemkund Sahib, Tungnath-Chopta trek transit, Jim Corbett Safaris, or custom family yatra?
                Our mountain travel desk plans personalized routes with door-to-door cab dispatch.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <a
                href={BRAND_TOKENS.phoneCallUrl}
                className="px-4 py-2.5 rounded-xl bg-[#F5BE19] text-[#14263D] font-black text-xs uppercase tracking-wider shadow-sm flex items-center gap-2 hover:bg-[#DFAC13]"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call {BRAND_TOKENS.phonePrimary}</span>
              </a>
              <a
                href={BRAND_TOKENS.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-xl bg-[#15803D] text-white font-bold text-xs uppercase tracking-wider shadow-sm flex items-center gap-2 hover:bg-[#166534]"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <FloatingMobileBar />
    </div>
  );
}
