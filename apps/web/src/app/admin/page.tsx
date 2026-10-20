'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  CalendarCheck,
  Car,
  Navigation,
  Mountain,
  FileText,
  Search,
  Filter,
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
  Plus,
  Edit3,
  Phone,
  MessageCircle,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  Users,
  DollarSign,
  RefreshCw,
  ChevronRight,
  ChevronDown,
  MapPin,
  Calendar,
  Sparkles,
  ArrowLeft,
  Check,
  Lock,
  KeyRound,
  Eye,
  EyeOff,
  LogOut,
  Mail,
  UserCheck,
} from 'lucide-react';
import { BRAND_TOKENS, FLEET_OPTIONS, POPULAR_ROUTES, TOUR_PACKAGES } from '../../lib/tokens';
import {
  apiClient,
  type UserProfile,
  type BookingResponse,
  type TrackBookingResponse,
  type DashboardOverviewDto,
} from '../../lib/api-client';
import { InvoiceModal } from '../../components/InvoiceModal';
import { AdminAnalyticsDashboard } from '../../components/AdminAnalyticsDashboard';

type AdminTab = 'OVERVIEW' | 'BOOKINGS' | 'FLEET' | 'ROUTES' | 'TOURS' | 'CONTENT';

interface AdminBooking {
  id: string;
  bookingNumber: string;
  customerName: string;
  customerPhone: string;
  pickup: string;
  drop: string;
  date: string;
  time: string;
  serviceType: string;
  vehicleCategory: string;
  totalFare: number;
  status: 'PENDING_REVIEW' | 'CONFIRMED' | 'ASSIGNED' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
  driverName?: string;
  driverPhone?: string;
}

