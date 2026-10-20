'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  MapPin,
  Calendar,
  Clock,
  User,
  Phone,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  AlertCircle,
  MessageCircle,
  Search,
  Sparkles,
  ChevronDown,
  X,
  Car,
  Star,
  Compass,
  Navigation,
} from 'lucide-react';
import { FLEET_OPTIONS, BRAND_TOKENS, type VehicleOption } from '../lib/tokens';
import { apiClient, type CreateBookingPayload } from '../lib/api-client';
import type { BookingSelectEventDetail } from '../lib/booking-events';

type ServiceTab = 'OUTSTATION' | 'LOCAL_TAXI' | 'AIRPORT' | 'TOUR_PACKAGE';
type TripType = 'ONE_WAY' | 'ROUND_TRIP';

export function HeroSection() {
  const [activeTab, setActiveTab] = useState<ServiceTab>('OUTSTATION');
  const [tripType, setTripType] = useState<TripType>('ONE_WAY');

  // Form State
  const [pickup, setPickup] = useState('Dehradun');
  const [drop, setDrop] = useState('Mussoorie');
  const [date, setDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [time, setTime] = useState('07:00');
  const [selectedVehicleId, setSelectedVehicleId] = useState('sedan');
  const [passengerCount, setPassengerCount] = useState(2);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  // Interactive Modal / Drawer State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<any | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isHighlighted, setIsHighlighted] = useState(false);

  // Listen for external cross-section booking actions (Fleet, Routes, Packages)
  useEffect(() => {
    const handleSelectBooking = (e: Event) => {
      const custom = e as CustomEvent<BookingSelectEventDetail>;
      const detail = custom.detail;
      if (!detail) return;

      if (detail.pickup) setPickup(detail.pickup);
      if (detail.drop) setDrop(detail.drop);
      if (detail.tab) setActiveTab(detail.tab);
      if (detail.vehicleId) setSelectedVehicleId(detail.vehicleId);

      setIsHighlighted(true);
      setTimeout(() => setIsHighlighted(false), 2200);

      if (detail.openModalDirectly) {
        setTimeout(() => setIsModalOpen(true), 400);
      }
    };

    window.addEventListener('selectBookingPlan', handleSelectBooking);
    return () => window.removeEventListener('selectBookingPlan', handleSelectBooking);
  }, []);

  const selectedVehicle: VehicleOption =
    FLEET_OPTIONS.find((v) => v.id === selectedVehicleId) ?? FLEET_OPTIONS[0]!;

  // Dynamic distance estimate
  const getEstimatedDistance = () => {
    const combined = `${pickup} -> ${drop}`.toLowerCase();
    if (combined.includes('delhi')) return 255;
    if (combined.includes('mussoorie')) return 35;
    if (combined.includes('airport')) return 30;
    if (combined.includes('haridwar')) return 54;
    if (combined.includes('rishikesh')) return 45;
    if (combined.includes('chandigarh')) return 170;
    if (combined.includes('kedarnath') || combined.includes('chardham')) return 240;
    if (activeTab === 'LOCAL_TAXI') return 80;
    return 85;
  };

  const estimatedDistance = getEstimatedDistance();
  const multiplier = tripType === 'ROUND_TRIP' && activeTab === 'OUTSTATION' ? 2 : 1;
  const totalKm = estimatedDistance * multiplier;
  const estimatedFare = Math.round(totalKm * selectedVehicle.perKmRate);
  const estimatedToll = 250;
  const totalEstimatedFare = estimatedFare + estimatedToll;
  const advanceRequired = Math.round(totalEstimatedFare * 0.25);

  const handleOpenReserve = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsModalOpen(true);
  };

  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (!name.trim() || name.length < 2) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (cleanPhone.length < 10) {
      setErrorMessage('Please enter a valid 10-digit phone number.');
      return;
    }

    setIsSubmitting(true);
    let finalBookingNumber = `DED-${Math.floor(100000 + Math.random() * 900000)}`;

    try {
      const idempotencyKey = `web_req_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      const scheduledStart = new Date(`${date}T${time}:00Z`).toISOString();
      const apiServiceType: CreateBookingPayload['serviceType'] =
        activeTab === 'AIRPORT' ? 'LOCAL_TAXI' : activeTab;
      const categorySlug =
        selectedVehicleId === 'suv'
          ? 'suv-innova'
          : selectedVehicleId === 'tempo'
          ? 'tempo-traveller-12'
          : selectedVehicleId;

      const payload: CreateBookingPayload = {
        customerName: name.trim(),
        customerPhone: phone.startsWith('+91') ? phone : `+91${cleanPhone.slice(-10)}`,
        serviceType: apiServiceType,
        pickupAddress: pickup.trim(),
        dropAddress: drop.trim() || undefined,
        scheduledStart,
        passengerCount: Number(passengerCount) || 1,
        luggageCount: 2,
        vehicleCategoryId: categorySlug,
        specialInstructions: `${selectedVehicle.name} reserved. Fare: Best Quote on Request`,
        idempotencyKey,
      };

      const res = await apiClient.bookings.create(payload, idempotencyKey);
      if (res?.booking?.bookingNumber) {
        finalBookingNumber = res.booking.bookingNumber;
      }
    } catch {
      // Graceful local fallback booking reference
    }

    // Auto-generate official Dhanora Cab structured WhatsApp card (clean bullets to prevent emoji corruption)
    const formattedWhatsAppMsg = [
      `*NEW CAB BOOKING - DHANORA CAB SERVICE*`,
      `━━━━━━━━━━━━━━━━━━━━━`,
      `• *Booking Ref:* #${finalBookingNumber}`,
      `• *Passenger Name:* ${name.trim()}`,
      `• *Customer Phone:* ${phone.trim()}`,
      `• *Pickup:* ${pickup.trim()}`,
      `• *Drop:* ${drop.trim()}`,
      `• *Date:* ${date}`,
      `• *Time:* ${time}`,
      `• *Vehicle:* ${selectedVehicle.name}`,
      `• *Passengers:* ${passengerCount}`,
      `• *Fare:* Best Quote on Request`,
      `━━━━━━━━━━━━━━━━━━━━━`,
      `Please confirm my booking and share chauffeur details. Thank you!`,
    ].join('\n');

    const automatedWhatsAppUrl = `https://wa.me/917505800684?text=${encodeURIComponent(
      formattedWhatsAppMsg
    )}`;

    // 1. Send automated background notification via API
    try {
      fetch('/api/whatsapp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: '7505800684',
          customerName: name.trim(),
          customerPhone: phone.trim(),
          bookingNumber: finalBookingNumber,
          pickup: pickup.trim(),
          drop: drop.trim(),
          date,
          time,
          vehicle: selectedVehicle.name,
          fare: totalEstimatedFare,
          passengers: passengerCount,
          body: formattedWhatsAppMsg,
        }),
      }).catch(() => {});
    } catch (_) {}

    // 2. Set submission success state with dynamic WhatsApp URL & Message text
    setSubmissionSuccess({
      bookingNumber: finalBookingNumber,
      whatsappUrl: automatedWhatsAppUrl,
      whatsappMsg: formattedWhatsAppMsg,
    });

    // 3. Automatically launch WhatsApp in new tab for instant dispatch
    try {
      window.open(automatedWhatsAppUrl, '_blank', 'noopener,noreferrer');
    } catch (_) {}

    setIsSubmitting(false);
  };

  const whatsappInquiryUrl = `https://wa.me/917505800684?text=${encodeURIComponent(
    `Hello Dhanora Cab Service, I would like to reserve a private transfer:\n• Route: ${pickup} to ${drop}\n• Date: ${date} at ${time}\n• Vehicle: ${selectedVehicle.name}\n• Rate: Best Quote on Request\nPlease confirm availability.`
  )}`;

  return (
    <section id="booking" className="relative min-h-[580px] lg:min-h-[680px] flex items-center justify-center pt-16 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-[#0B131F]">
      {/* Background Photography with Elegant Dark Vignette */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <img
          src="/images/hero-himalayan-highway.jpg"
          alt="Scenic Himalayan Mountain Road near Dehradun"
          className="w-full h-full object-cover object-center brightness-95"
          loading="eager"
        />
        {/* Cinematic Dual Vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B131F]/90 via-[#0B131F]/50 to-[#0B131F]" />
        {/* Soft Golden Ambient Light Aura */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-amber-400/[0.08] rounded-full blur-[130px]" />
      </div>

      <div className="relative z-10 w-full max-w-5xl mx-auto text-center space-y-7 sm:space-y-8">
        {/* Editorial Headline & Brand Tag */}
        <div className="space-y-4 max-w-4xl mx-auto">
          <h1 className="font-['Playfair_Display',var(--font-playfair),serif] text-4xl sm:text-6xl lg:text-7xl text-white font-medium tracking-tight leading-[1.08] drop-shadow-md">
            <span>Private Mountain Travel,</span>
            <span className="block mt-1 sm:mt-2 italic font-light">
              <span className="bg-gradient-to-r from-amber-200 via-[#F5BE19] to-amber-300 bg-clip-text text-transparent drop-shadow-[0_4px_24px_rgba(245,190,25,0.45)]">
                Refined.
              </span>
            </span>
          </h1>

          <p className="text-slate-200 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto font-normal leading-relaxed drop-shadow-sm">
            Reliable taxi rides across Dehradun, Mussoorie, and the airport.
            Travel safely with certified drivers, clean cars, and custom transparent quotes.
          </p>
        </div>

        {/* Quick 1-Tap Mountain Route Chips - Strictly Single Row with No Scrollbar */}
        <div className="w-full max-w-5xl mx-auto pt-1 pb-1 overflow-x-auto no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex items-center justify-start xl:justify-center gap-2 whitespace-nowrap min-w-max mx-auto px-2">
            {[
              { label: '✈️ Airport Drop', from: 'Dehradun', to: 'Jolly Grant Airport', tab: 'AIRPORT', vehicle: 'sedan', fare: 'On Request' },
              { label: '⛰️ Mussoorie', from: 'Dehradun', to: 'Mussoorie', tab: 'OUTSTATION', vehicle: 'sedan', fare: 'On Request' },
              { label: '⚡ Delhi Express', from: 'Dehradun', to: 'Delhi NCR', tab: 'OUTSTATION', vehicle: 'sedan', fare: 'On Request' },
              { label: '🕉️ Rishikesh Aarti', from: 'Dehradun', to: 'Rishikesh', tab: 'OUTSTATION', vehicle: 'sedan', fare: 'On Request' },
              { label: '🛕 Haridwar', from: 'Dehradun', to: 'Haridwar', tab: 'OUTSTATION', vehicle: 'sedan', fare: 'On Request' },
            ].map((chip) => (
              <button
                key={chip.label}
                type="button"
                onClick={() => {
                  setPickup(chip.from);
                  setDrop(chip.to);
                  setActiveTab(chip.tab as ServiceTab);
                  setSelectedVehicleId(chip.vehicle);
                }}
                className="px-3 py-1.5 rounded-full bg-slate-900/80 hover:bg-slate-800/90 text-slate-100 hover:text-white border border-slate-700/80 hover:border-amber-400/60 text-xs font-semibold transition-all duration-200 shadow-md flex items-center gap-2 shrink-0 hover:scale-[1.03] active:scale-95 group cursor-pointer backdrop-blur-md"
              >
                <span>{chip.label}</span>
                <span className="text-[11px] bg-amber-400/15 text-amber-300 px-2 py-0.5 rounded-full font-bold border border-amber-400/30 group-hover:bg-[#F5BE19] group-hover:text-[#14263D] transition-colors">
                  {chip.fare}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Flagship Luxury Booking Bar Container */}
        <div className="w-full max-w-5xl mx-auto space-y-3">
          {/* Quick Service Type Pills */}
          <div className="flex items-center justify-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden px-2">
            {[
              { id: 'OUTSTATION', label: '🚗 Outstation (One-Way / Return)' },
              { id: 'AIRPORT', label: '✈️ Airport Drop / Pickup' },
              { id: 'LOCAL_TAXI', label: '⏱️ City Hourly (8hr / 80km)' },
              { id: 'TOUR_PACKAGE', label: '⛰️ Chardham & Hill Tours' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as ServiceTab)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-[#F5BE19] text-[#14263D] shadow-md shadow-amber-500/30 scale-[1.02]'
                    : 'bg-slate-900/85 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 backdrop-blur-md'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Solid Pure White Interactive Booking Bar */}
          <form
            onSubmit={handleOpenReserve}
            style={{ backgroundColor: '#ffffff' }}
            className={`bg-white rounded-2xl lg:rounded-full p-2.5 sm:p-3 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.55)] border-2 border-slate-200 flex flex-col lg:flex-row items-stretch lg:items-center divide-y lg:divide-y-0 lg:divide-x divide-slate-100 text-left transition-all duration-300 ${
              isHighlighted
                ? 'border-[#F5BE19] ring-4 ring-[#F5BE19]/60 shadow-[0_0_35px_rgba(245,190,25,0.5)] scale-[1.01]'
                : 'hover:border-slate-300'
            }`}
          >
            {/* Segment 1: Pickup Point */}
            <div className="px-4 py-2.5 flex-1 min-w-[170px] hover:bg-slate-50/80 rounded-xl lg:rounded-l-full transition-colors">
              <div className="flex items-center gap-1.5 text-[11px] font-black text-slate-500 uppercase tracking-wider">
                <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <label htmlFor="hero-pickup-input">Pickup Point</label>
              </div>
              <input
                id="hero-pickup-input"
                aria-label="Pickup Location"
                type="text"
                value={pickup}
                onChange={(e) => setPickup(e.target.value)}
                placeholder="Dehradun, Airport, Hotel..."
                required
                className="w-full bg-transparent text-sm font-bold text-[#14263D] placeholder:text-slate-400 focus:outline-none py-1 mt-0.5"
              />
            </div>

            {/* Segment 2: Destination */}
            <div className="px-4 py-2.5 flex-1 min-w-[170px] hover:bg-slate-50/80 transition-colors">
              <div className="flex items-center gap-1.5 text-[11px] font-black text-slate-500 uppercase tracking-wider">
                <Navigation className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                <label htmlFor="hero-drop-input">Destination</label>
              </div>
              <input
                id="hero-drop-input"
                aria-label="Dropoff Location"
                type="text"
                value={drop}
                onChange={(e) => setDrop(e.target.value)}
                placeholder="Mussoorie, Delhi, Rishikesh..."
                required
                className="w-full bg-transparent text-sm font-bold text-[#14263D] placeholder:text-slate-400 focus:outline-none py-1 mt-0.5"
              />
            </div>

            {/* Segment 3: Date & Time */}
            <div className="px-4 py-2.5 flex-1 min-w-[140px] hover:bg-slate-50/80 transition-colors">
              <div className="flex items-center gap-1.5 text-[11px] font-black text-slate-500 uppercase tracking-wider">
                <Calendar className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                <label htmlFor="hero-departure-date">Departure</label>
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <input
                  id="hero-departure-date"
                  aria-label="Departure Date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  className="w-full bg-transparent text-sm font-bold text-[#14263D] focus:outline-none py-1 cursor-pointer"
                />
              </div>
            </div>

            {/* Segment 4: Vehicle & Live Fare */}
            <div className="px-4 py-2.5 flex-1 min-w-[180px] hover:bg-slate-50/80 transition-colors">
              <div className="flex items-center justify-between gap-1">
                <div className="flex items-center gap-1.5 text-[11px] font-black text-slate-500 uppercase tracking-wider">
                  <Car className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                  <label htmlFor="hero-vehicle-select">Vehicle</label>
                </div>
                <span className="text-[11px] font-black text-amber-800 bg-amber-100/90 px-1.5 py-0.5 rounded border border-amber-300 shrink-0">
                  On Request
                </span>
              </div>
              <select
                id="hero-vehicle-select"
                aria-label="Select Vehicle Class"
                value={selectedVehicleId}
                onChange={(e) => setSelectedVehicleId(e.target.value)}
                className="w-full bg-transparent text-sm font-bold text-[#14263D] focus:outline-none cursor-pointer py-1 mt-0.5"
              >
                <option value="sedan" className="bg-white text-slate-900 font-semibold">Sedan (Dzire / Etios)</option>
                <option value="suv-ertiga" className="bg-white text-slate-900 font-semibold">Ertiga (6 Pax)</option>
                <option value="suv-innova" className="bg-white text-slate-900 font-semibold">Innova Crysta (7 Pax)</option>
                <option value="tempo-12" className="bg-white text-slate-900 font-semibold">Tempo Traveller (12+ Pax)</option>
              </select>
            </div>

            {/* Segment 5: Submit Action Buttons */}
            <div className="p-2 shrink-0 flex items-center gap-2 justify-end">
              <button
                type="submit"
                className="w-full lg:w-auto px-8 py-3.5 rounded-xl lg:rounded-full bg-[#F5BE19] hover:bg-[#E5AF10] text-[#14263D] text-sm font-black tracking-wide flex items-center justify-center gap-2 transition-all shadow-md shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                <span>Reserve</span>
                <ArrowRight className="w-4 h-4 text-[#14263D] group-hover:translate-x-0.5 transition-transform" />
              </button>
              <a
                href={whatsappInquiryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3.5 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white transition-all shadow-md shadow-emerald-500/20 hover:scale-105 shrink-0 flex items-center justify-center"
                title="Get instant quote on WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </form>
        </div>

        {/* Minimalist Subtle Footer Assurances */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 text-xs text-slate-200 font-medium pt-2">
          <div className="flex items-center gap-2 bg-slate-900/70 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-700/80 shadow-sm hover:border-emerald-500/40 transition-colors">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Fixed All-Inclusive Fares</span>
          </div>
          <div className="flex items-center gap-2 bg-slate-900/70 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-700/80 shadow-sm hover:border-amber-500/40 transition-colors">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Hill-Certified Senior Chauffeurs</span>
          </div>
          <div className="flex items-center gap-2 bg-slate-900/70 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-700/80 shadow-sm hover:border-sky-500/40 transition-colors">
            <Car className="w-4 h-4 text-sky-400" />
            <span>Clean Commercial AC Fleet</span>
          </div>
          <div className="hidden sm:flex items-center gap-2 bg-slate-900/70 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-700/80 shadow-sm hover:border-yellow-400/40 transition-colors">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>4.9/5 Rating (2,800+ Trips)</span>
          </div>
        </div>
      </div>

      {/* Elegant Reservation Modal (Uber Reserve / Luxury Concierge Experience) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden text-[#14263D] animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block">
                  Private Reservation
                </span>
                <h3 className="font-display font-semibold text-lg text-slate-900">
                  Trip Summary & Confirmation
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsModalOpen(false);
                  setSubmissionSuccess(null);
                }}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {submissionSuccess ? (
              /* Success State */
              <div className="p-6 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-display font-semibold text-xl text-slate-900">
                    Chauffeur Scheduled
                  </h4>
                  <p className="text-xs text-slate-500">
                    Reservation Reference: #{submissionSuccess.bookingNumber}
                  </p>
                  <p className="text-xs text-slate-600 max-w-sm mx-auto pt-2">
                    Our lead dispatcher will contact you at <span className="font-semibold text-slate-900">{phone}</span> shortly to coordinate your pickup.
                  </p>
                </div>

                {/* WhatsApp Message Template Preview Card */}
                {submissionSuccess.whatsappMsg && (
                  <div className="text-left bg-[#ECE5DD]/45 rounded-2xl p-3 border border-slate-200 space-y-1.5 shadow-2xs">
                    <div className="flex items-center justify-between text-[11px] font-bold text-[#128C7E]">
                      <span className="flex items-center gap-1.5">
                        <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                        <span>WhatsApp Message Template</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          if (typeof navigator !== 'undefined') {
                            navigator.clipboard.writeText(submissionSuccess.whatsappMsg);
                          }
                        }}
                        className="text-[10px] bg-white border border-slate-200 px-2 py-0.5 rounded-md hover:bg-slate-50 text-slate-700 font-semibold cursor-pointer active:scale-95 transition-transform"
                      >
                        Copy Template
                      </button>
                    </div>
                    <pre className="text-[11px] font-mono whitespace-pre-wrap bg-white p-3 rounded-xl border border-slate-200/90 text-slate-800 leading-relaxed max-h-44 overflow-y-auto select-all">
                      {submissionSuccess.whatsappMsg}
                    </pre>
                  </div>
                )}

                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-medium flex items-center justify-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping shrink-0" />
                  <span>WhatsApp message auto-opened with your booking reference.</span>
                </div>

                  <div className="flex flex-col gap-2 pt-1">
                    <div className="flex gap-2">
                      <a
                        href={submissionSuccess.whatsappUrl || whatsappInquiryUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs flex items-center justify-center gap-2 transition-colors shadow-sm"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>Send on WhatsApp</span>
                      </a>
                    <Link
                      href={`/track?ref=${submissionSuccess.bookingNumber}&phone=${encodeURIComponent(phone.replace(/\D/g, '').slice(-10))}`}
                      className="flex-1 py-3 rounded-xl bg-[#14263D] hover:bg-[#F5BE19] hover:text-[#14263D] text-white font-medium text-xs flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Search className="w-3.5 h-3.5" />
                      <span>Track Ride Live</span>
                    </Link>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      setSubmissionSuccess(null);
                    }}
                    className="py-2.5 px-5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs transition-colors"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              /* Summary & Contact Capture */
              <form onSubmit={handleConfirmBooking} className="p-6 space-y-4">
                {/* Clean Route & Fare Card */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2.5 text-xs">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-200/60">
                    <span className="text-slate-500">Route</span>
                    <span className="font-semibold text-slate-900">{pickup} → {drop}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Vehicle</span>
                    <span className="font-semibold text-slate-900">{selectedVehicle.name}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Schedule</span>
                    <span className="font-semibold text-slate-900">{date} at {time}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-slate-200/60">
                    <span className="text-slate-600 font-medium">Pricing</span>
                    <span className="font-display font-semibold text-base text-amber-700">
                      Quote on Request
                    </span>
                  </div>
                </div>

                {/* Guest Contact Inputs */}
                <div className="space-y-3 pt-1">
                  <div>
                    <label className="text-[11px] font-medium text-slate-600 block mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Ramesh Chandra"
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-slate-800"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-slate-600 block mb-1">
                      Phone Number (for Chauffeur Dispatch)
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. 7505800684"
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-slate-800"
                    />
                  </div>
                </div>

                {errorMessage && (
                  <div className="p-2.5 rounded-xl bg-red-50 text-red-600 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Actions */}
                <div className="space-y-2 pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-white font-medium text-xs sm:text-sm tracking-wide transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>Confirming...</span>
                    ) : (
                      <>
                        <span>Confirm Chauffeur Reservation</span>
                        <ArrowRight className="w-4 h-4 text-white/70" />
                      </>
                    )}
                  </button>

                  <a
                    href={whatsappInquiryUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 text-center text-xs text-slate-500 hover:text-slate-800 font-medium block transition-colors"
                  >
                    Prefer WhatsApp? Book via WhatsApp Desk →
                  </a>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
