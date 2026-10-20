import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PackagesService } from './packages.service';
import { Public } from '../../common/decorators/public.decorator';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';
import { PaginationDto } from '../../common/dto/pagination.dto';

@ApiTags('Tour Packages, Treks & Safaris')
@Controller('packages')
export class PackagesController {
  constructor(private readonly packagesService: PackagesService) {}

  @Public()
  @Get('categories')
  @ApiOperation({ summary: 'List tour categories (Char Dham, Trekking, Safari, etc.)' })
  async getCategories() {
    return this.packagesService.getAllCategories();
  }

  @ApiBearerAuth()
  @Post('categories')
  @RequirePermissions('package:manage')
  @ApiOperation({ summary: 'Create a new tour package category' })
  async createCategory(
    @Body()
    body: {
      name: string;
      slug: string;
      description?: string;
      iconUrl?: string;
    },
  ) {
    return this.packagesService.createCategory(body);
  }

  @ApiBearerAuth()
  @Patch('categories/:id')
  @RequirePermissions('package:manage')
  @ApiOperation({ summary: 'Update a tour package category' })
  async updateCategory(
    @Param('id', ParseUUIDPipe) id: string,
    @Body()
    body: {
      name?: string;
      slug?: string;
      description?: string;
      iconUrl?: string;
      isActive?: boolean;
    },
  ) {
    return this.packagesService.updateCategory(id, body);
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'List all published Uttarakhand tour packages with upcoming departures' })
  async getPackages(@Query('categoryId') categoryId?: string) {
    return this.packagesService.getAllPackages(categoryId, true);
  }

  @ApiBearerAuth()
  @Get('admin')
  @RequirePermissions('package:view')
  @ApiOperation({ summary: 'Admin list all packages including drafts and unpublished' })
  async getAllPackagesAdmin(
    @Query() query: PaginationDto,
    @Query('categoryId') categoryId?: string,
    @Query('isPublished') isPublished?: boolean,
  ) {
    return this.packagesService.getAllPackagesAdmin(query.skip, query.take, categoryId, isPublished);
  }

  @Public()
  @Get(':slug')
  @ApiOperation({ summary: 'Get tour package itinerary, difficulty level, and scheduled departures by slug' })
  async getPackageBySlug(@Param('slug') slug: string) {
    return this.packagesService.getPackageBySlug(slug);
  }

  @ApiBearerAuth()
  @Get('admin/:id')
  @RequirePermissions('package:view')
  @ApiOperation({ summary: 'Get package details by ID for admin editing' })
  async getPackageById(@Param('id', ParseUUIDPipe) id: string) {
    return this.packagesService.getPackageById(id);
  }

  @ApiBearerAuth()
  @Post()
  @RequirePermissions('package:create')
  @ApiOperation({ summary: 'Create a new tour, trek or safari package with itinerary' })
  async createPackage(@Body() body: any) {
    return this.packagesService.createPackage(body);
  }

  @ApiBearerAuth()
  @Patch(':id')
  @RequirePermissions('package:manage')
  @ApiOperation({ summary: 'Update tour package details, pricing, or publish status' })
  async updatePackage(@Param('id', ParseUUIDPipe) id: string, @Body() body: any) {
    return this.packagesService.updatePackage(id, body);
  }

  @ApiBearerAuth()
  @Delete(':id')
  @RequirePermissions('package:manage')
  @ApiOperation({ summary: 'Soft-delete a tour package' })
  async deletePackage(@Param('id', ParseUUIDPipe) id: string) {
    return this.packagesService.deletePackage(id);
  }

  @ApiBearerAuth()
  @Post(':id/departures')
  @RequirePermissions('package:manage')
  @ApiOperation({ summary: 'Schedule a fixed departure date for a tour package' })
  async createDeparture(
    @Param('id', ParseUUIDPipe) id: string,
    @Body()
    body: {
      departureDate: string;
      returnDate: string;
      maxSeats: number;
      pricePerPersonPaise: number;
    },
  ) {
    return this.packagesService.createDeparture(id, body);
  }

  @ApiBearerAuth()
  @Patch('departures/:departureId')
  @RequirePermissions('package:manage')
  @ApiOperation({ summary: 'Update departure date, available seats, or departure status' })
  async updateDeparture(
    @Param('departureId', ParseUUIDPipe) departureId: string,
    @Body() body: any,
  ) {
    return this.packagesService.updateDeparture(departureId, body);
  }
}
