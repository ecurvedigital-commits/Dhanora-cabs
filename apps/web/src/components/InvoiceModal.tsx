'use client';

import React from 'react';
import {
  Printer,
  X,
  Car,
  Phone,
  Mail,
  MapPin,
  Calendar,
  CheckCircle,
  ShieldCheck,
  FileText,
  Download,
} from 'lucide-react';
import { BRAND_TOKENS } from '../lib/tokens';
import type { TrackBookingResponse } from '../lib/api-client';

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: TrackBookingResponse;
}

export function InvoiceModal({ isOpen, onClose, booking }: InvoiceModalProps) {
  if (!isOpen) return null;

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const fare = booking.fareSnapshot;
  const totalFare = fare ? fare.totalFarePaise / 100 : booking.paymentSummary.totalFarePaise / 100;
  const advanceRequired = fare ? fare.advanceRequiredPaise / 100 : booking.paymentSummary.advanceRequiredPaise / 100;
  const advancePaid = booking.paymentSummary.totalPaidPaise / 100;
  const balanceDue = Math.max(0, totalFare - advancePaid);

  const baseFare = fare ? fare.baseFarePaise / 100 : Math.round(totalFare * 0.75);
  const tollParking = fare ? (fare.tollEstimatePaise + fare.parkingEstimatePaise) / 100 : 250;
  const taxAmount = fare ? fare.taxPaise / 100 : Math.round(totalFare * 0.05);

  const invoiceNumber = booking.invoice?.invoiceNumber || `INV-${booking.bookingNumber.replace(/[^a-zA-Z0-9]/g, '')}`;
  const issueDate = booking.invoice?.issueDate
    ? new Date(booking.invoice.issueDate).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : new Date(booking.createdAt).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });

  const scheduledDate = new Date(booking.scheduledStart).toLocaleDateString('en-IN', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
  const scheduledTime = new Date(booking.scheduledStart).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto print:p-0 print:bg-white print:static print:inset-auto">
      {/* Modal Container */}
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden my-8 border border-[#E2E8F0] print:border-none print:shadow-none print:rounded-none print:my-0">
        {/* Action Header (Hidden during Print) */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#14263D] text-white print:hidden">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#F5BE19]" />
            <h3 className="font-bold text-base tracking-wide">
              Tax Invoice & Trip Receipt — {booking.bookingNumber}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F5BE19] text-[#14263D] hover:bg-[#DFAC13] font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer shadow-xs"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              type="button"
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Body */}
        <div id="printable-invoice" className="p-8 sm:p-10 space-y-6 text-[#14263D] bg-white print:p-6 print:space-y-4">
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 border-b border-[#E2E8F0] pb-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-[#F5BE19] flex items-center justify-center text-[#14263D] font-black print:border print:border-[#14263D]">
                  <Car className="w-5 h-5 stroke-[2.5]" />
                </div>
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#14263D]">
                  DEHRADUN CAB & TRAVEL
                </h1>
              </div>
              <p className="text-xs text-[#62758F] font-medium">
                Regd Tourist Transport Service Operator · Uttarakhand
              </p>
              <p className="text-xs text-[#4B5E76]">
                Rispana Bridge / Ring Road, Dehradun, Uttarakhand - 248001
              </p>
              <p className="text-xs text-[#4B5E76]">
                <span className="font-semibold">GSTIN:</span> 05AAECD9821F1ZX ·{' '}
                <span className="font-semibold">Helpline:</span> +91 9105001222
              </p>
            </div>

            <div className="sm:text-right space-y-1 bg-[#F8FAFC] print:bg-transparent p-4 sm:p-0 rounded-xl border border-[#E2E8F0] sm:border-none">
              <div className="inline-block px-2.5 py-0.5 rounded-md bg-[#EAF1F7] text-[#14263D] font-black text-xs uppercase tracking-wider mb-1">
                TAX INVOICE / TRIP SLIP
              </div>
              <div className="text-sm font-bold text-[#14263D]">
                Invoice #{invoiceNumber}
              </div>
              <div className="text-xs text-[#62758F]">
                Date: <span className="font-medium text-[#14263D]">{issueDate}</span>
              </div>
              <div className="text-xs text-[#62758F]">
                Booking Ref: <span className="font-bold text-[#B91C1C]">{booking.bookingNumber}</span>
              </div>
              <div className="text-xs text-[#62758F]">
                Status:{' '}
                <span className="font-bold text-[#15803D] uppercase">
                  {booking.status.replace(/_/g, ' ')}
                </span>
              </div>
            </div>
          </div>

          {/* Billed To & Trip Route Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-[#F8FAFC] print:bg-white rounded-xl p-4 sm:p-5 border border-[#E2E8F0]">
            {/* Passenger Information */}
            <div className="space-y-1.5">
              <div className="text-[11px] font-bold text-[#62758F] uppercase tracking-wider">
                Billed To (Passenger)
              </div>
              <div className="font-bold text-sm text-[#14263D]">
                {booking.customer.fullName}
              </div>
              <div className="text-xs text-[#4B5E76] flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#62758F]" />
                <span>{booking.customer.phone}</span>
              </div>
              {booking.customer.email && (
                <div className="text-xs text-[#4B5E76] flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#62758F]" />
                  <span>{booking.customer.email}</span>
                </div>
              )}
              <div className="text-xs text-[#62758F]">
                Passengers: <span className="font-semibold text-[#14263D]">{booking.passengerCount}</span> · 
                Luggage: <span className="font-semibold text-[#14263D]">{booking.luggageCount} Bags</span>
              </div>
            </div>

            {/* Trip Schedule & Vehicle Details */}
            <div className="space-y-1.5">
              <div className="text-[11px] font-bold text-[#62758F] uppercase tracking-wider">
                Trip & Vehicle Details
              </div>
              <div className="text-xs text-[#4B5E76]">
                <span className="font-semibold text-[#14263D]">Service:</span>{' '}
                {booking.serviceType.replace(/_/g, ' ')}
              </div>
              <div className="text-xs text-[#4B5E76]">
                <span className="font-semibold text-[#14263D]">Travel Date:</span>{' '}
                {scheduledDate} at {scheduledTime}
              </div>
              <div className="text-xs text-[#4B5E76]">
                <span className="font-semibold text-[#14263D]">Cab Category:</span>{' '}
                {booking.assignedVehicle?.categoryName || 'Dedicated Taxi'}
              </div>
              {booking.assignedVehicle && (
                <div className="text-xs text-[#4B5E76]">
                  <span className="font-semibold text-[#14263D]">Vehicle:</span>{' '}
                  {booking.assignedVehicle.make} {booking.assignedVehicle.model} ({booking.assignedVehicle.color}) ·{' '}
                  <span className="font-bold text-[#14263D] bg-yellow-100 px-1 py-0.5 rounded border border-yellow-300">
                    {booking.assignedVehicle.registrationNumber}
                  </span>
                </div>
              )}
              {booking.assignedDriver && (
                <div className="text-xs text-[#4B5E76]">
                  <span className="font-semibold text-[#14263D]">Assigned Driver:</span>{' '}
                  {booking.assignedDriver.fullName} ({booking.assignedDriver.phone})
                </div>
              )}
            </div>
          </div>

          {/* Route Section */}
          <div className="space-y-2 border border-[#E2E8F0] rounded-xl p-4 bg-white">
            <div className="text-[11px] font-bold text-[#62758F] uppercase tracking-wider">
              Route Itinerary
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex items-start gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-600 shrink-0 mt-1" />
                <div>
                  <span className="font-bold text-[#14263D]">Pickup Address:</span>{' '}
                  <span className="text-[#4B5E76]">{booking.pickupAddress}</span>
                </div>
              </div>
              {booking.dropAddress && (
                <div className="flex items-start gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-600 shrink-0 mt-1" />
                  <div>
                    <span className="font-bold text-[#14263D]">Destination Drop:</span>{' '}
                    <span className="text-[#4B5E76]">{booking.dropAddress}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Charges Table */}
          <div className="border border-[#E2E8F0] rounded-xl overflow-hidden">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#F1F5F9] text-[#14263D] font-bold uppercase tracking-wider border-b border-[#E2E8F0]">
                <tr>
                  <th className="py-3 px-4">#</th>
                  <th className="py-3 px-4">Description of Service</th>
                  <th className="py-3 px-4 text-center">Tax Rate</th>
                  <th className="py-3 px-4 text-right">Amount (INR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                <tr>
                  <td className="py-3 px-4 text-[#62758F]">1</td>
                  <td className="py-3 px-4 font-semibold text-[#14263D]">
                    {booking.serviceType.replace(/_/g, ' ')} Transport Service
                    <div className="text-[11px] text-[#62758F] font-normal">
                      Includes fuel, vehicle sanitization, hill driving allowance
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center text-[#62758F]">5% GST</td>
                  <td className="py-3 px-4 text-right font-medium">₹{baseFare.toLocaleString('en-IN')}</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-[#62758F]">2</td>
                  <td className="py-3 px-4 font-semibold text-[#14263D]">
                    Estimated State Tolls & Green Tax
                    <div className="text-[11px] text-[#62758F] font-normal">
                      FASTag highway tolls & municipal entry cess
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center text-[#62758F]">0% Excluded</td>
                  <td className="py-3 px-4 text-right font-medium">₹{tollParking.toLocaleString('en-IN')}</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-[#62758F]">3</td>
                  <td className="py-3 px-4 font-semibold text-[#14263D]">
                    CGST (2.5%) + SGST (2.5%)
                    <div className="text-[11px] text-[#62758F] font-normal">
                      Passenger transport service tax
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center text-[#62758F]">5.0%</td>
                  <td className="py-3 px-4 text-right font-medium">₹{taxAmount.toLocaleString('en-IN')}</td>
                </tr>
              </tbody>
              <tfoot className="bg-[#F8FAFC] divide-y divide-[#E2E8F0] border-t border-[#E2E8F0]">
                <tr className="font-bold text-xs text-[#14263D]">
                  <td colSpan={3} className="py-2.5 px-4 text-right">
                    Total Estimated Fare:
                  </td>
                  <td className="py-2.5 px-4 text-right text-sm font-black text-[#14263D]">
                    ₹{totalFare.toLocaleString('en-IN')}
                  </td>
                </tr>
                <tr className="text-xs text-emerald-800">
                  <td colSpan={3} className="py-2 px-4 text-right">
                    Advance Payment Received:
                  </td>
                  <td className="py-2 px-4 text-right font-bold text-emerald-700">
                    - ₹{advancePaid.toLocaleString('en-IN')}
                  </td>
                </tr>
                <tr className="font-extrabold text-xs text-[#B91C1C] bg-[#FEF2F2]">
                  <td colSpan={3} className="py-3 px-4 text-right text-sm">
                    Net Balance Payable to Driver:
                  </td>
                  <td className="py-3 px-4 text-right text-base font-black text-[#B91C1C]">
                    ₹{balanceDue.toLocaleString('en-IN')}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Terms & Authorised Stamp */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2 border-t border-[#E2E8F0] text-[11px] text-[#62758F]">
            <div className="space-y-1">
              <div className="font-bold text-[#14263D] uppercase tracking-wide">
                Passenger Advisory & Terms:
              </div>
              <ul className="list-disc list-inside space-y-0.5">
                <li>Night driving allowance applies between 10:00 PM and 05:00 AM.</li>
                <li>AC will be switched off on steep hill sections as per RTO safety regulations.</li>
                <li>Free cancellation up to 6 hours before scheduled trip start.</li>
                <li>Keep this digital/printed slip handy for entry at airport or highway checkpoints.</li>
              </ul>
            </div>

            <div className="sm:text-right flex flex-col justify-between items-end space-y-4">
              <div className="space-y-1 text-right">
                <div className="text-[10px] text-[#94A3B8] uppercase">System Generated Verified Slip</div>
                <div className="font-bold text-[#14263D]">For Dehradun Cab & Travel Services</div>
              </div>
              <div className="w-32 h-10 border border-dashed border-[#CBD5E1] rounded flex items-center justify-center text-[10px] text-[#64748B] italic">
                Authorized Signatory
              </div>
            </div>
          </div>
        </div>

        {/* Footer Close Bar (Hidden during Print) */}
        <div className="px-6 py-4 bg-[#F8FAFC] border-t border-[#E2E8F0] flex items-center justify-between print:hidden">
          <div className="text-xs text-[#62758F]">
            Need changes? Call 24x7 support at{' '}
            <a href={BRAND_TOKENS.phoneCallUrl} className="font-bold text-[#14263D] hover:underline">
              {BRAND_TOKENS.phonePrimary}
            </a>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-[#14263D] font-bold text-xs transition-colors cursor-pointer"
          >
            Close Receipt
          </button>
        </div>
      </div>
    </div>
  );
}
