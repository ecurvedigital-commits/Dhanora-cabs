import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class DriversService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllDrivers(skip = 0, take = 20) {
    const [total, items] = await Promise.all([
      this.prisma.driver.count({ where: { deletedAt: null } }),
      this.prisma.driver.findMany({
        where: { deletedAt: null },
        skip,
        take,
        include: { user: { select: { email: true, fullName: true } } },
        orderBy: { createdAt: 'desc' },
      }),
    ]);
    return { total, items };
  }

  async getDriverById(id: string) {
    const driver = await this.prisma.driver.findUnique({
      where: { id },
      include: {
        user: { select: { email: true, fullName: true } },
        assignments: {
          include: { trip: true },
          orderBy: { assignedAt: 'desc' },
          take: 5,
        },
      },
    });
    if (!driver || driver.deletedAt) {
      throw new NotFoundException(`Driver with ID ${id} not found`);
    }
    return driver;
  }

  async createDriver(data: any) {
    return this.prisma.driver.create({
      data,
    });
  }

  async updateAvailability(id: string, isAvailable: boolean) {
    await this.getDriverById(id);
    return this.prisma.driver.update({
      where: { id },
      data: { isAvailable },
    });
  }
}
