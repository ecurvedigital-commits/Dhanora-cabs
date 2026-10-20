'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  MapPin,
  Clock,
  Navigation,
  ArrowRight,
  TrendingUp,
  ShieldAlert,
  Car,
  ChevronRight,
  X,
  ShieldCheck,
  Coffee,
  Phone,
  PhoneCall,
  Compass,
} from 'lucide-react';
import { POPULAR_ROUTES, BRAND_TOKENS } from '../lib/tokens';
import { triggerBookingSelect } from '../lib/booking-events';

interface RouteElevationData {
  elevationGain: string;
  maxAltitude: string;
  hairpins: string;
  roadType: string;
  scenicStops: string[];
  bestTime: string;
  driverNote: string;
}

const ROUTE_DETAILS: Record<string, RouteElevationData> = {
  'dehradun-delhi': {
    elevationGain: '-424m (Descent to Indo-Gangetic Plains)',
    maxAltitude: '640m (Dehradun)',
    hairpins: '0 Hairpins (High-Speed Expressway)',
    roadType: 'Delhi–Saharanpur–Dehradun Expressway (NH 307)',
    scenicStops: ['Cheetal Grand (Khatauli)', 'Mohand Forest Pass & Tunnel', 'Shiva Tourist Dhaba'],
    bestTime: 'Early morning (05:00 AM) or Post-lunch (02:00 PM)',
    driverNote: 'Smooth asphalt throughout. Elevated wildlife corridor across Rajaji buffer zone.',
  },
  'dehradun-mussoorie': {
    elevationGain: '+1,365m (Steep Himalayan Ridge Climb)',
    maxAltitude: '2,005m (Mussoorie Library)',
    hairpins: '48 Hairpin Bends & Sharp Curves',
    roadType: 'Mussoorie Diversion via Rajpur Road / Kolhukhet',
    scenicStops: ['Maggie Point (View of Doon Valley)', 'Kolhukhet Toll Viewpoint', 'Kempty Falls Turnoff'],
    bestTime: 'Morning or Sunset for panoramic Doon valley twinkling lights',
    driverNote: 'Driven only by hill-certified senior chauffeurs. Low-gear engine braking strictly observed.',
  },
  'dehradun-airport': {
    elevationGain: '-90m (Gentle Valley Descent)',
    maxAltitude: '640m (Dehradun)',
    hairpins: '0 Hairpins (Wide Scenic Valley Highway)',
    roadType: 'Dehradun–Rishikesh Highway (NH 7) via Thano Forest',
    scenicStops: ['Song River Bridge', 'Thano Pine Reserve Forest', 'Baluwala Green Stretch'],
    bestTime: '2.5 hours prior to domestic flight departure time',
    driverNote: 'Flight number tracking included. Punctual airport terminal porch drop-off.',
  },
  'dehradun-haridwar': {
    elevationGain: '-326m (Holy Plains Descent)',
    maxAltitude: '640m (Dehradun)',
    hairpins: '0 Hairpins (Paved 4-lane Highway)',
    roadType: 'Haridwar–Dehradun Highway via Nepali Farm & Raiwala',
    scenicStops: ['Rajaji National Park green canopy', 'Motichur Sanctuary fringe', 'Shanti Kunj ashram gateway'],
    bestTime: 'Early morning to attend morning Ganga Aarti or 03:00 PM for Sandhya Aarti',
    driverNote: 'Elephant corridor crossing zone with 40 km/h safe speed monitoring.',
  },
  'dehradun-rishikesh': {
    elevationGain: '-268m (Foothills to Ganga Riverbank)',
    maxAltitude: '640m (Dehradun)',
    hairpins: '2 Mild Curves (Smooth scenic boulevard)',
    roadType: 'NH 7 direct via Doiwala & Ranipokhari',
    scenicStops: ['Tapovan suspension bridge view', 'AIIMS Rishikesh bypass', 'Neem Beach access path'],
    bestTime: 'Anytime; sunset aarti at Parmarth Niketan at 06:00 PM',
    driverNote: 'Direct resort drop to luxury camps in Shivpuri or yoga ashrams in Tapovan.',
  },
  'dehradun-chandigarh': {
    elevationGain: '-319m (Interstate Plains Run)',
    maxAltitude: '640m (Dehradun)',
    hairpins: '6 Gentle S-curves in foothills',
    roadType: 'NH 7 & NH 07 via Paonta Sahib & Kala Amb bypass',
    scenicStops: ['Paonta Sahib Yamuna Gurudwara', 'Herbertpur tea estates', 'Nahan border valley view'],
    bestTime: '06:00 AM to beat Panchkula/Zirakpur rush hour',
    driverNote: 'Toll-free alternate routes available. Interstate permit pre-cleared by dispatch desk.',
  },
};

