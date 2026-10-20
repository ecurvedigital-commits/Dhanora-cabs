import {
  BookingStatus,
  isValidTransition,
  BOOKING_STATUS_TRANSITIONS,
  CreateBookingSchema,
  ServiceType,
} from '@dehradun/contracts';

describe('Booking Business Rules & State Machine (Unit)', () => {
  describe('Status Transition Validation (State Machine)', () => {
    it('should allow valid transitions from PENDING_REVIEW', () => {
      expect(isValidTransition(BookingStatus.PENDING_REVIEW, BookingStatus.CONFIRMED)).toBe(true);
      expect(isValidTransition(BookingStatus.PENDING_REVIEW, BookingStatus.REJECTED)).toBe(true);
      expect(isValidTransition(BookingStatus.PENDING_REVIEW, BookingStatus.CANCELLED)).toBe(true);
      expect(isValidTransition(BookingStatus.PENDING_REVIEW, BookingStatus.EXPIRED)).toBe(true);
    });

    it('should NOT allow direct jump from PENDING_REVIEW to IN_PROGRESS or COMPLETED', () => {
      expect(isValidTransition(BookingStatus.PENDING_REVIEW, BookingStatus.IN_PROGRESS)).toBe(false);
      expect(isValidTransition(BookingStatus.PENDING_REVIEW, BookingStatus.COMPLETED)).toBe(false);
    });

    it('should enforce COMPLETED and CANCELLED as terminal states', () => {
      expect(BOOKING_STATUS_TRANSITIONS[BookingStatus.COMPLETED]).toHaveLength(0);
      expect(BOOKING_STATUS_TRANSITIONS[BookingStatus.CANCELLED]).toHaveLength(0);
      expect(isValidTransition(BookingStatus.COMPLETED, BookingStatus.CANCELLED)).toBe(false);
      expect(isValidTransition(BookingStatus.CANCELLED, BookingStatus.CONFIRMED)).toBe(false);
    });
  });

  describe('CreateBookingSchema Validation', () => {
    it('should pass on valid booking request with future date', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      const validPayload = {
        customerName: 'Rahul Sharma',
        customerPhone: '+919876543210',
        customerEmail: 'rahul@example.com',
        serviceType: ServiceType.OUTSTATION,
        pickupLocation: 'Dehradun Railway Station',
        dropLocation: 'Mussoorie Library Chowk',
        scheduledAt: tomorrow.toISOString(),
        passengers: 3,
        notes: 'Luggage space needed',
      };

      const result = CreateBookingSchema.safeParse(validPayload);
      expect(result.success).toBe(true);
    });

    it('should fail if customer name is too short', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      const payload = {
        customerName: 'A',
        customerPhone: '+919876543210',
        serviceType: ServiceType.TAXI,
        pickupLocation: 'Rajpur Road',
        scheduledAt: tomorrow.toISOString(),
      };

      const result = CreateBookingSchema.safeParse(payload);
      expect(result.success).toBe(false);
    });

    it('should fail if scheduled date is in the past', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      const payload = {
        customerName: 'Aman Verma',
        customerPhone: '+919876543210',
        serviceType: ServiceType.TAXI,
        pickupLocation: 'Clock Tower',
        scheduledAt: yesterday.toISOString(),
      };

      const result = CreateBookingSchema.safeParse(payload);
      expect(result.success).toBe(false);
    });

    it('should fail if passenger count is 0 or exceeds 50', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      const payloadZero = {
        customerName: 'Aman Verma',
        customerPhone: '+919876543210',
        serviceType: ServiceType.TAXI,
        pickupLocation: 'Clock Tower',
        scheduledAt: tomorrow.toISOString(),
        passengers: 0,
      };

      const payloadTooMany = {
        ...payloadZero,
        passengers: 55,
      };

      expect(CreateBookingSchema.safeParse(payloadZero).success).toBe(false);
      expect(CreateBookingSchema.safeParse(payloadTooMany).success).toBe(false);
    });
  });
});
