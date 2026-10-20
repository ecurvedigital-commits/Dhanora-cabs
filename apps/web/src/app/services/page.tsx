import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { FloatingMobileBar } from '@/components/FloatingMobileBar';
import {
  Car,
  Compass,
  MessageCircle,
  Users,
  Plane,
  Mountain,
} from 'lucide-react';

import { BreadcrumbJsonLd } from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'Taxi & Cab Services in Dehradun | Local, Outstation & Airport Transfers',
  description:
    'Comprehensive taxi services by Dhanora Cab Service: 24x7 Local City Cabs, One-way Outstation Drops, Jolly Grant Airport pickup, Chardham Yatra, and Tempo Traveller hire. Clean cars & verified mountain drivers.',
  keywords: [
    'Taxi services Dehradun',
    'Outstation cab Dehradun',
    'Dehradun airport taxi',
    'Chardham Yatra cab booking',
    'Tempo Traveller Dehradun',
    'Dhanora Cab Service services',
  ],
  alternates: {
    canonical: '/services',
  },
  openGraph: {
    title: 'Taxi & Cab Services in Dehradun — Dhanora Cab Service',
    description:
      'Explore all transportation services provided by Dhanora Cab Service with zero hidden charges. 24x7 Call: +91 75058 00684.',
    url: 'https://www.dhanoracabs.com/services',
    images: ['/images/logo.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dhanora Cab Service | Local, Outstation & Airport Taxis',
    description: 'Explore verified chauffeur taxi services in Dehradun & Uttarakhand.',
    images: ['/images/logo.jpg'],
  },
};

