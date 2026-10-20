import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@dehradun/prisma';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super();
  }

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('PostgreSQL database connected successfully via Prisma');
    } catch (err: any) {
      this.logger.warn(
        `Could not connect to PostgreSQL at 127.0.0.1:5432 (${err.message || 'Connection refused'}). API will continue running, but DB queries require PostgreSQL to be started ('pnpm docker:up').`,
      );
    }
  }

  async onModuleDestroy() {
    try {
      await this.$disconnect();
    } catch {
      // Ignore disconnect errors
    }
  }
}
