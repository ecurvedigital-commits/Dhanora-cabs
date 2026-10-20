import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ServiceType } from '@dehradun/prisma';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  Max,
  Min,
} from 'class-validator';

export class CreateBookingDto {
  @ApiProperty({ example: 'Aarav Sharma' })
  @IsString()
  @IsNotEmpty()
  customerName!: string;

  @ApiProperty({ example: '+919876543210' })
  @IsString()
  @Matches(/^\+?[1-9]\d{9,14}$/, { message: 'Customer phone must be a valid international or Indian mobile number' })
  customerPhone!: string;

  @ApiPropertyOptional({ example: 'aarav@example.com' })
  @IsOptional()
  @IsEmail()
  customerEmail?: string;

  @ApiProperty({ enum: ServiceType, example: ServiceType.LOCAL_TAXI })
  @IsEnum(ServiceType)
  serviceType!: ServiceType;

  @ApiProperty({ example: 'sedan or a0000000-0000-0000-0000-000000000001' })
  @IsString()
  @IsNotEmpty()
  vehicleCategoryId!: string;

  @ApiProperty({ example: 'Jolly Grant Airport, Dehradun' })
  @IsString()
  @IsNotEmpty()
  pickupAddress!: string;

  @ApiPropertyOptional({ example: 30.1897 })
  @IsOptional()
  @IsNumber()
  pickupLatitude?: number;

  @ApiPropertyOptional({ example: 78.1804 })
  @IsOptional()
  @IsNumber()
  pickupLongitude?: number;

  @ApiPropertyOptional({ example: 'Hotel Pacific, Subhash Road, Dehradun' })
  @IsOptional()
  @IsString()
  dropAddress?: string;

  @ApiPropertyOptional({ example: 30.3256 })
  @IsOptional()
  @IsNumber()
  dropLatitude?: number;

  @ApiPropertyOptional({ example: 78.0437 })
  @IsOptional()
  @IsNumber()
  dropLongitude?: number;

  @ApiProperty({ example: '2026-10-25T10:00:00.000Z' })
  @Type(() => Date)
  @IsDate()
  scheduledStart!: Date;

  @ApiPropertyOptional({ default: 1, minimum: 1, maximum: 50 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(50)
  passengerCount: number = 1;

  @ApiPropertyOptional({ default: 0, minimum: 0, maximum: 50 })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(50)
  luggageCount: number = 0;

  @ApiPropertyOptional({ example: 'Customer requests driver with hill badge experience.' })
  @IsOptional()
  @IsString()
  specialInstructions?: string;

  @ApiPropertyOptional({ example: 'req-idemp-dev-001' })
  @IsOptional()
  @IsString()
  idempotencyKey?: string;
}
