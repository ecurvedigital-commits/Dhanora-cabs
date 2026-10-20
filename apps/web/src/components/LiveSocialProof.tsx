'use client';

import React, { useState, useEffect } from 'react';
import { ShieldCheck, X, Car, MapPin } from 'lucide-react';

interface BookingFeedItem {
  id: string;
  name: string;
  from: string;
  to: string;
  vehicle: string;
  timeAgo: string;
}

const RECENT_BOOKINGS: BookingFeedItem[] = [
  {
    id: '1',
    name: 'Rohit S.',
    from: 'Dehradun ISBT',
    to: 'Mussoorie Mall Road',
    vehicle: 'Innova Crysta',
    timeAgo: '3m ago',
  },
  {
    id: '2',
    name: 'Priya M.',
    from: 'Jolly Grant Airport',
    to: 'Rishikesh Tapovan',
    vehicle: 'Sedan (Dzire)',
    timeAgo: '7m ago',
  },
  {
    id: '3',
    name: 'Dr. Anand K.',
    from: 'Delhi NCR',
    to: 'Dehradun Rajpur Rd',
    vehicle: 'Toyota Fortuner',
    timeAgo: '12m ago',
  },
  {
    id: '4',
    name: 'Sunita Sharma & Family',
    from: 'Haridwar Railway Stn',
    to: 'Chardham Yatra (10 Days)',
    vehicle: '12-Seater Tempo',
    timeAgo: '18m ago',
  },
  {
    id: '5',
    name: 'Vikram Joshi',
    from: 'Dehradun Clock Tower',
    to: 'Delhi Terminal 3',
    vehicle: 'Ertiga SUV',
    timeAgo: '26m ago',
  },
];

export function LiveSocialProof() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    if (isDismissed) return;

    // Initial delay so the visitor enjoys the hero section without early popups
    const initialTimer = setTimeout(() => {
      setIsVisible(true);
    }, 6000);

    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % RECENT_BOOKINGS.length);
        setIsVisible(true);
      }, 500);
    }, 9000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, [isDismissed]);

  if (isDismissed) return null;

  const current = RECENT_BOOKINGS[currentIndex]!;

  return (
    <div
      className={`fixed bottom-20 left-4 sm:bottom-6 sm:left-6 z-40 transition-all duration-500 ease-in-out ${
        isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-4 opacity-0 scale-95 pointer-events-none'
      }`}
    >
      <div className="bg-white rounded-2xl border border-slate-300 shadow-2xl p-3 sm:p-3.5 max-w-[320px] sm:max-w-[350px] flex items-start gap-3 relative group">
        {/* Pulsing Verified Indicator */}
        <div className="relative mt-1">
          <div className="w-8 h-8 rounded-full bg-[#EAF1F7] flex items-center justify-center text-[#14263D] font-bold">
            <Car className="w-4 h-4 text-[#92400E]" />
          </div>
          <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white animate-pulse" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 pr-4">
          <div className="flex items-center gap-1.5 text-xs text-slate-600 font-semibold">
            <span className="text-[#15803D] flex items-center gap-0.5">
              <ShieldCheck className="w-3.5 h-3.5 inline" /> Verified Booking
            </span>
            <span>•</span>
            <span>{current.timeAgo}</span>
          </div>

          <div className="text-sm font-bold text-[#14263D] truncate mt-0.5">
            {current.name}{' '}
            <span className="font-normal text-slate-600">reserved</span> {current.vehicle}
          </div>

          <div className="flex items-center gap-1 text-xs text-[#14263D] font-medium mt-0.5">
            <MapPin className="w-3.5 h-3.5 shrink-0 text-[#92400E]" />
            <span className="truncate">
              {current.from} → {current.to}
            </span>
          </div>
        </div>

        {/* Dismiss Button */}
        <button
          onClick={() => setIsDismissed(true)}
          className="text-slate-500 hover:text-slate-800 p-1 rounded-full transition-colors absolute top-2 right-2"
          aria-label="Dismiss real-time notification"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
