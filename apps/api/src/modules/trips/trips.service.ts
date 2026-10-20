import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { AvailabilityService } from '../availability/availability.service';
import { ReferenceUtil } from '../../common/utils/reference.util';
import { AssignmentStatus, TripStatus, TripEventType, Prisma } from '@dehradun/prisma';

@Injectable()
export class TripsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly availabilityService: AvailabilityService,
  ) {}

  async findAll(skip = 0, take = 20) {
    const [total, items] = await Promise.all([
      this.prisma.trip.count(),
      this.prisma.trip.findMany({
        skip,
        take,
        include: {
          booking: {
            include: { customer: true, fareSnapshot: true },
          },
          vehicleAssignments: {
            where: { status: { in: [AssignmentStatus.ASSIGNED, AssignmentStatus.ACTIVE] } },
            include: { vehicle: true },
          },
          driverAssignments: {
            where: { status: { in: [AssignmentStatus.ASSIGNED, AssignmentStatus.ACTIVE] } },
            include: { driver: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
    ]);
    return { total, items };
  }

  async findById(id: string) {
    const trip = await this.prisma.trip.findUnique({
      where: { id },
      include: {
        booking: {
          include: { customer: true, fareSnapshot: true },
        },
        vehicleAssignments: {
          include: { vehicle: true },
          orderBy: { assignedAt: 'desc' },
        },
        driverAssignments: {
          include: { driver: true },
          orderBy: { assignedAt: 'desc' },
        },
        events: {
          orderBy: { recordedAt: 'asc' },
        },
        expenses: true,
      },
    });

    if (!trip) {
      throw new NotFoundException(`Trip with ID ${id} not found`);
    }

    return trip;
  }

  async assignVehicle(tripId: string, vehicleId: string, assignedById?: string) {
    const trip = await this.prisma.trip.findUnique({ where: { id: tripId } });
    if (!trip) {
      throw new NotFoundException(`Trip with ID ${tripId} not found`);
    }

    // Check availability
    const avail = await this.availabilityService.checkVehicleAvailability(vehicleId);
    if (!avail.available) {
      throw new ConflictException(`Vehicle assignment rejected: ${avail.reason}`);
    }

    try {
      return await this.prisma.$transaction(async (tx: any) => {
        // Concurrency protection: release any currently assigned vehicle for this trip
        await tx.vehicleAssignment.updateMany({
          where: { tripId, status: { in: [AssignmentStatus.ASSIGNED, AssignmentStatus.ACTIVE] } },
          data: { status: AssignmentStatus.RELEASED, unassignedAt: new Date(), unassignedById: assignedById },
        });

        const assignment = await tx.vehicleAssignment.create({
          data: {
            tripId,
            vehicleId,
            status: AssignmentStatus.ACTIVE,
            assignedById,
          },
          include: { vehicle: true },
        });

        return assignment;
      });
    } catch (err: any) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
        throw new ConflictException(
          'Vehicle assignment conflict: Vehicle was concurrently assigned to another active trip.',
        );
      }
      throw err;
    }
  }

  async assignDriver(tripId: string, driverId: string, assignedById?: string) {
    const trip = await this.prisma.trip.findUnique({ where: { id: tripId } });
    if (!trip) {
      throw new NotFoundException(`Trip with ID ${tripId} not found`);
    }

    // Check driver availability
    const avail = await this.availabilityService.checkDriverAvailability(driverId);
    if (!avail.available) {
      throw new ConflictException(`Driver assignment rejected: ${avail.reason}`);
    }

    try {
      return await this.prisma.$transaction(async (tx: any) => {
        // Concurrency protection: release any currently assigned driver for this trip
        await tx.driverAssignment.updateMany({
          where: { tripId, status: { in: [AssignmentStatus.ASSIGNED, AssignmentStatus.ACTIVE] } },
          data: { status: AssignmentStatus.RELEASED, unassignedAt: new Date(), unassignedById: assignedById },
        });

        const assignment = await tx.driverAssignment.create({
          data: {
            tripId,
            driverId,
            status: AssignmentStatus.ACTIVE,
            assignedById,
          },
          include: { driver: true },
        });

        return assignment;
      });
    } catch (err: any) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
        throw new ConflictException(
          'Driver assignment conflict: Driver was concurrently assigned to another active trip.',
        );
      }
      throw err;
    }
  }

  async recordEvent(tripId: string, data: { eventType: TripEventType; description?: string; recordedById?: string }) {
    await this.findById(tripId);
    return this.prisma.tripEvent.create({
      data: {
        tripId,
        eventType: data.eventType,
        description: data.description,
        recordedById: data.recordedById,
      },
    });
  }
}
