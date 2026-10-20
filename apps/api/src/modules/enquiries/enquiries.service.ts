import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { EnquiryStatus, ServiceType } from '@dehradun/prisma';

export interface CreateEnquiryInput {
  name: string;
  phone: string;
  email?: string;
  serviceType?: ServiceType;
  travelDate?: Date;
  pickupLocation?: string;
  destination?: string;
  message: string;
}

@Injectable()
export class EnquiriesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(input: CreateEnquiryInput) {
    return this.prisma.enquiry.create({
      data: {
        name: input.name,
        phone: input.phone,
        email: input.email,
        serviceType: input.serviceType,
        travelDate: input.travelDate ? new Date(input.travelDate) : null,
        pickupLocation: input.pickupLocation,
        destination: input.destination,
        message: input.message,
        status: EnquiryStatus.NEW,
      },
    });
  }

  async findAll(skip = 0, take = 20, status?: EnquiryStatus) {
    const where = status ? { status } : {};
    const [total, items] = await Promise.all([
      this.prisma.enquiry.count({ where }),
      this.prisma.enquiry.findMany({
        where,
        skip,
        take,
        include: {
          customer: true,
          assignedTo: { select: { fullName: true, email: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
    ]);
    return { total, items };
  }

  async findById(id: string) {
    const enquiry = await this.prisma.enquiry.findUnique({
      where: { id },
      include: {
        customer: true,
        assignedTo: { select: { fullName: true, email: true } },
      },
    });

    if (!enquiry) {
      throw new NotFoundException(`Enquiry with ID ${id} not found`);
    }

    return enquiry;
  }

  async updateStatus(id: string, status: EnquiryStatus, assignedToId?: string) {
    await this.findById(id);

    return this.prisma.enquiry.update({
      where: { id },
      data: {
        status,
        ...(assignedToId ? { assignedToId } : {}),
      },
      include: {
        customer: true,
        assignedTo: { select: { fullName: true, email: true } },
      },
    });
  }
}
