import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CmsService } from './cms.service';
import { Public } from '../../common/decorators/public.decorator';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { CmsStatus } from '@dehradun/prisma';

@ApiTags('Content Management (CMS)')
@Controller('cms')
export class CmsController {
  constructor(private readonly cmsService: CmsService) {}

  @Public()
  @Get('pages')
  @ApiOperation({ summary: 'List all published Uttarakhand travel guides and content' })
  async getPublishedPages() {
    return this.cmsService.getPublishedPages();
  }

  @Public()
  @Get('pages/:slug')
  @ApiOperation({ summary: 'Get rich travel guide by URL slug' })
  async getPageBySlug(@Param('slug') slug: string) {
    return this.cmsService.getPageBySlug(slug);
  }

  @ApiBearerAuth()
  @Get('admin/pages')
  @RequirePermissions('cms:manage')
  @ApiOperation({ summary: 'Admin list all CMS articles (published, drafts, archived)' })
  async getAllPagesAdmin(
    @Query() query: PaginationDto,
    @Query('status') status?: CmsStatus,
  ) {
    return this.cmsService.getAllPagesAdmin(query.skip, query.take, status);
  }

  @ApiBearerAuth()
  @Get('admin/pages/:id')
  @RequirePermissions('cms:manage')
  @ApiOperation({ summary: 'Get CMS article details by ID for editing' })
  async getPageByIdAdmin(@Param('id', ParseUUIDPipe) id: string) {
    return this.cmsService.getPageByIdAdmin(id);
  }

  @ApiBearerAuth()
  @Post('pages')
  @RequirePermissions('cms:manage')
  @ApiOperation({ summary: 'Publish or draft a new CMS article' })
  async createPage(
    @Body()
    body: {
      title: string;
      slug: string;
      contentJson: any;
      status?: CmsStatus;
    },
    @CurrentUser('id') authorId: string,
  ) {
    return this.cmsService.createPage({ ...body, authorId });
  }

  @ApiBearerAuth()
  @Patch('pages/:id')
  @RequirePermissions('cms:manage')
  @ApiOperation({ summary: 'Update an existing CMS article' })
  async updatePage(
    @Param('id', ParseUUIDPipe) id: string,
    @Body()
    body: {
      title?: string;
      slug?: string;
      contentJson?: any;
      status?: CmsStatus;
    },
  ) {
    return this.cmsService.updatePage(id, body);
  }

  @ApiBearerAuth()
  @Delete('pages/:id')
  @RequirePermissions('cms:manage')
  @ApiOperation({ summary: 'Soft-delete a CMS article' })
  async deletePage(@Param('id', ParseUUIDPipe) id: string) {
    return this.cmsService.deletePage(id);
  }
}
