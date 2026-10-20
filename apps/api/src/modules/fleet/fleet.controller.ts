import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FleetService } from './fleet.service';
import { Public } from '../../common/decorators/public.decorator';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';

@ApiTags('Fleet Management')
@Controller('fleet')
export class FleetController {
  constructor(private readonly fleetService: FleetService) {}

  @Public()
  @Get('categories')
  @ApiOperation({ summary: 'List all active vehicle categories (Public)' })
  async getCategories() {
    return this.fleetService.getAllCategories();
  }

  @ApiBearerAuth()
  @Get('vehicles')
  @RequirePermissions('vehicle:view')
  @ApiOperation({ summary: 'List all vehicles with compliance validity status' })
  async getVehicles(@Query() query: PaginationDto) {
    return this.fleetService.getAllVehicles(query.skip, query.take);
  }

  @ApiBearerAuth()
  @Get('vehicles/:id')
  @RequirePermissions('vehicle:view')
  @ApiOperation({ summary: 'Get vehicle profile, category and recent assignments' })
  async getVehicleById(@Param('id', ParseUUIDPipe) id: string) {
    return this.fleetService.getVehicleById(id);
  }

  @ApiBearerAuth()
  @Post('vehicles')
  @RequirePermissions('vehicle:create')
  @ApiOperation({ summary: 'Register a new vehicle with commercial permits' })
  async createVehicle(@Body() body: any) {
    return this.fleetService.createVehicle(body);
  }
}
