import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { FloatingMobileBar } from '@/components/FloatingMobileBar';
import { BRAND_TOKENS } from '@/lib/tokens';
import { Shield, FileText, CheckCircle, AlertCircle } from 'lucide-react';

import { BreadcrumbJsonLd } from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'Terms of Service & Fare Policy | Dhanora Cab Service',
  description:
    'Read the terms of service, cancellation policies, mountain road guidelines, and transparent fixed fare terms of Dhanora Cab Service.',
  alternates: {
    canonical: '/terms',
  },
  openGraph: {
    title: 'Terms of Service & Fare Policy — Dhanora Cab Service',
    description: 'Transparent fare rules, mountain travel guidelines, and cancellation terms.',
    url: 'https://www.dhanoracabs.com/terms',
  },
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#F8F7F2] text-[#14263D] flex flex-col antialiased">
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: '/' },
          { name: 'Terms of Service', url: '/terms' },
        ]}
      />
      <Header />

      <main className="flex-grow py-12 px-4 max-w-4xl mx-auto space-y-8">
        <div className="space-y-3 text-center border-b border-[#E2E8F0] pb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAF1F7] text-[#0284C7] text-xs font-bold uppercase">
            <FileText className="w-3.5 h-3.5" />
            <span>Operational Policies</span>
          </div>
          <h1 className="font-display font-black text-3xl sm:text-4xl text-[#14263D]">
            Terms of Service & Fare Policy
          </h1>
          <p className="text-xs text-[#62758F]">Last Updated: October 2026 • Dhanora Cab Service (dhanoracabs.com)</p>
        </div>

        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-8 shadow-card space-y-6 text-xs sm:text-sm text-[#4B5E76] leading-relaxed">
          <section className="space-y-2">
            <h2 className="font-bold text-base text-[#14263D]">1. Immutable Fare Snapshot Agreement</h2>
            <p>
              When an admin or operations coordinator confirms your booking, an immutable <strong>Fare Snapshot</strong> is
              generated. This locks the agreed price including base fare, estimated distance, driver allowances, and applicable
              taxes. You will never be charged unexpected surge rates on the day of travel.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-bold text-base text-[#14263D]">2. Booking Confirmation Status Lifecycle</h2>
            <p>
              Every public booking request submitted on dhanoracabs.com begins strictly in <strong>PENDING_REVIEW</strong>.
              Our operations coordinators manually review mountain driver availability and vehicle compliance before transitioning
              the booking to <strong>CONFIRMED</strong>. Automatic confirmation is strictly forbidden to prevent double-booking.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-bold text-base text-[#14263D]">3. Cancellation & Refund Policy</h2>
            <ul className="space-y-1.5 list-disc pl-5">
              <li>
                <strong>Cancellations made &gt; 6 hours before scheduled pickup:</strong> 100% full refund of any advance token deposit.
              </li>
              <li>
                <strong>Cancellations made 2 to 6 hours before scheduled pickup:</strong> 50% refund or free date rescheduling within 30 days.
              </li>
              <li>
                <strong>Cancellations within 2 hours or no-show at pickup:</strong> Non-refundable to compensate the dispatched driver for fuel and dead mileage.
              </li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="font-bold text-base text-[#14263D]">4. High-Altitude & Mountain Safety Protocols</h2>
            <p>
              In accordance with Uttarakhand RTO safety mandates:
            </p>
            <ul className="space-y-1.5 list-disc pl-5">
              <li>Driving after 8:00 PM on high mountain routes (e.g. Joshimath to Badrinath, Sonprayag to Gaurikund) may be restricted by police checkpoints during monsoon or winter weather alerts.</li>
              <li>Vehicle air conditioning will be turned off on steep uphill inclines when required to preserve engine torque and cooling performance.</li>
              <li>Drivers are strictly forbidden from exceeding the 40 km/h hill speed advisory on mountain switchbacks.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="font-bold text-base text-[#14263D]">5. Contact for Grievances & Queries</h2>
            <p>
              For questions regarding invoices, GST bills, or refunds, contact our billing desk directly at{' '}
              <a href={`mailto:${BRAND_TOKENS.email}`} className="text-[#14263D] font-bold hover:underline">
                {BRAND_TOKENS.email}
              </a>{' '}
              or call our 24x7 control room at{' '}
              <a href={BRAND_TOKENS.phoneCallUrl} className="text-[#B91C1C] font-bold hover:underline">
                {BRAND_TOKENS.phonePrimary}
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
