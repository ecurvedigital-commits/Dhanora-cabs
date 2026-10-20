import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { FloatingMobileBar } from '@/components/FloatingMobileBar';
import { BRAND_TOKENS } from '@/lib/tokens';
import { Shield, Lock, Eye } from 'lucide-react';

import { BreadcrumbJsonLd } from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'Privacy Policy | Data Protection & Security | Dhanora Cab Service',
  description:
    'Learn how Dhanora Cab Service protects customer privacy, handles contact details, and secures payment transactions.',
  alternates: {
    canonical: '/privacy',
  },
  openGraph: {
    title: 'Privacy Policy — Dhanora Cab Service',
    description: 'Learn how Dhanora Cab Service protects customer privacy and trip information.',
    url: 'https://www.dhanoracabs.com/privacy',
  },
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#F8F7F2] text-[#14263D] flex flex-col antialiased">
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: '/' },
          { name: 'Privacy Policy', url: '/privacy' },
        ]}
      />
      <Header />

      <main className="flex-grow py-12 px-4 max-w-4xl mx-auto space-y-8">
        <div className="space-y-3 text-center border-b border-[#E2E8F0] pb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#DCFCE7] text-[#15803D] text-xs font-bold uppercase">
            <Lock className="w-3.5 h-3.5" />
            <span>Data Protection</span>
          </div>
          <h1 className="font-display font-black text-3xl sm:text-4xl text-[#14263D]">
            Privacy Policy
          </h1>
          <p className="text-xs text-[#62758F]">Last Updated: October 2026 • Dhanora Cab Service (dhanoracabs.com)</p>
        </div>

        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-8 shadow-card space-y-6 text-xs sm:text-sm text-[#4B5E76] leading-relaxed">
          <section className="space-y-2">
            <h2 className="font-bold text-base text-[#14263D]">1. Information We Collect</h2>
            <p>
              When you submit a taxi booking or enquiry on our website, we collect your <strong>Full Name</strong>,{' '}
              <strong>Mobile Phone Number</strong>, <strong>Email Address</strong> (optional), and trip pickup/drop locations.
              This information is strictly necessary for operational driver dispatch and safety tracking.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-bold text-base text-[#14263D]">2. How We Use Your Information</h2>
            <ul className="space-y-1.5 list-disc pl-5">
              <li>To verify driver assignment and coordinate pickup timings.</li>
              <li>To send WhatsApp booking confirmations and driver contact cards.</li>
              <li>To generate formal GST invoices and transaction receipts.</li>
              <li>We never sell, lease, or monetize your contact information to third-party marketing brokers.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="font-bold text-base text-[#14263D]">3. Driver Sharing & Passenger Safety</h2>
            <p>
              Your contact number and pickup address are only shared with the assigned commercial driver 30 minutes before
              scheduled departure to coordinate your pickup. GPS vehicle telemetry is retained strictly for passenger safety
              and SOS emergency monitoring.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-bold text-base text-[#14263D]">4. Security & Data Retention</h2>
            <p>
              All customer records and fare snapshots are stored in encrypted databases behind strict role-based access control (RBAC).
              Payment card credentials are never stored on our servers; all digital transactions are routed through PCI-DSS
              compliant payment gateways (Razorpay / Stripe).
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-bold text-base text-[#14263D]">5. Contact Us</h2>
            <p>
              If you wish to update or delete your customer history from our systems, email us at{' '}
              <a href={`mailto:${BRAND_TOKENS.email}`} className="text-[#14263D] font-bold hover:underline">
                {BRAND_TOKENS.email}
              </a>.
            </p>
          </section>
        </div>
      </main>

      <Footer />
      <FloatingMobileBar />
    </div>
  );
}
