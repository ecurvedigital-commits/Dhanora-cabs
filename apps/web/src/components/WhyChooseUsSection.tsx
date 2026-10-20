'use client';

import React from 'react';
import {
  ShieldCheck,
  Clock,
  Tag,
  PhoneCall,
  MapPin,
  Sparkles,
  Award,
  HeartHandshake,
} from 'lucide-react';
import { BRAND_TOKENS } from '../lib/tokens';

export function WhyChooseUsSection() {
  const points = [
    {
      title: 'Mountain Drivers',
      icon: Award,
      desc: 'Local chauffeurs with 5+ years of verified hill driving on narrow ghats.',
    },
    {
      title: '100% On-Time',
      icon: Clock,
      desc: 'Never miss an airport flight or train. Punctual doorstep dispatch.',
    },
    {
      title: 'Guaranteed Low Rates',
      icon: Tag,
      desc: 'Sedans from ₹13/km. Transparent billing with zero hidden surcharges.',
    },
    {
      title: '24/7 Live Support',
      icon: PhoneCall,
      desc: 'Direct human assistance on call & WhatsApp. Emergency backup cabs.',
    },
    {
      title: 'Fleet Hygiene',
      icon: Sparkles,
      desc: 'Sanitized vehicles before every ride. Dual AC and phone charging.',
    },
  ];

  return (
    <section id="why-choose" className="py-14 sm:py-20 px-3 sm:px-4 bg-white relative border-b border-[#E2E8F0]">
      <div className="w-full max-w-[1400px] mx-auto px-2 sm:px-6 xl:px-8 space-y-10 sm:space-y-12">
        {/* Header */}
        <div className="why-header text-center max-w-2xl mx-auto space-y-3">
          <h2 className="font-display font-black text-3xl sm:text-4xl text-[#14263D] tracking-tight">
            Why Book Your Taxi with Dehradun Cab?
          </h2>
          <p className="text-[#4B5E76] text-sm sm:text-base leading-relaxed">
            Over a decade of trusted operations in Dehradun, serving thousands of tourists and pilgrims.
          </p>
        </div>

        {/* 5 Feature Blocks: Exactly 5 per row on desktop */}
        <div className="why-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
          {points.map((pt, i) => {
            const Icon = pt.icon;
            return (
              <div
                key={i}
                className="why-card p-4 sm:p-5 rounded-2xl bg-[#F8F7F2] border border-[#E2E8F0] hover:border-[#F5BE19] transition-all duration-300 hover:-translate-y-1 shadow-card hover:shadow-card-hover space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-white border border-[#CBD5E1] flex items-center justify-center text-[#92400E] shadow-sm">
                    <Icon className="w-5 h-5 text-[#92400E]" />
                  </div>
                  <h3 className="font-display font-bold text-sm sm:text-base text-[#14263D]">
                    {pt.title}
                  </h3>
                  <p className="text-xs text-[#4B5E76] leading-relaxed">
                    {pt.desc}
                  </p>
                </div>
                <div className="pt-2 border-t border-[#E2E8F0]/60 flex items-center gap-1 text-[10px] font-bold text-[#15803D]">
                  <ShieldCheck className="w-3 h-3 text-[#15803D]" />
                  <span>Guaranteed Standard</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Emergency Call to Action Strip */}
        <div className="rounded-3xl bg-[#FEF8E7] border border-[#F5BE19] text-[#14263D] p-6 sm:p-8 flex flex-col lg:flex-row items-center justify-between gap-6 shadow-card">
          <div className="space-y-2 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-white border border-[#F5BE19]/60 text-[#92400E] text-[10px] font-extrabold uppercase tracking-wider shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Live 24/7 Dispatch Desk • 10–15 Min Arrival</span>
            </div>
            <h3 className="font-display font-black text-2xl sm:text-3xl tracking-tight text-[#14263D]">
              Need a Cab Right Now in Dehradun?
            </h3>
            <p className="text-sm font-medium text-[#4B5E76] max-w-xl">
              Our 24-hour dispatch team assigns the nearest verified cab within 10–15 minutes
              anywhere in Dehradun, Mussoorie, or Jolly Grant Airport.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
            <a
              href={BRAND_TOKENS.phoneCallUrl}
              className="px-6 py-3.5 rounded-xl bg-[#B91C1C] hover:bg-[#991B1B] text-white font-extrabold text-sm uppercase tracking-wider shadow-sm transition-all flex items-center gap-2"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Call: {BRAND_TOKENS.phonePrimary}</span>
            </a>
            <a
              href={BRAND_TOKENS.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 rounded-xl bg-[#15803D] hover:bg-[#166534] text-white font-extrabold text-sm uppercase tracking-wider shadow-sm transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-[#F5BE19]" />
              <span>WhatsApp Dispatch</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
