import { z } from 'zod';
import { BookingStatus } from '../enums/booking-status';
import { ServiceType } from '../enums/service-type';
import { PaymentStatus, PaymentMethod } from '../enums/payment-status';

/**
 * Schema for creating a new booking request.
 * Note: status is NOT accepted from the client.
 * All bookings start as PENDING_REVIEW (server-enforced).
 */
export const CreateBookingSchema = z.object({
  customerName: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be at most 100 characters'),
  customerPhone: z
    .string()
    .regex(/^\+?[1-9]\d{9,14}$/, 'Invalid phone number format'),
  customerEmail: z.string().email('Invalid email address').optional(),
  serviceType: z.nativeEnum(ServiceType),
  pickupLocation: z.string().min(1, 'Pickup location is required'),
  dropLocation: z.string().optional(),
  scheduledAt: z.coerce.date().refine((date) => date > new Date(), {
    message: 'Scheduled date must be in the future',
  }),
  passengers: z.number().int().min(1).max(50).default(1),
  notes: z.string().max(500).optional(),
});

export type CreateBookingInput = z.infer<typeof CreateBookingSchema>;

/**
 * Schema for the full booking object (API response).
 */
export const BookingSchema = z.object({
  id: z.string().uuid(),
  bookingNumber: z.string(),
  customerId: z.string().uuid(),
  serviceType: z.nativeEnum(ServiceType),
  pickupAddress: z.string(),
  dropAddress: z.string().nullable(),
  scheduledStart: z.coerce.date(),
  scheduledEnd: z.coerce.date().nullable(),
  passengerCount: z.number().int(),
  luggageCount: z.number().int(),
  status: z.nativeEnum(BookingStatus),
  specialInstructions: z.string().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type Booking = z.infer<typeof BookingSchema>;

/**
 * FareSnapshot schema representing the immutable price agreement.
 */
export const FareSnapshotSchema = z.object({
  id: z.string().uuid(),
  bookingId: z.string().uuid(),
  baseFarePaise: z.number().int(),
  distanceRatePaise: z.number().int(),
  estimatedDistanceKm: z.number(),
  tollEstimatePaise: z.number().int(),
  parkingEstimatePaise: z.number().int(),
  taxPercent: z.number(),
  taxPaise: z.number().int(),
  totalFarePaise: z.number().int(),
  advanceRequiredPaise: z.number().int(),
  currency: z.string().default('INR'),
  pricingRulesSnapshotJson: z.record(z.unknown()),
  confirmedAt: z.coerce.date().nullable(),
  confirmedById: z.string().uuid().nullable(),
});

export type FareSnapshot = z.infer<typeof FareSnapshotSchema>;

/**
 * Health check response schema.
 */
export const HealthResponseSchema = z.object({
  status: z.enum(['ok', 'degraded', 'error']),
  timestamp: z.string(),
  service: z.string(),
  version: z.string(),
  uptime: z.number(),
});

export type HealthResponse = z.infer<typeof HealthResponseSchema>;
