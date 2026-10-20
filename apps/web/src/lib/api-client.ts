/**
 * Unified API Client for Dehradun Travel Platform
 * Handles communication between Next.js (Web & Admin CMS) and the NestJS REST API.
 */

/**
 * Dynamically resolves the API base URL at runtime.
 * Prioritizes Vercel internal service bindings (process.env.API_URL) when executing on the server,
 * and uses relative origin or NEXT_PUBLIC_API_URL in the browser to leverage Vercel rewrites.
 */
export function getApiBaseUrl(): string {
  // 1. Vercel internal service binding (resolved dynamically at runtime in server functions)
  if (typeof window === 'undefined') {
    if (process.env.API_URL) {
      return process.env.API_URL.replace(/\/$/, '');
    }
  }

  // 2. Explicit public API URL if configured
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, '');
  }

  // 3. Client-side in browser: relative path "" routes through top-level Vercel rewrites
  if (typeof window !== 'undefined') {
    return '';
  }

  // 4. Default fallback for local server development
  return 'http://localhost:3001';
}

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') || 'http://localhost:3001';

export interface ApiErrorResponse {
  statusCode: number;
  message: string | string[];
  error?: string;
}

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public details?: any,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
  token?: string | null,
): Promise<T> {
  const baseUrl = getApiBaseUrl();
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = baseUrl ? `${baseUrl}${cleanEndpoint}` : cleanEndpoint;
  const headers = new Headers(options.headers || {});

  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errMessage = `HTTP ${response.status}: ${response.statusText}`;
    let errDetails: any = null;
    try {
      const errJson = (await response.json()) as ApiErrorResponse;
      if (Array.isArray(errJson.message)) {
        errMessage = errJson.message.join(', ');
      } else if (errJson.message) {
        errMessage = errJson.message;
      }
      errDetails = errJson;
    } catch {
      // Body not JSON
    }
    throw new ApiError(response.status, errMessage, errDetails);
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return {} as T;
  }

  return response.json() as Promise<T>;
}

// ──────────────────────────────────────────────────────────
// Types for API entities
// ──────────────────────────────────────────────────────────

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  isSuperAdmin: boolean;
  roles: string[];
  permissions: string[];
}

export interface AuthLoginResponse {
  accessToken: string;
  user: UserProfile;
}

export interface CreateBookingPayload {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  serviceType: 'LOCAL_TAXI' | 'OUTSTATION' | 'TOUR_PACKAGE' | 'TREKKING' | 'SAFARI';
  vehicleCategoryId: string;
  pickupAddress: string;
  pickupLatitude?: number;
  pickupLongitude?: number;
  dropAddress?: string;
  dropLatitude?: number;
  dropLongitude?: number;
  scheduledStart: string; // ISO string
  passengerCount?: number;
  luggageCount?: number;
  specialInstructions?: string;
  idempotencyKey?: string;
}

export interface FareSnapshotDto {
  id?: string;
  baseFarePaise: number;
  distanceRatePaise: number;
  estimatedDistanceKm: number;
  tollEstimatePaise: number;
  parkingEstimatePaise: number;
  taxPercent: number;
  taxPaise: number;
  totalFarePaise: number;
  advanceRequiredPaise: number;
  currency: string;
}

export interface BookingResponse {
  id: string;
  bookingNumber: string;
  customerId: string;
  serviceType: string;
  status: 'PENDING_REVIEW' | 'CONFIRMED' | 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'REJECTED';
  pickupAddress: string;
  dropAddress?: string | null;
  scheduledStart: string;
  passengerCount: number;
  luggageCount: number;
  specialInstructions?: string | null;
  createdAt: string;
  updatedAt: string;
  customer?: {
    id: string;
    fullName: string;
    phone: string;
    email?: string;
  };
  fareSnapshot?: FareSnapshotDto;
  trips?: any[];
}

