'use client';

import React, { useState } from 'react';
import { FAQS, BRAND_TOKENS, type FaqItem } from '@/lib/tokens';
import {
  ChevronDown,
  HelpCircle,
  PhoneCall,
  MessageSquare,
  ShieldCheck,
  CreditCard,
  Plane,
  Mountain,
  CalendarCheck,
} from 'lucide-react';

const CATEGORIES = [
  { id: 'ALL', label: 'All Questions', icon: HelpCircle },
  { id: 'Billing & Pricing', label: 'Billing & Pricing', icon: CreditCard },
  { id: 'Airport & Outstation', label: 'Airport & Outstation', icon: Plane },
  { id: 'Hill Safety', label: 'Hill Safety', icon: Mountain },
  { id: 'Booking & Policies', label: 'Booking & Policies', icon: CalendarCheck },
] as const;

export const FaqSection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [openId, setOpenId] = useState<string | null>('faq-1');

  const filteredFaqs =
    selectedCategory === 'ALL'
      ? FAQS
      : FAQS.filter((faq) => faq.category === selectedCategory);

  const toggle = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="faqs" className="py-20 sm:py-24 bg-[#F8F7F2] text-[#14263D] relative overflow-hidden border-b border-[#E2E8F0]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#14263D] tracking-tight">
            Transparent Answers for Your <span className="text-[#92400E]">Mountain Journey</span>
          </h2>
          <p className="mt-4 text-[#4B5E76] text-base sm:text-lg leading-relaxed">
            Real answers regarding highway tolls, flight tracking, mountain AC usage, advance deposits, and cancellation policies.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-10">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            const count =
              cat.id === 'ALL'
                ? FAQS.length
                : FAQS.filter((f) => f.category === cat.id).length;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  setSelectedCategory(cat.id);
                  // Open first matching item in that category
                  const firstMatch =
                    cat.id === 'ALL'
                      ? FAQS[0]
                      : FAQS.find((f) => f.category === cat.id);
                  if (firstMatch) setOpenId(firstMatch.id);
                }}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  isSelected
                    ? 'bg-[#14263D] text-[#F5BE19] shadow-sm'
                    : 'bg-white text-slate-700 border border-[#E2E8F0] hover:border-[#F5BE19] hover:text-[#14263D]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? 'text-[#F5BE19]' : 'text-slate-600'}`} />
                <span>{cat.label}</span>
                <span
                  className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                    isSelected
                      ? 'bg-white/10 text-[#F5BE19]'
                      : 'bg-slate-200 text-slate-800'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Accordion Container */}
        <div className="space-y-3.5">
          {filteredFaqs.map((faq, idx) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className={`rounded-2xl transition-all duration-200 border ${
                  isOpen
                    ? 'bg-white border-[#F5BE19] shadow-card'
                    : 'bg-white border-[#E2E8F0] hover:border-[#CBD5E1]'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggle(faq.id)}
                  className="w-full text-left px-5 sm:px-6 py-4 sm:py-5 flex items-center justify-between gap-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F5BE19] rounded-2xl"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-start sm:items-center gap-3">
                    <span className="text-[11px] font-black text-[#92400E] px-2 py-1 rounded-md bg-[#FEF8E7] border border-[#F5BE19]/40 shrink-0 mt-0.5 sm:mt-0">
                      Q{idx + 1}
                    </span>
                    <span className="text-sm sm:text-base font-bold text-[#14263D] leading-snug">
                      {faq.question}
                    </span>
                  </div>
                  <div
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${
                      isOpen
                        ? 'bg-[#F5BE19] text-[#14263D] rotate-180'
                        : 'bg-[#EAF1F7] text-[#4B5E76]'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-5 pt-1 text-[#4B5E76] text-xs sm:text-sm leading-relaxed border-t border-[#F1F5F9] font-normal">
                    <div className="pt-2 flex items-start gap-2.5">
                      <ShieldCheck className="w-4 h-4 text-[#15803D] shrink-0 mt-0.5" />
                      <p>{faq.answer}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Need More Help Box */}
        <div className="mt-14 bg-[#EAF1F7] border border-[#CBD5E1] rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-card">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-lg sm:text-xl font-bold text-[#14263D]">
              Have a custom route or group pilgrimage enquiry?
            </h3>
            <p className="text-[#4B5E76] text-xs sm:text-sm">
              Our 24x7 Dehradun dispatch desk is on standby for custom quotes, Tempo Travellers, and multi-day packages.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
            <a
              href={`tel:${BRAND_TOKENS.contact.phone.replace(/[^0-9+]/g, '')}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#B91C1C] hover:bg-[#991B1B] text-white font-bold text-xs transition-all shadow-sm focus:ring-2 focus:ring-[#B91C1C] focus:ring-offset-2"
              aria-label={`Call 24x7 support at ${BRAND_TOKENS.contact.phone}`}
            >
              <PhoneCall className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Call {BRAND_TOKENS.contact.phone}</span>
            </a>
            <a
              href={BRAND_TOKENS.contact.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#15803D] hover:bg-[#166534] text-white font-bold text-xs transition-all shadow-sm focus:ring-2 focus:ring-[#15803D] focus:ring-offset-2"
            >
              <MessageSquare className="w-3.5 h-3.5" aria-hidden="true" />
              <span>WhatsApp Direct</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
