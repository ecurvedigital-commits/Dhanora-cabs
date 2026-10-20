import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { ServiceType } from '@dehradun/prisma';

export interface IndicativePriceInput {
  serviceType: ServiceType;
  categoryId: string;
  estimatedDistanceKm?: number;
  durationHours?: number;
  pickupLocation?: string;
  dropoffLocation?: string;
}

export interface IndicativePriceResult {
  baseFarePaise: number;
  distanceRatePaise: number;
  estimatedDistanceKm: number;
  durationHours: number;
  perHourRatePaise: number;
  tollEstimatePaise: number;
  parkingEstimatePaise: number;
  taxPercent: number;
  taxPaise: number;
  totalFarePaise: number;
  advanceRequiredPaise: number;
  currency: string;
  routeSource?: 'google_maps' | 'uttarakhand_matrix' | 'input' | 'default';
  routeSummary?: string;
  pricingRulesSnapshotJson: Record<string, any>;
}

@Injectable()
export class PricingService {
  constructor(private readonly prisma: PrismaService) {}

  async resolveRouteDistance(
    pickup?: string,
    dropoff?: string,
    fallbackKm = 30,
    fallbackHours = 2,
  ): Promise<{ distanceKm: number; durationHours: number; source: 'google_maps' | 'uttarakhand_matrix' | 'input' | 'default'; summary: string }> {
    if (!pickup && !dropoff) {
      return {
        distanceKm: fallbackKm,
        durationHours: fallbackHours,
        source: 'default',
        summary: 'Standard local base calculation',
      };
    }

    const text = `${pickup || ''} ${dropoff || ''}`.toLowerCase();

    // 1. Google Maps Distance Matrix API (if key is configured)
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    if (apiKey && pickup && dropoff) {
      try {
        const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(
          pickup,
        )}&destinations=${encodeURIComponent(dropoff)}&key=${apiKey}`;
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 3500);
        const res = await fetch(url, { signal: controller.signal });
        clearTimeout(timeout);
        if (res.ok) {
          const data = (await res.json()) as any;
          if (data.rows?.[0]?.elements?.[0]?.status === 'OK') {
            const distanceMeters = data.rows[0].elements[0].distance.value;
            const durationSeconds = data.rows[0].elements[0].duration.value;
            const distanceKm = Math.round(distanceMeters / 1000);
            const durationHours = Math.round((durationSeconds / 3600) * 10) / 10;
            return {
              distanceKm,
              durationHours,
              source: 'google_maps',
              summary: `${pickup} → ${dropoff} via Google Maps (${distanceKm} km)`,
            };
          }
        }
      } catch (err) {
        // Fall back gracefully to curated matrix
      }
    }

    // 2. Curated Uttarakhand Mountain Highway Matrix
    const matrix: Array<{ match: (t: string) => boolean; km: number; hours: number; label: string }> = [
      { match: (t) => t.includes('delhi') || t.includes('ncr') || t.includes('gurgaon') || t.includes('noida'), km: 255, hours: 5.5, label: 'Dehradun ⇄ Delhi NCR' },
      { match: (t) => t.includes('chandigarh') || t.includes('mohali'), km: 170, hours: 4.0, label: 'Dehradun ⇄ Chandigarh' },
      { match: (t) => t.includes('kedarnath') || t.includes('gaurikund'), km: 245, hours: 8.5, label: 'Dehradun ⇄ Kedarnath (Gaurikund)' },
      { match: (t) => t.includes('badrinath') || t.includes('joshimath'), km: 320, hours: 10.0, label: 'Dehradun ⇄ Badrinath' },
      { match: (t) => t.includes('gangotri'), km: 240, hours: 8.0, label: 'Dehradun ⇄ Gangotri' },
      { match: (t) => t.includes('yamunotri'), km: 180, hours: 6.0, label: 'Dehradun ⇄ Yamunotri' },
      { match: (t) => t.includes('auli'), km: 295, hours: 9.0, label: 'Dehradun ⇄ Auli' },
      { match: (t) => t.includes('nainital'), km: 285, hours: 7.5, label: 'Dehradun ⇄ Nainital' },
      { match: (t) => t.includes('corbett') || t.includes('ramnagar'), km: 220, hours: 5.0, label: 'Dehradun ⇄ Jim Corbett' },
      { match: (t) => t.includes('mussoorie'), km: 35, hours: 1.5, label: 'Dehradun ⇄ Mussoorie' },
      { match: (t) => (t.includes('airport') || t.includes('jolly grant')) && t.includes('rishikesh'), km: 21, hours: 0.5, label: 'Airport ⇄ Rishikesh' },
      { match: (t) => (t.includes('airport') || t.includes('jolly grant')) && t.includes('haridwar'), km: 38, hours: 1.0, label: 'Airport ⇄ Haridwar' },
      { match: (t) => t.includes('airport') || t.includes('jolly grant'), km: 30, hours: 0.8, label: 'Dehradun ⇄ Jolly Grant Airport' },
      { match: (t) => t.includes('rishikesh'), km: 45, hours: 1.2, label: 'Dehradun ⇄ Rishikesh' },
      { match: (t) => t.includes('haridwar'), km: 54, hours: 1.5, label: 'Dehradun ⇄ Haridwar' },
      { match: (t) => t.includes('dhanaulti'), km: 58, hours: 2.2, label: 'Dehradun ⇄ Dhanaulti' },
      { match: (t) => t.includes('chakrata'), km: 88, hours: 3.0, label: 'Dehradun ⇄ Chakrata' },
    ];

    for (const item of matrix) {
      if (item.match(text)) {
        return {
          distanceKm: item.km,
          durationHours: item.hours,
          source: 'uttarakhand_matrix',
          summary: `${item.label} (${item.km} km, ~${item.hours} hrs)`,
        };
      }
    }

    return {
      distanceKm: fallbackKm,
      durationHours: fallbackHours,
      source: 'input',
      summary: `${pickup || 'Pickup'} to ${dropoff || 'Dropoff'} (~${fallbackKm} km)`,
    };
  }

  async calculateIndicativeFare(input: IndicativePriceInput): Promise<IndicativePriceResult> {
    const route = await this.resolveRouteDistance(
      input.pickupLocation,
      input.dropoffLocation,
      input.estimatedDistanceKm || 30,
      input.durationHours || 2,
    );

    const estimatedDistanceKm = input.estimatedDistanceKm ?? route.distanceKm;
    const durationHours = input.durationHours ?? route.durationHours;
    const { serviceType, categoryId } = input;

    // Fetch active rate rule
    let rule = await this.prisma.rateRule.findFirst({
      where: {
        serviceType,
        categoryId,
        isActive: true,
      },
      orderBy: { effectiveFrom: 'desc' },
    });

    if (!rule) {
      // Fallback to any active rule for this category
      rule = await this.prisma.rateRule.findFirst({
        where: { categoryId, isActive: true },
        orderBy: { effectiveFrom: 'desc' },
      });
    }

    if (!rule) {
      // Default fallback tariff if no database rule configured
      rule = {
        id: 'DEFAULT_FALLBACK',
        name: 'Standard Dehradun Taxi Tariff',
        serviceType,
        categoryId,
        baseFarePaise: 200000, // ₹2,000.00
        baseDistanceKm: 30 as any,
        perKmRatePaise: 1800,  // ₹18.00/km
        perMinuteRatePaise: 0,
        deadMileageRatePaise: 0,
        driverDayAllowancePaise: 30000,
        nightHaltChargePaise: 50000,
        minimumHours: 2,
        perHourRatePaise: 20000,
        stateTaxIncluded: false,
        effectiveFrom: new Date(),
        effectiveTo: null,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }

    const baseFarePaise = rule.baseFarePaise;
    const baseDistanceKm = Number(rule.baseDistanceKm);
    const extraDistanceKm = Math.max(0, estimatedDistanceKm - baseDistanceKm);
    const distanceRatePaise = rule.perKmRatePaise;
    const distanceFarePaise = Math.round(extraDistanceKm * distanceRatePaise);

    const tollEstimatePaise = serviceType === ServiceType.OUTSTATION ? 15000 : 0; // ₹150 for outstation
    const parkingEstimatePaise = 10000; // ₹100 estimated

    const subtotal = baseFarePaise + distanceFarePaise + tollEstimatePaise + parkingEstimatePaise;
    const taxPercent = 5.0; // 5% GST
    const taxPaise = Math.round(subtotal * 0.05);
    const totalFarePaise = subtotal + taxPaise;
    const advanceRequiredPaise = Math.round(totalFarePaise * 0.25); // 25% advance

    const pricingRulesSnapshotJson = {
      appliedRuleId: rule.id,
      appliedRuleName: rule.name,
      baseFarePaise: rule.baseFarePaise,
      baseDistanceKm,
      perKmRatePaise: rule.perKmRatePaise,
      driverDayAllowancePaise: rule.driverDayAllowancePaise,
      nightHaltChargePaise: rule.nightHaltChargePaise,
      taxPercent,
    };

    return {
      baseFarePaise,
      distanceRatePaise,
      estimatedDistanceKm,
      durationHours,
      perHourRatePaise: rule.perHourRatePaise,
      tollEstimatePaise,
      parkingEstimatePaise,
      taxPercent,
      taxPaise,
      totalFarePaise,
      advanceRequiredPaise,
      currency: 'INR',
      routeSource: route.source,
      routeSummary: route.summary,
      pricingRulesSnapshotJson,
    };
  }

  async getAllRateRules() {
    return this.prisma.rateRule.findMany({
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    });
  }
}
