import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';
import { SkipThrottle } from '@nestjs/throttler';
import type { HealthResponse } from '@dehradun/contracts';

import { Public } from '../common/decorators/public.decorator';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

const startTime = Date.now();

@ApiTags('Health & Monitoring')
@SkipThrottle()
@Controller('health')
export class HealthController {
  constructor(private readonly health: HealthCheckService) {}

  /**
   * GET /api/v1/health
   * Returns service health status.
   */
  @Public()
  @Get()
  @HealthCheck()
  @ApiOperation({ summary: 'System health check and uptime status' })
  check(): HealthResponse {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'api',
      version: process.env.npm_package_version ?? '0.1.0',
      uptime: Math.floor((Date.now() - startTime) / 1000),
    };
  }
}
