import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD, APP_FILTER } from '@nestjs/core';

import { PrismaModule } from './common/prisma/prisma.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { PermissionsGuard } from './common/guards/permissions.guard';

import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { CustomersModule } from './modules/customers/customers.module';
import { PricingModule } from './modules/pricing/pricing.module';
import { FleetModule } from './modules/fleet/fleet.module';
import { DriversModule } from './modules/drivers/drivers.module';
import { AvailabilityModule } from './modules/availability/availability.module';
import { TripsModule } from './modules/trips/trips.module';
import { BookingsModule } from './modules/bookings/bookings.module';
import { PackagesModule } from './modules/packages/packages.module';
import { EnquiriesModule } from './modules/enquiries/enquiries.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { ExpensesModule } from './modules/expenses/expenses.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { CmsModule } from './modules/cms/cms.module';
import { SeoModule } from './modules/seo/seo.module';
import { ReportsModule } from './modules/reports/reports.module';
import { UploadsModule } from './modules/uploads/uploads.module';
import { AuditModule } from './modules/audit/audit.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => [
        {
          name: 'default',
          ttl: config.get<number>('THROTTLE_TTL') ? Number(config.get('THROTTLE_TTL')) : 60000,
          limit: config.get<number>('THROTTLE_LIMIT') ? Number(config.get('THROTTLE_LIMIT')) : 1200, // 1200 req/min (10x higher throughput)
        },
        {
          name: 'burst',
          ttl: 5000,
          limit: config.get<number>('THROTTLE_BURST_LIMIT') ? Number(config.get('THROTTLE_BURST_LIMIT')) : 150, // 150 req/5s burst protection
        },
      ],
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    CustomersModule,
    PricingModule,
    FleetModule,
    DriversModule,
    AvailabilityModule,
    TripsModule,
    BookingsModule,
    PackagesModule,
    EnquiriesModule,
    PaymentsModule,
    ExpensesModule,
    NotificationsModule,
    CmsModule,
    SeoModule,
    ReportsModule,
    UploadsModule,
    AuditModule,
    HealthModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionsGuard,
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}
