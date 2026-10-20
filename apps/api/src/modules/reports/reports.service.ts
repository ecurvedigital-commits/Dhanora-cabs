import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { PaymentStatus, AssignmentStatus } from '@dehradun/prisma';

@Injectable()
export class ReportsService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboardOverview() {
    const [
      bookingsCountByStatus,
      bookingsCountByService,
      totalPayments,
      totalCapturedPayments,
      totalVehicles,
      activeVehicleAssignments,
      totalDrivers,
      availableDrivers,
      recentPayments,
    ] = await Promise.all([
      this.prisma.booking.groupBy({
        by: ['status'],
        _count: { id: true },
      }),
      this.prisma.booking.groupBy({
        by: ['serviceType'],
        _count: { id: true },
      }),
      this.prisma.payment.count(),
      this.prisma.payment.findMany({
        where: { status: PaymentStatus.CAPTURED },
        select: { amountPaise: true, paidAt: true, method: true },
      }),
      this.prisma.vehicle.count({ where: { deletedAt: null, isActive: true } }),
      this.prisma.vehicleAssignment.count({ where: { status: AssignmentStatus.ACTIVE } }),
      this.prisma.driver.count({ where: { deletedAt: null, isActive: true } }),
      this.prisma.driver.count({ where: { deletedAt: null, isActive: true, isAvailable: true } }),
      this.prisma.payment.findMany({
        where: { status: PaymentStatus.CAPTURED },
        take: 6,
        orderBy: { paidAt: 'desc' },
        include: {
          booking: {
            select: {
              bookingNumber: true,
              pickupAddress: true,
              dropAddress: true,
              customer: { select: { fullName: true, phone: true } },
            },
          },
        },
      }),
    ]);

    const totalRevenuePaise = totalCapturedPayments.reduce(
      (acc: number, p: any) => acc + p.amountPaise,
      0,
    );

    const bookingStatusMap: Record<string, number> = {};
    for (const b of bookingsCountByStatus) {
      bookingStatusMap[b.status] = b._count.id;
    }

    const serviceTypeMap: Record<string, number> = {};
    for (const s of bookingsCountByService) {
      serviceTypeMap[s.serviceType] = s._count.id;
    }

    // Payment methods distribution
    const methodCounts = { UPI: 0, CARD: 0, NETBANKING: 0, CASH: 0 };
    for (const p of totalCapturedPayments) {
      const m = p.method as string;
      if (m === 'UPI') methodCounts.UPI += 1;
      else if (m === 'CREDIT_CARD' || m === 'DEBIT_CARD') methodCounts.CARD += 1;
      else if (m === 'NET_BANKING') methodCounts.NETBANKING += 1;
      else methodCounts.CASH += 1;
    }

    // 7-day revenue trend aggregation
    const days = 7;
    const trendMap = new Map<string, { date: string; label: string; revenuePaise: number; count: number }>();
    const now = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const isoKey = d.toISOString().slice(0, 10);
      const dayLabel = d.toLocaleDateString('en-US', { weekday: 'short' });
      trendMap.set(isoKey, { date: isoKey, label: dayLabel, revenuePaise: 0, count: 0 });
    }

    for (const p of totalCapturedPayments) {
      if (p.paidAt) {
        const pKey = new Date(p.paidAt).toISOString().slice(0, 10);
        const entry = trendMap.get(pKey);
        if (entry) {
          entry.revenuePaise += p.amountPaise;
          entry.count += 1;
        }
      }
    }

    const revenueTrends = Array.from(trendMap.values()).map((t) => ({
      ...t,
      revenueInr: Math.round(t.revenuePaise / 100),
    }));

    return {
      revenue: {
        totalRevenuePaise,
        totalRevenueInr: totalRevenuePaise / 100,
        capturedPaymentsCount: totalCapturedPayments.length,
        totalPaymentsAttempts: totalPayments,
        conversionRatePercent:
          totalPayments > 0
            ? Math.round((totalCapturedPayments.length / totalPayments) * 100)
            : 100,
      },
      bookings: {
        byStatus: bookingStatusMap,
        byServiceType: serviceTypeMap,
        totalRequests: Object.values(bookingStatusMap).reduce((a, b) => a + b, 0),
        pendingReviewCount: bookingStatusMap['PENDING_REVIEW'] || 0,
        confirmedCount: bookingStatusMap['CONFIRMED'] || 0,
        completedCount: bookingStatusMap['COMPLETED'] || 0,
      },
      fleet: {
        totalVehicles,
        activeOnRoad: activeVehicleAssignments,
        available: Math.max(0, totalVehicles - activeVehicleAssignments),
        utilizationPercent:
          totalVehicles > 0
            ? Math.round((activeVehicleAssignments / totalVehicles) * 100)
            : 0,
      },
      drivers: {
        totalDrivers,
        availableDrivers,
        onTripDrivers: Math.max(0, totalDrivers - availableDrivers),
      },
      revenueTrends,
      paymentMethods: methodCounts,
      recentPayments: recentPayments.map((p: any) => ({
        id: p.id,
        paymentNumber: p.paymentNumber,
        amountInr: p.amountPaise / 100,
        method: p.method,
        gateway: p.gateway,
        paidAt: p.paidAt,
        bookingNumber: p.booking?.bookingNumber,
        customerName: p.booking?.customer?.fullName,
        pickup: p.booking?.pickupAddress,
        drop: p.booking?.dropAddress,
      })),
    };
  }
}
