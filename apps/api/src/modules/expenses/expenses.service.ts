import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { ExpenseType } from '@dehradun/prisma';

@Injectable()
export class ExpensesService {
  constructor(private readonly prisma: PrismaService) {}

  async recordTripExpense(data: {
    tripId: string;
    expenseType: ExpenseType;
    amountPaise: number;
    description?: string;
    receiptUrl?: string;
    recordedById?: string;
  }) {
    const trip = await this.prisma.trip.findUnique({ where: { id: data.tripId } });
    if (!trip) {
      throw new NotFoundException(`Trip with ID ${data.tripId} not found`);
    }

    return this.prisma.tripExpense.create({
      data: {
        tripId: data.tripId,
        expenseType: data.expenseType,
        amountPaise: data.amountPaise,
        description: data.description,
        receiptUrl: data.receiptUrl,
        recordedById: data.recordedById,
      },
    });
  }

  async getExpensesByTrip(tripId: string) {
    return this.prisma.tripExpense.findMany({
      where: { tripId },
      orderBy: { incurredAt: 'desc' },
    });
  }
}
