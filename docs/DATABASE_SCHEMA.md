# Database Schema Architecture & Entity Design

## 1. Overview & Architectural Principles

The Dehradun Taxi, Outstation Travel, Uttarakhand Tour, Trekking & Safari platform database is built on **PostgreSQL 16+** using **Prisma ORM**.

### Core Guiding Principles:
1. **Primary Keys & References**: Standardized on UUIDv4 (`@id @default(uuid()) @db.Uuid`) across all entities.
2. **Financial Precision**: All monetary values are represented strictly in **integer minor currency units (paise)** (`Int` / `BigInt`) or exact PostgreSQL numerics (`Decimal(10, 2)`). Floating-point types (`Float`) are strictly forbidden for financial calculations.
3. **Immutability of Confirmed Agreements**: `FareSnapshot` records are immutable point-in-time fare contracts locked upon confirmation. Later rate changes never affect confirmed bookings.
4. **Explicit State Machines**:
   - `BookingStatus`: `PENDING_REVIEW`, `CONFIRMED`, `ASSIGNED`, `IN_PROGRESS`, `COMPLETED`, `CANCELLED`, `EXPIRED`, `REJECTED`.
   - `PaymentStatus`: `PENDING`, `AUTHORIZED`, `CAPTURED`, `FAILED`, `REFUNDED`, `PARTIALLY_REFUNDED`, `VOIDED`.
5. **No Automatic Confirmation (Critical Business Rule)**:
   - Every booking starts as `PENDING_REVIEW`.
   - No schema default, trigger, or webhook may automatically transition a booking to `CONFIRMED`.
6. **Double-Booking & Assignment Conflict Prevention**:
   - Explicit trip assignment states: `ASSIGNED`, `ACTIVE`, `RELEASED`, `CANCELLED`.
   - Exclusion logic and partial PostgreSQL unique indexes (`idx_unique_active_vehicle_assignment`, `idx_unique_active_driver_assignment`) prevent overlapping active assignments for the same driver or vehicle.
7. **Auditable Financial Adjustments**:
   - Dedicated `FinancialCorrection` and `Refund` tables with audit trails, reason codes, deltas, and authorized staff IDs.
8. **Deletion & Archival Policies**:
   - Soft deletes (`deletedAt DateTime?`) for master entities (`User`, `Customer`, `Vehicle`, `Driver`, `TourPackage`, `CmsPage`).
   - Referential restrictions (`onDelete: Restrict`) on transactional tables (`Booking`, `Trip`, `Payment`) to prevent accidental cascade loss.

---

## 2. Complete Entity Specifications Across 10 Domains

### 2.1 Identity, RBAC & Staff Management
- **`User`**: System administrative, operational, or driver users. Fields: `id`, `email`, `passwordHash`, `fullName`, `phone`, `isActive`, `isSuperAdmin`, `createdAt`, `updatedAt`, `deletedAt`.
- **`Role`**: Named security roles (e.g., `SUPER_ADMIN`, `FLEET_MANAGER`, `OPERATOR`, `DISPATCHER`, `FINANCE`).
- **`Permission`**: Granular capability records defined as `action:resource` (e.g., `booking:confirm`, `driver:assign`, `payment:refund`).
- **`RolePermission`**: Join table mapping roles to permissions (`roleId`, `permissionId`).
- **`UserRole`**: Staff role assignment mapping users to roles with `assignedById` audit field.

### 2.2 Customer Relations
- **`Customer`**: Public travel client profiles. Tracks contact details, address, aggregate statistics (`totalBookings`, `lifetimeSpendPaise` in paise), and risk flags (`isBlocked`, `blockReason`).
- **`CustomerNote`**: Internal operator notes on customer preferences, medical/altitude cautions, VIP handling, or past disputes with `authorId` audit.

### 2.3 Bookings, History & Fare Snapshots
- **`Booking`**: Central booking agreement. Fields include `bookingNumber`, `serviceType`, `status` (strictly defaults to `PENDING_REVIEW`), scheduled dates, pickup/drop coordinates and addresses, passenger and luggage counts.
- **`BookingStatusHistory`**: Immutable log recording every transition, including `fromStatus`, `toStatus`, `changedById`, and timestamp.
- **`FareSnapshot`**: 1-to-1 snapshot for each booking containing calculated and agreed amounts in integer paise (`baseFarePaise`, `perKmRatePaise`, `estimatedDistanceKm`, `tollEstimatePaise`, `taxPaise`, `totalFarePaise`, `pricingRulesSnapshotJson`, `confirmedById`, `confirmedAt`).

