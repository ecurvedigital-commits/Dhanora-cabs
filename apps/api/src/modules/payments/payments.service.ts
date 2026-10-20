import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { ReferenceUtil } from '../../common/utils/reference.util';
import { SignatureUtil } from '../../common/utils/signature.util';
import {
  PaymentStatus,
  PaymentMethod,
  PaymentGateway,
  RefundStatus,
  InvoiceStatus,
  BookingStatus,
  AuditAction,
} from '@dehradun/prisma';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  /**
   * Calculates comprehensive payment and balance breakdown for a booking
   */
  async getBookingBalance(bookingId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        fareSnapshot: true,
        payments: {
          include: { refunds: true },
        },
      },
    });

    if (!booking) {
      throw new NotFoundException(`Booking with ID ${bookingId} not found`);
    }

    const totalFarePaise = booking.fareSnapshot?.totalFarePaise ?? 0;
    const advanceRequiredPaise = booking.fareSnapshot?.advanceRequiredPaise ?? 0;

    let totalCapturedPaise = 0;
    let totalRefundedPaise = 0;

    for (const payment of booking.payments) {
      if (
        payment.status === PaymentStatus.CAPTURED ||
        payment.status === PaymentStatus.PARTIALLY_REFUNDED
      ) {
        totalCapturedPaise += payment.amountPaise;
      }
      for (const refund of payment.refunds) {
        if (
          refund.status === RefundStatus.APPROVED ||
          refund.status === RefundStatus.PROCESSED
        ) {
          totalRefundedPaise += refund.amountPaise;
        }
      }
    }

    const netPaidPaise = Math.max(0, totalCapturedPaise - totalRefundedPaise);
    const outstandingBalancePaise = Math.max(0, totalFarePaise - netPaidPaise);

    let paymentState: 'UNPAID' | 'ADVANCE_PAID' | 'PARTIALLY_PAID' | 'FULLY_PAID' = 'UNPAID';
    if (netPaidPaise >= totalFarePaise && totalFarePaise > 0) {
      paymentState = 'FULLY_PAID';
    } else if (netPaidPaise >= advanceRequiredPaise && advanceRequiredPaise > 0) {
      paymentState = 'ADVANCE_PAID';
    } else if (netPaidPaise > 0) {
      paymentState = 'PARTIALLY_PAID';
    }

    return {
      bookingId,
      bookingNumber: booking.bookingNumber,
      totalFarePaise,
      advanceRequiredPaise,
      totalCapturedPaise,
      totalRefundedPaise,
      netPaidPaise,
      outstandingBalancePaise,
      paymentState,
      isAdvanceMet: netPaidPaise >= advanceRequiredPaise,
      isFullyPaid: netPaidPaise >= totalFarePaise && totalFarePaise > 0,
    };
  }

  async createPaymentIntent(data: {
    bookingId: string;
    amountPaise: number;
    method: PaymentMethod;
    gateway?: PaymentGateway;
    gatewayOrderId?: string;
  }) {
    if (!data.amountPaise || data.amountPaise <= 0) {
      throw new BadRequestException('Payment intent amount must be a positive integer in paise');
    }

    const booking = await this.prisma.booking.findUnique({
      where: { id: data.bookingId },
      include: { fareSnapshot: true },
    });
    if (!booking) {
      throw new NotFoundException(`Booking with ID ${data.bookingId} not found`);
    }

    // Validate that intent does not exceed remaining outstanding balance
    const balance = await this.getBookingBalance(data.bookingId);
    if (data.amountPaise > balance.outstandingBalancePaise && balance.totalFarePaise > 0) {
      throw new BadRequestException(
        `Payment intent amount (₹${data.amountPaise / 100}) exceeds outstanding balance (₹${balance.outstandingBalancePaise / 100})`,
      );
    }

    const paymentNumber = ReferenceUtil.generatePaymentNumber();

    return this.prisma.payment.create({
      data: {
        bookingId: data.bookingId,
        paymentNumber,
        amountPaise: data.amountPaise,
        currency: 'INR',
        status: PaymentStatus.PENDING, // Strictly starts as PENDING until verified
        method: data.method,
        gateway: data.gateway || PaymentGateway.RAZORPAY,
        gatewayOrderId: data.gatewayOrderId,
      },
    });
  }

  async verifyPayment(
    paymentId: string,
    verification: {
      gatewayTransactionId: string;
      isSuccess: boolean;
      failureReason?: string;
      signature?: string;
      orderId?: string;
      verifiedById?: string;
    },
  ) {
    const payment = await this.prisma.payment.findUnique({
      where: { id: paymentId },
      include: { booking: true },
    });

    if (!payment) {
      throw new NotFoundException(`Payment with ID ${paymentId} not found`);
    }

    if (payment.status === PaymentStatus.CAPTURED) {
      throw new ConflictException(`Payment with ID ${paymentId} has already been verified and CAPTURED`);
    }

    if (payment.status !== PaymentStatus.PENDING) {
      throw new BadRequestException(
        `Cannot verify payment in '${payment.status}' state. Only PENDING payments can be verified.`,
      );
    }

    if (!verification.isSuccess) {
      const failedPayment = await this.prisma.payment.update({
        where: { id: paymentId },
        data: {
          status: PaymentStatus.FAILED,
          failureReason: verification.failureReason || 'Gateway payment declined',
        },
      });

      await this.auditService.logMutation({
        entityName: 'Payment',
        entityId: paymentId,
        action: AuditAction.UPDATE,
        userId: verification.verifiedById,
        metadataJson: {
          event: 'PAYMENT_FAILED',
          failureReason: verification.failureReason,
        },
      });

      return failedPayment;
    }

    // Only set CAPTURED if verified with gateway transaction ID
    if (!verification.gatewayTransactionId) {
      throw new BadRequestException('Cannot verify payment success without valid gatewayTransactionId');
    }

    // Verify cryptographic signature if provided (e.g. Razorpay checkout response)
    if (verification.signature && verification.orderId) {
      const secret = process.env.RAZORPAY_KEY_SECRET || 'rzp_test_secret_sandbox_key_2026';
      const isValid = SignatureUtil.verifyRazorpayPaymentSignature(
        verification.orderId,
        verification.gatewayTransactionId,
        verification.signature,
        secret,
      );
      if (!isValid) {
        throw new BadRequestException('Invalid gateway payment signature verification');
      }
    }

    const existingTx = await this.prisma.payment.findUnique({
      where: { gatewayTransactionId: verification.gatewayTransactionId },
    });
    if (existingTx && existingTx.id !== paymentId) {
      throw new ConflictException(
        `Gateway transaction ID ${verification.gatewayTransactionId} is already associated with payment ${existingTx.paymentNumber}`,
      );
    }

    return this.prisma.$transaction(async (tx: any) => {
      const updatedPayment = await tx.payment.update({
        where: { id: paymentId },
        data: {
          status: PaymentStatus.CAPTURED,
          gatewayTransactionId: verification.gatewayTransactionId,
          paidAt: new Date(),
        },
      });

      // Update customer lifetime spend
      await tx.customer.update({
        where: { id: payment.booking.customerId },
        data: {
          lifetimeSpendPaise: {
            increment: BigInt(payment.amountPaise),
          },
        },
      });

      // Financial Audit Log
      await this.auditService.logMutation({
        entityName: 'Payment',
        entityId: paymentId,
        action: AuditAction.UPDATE,
        userId: verification.verifiedById,
        beforeStateJson: { status: PaymentStatus.PENDING },
        afterStateJson: {
          status: PaymentStatus.CAPTURED,
          gatewayTransactionId: verification.gatewayTransactionId,
          amountPaise: payment.amountPaise,
        },
        metadataJson: {
          event: 'PAYMENT_CAPTURED',
          paymentNumber: payment.paymentNumber,
          bookingId: payment.bookingId,
        },
      });

      return updatedPayment;
    });
  }

  /**
   * Webhook processing with HMAC-SHA256 signature verification and idempotency handling
   */
  async handleGatewayWebhook(
    rawBody: string | Buffer,
    signature: string,
    eventId?: string,
  ) {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || 'rzp_test_webhook_secret_2026';

    const isValid = SignatureUtil.verifyRazorpayWebhookSignature(
      rawBody,
      signature,
      webhookSecret,
    );
    if (!isValid) {
      throw new UnauthorizedException('Invalid Razorpay webhook signature');
    }

    const payload = typeof rawBody === 'string' ? JSON.parse(rawBody) : JSON.parse(rawBody.toString('utf8'));
    const resolvedEventId = eventId || payload.id || `webhook_${Date.now()}`;
    const idempotencyKey = `razorpay_webhook_${resolvedEventId}`;

    // 1. Webhook Idempotency Check
    const existing = await this.prisma.idempotencyKey.findUnique({
      where: { key: idempotencyKey },
    });
    if (existing && existing.completedAt) {
      this.logger.log(`Webhook event ${resolvedEventId} already processed (idempotent duplicate)`);
      return {
        status: 'ok',
        duplicate: true,
        message: 'Webhook event already processed successfully',
        eventId: resolvedEventId,
      };
    }

    // 2. Process webhook event based on event type
    const eventType = payload.event;
    let result: any = { eventType, status: 'acknowledged' };

    if (eventType === 'payment.captured') {
      const paymentEntity = payload.payload?.payment?.entity;
      if (paymentEntity) {
        const orderId = paymentEntity.order_id;
        const txnId = paymentEntity.id;
        const amountPaise = paymentEntity.amount;

        const payment = await this.prisma.payment.findFirst({
          where: {
            OR: [
              { gatewayOrderId: orderId },
              { gatewayTransactionId: txnId },
            ],
          },
          include: { booking: true },
        });

        if (payment && payment.status === PaymentStatus.PENDING) {
          result = await this.verifyPayment(payment.id, {
            gatewayTransactionId: txnId,
            isSuccess: true,
            orderId,
          });
        }
      }
    } else if (eventType === 'payment.failed') {
      const paymentEntity = payload.payload?.payment?.entity;
      if (paymentEntity) {
        const orderId = paymentEntity.order_id;
        const failureReason = paymentEntity.error_description || 'Payment failed';

        const payment = await this.prisma.payment.findFirst({
          where: { gatewayOrderId: orderId },
        });

        if (payment && payment.status === PaymentStatus.PENDING) {
          result = await this.verifyPayment(payment.id, {
            gatewayTransactionId: paymentEntity.id || `failed_${Date.now()}`,
            isSuccess: false,
            failureReason,
          });
        }
      }
    }

    // 3. Record Idempotency Key record
    await this.prisma.idempotencyKey.upsert({
      where: { key: idempotencyKey },
      update: {
        responseStatusCode: 200,
        responseBodyJson: JSON.stringify(result),
        completedAt: new Date(),
      },
      create: {
        key: idempotencyKey,
        targetEndpoint: '/api/v1/payments/webhook',
        requestHash: `sha256_${resolvedEventId}`,
        responseStatusCode: 200,
        responseBodyJson: JSON.stringify(result),
        lockedUntil: new Date(Date.now() + 86400000),
        completedAt: new Date(),
      },
    });

    return {
      status: 'ok',
      duplicate: false,
      eventId: resolvedEventId,
      result,
    };
  }

  async processRefund(data: {
    paymentId: string;
    amountPaise: number;
    reason: string;
    approvedById: string;
  }) {
    if (!data.amountPaise || data.amountPaise <= 0) {
      throw new BadRequestException('Refund amount must be a positive integer in paise');
    }
    if (!data.reason?.trim()) {
      throw new BadRequestException('Refund reason is required');
    }

    const payment = await this.prisma.payment.findUnique({
      where: { id: data.paymentId },
      include: { refunds: true, booking: true },
    });

    if (!payment) {
      throw new NotFoundException(`Payment with ID ${data.paymentId} not found`);
    }

    if (payment.status !== PaymentStatus.CAPTURED && payment.status !== PaymentStatus.PARTIALLY_REFUNDED) {
      throw new BadRequestException(
        `Cannot refund payment in '${payment.status}' state. Only CAPTURED or PARTIALLY_REFUNDED payments can be refunded.`,
      );
    }

    const previousRefundsTotal = payment.refunds
      .filter((r: any) => r.status === RefundStatus.APPROVED || r.status === RefundStatus.PROCESSED)
      .reduce((sum: number, r: any) => sum + r.amountPaise, 0);

    if (previousRefundsTotal + data.amountPaise > payment.amountPaise) {
      throw new BadRequestException(
        `Refund amount exceeds remaining captured balance. Captured: ₹${payment.amountPaise / 100}, Previously Refunded: ₹${previousRefundsTotal / 100}`,
      );
    }

    const refundNumber = ReferenceUtil.generateRefundNumber();

    return this.prisma.$transaction(async (tx: any) => {
      const refund = await tx.refund.create({
        data: {
          paymentId: payment.id,
          bookingId: payment.bookingId,
          refundNumber,
          amountPaise: data.amountPaise,
          reason: data.reason,
          status: RefundStatus.APPROVED,
          approvedById: data.approvedById,
          processedAt: new Date(),
        },
      });

      const isFullRefund = previousRefundsTotal + data.amountPaise === payment.amountPaise;
      await tx.payment.update({
        where: { id: payment.id },
        data: {
          status: isFullRefund ? PaymentStatus.REFUNDED : PaymentStatus.PARTIALLY_REFUNDED,
        },
      });

      // Adjust customer lifetime spend accordingly
      await tx.customer.update({
        where: { id: payment.booking.customerId },
        data: {
          lifetimeSpendPaise: {
            decrement: BigInt(data.amountPaise),
          },
        },
      });

      // Audit Trail
      await this.auditService.logMutation({
        entityName: 'Refund',
        entityId: refund.id,
        action: AuditAction.CREATE,
        userId: data.approvedById,
        afterStateJson: {
          refundNumber,
          paymentId: payment.id,
          amountPaise: data.amountPaise,
          reason: data.reason,
        },
        metadataJson: {
          event: 'REFUND_APPROVED',
          isFullRefund,
          bookingId: payment.bookingId,
        },
      });

      return refund;
    });
  }

  async createFinancialCorrection(data: {
    bookingId: string;
    originalAmountPaise: number;
    correctedAmountPaise: number;
    reason: string;
    approvedById: string;
  }) {
    if (data.originalAmountPaise < 0 || data.correctedAmountPaise < 0) {
      throw new BadRequestException('Correction amounts cannot be negative');
    }
    if (!data.reason?.trim()) {
      throw new BadRequestException('Financial correction reason is required');
    }
    const booking = await this.prisma.booking.findUnique({
      where: { id: data.bookingId },
    });
    if (!booking) {
      throw new NotFoundException(`Booking with ID ${data.bookingId} not found`);
    }
    const deltaPaise = data.correctedAmountPaise - data.originalAmountPaise;

    const correction = await this.prisma.financialCorrection.create({
      data: {
        bookingId: data.bookingId,
        originalAmountPaise: data.originalAmountPaise,
        correctedAmountPaise: data.correctedAmountPaise,
        deltaPaise,
        reason: data.reason,
        approvedById: data.approvedById,
      },
    });

    await this.auditService.logMutation({
      entityName: 'FinancialCorrection',
      entityId: correction.id,
      action: AuditAction.CREATE,
      userId: data.approvedById,
      afterStateJson: {
        deltaPaise,
        reason: data.reason,
        originalAmountPaise: data.originalAmountPaise,
        correctedAmountPaise: data.correctedAmountPaise,
      },
    });

    return correction;
  }

  async generateInvoice(bookingId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: { customer: true, fareSnapshot: true, payments: true },
    });

    if (!booking) {
      throw new NotFoundException(`Booking with ID ${bookingId} not found`);
    }

    const fare = booking.fareSnapshot;
    const subtotalPaise = fare ? fare.baseFarePaise + fare.distanceRatePaise * Number(fare.estimatedDistanceKm) : 250000;
    const taxPaise = fare ? fare.taxPaise : 12500;
    const totalAmountPaise = fare ? fare.totalFarePaise : 262500;

    const paidAmountPaise = booking.payments
      .filter((p: any) => p.status === PaymentStatus.CAPTURED)
      .reduce((sum: number, p: any) => sum + p.amountPaise, 0);

    const invoiceNumber = ReferenceUtil.generateInvoiceNumber();

    const invoice = await this.prisma.invoice.create({
      data: {
        bookingId: booking.id,
        invoiceNumber,
        subtotalPaise: Math.round(subtotalPaise),
        taxPaise,
        totalAmountPaise,
        paidAmountPaise,
        status: paidAmountPaise >= totalAmountPaise ? InvoiceStatus.PAID : InvoiceStatus.ISSUED,
        billingName: booking.customer.fullName,
        billingAddress: booking.customer.address || booking.pickupAddress,
      },
    });

    await this.auditService.logMutation({
      entityName: 'Invoice',
      entityId: invoice.id,
      action: AuditAction.CREATE,
      afterStateJson: {
        invoiceNumber,
        bookingId,
        totalAmountPaise,
        status: invoice.status,
      },
    });

    return invoice;
  }

  async getReceipt(paymentId: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        booking: {
          include: {
            customer: true,
            fareSnapshot: true,
          },
        },
        refunds: true,
      },
    });

    if (!payment) {
      throw new NotFoundException(`Payment with ID ${paymentId} not found`);
    }

    const balance = await this.getBookingBalance(payment.bookingId);

    return {
      paymentId: payment.id,
      paymentNumber: payment.paymentNumber,
      bookingNumber: payment.booking.bookingNumber,
      serviceType: payment.booking.serviceType,
      paidAt: payment.paidAt,
      amountInr: payment.amountPaise / 100,
      amountPaise: payment.amountPaise,
      method: payment.method,
      gateway: payment.gateway,
      gatewayTransactionId: payment.gatewayTransactionId,
      status: payment.status,
      customer: {
        name: payment.booking.customer.fullName,
        phone: payment.booking.customer.phone,
        email: payment.booking.customer.email,
      },
      fareSnapshot: payment.booking.fareSnapshot,
      balanceOverview: balance,
    };
  }

  async getInvoicesByBooking(bookingId: string) {
    return this.prisma.invoice.findMany({
      where: { bookingId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
