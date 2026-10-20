/**
 * Unified Booking Event Dispatcher
 * Enables any section on the site (Popular Routes, Fleet Matrix, Tour Packages)
 * to smoothly select vehicle, routes, or packages in the main booking widget.
 */

export interface BookingSelectEventDetail {
  pickup?: string;
  drop?: string;
  tab?: 'OUTSTATION' | 'LOCAL_TAXI' | 'AIRPORT' | 'TOUR_PACKAGE';
  vehicleId?: string;
  packageName?: string;
  openModalDirectly?: boolean;
}

export function triggerBookingSelect(params: BookingSelectEventDetail) {
  if (typeof window === 'undefined') return;

  // 1. Dispatch custom event for HeroSection
  window.dispatchEvent(new CustomEvent('selectBookingPlan', { detail: params }));

  // 2. Smoothly scroll to the booking section
  const el = document.getElementById('booking');
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}
