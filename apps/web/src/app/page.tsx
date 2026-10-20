import React from 'react';
import { Header } from '@/components/Header';
import { HeroSection } from '@/components/HeroSection';
import { ServicesSection } from '@/components/ServicesSection';
import { PopularRoutesSection } from '@/components/PopularRoutesSection';
import { FleetPricingSection } from '@/components/FleetPricingSection';
import { ComparisonSection } from '@/components/ComparisonSection';
import { TourPackagesSection } from '@/components/TourPackagesSection';
import { WhyChooseUsSection } from '@/components/WhyChooseUsSection';
import { CustomerReviewsSection } from '@/components/CustomerReviewsSection';
import { FaqSection } from '@/components/FaqSection';
import { Footer } from '@/components/Footer';
import { FloatingMobileBar } from '@/components/FloatingMobileBar';
import { LiveSocialProof } from '@/components/LiveSocialProof';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#F8F7F2] text-[#14263D] flex flex-col antialiased selection:bg-[#F5BE19] selection:text-[#14263D]">
      {/* 1. Header with Top Contact Bar & Sticky Navigation */}
      <Header />

      {/* Main Content Area */}
      <main id="main-content" className="flex-grow">
        {/* 2. Cinematic Himalayan Road Hero with 1-Tap Quick Route Chips & Instant Booking */}
        <HeroSection />

        {/* 3. Core Services: Local, Outstation, Airport, Chardham, Tempo, Tours */}
        <ServicesSection />

        {/* 4. Popular Routes with Altitude Gain & Hairpin Data */}
        <PopularRoutesSection />

        {/* 5. Vehicle Fleet, Luggage Fit & Transparent Fare Matrix */}
        <FleetPricingSection />

        {/* 6. High-Trust Comparison: Mountain Chauffeurs vs Generic City App Cabs */}
        <ComparisonSection />

        {/* 7. Chardham Yatra & Uttarakhand Tour Packages */}
        <TourPackagesSection />

        {/* 8. Why Choose Our Mountain Service & Safety Standards */}
        <WhyChooseUsSection />

        {/* 9. Customer Reviews & Verified Traveler Testimonials */}
        <CustomerReviewsSection />

        {/* 10. FAQs & Mountain Travel Guidance */}
        <FaqSection />
      </main>

      {/* 11. Complete Footer with Regulatory Badges & High-Impact CTA Banner */}
      <Footer />

      {/* 12. Floating Live Booking Feed (Social Proof) */}
      <LiveSocialProof />

      {/* 13. Sticky Mobile Action Bar (Call, WhatsApp, Book) */}
      <FloatingMobileBar />
    </div>
  );
}
