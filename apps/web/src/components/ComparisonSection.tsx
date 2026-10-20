'use client';

import React from 'react';
import { ShieldCheck, XCircle, CheckCircle2, Mountain, Snowflake, Compass, PhoneCall } from 'lucide-react';
import { BRAND_TOKENS } from '../lib/tokens';

interface ComparisonFeature {
  title: string;
  description: string;
  dehradunCab: string;
  genericApps: string;
}

const COMPARISON_DATA: ComparisonFeature[] = [
  {
    title: 'Mountain Chauffeur Expertise',
    description: 'Steep inclines, narrow hairpin curves, and sudden fog navigation.',
    dehradunCab: 'Verified Pahadi Chauffeurs with 8+ years hill driving experience',
    genericApps: 'Regular plain-road city drivers; high nausea & accident risk',
  },
  {
    title: 'AC on Steep Hill Climbs',
    description: 'Climbing up to Mussoorie, Dhanaulti, or Chardham ghats.',
    dehradunCab: '100% Guaranteed AC ON throughout the entire mountain trip',
    genericApps: 'Drivers frequently turn off AC on slopes to prevent engine strain',
  },
  {
    title: 'Last-Minute Cancellation',
    description: 'Reliability when you have a flight to catch or hotel booking.',
    dehradunCab: 'Zero Cancellation Guarantee with advance driver allotment',
    genericApps: 'Drivers reject or cancel hill routes after asking your destination',
  },
  {
    title: 'Luggage & Mountain Roof Carriers',
    description: 'Bulky trekking rucksacks, suitcases, and family luggage.',
    dehradunCab: 'Ample boot space + sturdy waterproof roof carrier on demand',
    genericApps: 'Only trunk space, often reduced by domestic CNG cylinders',
  },
  {
    title: '24x7 Local Roadside Support',
    description: 'Breakdown assistance, landslide detours, and road clearance.',
    dehradunCab: 'Direct local operations desk in Dehradun with swift backup cab',
    genericApps: 'Automated chatbots and overseas customer care queues',
  },
  {
    title: 'Pricing & Peak Surcharges',
    description: 'Festivals, monsoon alerts, and weekend tourist surges.',
    dehradunCab: 'Fixed, transparent hill rates with no hidden surge multiplier',
    genericApps: 'Surge pricing up to 2.5x during weekend jams and rain',
  },
];

export function ComparisonSection() {
  return (
    <section className="py-16 sm:py-24 px-4 bg-[#F8F7F2] relative border-b border-[#E2E8F0]">
      <div className="w-full max-w-[1280px] mx-auto px-2 sm:px-6 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <h2 className="font-display font-black text-3xl sm:text-4xl text-[#14263D] tracking-tight">
            Dehradun Mountain Cabs vs Generic Plain Aggregators
          </h2>
          <p className="text-[#4B5E76] text-sm sm:text-base leading-relaxed">
            Hill roads require experienced drivers and well-maintained cars.
            Here is why smart travelers choose our local hill drivers over regular app cabs.
          </p>
        </div>

        {/* Comparison Grid Table */}
        <div className="rounded-3xl bg-white border border-[#E2E8F0] shadow-card overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-12 border-b border-[#E2E8F0] bg-[#14263D] text-white p-4 sm:p-6 text-sm font-bold">
            <div className="md:col-span-5 text-white/90 uppercase tracking-wider text-xs">
              Travel Quality & Safety Standard
            </div>
            <div className="md:col-span-4 flex items-center gap-2 text-[#F5BE19] mt-2 md:mt-0 font-extrabold text-sm sm:text-base">
              <ShieldCheck className="w-5 h-5 shrink-0" />
              <span>Dehradun Cab Chauffeurs</span>
            </div>
            <div className="md:col-span-3 text-slate-300 mt-2 md:mt-0 text-xs sm:text-sm font-semibold">
              Generic App Cabs (Ola/Uber)
            </div>
          </div>

          <div className="divide-y divide-[#E2E8F0]">
            {COMPARISON_DATA.map((row, idx) => (
              <div
                key={idx}
                className="grid grid-cols-1 md:grid-cols-12 p-4 sm:p-5 gap-3 sm:gap-4 hover:bg-[#F8F7F2]/60 transition-colors"
              >
                {/* Column 1: Feature Title & Description */}
                <div className="md:col-span-5 space-y-1">
                  <h3 className="font-display font-bold text-sm sm:text-base text-[#14263D]">
                    {row.title}
                  </h3>
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    {row.description}
                  </p>
                </div>

                {/* Column 2: Our Advantage */}
                <div className="md:col-span-4 flex items-start gap-2.5 p-3 rounded-xl bg-[#FEF8E7]/40 border border-[#F5BE19]/20 text-[#14263D]">
                  <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm font-semibold leading-snug">
                    {row.dehradunCab}
                  </span>
                </div>

                {/* Column 3: Plain Aggregators */}
                <div className="md:col-span-3 flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 font-medium">
                  <XCircle className="w-4 h-4 text-[#DC2626] shrink-0 mt-0.5" />
                  <span className="text-xs leading-snug">
                    {row.genericApps}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Trust Banner */}
          <div className="bg-[#EAF1F7] p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#E2E8F0]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#FEF8E7] border border-[#F5BE19]/40 flex items-center justify-center shrink-0">
                <Snowflake className="w-5 h-5 text-[#92400E]" />
              </div>
              <div>
                <div className="font-display font-bold text-sm text-[#14263D]">
                  Need a Hill-Certified Chauffeur within 2 Hours?
                </div>
                <div className="text-xs text-[#4B5E76]">
                  Immediate dispatch available across Dehradun, Jolly Grant Airport, and Mussoorie.
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <a
                href={BRAND_TOKENS.phoneCallUrl}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#14263D] hover:bg-[#F5BE19] hover:text-[#14263D] text-white font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Call Dispatch: {BRAND_TOKENS.phonePrimary}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
