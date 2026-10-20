import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class CustomersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(skip = 0, take = 20) {
    const [total, items] = await Promise.all([
      this.prisma.customer.count({ where: { deletedAt: null } }),
      this.prisma.customer.findMany({
        where: { deletedAt: null },
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    // Convert BigInt lifetimeSpendPaise to number/string for JSON serialization
    const sanitizedItems = items.map((c: any) => ({
      ...c,
      lifetimeSpendPaise: Number(c.lifetimeSpendPaise),
    }));

    return { total, items: sanitizedItems };
  }

  async findById(id: string) {
    const customer = await this.prisma.customer.findUnique({
      where: { id },
      include: {
        customerNotes: {
          include: {
            author: { select: { id: true, fullName: true, email: true } },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!customer || customer.deletedAt) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }

    return {
      ...customer,
      lifetimeSpendPaise: Number(customer.lifetimeSpendPaise),
    };
  }

  async findOrCreateByPhone(data: { phone: string; fullName: string; email?: string }) {
    return this.prisma.customer.upsert({
      where: { phone: data.phone },
      update: {
        fullName: data.fullName,
        ...(data.email ? { email: data.email } : {}),
      },
      create: {
        phone: data.phone,
        fullName: data.fullName,
        email: data.email,
      },
    });
  }

  async updateCustomer(
    id: string,
    data: {
      fullName?: string;
      email?: string;
      address?: string;
      preferencesJson?: any;
      emergencyContactName?: string;
      emergencyContactPhone?: string;
    },
  ) {
    await this.findById(id);

    const updated = await this.prisma.customer.update({
      where: { id },
      data,
    });

    return {
      ...updated,
      lifetimeSpendPaise: Number(updated.lifetimeSpendPaise),
    };
  }

  async addNote(customerId: string, authorId: string, note: string, isPinned = false) {
    await this.findById(customerId);
    return this.prisma.customerNote.create({
      data: {
        customerId,
        authorId,
        note,
        isPinned,
      },
    });
  }
}