### 2.4 Fleet, Drivers & Rate Rules
- **`VehicleCategory`**: Vehicle classes (e.g., `HATCHBACK`, `SEDAN`, `SUV_INNOVA`, `TEMPO_TRAVELLER`, `4X4_GYPSY`).
- **`Vehicle`**: Physical vehicles with registration number, compliance certificate dates (insurance, fitness, permit, PUC), and operational availability.
- **`Driver`**: Registered chauffeurs and mountain drivers with commercial license details, mountain badges, experience, and verification status.
- **`RateRule`**: Active pricing matrices for route types, categories, dead mileage, night halts, and hill terrain surcharges.

### 2.5 Dispatch, Trips & Conflict Prevention
- **`Trip`**: Concrete operational execution of a confirmed booking.
- **`VehicleAssignment`**: Assignment of a specific vehicle to a trip with lifecycle (`ASSIGNED`, `ACTIVE`, `RELEASED`, `CANCELLED`).
- **`DriverAssignment`**: Assignment of a specific driver to a trip with lifecycle.
- **`TripEvent`**: Telemetry and milestone logs (e.g., `DRIVER_DISPATCHED`, `PASSENGER_PICKED_UP`, `CHECKPOINT_PASSED`, `TRIP_COMPLETED`).

### 2.6 Uttarakhand Tours, Treks & Safaris
- **`PackageCategory`**: Categories (e.g., `CHAR_DHAM`, `TREKKING_EXPEDITION`, `WILDLIFE_SAFARI`, `LOCAL_SIGHTSEEING`).
- **`TourPackage`**: Structured multi-day itineraries with difficulty levels, altitudes, and seasonal availability.
- **`ItineraryDay`**: Day-by-day plan with activities, meals, and overnight stays.
- **`PackageDeparture`**: Scheduled group departure dates with capacity and seat availability.
- **`PackageBooking`**: Specific package reservation links attached to the main `Booking`.

### 2.7 Financials, Invoices, Refunds & Expenses
- **`Payment`**: Records individual gateway or cash receipts with `PaymentStatus` and idempotency tracking.
- **`Refund`**: Authorised refunds linked to payments with approval audit.
- **`FinancialCorrection`**: Auditable adjustments for price recalculations, discounts, or manual corrections with `originalAmountPaise`, `correctedAmountPaise`, and `deltaPaise`.
- **`Invoice`**: Formal GST-compliant tax invoices with unique sequential invoice numbers.
- **`TripExpense`**: On-trip outlays incurred by drivers/operators (toll, parking, state permit, fuel, green cess).

### 2.8 Enquiries, Feedback & Notifications
- **`Enquiry`**: Pre-booking inquiries, custom tour requests, and quotes.
- **`Review`**: Moderated customer reviews with star ratings (1-5).
- **`NotificationLog`**: Outbound SMS, WhatsApp, and email dispatch audit log.

### 2.9 Content Management & SEO
- **`CmsPage`**: Dynamic rich content pages (e.g., Char Dham Travel Guide, Kedarnath Trek Preparation).
- **`MediaAsset`**: Cloud-hosted media items with MIME types and dimensions.
- **`SeoMetadata`**: Polymorphic or entity-linked SEO metadata (title, canonical, OG tags, JSON-LD schema).
- **`RedirectRule`**: 301/302 URL redirects for SEO preservation.

### 2.10 Governance, Audit & Idempotency
- **`AuditLog`**: Tamper-evident record of data mutations across the platform with before/after state snapshots.
- **`IdempotencyKey`**: Request idempotency protection for payments and dispatch actions.
- **`SystemSetting`**: Dynamic system configuration key-value storage.

---

## 3. Database Indexes & Unique Constraints

