'use client';

import React from 'react';
import {
  Sun,
  CloudSun,
  ShieldCheck,
  Compass,
  AlertCircle,
  Phone,
  Plane,
  Sparkles,
  ChevronRight,
  Mountain,
} from 'lucide-react';
import { BRAND_TOKENS } from '../lib/tokens';

export function MountainStatusTicker() {
  const statusUpdates = [
    {
      id: 'weather-ded',
      icon: Sun,
      color: 'text-amber-500',
      label: 'Dehradun Valley',
      value: '24°C Sunny & Clear',
      status: 'Ideal for travel',
    },
    {
      id: 'road-mussoorie',
      icon: Mountain,
      color: 'text-emerald-600',
      label: 'Mussoorie Hill Route',
      value: 'Open & Smooth',
      status: 'Traffic flowing normally (34 km, ~1h 15m)',
    },
    {
      id: 'airport-ded',
      icon: Plane,
      color: 'text-sky-600',
      label: 'Jolly Grant Airport (DED)',
      value: 'All Flights On Schedule',
      status: 'Drivers staged at terminal',
    },
    {
      id: 'road-delhi',
      icon: Compass,
      color: 'text-indigo-600',
      label: 'Delhi-Dehradun Expressway',
      value: 'Clear Dual Carriageway',
      status: 'Travel time ~4.5 hours',
    },
    {
      id: 'chardham-highway',
      icon: ShieldCheck,
      color: 'text-emerald-600',
      label: 'Char Dham Highway Corridor',
      value: 'Clear Weather & Active Patrol',
      status: 'Commercial mountain permits verified',
    },
  ];

  return (
    <div className="bg-[#14263D] text-white border-y border-[#253952] py-2 px-3 sm:px-4 text-xs font-sans relative overflow-hidden">
      {/* Background Subtle Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#14263D] via-[#1A314E] to-[#14263D] pointer-events-none" />

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2.5 relative z-10">
        {/* Left: Operational Live Badge */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#15803D]/30 border border-[#22C55E]/40 text-[#4ADE80] font-bold text-[11px] tracking-wide">
            <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
            <span className="uppercase">LIVE TRANSIT STATUS</span>
          </div>
          <span className="hidden lg:inline text-slate-400 text-[11px]">
            Real-time Uttarakhand highway advisories & weather updates
          </span>
        </div>

        {/* Center: Scrollable / Horizontally Flexed Ticker Items */}
        <div className="flex items-center gap-3 sm:gap-5 overflow-x-auto w-full md:w-auto scrollbar-none py-0.5 justify-start md:justify-center">
          {statusUpdates.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="flex items-center gap-2 shrink-0 text-[11px] bg-white/5 hover:bg-white/10 px-2.5 py-1 rounded-lg border border-white/10 transition-colors"
                title={`${item.label}: ${item.value} — ${item.status}`}
              >
                <Icon className={`w-3.5 h-3.5 ${item.color} shrink-0`} />
                <span className="font-bold text-slate-200">{item.label}:</span>
                <span className="text-[#F5BE19] font-medium">{item.value}</span>
              </div>
            );
          })}
        </div>

        {/* Right: Emergency Helpline CTA */}
        <div className="hidden xl:flex items-center gap-2 shrink-0 text-[11px]">
          <span className="text-slate-400">24x7 Roadside Support:</span>
          <a
            href={BRAND_TOKENS.phoneCallUrl}
            className="font-bold text-white hover:text-[#F5BE19] transition-colors flex items-center gap-1 bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded-lg border border-white/10"
          >
            <Phone className="w-3 h-3 text-[#F5BE19]" />
            <span>{BRAND_TOKENS.phonePrimary}</span>
          </a>
        </div>
      </div>
    </div>
  );
}