export default function AdminCmsPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>('OVERVIEW');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [invoiceModalBooking, setInvoiceModalBooking] = useState<TrackBookingResponse | null>(null);

  const buildInvoiceData = (b: AdminBooking): TrackBookingResponse => ({
    id: b.id,
    bookingNumber: b.bookingNumber,
    status: b.status as any,
    serviceType: b.serviceType,
    pickupAddress: b.pickup,
    dropAddress: b.drop,
    scheduledStart: new Date().toISOString(),
    passengerCount: 2,
    luggageCount: 2,
    createdAt: b.createdAt,
    customer: {
      fullName: b.customerName,
      phone: b.customerPhone,
    },
    fareSnapshot: {
      baseFarePaise: Math.round(b.totalFare * 0.75 * 100),
      distanceRatePaise: 1600,
      estimatedDistanceKm: 120,
      tollEstimatePaise: 25000,
      parkingEstimatePaise: 0,
      taxPercent: 5,
      taxPaise: Math.round(b.totalFare * 0.05 * 100),
      totalFarePaise: b.totalFare * 100,
      advanceRequiredPaise: Math.round(b.totalFare * 0.25 * 100),
      currency: 'INR',
    },
    paymentSummary: {
      paymentStatus: b.status === 'COMPLETED' ? 'FULLY_PAID' : 'ADVANCE_PAID',
      totalPaidPaise: Math.round(b.totalFare * 0.25 * 100),
      outstandingBalancePaise: Math.round(b.totalFare * 0.75 * 100),
      advanceRequiredPaise: Math.round(b.totalFare * 0.25 * 100),
      totalFarePaise: b.totalFare * 100,
    },
    assignedDriver: b.driverName
      ? {
          fullName: b.driverName,
          phone: b.driverPhone || '+91 9105001222',
          rating: 4.9,
        }
      : null,
    assignedVehicle: {
      make: 'Toyota',
      model: b.vehicleCategory || 'Cab',
      color: 'White',
      registrationNumber: 'UK 07 TA 4122',
      categoryName: b.vehicleCategory || 'Sedan / SUV',
    },
  });

  // Authentication State & Security Gate
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAuthChecking, setIsAuthChecking] = useState<boolean>(true);
  const [adminToken, setAdminToken] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isLiveBackend, setIsLiveBackend] = useState<boolean>(false);
  const [isLoadingBookings, setIsLoadingBookings] = useState<boolean>(false);
  const [dashboardOverview, setDashboardOverview] = useState<DashboardOverviewDto | null>(null);
  const [isLoadingOverview, setIsLoadingOverview] = useState<boolean>(false);

  const [loginEmail, setLoginEmail] = useState<string>('');
  const [loginPassword, setLoginPassword] = useState<string>('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isSubmittingLogin, setIsSubmittingLogin] = useState<boolean>(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const fetchLiveOverview = useCallback(async (token?: string | null) => {
    const activeToken = token || adminToken;
    setIsLoadingOverview(true);
    try {
      const data = await apiClient.reports.getOverview(activeToken || undefined);
      if (data) {
        setDashboardOverview(data);
      }
    } catch (err: any) {
      console.warn('Live API overview fetch notice:', err.message);
    } finally {
      setIsLoadingOverview(false);
    }
  }, [adminToken]);

  const fetchLiveBookings = useCallback(async (token?: string | null) => {
    const activeToken = token || adminToken;
    if (!activeToken) return;
    setIsLoadingBookings(true);
    try {
      const res = await apiClient.bookings.list({ take: 50 }, activeToken);
      if (res && res.items && res.items.length > 0) {
        const mapped: AdminBooking[] = res.items.map((item: BookingResponse) => ({
          id: item.id,
          bookingNumber: item.bookingNumber,
          customerName: item.customer?.fullName || 'Traveler',
          customerPhone: item.customer?.phone || '',
          pickup: item.pickupAddress,
          drop: item.dropAddress || 'Destination',
          date: item.scheduledStart ? new Date(item.scheduledStart).toLocaleDateString('en-IN') : '',
          time: item.scheduledStart ? new Date(item.scheduledStart).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : '',
          serviceType: item.serviceType.replace(/_/g, ' '),
          vehicleCategory: 'Sedan / SUV',
          totalFare: item.fareSnapshot ? Math.round(item.fareSnapshot.totalFarePaise / 100) : 2500,
          status: item.status as any,
          createdAt: new Date(item.createdAt).toLocaleDateString('en-IN'),
        }));
        setBookings(mapped);
        setIsLiveBackend(true);
        showToast(`Synced ${mapped.length} live bookings from NestJS API`);
      }
    } catch (err: any) {
      console.warn('Live API bookings fetch notice:', err.message);
    } finally {
      setIsLoadingBookings(false);
    }
  }, [adminToken]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const activeSession = localStorage.getItem('dehradun_admin_session');
      const savedToken = localStorage.getItem('dehradun_admin_token');
      const savedUserStr = localStorage.getItem('dehradun_admin_user');

      if (savedToken) {
        setAdminToken(savedToken);
      }
      if (savedUserStr) {
        try {
          setCurrentUser(JSON.parse(savedUserStr));
        } catch {
          // ignore parsing error
        }
      }

      if (activeSession === 'active') {
        setIsAuthenticated(true);
        if (savedToken) {
          fetchLiveBookings(savedToken);
          fetchLiveOverview(savedToken);
        } else {
          fetchLiveOverview();
        }
      }
      setIsAuthChecking(false);

      // Probe backend health
      apiClient
        .checkHealth()
        .then(() => setIsLiveBackend(true))
        .catch(() => setIsLiveBackend(false));
    }
  }, [fetchLiveBookings, fetchLiveOverview]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsSubmittingLogin(true);

    const cleanEmail = loginEmail.trim().toLowerCase();
    const cleanPass = loginPassword.trim();

    try {
      // 1. Attempt live NestJS backend login
      const res = await apiClient.auth.login(cleanEmail, cleanPass);
      if (res && res.accessToken) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('dehradun_admin_session', 'active');
          localStorage.setItem('dehradun_admin_token', res.accessToken);
          localStorage.setItem('dehradun_admin_user', JSON.stringify(res.user));
        }
        setAdminToken(res.accessToken);
        setCurrentUser(res.user);
        setIsAuthenticated(true);
        setIsLiveBackend(true);
        showToast(`Authenticated: Welcome ${res.user.fullName} (${res.user.roles.join(', ') || 'Staff'})`);
        fetchLiveBookings(res.accessToken);
        fetchLiveOverview(res.accessToken);
        setIsSubmittingLogin(false);
        return;
      }
    } catch (apiErr: any) {
      console.warn('Backend login attempt:', apiErr.message);
      setLoginError(apiErr.message || 'Invalid administrative credentials. Please try again.');
    } finally {
      setIsSubmittingLogin(false);
    }
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('dehradun_admin_session');
      localStorage.removeItem('dehradun_admin_token');
      localStorage.removeItem('dehradun_admin_user');
    }
    setIsAuthenticated(false);
    setAdminToken(null);
    setCurrentUser(null);
    setLoginPassword('');
    showToast('Signed out of Admin CMS session');
  };

  // Live Active Bookings (populated from NestJS API)
  const [bookings, setBookings] = useState<AdminBooking[]>([]);

  // Fleet Tariffs State
  const [fleetList, setFleetList] = useState(
    FLEET_OPTIONS.map((f) => ({
      ...f,
      status: 'ACTIVE' as 'ACTIVE' | 'MAINTENANCE',
    }))
  );

  // Popular Routes State
  const [routeList, setRouteList] = useState(POPULAR_ROUTES);

  // Tour Packages State
  const [toursList, setToursList] = useState(TOUR_PACKAGES);

  // CMS Static Articles State
  const [articlesList, setArticlesList] = useState([
    {
      id: 'art-1',
      title: 'Complete Char Dham Yatra Taxi Booking Guide 2026',
      slug: 'chardham-yatra-cab-booking-guide',
      category: 'Pilgrimage Guide',
      status: 'PUBLISHED',
      author: 'Dehradun Cab Editorial',
      views: 14820,
      updatedAt: '12 Oct 2026',
    },
    {
      id: 'art-2',
      title: 'Dehradun to Delhi Expressway: Travel Time, Tolls & Cab Fares',
      slug: 'dehradun-delhi-expressway-taxi-fare',
      category: 'Outstation Travel',
      status: 'PUBLISHED',
      author: 'Operations Team',
      views: 9540,
      updatedAt: '08 Oct 2026',
    },
    {
      id: 'art-3',
      title: 'Jolly Grant Airport (DED) Night Cabs: Safety & Flight Tracking',
      slug: 'jolly-grant-airport-dehradun-cab-night-dispatch',
      category: 'Airport Transfer',
      status: 'PUBLISHED',
      author: 'Dispatch Desk',
      views: 6310,
      updatedAt: '01 Oct 2026',
    },
    {
      id: 'art-4',
      title: 'Mussoorie Queen of Hills: 2-Day Sightseeing Road Itinerary',
      slug: 'mussoorie-2-day-taxi-itinerary',
      category: 'Hill Station Tours',
      status: 'DRAFT',
      author: 'Travel Coordinator',
      views: 120,
      updatedAt: 'Today',
    },
  ]);

  // Status Updater with Live NestJS API Integration
  const updateBookingStatus = async (id: string, newStatus: AdminBooking['status']) => {
    // If live API is connected and status is CONFIRMED or CANCELLED, invoke backend
    if (adminToken && isLiveBackend) {
      try {
        if (newStatus === 'CONFIRMED') {
          await apiClient.bookings.confirm(id, adminToken);
          showToast(`Booking approved & trip scheduled on live NestJS backend!`);
        } else if (newStatus === 'CANCELLED') {
          await apiClient.bookings.cancel(id, adminToken, 'Cancelled by operator');
          showToast(`Booking cancelled on live NestJS backend`);
        }
      } catch (err: any) {
        showToast(`Backend sync notice: ${err.message}. Updated local view.`);
      }
    } else {
      showToast(`Booking status updated to ${newStatus}`);
    }

    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
    );
  };

  // Fleet Rate Updater
  const updateFleetRate = (id: string, delta: number) => {
    setFleetList((prev) =>
      prev.map((f) => (f.id === id ? { ...f, perKmRate: Math.max(10, f.perKmRate + delta) } : f))
    );
    showToast(`Per-km rate updated for vehicle`);
  };

  // Filtered Bookings
  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      b.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.bookingNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.customerPhone.includes(searchQuery) ||
      b.pickup.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.drop.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // KPI Calculations
  const totalRevenue = bookings
    .filter((b) => b.status === 'COMPLETED' || b.status === 'CONFIRMED' || b.status === 'ASSIGNED')
    .reduce((acc, b) => acc + b.totalFare, 0);

  const pendingCount = bookings.filter((b) => b.status === 'PENDING_REVIEW').length;
  const confirmedCount = bookings.filter((b) => b.status === 'CONFIRMED').length;

  // Authentication Gate - Render Login Screen if not authenticated
  if (isAuthChecking) {
    return (
      <div className="min-h-screen bg-[#F8F7F2] flex items-center justify-center">
        <div className="flex items-center gap-3 text-sm font-bold text-[#14263D]">
          <RefreshCw className="w-5 h-5 text-[#F5BE19] animate-spin" />
          <span>Verifying Admin Session...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#F8F7F2] flex flex-col justify-between font-sans">
        {/* Top Minimal Bar */}
        <header className="bg-white/90 backdrop-blur-md border-b border-[#E2E8F0] px-4 sm:px-8 py-3 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs font-bold text-[#14263D] hover:text-[#DFAC13] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Dehradun Cab Website</span>
          </Link>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#15803D]" />
            <span className="text-xs font-bold text-[#4B5E76] hidden sm:inline">
              Dehradun Cab Operational Security
            </span>
          </div>
        </header>

        {/* Center Login Card */}
        <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
          <div className="w-full max-w-md bg-white border border-[#E2E8F0] rounded-2xl shadow-xl p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200">
            {/* Brand Logo & Lock Badge */}
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-14 h-14 rounded-2xl bg-[#F5BE19] text-[#14263D] flex items-center justify-center shadow-md mb-3">
                <Lock className="w-7 h-7 stroke-[2.5]" />
              </div>
              <h1 className="font-display font-extrabold text-2xl text-[#14263D] tracking-tight">
                Admin CMS Portal
              </h1>
              <p className="text-xs text-[#62758F] font-medium mt-1">
                Dehradun Cab Fleet, Bookings & Dispatch Control
              </p>
            </div>

            {/* Error Message */}
            {loginError && (
              <div className="mb-5 p-3 rounded-xl bg-[#FEF2F2] border border-[#FECACA] flex items-center gap-2.5 text-xs text-[#991B1B] font-semibold animate-in shake">
                <AlertCircle className="w-4 h-4 shrink-0 text-[#DC2626]" />
                <span>{loginError}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#14263D] mb-1.5">
                  Admin Email / Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#94A3B8]">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="admin@dhanoracabs.com"
                    required
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] text-sm text-[#14263D] font-medium focus:outline-hidden focus:ring-2 focus:ring-[#F5BE19] focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#14263D] mb-1.5">
                  Security Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#94A3B8]">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter admin password"
                    required
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] text-sm text-[#14263D] font-medium focus:outline-hidden focus:ring-2 focus:ring-[#F5BE19] focus:bg-white transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#94A3B8] hover:text-[#14263D] transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>


              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmittingLogin}
                className="w-full py-3 rounded-xl bg-[#14263D] hover:bg-[#1E3450] text-[#F5BE19] font-black text-sm tracking-wide shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
              >
                {isSubmittingLogin ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-[#F5BE19]" />
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Sign In to Admin Console</span>
                  </>
                )}
              </button>
            </form>

            {/* Trust Footer */}
            <div className="mt-6 pt-4 border-t border-[#E2E8F0] flex items-center justify-center gap-1.5 text-[11px] text-[#62758F]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#15803D]" />
              <span>Authorized personnel only • 256-bit encrypted session</span>
            </div>
          </div>
        </main>

        {/* Minimal Footer */}
        <footer className="text-center py-4 text-xs text-[#94A3B8]">
          © {new Date().getFullYear()} Dehradun Cab Dispatch Operations. All rights reserved.
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F7F2] text-[#14263D] flex flex-col font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-[#14263D] text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 text-xs font-bold animate-in fade-in slide-in-from-top-2">
          <CheckCircle className="w-4 h-4 text-[#F5BE19]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Admin Header Bar */}
      <header className="bg-white border-b border-[#E2E8F0] sticky top-0 z-40 px-4 sm:px-6 py-2.5 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-[#EAF1F7] hover:bg-[#CBD5E1] text-xs font-bold text-[#14263D] transition-colors"
            title="Return to Public Customer Portal"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Back to Website</span>
          </Link>

          <div className="h-5 w-px bg-[#E2E8F0]" />

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#F5BE19] flex items-center justify-center font-black text-[#14263D] shadow-xs text-sm">
              <Car className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 font-display font-extrabold text-sm sm:text-base tracking-tight leading-none">
                <span>DEHRADUN CAB</span>
                <span className="bg-[#14263D] text-white text-[9px] px-1.5 py-0.5 rounded font-black tracking-wider uppercase">
                  CMS ADMIN
                </span>
              </div>
              <div className="text-[10px] text-[#62758F] font-medium leading-none mt-0.5">
                Dispatch Coordinator & Content Operations
              </div>
            </div>
          </div>
        </div>

        {/* Status indicator, Backend Mode & Sync */}
        <div className="flex items-center gap-2.5 text-xs">
          {/* Live API sync pill */}
          <button
            onClick={() => {
              fetchLiveBookings();
              fetchLiveOverview();
            }}
            disabled={isLoadingBookings || isLoadingOverview}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold transition-all border ${
              isLiveBackend
                ? 'bg-[#DCFCE7] text-[#15803D] border-[#86EFAC] hover:bg-[#BBF7D0]'
                : 'bg-[#FEF8E7] text-[#B48505] border-[#F5BE19]/50 hover:bg-[#FEF08A]'
            }`}
            title="Click to trigger full synchronization with NestJS API"
          >
            <RefreshCw className={`w-3 h-3 ${isLoadingBookings || isLoadingOverview ? 'animate-spin' : ''}`} />
            <span>{isLiveBackend ? 'NestJS API Online' : 'Dev Demo Mode'}</span>
          </button>

          {/* User profile / Logout */}
          <div className="flex items-center gap-2 pl-2 border-l border-[#E2E8F0]">
            <div className="hidden lg:block text-right">
              <div className="text-[11px] font-bold text-[#14263D] leading-none">
                {currentUser?.fullName || 'Vikram Rawat'}
              </div>
              <div className="text-[9px] text-[#62758F] leading-none mt-0.5">
                {currentUser?.email || loginEmail}
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg bg-[#F8F7F2] hover:bg-[#FEE2E2] text-[#4B5E76] hover:text-[#B91C1C] transition-colors"
              title="Sign out of Admin CMS"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Workspace Container */}
      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto p-3 sm:p-5 gap-4">
        {/* Left Sidebar Navigation */}
        <aside className="w-full md:w-60 shrink-0 bg-white border border-[#E2E8F0] rounded-2xl p-2.5 shadow-card flex md:flex-col gap-1 overflow-x-auto md:overflow-x-visible">
          <button
            onClick={() => setActiveTab('OVERVIEW')}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap text-left w-full ${
              activeTab === 'OVERVIEW'
                ? 'bg-[#14263D] text-white shadow-sm'
                : 'text-[#4B5E76] hover:bg-[#EAF1F7] hover:text-[#14263D]'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 shrink-0" />
            <span>Dashboard Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('BOOKINGS')}
            className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap text-left w-full ${
              activeTab === 'BOOKINGS'
                ? 'bg-[#14263D] text-white shadow-sm'
                : 'text-[#4B5E76] hover:bg-[#EAF1F7] hover:text-[#14263D]'
            }`}
          >
            <div className="flex items-center gap-2">
              <CalendarCheck className="w-4 h-4 shrink-0" />
              <span>Bookings Queue</span>
            </div>
            {pendingCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-black bg-[#F5BE19] text-[#14263D]">
                {pendingCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('FLEET')}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap text-left w-full ${
              activeTab === 'FLEET'
                ? 'bg-[#14263D] text-white shadow-sm'
                : 'text-[#4B5E76] hover:bg-[#EAF1F7] hover:text-[#14263D]'
            }`}
          >
            <Car className="w-4 h-4 shrink-0" />
            <span>Fleet & Tariffs</span>
          </button>

          <button
            onClick={() => setActiveTab('ROUTES')}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap text-left w-full ${
              activeTab === 'ROUTES'
                ? 'bg-[#14263D] text-white shadow-sm'
                : 'text-[#4B5E76] hover:bg-[#EAF1F7] hover:text-[#14263D]'
            }`}
          >
            <Navigation className="w-4 h-4 shrink-0" />
            <span>Popular Routes</span>
          </button>

          <button
            onClick={() => setActiveTab('TOURS')}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap text-left w-full ${
              activeTab === 'TOURS'
                ? 'bg-[#14263D] text-white shadow-sm'
                : 'text-[#4B5E76] hover:bg-[#EAF1F7] hover:text-[#14263D]'
            }`}
          >
            <Mountain className="w-4 h-4 shrink-0" />
            <span>Chardham & Tours</span>
          </button>

          <button
            onClick={() => setActiveTab('CONTENT')}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap text-left w-full ${
              activeTab === 'CONTENT'
                ? 'bg-[#14263D] text-white shadow-sm'
                : 'text-[#4B5E76] hover:bg-[#EAF1F7] hover:text-[#14263D]'
            }`}
          >
            <FileText className="w-4 h-4 shrink-0" />
            <span>CMS Guides & SEO</span>
          </button>

          <div className="hidden md:block mt-auto pt-4 border-t border-[#E2E8F0] space-y-2">
            <div className="p-2.5 rounded-xl bg-[#FEF8E7] border border-[#F5BE19]/40 text-[11px] space-y-1">
              <span className="font-bold text-[#B48505] block">Emergency Dispatch</span>
              <span className="text-[#62758F] block text-[10px]">
                Opp. Ring Road, Dehradun 24x7 control hub
              </span>
            </div>
          </div>
        </aside>

        {/* Right Main Content Panel */}
        <main className="flex-1 space-y-4 min-w-0">
          {/* TAB 1: OVERVIEW METRICS */}
          {activeTab === 'OVERVIEW' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              {/* KPI Metrics Row */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-2xl bg-white border border-[#E2E8F0] shadow-card">
                  <div className="flex items-center justify-between text-[#62758F] text-xs">
                    <span>Pending Inquiries</span>
                    <Clock className="w-4 h-4 text-[#F5BE19]" />
                  </div>
                  <div className="font-display font-black text-2xl text-[#14263D] mt-1">
                    {pendingCount}
                  </div>
                  <div className="text-[10px] text-[#B48505] font-bold mt-0.5">
                    Requires coordinator verification
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white border border-[#E2E8F0] shadow-card">
                  <div className="flex items-center justify-between text-[#62758F] text-xs">
                    <span>Confirmed Bookings</span>
                    <CheckCircle className="w-4 h-4 text-[#15803D]" />
                  </div>
                  <div className="font-display font-black text-2xl text-[#15803D] mt-1">
                    {confirmedCount}
                  </div>
                  <div className="text-[10px] text-[#62758F] mt-0.5">Drivers queued for transit</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white border border-[#E2E8F0] shadow-card">
                  <div className="flex items-center justify-between text-[#62758F] text-xs">
                    <span>Est. Pipeline Revenue</span>
                    <DollarSign className="w-4 h-4 text-[#14263D]" />
                  </div>
                  <div className="font-display font-black text-2xl text-[#14263D] mt-1">
                    ₹{totalRevenue.toLocaleString('en-IN')}
                  </div>
                  <div className="text-[10px] text-[#15803D] font-bold mt-0.5">
                    Locked with immutable snapshot
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white border border-[#E2E8F0] shadow-card">
                  <div className="flex items-center justify-between text-[#62758F] text-xs">
                    <span>Active Mountain Fleet</span>
                    <Car className="w-4 h-4 text-[#B91C1C]" />
                  </div>
                  <div className="font-display font-black text-2xl text-[#14263D] mt-1">
                    {fleetList.length} Categories
                  </div>
                  <div className="text-[10px] text-[#62758F] mt-0.5">100% Commercial verified</div>
                </div>
              </div>

              {/* Quick Actions & Recent Queue Banner */}
              <div className="p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-card space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-display font-bold text-sm text-[#14263D]">
                      Live Incoming Booking Requests
                    </h3>
                    <p className="text-[11px] text-[#62758F]">
                      Direct web form submissions waiting for driver assignment
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('BOOKINGS')}
                    className="text-xs font-bold text-[#DFAC13] hover:underline flex items-center gap-1"
                  >
                    <span>View All ({bookings.length})</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Compact Queue Preview */}
                <div className="divide-y divide-[#E2E8F0]">
                  {bookings.length === 0 ? (
                    <div className="py-8 text-center text-[#62758F] text-xs">
                      No incoming booking requests yet. Real-time web requests will appear here.
                    </div>
                  ) : (
                    bookings.slice(0, 3).map((item) => (
                    <div
                      key={item.id}
                      className="py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[#14263D]">{item.customerName}</span>
                          <span className="text-[10px] text-[#62758F]">({item.bookingNumber})</span>
                          <span
                            className={`px-2 py-0.2 rounded-full text-[9px] font-black uppercase ${
                              item.status === 'PENDING_REVIEW'
                                ? 'bg-[#FEF8E7] text-[#B48505] border border-[#F5BE19]/40'
                                : 'bg-[#DCFCE7] text-[#15803D]'
                            }`}
                          >
                            {item.status}
                          </span>
                        </div>
                        <div className="text-[11px] text-[#4B5E76] flex items-center gap-2">
                          <span className="truncate max-w-xs">
                            {item.pickup} → {item.drop}
                          </span>
                          <span>•</span>
                          <span className="font-semibold">{item.vehicleCategory}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="font-display font-extrabold text-sm text-[#14263D]">
                          ₹{item.totalFare.toLocaleString('en-IN')}
                        </span>
                        {item.status === 'PENDING_REVIEW' && (
                          <button
                            onClick={() => updateBookingStatus(item.id, 'CONFIRMED')}
                            className="px-2.5 py-1 rounded-lg bg-[#15803D] hover:bg-[#166534] text-white font-bold text-[10px] transition-colors"
                          >
                            Approve
                          </button>
                        )}
                        <a
                          href={`https://api.whatsapp.com/send?phone=${item.customerPhone.replace(
                            /[^0-9]/g,
                            ''
                          )}&text=Hi%20${encodeURIComponent(
                            item.customerName
                          )},%20this%20is%20Dehradun%20Cab%20Coordinator%20regarding%20booking%20${
                            item.bookingNumber
                          }.`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 rounded-lg bg-[#EAF1F7] text-[#15803D] hover:bg-[#CBD5E1]"
                          title="Contact Customer on WhatsApp"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                        </a>
                        <button
                          onClick={() => setInvoiceModalBooking(buildInvoiceData(item))}
                          className="p-1 rounded-lg bg-[#EAF1F7] text-[#14263D] hover:bg-[#CBD5E1]"
                          title="View & Print Tax Invoice"
                        >
                          <FileText className="w-3.5 h-3.5 text-[#B48505]" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
                </div>
              </div>

              {/* Visual Revenue Dynamics, Service Breakdown & Fleet Utilization */}
              <AdminAnalyticsDashboard
                overview={dashboardOverview}
                bookings={bookings}
                onOpenInvoice={(b) => setInvoiceModalBooking(buildInvoiceData(b))}
                onViewAllBookings={() => setActiveTab('BOOKINGS')}
              />
            </div>
          )}

          {/* TAB 2: FULL BOOKINGS QUEUE */}
          {activeTab === 'BOOKINGS' && (
            <div className="space-y-3 animate-in fade-in duration-200">
              {/* Controls bar */}
              <div className="p-3 bg-white border border-[#E2E8F0] rounded-2xl shadow-card flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="relative w-full sm:w-72">
                  <Search className="w-3.5 h-3.5 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by customer, phone, or route..."
                    className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-[#F8F7F2] border border-[#CBD5E1] text-xs text-[#14263D] focus:outline-none focus:border-[#F5BE19]"
                  />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
                  {['ALL', 'PENDING_REVIEW', 'CONFIRMED', 'ASSIGNED', 'COMPLETED'].map((st) => (
                    <button
                      key={st}
                      onClick={() => setStatusFilter(st)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold whitespace-nowrap transition-all ${
                        statusFilter === st
                          ? 'bg-[#14263D] text-white shadow-xs'
                          : 'bg-[#F8F7F2] text-[#4B5E76] hover:bg-[#EAF1F7]'
                      }`}
                    >
                      {st === 'ALL' ? 'All' : st.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bookings Table Card */}
              <div className="bg-white border border-[#E2E8F0] rounded-2xl shadow-card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-[#EAF1F7] text-[#62758F] font-bold text-[10px] uppercase border-b border-[#CBD5E1]">
                        <th className="py-2.5 px-3">Booking #</th>
                        <th className="py-2.5 px-3">Customer</th>
                        <th className="py-2.5 px-3">Route (From → To)</th>
                        <th className="py-2.5 px-3">Date / Time</th>
                        <th className="py-2.5 px-3">Fare</th>
                        <th className="py-2.5 px-3">Status</th>
                        <th className="py-2.5 px-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E2E8F0]">
                      {filteredBookings.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-8 text-center text-[#62758F]">
                            No bookings match your current filter.
                          </td>
                        </tr>
                      ) : (
                        filteredBookings.map((b) => (
                          <tr key={b.id} className="hover:bg-[#F8F7F2] transition-colors">
                            <td className="py-2.5 px-3 font-mono font-bold text-[11px] text-[#14263D]">
                              {b.bookingNumber}
                            </td>
                            <td className="py-2.5 px-3">
                              <div className="font-bold text-[#14263D]">{b.customerName}</div>
                              <div className="text-[10px] text-[#62758F]">{b.customerPhone}</div>
                            </td>
                            <td className="py-2.5 px-3 max-w-xs">
                              <div className="text-[#14263D] font-medium truncate">{b.pickup}</div>
                              <div className="text-[10px] text-[#62758F] truncate">→ {b.drop}</div>
                            </td>
                            <td className="py-2.5 px-3 whitespace-nowrap">
                              <div className="text-[#14263D]">{b.date}</div>
                              <div className="text-[10px] text-[#62758F]">{b.time}</div>
                            </td>
                            <td className="py-2.5 px-3 font-display font-extrabold text-sm text-[#14263D]">
                              ₹{b.totalFare.toLocaleString('en-IN')}
                            </td>
                            <td className="py-2.5 px-3 whitespace-nowrap">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase inline-block ${
                                  b.status === 'PENDING_REVIEW'
                                    ? 'bg-[#FEF8E7] text-[#B48505] border border-[#F5BE19]/40'
                                    : b.status === 'CONFIRMED'
                                    ? 'bg-[#DCFCE7] text-[#15803D]'
                                    : b.status === 'ASSIGNED'
                                    ? 'bg-[#E0F2FE] text-[#0369A1]'
                                    : 'bg-slate-100 text-slate-700'
                                }`}
                              >
                                {b.status.replace('_', ' ')}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 text-right space-x-1.5 whitespace-nowrap">
                              {b.status === 'PENDING_REVIEW' && (
                                <button
                                  onClick={() => updateBookingStatus(b.id, 'CONFIRMED')}
                                  className="px-2 py-1 rounded bg-[#15803D] text-white font-bold text-[10px] hover:bg-[#166534]"
                                >
                                  Approve
                                </button>
                              )}
                              {b.status === 'CONFIRMED' && (
                                <button
                                  onClick={() => updateBookingStatus(b.id, 'ASSIGNED')}
                                  className="px-2 py-1 rounded bg-[#14263D] text-white font-bold text-[10px] hover:bg-slate-800"
                                >
                                  Assign Driver
                                </button>
                              )}
                              <a
                                href={`tel:${b.customerPhone.replace(/[^0-9+]/g, '')}`}
                                className="p-1 rounded bg-[#EAF1F7] text-[#14263D] inline-block hover:bg-[#CBD5E1]"
                                title="Call Customer"
                              >
                                <Phone className="w-3.5 h-3.5" />
                              </a>
                              <button
                                onClick={() => setInvoiceModalBooking(buildInvoiceData(b))}
                                className="p-1 rounded bg-[#EAF1F7] text-[#14263D] inline-block hover:bg-[#CBD5E1]"
                                title="View & Print Tax Invoice"
                              >
                                <FileText className="w-3.5 h-3.5 text-[#B48505]" />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: FLEET & TARIFFS */}
          {activeTab === 'FLEET' && (
            <div className="space-y-3 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display font-bold text-base text-[#14263D]">
                    Fleet Rates & Vehicle Availability
                  </h3>
                  <p className="text-xs text-[#62758F]">
                    Live base pricing per kilometer used in booking calculation engine
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {fleetList.map((car) => (
                  <div
                    key={car.id}
                    className="p-3.5 rounded-2xl bg-white border border-[#E2E8F0] shadow-card space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-[#B48505] uppercase tracking-wider">
                        {car.category}
                      </span>
                      <span
                        className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                          car.status === 'ACTIVE'
                            ? 'bg-[#DCFCE7] text-[#15803D]'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {car.status}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-display font-bold text-sm text-[#14263D]">{car.name}</h4>
                      <p className="text-[10px] text-[#62758F]">{car.models}</p>
                    </div>

                    {/* Rate Adjuster */}
                    <div className="p-2.5 rounded-xl bg-[#EAF1F7] border border-[#CBD5E1]/80 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[10px] text-[#62758F] block">Outstation Rate:</span>
                        <span className="font-extrabold text-base text-[#14263D]">
                          ₹{car.perKmRate} / km
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => updateFleetRate(car.id, -1)}
                          className="w-7 h-7 rounded-lg bg-white border border-[#CBD5E1] font-bold text-sm flex items-center justify-center hover:bg-slate-50"
                        >
                          -
                        </button>
                        <button
                          onClick={() => updateFleetRate(car.id, 1)}
                          className="w-7 h-7 rounded-lg bg-[#F5BE19] font-black text-sm flex items-center justify-center hover:bg-[#DFAC13] text-[#14263D]"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="text-[10px] text-[#62758F] flex items-center justify-between pt-1 border-t border-[#E2E8F0]">
                      <span>Extra Hour: ₹{car.extraHourRate}/hr</span>
                      <span>Night: ₹{car.nightCharges}/night</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: POPULAR ROUTES */}
          {activeTab === 'ROUTES' && (
            <div className="space-y-3 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display font-bold text-base text-[#14263D]">
                    Intercity Route Corridor Pricing
                  </h3>
                  <p className="text-xs text-[#62758F]">
                    Fixed flat tariffs for airport transfers, hill climbs, and highway trips
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {routeList.map((rt) => (
                  <div
                    key={rt.id}
                    className="p-3.5 rounded-2xl bg-white border border-[#E2E8F0] shadow-card space-y-2"
                  >
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-bold text-[#B48505] bg-[#FEF8E7] px-2 py-0.5 rounded border border-[#F5BE19]/40">
                        {rt.routeType}
                      </span>
                      <span className="text-[#62758F]">
                        {rt.distanceKm} km • {rt.approxDuration}
                      </span>
                    </div>

                    <div className="space-y-0.5">
                      <div className="font-bold text-xs text-[#14263D]">{rt.from}</div>
                      <div className="text-[11px] font-extrabold text-[#14263D]">→ {rt.to}</div>
                    </div>

                    <div className="p-2 rounded-xl bg-[#EAF1F7] flex items-center justify-between text-xs">
                      <span className="text-[10px] text-[#62758F]">Fixed Base:</span>
                      <span className="font-black text-sm text-[#14263D]">
                        ₹{rt.startingPrice.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: TOUR PACKAGES */}
          {activeTab === 'TOURS' && (
            <div className="space-y-3 animate-in fade-in duration-200">
              <div>
                <h3 className="font-display font-bold text-base text-[#14263D]">
                  Chardham & Uttarakhand Tour Packages
                </h3>
                <p className="text-xs text-[#62758F]">
                  Spiritual pilgrimage circuits, mountain halt packages, and taxi tariffs
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {toursList.map((pkg) => (
                  <div
                    key={pkg.id}
                    className="p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-card space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#B48505]">{pkg.duration}</span>
                      {pkg.badge && (
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#FEF8E7] border border-[#F5BE19]/40 text-[#B48505]">
                          {pkg.badge}
                        </span>
                      )}
                    </div>

                    <h4 className="font-display font-bold text-sm text-[#14263D]">{pkg.title}</h4>

                    <div className="flex flex-wrap gap-1">
                      {pkg.placesCovered.map((p, i) => (
                        <span
                          key={i}
                          className="text-[9px] px-1.5 py-0.5 rounded bg-[#F8F7F2] border border-[#E2E8F0] text-[#334155]"
                        >
                          {p}
                        </span>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-[#E2E8F0] flex items-center justify-between">
                      <span className="text-[10px] text-[#62758F]">Season: {pkg.season}</span>
                      <span className="font-display font-black text-base text-[#14263D]">
                        ₹{pkg.startingPrice.toLocaleString('en-IN')}{' '}
                        <span className="text-[10px] font-normal text-[#62758F]">/ person</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: CONTENT & SEO */}
          {activeTab === 'CONTENT' && (
            <div className="space-y-3 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display font-bold text-base text-[#14263D]">
                    CMS Travel Articles & SEO Content
                  </h3>
                  <p className="text-xs text-[#62758F]">
                    Manage published travel advice, airport transit guides, and pilgrimage rules
                  </p>
                </div>
              </div>

              <div className="bg-white border border-[#E2E8F0] rounded-2xl shadow-card overflow-hidden">
                <div className="divide-y divide-[#E2E8F0]">
                  {articlesList.map((art) => (
                    <div key={art.id} className="p-3.5 flex items-center justify-between gap-4">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs sm:text-sm text-[#14263D]">
                            {art.title}
                          </span>
                          <span
                            className={`text-[9px] font-bold px-2 py-0.2 rounded-full ${
                              art.status === 'PUBLISHED'
                                ? 'bg-[#DCFCE7] text-[#15803D]'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {art.status}
                          </span>
                        </div>
                        <div className="text-[10px] text-[#62758F]">
                          Slug: <span className="font-mono text-[#14263D]">/{art.slug}</span> •{' '}
                          {art.views.toLocaleString()} views • Updated {art.updatedAt}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => showToast(`Opening article ${art.slug} editor...`)}
                          className="px-2.5 py-1 rounded-lg bg-[#EAF1F7] hover:bg-[#CBD5E1] text-[#14263D] text-[11px] font-bold flex items-center gap-1"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>Edit</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {invoiceModalBooking && (
        <InvoiceModal
          isOpen={Boolean(invoiceModalBooking)}
          onClose={() => setInvoiceModalBooking(null)}
          booking={invoiceModalBooking}
        />
      )}
    </div>
  );
}
