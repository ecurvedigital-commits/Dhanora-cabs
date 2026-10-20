import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { AssignmentStatus } from '@dehradun/prisma';

@Injectable()
export class AvailabilityService {
  constructor(private readonly prisma: PrismaService) {}

  async checkVehicleAvailability(vehicleId: string): Promise<{ available: boolean; reason?: string }> {
    const vehicle = await this.prisma.vehicle.findUnique({
      where: { id: vehicleId },
      include: {
        assignments: {
          where: { status: AssignmentStatus.ACTIVE },
        },
      },
    });

    if (!vehicle || vehicle.deletedAt) {
      return { available: false, reason: 'Vehicle does not exist or has been deleted.' };
    }

    if (!vehicle.isActive || !vehicle.isAvailable) {
      return { available: false, reason: 'Vehicle is currently marked as unavailable or inactive.' };
    }

    const now = new Date();
    if (vehicle.fitnessExpiry < now) {
      return { available: false, reason: 'Vehicle fitness certificate has expired.' };
    }
    if (vehicle.insuranceExpiry < now) {
      return { available: false, reason: 'Vehicle insurance has expired.' };
    }
    if (vehicle.permitExpiry < now) {
      return { available: false, reason: 'Vehicle commercial permit has expired.' };
    }

    if (vehicle.assignments.length > 0) {
      return { available: false, reason: 'Vehicle is currently assigned to an active running trip.' };
    }

    return { available: true };
  }

  async checkDriverAvailability(driverId: string): Promise<{ available: boolean; reason?: string }> {
    const driver = await this.prisma.driver.findUnique({
      where: { id: driverId },
      include: {
        assignments: {
          where: { status: AssignmentStatus.ACTIVE },
        },
      },
    });

    if (!driver || driver.deletedAt) {
      return { available: false, reason: 'Driver does not exist or has been deleted.' };
    }

    if (!driver.isActive || !driver.isAvailable) {
      return { available: false, reason: 'Driver is marked unavailable or off-duty.' };
    }

    if (driver.licenseExpiry < new Date()) {
      return { available: false, reason: 'Driver commercial license has expired.' };
    }

    if (driver.assignments.length > 0) {
      return { available: false, reason: 'Driver is currently dispatched on an active running trip.' };
    }

    return { available: true };
  }
}
