import React from 'react';
import type { Metadata } from 'next';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { FloatingMobileBar } from '@/components/FloatingMobileBar';
import { BRAND_TOKENS } from '@/lib/tokens';
import { BreadcrumbJsonLd } from '@/components/JsonLd';
import { ContactForm } from '@/components/ContactForm';
import {
  Phone,
  Mail,
  MapPin,
  MessageCircle,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact Us | 24x7 Cab Booking & Customer Support Dehradun',
  description:
    'Contact Dhanora Cab Service Dehradun. 24x7 helpline for outstation taxis, airport pickups, and Chardham packages. Call +91 75058 00684 or visit Haridwar Bypass Road, Dehradun.',
  keywords: [
    'Contact Dhanora Cab Service',
    'Dehradun taxi phone number',
    'Dhanora Cab contact',
    'Dehradun cab customer care',
    'Book taxi Dehradun phone',
  ],
  alternates: {
    canonical: '/contact',
  },
  openGraph: {
    title: 'Contact Dhanora Cab Service — 24x7 Taxi Helpline',
    description:
      'Direct contact numbers, WhatsApp booking link, and office location in Dehradun. Call +91 75058 00684.',
    url: 'https://www.dhanoracabs.com/contact',
    images: ['/images/logo.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Dhanora Cab Service | 24x7 Booking Helpline',
    description: 'Instant taxi bookings and tour package inquiries in Dehradun.',
    images: ['/images/logo.jpg'],
  },
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#F8F7F2] text-[#14263D] flex flex-col antialiased">
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: '/' },
          { name: 'Contact Us', url: '/contact' },
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ContactPage',
            name: 'Contact Dhanora Cab Service',
            description: '24x7 taxi booking and customer support desk in Dehradun, Uttarakhand.',
            mainEntity: {
              '@type': 'TaxiService',
              name: 'Dhanora Cab Service',
              telephone: '+91 75058 00684',
              email: 'dhanoracab@gmail.com',
              address: {
                '@type': 'PostalAddress',
                streetAddress: 'Haridwar Bypass Road, Opp. Ring Road',
                addressLocality: 'Dehradun',
                addressRegion: 'Uttarakhand',
                postalCode: '248001',
                addressCountry: 'IN',
              },
            },
          }),
        }}
      />
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-[#EAF1F7] via-[#F3F6F9] to-[#F8F7F2] py-12 px-4 border-b border-[#E2E8F0]">
          <div className="max-w-4xl mx-auto text-center space-y-4">
            <h1 className="font-display font-black text-3xl sm:text-5xl text-[#14263D] tracking-tight">
              Contact Dhanora Cab Service Operations Desk
            </h1>
            <p className="text-sm sm:text-base text-[#4B5E76] leading-relaxed">
              Need an urgent airport pickup, custom Chardham quote, or group tempo traveller?
              Our dispatch coordinators are available 24x7 to assist you.
            </p>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-12 px-4 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column: Direct Contact Details */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-card space-y-5">
              <h2 className="font-display font-black text-xl text-[#14263D]">Direct Coordination Channels</h2>

              <div className="space-y-4 text-xs sm:text-sm">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#FEF8E7] flex items-center justify-center shrink-0 text-[#F5BE19]">
                    <Phone className="w-4 h-4 text-[#B91C1C]" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-slate-700 block uppercase">24x7 Phone Helpline</span>
                    <a href={BRAND_TOKENS.phoneCallUrl} className="font-black text-base text-[#14263D] hover:text-[#92400E]">
                      {BRAND_TOKENS.phonePrimary}
                    </a>
                    <div className="text-xs text-slate-700 font-medium">Secondary: {BRAND_TOKENS.phoneSecondary}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#DCFCE7] flex items-center justify-center shrink-0 text-[#15803D]">
                    <MessageCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-slate-700 block uppercase">Instant WhatsApp Chat</span>
                    <a
                      href={BRAND_TOKENS.whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-sm text-[#15803D] hover:underline"
                    >
                      Click here to start chat ({BRAND_TOKENS.phonePrimary})
                    </a>
                    <div className="text-xs text-slate-700 font-medium">Average response time: &lt; 2 minutes</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#EAF1F7] flex items-center justify-center shrink-0 text-[#0284C7]">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-[#62758F] block uppercase">Official Email</span>
                    <a href={`mailto:${BRAND_TOKENS.email}`} className="font-semibold text-sm text-[#14263D] hover:underline">
                      {BRAND_TOKENS.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#F8F7F2] border border-[#CBD5E1] flex items-center justify-center shrink-0 text-[#14263D]">
                    <MapPin className="w-4 h-4 text-[#F5BE19]" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-[#62758F] block uppercase">Control Hub Address</span>
                    <p className="text-xs text-[#334155] leading-relaxed font-medium">
                      {BRAND_TOKENS.address}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#14263D] text-white space-y-2 text-xs">
              <span className="font-bold text-[#F5BE19] uppercase tracking-wider block text-[10px]">
                Airport Pickup Guarantee
              </span>
              <p className="text-slate-300 leading-relaxed">
                Landing at Jolly Grant Airport (DED) late at night? Call our hotline for instant cab dispatch directly to the arrivals curb.
              </p>
            </div>
          </div>

          {/* Right Column: Interactive Enquiry Form Component */}
          <div>
            <ContactForm />
          </div>
        </section>
      </main>

      <Footer />
      <FloatingMobileBar />
    </div>
  );
}
