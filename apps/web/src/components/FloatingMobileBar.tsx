'use client';

import React from 'react';
import { BRAND_TOKENS } from '@/lib/tokens';
import { Phone, MessageSquare, Car } from 'lucide-react';

export const FloatingMobileBar: React.FC = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white/95 backdrop-blur-xl border-t border-[#CBD5E1] p-2.5 px-4 shadow-2xl safe-area-pb">
      <div className="grid grid-cols-3 gap-2 max-w-md mx-auto">
        {/* Call button */}
        <a
          href={`tel:${BRAND_TOKENS.contact.phone.replace(/[^0-9+]/g, '')}`}
          className="flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-[#B91C1C] text-white active:scale-95 transition-transform shadow-sm"
        >
          <Phone className="w-4 h-4 mb-0.5" />
          <span className="text-[11px] font-black tracking-wide uppercase">Call Now</span>
        </a>

        {/* WhatsApp button */}
        <a
          href={BRAND_TOKENS.contact.whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-[#15803D] text-white active:scale-95 transition-transform shadow-sm"
        >
          <MessageSquare className="w-4 h-4 mb-0.5" />
          <span className="text-[11px] font-black tracking-wide uppercase">WhatsApp</span>
        </a>

        {/* Book button */}
        <a
          href="#booking"
          className="flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-[#F5BE19] text-[#14263D] active:scale-95 transition-transform shadow-sm"
        >
          <Car className="w-4 h-4 mb-0.5" />
          <span className="text-[11px] font-black tracking-wide uppercase">Book Cab</span>
        </a>
      </div>
    </div>
  );
};