export interface TrackBookingResponse {
  id: string;
  bookingNumber: string;
  status: 'PENDING_REVIEW' | 'CONFIRMED' | 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'REJECTED';
  serviceType: string;
  pickupAddress: string;
  dropAddress?: string | null;
  scheduledStart: string;
  scheduledEnd?: string | null;
  passengerCount: number;
  luggageCount: number;
  specialInstructions?: string | null;
  createdAt: string;
  customer: {
    fullName: string;
    phone: string;
    email?: string | null;
  };
  fareSnapshot?: FareSnapshotDto | null;
  paymentSummary: {
    paymentStatus: 'UNPAID' | 'ADVANCE_PAID' | 'FULLY_PAID';
    totalPaidPaise: number;
    outstandingBalancePaise: number;
    advanceRequiredPaise: number;
    totalFarePaise: number;
  };
  assignedDriver?: {
    fullName: string;
    phone: string;
    rating: number;
  } | null;
  assignedVehicle?: {
    make: string;
    model: string;
    color: string;
    registrationNumber: string;
    categoryName: string;
  } | null;
  tripStatus?: string | null;
  invoice?: {
    invoiceNumber: string;
    status: string;
    totalAmountPaise: number;
    issueDate: string;
  } | null;
}

export interface VehicleCategoryDto {
  id: string;
  name: string;
  slug: string;
  seatingCapacity: number;
  luggageCapacity: number;
  airConditioned: boolean;
  description?: string;
  sortOrder: number;
}

export interface VehicleDto {
  id: string;
  categoryId: string;
  registrationNumber: string;
  make: string;
  model: string;
  year: number;
  color: string;
  isActive: boolean;
  isAvailable: boolean;
  category?: VehicleCategoryDto;
}

export interface TourPackageDto {
  id: string;
  categoryId: string;
  title: string;
  slug: string;
  durationDays: number;
  durationNights: number;
  startingPricePaise: number;
  maxAltitudeMeters?: number;
  isPublished: boolean;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
}

// ──────────────────────────────────────────────────────────
// API Client Object
// ──────────────────────────────────────────────────────────

