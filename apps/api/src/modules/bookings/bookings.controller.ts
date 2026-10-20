import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { Public } from '../../common/decorators/public.decorator';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { BookingStatus, ServiceType } from '@dehradun/prisma';

@ApiTags('Bookings')
@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Public()
  @Post()
  @ApiOperation({
    summary: 'Public booking submission (Creates PENDING_REVIEW request only, no auto-confirm)',
  })
  @ApiResponse({
    status: 201,
    description: 'Booking request created with immutable fare snapshot and PENDING_REVIEW status',
  })
  async create(
    @Body() dto: CreateBookingDto,
    @Headers('idempotency-key') idempotencyHeader?: string,
  ) {
    return this.bookingsService.createBookingRequest(dto, idempotencyHeader);
  }

  @ApiBearerAuth()
  @Get()
  @RequirePermissions('booking:view')
  @ApiOperation({ summary: 'List bookings with pagination and status/service filters' })
  async findAll(
    @Query() query: PaginationDto,
    @Query('status') status?: BookingStatus,
    @Query('serviceType') serviceType?: ServiceType,
  ) {
    return this.bookingsService.findAll(query.skip, query.take, status, serviceType);
  }

  @Public()
  @Get('track')
  @ApiOperation({
    summary: 'Public customer booking tracking by booking reference and passenger phone',
  })
  @ApiResponse({
    status: 200,
    description: 'Booking details with assigned vehicle, driver, fare snapshot, and trip status',
  })
  async track(
    @Query('bookingNumber') bookingNumber: string,
    @Query('phone') phone: string,
  ) {
    return this.bookingsService.trackBooking(bookingNumber, phone);
  }

  @ApiBearerAuth()
  @Get(':id')
  @RequirePermissions('booking:view')
  @ApiOperation({ summary: 'Get full booking details including fare snapshot and history' })
  async findById(@Param('id', ParseUUIDPipe) id: string) {
    return this.bookingsService.findById(id);
  }

  @ApiBearerAuth()
  @Patch(':id/confirm')
  @RequirePermissions('booking:confirm')
  @ApiOperation({ summary: 'Explicit admin confirmation endpoint (locks fare snapshot and schedules trip)' })
  async confirm(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('id') adminUserId: string,
    @Body('notes') notes?: string,
  ) {
    return this.bookingsService.confirmBooking(id, adminUserId, notes);
  }

  @ApiBearerAuth()
  @Patch(':id/cancel')
  @RequirePermissions('booking:cancel')
  @ApiOperation({ summary: 'Cancel booking request with reason tracking' })
  async cancel(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('id') cancelledById: string,
    @Body('reason') reason?: string,
  ) {
    return this.bookingsService.cancelBooking(id, cancelledById, reason);
  }
}