const ROUTE_IMAGES: Record<string, string> = {
  'dehradun-delhi': '/images/tours/delhi-dehradun-expressway.jpg',
  'dehradun-mussoorie': '/images/tours/mussoorie-dhanaulti.jpg',
  'dehradun-airport': '/images/tours/jolly-grant-airport.jpg',
  'dehradun-haridwar': '/images/tours/haridwar-ganga-aarti.jpg',
  'dehradun-rishikesh': '/images/tours/rishikesh-rafting.jpg',
  'dehradun-chandigarh': '/images/hero-himalayan-highway.jpg',
};

export function PopularRoutesSection() {
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | 'Outstation' | 'Hill Climb' | 'Airport' | 'Pilgrimage'>('ALL');
  const [inspectRoute, setInspectRoute] = useState<(typeof POPULAR_ROUTES)[0] | null>(null);

  const filteredRoutes =
    selectedFilter === 'ALL'
      ? POPULAR_ROUTES
      : POPULAR_ROUTES.filter((r) => r.routeType === selectedFilter);

  const activeDetails = inspectRoute
    ? ROUTE_DETAILS[inspectRoute.id] || {
        elevationGain: '±450m (Mountain & Valley Transit)',
        maxAltitude: '1,200m (Foothills)',
        hairpins: '8–14 Hairpin Curves',
        roadType: 'National & State Paved Highway',
        scenicStops: ['Scenic Valley Viewpoint', 'Himalayan Herbal Tea Point'],
        bestTime: 'Early daylight hours recommended',
        driverNote: 'Certified mountain driver with standard mountain vehicle inspection checklist.',
      }
    : null;

  return (
    <section id="routes" className="py-12 sm:py-16 px-4 bg-[#EAF1F7] relative border-b border-[#E2E8F0]">
      <div className="w-full max-w-[1400px] mx-auto px-2 sm:px-6 xl:px-8 space-y-8 sm:space-y-10">
        {/* Section Header */}
        <div className="routes-header flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <h2 className="font-display font-black text-3xl sm:text-4xl text-[#14263D] tracking-tight">
              Popular Taxi Routes from Dehradun
            </h2>
            <p className="text-[#4B5E76] text-sm sm:text-base leading-relaxed">
              Enjoy fixed prices with no surge charges. Book quick one-way drops or
              round trips with experienced hill drivers.
            </p>
          </div>

          {/* Route Type Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
            {(['ALL', 'Outstation', 'Hill Climb', 'Airport', 'Pilgrimage'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedFilter === filter
                    ? 'bg-[#14263D] text-white shadow-sm'
                    : 'bg-white text-slate-700 hover:text-[#14263D] border border-[#CBD5E1]'
                }`}
              >
                {filter === 'ALL' ? 'All Routes' : filter}
              </button>
            ))}
          </div>
        </div>

        {/* Routes Grid: Exactly 5 per row on desktop */}
        <div className="routes-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-3.5">
          {(selectedFilter === 'ALL' ? filteredRoutes.slice(0, 5) : filteredRoutes).map((route) => {
            const routeImg = ROUTE_IMAGES[route.id] || '/images/hero-himalayan-highway.jpg';

            return (
              <div
                key={route.id}
                className="route-card rounded-2xl bg-white border border-[#E2E8F0] hover:border-[#F5BE19] overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 shadow-card hover:shadow-card-hover group"
              >
                {/* Visual Route Destination Banner with Zoom */}
                <div className="relative h-28 sm:h-32 w-full overflow-hidden bg-slate-100">
                  <img
                    src={routeImg}
                    alt={`${route.from} to ${route.to}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10" />

                  {/* Route Type Badge */}
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#0F172A] text-white border border-white/30 shadow-sm">
                    {route.routeType}
                  </span>

                  {/* Distance & Duration Badge */}
                  <div className="absolute bottom-1.5 left-2.5 right-2.5 flex items-center justify-between text-white text-[10px] font-semibold">
                    <span className="flex items-center gap-1 bg-[#0F172A] border border-white/20 px-2 py-0.5 rounded text-white text-[10px] font-semibold shadow-xs">
                      <Navigation className="w-2.5 h-2.5 text-[#F5BE19]" />
                      {route.distanceKm} km
                    </span>
                    <span className="flex items-center gap-1 bg-[#0F172A] border border-white/20 px-2 py-0.5 rounded text-white text-[10px] font-semibold shadow-xs">
                      <Clock className="w-2.5 h-2.5 text-slate-200" />
                      {route.approxDuration}
                    </span>
                  </div>
                </div>

                <div className="p-3 sm:p-3.5 flex-1 flex flex-col justify-between space-y-2.5">
                  <div className="space-y-2">
                    {/* Route Visual Pathway */}
                    <Link href={`/routes/${route.id}`} className="space-y-0.5 block group-hover:opacity-90">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-[#F5BE19] shrink-0" />
                        <div className="text-[#14263D] font-bold text-xs truncate group-hover:text-[#92400E] transition-colors">{route.from}</div>
                      </div>
                      <div className="ml-1 pl-2 border-l-2 border-dashed border-[#CBD5E1] text-[9px] text-slate-700 font-medium leading-none py-0.5">
                        Expressway Corridor
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-[#14263D] shrink-0" />
                        <div className="text-[#14263D] font-extrabold text-xs truncate group-hover:text-[#92400E] transition-colors">{route.to}</div>
                      </div>
                    </Link>

                    {/* Highlights */}
                    <p className="text-[10px] sm:text-[11px] text-[#4B5E76] leading-snug border-t border-[#E2E8F0] pt-1.5 line-clamp-2">
                      {route.highlight}
                    </p>

                    {/* Elevation & Scenic Inspection Trigger */}
                    <button
                      type="button"
                      onClick={() => setInspectRoute(route)}
                      className="w-full py-1.5 px-2 rounded-lg bg-[#EAF1F7] hover:bg-[#CBD5E1] text-[#14263D] text-[10px] font-bold flex items-center justify-center gap-1 transition-colors"
                    >
                      <TrendingUp className="w-3 h-3 text-[#92400E]" />
                      <span>Elevation & Stops</span>
                    </button>
                  </div>

                  {/* Bottom Price & CTA */}
                  <div className="pt-2 border-t border-[#E2E8F0] flex items-center justify-between">
                    <div>
                      <span className="text-[9px] text-slate-700 block uppercase font-bold leading-none">Fare Quote</span>
                      <span className="font-display font-bold text-xs sm:text-sm text-[#14263D]">
                        On Request
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        triggerBookingSelect({
                          pickup: route.from,
                          drop: route.to,
                          tab: route.to.toLowerCase().includes('airport') ? 'AIRPORT' : 'OUTSTATION',
                        })
                      }
                      className="px-3 py-1.5 rounded-lg bg-[#F5BE19] hover:bg-[#DFAC13] text-[#14263D] text-[11px] font-black flex items-center gap-0.5 transition-all shadow-sm cursor-pointer"
                    >
                      <span>Book</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Custom Outstation Banner - Premium Himalayan Dispatch */}
        <div className="p-5 sm:p-7 rounded-3xl bg-white border border-[#CBD5E1] shadow-card flex flex-col lg:flex-row items-center justify-between gap-5 transition-all">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-12 h-12 rounded-2xl bg-[#FEF8E7] border border-[#F5BE19]/40 flex items-center justify-center text-[#92400E] shrink-0 shadow-sm">
              <Navigation className="w-6 h-6 text-[#92400E]" />
            </div>
            <div className="space-y-1">
              <h3 className="font-display font-black text-base sm:text-lg text-[#14263D]">
                Planning a Custom Route or Multiple Sightseeing Stops?
              </h3>
              <p className="text-xs sm:text-sm text-[#4B5E76]">
                Plan custom road trips across North India with trusted hill drivers. Pick your stops, set your dates, and travel at your own pace.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 shrink-0 w-full sm:w-auto">
            <a
              href={BRAND_TOKENS.phoneCallUrl}
              className="px-5 py-3 rounded-xl bg-[#B91C1C] hover:bg-[#991B1B] text-white text-xs sm:text-sm font-bold tracking-wide transition-all shadow-sm flex items-center gap-2 justify-center"
            >
              <Phone className="w-4 h-4" />
              <span>Custom Route Quote</span>
            </a>
            <a
              href={BRAND_TOKENS.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 rounded-xl bg-[#15803D] hover:bg-[#166534] text-white text-xs sm:text-sm font-bold tracking-wide transition-all shadow-sm flex items-center gap-2 justify-center"
            >
              <PhoneCall className="w-4 h-4" />
              <span>WhatsApp Us</span>
            </a>
          </div>
        </div>
      </div>

      {/* Mountain Route Elevation & Scenic Stops Modal */}
      {inspectRoute && activeDetails && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-[#14263D]/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200"
          onClick={() => setInspectRoute(null)}
        >
          <div
            className="relative w-full max-w-xl bg-white rounded-3xl border border-[#CBD5E1] shadow-2xl overflow-hidden my-auto animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-[#14263D] text-white p-4 sm:p-5 relative flex items-start justify-between">
              <div className="space-y-1 pr-6">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#F5BE19] text-[#14263D] text-[10px] font-black uppercase tracking-wider">
                    {inspectRoute.routeType}
                  </span>
                  <span className="text-white/80 text-xs font-semibold">
                    {inspectRoute.distanceKm} km • {inspectRoute.approxDuration}
                  </span>
                </div>
                <h3 className="font-display font-black text-xl text-white">
                  {inspectRoute.from} ➔ {inspectRoute.to}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setInspectRoute(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors shrink-0"
                aria-label="Close elevation inspector"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              {/* Mountain Elevation Visual Strip */}
              <div className="p-3 sm:p-4 rounded-2xl bg-[#EAF1F7] border border-[#CBD5E1] space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-[#14263D]">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-[#F5BE19]" />
                    <span>{inspectRoute.from}</span>
                  </div>
                  <div className="text-[10px] text-slate-700 px-2 py-0.5 rounded bg-white font-mono border border-slate-200">
                    {inspectRoute.distanceKm} km Corridor
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-[#B91C1C]" />
                    <span>{inspectRoute.to}</span>
                  </div>
                </div>

                {/* Elevation Infographic Bar */}
                <div className="relative h-6 bg-white rounded-lg border border-[#CBD5E1] flex items-center px-3 justify-between text-[10px] font-semibold text-[#4B5E76] overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#FEF8E7] via-[#EAF1F7] to-[#DCFCE7] opacity-60" />
                  <span className="relative z-10 font-bold text-[#14263D]">Alt: {activeDetails.maxAltitude}</span>
                  <span className="relative z-10 text-[#92400E] font-extrabold flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    {activeDetails.elevationGain}
                  </span>
                </div>
              </div>

              {/* 4 Technical Corridor Metrics */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-[#F8F7F2] border border-[#E2E8F0]">
                  <span className="text-[10px] text-slate-700 block font-semibold">Hairpins & Curves</span>
                  <span className="font-bold text-[#14263D]">{activeDetails.hairpins}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#F8F7F2] border border-[#E2E8F0]">
                  <span className="text-[10px] text-slate-700 block font-semibold">Highway Infrastructure</span>
                  <span className="font-bold text-[#14263D] truncate block">{activeDetails.roadType}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#F8F7F2] border border-[#E2E8F0]">
                  <span className="text-[10px] text-slate-700 block font-semibold">Recommended Departure</span>
                  <span className="font-bold text-[#14263D]">{activeDetails.bestTime}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#F8F7F2] border border-[#E2E8F0]">
                  <span className="text-[10px] text-slate-700 block font-semibold">Tariff</span>
                  <span className="font-black text-sm text-[#14263D]">On Request</span>
                </div>
              </div>

              {/* Scenic Stopovers & Tea Vantage Points */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold text-[#14263D] flex items-center gap-1.5">
                  <Coffee className="w-3.5 h-3.5 text-[#92400E]" />
                  <span>Popular Scenic Stopovers & Refreshment Points</span>
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {activeDetails.scenicStops.map((stop) => (
                    <span
                      key={stop}
                      className="px-2.5 py-1 rounded-lg bg-white border border-[#CBD5E1] text-[11px] font-semibold text-[#14263D] shadow-2xs"
                    >
                      ☕ {stop}
                    </span>
                  ))}
                </div>
              </div>

              {/* Chauffeur Mountain Protocol */}
              <div className="p-3 rounded-xl bg-[#FEF8E7] border border-[#F5BE19]/40 text-xs text-amber-900 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-[#92400E] shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="font-bold block text-[11px]">Chauffeur Mountain Protocol</span>
                  <p className="text-[11px] leading-relaxed">{activeDetails.driverNote}</p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-[#F8F7F2] border-t border-[#E2E8F0] flex flex-col sm:flex-row items-center justify-between gap-2.5">
              <a
                href={BRAND_TOKENS.phoneCallUrl}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-white border border-[#CBD5E1] hover:bg-slate-50 text-[#14263D] text-xs font-bold flex items-center justify-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5 text-[#B91C1C]" />
                <span>Call Chauffeur Desk</span>
              </a>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setInspectRoute(null)}
                  className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-white border border-[#CBD5E1] text-[#4B5E76] text-xs font-bold"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const from = inspectRoute.from;
                    const to = inspectRoute.to;
                    setInspectRoute(null);
                    triggerBookingSelect({
                      pickup: from,
                      drop: to,
                      tab: to.toLowerCase().includes('airport') ? 'AIRPORT' : 'OUTSTATION',
                    });
                  }}
                  className="flex-1 sm:flex-initial px-5 py-2 rounded-xl bg-[#F5BE19] hover:bg-[#DFAC13] text-[#14263D] text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <span>Book This Route</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
