import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CmsStatus, Prisma } from '@dehradun/prisma';

@Injectable()
export class CmsService {
  constructor(private readonly prisma: PrismaService) {}

  async getPublishedPages() {
    return this.prisma.cmsPage.findMany({
      where: { status: CmsStatus.PUBLISHED, deletedAt: null },
      select: {
        id: true,
        title: true,
        slug: true,
        contentJson: true,
        publishedAt: true,
      },
      orderBy: { publishedAt: 'desc' },
    });
  }

  async getPageBySlug(slug: string) {
    const page = await this.prisma.cmsPage.findUnique({
      where: { slug },
      include: {
        author: { select: { fullName: true, email: true } },
      },
    });

    if (!page || page.deletedAt || page.status !== CmsStatus.PUBLISHED) {
      throw new NotFoundException(`CMS article with slug '${slug}' not found`);
    }

    return page;
  }

  async getAllPagesAdmin(skip = 0, take = 20, status?: CmsStatus) {
    const where: Prisma.CmsPageWhereInput = {
      deletedAt: null,
      ...(status ? { status } : {}),
    };

    const [total, items] = await Promise.all([
      this.prisma.cmsPage.count({ where }),
      this.prisma.cmsPage.findMany({
        where,
        skip,
        take,
        include: {
          author: { select: { fullName: true, email: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return { total, items };
  }

  async getPageByIdAdmin(id: string) {
    const page = await this.prisma.cmsPage.findUnique({
      where: { id },
      include: {
        author: { select: { fullName: true, email: true } },
      },
    });

    if (!page || page.deletedAt) {
      throw new NotFoundException(`CMS page with ID ${id} not found`);
    }

    return page;
  }

  async createPage(data: {
    title: string;
    slug: string;
    contentJson: any;
    status?: CmsStatus;
    authorId: string;
  }) {
    const existing = await this.prisma.cmsPage.findUnique({
      where: { slug: data.slug },
    });
    if (existing && !existing.deletedAt) {
      throw new ConflictException(`A CMS page with slug '${data.slug}' already exists`);
    }

    const status = data.status || CmsStatus.PUBLISHED;

    return this.prisma.cmsPage.create({
      data: {
        title: data.title,
        slug: data.slug,
        contentJson: data.contentJson,
        authorId: data.authorId,
        status,
        publishedAt: status === CmsStatus.PUBLISHED ? new Date() : null,
      },
    });
  }

  async updatePage(
    id: string,
    data: {
      title?: string;
      slug?: string;
      contentJson?: any;
      status?: CmsStatus;
    },
  ) {
    const page = await this.getPageByIdAdmin(id);

    if (data.slug && data.slug !== page.slug) {
      const existing = await this.prisma.cmsPage.findUnique({
        where: { slug: data.slug },
      });
      if (existing && existing.id !== id && !existing.deletedAt) {
        throw new ConflictException(`A CMS page with slug '${data.slug}' already exists`);
      }
    }

    let publishedAt = page.publishedAt;
    if (data.status === CmsStatus.PUBLISHED && page.status !== CmsStatus.PUBLISHED) {
      publishedAt = new Date();
    }

    return this.prisma.cmsPage.update({
      where: { id },
      data: {
        ...data,
        publishedAt,
      },
    });
  }

  async deletePage(id: string) {
    await this.getPageByIdAdmin(id);
    return this.prisma.cmsPage.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        status: CmsStatus.ARCHIVED,
      },
    });
  }
}