export default function ServicesPage() {
  const serviceList = [
    {
      id: 'local-taxi',
      title: 'Dehradun Local City Taxi & Hourly Rentals',
      tagline: 'Sightseeing, shopping, weddings & corporate visits',
      icon: Car,
      color: 'text-[#F5BE19]',
      desc: 'Explore Forest Research Institute (FRI), Robber’s Cave (Guchhupani), Sahastradhara, Tapkeshwar Temple, and Pacific Mall with a dedicated car and chauffeur on standby.',
      features: ['Unlimited stops within package', 'Zero extra charge for waiting in traffic', 'Clean AC vehicles'],
    },
    {
      id: 'outstation',
      title: 'Interstate Outstation Cabs & One-Way Drops',
      tagline: 'Delhi NCR, Chandigarh, Haridwar, Punjab & beyond',
      icon: Compass,
      color: 'text-[#0284C7]',
      desc: 'Hassle-free intercity highway travel. Pay only for one-way drop or book a round-trip with dedicated chauffeur. FASTag enabled with zero return toll surcharge.',
      features: ['Doorstep pickup at any hour', 'No return fare on one-way trips', 'Experienced highway drivers'],
    },
    {
      id: 'airport',
      title: 'Jolly Grant Airport (DED) Transfers',
      tagline: 'Guaranteed punctual pickup with flight tracking',
      icon: Plane,
      color: 'text-[#15803D]',
      desc: 'Never miss a flight. We track commercial flight schedules in real time. If your arrival is delayed, your chauffeur will be waiting outside the terminal with a nameboard.',
      features: ['Flight delay compensation', 'Luggage assistance included', '24x7 night emergency dispatch'],
    },
    {
      id: 'chardham',
      title: 'Chardham Yatra & Mountain Pilgrimage Cabs',
      tagline: 'Yamunotri, Gangotri, Kedarnath & Badrinath',
      icon: Mountain,
      color: 'text-[#92400E]',
      desc: 'The sacred journey deserves the highest mountain driving standards. All our hill drivers hold commercial mountain badges with 10+ years of Garhwal Himalayan experience.',
      features: ['Oxygen cylinder assistance available', 'High road clearance Innova & Ertiga', 'Driver night halt included'],
    },
    {
      id: 'tempo-traveller',
      title: 'Tempo Traveller & Group Tour Hire',
      tagline: '9, 12, 17 & 26 Seater Luxury Minibuses',
      icon: Users,
      color: 'text-[#7C3AED]',
      desc: 'Ideal for extended families, wedding guests, corporate retreats, and trekking groups. Reclining pushback seats, individual AC vents, and massive boot luggage capacity.',
      features: ['Full 2x1 pushback luxury seating', 'High-roof walking space', 'Stereo entertainment system'],
    },
    {
      id: 'mussoorie',
      title: 'Mussoorie Queen of Hills Day Sightseeing',
      tagline: 'Kempty Falls, Mall Road, Gun Hill & Lal Tibba',
      icon: Mountain,
      color: 'text-[#E11D48]',
      desc: 'Ascend 6,500 feet into the clouds. Avoid stressful driving on steep hairpin curves and parking hassles at crowded viewpoints. Relax as our chauffeur navigates.',
      features: ['Kolhukhet eco-toll guidance', 'Flexible itinerary time', 'Local hill guide insights'],
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8F7F2] text-[#14263D] flex flex-col antialiased">
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: '/' },
          { name: 'Services', url: '/services' },
        ]}
      />
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-[#EAF1F7] via-[#F3F6F9] to-[#F8F7F2] py-12 px-4 border-b border-[#E2E8F0]">
          <div className="max-w-6xl mx-auto text-center space-y-4">
            <h1 className="font-display font-black text-3xl sm:text-5xl text-[#14263D] tracking-tight">
              Taxi & Cab Services in Dehradun
            </h1>
            <p className="text-sm sm:text-base text-[#4B5E76] max-w-2xl mx-auto leading-relaxed">
              From quick local airport pickups to multi-day high-altitude Chardham expeditions,
              discover our dedicated taxi solutions tailored for comfort, punctuality, and safety.
            </p>
          </div>
        </section>

        {/* Services Detail List */}
        <section className="py-12 px-4 max-w-6xl mx-auto space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {serviceList.map((srv) => {
              const Icon = srv.icon;
              return (
                <div
                  key={srv.id}
                  className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-card hover:shadow-lg transition-all flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#F8F7F2] border border-[#E2E8F0] flex items-center justify-center shrink-0">
                        <Icon className={`w-5 h-5 ${srv.color}`} />
                      </div>
                      <div>
                        <h2 className="font-display font-black text-lg sm:text-xl text-[#14263D]">
                          {srv.title}
                        </h2>
                        <p className="text-xs text-slate-700 font-medium">{srv.tagline}</p>
                      </div>
                    </div>

                    <p className="text-xs text-[#4B5E76] leading-relaxed">{srv.desc}</p>

                    <div className="space-y-2 text-xs pt-1">
                      {srv.features.map((feat, i) => (
                        <div key={i} className="flex items-center gap-2 text-[#4B5E76]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#F5BE19] shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 mt-4 border-t border-[#E2E8F0] flex items-center justify-between gap-3">
                    <Link
                      href="/#booking"
                      className="px-4 py-2 rounded-xl bg-[#F5BE19] hover:bg-[#DFAC13] text-[#14263D] font-bold text-xs shadow-button-yellow transition-all"
                    >
                      Book This Service
                    </Link>

                    <a
                      href={`https://wa.me/917505800684?text=Hi%20Dhanora%20Cab,%20I%20would%20like%20to%20inquire%20about%20${encodeURIComponent(
                        srv.title,
                      )}.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs font-bold text-[#15803D] hover:underline"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Inquire on WhatsApp</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Booking Assurance Banner */}
          <div className="bg-[#14263D] text-white rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <h3 className="font-display font-black text-2xl text-white">
                Book Once. Travel in Complete Peace.
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
                Every vehicle is sanitized, equipped with GPS speed governance, and manned by an Uttarakhand
                registered commercial chauffeur. Zero hidden charges.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <Link
                href="/#booking"
                className="px-5 py-3 rounded-xl bg-[#F5BE19] hover:bg-[#DFAC13] text-[#14263D] font-black text-xs uppercase tracking-wider shadow-sm"
              >
                Instant Fare Calculator
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <FloatingMobileBar />
    </div>
  );
}
