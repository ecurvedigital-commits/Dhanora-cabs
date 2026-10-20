import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class FleetService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllCategories() {
    return this.prisma.vehicleCategory.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async getAllVehicles(skip = 0, take = 20) {
    const [total, items] = await Promise.all([
      this.prisma.vehicle.count({ where: { deletedAt: null } }),
      this.prisma.vehicle.findMany({
        where: { deletedAt: null },
        skip,
        take,
        include: { category: true },
        orderBy: { createdAt: 'desc' },
      }),
    ]);
    return { total, items };
  }

  async getVehicleById(id: string) {
    const vehicle = await this.prisma.vehicle.findUnique({
      where: { id },
      include: {
        category: true,
        assignments: {
          include: { trip: true },
          orderBy: { assignedAt: 'desc' },
          take: 5,
        },
      },
    });
    if (!vehicle || vehicle.deletedAt) {
      throw new NotFoundException(`Vehicle with ID ${id} not found`);
    }
    return vehicle;
  }

  async createVehicle(data: any) {
    return this.prisma.vehicle.create({
      data,
      include: { category: true },
    });
  }
}
