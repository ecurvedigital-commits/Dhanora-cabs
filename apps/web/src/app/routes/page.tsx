import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { FloatingMobileBar } from '@/components/FloatingMobileBar';
import { POPULAR_ROUTES, BRAND_TOKENS } from '@/lib/tokens';
import {
  Navigation,
  Clock,
  MapPin,
  ArrowRight,
  Phone,
  MessageCircle,
  Car,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { BreadcrumbJsonLd } from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'Popular Taxi Routes from Dehradun | Delhi, Mussoorie, Airport Transfers',
  description:
    'Reliable outstation and intercity taxi service from Dehradun to Delhi NCR, Jolly Grant Airport, Mussoorie, Rishikesh, Haridwar & Chandigarh. Fixed low fares, zero surge with Dhanora Cab Service.',
  keywords: [
    'Taxi routes from Dehradun',
    'Dehradun to Delhi taxi fare',
    'Dehradun to Mussoorie cab',
    'Dehradun to Jolly Grant airport taxi',
    'Dehradun to Haridwar cab',
    'Dhanora Cab Service routes',
  ],
  alternates: {
    canonical: '/routes',
  },
  openGraph: {
    title: 'Dehradun Taxi Routes & Highway Fares — Dhanora Cab Service',
    description:
      'Check distance, travel time, and per-km rates for top routes from Dehradun. 24x7 doorstep cab dispatch. Call +91 75058 00684.',
    url: 'https://www.dhanoracabs.com/routes',
    images: ['/images/logo.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Popular Taxi Routes from Dehradun | Dhanora Cab Service',
    description: 'Fixed low fares, zero surge, verified mountain chauffeurs.',
    images: ['/images/logo.jpg'],
  },
};

export default function RoutesListingPage() {
  return (
    <div className="min-h-screen bg-[#F8F7F2] text-[#14263D] flex flex-col antialiased">
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: '/' },
          { name: 'Routes', url: '/routes' },
        ]}
      />
      <Header />

      <main className="flex-grow">
        {/* Hero Banner */}
        <section className="bg-gradient-to-b from-[#EAF1F7] via-[#F3F6F9] to-[#F8F7F2] py-12 px-4 border-b border-[#E2E8F0]">
          <div className="max-w-6xl mx-auto text-center space-y-4">
            <h1 className="font-display font-black text-3xl sm:text-5xl text-[#14263D] tracking-tight">
              Popular Taxi Routes from Dehradun
            </h1>
            <p className="text-sm sm:text-base text-[#4B5E76] max-w-2xl mx-auto leading-relaxed">
              Book fixed-rate, one-way drops or round-trips from Dehradun to any destination in
              North India. All prices include driver allowance, fuel, and mountain route surcharges.
            </p>
          </div>
        </section>

        {/* Route Cards Matrix */}
        <section className="py-12 px-4 max-w-6xl mx-auto space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {POPULAR_ROUTES.map((route) => (
              <div
                key={route.id}
                className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-card hover:shadow-lg transition-all flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="px-2 py-0.5 rounded-full bg-[#EAF1F7] text-[#0284C7] font-bold">
                      {route.routeType}
                    </span>
                    <span className="text-slate-700 font-semibold">{route.distanceKm} km</span>
                  </div>

                  <div>
                    <h3 className="font-display font-black text-xl text-[#14263D] group-hover:text-[#92400E] transition-colors">
                      {route.from} → {route.to}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-slate-700 mt-1">
                      <Clock className="w-3.5 h-3.5 text-[#F5BE19]" />
                      <span>Approx. {route.approxDuration}</span>
                    </div>
                  </div>

                  <p className="text-xs text-[#4B5E76] leading-relaxed">{route.highlight}</p>

                  <div className="p-3 rounded-xl bg-[#F8F7F2] border border-[#CBD5E1]/60 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-700 uppercase block font-semibold">Fare Quote</span>
                      <span className="font-display font-bold text-base text-[#14263D]">
                        On Request
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-[#15803D] bg-[#DCFCE7] px-2 py-0.5 rounded-full">
                      Custom Quote
                    </span>
                  </div>
                </div>

                <div className="pt-5 mt-4 border-t border-[#E2E8F0] flex items-center justify-between gap-3">
                  <Link
                    href={`/routes/${route.id}`}
                    className="flex items-center gap-1.5 text-xs font-bold text-[#14263D] hover:text-[#92400E] transition-colors"
                  >
                    <span>Route Details & Stops</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  <Link
                    href={`/routes/${route.id}#book`}
                    className="px-3.5 py-1.5 rounded-xl bg-[#F5BE19] hover:bg-[#DFAC13] text-[#14263D] font-bold text-xs shadow-button-yellow transition-all"
                  >
                    Book Cab
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Highway Feature Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
            <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-card space-y-2">
              <ShieldCheck className="w-6 h-6 text-[#15803D]" />
              <h4 className="font-bold text-sm text-[#14263D]">Expressway Certified</h4>
              <p className="text-xs text-[#62758F] leading-relaxed">
                Vehicles equipped with FASTag and safety speed limiters for smooth Delhi-Dehradun expressway transit.
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-card space-y-2">
              <Car className="w-6 h-6 text-[#F5BE19]" />
              <h4 className="font-bold text-sm text-[#14263D]">Doorstep Pickup Anywhere</h4>
              <p className="text-xs text-[#62758F] leading-relaxed">
                Pickup from any home, hotel, railway station or hospital in Dehradun at no extra dead kilometer surcharge.
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-card space-y-2">
              <Clock className="w-6 h-6 text-[#0284C7]" />
              <h4 className="font-bold text-sm text-[#14263D]">24x7 Night Highway Dispatches</h4>
              <p className="text-xs text-[#62758F] leading-relaxed">
                GPS-tracked night drivers ready for red-eye flights at IGI Airport and late train connections.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <FloatingMobileBar />
    </div>
  );
}
