'use client';

import React, { useState, useEffect } from 'react';
import { MessageSquare, X, Send, Sparkles, Phone, ShieldCheck, CheckCheck } from 'lucide-react';
import { BRAND_TOKENS } from '@/lib/tokens';

interface QuickOption {
  icon: string;
  label: string;
  rate?: string;
  msg: string;
}

const QUICK_OPTIONS: QuickOption[] = [
  {
    icon: '✈️',
    label: 'Airport Drop / Pickup',
    rate: 'from ₹850',
    msg: 'Hi Dhanora Cab Service, I would like to book a taxi for Jolly Grant Airport. Please share availability.',
  },
  {
    icon: '⛰️',
    label: 'Mussoorie / Dhanaulti',
    rate: 'from ₹1,600',
    msg: 'Hi Dhanora Cab Service, I want to book a cab for a Mussoorie / Dhanaulti hill tour.',
  },
  {
    icon: '⚡',
    label: 'Delhi NCR One-Way',
    rate: 'from ₹3,200',
    msg: 'Hi Dhanora Cab Service, I need a clean AC cab from Dehradun to Delhi NCR. Please confirm the fare.',
  },
  {
    icon: '🕉️',
    label: 'Chardham Yatra Tours',
    rate: 'Pilgrimage Packages',
    msg: 'Hi Dhanora Cab Service, please share details and pricing for Chardham Yatra with experienced hill drivers.',
  },
  {
    icon: '⏱️',
    label: 'Urgent Cab within 15 Mins',
    rate: 'Immediate Dispatch',
    msg: 'Hi Dhanora Cab Service, I need an urgent cab right now in Dehradun. Please connect with dispatch.',
  },
];

