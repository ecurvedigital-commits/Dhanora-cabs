'use client';

import React from 'react';
import Link from 'next/link';
import {
  Car,
  Compass,
  Plane,
  Mountain,
  Users,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { BRAND_TOKENS } from '../lib/tokens';
import { triggerBookingSelect } from '../lib/booking-events';

function TaxiIcon({ className = 'w-14 h-14' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      {/* Taxi Roof Sign */}
      <rect x="18" y="7" width="12" height="6" rx="2" fill="currentColor" fillOpacity="0.25" strokeWidth="2" />
      <path d="M21 10H27" strokeWidth="2" />
      {/* Windshield & Cabin */}
      <path d="M10 24L14 14C14.8 12.8 16.2 12 17.8 12H30.2C31.8 12 33.2 12.8 34 14L38 24" />
      {/* Main Body */}
      <path d="M7 24H41C42.7 24 44 25.3 44 27V33C44 34.1 43.1 35 42 35H40V33.5C40 31 38 29 35.5 29C33 29 31 31 31 33.5V35H17V33.5C17 31 15 29 12.5 29C10 29 8 31 8 33.5V35H6C4.9 35 4 34.1 4 33V27C4 25.3 5.3 24 7 24Z" fill="currentColor" fillOpacity="0.15" />
      {/* Windows */}
      <path d="M14 22L17.5 15H23V22H14Z" fill="currentColor" fillOpacity="0.2" />
      <path d="M25 15H30.5L34 22H25V15Z" fill="currentColor" fillOpacity="0.2" />
      {/* Wheels */}
      <circle cx="12.5" cy="34" r="4.5" fill="currentColor" fillOpacity="0.35" strokeWidth="2.2" />
      <circle cx="35.5" cy="34" r="4.5" fill="currentColor" fillOpacity="0.35" strokeWidth="2.2" />
      {/* Headlights */}
      <circle cx="9" cy="27" r="1.5" fill="currentColor" />
      <circle cx="39" cy="27" r="1.5" fill="currentColor" />
    </svg>
  );
}

function OutstationCabIcon({ className = 'w-14 h-14' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      {/* Interstate Highway Road Curve Background */}
      <path d="M6 40C16 38 22 28 24 22" strokeDasharray="3 3" opacity="0.5" />
      <path d="M42 40C32 38 26 28 24 22" strokeDasharray="3 3" opacity="0.5" />
      {/* Sleek Sedan Cruiser */}
      <path d="M8 26L13 16C13.8 14.8 15.2 14 16.8 14H31.2C32.8 14 34.2 14.8 35 16L40 26" />
      <path d="M5 26H43C44.7 26 46 27.3 46 29V34C46 35.1 45.1 36 44 36H41V34C41 31.8 39.2 30 37 30C34.8 30 33 31.8 33 34V36H15V34C15 31.8 13.2 30 11 30C8.8 30 7 31.8 7 34V36H4C2.9 36 2 35.1 2 34V29C2 27.3 3.3 26 5 26Z" fill="currentColor" fillOpacity="0.15" />
      {/* Side Mirror & Windows */}
      <path d="M14 24L17.5 17H23V24H14Z" fill="currentColor" fillOpacity="0.2" />
      <path d="M25 17H30.5L34 24H25V17Z" fill="currentColor" fillOpacity="0.2" />
      {/* Wheels */}
      <circle cx="11" cy="35" r="4" fill="currentColor" fillOpacity="0.35" strokeWidth="2.2" />
      <circle cx="37" cy="35" r="4" fill="currentColor" fillOpacity="0.35" strokeWidth="2.2" />
    </svg>
  );
}

function AeroplaneIcon({ className = 'w-14 h-14' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      {/* Airplane Silhouette Angled for Takeoff */}
      <path
        d="M23 7C23 5.3 24.3 4 26 4C27.7 4 29 5.3 29 7V20L43 27V31L29 27V36L34 40V43L26 41L18 43V40L23 36V27L9 31V27L23 20V7Z"
        fill="currentColor"
        fillOpacity="0.18"
      />
      {/* Flight Motion Trail */}
      <path d="M7 41C12 39 16 35 18 30" strokeDasharray="2 3" opacity="0.6" />
    </svg>
  );
}

function TempleMandirIcon({ className = 'w-14 h-14' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      {/* Sacred Dhwaja / Temple Flag */}
      <path d="M24 3V9" />
      <path d="M24 3L32 6L24 9" fill="currentColor" fillOpacity="0.4" />
      {/* Kalash / Shikhar spire */}
      <circle cx="24" cy="10" r="1.5" fill="currentColor" />
      <path d="M19 18L24 11L29 18" />
      <path d="M15 23L24 14L33 23" />
      {/* Temple Roof Canopy */}
      <path d="M10 24H38" strokeWidth="2.5" />
      {/* Mandapa Pillars */}
      <path d="M14 24V37" />
      <path d="M20 24V37" />
      <path d="M28 24V37" />
      <path d="M34 24V37" />
      {/* Sanctum Garbhagriha Arch */}
      <path d="M20 37V32C20 29.8 21.8 28 24 28C26.2 28 28 29.8 28 32V37H20Z" fill="currentColor" fillOpacity="0.3" />
      {/* Plinth & Steps */}
      <path d="M8 37H40" strokeWidth="2.5" />
      <path d="M6 41H42" strokeWidth="2.5" />
    </svg>
  );
}

function BusTempoIcon({ className = 'w-14 h-14' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      {/* Tempo Traveller / Mini Coach Body */}
      <rect x="8" y="9" width="32" height="28" rx="4" fill="currentColor" fillOpacity="0.15" />
      {/* Destination Board */}
      <rect x="14" y="11" width="20" height="3" rx="1" fill="currentColor" fillOpacity="0.3" />
      {/* Large Front Windshield */}
      <rect x="11" y="16" width="26" height="11" rx="2" fill="currentColor" fillOpacity="0.2" />
      {/* Grille */}
      <line x1="16" y1="30" x2="32" y2="30" />
      <line x1="18" y1="33" x2="30" y2="33" />
      {/* Headlights */}
      <circle cx="12.5" cy="30.5" r="1.5" fill="currentColor" />
      <circle cx="35.5" cy="30.5" r="1.5" fill="currentColor" />
      {/* Heavy Highway Wheels */}
      <circle cx="13" cy="38" r="3.5" fill="currentColor" fillOpacity="0.35" strokeWidth="2.2" />
      <circle cx="35" cy="38" r="3.5" fill="currentColor" fillOpacity="0.35" strokeWidth="2.2" />
    </svg>
  );
}

export function ServicesSection() {
  const services = [
    {
      id: 'local',
      title: 'Local Taxi in Dehradun',
      icon: TaxiIcon,
      tag: 'Hourly & Day',
      startingRate: 'Custom Quote',
      description: 'City sightseeing: FRI, Robber’s Cave, Sahastradhara & Paltan Bazaar.',
      features: ['8hr / 80km packages', 'Zero waiting surge in traffic'],
      headerBg: 'bg-[#FEF8E7] text-[#92400E] border-[#FCD34D]/80',
      badgeColor: 'text-[#92400E] bg-[#FEF8E7] border-[#F5BE19]/40',
      iconBg: 'bg-white/80 border-amber-200 shadow-sm text-[#DFAC13]',
    },
    {
      id: 'outstation',
      title: 'Outstation Cabs',
      icon: OutstationCabIcon,
      tag: 'One-Way / Return',
      startingRate: 'On Request',
      description: 'Interstate travel to Delhi NCR, Chandigarh, Agra, Haridwar & Punjab.',
      features: ['Doorstep pickup & drop', 'No return fare on one-way'],
      headerBg: 'bg-[#F1F5F9] text-[#1E293B] border-[#CBD5E1]',
      badgeColor: 'text-[#B91C1C] bg-[#FEE2E2] border-[#FCA5A5]',
      iconBg: 'bg-white/80 border-slate-300 shadow-sm text-[#14263D]',
    },
    {
      id: 'airport',
      title: 'Airport Transfers',
      icon: AeroplaneIcon,
      tag: '24x7 Punctual',
      startingRate: 'Fixed Quote',
      description: 'Reliable transfers to Jolly Grant Airport (DED) with flight tracking.',
      features: ['Flight delay monitoring', 'Free 45-min airport wait'],
      headerBg: 'bg-[#F0F9FF] text-[#0369A1] border-[#BAE6FD]',
      badgeColor: 'text-[#15803D] bg-[#DCFCE7] border-[#86EFAC]',
      iconBg: 'bg-white/80 border-sky-200 shadow-sm text-[#0284C7]',
    },
    {
      id: 'chardham',
      title: 'Chardham Yatra',
      icon: TempleMandirIcon,
      tag: 'Himalayan Tour',
      startingRate: '10-Day Plans',
      description: 'Sacred pilgrimage: Yamunotri, Gangotri, Kedarnath & Badrinath shrines.',
      features: ['Mountain-certified drivers', 'Oxygen & medical kit ready'],
      headerBg: 'bg-[#FFF7ED] text-[#C2410C] border-[#FED7AA]',
      badgeColor: 'text-[#92400E] bg-[#FEF8E7] border-[#F5BE19]/40',
      iconBg: 'bg-white/80 border-orange-200 shadow-sm text-[#EA580C]',
    },
    {
      id: 'tempo',
      title: 'Tempo & Tour Packages',
      icon: BusTempoIcon,
      tag: '12–26 Seater',
      startingRate: 'On Request',
      description: 'Family yatras, corporate groups, Mussoorie & Dhanaulti holiday circuits.',
      features: ['Pushback recliner seats', 'Dedicated luggage carrier'],
      headerBg: 'bg-[#ECFDF5] text-[#047857] border-[#A7F3D0]',
      badgeColor: 'text-[#0369A1] bg-[#E0F2FE] border-[#7DD3FC]',
      iconBg: 'bg-white/80 border-emerald-200 shadow-sm text-[#059669]',
    },
  ];

  return (
    <section id="services" className="py-10 sm:py-14 px-3 sm:px-4 bg-white relative border-b border-[#E2E8F0]">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        {/* Section Header */}
        <div className="services-header text-center max-w-2xl mx-auto space-y-2">
          <h2 className="font-display font-black text-2xl sm:text-3xl text-[#14263D] tracking-tight">
            Comprehensive Taxi Solutions in Dehradun
          </h2>
          <p className="text-[#4B5E76] text-xs sm:text-sm leading-normal">
            Clean cabs, verified local drivers, and custom transparent quotes for every city and hill trip.
          </p>
        </div>

        {/* Services Grid: Exactly 5 per row on desktop */}
        <div className="services-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-3.5">
          {services.map((srv) => {
            const Icon = srv.icon;
            return (
              <div
                key={srv.id}
                className="service-card rounded-2xl bg-white border border-[#E2E8F0] hover:border-[#F5BE19] overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 shadow-card hover:shadow-card-hover group"
              >
                {/* Visual Icon Header with Refined Modern Aesthetic */}
                <div className={`relative h-36 w-full p-3 flex flex-col justify-between items-center border-b ${srv.headerBg} transition-colors`}>
                  {/* Floating Category Tag */}
                  <div className="w-full flex items-center justify-between z-10">
                    <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-white text-[#14263D] border border-slate-200/90 shadow-2xs">
                      {srv.tag}
                    </span>

                    {/* Floating Rate Tag */}
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-[#F5BE19] text-[#14263D] shadow-xs">
                      {srv.startingRate}
                    </span>
                  </div>

                  {/* Centered Big Icon with Hover Motion */}
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border ${srv.iconBg} group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-11 h-11" />
                  </div>

                  {/* Card Title inside Header */}
                  <div className="w-full text-center">
                    <h3 className="font-display font-bold text-sm text-[#14263D] truncate drop-shadow-2xs">
                      {srv.title}
                    </h3>
                  </div>
                </div>

                {/* Content Area */}
                <div className="p-3 flex-1 flex flex-col justify-between space-y-2">
                  <div>
                    <p className="text-xs text-[#4B5E76] leading-relaxed line-clamp-2">
                      {srv.description}
                    </p>

                    {/* Key Features */}
                    <ul className="mt-2 space-y-1 border-t border-[#E2E8F0] pt-1.5 text-xs text-[#334155]">
                      {srv.features.map((feat, idx) => (
                        <li key={idx} className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#15803D] shrink-0" />
                          <span className="truncate">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Bottom Action */}
                  <div className="pt-2 border-t border-[#E2E8F0] flex items-center justify-between text-[10px]">
                    <button
                      type="button"
                      onClick={() => {
                        let tab: 'OUTSTATION' | 'LOCAL_TAXI' | 'AIRPORT' | 'TOUR_PACKAGE' = 'OUTSTATION';
                        let drop: string | undefined = undefined;
                        let vehicleId: string | undefined = undefined;

                        if (srv.id === 'airport') {
                          tab = 'AIRPORT';
                          drop = 'Jolly Grant Airport';
                        } else if (srv.id === 'local') {
                          tab = 'LOCAL_TAXI';
                        } else if (srv.id === 'chardham') {
                          tab = 'TOUR_PACKAGE';
                          drop = 'Chardham Yatra';
                        } else if (srv.id === 'tempo') {
                          tab = 'OUTSTATION';
                          vehicleId = 'tempo-12';
                        }

                        triggerBookingSelect({ tab, drop, vehicleId });
                      }}
                      className="font-bold text-[#14263D] group-hover:text-[#92400E] flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <span>Book Now</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                    <a
                      href={`https://wa.me/917505800684?text=Hi%20Dhanora%20Cab,%20I%20am%20interested%20in%20${encodeURIComponent(
                        srv.title
                      )}.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-[#15803D] hover:text-[#166534]"
                    >
                      WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* View All Services Link */}
        <div className="text-center pt-2">
          <a
            href="/services"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-[#FEF8E7] text-[#14263D] hover:text-[#92400E] border border-slate-200 hover:border-[#F5BE19]/50 text-xs sm:text-sm font-bold transition-all shadow-sm group"
          >
            <span>Explore All 5 Dedicated Taxi & Mountain Tour Services</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-[#92400E]" />
          </a>
        </div>
      </div>
    </section>
  );
}
