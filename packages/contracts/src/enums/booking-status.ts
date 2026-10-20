/**
 * Booking Status Enum
 *
 * BUSINESS RULE: Every booking starts as PENDING_REVIEW.
 * Only an authorized admin can transition it to CONFIRMED or REJECTED.
 * There is NO automatic confirmation path.
 */
export enum BookingStatus {
  /** Initial state — awaiting manual admin review */
  PENDING_REVIEW = 'PENDING_REVIEW',

  /** Admin has verified and confirmed the booking agreement */
  CONFIRMED = 'CONFIRMED',

  /** Driver and/or vehicle allocated to booking */
  ASSIGNED = 'ASSIGNED',

  /** Trip is currently active on road / trek */
  IN_PROGRESS = 'IN_PROGRESS',

  /** Trip completed successfully */
  COMPLETED = 'COMPLETED',

  /** Admin or customer has cancelled */
  CANCELLED = 'CANCELLED',

  /** Booking inquiry lapsed without action */
  EXPIRED = 'EXPIRED',

  /** Admin explicitly rejected the booking request */
  REJECTED = 'REJECTED',
}

/**
 * Valid transitions from each status.
 * Enforces the business rule: no auto-confirm path exists.
 */
export const BOOKING_STATUS_TRANSITIONS: Record<BookingStatus, BookingStatus[]> = {
  [BookingStatus.PENDING_REVIEW]: [
    BookingStatus.CONFIRMED,
    BookingStatus.REJECTED,
    BookingStatus.CANCELLED,
    BookingStatus.EXPIRED,
  ],
  [BookingStatus.CONFIRMED]: [
    BookingStatus.ASSIGNED,
    BookingStatus.IN_PROGRESS,
    BookingStatus.CANCELLED,
  ],
  [BookingStatus.ASSIGNED]: [
    BookingStatus.IN_PROGRESS,
    BookingStatus.CANCELLED,
  ],
  [BookingStatus.IN_PROGRESS]: [
    BookingStatus.COMPLETED,
    BookingStatus.CANCELLED,
  ],
  [BookingStatus.COMPLETED]: [],
  [BookingStatus.CANCELLED]: [],
  [BookingStatus.EXPIRED]: [],
  [BookingStatus.REJECTED]: [],
};

export function isValidTransition(from: BookingStatus, to: BookingStatus): boolean {
  return BOOKING_STATUS_TRANSITIONS[from]?.includes(to) ?? false;
}
