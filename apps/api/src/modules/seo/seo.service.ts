import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class SeoService {
  constructor(private readonly prisma: PrismaService) {}

  async getMetadataByPath(pagePath: string) {
    return this.prisma.seoMetadata.findUnique({
      where: { pagePath },
    });
  }

  async findRedirect(sourcePath: string) {
    const redirect = await this.prisma.redirectRule.findUnique({
      where: { sourcePath },
    });

    if (redirect && redirect.isActive) {
      // Increment hit counter asynchronously
      this.prisma.redirectRule
        .update({
          where: { id: redirect.id },
          data: { hitsCount: { increment: 1 } },
        })
        .catch(() => {});
      return redirect;
    }

    return null;
  }

  async upsertMetadata(data: {
    entityType: string;
    entityId?: string;
    pagePath: string;
    metaTitle: string;
    metaDescription: string;
    canonicalUrl?: string;
    ogImageUrl?: string;
    ogTitle?: string;
    ogDescription?: string;
    keywords?: string[];
    structuredDataJson?: any;
  }) {
    return this.prisma.seoMetadata.upsert({
      where: { pagePath: data.pagePath },
      update: data,
      create: data,
    });
  }

  async getAllRedirects(skip = 0, take = 50) {
    const [total, items] = await Promise.all([
      this.prisma.redirectRule.count(),
      this.prisma.redirectRule.findMany({
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
    ]);
    return { total, items };
  }

  async createRedirect(data: {
    sourcePath: string;
    targetPath: string;
    statusCode?: number;
  }) {
    const existing = await this.prisma.redirectRule.findUnique({
      where: { sourcePath: data.sourcePath },
    });
    if (existing) {
      throw new ConflictException(`Redirect for path '${data.sourcePath}' already exists`);
    }

    return this.prisma.redirectRule.create({
      data: {
        sourcePath: data.sourcePath,
        targetPath: data.targetPath,
        statusCode: data.statusCode || 301,
        isActive: true,
      },
    });
  }

  async updateRedirect(
    id: string,
    data: {
      sourcePath?: string;
      targetPath?: string;
      statusCode?: number;
      isActive?: boolean;
    },
  ) {
    const rule = await this.prisma.redirectRule.findUnique({ where: { id } });
    if (!rule) {
      throw new NotFoundException(`Redirect rule with ID ${id} not found`);
    }

    return this.prisma.redirectRule.update({
      where: { id },
      data,
    });
  }

  async deleteRedirect(id: string) {
    const rule = await this.prisma.redirectRule.findUnique({ where: { id } });
    if (!rule) {
      throw new NotFoundException(`Redirect rule with ID ${id} not found`);
    }

    return this.prisma.redirectRule.delete({
      where: { id },
    });
  }
}
