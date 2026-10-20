import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { EnquiriesService } from './enquiries.service';
import { Public } from '../../common/decorators/public.decorator';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { EnquiryStatus, ServiceType } from '@dehradun/prisma';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateEnquiryDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  phone!: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsEnum(ServiceType)
  serviceType?: ServiceType;

  @IsOptional()
  travelDate?: Date;

  @IsOptional()
  @IsString()
  pickupLocation?: string;

  @IsOptional()
  @IsString()
  destination?: string;

  @IsString()
  @IsNotEmpty()
  message!: string;
}

@ApiTags('Enquiries & Quotes')
@Controller('enquiries')
export class EnquiriesController {
  constructor(private readonly enquiriesService: EnquiriesService) {}

  @Public()
  @Post()
  @ApiOperation({ summary: 'Submit pre-booking quote inquiry or custom tour query' })
  async create(@Body() dto: CreateEnquiryDto) {
    return this.enquiriesService.create(dto);
  }

  @ApiBearerAuth()
  @Get()
  @RequirePermissions('enquiry:view')
  @ApiOperation({ summary: 'List customer inquiries with status filter' })
  async findAll(@Query() query: PaginationDto, @Query('status') status?: EnquiryStatus) {
    return this.enquiriesService.findAll(query.skip, query.take, status);
  }

  @ApiBearerAuth()
  @Get(':id')
  @RequirePermissions('enquiry:view')
  @ApiOperation({ summary: 'Get inquiry details by ID' })
  async findById(@Param('id', ParseUUIDPipe) id: string) {
    return this.enquiriesService.findById(id);
  }

  @ApiBearerAuth()
  @Patch(':id/status')
  @RequirePermissions('enquiry:manage')
  @ApiOperation({ summary: 'Update inquiry review status and assign to staff' })
  async updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('status') status: EnquiryStatus,
    @CurrentUser('id') assignedToId: string,
  ) {
    return this.enquiriesService.updateStatus(id, status, assignedToId);
  }
}
