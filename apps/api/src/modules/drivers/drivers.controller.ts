import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { DriversService } from './drivers.service';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';

@ApiTags('Drivers Management')
@ApiBearerAuth()
@Controller('drivers')
export class DriversController {
  constructor(private readonly driversService: DriversService) {}

  @Get()
  @RequirePermissions('driver:view')
  @ApiOperation({ summary: 'List all mountain and commercial drivers' })
  async getDrivers(@Query() query: PaginationDto) {
    return this.driversService.getAllDrivers(query.skip, query.take);
  }

  @Get(':id')
  @RequirePermissions('driver:view')
  @ApiOperation({ summary: 'Get driver profile with mountain badge and recent assignments' })
  async getDriverById(@Param('id', ParseUUIDPipe) id: string) {
    return this.driversService.getDriverById(id);
  }

  @Post()
  @RequirePermissions('driver:create')
  @ApiOperation({ summary: 'Register a new verified chauffeur or driver' })
  async createDriver(@Body() body: any) {
    return this.driversService.createDriver(body);
  }

  @Patch(':id/availability')
  @RequirePermissions('driver:manage')
  @ApiOperation({ summary: 'Update driver availability toggle' })
  async updateAvailability(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('isAvailable') isAvailable: boolean,
  ) {
    return this.driversService.updateAvailability(id, isAvailable);
  }
}