| Table | Index / Constraint | Purpose |
|---|---|---|
| `users` | `@@index([email])`, `@@index([isActive])` | Fast auth and active user lookups |
| `customers` | `@@unique([phone])`, `@@index([email])` | Fast deduplication and customer lookup |
| `bookings` | `@@unique([bookingNumber])`, `@@index([customerId])`, `@@index([status])`, `@@index([scheduledStart])` | Core booking list, status filtering and schedule sorting |
| `fare_snapshots` | `@@unique([bookingId])` | Ensures strict 1:1 relationship with immutable agreement |
| `vehicles` | `@@unique([registrationNumber])`, `@@index([isAvailable, isActive])` | Fast dispatch availability checks |
| `vehicle_assignments` | Partial Unique: `WHERE status = 'ACTIVE'` | **Prevents vehicle double-booking at DB level** |
| `driver_assignments` | Partial Unique: `WHERE status = 'ACTIVE'` | **Prevents driver double-booking at DB level** |
| `payments` | `@@unique([paymentNumber])`, `@@unique([gatewayTransactionId])` | Payment reconciliation and replay attack prevention |
| `idempotency_keys` | `@@unique([key])` | Enforces single execution of payments and dispatch actions |
| `cms_pages` | `@@unique([slug])`, `@@index([status])` | SEO URL routing and publishing filtering |

---

## 4. Migration Management, Rollback & Disaster Recovery Strategy

### Migration History:
1. `20261013094758_init_platform_foundation`: Scaffolds all 10 domain entities, foreign keys, timestamps, enums, and tables.
2. `20261013094815_add_active_assignment_constraints`: Adds PostgreSQL partial unique indexes to guarantee zero overlapping active vehicle or driver assignments:
```sql
CREATE UNIQUE INDEX idx_unique_active_vehicle_assignment 
ON vehicle_assignments (vehicle_id) 
WHERE status = 'ACTIVE';

CREATE UNIQUE INDEX idx_unique_active_driver_assignment 
ON driver_assignments (driver_id) 
WHERE status = 'ACTIVE';
```

### Rollback & Disaster Recovery Runbook:
1. **Transactional DDL**: PostgreSQL supports transactional DDL (`BEGIN ... DDL ... COMMIT/ROLLBACK`). All migration scripts run within transactions. If any statement fails, PostgreSQL rolls back the entire migration cleanly without partial schema states.
2. **Prisma Migration Recovery**:
   - Check status: `pnpm --filter @dehradun/prisma exec prisma migrate status`
   - If a migration failed: inspect the error, adjust SQL, and mark resolved via `prisma migrate resolve --applied <name>` or `prisma migrate resolve --rolled-back <name>`.
3. **Down-Migration Strategy**:
   - For every production migration, a paired reverse script (`down.sql`) is maintained in `infra/migrations/down/`.
   - Rollback of `add_active_assignment_constraints`:
     ```sql
     DROP INDEX IF EXISTS idx_unique_active_vehicle_assignment;
     DROP INDEX IF EXISTS idx_unique_active_driver_assignment;
     ```
4. **Point-in-Time Recovery (PITR)**:
   - Automated daily WAL (Write-Ahead Logging) archiving with hourly snapshots.
   - Zero data loss RPO < 5 minutes; RTO < 15 minutes.

---

## 5. Development Seeding & Production Safeguards

- **Strict Environment Guard**: The seed script checks `process.env.NODE_ENV` and `process.env.APP_ENV`. If either equals `'production'`, the process aborts immediately with an exit code of 1.
- **Fictional Data Labelling**: Every seeded user, customer, driver, vehicle, and booking explicitly contains `[FICTIONAL]` or `[FICTIONAL - DEV SEED]` to prevent mixing test data with production telemetry.
- **Idempotent Execution**: All seed routines use Prisma `upsert()` or existence checks, allowing repeatable dev-container bootstrap without errors.

---

## 6. Verification & Test Results

All 10 database foundation integration tests pass cleanly (`jest --runInBand`):
- `√ 1. Booking creation strictly defaults to PENDING_REVIEW without auto-confirm`
- `√ 2. Currency is strictly stored in integer minor units (paise) avoiding precision drift`
- `√ 3. FareSnapshot preserves agreed fare immutability against subsequent rate rule changes`
- `√ 4. Database constraint prevents concurrent ACTIVE assignments for the same vehicle`
- `√ 5. Database constraint prevents concurrent ACTIVE assignments for the same driver`
- `√ 6. Atomic transactions completely rollback on error without orphaned records`
- `√ 7. Financial corrections and refunds are fully auditable with delta and approver tracking`
- `√ 8. Referential integrity restricts deletion of customers with active bookings`
- `√ 9. IdempotencyKey enforces unique key constraint preventing duplicate processing`
- `√ 10. Migration rollback & recovery strategy works cleanly inside transactional DDL`
