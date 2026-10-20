import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { FloatingMobileBar } from '@/components/FloatingMobileBar';
import { BreadcrumbJsonLd } from '@/components/JsonLd';
import { POPULAR_ROUTES, BRAND_TOKENS, FLEET_OPTIONS } from '@/lib/tokens';
import {
  Navigation,
  Clock,
  MapPin,
  ShieldCheck,
  CheckCircle,
  ArrowRight,
  Phone,
  MessageCircle,
  Car,
  ChevronRight,
  Check,
  AlertCircle,
  Info,
} from 'lucide-react';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return POPULAR_ROUTES.map((route) => ({
    slug: route.id,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const route = POPULAR_ROUTES.find((r) => r.id === slug);

  if (!route) {
    return {
      title: 'Route Not Found | Dhanora Cab Service',
    };
  }

  const title = `${route.from} to ${route.to} Cab Service | Best Rates | Dhanora Cab`;
  const description = `Book one-way taxi or round-trip cab from ${route.from} to ${route.to}. Distance: ${route.distanceKm} km (${route.approxDuration}). Verified hill chauffeurs, AC cabs, transparent pricing. Call +91 75058 00684.`;

  return {
    title,
    description,
    keywords: [
      `${route.from} to ${route.to} cab`,
      `${route.from} to ${route.to} taxi fare`,
      `Book cab from ${route.from} to ${route.to}`,
      `Dhanora Cab Service ${route.to}`,
    ],
    alternates: {
      canonical: `/routes/${slug}`,
    },
    openGraph: {
      title,
      description: route.highlight,
      url: `https://www.dhanoracabs.com/routes/${slug}`,
      images: ['/images/logo.jpg'],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/images/logo.jpg'],
    },
  };
}

export default async function RouteDetailPage({ params }: Props) {
  const { slug } = await params;
  const route = POPULAR_ROUTES.find((r) => r.id === slug);

  if (!route) {
    notFound();
  }

  // Route-specific highway insights
  const getRouteDetails = (id: string) => {
    switch (id) {
      case 'dehradun-delhi':
        return {
          expressway: 'Delhi–Saharanpur–Dehradun Expressway / NH 334',
          tollEstimate: '₹280 (FASTag enabled)',
          scenicStops: ['Mohand Forest Pass', 'Cheetal Grand Khatauli', 'Namaste Asia Mansurpur'],
          tips: 'Early morning (5:00 AM) or post-sunset departures save 45 minutes of urban traffic.',
        };
      case 'dehradun-mussoorie':
        return {
          expressway: 'Mussoorie Road (via Rajpur Road & Kolhukhet)',
          tollEstimate: 'Green Eco Toll ₹100',
          scenicStops: ['Kolhukhet Toll Gate viewpoint', 'Bhatta Falls', 'Kempty Falls'],
          tips: 'All our drivers hold verified Uttarakhand mountain driving credentials with zero harsh braking on curves.',
        };
      case 'dehradun-airport':
        return {
          expressway: 'Dehradun–Rishikesh Highway (via Thano Road forest corridor)',
          tollEstimate: 'Zero toll',
          scenicStops: ['Thano Pine Forest Reserve', 'Rani Pokhari Bridge'],
          tips: 'We track your flight arrivals in real-time. Even if your flight is delayed, your chauffeur will be waiting outside arrivals gate.',
        };
      default:
        return {
          expressway: 'Direct National / State Highway',
          tollEstimate: 'Included in fixed fare',
          scenicStops: ['Highway food courts & clean washroom plazas'],
          tips: 'Doorstep pickup anywhere in Dehradun with zero hidden kilometer charge.',
        };
    }
  };

  const details = getRouteDetails(route.id);

  return (
    <div className="min-h-screen bg-[#F8F7F2] text-[#14263D] flex flex-col antialiased">
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: '/' },
          { name: 'Routes', url: '/routes' },
          { name: `${route.from} to ${route.to}`, url: `/routes/${route.id}` },
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'TaxiService',
            name: `${route.from} to ${route.to} Taxi Service`,
            provider: {
              '@type': 'LocalBusiness',
              name: 'Dhanora Cab Service',
              telephone: '+91 75058 00684',
              url: 'https://www.dhanoracabs.com',
            },
            areaServed: [route.from, route.to],
            offers: {
              '@type': 'Offer',
              description: `Custom one-way or round-trip cab service from ${route.from} to ${route.to} on request`,
            },
          }),
        }}
      />
      <Header />

      <main className="flex-grow">
        {/* Header Breadcrumb */}
        <section className="bg-gradient-to-b from-[#EAF1F7] via-[#F3F6F9] to-[#F8F7F2] pt-8 pb-10 px-4 border-b border-[#E2E8F0]">
          <div className="max-w-6xl mx-auto space-y-4">
            <nav className="flex items-center gap-2 text-xs text-[#62758F]">
              <Link href="/" className="hover:text-[#14263D]">Home</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <Link href="/routes" className="hover:text-[#14263D]">Routes</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-[#14263D] font-bold truncate">{route.from} to {route.to}</span>
            </nav>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="space-y-2">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-[#EAF1F7] text-[#0284C7] border border-[#BAE6FD] uppercase tracking-wide">
                  {route.routeType} Highway Service
                </span>
                <h1 className="font-display font-black text-2xl sm:text-4xl text-[#14263D] tracking-tight">
                  {route.from} to {route.to} Cab Service
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-xs text-[#4B5E76]">
                  <span className="flex items-center gap-1 font-semibold text-[#14263D]">
                    <MapPin className="w-4 h-4 text-[#F5BE19]" />
                    Distance: {route.distanceKm} km
                  </span>
                  <span className="flex items-center gap-1 font-semibold text-[#14263D]">
                    <Clock className="w-4 h-4 text-[#15803D]" />
                    Driving Time: {route.approxDuration}
                  </span>
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4 text-[#0284C7]" />
                    FASTag Enabled
                  </span>
                </div>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-[#CBD5E1] shadow-card text-right shrink-0">
                <span className="text-[10px] text-[#62758F] uppercase font-bold block">One-Way Sedan Fare</span>
                <span className="font-display font-bold text-xl sm:text-2xl text-[#14263D]">
                  On Request
                </span>
                <span className="text-[11px] text-[#15803D] font-bold block">Call / WhatsApp for Quote</span>
              </div>
            </div>
          </div>
        </section>

        {/* Content Layout */}
        <section className="py-10 px-4 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Route Guide */}
          <div className="lg:col-span-2 space-y-8">
            {/* Highway Overview */}
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-card space-y-4">
              <h2 className="font-display font-black text-lg text-[#14263D]">Highway Transit Summary</h2>
              <p className="text-sm text-[#4B5E76] leading-relaxed">{route.highlight}</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-[#F1F5F9] text-xs">
                <div className="space-y-1">
                  <span className="text-[#62758F] font-bold uppercase tracking-wider block text-[10px]">Primary Highway:</span>
                  <span className="font-semibold text-[#14263D]">{details.expressway}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[#62758F] font-bold uppercase tracking-wider block text-[10px]">Tolls & Green Cess:</span>
                  <span className="font-semibold text-[#14263D]">{details.tollEstimate}</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#FEF8E7] border border-[#F5BE19]/40 text-xs text-[#B48505] flex items-start gap-2.5">
                <Info className="w-4 h-4 shrink-0 mt-0.5 text-[#B48505]" />
                <p><strong>Travel Tip:</strong> {details.tips}</p>
              </div>
            </div>

            {/* Popular Refreshment & Food Stops */}
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-card space-y-4">
              <h2 className="font-display font-black text-lg text-[#14263D]">Recommended En-Route Halts</h2>
              <p className="text-xs text-[#62758F]">
                Our chauffeurs willingly stop at safe, family-friendly food courts with clean restroom facilities:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {details.scenicStops.map((stop, i) => (
                  <div key={i} className="p-3 rounded-xl bg-[#F8F7F2] border border-[#E2E8F0] text-xs font-semibold text-[#14263D] flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-[#F5BE19] shrink-0" />
                    <span>{stop}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Fare Breakdown by Vehicle Category */}
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-card space-y-4">
              <h2 className="font-display font-black text-lg text-[#14263D]">
                Fare Matrix for {route.from} → {route.to}
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-[#EAF1F7] text-[#62758F] font-bold uppercase text-[10px] border-b border-[#CBD5E1]">
                      <th className="py-2.5 px-3">Vehicle Type</th>
                      <th className="py-2.5 px-3">Model</th>
                      <th className="py-2.5 px-3">Capacity</th>
                      <th className="py-2.5 px-3 text-right">One-Way Fare</th>
                      <th className="py-2.5 px-3 text-right">Round-Trip</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2E8F0]">
                    <tr>
                      <td className="py-3 px-3 font-bold text-[#14263D]">Comfort Sedan</td>
                      <td className="py-3 px-3 text-[#62758F]">Swift Dzire / Etios</td>
                      <td className="py-3 px-3 text-[#62758F]">4 Pax + 3 Bags</td>
                      <td className="py-3 px-3 text-right font-black text-[#14263D]">
                        On Request
                      </td>
                      <td className="py-3 px-3 text-right font-black text-[#15803D]">
                        On Request
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 px-3 font-bold text-[#14263D]">Family SUV</td>
                      <td className="py-3 px-3 text-[#62758F]">Maruti Ertiga / Triber</td>
                      <td className="py-3 px-3 text-[#62758F]">6 Pax + 4 Bags</td>
                      <td className="py-3 px-3 text-right font-black text-[#14263D]">
                        On Request
                      </td>
                      <td className="py-3 px-3 text-right font-black text-[#15803D]">
                        On Request
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 px-3 font-bold text-[#14263D]">Premium Mountain SUV</td>
                      <td className="py-3 px-3 text-[#62758F]">Toyota Innova Crysta</td>
                      <td className="py-3 px-3 text-[#62758F]">6 Pax + 5 Bags</td>
                      <td className="py-3 px-3 text-right font-black text-[#14263D]">
                        On Request
                      </td>
                      <td className="py-3 px-3 text-right font-black text-[#15803D]">
                        On Request
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 px-3 font-bold text-[#14263D]">Tempo Traveller</td>
                      <td className="py-3 px-3 text-[#62758F]">Force 12/17 Seater</td>
                      <td className="py-3 px-3 text-[#62758F]">12 Pax + Pushback</td>
                      <td className="py-3 px-3 text-right font-black text-[#14263D]">
                        On Request
                      </td>
                      <td className="py-3 px-3 text-right font-black text-[#15803D]">
                        On Request
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column: Instant Booking Card */}
          <div className="space-y-6">
            <div id="book" className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-card space-y-4 sticky top-20">
              <h3 className="font-display font-black text-lg text-[#14263D]">
                Book {route.from} → {route.to}
              </h3>
              <p className="text-xs text-[#62758F]">
                Guaranteed on-time doorstep pickup with real-time GPS tracking.
              </p>

              <div className="space-y-3 pt-2">
                <a
                  href={`https://wa.me/917505800684?text=Hi%20Dhanora%20Cab,%20I%20would%20like%20to%20book%20a%20cab%20for%20${encodeURIComponent(
                    route.from,
                  )}%20to%20${encodeURIComponent(route.to)}.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 rounded-xl bg-[#15803D] hover:bg-[#166534] text-white font-bold text-xs uppercase tracking-wider shadow-sm flex items-center justify-center gap-2 transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Book Instantly on WhatsApp</span>
                </a>

                <a
                  href={BRAND_TOKENS.phoneCallUrl}
                  className="w-full py-3 rounded-xl bg-[#F5BE19] hover:bg-[#DFAC13] text-[#14263D] font-black text-xs uppercase tracking-wider shadow-button-yellow flex items-center justify-center gap-2 transition-all"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call Dispatch: {BRAND_TOKENS.phonePrimary}</span>
                </a>

                <Link
                  href="/#booking"
                  className="w-full py-2.5 rounded-xl bg-[#EAF1F7] hover:bg-[#CBD5E1] text-[#14263D] font-bold text-xs text-center block transition-all"
                >
                  Calculate Custom Quote
                </Link>
              </div>

              <div className="pt-3 border-t border-[#E2E8F0] space-y-2 text-[11px] text-[#4B5E76]">
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#15803D]" />
                  <span>Free cancellation up to 2 hours before trip</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#15803D]" />
                  <span>Pay directly to driver or via UPI / Card</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#15803D]" />
                  <span>AC throughout journey with zero night surcharge</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <FloatingMobileBar />
    </div>
  );
}
