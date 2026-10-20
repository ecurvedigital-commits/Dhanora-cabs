import { HealthController } from './health.controller';
import { HealthCheckService } from '@nestjs/terminus';
import { HealthResponseSchema } from '@dehradun/contracts';

describe('HealthController (Unit)', () => {
  let healthController: HealthController;
  let mockHealthCheckService: Partial<HealthCheckService>;

  beforeEach(() => {
    mockHealthCheckService = {
      check: jest.fn(),
    };
    healthController = new HealthController(mockHealthCheckService as HealthCheckService);
  });

  it('should be defined', () => {
    expect(healthController).toBeDefined();
  });

  it('should return valid health status satisfying HealthResponseSchema', () => {
    const result = healthController.check();

    expect(result).toBeDefined();
    expect(result.status).toBe('ok');
    expect(result.service).toBe('api');
    expect(typeof result.uptime).toBe('number');
    expect(result.uptime).toBeGreaterThanOrEqual(0);

    const parseResult = HealthResponseSchema.safeParse(result);
    expect(parseResult.success).toBe(true);
  });
});
