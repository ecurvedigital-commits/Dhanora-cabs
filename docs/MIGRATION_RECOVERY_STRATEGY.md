# Database Migration Rollback & Disaster Recovery Strategy

## 1. Architectural Philosophy

Database migrations in the Dehradun Platform are managed using **Prisma Migrate** against PostgreSQL.
In production financial and reservation systems, destructive automatic down-migrations are prohibited because they can drop live columns or tables containing confirmed financial or booking audit records.

Instead, the platform follows an **Immutable Forward-Only Recovery & Point-In-Time Restoration** paradigm.

---

## 2. Recovery Strategies by Environment

### A. Development & Integration Test Environments
In local and CI environments, schema drift or corrupted migrations are resolved using clean rebuilds:
```bash
# Drops schema, replays all migrations cleanly in order, and re-executes seed.ts
pnpm --filter @dehradun/prisma exec prisma migrate reset --force
```

### B. Staging & Production Environments

#### 1. Compensating Forward Migration (Preferred for Schema Bugs)
When a migration introduces an erroneous column, index, or constraint that must be revoked:
1. Generate a new compensating migration:
   ```bash
   pnpm --filter @dehradun/prisma exec prisma migrate dev --create-only --name revert_<feature_name>
   ```
2. Write the inverse DDL in the resulting `migration.sql` (e.g. `DROP INDEX`, `ALTER TABLE ... DROP COLUMN`).
3. Deploy forward through the standard CI pipeline:
   ```bash
   pnpm --filter @dehradun/prisma exec prisma migrate deploy
   ```

#### 2. Resolving Failed Migrations (Migration Lockout Recovery)
If a migration fails midway (e.g., deadlock, timeout, or constraint clash):
1. Investigate the failure reason using:
   ```bash
   pnpm --filter @dehradun/prisma exec prisma migrate status
   ```
2. Connect directly via `psql` to roll back the failed transaction if uncommitted or rectify the specific invalid state.
3. Mark the migration as resolved:
   ```bash
   # If rolled back manually:
   prisma migrate resolve --rolled-back "20261013xxxxxx_failed_migration"

   # If manually fixed and applied:
   prisma migrate resolve --applied "20261013xxxxxx_failed_migration"
   ```

#### 3. Catastrophic Disaster Recovery (Point-in-Time Recovery / Backup)
For complete data corruption or storage failure:
1. Continuous archiving via PostgreSQL WAL (Write-Ahead Log) archiving and daily full physical snapshots.
2. In disaster scenarios, provision an isolated instance, restore the snapshot, and replay WAL logs up to the exact transaction timestamp prior to the incident.
3. Repoint application connection strings via `DATABASE_URL`.

---

## 3. Verification of Replay & Reset Resilience

The migration replay capability was tested locally:
- Replaying all migrations from `20261013094758_init_platform_foundation` through `20261013094815_add_active_assignment_constraints` followed by seed data initialization was executed and validated with zero schema drift.
