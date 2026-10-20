import { PricingService } from './pricing.service';
import { PrismaService } from '../../common/prisma/prisma.service';
import { ServiceType } from '@dehradun/prisma';

describe('PricingService (Unit)', () => {
  let pricingService: PricingService;
  let mockPrismaService: Partial<PrismaService>;

  beforeEach(() => {
    mockPrismaService = {
      rateRule: {
        findFirst: jest.fn().mockResolvedValue(null),
        findMany: jest.fn().mockResolvedValue([]),
      } as any,
    };
    pricingService = new PricingService(mockPrismaService as PrismaService);
  });

  describe('resolveRouteDistance', () => {
    it('should return default fallback when both pickup and dropoff are missing', async () => {
      const res = await pricingService.resolveRouteDistance(undefined, undefined, 25, 1.5);
      expect(res.distanceKm).toBe(25);
      expect(res.durationHours).toBe(1.5);
      expect(res.source).toBe('default');
    });

    it('should resolve Dehradun to Mussoorie via curated Uttarakhand matrix', async () => {
      const res = await pricingService.resolveRouteDistance('Dehradun Clock Tower', 'Mussoorie Mall Road');
      expect(res.distanceKm).toBe(35);
      expect(res.durationHours).toBe(1.5);
      expect(res.source).toBe('uttarakhand_matrix');
      expect(res.summary).toContain('Mussoorie');
    });

    it('should resolve Jolly Grant Airport to Rishikesh correctly', async () => {
      const res = await pricingService.resolveRouteDistance('Jolly Grant Airport', 'Rishikesh Tapovan');
      expect(res.distanceKm).toBe(21);
      expect(res.durationHours).toBe(0.5);
      expect(res.source).toBe('uttarakhand_matrix');
    });

    it('should resolve Dehradun to Delhi NCR correctly', async () => {
      const res = await pricingService.resolveRouteDistance('Dehradun ISBT', 'Delhi IGI Airport T3');
      expect(res.distanceKm).toBe(255);
      expect(res.durationHours).toBe(5.5);
      expect(res.source).toBe('uttarakhand_matrix');
    });
  });

  describe('calculateIndicativeFare', () => {
    it('should correctly calculate indicative fare with fallback tariff, GST, and 25% advance', async () => {
      const result = await pricingService.calculateIndicativeFare({
        serviceType: ServiceType.OUTSTATION,
        categoryId: 'sedan-cat-1',
        pickupLocation: 'Dehradun',
        dropoffLocation: 'Mussoorie',
      });

      expect(result).toBeDefined();
      expect(result.estimatedDistanceKm).toBe(35);
      expect(result.currency).toBe('INR');

      // Base fare 200000 (30km base) + 5km extra * 1800 (9000) + 15000 (outstation toll) + 10000 (parking)
      // subtotal = 200000 + 9000 + 15000 + 10000 = 234000 paise
      // tax = 5% of 234000 = 11700 paise
      // total = 245700 paise
      // advance = 25% of 245700 = 61425 paise
      expect(result.baseFarePaise).toBe(200000);
      expect(result.tollEstimatePaise).toBe(15000);
      expect(result.parkingEstimatePaise).toBe(10000);
      expect(result.taxPercent).toBe(5);
      expect(result.taxPaise).toBe(11700);
      expect(result.totalFarePaise).toBe(245700);
      expect(result.advanceRequiredPaise).toBe(61425);
    });
  });
});
