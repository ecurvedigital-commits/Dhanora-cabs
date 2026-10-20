import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { DepartureStatus, Prisma } from '@dehradun/prisma';

@Injectable()
export class PackagesService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllCategories() {
    return this.prisma.packageCategory.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });
  }

  async createCategory(data: {
    name: string;
    slug: string;
    description?: string;
    iconUrl?: string;
  }) {
    const existing = await this.prisma.packageCategory.findUnique({
      where: { slug: data.slug },
    });
    if (existing) {
      throw new ConflictException(`Category with slug '${data.slug}' already exists`);
    }

    return this.prisma.packageCategory.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        iconUrl: data.iconUrl,
        isActive: true,
      },
    });
  }

  async updateCategory(
    id: string,
    data: {
      name?: string;
      slug?: string;
      description?: string;
      iconUrl?: string;
      isActive?: boolean;
    },
  ) {
    const category = await this.prisma.packageCategory.findUnique({ where: { id } });
    if (!category) {
      throw new NotFoundException(`Package category with ID ${id} not found`);
    }

    if (data.slug && data.slug !== category.slug) {
      const existing = await this.prisma.packageCategory.findUnique({
        where: { slug: data.slug },
      });
      if (existing && existing.id !== id) {
        throw new ConflictException(`Category with slug '${data.slug}' already exists`);
      }
    }

    return this.prisma.packageCategory.update({
      where: { id },
      data,
    });
  }

  async getAllPackages(categoryId?: string, isPublished = true) {
    return this.prisma.tourPackage.findMany({
      where: {
        ...(categoryId ? { categoryId } : {}),
        ...(isPublished !== undefined ? { isPublished } : {}),
        deletedAt: null,
      },
      include: {
        category: true,
        itineraryDays: { orderBy: { dayNumber: 'asc' } },
        departures: {
          where: { departureDate: { gte: new Date() } },
          orderBy: { departureDate: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getAllPackagesAdmin(
    skip = 0,
    take = 20,
    categoryId?: string,
    isPublished?: boolean,
  ) {
    const where: Prisma.TourPackageWhereInput = {
      deletedAt: null,
      ...(categoryId ? { categoryId } : {}),
      ...(isPublished !== undefined ? { isPublished } : {}),
    };

    const [total, items] = await Promise.all([
      this.prisma.tourPackage.count({ where }),
      this.prisma.tourPackage.findMany({
        where,
        skip,
        take,
        include: {
          category: true,
          departures: { orderBy: { departureDate: 'asc' } },
          itineraryDays: { orderBy: { dayNumber: 'asc' } },
        },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return { total, items };
  }

  async getPackageById(id: string) {
    const pkg = await this.prisma.tourPackage.findUnique({
      where: { id },
      include: {
        category: true,
        itineraryDays: { orderBy: { dayNumber: 'asc' } },
        departures: { orderBy: { departureDate: 'asc' } },
      },
    });

    if (!pkg || pkg.deletedAt) {
      throw new NotFoundException(`Tour package with ID ${id} not found`);
    }

    return pkg;
  }

  async getPackageBySlug(slug: string) {
    const pkg = await this.prisma.tourPackage.findUnique({
      where: { slug },
      include: {
        category: true,
        itineraryDays: { orderBy: { dayNumber: 'asc' } },
        departures: {
          where: { departureDate: { gte: new Date() } },
          orderBy: { departureDate: 'asc' },
        },
      },
    });

    if (!pkg || pkg.deletedAt) {
      throw new NotFoundException(`Tour package with slug '${slug}' not found`);
    }

    return pkg;
  }

  async createPackage(data: {
    categoryId: string;
    title: string;
    slug: string;
    subtitle?: string;
    summary: string;
    description: string;
    durationDays: number;
    durationNights: number;
    pickupLocation: string;
    dropLocation: string;
    difficultyLevel?: string;
    season?: string;
    basePricePaise: number;
    maxGroupSize?: number;
    inclusions?: string[];
    exclusions?: string[];
    termsAndConditions?: string;
    isPublished?: boolean;
    itineraryDays?: Array<{
      dayNumber: number;
      title: string;
      description: string;
      accommodation?: string;
      mealsIncluded?: string[];
      activities?: string[];
    }>;
  }) {
    const existing = await this.prisma.tourPackage.findUnique({
      where: { slug: data.slug },
    });
    if (existing && !existing.deletedAt) {
      throw new ConflictException(`Tour package with slug '${data.slug}' already exists`);
    }

    const { itineraryDays, ...packageData } = data;

    return this.prisma.tourPackage.create({
      data: {
        ...packageData,
        inclusions: data.inclusions || [],
        exclusions: data.exclusions || [],
        itineraryDays: itineraryDays
          ? {
              create: itineraryDays.map((d) => ({
                dayNumber: d.dayNumber,
                title: d.title,
                description: d.description,
                accommodation: d.accommodation,
                mealsIncluded: d.mealsIncluded || [],
                activities: d.activities || [],
                sortOrder: d.dayNumber,
              })),
            }
          : undefined,
      },
      include: {
        category: true,
        itineraryDays: { orderBy: { dayNumber: 'asc' } },
      },
    });
  }

  async updatePackage(
    id: string,
    data: Prisma.TourPackageUpdateInput,
  ) {
    await this.getPackageById(id);
    return this.prisma.tourPackage.update({
      where: { id },
      data,
      include: {
        category: true,
        itineraryDays: { orderBy: { dayNumber: 'asc' } },
        departures: true,
      },
    });
  }

  async deletePackage(id: string) {
    await this.getPackageById(id);
    return this.prisma.tourPackage.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        isPublished: false,
      },
    });
  }

  async createDeparture(
    packageId: string,
    data: {
      departureDate: string | Date;
      returnDate: string | Date;
      maxSeats: number;
      pricePerPersonPaise: number;
    },
  ) {
    await this.getPackageById(packageId);

    return this.prisma.packageDeparture.create({
      data: {
        packageId,
        departureDate: new Date(data.departureDate),
        returnDate: new Date(data.returnDate),
        maxSeats: data.maxSeats,
        availableSeats: data.maxSeats,
        pricePerPersonPaise: data.pricePerPersonPaise,
        status: DepartureStatus.SCHEDULED,
      },
    });
  }

  async updateDeparture(
    departureId: string,
    data: {
      maxSeats?: number;
      availableSeats?: number;
      pricePerPersonPaise?: number;
      status?: DepartureStatus;
    },
  ) {
    const departure = await this.prisma.packageDeparture.findUnique({
      where: { id: departureId },
    });
    if (!departure) {
      throw new NotFoundException(`Package departure with ID ${departureId} not found`);
    }

    return this.prisma.packageDeparture.update({
      where: { id: departureId },
      data,
    });
  }
}
