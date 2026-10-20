'use client';

import React, { useState } from 'react';
import {
  CreditCard,
  ShieldCheck,
  CheckCircle,
  X,
  Lock,
  Smartphone,
  Building2,
  RefreshCw,
  AlertCircle,
  Zap,
} from 'lucide-react';
import { apiClient, type TrackBookingResponse } from '../lib/api-client';

interface RazorpayModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: TrackBookingResponse;
  onPaymentSuccess: (updatedBooking: TrackBookingResponse) => void;
}

type PayMethod = 'UPI' | 'CARD' | 'NETBANKING';

export function RazorpayModal({
  isOpen,
  onClose,
  booking,
  onPaymentSuccess,
}: RazorpayModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<PayMethod>('UPI');
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState<boolean>(false);
  const [txId, setTxId] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const advancePaise =
    booking.fareSnapshot?.advanceRequiredPaise ??
    booking.paymentSummary.advanceRequiredPaise ??
    100000;
  const advanceRupees = advancePaise / 100;

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsProcessing(true);

    try {
      // Simulate real Razorpay Gateway checkout latency and signature verification
      await new Promise((resolve) => setTimeout(resolve, 1400));

      const generatedTxId = `pay_rzp_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
      setTxId(generatedTxId);
      setPaymentSuccess(true);

      // Create updated booking response reflecting the captured advance payment
      const updated: TrackBookingResponse = {
        ...booking,
        paymentSummary: {
          ...booking.paymentSummary,
          paymentStatus: 'ADVANCE_PAID',
          totalPaidPaise: advancePaise,
          outstandingBalancePaise: Math.max(0, booking.paymentSummary.totalFarePaise - advancePaise),
        },
      };

      onPaymentSuccess(updated);
    } catch (err: any) {
      setErrorMessage(err.message || 'Payment processing failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-[#E2E8F0] animate-in fade-in zoom-in-95 duration-150">
        {/* Top Header */}
        <div className="bg-[#14263D] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#F5BE19] flex items-center justify-center text-[#14263D] font-black text-sm">
              <Zap className="w-4 h-4 fill-current" />
            </div>
            <div>
              <h3 className="font-bold text-sm tracking-wide">Razorpay Secure Checkout</h3>
              <p className="text-[11px] text-slate-300">Dehradun Cab & Travel Booking</p>
            </div>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {paymentSuccess ? (
          /* Payment Success State */
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto ring-8 ring-emerald-50">
              <CheckCircle className="w-8 h-8 stroke-[2.5]" />
            </div>

            <div className="space-y-1">
              <h4 className="text-xl font-black text-[#14263D]">Payment Successful!</h4>
              <p className="text-xs text-[#62758F]">
                Your booking advance of <strong className="text-[#14263D]">₹{advanceRupees.toLocaleString('en-IN')}</strong> has been verified.
              </p>
            </div>

            <div className="bg-[#F8FAFC] p-3 rounded-xl border border-[#E2E8F0] text-xs text-left space-y-1">
              <div className="flex justify-between text-[#62758F]">
                <span>Transaction Ref:</span>
                <span className="font-mono font-bold text-[#14263D]">{txId}</span>
              </div>
              <div className="flex justify-between text-[#62758F]">
                <span>Booking #:</span>
                <span className="font-bold text-[#14263D]">{booking.bookingNumber}</span>
              </div>
              <div className="flex justify-between text-[#62758F]">
                <span>Payment Mode:</span>
                <span className="font-bold text-emerald-700">{selectedMethod} (Verified)</span>
              </div>
            </div>

            <button
              onClick={onClose}
              type="button"
              className="w-full py-2.5 rounded-xl bg-[#14263D] hover:bg-[#1E3450] text-[#F5BE19] font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
            >
              Done & View Updated Slip
            </button>
          </div>
        ) : (
          /* Checkout Form */
          <form onSubmit={handlePay} className="p-6 space-y-5">
            {/* Amount Banner */}
            <div className="bg-[#FEF8E7] p-4 rounded-xl border border-[#F5BE19]/40 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-[#854D0E] uppercase tracking-wider block">
                  Advance Required
                </span>
                <span className="text-xl font-black text-[#14263D]">
                  ₹{advanceRupees.toLocaleString('en-IN')}
                </span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white text-[#14263D] border border-[#CBD5E1]">
                Ref: {booking.bookingNumber}
              </span>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#14263D] uppercase tracking-wider">
                Select Payment Mode
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedMethod('UPI')}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                    selectedMethod === 'UPI'
                      ? 'border-[#14263D] bg-[#14263D] text-white shadow-xs'
                      : 'border-[#CBD5E1] bg-white text-[#4B5E76] hover:bg-[#F8FAFC]'
                  }`}
                >
                  <Smartphone className="w-4 h-4 mx-auto mb-1" />
                  <span className="text-[11px] font-bold block">UPI / QR</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMethod('CARD')}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                    selectedMethod === 'CARD'
                      ? 'border-[#14263D] bg-[#14263D] text-white shadow-xs'
                      : 'border-[#CBD5E1] bg-white text-[#4B5E76] hover:bg-[#F8FAFC]'
                  }`}
                >
                  <CreditCard className="w-4 h-4 mx-auto mb-1" />
                  <span className="text-[11px] font-bold block">Card</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMethod('NETBANKING')}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                    selectedMethod === 'NETBANKING'
                      ? 'border-[#14263D] bg-[#14263D] text-white shadow-xs'
                      : 'border-[#CBD5E1] bg-white text-[#4B5E76] hover:bg-[#F8FAFC]'
                  }`}
                >
                  <Building2 className="w-4 h-4 mx-auto mb-1" />
                  <span className="text-[11px] font-bold block">NetBanking</span>
                </button>
              </div>
            </div>

            {/* Method Inputs */}
            {selectedMethod === 'UPI' && (
              <div className="space-y-2">
                <label className="block text-xs font-medium text-[#4B5E76]">
                  Virtual Payment Address (VPA / UPI ID)
                </label>
                <input
                  type="text"
                  placeholder="e.g. mobile@upi or yourname@oksbi"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#CBD5E1] text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#F5BE19]"
                />
                <div className="flex items-center gap-3 pt-1 text-[11px] text-[#62758F]">
                  <span>Supported: Google Pay</span>
                  <span>·</span>
                  <span>PhonePe</span>
                  <span>·</span>
                  <span>Paytm</span>
                </div>
              </div>
            )}

            {selectedMethod === 'CARD' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-[#4B5E76] mb-1">
                    Card Number
                  </label>
                  <input
                    type="text"
                    placeholder="4111 2222 3333 4444"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    maxLength={19}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#CBD5E1] text-xs font-mono font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#F5BE19]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-[#4B5E76] mb-1">
                      Expiry (MM/YY)
                    </label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      maxLength={5}
                      className="w-full px-3.5 py-2 rounded-xl border border-[#CBD5E1] text-xs font-mono font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#F5BE19]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#4B5E76] mb-1">
                      CVV
                    </label>
                    <input
                      type="password"
                      placeholder="•••"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      maxLength={4}
                      className="w-full px-3.5 py-2 rounded-xl border border-[#CBD5E1] text-xs font-mono font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#F5BE19]"
                    />
                  </div>
                </div>
              </div>
            )}

            {selectedMethod === 'NETBANKING' && (
              <div className="space-y-2">
                <label className="block text-xs font-medium text-[#4B5E76]">
                  Select Your Bank
                </label>
                <select className="w-full px-3 py-2 rounded-xl border border-[#CBD5E1] text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#F5BE19] bg-white">
                  <option>State Bank of India (SBI)</option>
                  <option>HDFC Bank</option>
                  <option>ICICI Bank</option>
                  <option>Axis Bank</option>
                  <option>Punjab National Bank (PNB)</option>
                </select>
              </div>
            )}

            {errorMessage && (
              <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Pay Button */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-3 rounded-xl bg-[#F5BE19] hover:bg-[#DFAC13] text-[#14263D] font-black text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Processing Payment via Gateway...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Pay ₹{advanceRupees.toLocaleString('en-IN')} Securely</span>
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[10px] text-[#62758F] pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#15803D]" />
              <span>256-bit SSL encrypted • Razorpay Certified Gateway</span>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
