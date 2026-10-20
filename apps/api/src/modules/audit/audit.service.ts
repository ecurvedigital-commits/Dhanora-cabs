import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { AuditAction } from '@dehradun/prisma';

@Injectable()
export class AuditService {
  constructor(private readonly prisma: PrismaService) {}

  async logMutation(data: {
    entityName: string;
    entityId: string;
    action: AuditAction;
    userId?: string;
    ipAddress?: string;
    userAgent?: string;
    beforeStateJson?: any;
    afterStateJson?: any;
    metadataJson?: any;
  }) {
    return this.prisma.auditLog.create({
      data: {
        entityName: data.entityName,
        entityId: data.entityId,
        action: data.action,
        userId: data.userId,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
        beforeStateJson: data.beforeStateJson,
        afterStateJson: data.afterStateJson,
        metadataJson: data.metadataJson,
      },
    });
  }

  async getLogs(skip = 0, take = 50, entityName?: string, entityId?: string) {
    const where = {
      ...(entityName ? { entityName } : {}),
      ...(entityId ? { entityId } : {}),
    };

    const [total, items] = await Promise.all([
      this.prisma.auditLog.count({ where }),
      this.prisma.auditLog.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return { total, items };
  }
}
