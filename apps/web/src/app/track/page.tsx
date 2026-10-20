'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Search,
  Car,
  MapPin,
  Calendar,
  Clock,
  User,
  Phone,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  FileText,
  Printer,
  MessageCircle,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  HelpCircle,
  Sparkles,
  RefreshCw,
  CreditCard,
} from 'lucide-react';
import { BRAND_TOKENS } from '../../lib/tokens';
import { apiClient, type TrackBookingResponse, ApiError } from '../../lib/api-client';
import { InvoiceModal } from '../../components/InvoiceModal';
import { RazorpayModal } from '../../components/RazorpayModal';

export default function TrackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#14263D]" />
        </div>
      }
    >
      <TrackBookingContent />
    </Suspense>
  );
}

function TrackBookingContent() {
  const searchParams = useSearchParams();
  const initialRef = searchParams.get('bookingNumber') || searchParams.get('ref') || '';
  const initialPhone = searchParams.get('phone') || '';

  const [bookingNumber, setBookingNumber] = useState(initialRef);
  const [phone, setPhone] = useState(initialPhone);
  const [isLoading, setIsLoading] = useState(false);
  const [bookingData, setBookingData] = useState<TrackBookingResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  const handleLookup = useCallback(async (refInput?: string, phoneInput?: string) => {
    const targetRef = (refInput !== undefined ? refInput : bookingNumber).trim();
    const targetPhone = (phoneInput !== undefined ? phoneInput : phone).trim();
    setErrorMessage(null);

    if (!targetRef) {
      setErrorMessage('Please enter your booking reference number (e.g. DED-202610-123456).');
      return;
    }

    const cleanPhone = targetPhone.replace(/\D/g, '').slice(-10);
    if (!cleanPhone || cleanPhone.length < 10) {
      setErrorMessage('Please enter the 10-digit mobile number used when placing the booking.');
      return;
    }

    setIsLoading(true);

    try {
      const data = await apiClient.bookings.track(targetRef, cleanPhone);
      setBookingData(data);
    } catch (err: any) {
      if (err instanceof ApiError && err.statusCode === 404) {
        setErrorMessage(
          'No booking found matching this reference and mobile number. Please check your confirmation SMS or call 24x7 support.',
        );
      } else {
        setErrorMessage(
          err?.message ||
            'Unable to retrieve booking details. Please verify your reference number and mobile or contact dispatch support.',
        );
      }
      setBookingData(null);
    } finally {
      setIsLoading(false);
    }
  }, [bookingNumber, phone]);

  // Auto-search if query params exist on mount
  useEffect(() => {
    if (initialRef && initialPhone && initialPhone.replace(/\D/g, '').length >= 10) {
      handleLookup(initialRef, initialPhone);
    }
  }, [initialRef, initialPhone, handleLookup]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING_REVIEW':
        return {
          bg: 'bg-amber-100 text-amber-900 border-amber-300',
          label: 'Request Under Review',
          desc: 'Our dispatch team is reviewing vehicle availability. You will receive an SMS and WhatsApp confirmation shortly.',
          step: 1,
        };
      case 'CONFIRMED':
        return {
          bg: 'bg-blue-100 text-blue-900 border-blue-300',
          label: 'Booking Confirmed',
          desc: 'Your ride is confirmed by dispatch. A verified driver and sanitized cab are scheduled.',
          step: 2,
        };
      case 'ASSIGNED':
        return {
          bg: 'bg-purple-100 text-purple-900 border-purple-300',
          label: 'Driver & Cab Assigned',
          desc: 'Your dedicated cab and driver have been allocated. Contact details are available below.',
          step: 3,
        };
      case 'IN_PROGRESS':
        return {
          bg: 'bg-emerald-100 text-emerald-900 border-emerald-300',
          label: 'Trip In Progress',
          desc: 'Your ride is underway. Have a safe and comfortable journey!',
          step: 4,
        };
      case 'COMPLETED':
        return {
          bg: 'bg-green-100 text-green-900 border-green-300',
          label: 'Trip Completed',
          desc: 'Thank you for traveling with Dehradun Cab & Travel. We look forward to hosting you again!',
          step: 5,
        };
      case 'CANCELLED':
      case 'REJECTED':
        return {
          bg: 'bg-red-100 text-red-900 border-red-300',
          label: 'Booking Cancelled',
          desc: 'This booking has been cancelled. For refunds or rebooking assistance, please call 24x7 support.',
          step: 0,
        };
      default:
        return {
          bg: 'bg-slate-100 text-slate-900 border-slate-300',
          label: status,
          desc: 'Trip record retrieved.',
          step: 1,
        };
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-16">
      {/* Hero Header Section */}
      <section className="bg-gradient-to-b from-[#14263D] to-[#1E3450] text-white pt-10 pb-16 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#F5BE19_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="max-w-4xl mx-auto relative z-10 space-y-4 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#F5BE19] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Passenger Self-Service Desk</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight">
            Track Your <span className="text-[#F5BE19]">Booking & Cab</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto">
            Check real-time ride confirmation, view assigned driver & vehicle details, monitor trip status, and download your GST tax invoice.
          </p>

          {/* Search Box Card */}
          <div className="mt-8 bg-white rounded-2xl p-4 sm:p-6 shadow-xl text-left border border-slate-100 max-w-2xl mx-auto">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleLookup();
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#14263D] mb-1.5 uppercase tracking-wider">
                    Booking Reference #
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="e.g. DED-202610-841291"
                      value={bookingNumber}
                      onChange={(e) => setBookingNumber(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] bg-white text-[#14263D] text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#F5BE19] focus:border-transparent transition-all uppercase placeholder:normal-case"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#14263D] mb-1.5 uppercase tracking-wider">
                    Registered Mobile #
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      placeholder="10-digit mobile number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      maxLength={14}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] bg-white text-[#14263D] text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#F5BE19] focus:border-transparent transition-all"
                      required
                    />
                  </div>
                </div>
              </div>

              {errorMessage && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-6 rounded-xl bg-[#F5BE19] hover:bg-[#DFAC13] text-[#14263D] font-extrabold text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Searching Booking Records...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4 stroke-[2.5]" />
                    <span>Track Booking Live</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Booking Details Section */}
      {bookingData && (
        <section className="max-w-4xl mx-auto px-4 sm:px-6 -mt-8 relative z-20 space-y-6">
          {/* Status Banner */}
          {(() => {
            const badge = getStatusBadge(bookingData.status);
            return (
              <div className="bg-white rounded-2xl p-6 shadow-md border border-[#E2E8F0] space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-5">
                  <div>
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="text-sm font-bold text-[#62758F]">Booking Ref:</span>
                      <span className="text-lg font-black text-[#14263D] tracking-tight">
                        {bookingData.bookingNumber}
                      </span>
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border ${badge.bg}`}
                      >
                        {badge.label}
                      </span>
                    </div>
                    <p className="text-xs text-[#62758F] mt-1.5">{badge.desc}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2.5 flex-wrap shrink-0">
                    <button
                      onClick={() => setIsInvoiceOpen(true)}
                      type="button"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#14263D] text-[#F5BE19] hover:bg-[#1E3450] font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-xs"
                    >
                      <FileText className="w-4 h-4 text-[#F5BE19]" />
                      <span>Print Tax Invoice</span>
                    </button>
                    <a
                      href={BRAND_TOKENS.phoneCallUrl}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#14263D] font-bold text-xs uppercase tracking-wider transition-colors"
                    >
                      <Phone className="w-4 h-4 text-[#B91C1C]" />
                      <span>Help Desk</span>
                    </a>
                  </div>
                </div>

                {/* Progress Stepper (Only for active flows) */}
                {badge.step > 0 && (
                  <div className="py-2">
                    <div className="flex items-center justify-between relative">
                      {/* Background Bar */}
                      <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-200 -translate-y-1/2 z-0" />
                      {/* Active Progress Bar */}
                      <div
                        className="absolute top-1/2 left-0 h-1 bg-[#F5BE19] -translate-y-1/2 z-0 transition-all duration-500"
                        style={{
                          width: `${((badge.step - 1) / 4) * 100}%`,
                        }}
                      />

                      {[
                        { num: 1, name: 'Requested' },
                        { num: 2, name: 'Confirmed' },
                        { num: 3, name: 'Cab Assigned' },
                        { num: 4, name: 'On Trip' },
                        { num: 5, name: 'Completed' },
                      ].map((s) => {
                        const isDone = badge.step >= s.num;
                        const isCurrent = badge.step === s.num;
                        return (
                          <div key={s.num} className="relative z-10 flex flex-col items-center">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                                isDone
                                  ? 'bg-[#14263D] text-[#F5BE19] ring-4 ring-[#F5BE19]/30'
                                  : 'bg-slate-200 text-slate-500'
                              } ${isCurrent ? 'scale-110' : ''}`}
                            >
                              {isDone ? <CheckCircle2 className="w-4 h-4" /> : s.num}
                            </div>
                            <span
                              className={`text-[11px] font-bold mt-2 whitespace-nowrap ${
                                isCurrent
                                  ? 'text-[#14263D]'
                                  : isDone
                                  ? 'text-[#14263D]'
                                  : 'text-slate-400'
                              }`}
                            >
                              {s.name}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })()}

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Trip Itinerary Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E2E8F0] space-y-4">
              <div className="flex items-center gap-2 text-sm font-bold text-[#14263D] uppercase tracking-wider border-b border-[#E2E8F0] pb-3">
                <MapPin className="w-4 h-4 text-[#B91C1C]" />
                <span>Trip Schedule & Route</span>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 shrink-0 mt-1" />
                  <div>
                    <div className="text-[11px] text-[#62758F] font-semibold uppercase">Pickup Location</div>
                    <div className="text-xs sm:text-sm font-bold text-[#14263D]">{bookingData.pickupAddress}</div>
                  </div>
                </div>

                {bookingData.dropAddress && (
                  <div className="flex items-start gap-3">
                    <div className="w-3 h-3 rounded-full bg-red-500 shrink-0 mt-1" />
                    <div>
                      <div className="text-[11px] text-[#62758F] font-semibold uppercase">Drop Destination</div>
                      <div className="text-xs sm:text-sm font-bold text-[#14263D]">{bookingData.dropAddress}</div>
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 pt-3 border-t border-[#E2E8F0]">
                <div>
                  <div className="text-[11px] text-[#62758F] font-semibold uppercase">Travel Date & Time</div>
                  <div className="text-xs sm:text-sm font-bold text-[#14263D] flex items-center gap-1 mt-0.5">
                    <Calendar className="w-3.5 h-3.5 text-[#F5BE19]" />
                    <span>
                      {new Date(bookingData.scheduledStart).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  <div className="text-xs text-[#62758F] flex items-center gap-1 mt-0.5">
                    <Clock className="w-3.5 h-3.5 text-[#62758F]" />
                    <span>
                      {new Date(bookingData.scheduledStart).toLocaleTimeString('en-IN', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>

                <div>
                  <div className="text-[11px] text-[#62758F] font-semibold uppercase">Passengers & Baggage</div>
                  <div className="text-xs sm:text-sm font-bold text-[#14263D] mt-0.5">
                    {bookingData.passengerCount} Passengers · {bookingData.luggageCount} Bags
                  </div>
                  <div className="text-xs text-[#62758F] mt-0.5">
                    Type: <span className="font-semibold text-[#14263D]">{bookingData.serviceType.replace(/_/g, ' ')}</span>
                  </div>
                </div>
              </div>

              {bookingData.specialInstructions && (
                <div className="bg-[#F8FAFC] p-3 rounded-xl border border-[#E2E8F0] text-xs text-[#4B5E76]">
                  <span className="font-bold text-[#14263D]">Special Notes: </span>
                  {bookingData.specialInstructions}
                </div>
              )}
            </div>

            {/* Assigned Driver & Cab Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E2E8F0] space-y-4 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-bold text-[#14263D] uppercase tracking-wider border-b border-[#E2E8F0] pb-3">
                  <Car className="w-4 h-4 text-[#F5BE19]" />
                  <span>Assigned Vehicle & Driver</span>
                </div>

                {bookingData.assignedDriver && bookingData.assignedVehicle ? (
                  <div className="space-y-4">
                    {/* Vehicle details */}
                    <div className="bg-[#FEF8E7] p-4 rounded-xl border border-[#F5BE19]/40 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-[#B48505] uppercase tracking-wider">
                          {bookingData.assignedVehicle.categoryName}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-md bg-white border border-[#CBD5E1] text-xs font-black text-[#14263D] tracking-wider uppercase shadow-2xs">
                          {bookingData.assignedVehicle.registrationNumber}
                        </span>
                      </div>
                      <div className="text-base font-black text-[#14263D]">
                        {bookingData.assignedVehicle.make} {bookingData.assignedVehicle.model}{' '}
                        <span className="text-xs font-medium text-[#62758F]">
                          ({bookingData.assignedVehicle.color})
                        </span>
                      </div>
                    </div>

                    {/* Driver details */}
                    <div className="flex items-center justify-between p-3.5 rounded-xl border border-[#E2E8F0] bg-white">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#14263D] text-[#F5BE19] flex items-center justify-center font-black text-sm">
                          {bookingData.assignedDriver.fullName.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="text-xs sm:text-sm font-bold text-[#14263D]">
                            {bookingData.assignedDriver.fullName}
                          </div>
                          <div className="text-xs text-[#15803D] font-semibold flex items-center gap-1">
                            <span>★ {bookingData.assignedDriver.rating.toFixed(1)}</span>
                            <span className="text-slate-300">·</span>
                            <span>Police Verified</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <a
                          href={`tel:${bookingData.assignedDriver.phone}`}
                          className="p-2 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
                          title="Call Driver"
                        >
                          <Phone className="w-4 h-4" />
                        </a>
                        <a
                          href={`https://wa.me/${bookingData.assignedDriver.phone.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
                          title="WhatsApp Driver"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-5 rounded-xl bg-[#F8FAFC] border border-dashed border-[#CBD5E1] text-center space-y-2">
                    <Clock className="w-8 h-8 text-[#F5BE19] mx-auto animate-pulse" />
                    <div className="text-xs sm:text-sm font-bold text-[#14263D]">
                      Driver & Cab Allocation In Progress
                    </div>
                    <p className="text-xs text-[#62758F] max-w-xs mx-auto">
                      Driver and vehicle license plate details are finalized 2 hours prior to scheduled departure and sent via SMS & WhatsApp.
                    </p>
                  </div>
                )}
              </div>

              {/* Fare Summary row */}
              <div className="pt-3 border-t border-[#E2E8F0] space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[#62758F]">Total Fare: </span>
                    <span className="font-extrabold text-[#14263D] text-sm">
                      ₹{((bookingData.fareSnapshot?.totalFarePaise ?? bookingData.paymentSummary.totalFarePaise) / 100).toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#62758F]">Balance Due: </span>
                    <span className="font-black text-[#B91C1C] text-sm">
                      ₹{(bookingData.paymentSummary.outstandingBalancePaise / 100).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {bookingData.paymentSummary.paymentStatus === 'UNPAID' ? (
                  <button
                    onClick={() => setIsPaymentOpen(true)}
                    type="button"
                    className="w-full mt-2 py-2.5 px-4 rounded-xl bg-[#F5BE19] hover:bg-[#DFAC13] text-[#14263D] font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                  >
                    <CreditCard className="w-4 h-4 stroke-[2.5]" />
                    <span>Pay Advance (₹{((bookingData.fareSnapshot?.advanceRequiredPaise ?? bookingData.paymentSummary.advanceRequiredPaise) / 100).toLocaleString('en-IN')}) via UPI / Card</span>
                  </button>
                ) : (
                  <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Advance Paid & Confirmed</span>
                    </span>
                    <span className="text-emerald-700 font-extrabold">₹{(bookingData.paymentSummary.totalPaidPaise / 100).toLocaleString('en-IN')}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Need Assistance Card */}
          <div className="bg-gradient-to-r from-[#14263D] to-[#1E3450] text-white rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <h4 className="text-base font-bold">Have Questions or Need to Modify Your Pickup?</h4>
              <p className="text-xs text-slate-300">
                Our 24x7 Dehradun dispatch team is ready to assist you anytime.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <a
                href={BRAND_TOKENS.phoneCallUrl}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#B91C1C] hover:bg-[#991B1B] text-white text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap"
              >
                <Phone className="w-4 h-4" />
                <span>Call {BRAND_TOKENS.phonePrimary}</span>
              </a>
              <a
                href={`https://wa.me/919105001222?text=Hello%20Dehradun%20Cab,%20I%20am%20inquiring%20about%20my%20booking%20${bookingData.bookingNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#15803D] hover:bg-[#166534] text-white text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Desk</span>
              </a>
            </div>
          </div>
        </section>
      )}

      {/* Invoice Modal Component */}
      {bookingData && (
        <InvoiceModal
          isOpen={isInvoiceOpen}
          onClose={() => setIsInvoiceOpen(false)}
          booking={bookingData}
        />
      )}

      {/* Razorpay Online Checkout Modal */}
      {bookingData && (
        <RazorpayModal
          isOpen={isPaymentOpen}
          onClose={() => setIsPaymentOpen(false)}
          booking={bookingData}
          onPaymentSuccess={(updated) => setBookingData(updated)}
        />
      )}
    </div>
  );
}
