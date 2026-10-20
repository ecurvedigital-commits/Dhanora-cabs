import {
  PrismaClient,
  BookingStatus,
  ServiceType,
  PaymentStatus,
  PaymentMethod,
  PaymentGateway,
  AssignmentStatus,
  TripStatus,
  DepartureStatus,
  CmsStatus,
  InvoiceStatus,
} from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('=== Dehradun Taxi & Travel Platform — Database Seeding ===');

  // ──────────────────────────────────────────────────────────
  // 1. PRODUCTION ENVIRONMENT GUARD
  // Requirement 9: Never seed production with sample customer information.
  // ──────────────────────────────────────────────────────────
  const env = (process.env.NODE_ENV || 'development').trim();
  const appEnv = (process.env.APP_ENV || 'development').trim();
  if (env === 'production' || appEnv === 'production') {
    console.error('FATAL ERROR: Refusing to seed database in PRODUCTION environment!');
    console.error('Sample customer information must never be inserted into production.');
    process.exit(1);
  }

  console.log(`[INFO] Current Environment: ${env}. Proceeding with development seed.`);

  // ──────────────────────────────────────────────────────────
  // 2. PERMISSIONS & ROLES (RBAC)
  // ──────────────────────────────────────────────────────────
  console.log('[1/10] Seeding Permissions & Roles...');
  const permissionsData = [
    { action: 'confirm', resource: 'booking', description: 'Manually confirm booking requests' },
    { action: 'cancel', resource: 'booking', description: 'Cancel bookings' },
    { action: 'view', resource: 'booking', description: 'View booking details' },
    { action: 'assign', resource: 'driver', description: 'Assign driver to a trip' },
    { action: 'assign', resource: 'vehicle', description: 'Assign vehicle to a trip' },
    { action: 'refund', resource: 'payment', description: 'Issue customer refunds' },
    { action: 'correct', resource: 'finance', description: 'Make auditable financial corrections' },
    { action: 'manage', resource: 'rates', description: 'Manage pricing rules and tariffs' },
    { action: 'manage', resource: 'cms', description: 'Publish and edit CMS content' },
  ];

  const permissions = [];
  for (const perm of permissionsData) {
    const p = await prisma.permission.upsert({
      where: { action_resource: { action: perm.action, resource: perm.resource } },
      update: { description: perm.description },
      create: perm,
    });
    permissions.push(p);
  }

  const superAdminRole = await prisma.role.upsert({
    where: { slug: 'SUPER_ADMIN' },
    update: { description: 'Full platform administrative control [FICTIONAL]' },
    create: {
      name: 'Super Administrator',
      slug: 'SUPER_ADMIN',
      description: 'Full platform administrative control [FICTIONAL]',
      isSystem: true,
    },
  });

  const dispatcherRole = await prisma.role.upsert({
    where: { slug: 'DISPATCHER' },
    update: { description: 'Fleet and driver dispatch controller [FICTIONAL]' },
    create: {
      name: 'Dispatcher',
      slug: 'DISPATCHER',
      description: 'Fleet and driver dispatch controller [FICTIONAL]',
      isSystem: true,
    },
  });

  const operatorRole = await prisma.role.upsert({
    where: { slug: 'OPERATOR' },
    update: { description: 'Customer service and booking review operator [FICTIONAL]' },
    create: {
      name: 'Operator',
      slug: 'OPERATOR',
      description: 'Customer service and booking review operator [FICTIONAL]',
      isSystem: true,
    },
  });

  const financeRole = await prisma.role.upsert({
    where: { slug: 'FINANCE' },
    update: { description: 'Finance, invoices, refunds and billing lead [FICTIONAL]' },
    create: {
      name: 'Finance Lead',
      slug: 'FINANCE',
      description: 'Finance, invoices, refunds and billing lead [FICTIONAL]',
      isSystem: true,
    },
  });

  // Link permissions to roles
  for (const perm of permissions) {
    await prisma.rolePermission.upsert({
      where: { roleId_permissionId: { roleId: superAdminRole.id, permissionId: perm.id } },
      update: {},
      create: { roleId: superAdminRole.id, permissionId: perm.id },
    });
  }

  // ──────────────────────────────────────────────────────────
  // 3. STAFF USERS & ROLE ASSIGNMENTS
  // ──────────────────────────────────────────────────────────
  console.log('[2/10] Seeding Administrative & Operational Staff Users...');
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@dehradun-travel.local' },
    update: { fullName: '[FICTIONAL] Admin Vikram Rawat' },
    create: {
      email: 'admin@dehradun-travel.local',
      passwordHash: '$2b$10$devFictionalHashOnlyNotForProdUse000000000000000000000',
      fullName: '[FICTIONAL] Admin Vikram Rawat',
      phone: '+919876543201',
      isSuperAdmin: true,
      isActive: true,
    },
  });

  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: adminUser.id, roleId: superAdminRole.id } },
    update: {},
    create: { userId: adminUser.id, roleId: superAdminRole.id },
  });

  const dispatcherUser = await prisma.user.upsert({
    where: { email: 'dispatcher@dehradun-travel.local' },
    update: { fullName: '[FICTIONAL] Dispatcher Anita Negi' },
    create: {
      email: 'dispatcher@dehradun-travel.local',
      passwordHash: '$2b$10$devFictionalHashOnlyNotForProdUse000000000000000000000',
      fullName: '[FICTIONAL] Dispatcher Anita Negi',
      phone: '+919876543202',
      isActive: true,
    },
  });

  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: dispatcherUser.id, roleId: dispatcherRole.id } },
    update: {},
    create: { userId: dispatcherUser.id, roleId: dispatcherRole.id, assignedById: adminUser.id },
  });

  // ──────────────────────────────────────────────────────────
  // 4. CUSTOMERS & CUSTOMER NOTES
  // Requirement 8: Clearly labelled fictional data only
  // ──────────────────────────────────────────────────────────
  console.log('[3/10] Seeding Fictional Customers & Operator Notes...');
  const customer1 = await prisma.customer.upsert({
    where: { phone: '+919876500001' },
    update: { fullName: '[FICTIONAL] Aarav Sharma' },
    create: {
      fullName: '[FICTIONAL] Aarav Sharma',
      phone: '+919876500001',
      email: 'aarav.fictional@example.test',
      city: 'Dehradun',
      state: 'Uttarakhand',
      address: '12 Rajpur Road, Dehradun',
      totalBookings: 2,
      lifetimeSpendPaise: BigInt(650000), // ₹6,500.00
    },
  });

  const customer2 = await prisma.customer.upsert({
    where: { phone: '+919876500002' },
    update: { fullName: '[FICTIONAL] Priya Joshi' },
    create: {
      fullName: '[FICTIONAL] Priya Joshi',
      phone: '+919876500002',
      email: 'priya.fictional@example.test',
      city: 'Delhi',
      state: 'Delhi',
      address: 'B-44 Connaught Place, New Delhi',
      totalBookings: 1,
      lifetimeSpendPaise: BigInt(3500000), // ₹35,000.00
    },
  });

  // Customer Note
  const existingNotes = await prisma.customerNote.findMany({ where: { customerId: customer1.id } });
  if (existingNotes.length === 0) {
    await prisma.customerNote.create({
      data: {
        customerId: customer1.id,
        authorId: adminUser.id,
        note: '[FICTIONAL NOTE] Prefers mountain-experienced drivers; travelling with senior citizens.',
        isPinned: true,
      },
    });
  }

  // ──────────────────────────────────────────────────────────
  // 5. VEHICLE CATEGORIES, FLEET & DRIVERS
  // ──────────────────────────────────────────────────────────
  console.log('[4/10] Seeding Vehicle Categories, Fleet & Drivers...');
  const catSedan = await prisma.vehicleCategory.upsert({
    where: { slug: 'sedan' },
    update: { name: 'Comfort Sedan (Dzire / Etios) [FICTIONAL]' },
    create: {
      name: 'Comfort Sedan (Dzire / Etios) [FICTIONAL]',
      slug: 'sedan',
      seatingCapacity: 4,
      luggageCapacity: 3,
      airConditioned: true,
      description: 'Ideal for small families and local city commutes in Dehradun & Mussoorie.',
      sortOrder: 1,
    },
  });

  const catSuv = await prisma.vehicleCategory.upsert({
    where: { slug: 'suv-innova' },
    update: { name: 'Premium Mountain SUV (Innova Crysta) [FICTIONAL]' },
    create: {
      name: 'Premium Mountain SUV (Innova Crysta) [FICTIONAL]',
      slug: 'suv-innova',
      seatingCapacity: 6,
      luggageCapacity: 5,
      airConditioned: true,
      description: 'Top choice for Char Dham Yatra, mountain terrains, and outstation tours.',
      sortOrder: 2,
    },
  });

  const catTempo = await prisma.vehicleCategory.upsert({
    where: { slug: 'tempo-traveller-12' },
    update: { name: 'Tempo Traveller (12 Seater) [FICTIONAL]' },
    create: {
      name: 'Tempo Traveller (12 Seater) [FICTIONAL]',
      slug: 'tempo-traveller-12',
      seatingCapacity: 12,
      luggageCapacity: 10,
      airConditioned: true,
      description: 'Spacious high-roof minibus for group trekking and pilgrimage expeditions.',
      sortOrder: 3,
    },
  });

  const vehicleInnova = await prisma.vehicle.upsert({
    where: { registrationNumber: 'UK07-DEV-0001' },
    update: {},
    create: {
      categoryId: catSuv.id,
      registrationNumber: 'UK07-DEV-0001',
      make: 'Toyota',
      model: 'Innova Crysta 2.4 VX [FICTIONAL]',
      year: 2023,
      color: 'Pearl White',
      vin: 'MBJ11DEV000100001',
      insuranceExpiry: new Date('2028-12-31'),
      fitnessExpiry: new Date('2028-12-31'),
      permitExpiry: new Date('2028-12-31'),
      pucExpiry: new Date('2027-12-31'),
      isAvailable: true,
      isActive: true,
    },
  });

  const vehicleSedan = await prisma.vehicle.upsert({
    where: { registrationNumber: 'UK07-DEV-0002' },
    update: {},
    create: {
      categoryId: catSedan.id,
      registrationNumber: 'UK07-DEV-0002',
      make: 'Maruti Suzuki',
      model: 'Dzire ZXi [FICTIONAL]',
      year: 2022,
      color: 'Silky Silver',
      vin: 'MBJ11DEV000100002',
      insuranceExpiry: new Date('2027-12-31'),
      fitnessExpiry: new Date('2027-12-31'),
      permitExpiry: new Date('2027-12-31'),
      pucExpiry: new Date('2027-12-31'),
      isAvailable: true,
      isActive: true,
    },
  });

  const driver1 = await prisma.driver.upsert({
    where: { phone: '+919876510001' },
    update: { fullName: '[FICTIONAL] Suresh Singh Rawat' },
    create: {
      fullName: '[FICTIONAL] Suresh Singh Rawat',
      phone: '+919876510001',
      licenseNumber: 'DL-UK07-DEV-0001',
      licenseExpiry: new Date('2030-05-15'),
      badgeNumber: 'MB-GARHWAL-001',
      experienceYears: 12,
      rating: 4.95,
      isAvailable: true,
      isActive: true,
      verifiedAt: new Date('2024-01-01'),
    },
  });

  const driver2 = await prisma.driver.upsert({
    where: { phone: '+919876510002' },
    update: { fullName: '[FICTIONAL] Rajesh Chauhan' },
    create: {
      fullName: '[FICTIONAL] Rajesh Chauhan',
      phone: '+919876510002',
      licenseNumber: 'DL-UK07-DEV-0002',
      licenseExpiry: new Date('2032-08-20'),
      badgeNumber: 'MB-GARHWAL-002',
      experienceYears: 8,
      rating: 4.80,
      isAvailable: true,
      isActive: true,
      verifiedAt: new Date('2024-01-01'),
    },
  });

  // ──────────────────────────────────────────────────────────
  // 6. RATE RULES (MONEY IN PAISE, NO FLOATS)
  // Requirement 2: Integer minor currency units (paise)
  // ──────────────────────────────────────────────────────────
  console.log('[5/10] Seeding Tariffs & Rate Rules...');
  const existingRules = await prisma.rateRule.findMany({ where: { categoryId: catSedan.id } });
  if (existingRules.length === 0) {
    await prisma.rateRule.create({
      data: {
        name: 'Local Dehradun Sightseeing - Sedan Tariff [FICTIONAL]',
        serviceType: ServiceType.LOCAL_TAXI,
        categoryId: catSedan.id,
        baseFarePaise: 180000, // ₹1,800.00
        baseDistanceKm: 40.0,
        perKmRatePaise: 1600,  // ₹16.00/km
        perMinuteRatePaise: 200,
        deadMileageRatePaise: 0,
        driverDayAllowancePaise: 30000,
        nightHaltChargePaise: 40000,
        effectiveFrom: new Date('2026-01-01'),
        isActive: true,
      },
    });

    await prisma.rateRule.create({
      data: {
        name: 'Char Dham Mountain Tour - SUV Tariff [FICTIONAL]',
        serviceType: ServiceType.OUTSTATION,
        categoryId: catSuv.id,
        baseFarePaise: 450000, // ₹4,500.00
        baseDistanceKm: 250.0,
        perKmRatePaise: 2200,  // ₹22.00/km
        deadMileageRatePaise: 1100,
        driverDayAllowancePaise: 50000,
        nightHaltChargePaise: 80000,
        effectiveFrom: new Date('2026-01-01'),
        isActive: true,
      },
    });
  }

  // ──────────────────────────────────────────────────────────
  // 7. TOUR PACKAGES, ITINERARIES & DEPARTURES
  // ──────────────────────────────────────────────────────────
  console.log('[6/10] Seeding Tour Packages & Itineraries...');
  const catCharDham = await prisma.packageCategory.upsert({
    where: { slug: 'char-dham-yatra' },
    update: {},
    create: {
      name: 'Char Dham Pilgrimage [FICTIONAL]',
      slug: 'char-dham-yatra',
      description: 'Sacred journey to Yamunotri, Gangotri, Kedarnath, and Badrinath.',
    },
  });

  const tourCharDham = await prisma.tourPackage.upsert({
    where: { slug: 'luxury-char-dham-yatra-10d' },
    update: {},
    create: {
      categoryId: catCharDham.id,
      title: 'Luxury Char Dham Yatra from Dehradun (10D/9N) [FICTIONAL]',
      slug: 'luxury-char-dham-yatra-10d',
      summary: 'All-inclusive 10-day sacred pilgrimage with premium SUV and mountain guide.',
      description: 'Full guided tour starting and ending at Dehradun with comfortable stays and VIP darshan assistance.',
      durationDays: 10,
      durationNights: 9,
      pickupLocation: 'Dehradun Railway Station / Airport',
      dropLocation: 'Dehradun Airport / Railway Station',
      difficultyLevel: 'MODERATE',
      season: 'May - October',
      basePricePaise: 5500000, // ₹55,000.00
      maxGroupSize: 12,
      inclusions: ['Premium SUV transport', '3-Star Hotel stays', 'Breakfast and Dinner', 'Hill-permit and tolls'],
      exclusions: ['Helicopter tickets to Kedarnath', 'Personal porter/pony expenses', 'GST 5%'],
      isPublished: true,
    },
  });

  await prisma.itineraryDay.upsert({
    where: { packageId_dayNumber: { packageId: tourCharDham.id, dayNumber: 1 } },
    update: {},
    create: {
      packageId: tourCharDham.id,
      dayNumber: 1,
      title: 'Dehradun to Barkot via Mussoorie & Kempty Falls',
      description: 'Depart Dehradun in morning. Scenic mountain drive via Mussoorie to Barkot. Acclimatization night stay.',
      accommodation: 'Camp Nirvana / Hotel Himalayan Pine Barkot',
      mealsIncluded: ['Dinner'],
      activities: ['Scenic drive', 'Kempty Falls halt'],
    },
  });

  const existingDepartures = await prisma.packageDeparture.findMany({ where: { packageId: tourCharDham.id } });
  if (existingDepartures.length === 0) {
    await prisma.packageDeparture.create({
      data: {
        packageId: tourCharDham.id,
        departureDate: new Date('2026-10-25'),
        returnDate: new Date('2026-11-03'),
        maxSeats: 12,
        availableSeats: 8,
        pricePerPersonPaise: 5500000,
        status: DepartureStatus.SCHEDULED,
      },
    });
  }

  // ──────────────────────────────────────────────────────────
  // 8. BOOKINGS & FARE SNAPSHOTS
  // CRITICAL RULE: Booking starts as PENDING_REVIEW.
  // Never auto-confirm upon creation or payment.
  // ──────────────────────────────────────────────────────────
  console.log('[7/10] Seeding Bookings & Immutable Fare Snapshots...');

  // Booking 1: New request -> PENDING_REVIEW
  const booking1 = await prisma.booking.upsert({
    where: { bookingNumber: 'BK-2026-0001' },
    update: {},
    create: {
      bookingNumber: 'BK-2026-0001',
      customerId: customer1.id,
      serviceType: ServiceType.LOCAL_TAXI,
      status: BookingStatus.PENDING_REVIEW, // MUST BE PENDING_REVIEW
      pickupAddress: 'Jolly Grant Airport, Dehradun',
      dropAddress: 'Hotel Pacific, Subhash Road, Dehradun',
      scheduledStart: new Date('2026-10-20T10:00:00Z'),
      passengerCount: 2,
      luggageCount: 2,
      specialInstructions: '[FICTIONAL] Customer requested driver with hill terrain experience.',
    },
  });

  // Booking 2: Confirmed booking with locked FareSnapshot
  const booking2 = await prisma.booking.upsert({
    where: { bookingNumber: 'BK-2026-0002' },
    update: {},
    create: {
      bookingNumber: 'BK-2026-0002',
      customerId: customer2.id,
      serviceType: ServiceType.OUTSTATION,
      status: BookingStatus.CONFIRMED,
      pickupAddress: 'Clock Tower, Dehradun',
      dropAddress: 'Mall Road, Mussoorie',
      scheduledStart: new Date('2026-10-22T08:00:00Z'),
      passengerCount: 4,
      luggageCount: 3,
    },
  });

  await prisma.fareSnapshot.upsert({
    where: { bookingId: booking2.id },
    update: {},
    create: {
      bookingId: booking2.id,
      baseFarePaise: 250000,
      distanceRatePaise: 2200,
      estimatedDistanceKm: 38.5,
      tollEstimatePaise: 15000,
      parkingEstimatePaise: 20000,
      taxPercent: 5.0,
      taxPaise: 14250,
      totalFarePaise: 299250, // ₹2,992.50
      advanceRequiredPaise: 100000,
      pricingRulesSnapshotJson: {
        tariffName: 'Mussoorie Outstation Tariff 2026',
        rateRuleId: 'RULE-DEV-001',
      },
      confirmedAt: new Date(),
      confirmedById: adminUser.id,
    },
  });

  // ──────────────────────────────────────────────────────────
  // 9. TRIPS, DISPATCH & AUDITABLE FINANCIALS
  // ──────────────────────────────────────────────────────────
  console.log('[8/10] Seeding Payments, Invoices & Dispatch records...');
  await prisma.payment.upsert({
    where: { paymentNumber: 'PAY-2026-0001' },
    update: {},
    create: {
      bookingId: booking2.id,
      paymentNumber: 'PAY-2026-0001',
      amountPaise: 100000, // ₹1,000.00 advance
      currency: 'INR',
      status: PaymentStatus.CAPTURED,
      method: PaymentMethod.UPI,
      gateway: PaymentGateway.RAZORPAY,
      gatewayTransactionId: 'pay_dev_fictional_0001',
      gatewayOrderId: 'order_dev_fictional_0001',
      paidAt: new Date(),
    },
  });

  await prisma.invoice.upsert({
    where: { invoiceNumber: 'INV-2026-0001' },
    update: {},
    create: {
      bookingId: booking2.id,
      invoiceNumber: 'INV-2026-0001',
      subtotalPaise: 285000,
      taxPaise: 14250,
      totalAmountPaise: 299250,
      paidAmountPaise: 100000,
      status: InvoiceStatus.ISSUED,
      billingName: '[FICTIONAL] Priya Joshi',
      billingAddress: 'B-44 Connaught Place, New Delhi',
    },
  });

  // ──────────────────────────────────────────────────────────
  // 10. CMS, SEO & SYSTEM SETTINGS
  // ──────────────────────────────────────────────────────────
  console.log('[9/10] Seeding CMS Articles & SEO Metadata...');
  const cmsPage = await prisma.cmsPage.upsert({
    where: { slug: 'dehradun-to-mussoorie-taxi-guide' },
    update: {},
    create: {
      title: 'Complete Dehradun to Mussoorie Taxi Guide 2026 [FICTIONAL]',
      slug: 'dehradun-to-mussoorie-taxi-guide',
      contentJson: {
        intro: 'Comprehensive travel guide for hiring verified taxis from Dehradun to Mussoorie.',
        distanceKm: 35,
        travelTime: '1 hr 15 mins',
      },
      status: CmsStatus.PUBLISHED,
      publishedAt: new Date(),
      authorId: adminUser.id,
    },
  });

  await prisma.seoMetadata.upsert({
    where: { entityType_entityId: { entityType: 'PAGE', entityId: cmsPage.id } },
    update: {},
    create: {
      entityType: 'PAGE',
      entityId: cmsPage.id,
      pagePath: '/guides/dehradun-to-mussoorie-taxi',
      metaTitle: 'Dehradun to Mussoorie Taxi Service | Fixed Fares & Mountain Drivers',
      metaDescription: 'Book reliable taxi service from Dehradun to Mussoorie with verified mountain drivers.',
      keywords: ['dehradun to mussoorie taxi', 'dehradun cab service'],
    },
  });

  console.log('[10/10] Seeding System Settings...');
  await prisma.systemSetting.upsert({
    where: { key: 'PLATFORM_NAME' },
    update: { value: 'Dehradun Travel & Safari Co.' },
    create: {
      key: 'PLATFORM_NAME',
      value: 'Dehradun Travel & Safari Co.',
      description: 'Platform branding name',
      isPublic: true,
      updatedById: adminUser.id,
    },
  });

  await prisma.systemSetting.upsert({
    where: { key: 'EMERGENCY_SUPPORT_NUMBER' },
    update: { value: '+91-135-2712345' },
    create: {
      key: 'EMERGENCY_SUPPORT_NUMBER',
      value: '+91-135-2712345',
      description: '24/7 Dehradun dispatch hotline',
      isPublic: true,
      updatedById: adminUser.id,
    },
  });

  console.log('=== Database Seeding Completed Successfully ===');
}

main()
  .catch((e) => {
    console.error('Fatal Seeding Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