export const apiClient = {
  /**
   * Health Check
   */
  async checkHealth(): Promise<{ status: string; uptime?: number; service?: string }> {
    try {
      return await request<{ status: string; uptime?: number; service?: string }>(
        '/api/v1/health',
        { method: 'GET', signal: AbortSignal.timeout(3000) },
      );
    } catch (err) {
      throw err;
    }
  },

  /**
   * Authentication
   */
  auth: {
    async login(email: string, passwordPlain: string): Promise<AuthLoginResponse> {
      return request<AuthLoginResponse>('/api/v1/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password: passwordPlain }),
      });
    },

    async getProfile(token: string): Promise<UserProfile> {
      return request<UserProfile>('/api/v1/auth/me', { method: 'GET' }, token);
    },
  },

  /**
   * Bookings (Public & Admin)
   */
  bookings: {
    async create(
      payload: CreateBookingPayload,
      idempotencyKey?: string,
    ): Promise<{
      booking: BookingResponse;
      fareSnapshot: FareSnapshotDto;
      customer: any;
      message: string;
    }> {
      const headers: Record<string, string> = {};
      if (idempotencyKey) {
        headers['idempotency-key'] = idempotencyKey;
      }
      return request<{
        booking: BookingResponse;
        fareSnapshot: FareSnapshotDto;
        customer: any;
        message: string;
      }>('/api/v1/bookings', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          ...payload,
          idempotencyKey: idempotencyKey || payload.idempotencyKey,
        }),
      });
    },

    async list(
      params: {
        skip?: number;
        take?: number;
        status?: string;
        serviceType?: string;
      } = {},
      token: string,
    ): Promise<{ total: number; items: BookingResponse[] }> {
      const query = new URLSearchParams();
      if (params.skip !== undefined) query.set('skip', String(params.skip));
      if (params.take !== undefined) query.set('take', String(params.take));
      if (params.status && params.status !== 'ALL') query.set('status', params.status);
      if (params.serviceType) query.set('serviceType', params.serviceType);

      const qs = query.toString();
      return request<{ total: number; items: BookingResponse[] }>(
        `/api/v1/bookings${qs ? `?${qs}` : ''}`,
        { method: 'GET' },
        token,
      );
    },

    async getById(id: string, token: string): Promise<BookingResponse> {
      return request<BookingResponse>(`/api/v1/bookings/${id}`, { method: 'GET' }, token);
    },

    async confirm(
      id: string,
      token: string,
      notes?: string,
    ): Promise<{ booking: BookingResponse; trip: any; message: string }> {
      return request<{ booking: BookingResponse; trip: any; message: string }>(
        `/api/v1/bookings/${id}/confirm`,
        {
          method: 'PATCH',
          body: JSON.stringify({ notes }),
        },
        token,
      );
    },

    async cancel(
      id: string,
      token: string,
      reason?: string,
    ): Promise<{ booking: BookingResponse; message: string }> {
      return request<{ booking: BookingResponse; message: string }>(
        `/api/v1/bookings/${id}/cancel`,
        {
          method: 'PATCH',
          body: JSON.stringify({ reason }),
        },
        token,
      );
    },

    async track(bookingNumber: string, phone: string): Promise<TrackBookingResponse> {
      const qs = new URLSearchParams({
        bookingNumber: bookingNumber.trim(),
        phone: phone.trim(),
      });
      return request<TrackBookingResponse>(`/api/v1/bookings/track?${qs.toString()}`, {
        method: 'GET',
      });
    },
  },

  /**
   * Fleet & Categories
   */
  fleet: {
    async getCategories(): Promise<VehicleCategoryDto[]> {
      return request<VehicleCategoryDto[]>('/api/v1/fleet/categories', { method: 'GET' });
    },

    async getVehicles(
      token: string,
      skip = 0,
      take = 20,
    ): Promise<{ total: number; items: VehicleDto[] }> {
      return request<{ total: number; items: VehicleDto[] }>(
        `/api/v1/fleet/vehicles?skip=${skip}&take=${take}`,
        { method: 'GET' },
        token,
      );
    },
  },

  /**
   * Tour Packages
   */
  packages: {
    async getPublic(categoryId?: string): Promise<TourPackageDto[]> {
      const qs = categoryId ? `?categoryId=${encodeURIComponent(categoryId)}` : '';
      return request<TourPackageDto[]>(`/api/v1/packages${qs}`, { method: 'GET' });
    },

    async getAdmin(
      token: string,
      skip = 0,
      take = 20,
    ): Promise<{ total: number; items: TourPackageDto[] }> {
      return request<{ total: number; items: TourPackageDto[] }>(
        `/api/v1/packages/admin?skip=${skip}&take=${take}`,
        { method: 'GET' },
        token,
      );
    },
  },

  /**
   * Analytics & Operational Reports
   */
  reports: {
    async getOverview(token?: string): Promise<DashboardOverviewDto> {
      return request<DashboardOverviewDto>('/api/v1/reports/overview', { method: 'GET' }, token);
    },
  },
};

export interface DashboardOverviewDto {
  revenue: {
    totalRevenuePaise: number;
    totalRevenueInr: number;
    capturedPaymentsCount: number;
    totalPaymentsAttempts: number;
    conversionRatePercent: number;
  };
  bookings: {
    byStatus: Record<string, number>;
    byServiceType: Record<string, number>;
    totalRequests: number;
    pendingReviewCount: number;
    confirmedCount: number;
    completedCount: number;
  };
  fleet: {
    totalVehicles: number;
    activeOnRoad: number;
    available: number;
    utilizationPercent: number;
  };
  drivers: {
    totalDrivers: number;
    availableDrivers: number;
    onTripDrivers: number;
  };
  revenueTrends: Array<{
    date: string;
    label: string;
    revenuePaise: number;
    revenueInr: number;
    count: number;
  }>;
  paymentMethods: {
    UPI: number;
    CARD: number;
    NETBANKING: number;
    CASH: number;
  };
  recentPayments: Array<{
    id: string;
    paymentNumber: string;
    amountInr: number;
    method: string;
    gateway: string;
    paidAt: string;
    bookingNumber?: string;
    customerName?: string;
    pickup?: string;
    drop?: string;
  }>;
}
