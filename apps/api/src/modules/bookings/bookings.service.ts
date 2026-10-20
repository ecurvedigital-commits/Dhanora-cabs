import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  Optional,
} from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CustomersService } from '../customers/customers.service';
import { PricingService } from '../pricing/pricing.service';
import { NotificationsService } from '../notifications/notifications.service';
import { ReferenceUtil } from '../../common/utils/reference.util';
import { CreateBookingDto } from './dto/create-booking.dto';
import { BookingStatus, ServiceType, TripStatus, Prisma } from '@dehradun/prisma';

@Injectable()
export class BookingsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly customersService: CustomersService,
    private readonly pricingService: PricingService,
    @Optional() private readonly notificationsService?: NotificationsService,
  ) {}

  async createBookingRequest(dto: CreateBookingDto, headerIdempotencyKey?: string) {
    const idempotencyKey = dto.idempotencyKey || headerIdempotencyKey;

    // Check Idempotency Key if provided
    if (idempotencyKey) {
      const existingKey = await this.prisma.idempotencyKey.findUnique({
        where: { key: idempotencyKey },
      });

      if (existingKey && existingKey.responseBodyJson) {
        return JSON.parse(existingKey.responseBodyJson);
      }
    }

    // Validate scheduled date is in the future
    if (new Date(dto.scheduledStart).getTime() <= Date.now()) {
      throw new BadRequestException('Scheduled travel time must be in the future.');
    }

    // Validate vehicle category exists (by UUID or slug)
    let category = await this.prisma.vehicleCategory
      .findUnique({
        where: { id: dto.vehicleCategoryId },
      })
      .catch(() => null);

    if (!category) {
      category = await this.prisma.vehicleCategory
        .findUnique({
          where: { slug: dto.vehicleCategoryId.toLowerCase() },
        })
        .catch(() => null);
    }

    if (!category && this.prisma.vehicleCategory.findFirst) {
      category = await this.prisma.vehicleCategory.findFirst({
        where: { isActive: true },
        orderBy: { sortOrder: 'asc' },
      });
    }

    if (!category) {
      throw new NotFoundException(`Vehicle category with ID or slug '${dto.vehicleCategoryId}' not found.`);
    }

    // Find or create customer
    const customer = await this.customersService.findOrCreateByPhone({
      phone: dto.customerPhone,
      fullName: dto.customerName,
      email: dto.customerEmail,
    });

    // Calculate indicative fare breakdown
    const indicativeFare = await this.pricingService.calculateIndicativeFare({
      serviceType: dto.serviceType,
      categoryId: dto.vehicleCategoryId,
    });

    const bookingNumber = ReferenceUtil.generateBookingNumber();

    // Execute atomic transaction
    const result = await this.prisma.$transaction(async (tx) => {
      // 1. Create booking strictly as PENDING_REVIEW
      const booking = await tx.booking.create({
        data: {
          bookingNumber,
          customerId: customer.id,
          serviceType: dto.serviceType,
          status: BookingStatus.PENDING_REVIEW, // CRITICAL: NEVER AUTO-CONFIRMED
          pickupAddress: dto.pickupAddress,
          pickupLatitude: dto.pickupLatitude ? new Prisma.Decimal(dto.pickupLatitude) : null,
          pickupLongitude: dto.pickupLongitude ? new Prisma.Decimal(dto.pickupLongitude) : null,
          dropAddress: dto.dropAddress,
          dropLatitude: dto.dropLatitude ? new Prisma.Decimal(dto.dropLatitude) : null,
          dropLongitude: dto.dropLongitude ? new Prisma.Decimal(dto.dropLongitude) : null,
          scheduledStart: new Date(dto.scheduledStart),
          passengerCount: dto.passengerCount,
          luggageCount: dto.luggageCount,
          specialInstructions: dto.specialInstructions,
        },
      });

      // 2. Record immutable fare snapshot
      const fareSnapshot = await tx.fareSnapshot.create({
        data: {
          bookingId: booking.id,
          baseFarePaise: indicativeFare.baseFarePaise,
          distanceRatePaise: indicativeFare.distanceRatePaise,
          estimatedDistanceKm: new Prisma.Decimal(indicativeFare.estimatedDistanceKm),
          durationHours: new Prisma.Decimal(indicativeFare.durationHours),
          perHourRatePaise: indicativeFare.perHourRatePaise,
          tollEstimatePaise: indicativeFare.tollEstimatePaise,
          parkingEstimatePaise: indicativeFare.parkingEstimatePaise,
          taxPercent: new Prisma.Decimal(indicativeFare.taxPercent),
          taxPaise: indicativeFare.taxPaise,
          totalFarePaise: indicativeFare.totalFarePaise,
          advanceRequiredPaise: indicativeFare.advanceRequiredPaise,
          currency: indicativeFare.currency,
          pricingRulesSnapshotJson: indicativeFare.pricingRulesSnapshotJson,
        },
      });

      // 3. Record initial status history
      await tx.bookingStatusHistory.create({
        data: {
          bookingId: booking.id,
          fromStatus: BookingStatus.PENDING_REVIEW,
          toStatus: BookingStatus.PENDING_REVIEW,
          changeReason: 'Public booking request submitted online. Awaiting admin manual confirmation.',
        },
      });

      return { booking, fareSnapshot };
    });

    // Save to IdempotencyKey table if key was supplied
    if (idempotencyKey) {
      await this.prisma.idempotencyKey.upsert({
        where: { key: idempotencyKey },
        update: {
          responseStatusCode: 201,
          responseBodyJson: JSON.stringify(result),
          completedAt: new Date(),
        },
        create: {
          key: idempotencyKey,
          targetEndpoint: '/api/v1/bookings',
          requestHash: 'hash-booking-create',
          responseStatusCode: 201,
          responseBodyJson: JSON.stringify(result),
          lockedUntil: new Date(Date.now() + 86400000),
          completedAt: new Date(),
        },
      });
    }

    // Dispatch async customer notification alert
    this.notificationsService?.sendBookingReceivedAlert(
      dto.customerPhone,
      bookingNumber,
      dto.pickupAddress,
      dto.dropAddress || 'Destination',
    ).catch(() => {});

    return result;
  }

  async confirmBooking(bookingId: string, adminUserId: string, notes?: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: { fareSnapshot: true, customer: true },
    });

    if (!booking) {
      throw new NotFoundException(`Booking with ID ${bookingId} not found.`);
    }

    if (booking.status !== BookingStatus.PENDING_REVIEW) {
      throw new BadRequestException(
        `Cannot confirm booking in state '${booking.status}'. Only PENDING_REVIEW bookings can be confirmed.`,
      );
    }

    return this.prisma.$transaction(async (tx) => {
      // 1. Update Booking status to CONFIRMED
      const updatedBooking = await tx.booking.update({
        where: { id: bookingId },
        data: {
          status: BookingStatus.CONFIRMED,
        },
      });

      // 2. Lock confirmed details in FareSnapshot
      if (booking.fareSnapshot) {
        await tx.fareSnapshot.update({
          where: { bookingId },
          data: {
            confirmedAt: new Date(),
            confirmedById: adminUserId,
          },
        });
      }

      // 3. Record status history audit
      await tx.bookingStatusHistory.create({
        data: {
          bookingId,
          fromStatus: BookingStatus.PENDING_REVIEW,
          toStatus: BookingStatus.CONFIRMED,
          changedById: adminUserId,
          changeReason: notes || 'Admin manually reviewed and confirmed booking request.',
        },
      });

      // 4. Create Scheduled Trip execution record
      const tripNumber = ReferenceUtil.generateTripNumber();
      const trip = await tx.trip.create({
        data: {
          bookingId,
          tripNumber,
          status: TripStatus.SCHEDULED,
          startLocation: booking.pickupAddress,
          endLocation: booking.dropAddress,
        },
      });

      // 5. Dispatch async customer confirmation alert
      if (booking.customer?.phone) {
        const fareRupees = Math.round((booking.fareSnapshot?.totalFarePaise ?? 0) / 100);
        const route = `${booking.pickupAddress} to ${booking.dropAddress || 'Destination'}`;
        const travelDate = new Date(booking.scheduledStart).toLocaleDateString('en-IN');
        this.notificationsService?.sendBookingConfirmedAlert(
          booking.customer.phone,
          booking.bookingNumber,
          route,
          travelDate,
          fareRupees,
        ).catch(() => {});
      }

      return { booking: updatedBooking, trip };
    });
  }

  async cancelBooking(bookingId: string, cancelledById?: string, reason?: string) {
    const booking = await this.prisma.booking.findUnique({ where: { id: bookingId } });
    if (!booking) {
      throw new NotFoundException(`Booking with ID ${bookingId} not found.`);
    }

    if (booking.status === BookingStatus.COMPLETED || booking.status === BookingStatus.CANCELLED) {
      throw new BadRequestException(`Cannot cancel booking in '${booking.status}' status.`);
    }

    return this.prisma.$transaction(async (tx) => {
      const updatedBooking = await tx.booking.update({
        where: { id: bookingId },
        data: {
          status: BookingStatus.CANCELLED,
          cancellationReason: reason || 'Cancelled by admin or customer',
          cancelledAt: new Date(),
          cancelledById,
        },
      });

      await tx.bookingStatusHistory.create({
        data: {
          bookingId,
          fromStatus: booking.status,
          toStatus: BookingStatus.CANCELLED,
          changedById: cancelledById,
          changeReason: reason || 'Booking cancelled',
        },
      });

      return updatedBooking;
    });
  }

  async findAll(skip = 0, take = 20, status?: BookingStatus, serviceType?: ServiceType) {
    const where: Prisma.BookingWhereInput = {
      ...(status ? { status } : {}),
      ...(serviceType ? { serviceType } : {}),
    };

    const [total, items] = await Promise.all([
      this.prisma.booking.count({ where }),
      this.prisma.booking.findMany({
        where,
        skip,
        take,
        include: {
          customer: true,
          fareSnapshot: true,
          trip: {
            include: {
              vehicleAssignments: { include: { vehicle: true } },
              driverAssignments: { include: { driver: true } },
            },
          },
          payments: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return { total, items };
  }

  async findById(id: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: {
        customer: true,
        fareSnapshot: true,
        trip: {
          include: {
            vehicleAssignments: { include: { vehicle: true } },
            driverAssignments: { include: { driver: true } },
            events: true,
          },
        },
        statusHistory: {
          include: { changedBy: { select: { fullName: true, email: true } } },
          orderBy: { createdAt: 'desc' },
        },
        payments: true,
        invoices: true,
        refunds: true,
        financialCorrections: true,
      },
    });

    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found.`);
    }

    return booking;
  }

  async trackBooking(bookingNumber: string, phone: string) {
    const cleanQueryPhone = (phone || '').replace(/\D/g, '').slice(-10);
    if (!cleanQueryPhone || cleanQueryPhone.length < 10) {
      throw new BadRequestException('Please provide a valid 10-digit mobile number.');
    }

    const trimmedRef = (bookingNumber || '').trim();
    if (!trimmedRef) {
      throw new BadRequestException('Please provide a valid booking reference number.');
    }

    const booking = await this.prisma.booking.findFirst({
      where: {
        OR: [
          { bookingNumber: { equals: trimmedRef, mode: 'insensitive' } },
          { id: trimmedRef },
        ],
      },
      include: {
        customer: true,
        fareSnapshot: true,
        trip: {
          include: {
            vehicleAssignments: {
              where: { unassignedAt: null },
              include: {
                vehicle: {
                  include: { category: true },
                },
              },
            },
            driverAssignments: {
              where: { unassignedAt: null },
              include: { driver: true },
            },
          },
        },
        payments: {
          where: {
            status: { in: ['CAPTURED', 'PARTIALLY_REFUNDED'] },
          },
        },
        invoices: true,
      },
    });

    if (!booking) {
      throw new NotFoundException(
        `No booking found with reference '${trimmedRef}'. Please check your booking number.`,
      );
    }

    const cleanCustomerPhone = (booking.customer?.phone || '').replace(/\D/g, '').slice(-10);
    if (cleanCustomerPhone !== cleanQueryPhone) {
      throw new NotFoundException(
        'The mobile number provided does not match the passenger record for this booking.',
      );
    }

    const activeDriverAssignment = booking.trip?.driverAssignments?.[0];
    const activeVehicleAssignment = booking.trip?.vehicleAssignments?.[0];

    const totalPaidPaise = (booking.payments || []).reduce((sum, p) => sum + p.amountPaise, 0);
    const totalFarePaise = booking.fareSnapshot?.totalFarePaise ?? 0;
    const advanceRequiredPaise = booking.fareSnapshot?.advanceRequiredPaise ?? 0;
    const outstandingBalancePaise = Math.max(0, totalFarePaise - totalPaidPaise);

    let paymentStatus: 'UNPAID' | 'ADVANCE_PAID' | 'FULLY_PAID' = 'UNPAID';
    if (totalPaidPaise >= totalFarePaise && totalFarePaise > 0) {
      paymentStatus = 'FULLY_PAID';
    } else if (totalPaidPaise >= advanceRequiredPaise && advanceRequiredPaise > 0) {
      paymentStatus = 'ADVANCE_PAID';
    }

    return {
      id: booking.id,
      bookingNumber: booking.bookingNumber,
      status: booking.status,
      serviceType: booking.serviceType,
      pickupAddress: booking.pickupAddress,
      dropAddress: booking.dropAddress,
      scheduledStart: booking.scheduledStart,
      scheduledEnd: booking.scheduledEnd,
      passengerCount: booking.passengerCount,
      luggageCount: booking.luggageCount,
      specialInstructions: booking.specialInstructions,
      createdAt: booking.createdAt,
      customer: {
        fullName: booking.customer.fullName,
        phone: booking.customer.phone,
        email: booking.customer.email,
      },
      fareSnapshot: booking.fareSnapshot
        ? {
            baseFarePaise: booking.fareSnapshot.baseFarePaise,
            distanceRatePaise: booking.fareSnapshot.distanceRatePaise,
            estimatedDistanceKm: booking.fareSnapshot.estimatedDistanceKm,
            tollEstimatePaise: booking.fareSnapshot.tollEstimatePaise,
            parkingEstimatePaise: booking.fareSnapshot.parkingEstimatePaise,
            taxPercent: booking.fareSnapshot.taxPercent,
            taxPaise: booking.fareSnapshot.taxPaise,
            totalFarePaise: booking.fareSnapshot.totalFarePaise,
            advanceRequiredPaise: booking.fareSnapshot.advanceRequiredPaise,
            currency: booking.fareSnapshot.currency,
          }
        : null,
      paymentSummary: {
        paymentStatus,
        totalPaidPaise,
        outstandingBalancePaise,
        advanceRequiredPaise,
        totalFarePaise,
      },
      assignedDriver: activeDriverAssignment?.driver
        ? {
            fullName: activeDriverAssignment.driver.fullName,
            phone: activeDriverAssignment.driver.phone,
            rating: activeDriverAssignment.driver.rating
              ? Number(activeDriverAssignment.driver.rating)
              : 4.9,
          }
        : null,
      assignedVehicle: activeVehicleAssignment?.vehicle
        ? {
            make: activeVehicleAssignment.vehicle.make,
            model: activeVehicleAssignment.vehicle.model,
            color: activeVehicleAssignment.vehicle.color,
            registrationNumber: activeVehicleAssignment.vehicle.registrationNumber,
            categoryName: activeVehicleAssignment.vehicle.category?.name || 'Cab',
          }
        : null,
      tripStatus: booking.trip?.status || null,
      invoice: booking.invoices?.[0]
        ? {
            invoiceNumber: booking.invoices[0].invoiceNumber,
            status: booking.invoices[0].status,
            totalAmountPaise: booking.invoices[0].totalAmountPaise,
            issueDate: booking.invoices[0].invoiceDate,
          }
        : null,
    };
  }
}
