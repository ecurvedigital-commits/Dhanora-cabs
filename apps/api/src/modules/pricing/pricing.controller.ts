import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PricingService } from './pricing.service';
import { Public } from '../../common/decorators/public.decorator';
import { ServiceType } from '@dehradun/prisma';
import { IsEnum, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

export class EstimateFareDto {
  @IsEnum(ServiceType)
  serviceType!: ServiceType;

  @IsUUID()
  categoryId!: string;

  @IsOptional()
  @IsNumber()
  estimatedDistanceKm?: number;

  @IsOptional()
  @IsNumber()
  durationHours?: number;

  @IsOptional()
  @IsString()
  pickupLocation?: string;

  @IsOptional()
  @IsString()
  dropoffLocation?: string;
}

@ApiTags('Pricing & Tariffs')
@Controller('pricing')
export class PricingController {
  constructor(private readonly pricingService: PricingService) {}

  @Public()
  @Post('estimate')
  @ApiOperation({ summary: 'Calculate indicative fare based on route distance and vehicle category' })
  async estimateFare(@Body() dto: EstimateFareDto) {
    return this.pricingService.calculateIndicativeFare(dto);
  }

  @Public()
  @Get('rules')
  @ApiOperation({ summary: 'List all active tariffs and rate rules' })
  async getRules() {
    return this.pricingService.getAllRateRules();
  }
}