export function WhatsAppChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [customMsg, setCustomMsg] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [unreadCount, setUnreadCount] = useState(1);

  useEffect(() => {
    const now = new Date();
    setCurrentTime(
      now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    );
  }, []);

  const openWhatsApp = (text: string) => {
    const encoded = encodeURIComponent(text.trim());
    const url = `https://wa.me/917505800684?text=${encoded}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    setCustomMsg('');
    setIsOpen(false);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customMsg.trim()) return;
    openWhatsApp(`Hi Dhanora Cab Service, ${customMsg}`);
  };

  return (
    <>
      {/* Floating Trigger Button (Bottom Right) */}
      <div className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-40 flex items-center gap-2">
        {/* Subtle tooltip pill if chat is closed */}
        {!isOpen && (
          <div
            onClick={() => {
              setIsOpen(true);
              setUnreadCount(0);
            }}
            className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-emerald-500/30 text-[#14263D] text-xs font-bold shadow-lg shadow-black/10 cursor-pointer hover:shadow-xl transition-all hover:scale-105 group"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="group-hover:text-emerald-700 transition-colors">
              Chat on WhatsApp
            </span>
          </div>
        )}

        <button
          type="button"
          onClick={() => {
            setIsOpen(!isOpen);
            if (!isOpen) setUnreadCount(0);
          }}
          aria-label="Open automated WhatsApp support"
          className="relative w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-xl shadow-emerald-600/30 flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer ring-4 ring-white/80"
        >
          {isOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <MessageSquare className="w-7 h-7 fill-white stroke-none" />
          )}

          {/* Unread notification ping */}
          {!isOpen && unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-white text-[10px] font-black border-2 border-white shadow-sm">
              1
            </span>
          )}
        </button>
      </div>

      {/* Expanded WhatsApp Automation Card */}
      {isOpen && (
        <div className="fixed bottom-36 md:bottom-24 right-4 sm:right-6 z-40 w-[calc(100vw-2rem)] sm:w-96 max-h-[82vh] bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-5 duration-200 text-[#14263D]">
          {/* Header */}
          <div className="bg-[#128C7E] text-white p-4 flex items-center justify-between shadow-sm shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src="/images/logo.jpg"
                  alt="Dhanora Cab Service"
                  className="w-11 h-11 rounded-full object-cover border-2 border-white/90 shadow-sm"
                />
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-[#128C7E] rounded-full" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-sm tracking-tight leading-none text-white">
                    Dhanora Cab Dispatch
                  </h3>
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                </div>
                <p className="text-[11px] text-emerald-100 font-medium mt-0.5">
                  Automated Booking • Replies in &lt;1 min
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Chat Background & Message Stream */}
          <div className="p-4 space-y-3.5 overflow-y-auto flex-1 bg-[#ECE5DD]/40 text-xs">
            {/* System Info Banner */}
            <div className="text-center">
              <span className="inline-block px-3 py-1 rounded-full bg-white/80 backdrop-blur-xs text-[10px] text-slate-500 font-medium shadow-2xs">
                {currentTime ? `Today at ${currentTime}` : 'Active Dispatch'}
              </span>
            </div>

            {/* Inbound Agent Message Bubble */}
            <div className="flex items-start gap-2 max-w-[88%]">
              <div className="p-3 rounded-2xl rounded-tl-xs bg-white text-slate-800 shadow-sm border border-slate-100 space-y-1.5 leading-relaxed">
                <p className="font-semibold text-[#14263D]">
                  Namaste! 🙏 Welcome to Dhanora Cab Service.
                </p>
                <p className="text-[11px] text-slate-600">
                  Select a quick destination below or type your trip details to receive instant flat rates on WhatsApp:
                </p>
                <div className="text-[9px] text-slate-400 text-right flex items-center justify-end gap-1 pt-0.5">
                  <span>{currentTime}</span>
                  <CheckCheck className="w-3.5 h-3.5 text-sky-500" />
                </div>
              </div>
            </div>

            {/* Quick 1-Tap Booking Templates */}
            <div className="space-y-1.5 pt-1">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider pl-1">
                ⚡ 1-Tap Quick Booking:
              </p>
              <div className="grid grid-cols-1 gap-1.5">
                {QUICK_OPTIONS.map((opt) => (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => openWhatsApp(opt.msg)}
                    className="w-full text-left p-2.5 rounded-xl bg-white hover:bg-emerald-50/70 border border-slate-200/90 hover:border-emerald-400 text-slate-800 transition-all flex items-center justify-between gap-2 shadow-2xs group cursor-pointer active:scale-[0.99]"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-base shrink-0">{opt.icon}</span>
                      <div className="min-w-0">
                        <div className="font-semibold text-xs text-[#14263D] truncate group-hover:text-emerald-800">
                          {opt.label}
                        </div>
                        {opt.rate && (
                          <div className="text-[10px] text-slate-500 font-medium">
                            {opt.rate}
                          </div>
                        )}
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded-md shrink-0 group-hover:bg-[#25D366] group-hover:text-white transition-colors">
                      Book →
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Input Bar */}
          <form
            onSubmit={handleCustomSubmit}
            className="p-3 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0"
          >
            <input
              type="text"
              value={customMsg}
              onChange={(e) => setCustomMsg(e.target.value)}
              placeholder="e.g. Taxi from Airport to Mussoorie..."
              className="flex-1 px-3.5 py-2 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              disabled={!customMsg.trim()}
              className="w-9 h-9 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] disabled:bg-slate-200 disabled:text-slate-400 text-white flex items-center justify-center transition-colors shrink-0 shadow-sm"
              title="Send to WhatsApp"
            >
              <Send className="w-4 h-4 ml-0.5" />
            </button>
          </form>

          {/* Hotline Quick Link */}
          <div className="py-2 px-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600 shrink-0">
            <span>Direct Phone Helpline:</span>
            <a
              href={`tel:${BRAND_TOKENS.phonePrimary.replace(/[^0-9+]/g, '')}`}
              className="font-bold text-[#14263D] hover:text-[#92400E] flex items-center gap-1"
            >
              <Phone className="w-3 h-3 text-[#B91C1C]" />
              <span>{BRAND_TOKENS.phonePrimary}</span>
            </a>
          </div>
        </div>
      )}
    </>
  );
}
