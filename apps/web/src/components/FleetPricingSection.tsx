'use client';

import React from 'react';
import {
  Car,
  Users,
  Briefcase,
  Snowflake,
  ShieldCheck,
  ChevronRight,
  Info,
} from 'lucide-react';
import { FLEET_OPTIONS, BRAND_TOKENS, type VehicleOption } from '../lib/tokens';
import { triggerBookingSelect } from '../lib/booking-events';

const CAR_IMAGES: Record<string, string> = {
  sedan: '/images/fleet/swift-dzire.jpg',
  'suv-ertiga': '/images/fleet/maruti-ertiga.jpg',
  'suv-innova': '/images/fleet/innova-crysta.jpg',
  'tempo-12': '/images/fleet/tempo-traveller.jpg',
  'bus-luxury': '/images/fleet/luxury-bus.jpg',
};

export function FleetPricingSection() {
  return (
    <section id="fleet" className="py-14 sm:py-20 px-4 bg-[#F8F7F2] relative border-b border-[#E2E8F0]">
      <div className="w-full max-w-[1400px] mx-auto px-2 sm:px-6 xl:px-8 space-y-12 sm:space-y-16">
        {/* Section Header */}
        <div className="fleet-header text-center max-w-3xl mx-auto space-y-3">
          <h2 className="font-display font-black text-3xl sm:text-4xl text-[#14263D] tracking-tight">
            Transparent Pricing with Zero Hidden Charges
          </h2>
          <p className="text-[#4B5E76] text-sm sm:text-base leading-relaxed">
            Clean, insured tourist cabs checked daily for hill safety.
            Every booking includes cool AC, GPS tracking, and a courteous driver.
          </p>
        </div>

        {/* Fleet Cards Showcase: Exactly 5 per row on desktop */}
        <div className="fleet-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
          {FLEET_OPTIONS.map((car) => {
            const imgUrl = CAR_IMAGES[car.id] || CAR_IMAGES.sedan;

            return (
              <div
                key={car.id}
                className="fleet-card rounded-2xl bg-white border border-[#E2E8F0] hover:border-[#F5BE19] overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 shadow-card hover:shadow-card-hover relative group"
              >
                {/* Visual Vehicle Image with Zoom Micro-Animation */}
                <div className="relative h-32 sm:h-36 w-full overflow-hidden bg-slate-100">
                  <img
                    src={imgUrl}
                    alt={car.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/10" />

                  {/* Category Badge */}
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#0F172A] text-white border border-white/30 shadow-sm">
                    {car.category}
                  </span>

                  {/* Optional Badge */}
                  {car.badge && (
                    <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-[#F5BE19] text-[#14263D] font-black text-[9px] uppercase tracking-wider shadow-sm">
                      {car.badge}
                    </span>
                  )}

                  {/* Overlay Name */}
                  <div className="absolute bottom-2 left-2.5 right-2.5">
                    <span className="inline-block bg-[#0F172A] border border-white/20 px-2 py-0.5 rounded-md">
                      <h3 className="font-display font-bold text-xs sm:text-[13px] text-white leading-tight line-clamp-1">
                        {car.name}
                      </h3>
                    </span>
                  </div>
                </div>

                <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2.5">
                  <div className="space-y-2">
                    <div className="text-[10px] sm:text-[11px] text-slate-700 line-clamp-1 font-semibold">{car.models}</div>

                    {/* Key Capacity Specs */}
                    <div className="grid grid-cols-3 gap-1 py-1.5 border-y border-[#E2E8F0] text-[10px]">
                      <div className="flex items-center gap-1 text-[#334155] font-semibold">
                        <Users className="w-3 h-3 text-[#F5BE19] shrink-0" />
                        <span className="truncate">{car.seatingCapacity} Seats</span>
                      </div>
                      <div className="flex items-center gap-1 text-[#334155] font-semibold">
                        <Briefcase className="w-3 h-3 text-[#F5BE19] shrink-0" />
                        <span className="truncate">{car.luggageCapacity} Bags</span>
                      </div>
                      <div className="flex items-center gap-1 text-[#334155] font-semibold">
                        <Snowflake className="w-3 h-3 text-[#F5BE19] shrink-0" />
                        <span>Dual AC</span>
                      </div>
                    </div>

                    {/* Mountain Suitability & Luggage Assurance */}
                    <div className="px-2.5 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200/60 text-xs text-emerald-800 font-medium flex items-center justify-between">
                      <span>🏔️ Hill-AC Guaranteed</span>
                      <span className="text-slate-600">🧳 {car.luggageCapacity} Large Bags</span>
                    </div>

                    {/* Rates Highlight */}
                    <div className="p-2.5 rounded-xl bg-[#EAF1F7] border border-[#CBD5E1]/80 space-y-1 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="text-[#4B5E76] font-medium">Pricing:</span>
                        <span className="font-display font-bold text-xs text-[#14263D]">
                          On Request
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-[#4B5E76] text-xs">
                        <span>Best Quote:</span>
                        <span className="text-[#14263D] font-bold">Call / WhatsApp</span>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Action */}
                  <div className="pt-2 border-t border-[#E2E8F0]">
                    <button
                      type="button"
                      onClick={() => triggerBookingSelect({ vehicleId: car.id })}
                      className="w-full py-2.5 px-3 rounded-lg bg-[#14263D] hover:bg-[#F5BE19] hover:text-[#14263D] text-white font-bold text-xs flex items-center justify-center gap-1 transition-all shadow-sm group/btn cursor-pointer"
                    >
                      <span>Select {car.category}</span>
                      <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pricing Comparison Table */}
        <div className="rounded-3xl bg-white border border-[#E2E8F0] shadow-card p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-display font-bold text-xl text-[#14263D]">
                Official Dehradun Cab Fare Matrix
              </h3>
              <p className="text-xs text-slate-700 mt-1 font-medium">
                Verified mountain-ready vehicle classes for city rentals, airport transfers, and outstation trips.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-[#14263D] bg-[#EAF1F7] px-3.5 py-2 rounded-xl border border-[#CBD5E1]/80 font-medium">
              <Info className="w-4 h-4 text-[#F5BE19]" />
              <span>Standard 250 km / day minimum on outstation</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#E2E8F0] bg-[#EAF1F7] text-[#14263D] uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4 font-bold rounded-l-xl">Vehicle Class</th>
                  <th className="py-3 px-4 font-bold">Models Included</th>
                  <th className="py-3 px-4 font-bold text-[#14263D]">Outstation Tariff</th>
                  <th className="py-3 px-4 font-bold">Hourly Rental</th>
                  <th className="py-3 px-4 font-bold">Chauffeur Allowance</th>
                  <th className="py-3 px-4 font-bold text-right rounded-r-xl">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0] text-[#334155]">
                <tr className="hover:bg-[#F8F7F2] transition-colors">
                  <td className="py-3.5 px-4 font-bold text-[#14263D] flex items-center gap-2">
                    <Car className="w-4 h-4 text-[#F5BE19]" />
                    Sedan
                  </td>
                  <td className="py-3.5 px-4 text-slate-700 font-medium">Swift Dzire / Toyota Etios</td>
                  <td className="py-3.5 px-4 font-extrabold text-[#14263D] text-sm">On Request</td>
                  <td className="py-3.5 px-4 font-medium text-slate-700">On Request</td>
                  <td className="py-3.5 px-4 font-medium text-emerald-700">Included in Quote</td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => triggerBookingSelect({ vehicleId: 'sedan' })}
                      className="px-3.5 py-1.5 rounded-lg bg-[#FEF8E7] hover:bg-[#F5BE19] text-[#14263D] font-bold transition-all text-[11px] border border-[#F5BE19]/40 cursor-pointer"
                    >
                      Book Sedan
                    </button>
                  </td>
                </tr>

                <tr className="hover:bg-[#F8F7F2] transition-colors">
                  <td className="py-3.5 px-4 font-bold text-[#14263D] flex items-center gap-2">
                    <Car className="w-4 h-4 text-[#F5BE19]" />
                    SUV (Compact)
                  </td>
                  <td className="py-3.5 px-4 text-slate-700 font-medium">Maruti Suzuki Ertiga</td>
                  <td className="py-3.5 px-4 font-extrabold text-[#14263D] text-sm">On Request</td>
                  <td className="py-3.5 px-4 font-medium text-slate-700">On Request</td>
                  <td className="py-3.5 px-4 font-medium text-emerald-700">Included in Quote</td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => triggerBookingSelect({ vehicleId: 'suv-ertiga' })}
                      className="px-3.5 py-1.5 rounded-lg bg-[#FEF8E7] hover:bg-[#F5BE19] text-[#14263D] font-bold transition-all text-[11px] border border-[#F5BE19]/40 cursor-pointer"
                    >
                      Book Ertiga
                    </button>
                  </td>
                </tr>

                <tr className="hover:bg-[#F8F7F2] transition-colors">
                  <td className="py-3.5 px-4 font-bold text-[#14263D] flex items-center gap-2">
                    <Car className="w-4 h-4 text-[#F5BE19]" />
                    Premium Mountain SUV
                  </td>
                  <td className="py-3.5 px-4 text-slate-700 font-medium">Toyota Innova Crysta</td>
                  <td className="py-3.5 px-4 font-extrabold text-[#14263D] text-sm">On Request</td>
                  <td className="py-3.5 px-4 font-medium text-slate-700">On Request</td>
                  <td className="py-3.5 px-4 font-medium text-emerald-700">Included in Quote</td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => triggerBookingSelect({ vehicleId: 'suv-innova' })}
                      className="px-3.5 py-1.5 rounded-lg bg-[#FEF8E7] hover:bg-[#F5BE19] text-[#14263D] font-bold transition-all text-[11px] border border-[#F5BE19]/40 cursor-pointer"
                    >
                      Book Crysta
                    </button>
                  </td>
                </tr>

                <tr className="hover:bg-[#F8F7F2] transition-colors">
                  <td className="py-3.5 px-4 font-bold text-[#14263D] flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#F5BE19]" />
                    12–16 Seater Tempo
                  </td>
                  <td className="py-3.5 px-4 text-slate-700 font-medium">Force Traveller Recliner</td>
                  <td className="py-3.5 px-4 font-extrabold text-[#14263D] text-sm">On Request</td>
                  <td className="py-3.5 px-4 font-medium text-slate-700">On Request</td>
                  <td className="py-3.5 px-4 font-medium text-emerald-700">Included in Quote</td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => triggerBookingSelect({ vehicleId: 'tempo-12' })}
                      className="px-3.5 py-1.5 rounded-lg bg-[#FEF8E7] hover:bg-[#F5BE19] text-[#14263D] font-bold transition-all text-[11px] border border-[#F5BE19]/40 cursor-pointer"
                    >
                      Book Tempo
                    </button>
                  </td>
                </tr>

                <tr className="hover:bg-[#F8F7F2] transition-colors">
                  <td className="py-3.5 px-4 font-bold text-[#14263D] flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#F5BE19]" />
                    27 & 45 Seater Coach
                  </td>
                  <td className="py-3.5 px-4 text-slate-700 font-medium">Tata / Eicher Deluxe Bus</td>
                  <td className="py-3.5 px-4 font-extrabold text-[#14263D] text-sm">On Request</td>
                  <td className="py-3.5 px-4 font-medium text-slate-700">On Request</td>
                  <td className="py-3.5 px-4 font-medium text-emerald-700">Included in Quote</td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => triggerBookingSelect({ vehicleId: 'bus-luxury' })}
                      className="px-3.5 py-1.5 rounded-lg bg-[#FEF8E7] hover:bg-[#F5BE19] text-[#14263D] font-bold transition-all text-[11px] border border-[#F5BE19]/40 cursor-pointer"
                    >
                      Book Bus
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Billing Guarantees */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-[#E2E8F0] text-xs text-[#4B5E76]">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#15803D]" />
              <span>Official GST Invoices Provided</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#15803D]" />
              <span>Zero Surge Charges at Peak Hours</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#15803D]" />
              <span>Clean Commercial Yellow Plates</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
