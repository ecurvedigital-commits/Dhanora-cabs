'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Phone,
  Clock,
  MapPin,
  Menu,
  X,
  ChevronDown,
  Car,
  Compass,
  Calendar,
  MessageCircle,
  ShieldCheck,
} from 'lucide-react';
import { BRAND_TOKENS } from '../lib/tokens';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdown, setServicesDropdown] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (typeof window !== 'undefined') {
        setIsScrolled(window.scrollY > 20);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setServicesDropdown(false);
    setMobileMenuOpen(false);
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="relative z-50 w-full">
      {/* Main Navbar - Crisp White with subtle shadow */}
      <nav
        className={`w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-sm py-2.5 border-b border-[#E2E8F0]'
            : 'bg-white/95 backdrop-blur-sm py-3 border-b border-[#E2E8F0]/70'
        }`}
      >
        <div className="w-full px-4 sm:px-8 xl:px-12 flex items-center justify-between gap-4">
          {/* Brand Logo with Taxi Light Accent */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <img
              src="/images/logo.jpg"
              alt="Dhanora Cab Service"
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover border-2 border-[#F5BE19] shadow-sm group-hover:scale-105 transition-transform shrink-0"
            />
            <div className="flex flex-col">
              <span className="font-display font-extrabold text-lg sm:text-xl tracking-tight text-[#14263D] whitespace-nowrap leading-tight">
                DHANORA <span className="text-[#92400E]">CAB</span>
              </span>
              <span className="text-[10px] font-semibold text-[#4B5E76] uppercase tracking-wider hidden sm:block">
                Safe • Comfortable • On Time
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-3.5 xl:gap-5 2xl:gap-6 text-xs xl:text-sm font-semibold text-[#14263D] shrink-0">
            <Link href="/" className="hover:text-[#DFAC13] transition-colors whitespace-nowrap py-1">
              Home
            </Link>

            <Link href="/services" className="hover:text-[#DFAC13] transition-colors whitespace-nowrap py-1">
              Services
            </Link>

            <Link
              href="/routes"
              className="hover:text-[#DFAC13] transition-colors whitespace-nowrap py-1"
            >
              Popular Routes
            </Link>
            <Link
              href="/packages"
              className="hover:text-[#DFAC13] transition-colors whitespace-nowrap py-1"
            >
              Chardham Tours
            </Link>
            <Link
              href="/about"
              className="hover:text-[#DFAC13] transition-colors whitespace-nowrap py-1"
            >
              About Us
            </Link>
            <Link
              href="/contact"
              className="hover:text-[#DFAC13] transition-colors whitespace-nowrap py-1"
            >
              Contact
            </Link>
          </div>

          {/* Quick CTA Buttons */}
          <div className="hidden sm:flex items-center gap-2.5 shrink-0">
            <a
              href={BRAND_TOKENS.phoneCallUrl}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#B91C1C] hover:bg-[#991B1B] text-white text-xs font-bold uppercase tracking-wider shadow-sm transition-all whitespace-nowrap"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call 24/7</span>
            </a>

            <a
              href="#booking"
              onClick={(e) => scrollToSection(e, 'booking')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#F5BE19] hover:bg-[#DFAC13] text-[#14263D] text-xs font-black uppercase tracking-wider shadow-sm transition-all whitespace-nowrap cursor-pointer"
            >
              <Car className="w-3.5 h-3.5" />
              <span>Book Online</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-[#14263D] hover:bg-[#EAF1F7] transition-colors"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-[#E2E8F0] bg-white px-4 py-6 space-y-4 shadow-lg animate-in slide-in-from-top-4 duration-150">
            <div className="space-y-1">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2.5 rounded-xl text-base font-bold text-[#14263D] hover:bg-[#EAF1F7]"
              >
                Home
              </Link>
              <Link
                href="/services"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2.5 rounded-xl text-base font-semibold text-[#14263D] hover:bg-[#EAF1F7]"
              >
                All Taxi Services
              </Link>
              <Link
                href="/routes"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2.5 rounded-xl text-base font-semibold text-[#14263D] hover:bg-[#EAF1F7]"
              >
                Popular Routes & Rates
              </Link>
              <Link
                href="/packages"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2.5 rounded-xl text-base font-semibold text-[#14263D] hover:bg-[#EAF1F7]"
              >
                Chardham Yatra Packages
              </Link>
              <Link
                href="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2.5 rounded-xl text-base font-semibold text-[#14263D] hover:bg-[#EAF1F7]"
              >
                About Our Fleet & Drivers
              </Link>
              <Link
                href="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2.5 rounded-xl text-base font-semibold text-[#14263D] hover:bg-[#EAF1F7]"
              >
                24x7 Contact & Help Desk
              </Link>
            </div>

            <div className="pt-4 border-t border-[#E2E8F0] space-y-3">
              <a
                href={BRAND_TOKENS.phoneCallUrl}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#B91C1C] text-white font-bold text-sm"
              >
                <Phone className="w-4 h-4" />
                <span>Call Hotline: {BRAND_TOKENS.phonePrimary}</span>
              </a>
              <a
                href={BRAND_TOKENS.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#15803D] text-white font-bold text-sm"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Instant Inquiry</span>
              </a>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
