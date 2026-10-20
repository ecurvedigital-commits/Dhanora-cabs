import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { TripsService } from './trips.service';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { TripEventType } from '@dehradun/prisma';

@ApiTags('Trips & Dispatch')
@ApiBearerAuth()
@Controller('trips')
export class TripsController {
  constructor(private readonly tripsService: TripsService) {}

  @Get()
  @RequirePermissions('trip:view')
  @ApiOperation({ summary: 'List all operational trips with assigned driver and vehicle' })
  async findAll(@Query() query: PaginationDto) {
    return this.tripsService.findAll(query.skip, query.take);
  }

  @Get(':id')
  @RequirePermissions('trip:view')
  @ApiOperation({ summary: 'Get trip details with timeline events and expenses' })
  async findById(@Param('id', ParseUUIDPipe) id: string) {
    return this.tripsService.findById(id);
  }

  @Post(':id/assign-vehicle')
  @RequirePermissions('vehicle:assign')
  @ApiOperation({ summary: 'Assign vehicle to a trip with race-condition prevention' })
  async assignVehicle(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('vehicleId', ParseUUIDPipe) vehicleId: string,
    @CurrentUser('id') assignedById: string,
  ) {
    return this.tripsService.assignVehicle(id, vehicleId, assignedById);
  }

  @Post(':id/assign-driver')
  @RequirePermissions('driver:assign')
  @ApiOperation({ summary: 'Assign driver to a trip with race-condition prevention' })
  async assignDriver(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('driverId', ParseUUIDPipe) driverId: string,
    @CurrentUser('id') assignedById: string,
  ) {
    return this.tripsService.assignDriver(id, driverId, assignedById);
  }

  @Post(':id/events')
  @RequirePermissions('trip:manage')
  @ApiOperation({ summary: 'Record milestone or telemetry trip event' })
  async recordEvent(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('eventType') eventType: TripEventType,
    @Body('description') description: string,
    @CurrentUser('id') recordedById: string,
  ) {
    return this.tripsService.recordEvent(id, { eventType, description, recordedById });
  }
}
