import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  ParseUUIDPipe,
  Post,
  Req,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { PaymentGateway, PaymentMethod } from '@dehradun/prisma';

@ApiTags('Payments, Refunds & Invoicing')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @ApiBearerAuth()
  @Post('intent')
  @RequirePermissions('payment:create')
  @ApiOperation({ summary: 'Create initial payment intent (PENDING status with balance check)' })
  async createIntent(
    @Body()
    body: {
      bookingId: string;
      amountPaise: number;
      method: PaymentMethod;
      gateway?: PaymentGateway;
      gatewayOrderId?: string;
    },
  ) {
    return this.paymentsService.createPaymentIntent(body);
  }

  @ApiBearerAuth()
  @Get('balance/:bookingId')
  @RequirePermissions('payment:view')
  @ApiOperation({ summary: 'Get booking payment balance, advance requirement, and outstanding balance' })
  async getBalance(@Param('bookingId', ParseUUIDPipe) bookingId: string) {
    return this.paymentsService.getBookingBalance(bookingId);
  }

  @ApiBearerAuth()
  @Post(':id/verify')
  @RequirePermissions('payment:verify')
  @ApiOperation({ summary: 'Verify gateway payment transaction (only sets CAPTURED upon confirmation)' })
  async verifyPayment(
    @Param('id', ParseUUIDPipe) id: string,
    @Body()
    body: {
      gatewayTransactionId: string;
      isSuccess: boolean;
      failureReason?: string;
      signature?: string;
      orderId?: string;
    },
    @CurrentUser('id') verifiedById: string,
  ) {
    return this.paymentsService.verifyPayment(id, {
      ...body,
      verifiedById,
    });
  }

  @Public()
  @Post('webhook')
  @ApiOperation({ summary: 'Razorpay webhook endpoint with HMAC-SHA256 signature and idempotency' })
  async handleWebhook(
    @Headers('x-razorpay-signature') signature: string,
    @Headers('x-razorpay-event-id') eventId: string,
    @Body() body: any,
  ) {
    const rawBody = typeof body === 'string' ? body : JSON.stringify(body);
    return this.paymentsService.handleGatewayWebhook(rawBody, signature, eventId);
  }

  @ApiBearerAuth()
  @Get(':id/receipt')
  @RequirePermissions('payment:view')
  @ApiOperation({ summary: 'Get official payment receipt with customer and fare breakdown' })
  async getReceipt(@Param('id', ParseUUIDPipe) id: string) {
    return this.paymentsService.getReceipt(id);
  }

  @ApiBearerAuth()
  @Post(':id/refund')
  @RequirePermissions('payment:refund')
  @ApiOperation({ summary: 'Issue auditable refund against a captured payment' })
  async processRefund(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('amountPaise') amountPaise: number,
    @Body('reason') reason: string,
    @CurrentUser('id') approvedById: string,
  ) {
    return this.paymentsService.processRefund({
      paymentId: id,
      amountPaise,
      reason,
      approvedById,
    });
  }

  @ApiBearerAuth()
  @Post('correction')
  @RequirePermissions('finance:correct')
  @ApiOperation({ summary: 'Record auditable financial correction or fee rebate with delta' })
  async createCorrection(
    @Body()
    body: {
      bookingId: string;
      originalAmountPaise: number;
      correctedAmountPaise: number;
      reason: string;
    },
    @CurrentUser('id') approvedById: string,
  ) {
    return this.paymentsService.createFinancialCorrection({
      ...body,
      approvedById,
    });
  }

  @ApiBearerAuth()
  @Post('invoices/:bookingId')
  @RequirePermissions('invoice:create')
  @ApiOperation({ summary: 'Generate official sequential GST invoice for a booking' })
  async generateInvoice(@Param('bookingId', ParseUUIDPipe) bookingId: string) {
    return this.paymentsService.generateInvoice(bookingId);
  }

  @ApiBearerAuth()
  @Get('invoices/booking/:bookingId')
  @RequirePermissions('invoice:view')
  @ApiOperation({ summary: 'Get all generated GST invoices for a booking' })
  async getInvoices(@Param('bookingId', ParseUUIDPipe) bookingId: string) {
    return this.paymentsService.getInvoicesByBooking(bookingId);
  }
}
