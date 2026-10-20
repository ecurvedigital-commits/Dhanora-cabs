import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { FloatingMobileBar } from '@/components/FloatingMobileBar';
import { BRAND_TOKENS } from '@/lib/tokens';
import {
  ShieldCheck,
  Award,
  Clock,
  MapPin,
  Phone,
  MessageCircle,
  Users,
  Car,
  HeartHandshake,
  Star,
  CheckCircle,
} from 'lucide-react';
import { BreadcrumbJsonLd } from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'About Us | Trusted Taxi & Outstation Cab Service in Dehradun',
  description:
    'Learn about Dhanora Cab Service - Uttarakhand’s premier taxi service with verified mountain drivers, transparent fares, and 24x7 customer support across Dehradun, Mussoorie, Delhi, and Chardham.',
  keywords: [
    'About Dhanora Cab Service',
    'Dhanora Cab Dehradun',
    'Taxi company in Dehradun',
    'Uttarakhand mountain drivers',
    'Safe cab service Dehradun',
  ],
  alternates: {
    canonical: '/about',
  },
  openGraph: {
    title: 'About Dhanora Cab Service — Uttarakhand Mountain Travel Leader',
    description:
      'Operating 24x7 from Dehradun with commercial fleet and verified hill-certified drivers. Call +91 75058 00684.',
    url: 'https://www.dhanoracabs.com/about',
    images: ['/images/logo.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Dhanora Cab Service | Dehradun Taxi Specialists',
    description: 'Learn about our 100% verified mountain chauffeurs and fleet standards.',
    images: ['/images/logo.jpg'],
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#F8F7F2] text-[#14263D] flex flex-col antialiased">
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: '/' },
          { name: 'About Us', url: '/about' },
        ]}
      />
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-[#EAF1F7] via-[#F3F6F9] to-[#F8F7F2] py-14 px-4 border-b border-[#E2E8F0]">
          <div className="max-w-4xl mx-auto text-center space-y-4">
            <h1 className="font-display font-black text-3xl sm:text-5xl text-[#14263D] tracking-tight">
              Driving Uttarakhand with Trust, Pride & Safety
            </h1>
            <p className="text-sm sm:text-base text-[#4B5E76] leading-relaxed">
              Founded at the foothills of the Garhwal Himalayas in Dehradun, we bridge pilgrims,
              families, and tourists to every corner of Uttarakhand with unwavering reliability.
            </p>
          </div>
        </section>

        {/* Story & Philosophy Section */}
        <section className="py-12 px-4 max-w-5xl mx-auto space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4 text-xs sm:text-sm text-[#4B5E76] leading-relaxed">
              <h2 className="font-display font-black text-2xl text-[#14263D]">
                Built for the Demanding Mountain Roads
              </h2>
              <p>
                Driving in the Himalayas requires vastly different skills than city driving. Steep hairpin
                bends, sudden rainstorms, landslide diversions, and high-altitude climbs demand absolute
                calmness, exceptional mechanical vehicle knowledge, and deep familiarity with the terrain.
              </p>
              <p>
                At <strong>Dhanora Cab Service</strong>, we don’t treat drivers as gig workers. Every chauffeur on
                our platform is a verified Uttarakhand native with commercial hill-driving certification,
                background verification, and extensive training in passenger safety and courtesy.
              </p>
              <div className="p-4 rounded-xl bg-[#EAF1F7] border border-[#CBD5E1] text-[#14263D] font-medium text-xs space-y-1">
                <span className="font-bold text-[#92400E] block">Our Promise to Every Traveler:</span>
                <span>No hidden kilometer tricks. No sudden peak surge pricing. No compromise on safety.</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-card space-y-4">
              <h3 className="font-display font-black text-lg text-[#14263D]">Platform Milestones</h3>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-4 rounded-xl bg-[#F8F7F2] border border-[#CBD5E1]/60">
                  <div className="font-display font-black text-3xl text-[#14263D]">15,000+</div>
                  <div className="text-[11px] text-slate-700 font-bold mt-1">Trips Completed</div>
                </div>
                <div className="p-4 rounded-xl bg-[#F8F7F2] border border-[#CBD5E1]/60">
                  <div className="font-display font-black text-3xl text-[#15803D]">4.9 / 5</div>
                  <div className="text-[11px] text-slate-700 font-bold mt-1">Verified Traveler Rating</div>
                </div>
                <div className="p-4 rounded-xl bg-[#F8F7F2] border border-[#CBD5E1]/60">
                  <div className="font-display font-black text-3xl text-[#0284C7]">100%</div>
                  <div className="text-[11px] text-slate-700 font-bold mt-1">Commercial Green Plates</div>
                </div>
                <div className="p-4 rounded-xl bg-[#F8F7F2] border border-[#CBD5E1]/60">
                  <div className="font-display font-black text-3xl text-[#92400E]">24/7</div>
                  <div className="text-[11px] text-slate-700 font-bold mt-1">Live Control Room</div>
                </div>
              </div>
            </div>
          </div>

          {/* Core Mountain Standards */}
          <div className="space-y-6 pt-6 border-t border-[#E2E8F0]">
            <div className="text-center space-y-2">
              <h2 className="font-display font-black text-2xl text-[#14263D]">
                Our Four Non-Negotiable Standards
              </h2>
              <p className="text-xs text-[#62758F]">How we guarantee the safest journey across Uttarakhand</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-card space-y-2">
                <ShieldCheck className="w-6 h-6 text-[#15803D]" />
                <h3 className="font-bold text-sm text-[#14263D]">1. Mountain Chauffeurs</h3>
                <p className="text-xs text-[#62758F] leading-relaxed">
                  Minimum 7 years of high-altitude driving experience across Joshimath, Badrinath, and Mussoorie.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-card space-y-2">
                <Car className="w-6 h-6 text-[#F5BE19]" />
                <h3 className="font-bold text-sm text-[#14263D]">2. Pre-Trip Inspection</h3>
                <p className="text-xs text-[#62758F] leading-relaxed">
                  Brake pads, tyre tread depth, coolant levels, and suspension checked before every hill climb.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-card space-y-2">
                <Award className="w-6 h-6 text-[#0284C7]" />
                <h3 className="font-bold text-sm text-[#14263D]">3. Fixed Fare Contract</h3>
                <p className="text-xs text-[#62758F] leading-relaxed">
                  Agreed fare snapshot is locked. You will never be asked for extra driver tea or night charges mid-journey.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-card space-y-2">
                <Clock className="w-6 h-6 text-[#B91C1C]" />
                <h3 className="font-bold text-sm text-[#14263D]">4. 24x7 SOS Support</h3>
                <p className="text-xs text-[#62758F] leading-relaxed">
                  In case of highway blockages or vehicle flat tyres, our control room immediately dispatches replacement cabs.
                </p>
              </div>
            </div>
          </div>

          {/* Contact & Control Hub Location */}
          <div className="bg-white rounded-2xl border border-[#CBD5E1] p-6 sm:p-8 shadow-card flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <h3 className="font-display font-black text-xl text-[#14263D]">Visit Our Dehradun Operations Hub</h3>
              <p className="text-xs text-[#4B5E76] max-w-lg">
                {BRAND_TOKENS.address}
              </p>
              <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-[#14263D] pt-1">
                <span>Phone: {BRAND_TOKENS.phonePrimary}</span>
                <span>•</span>
                <span>Email: {BRAND_TOKENS.email}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Link
                href="/contact"
                className="px-4 py-2.5 rounded-xl bg-[#14263D] hover:bg-[#1E3450] text-white font-bold text-xs"
              >
                Contact Desk
              </Link>
              <Link
                href="/#booking"
                className="px-4 py-2.5 rounded-xl bg-[#F5BE19] hover:bg-[#DFAC13] text-[#14263D] font-black text-xs uppercase tracking-wider"
              >
                Book a Cab
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
