import React from 'react';
import type { Metadata } from 'next';
import { BreadcrumbJsonLd } from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'Track Taxi Booking & Live Driver Status | Dhanora Cab Service',
  description:
    'Track your active cab booking with Dhanora Cab Service. View driver name, vehicle number, ETA, live status, and download trip tax invoices.',
  keywords: [
    'Track Dhanora Cab',
    'Dehradun taxi booking status',
    'Live cab tracking Dehradun',
    'Dhanora Cab invoice download',
  ],
  alternates: {
    canonical: '/track',
  },
  openGraph: {
    title: 'Track Your Cab Booking — Dhanora Cab Service',
    description: 'Check live chauffeur assignment, vehicle details, and payment receipts.',
    url: 'https://www.dhanoracabs.com/track',
    images: ['/images/logo.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Track Your Taxi Booking | Dhanora Cab Service',
    description: 'Real-time booking and chauffeur dispatch tracking.',
    images: ['/images/logo.jpg'],
  },
};

export default function TrackLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: '/' },
          { name: 'Track Booking', url: '/track' },
        ]}
      />
      {children}
    </>
  );
}
