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
import { SeoService } from './seo.service';
import { Public } from '../../common/decorators/public.decorator';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';
import { PaginationDto } from '../../common/dto/pagination.dto';

@ApiTags('SEO & Redirects')
@Controller('seo')
export class SeoController {
  constructor(private readonly seoService: SeoService) {}

  @Public()
  @Get('metadata')
  @ApiOperation({ summary: 'Get canonical title, description and OpenGraph tags for a given path' })
  async getMetadata(@Query('path') path: string) {
    return this.seoService.getMetadataByPath(path);
  }

  @Public()
  @Get('redirect')
  @ApiOperation({ summary: 'Look up 301/302 redirect rule by incoming path' })
  async getRedirect(@Query('path') path: string) {
    return this.seoService.findRedirect(path);
  }

  @ApiBearerAuth()
  @Post('metadata')
  @RequirePermissions('seo:manage')
  @ApiOperation({ summary: 'Create or update SEO metadata for a page or package' })
  async upsertMetadata(@Body() body: any) {
    return this.seoService.upsertMetadata(body);
  }

  @ApiBearerAuth()
  @Get('redirects')
  @RequirePermissions('seo:manage')
  @ApiOperation({ summary: 'Admin list all 301/302 redirects' })
  async getAllRedirects(@Query() query: PaginationDto) {
    return this.seoService.getAllRedirects(query.skip, query.take);
  }

  @ApiBearerAuth()
  @Post('redirects')
  @RequirePermissions('seo:manage')
  @ApiOperation({ summary: 'Create a new 301/302 redirect rule' })
  async createRedirect(
    @Body()
    body: {
      sourcePath: string;
      targetPath: string;
      statusCode?: number;
    },
  ) {
    return this.seoService.createRedirect(body);
  }

  @ApiBearerAuth()
  @Patch('redirects/:id')
  @RequirePermissions('seo:manage')
  @ApiOperation({ summary: 'Update an existing redirect rule' })
  async updateRedirect(
    @Param('id', ParseUUIDPipe) id: string,
    @Body()
    body: {
      sourcePath?: string;
      targetPath?: string;
      statusCode?: number;
      isActive?: boolean;
    },
  ) {
    return this.seoService.updateRedirect(id, body);
  }

  @ApiBearerAuth()
  @Delete('redirects/:id')
  @RequirePermissions('seo:manage')
  @ApiOperation({ summary: 'Delete a redirect rule' })
  async deleteRedirect(@Param('id', ParseUUIDPipe) id: string) {
    return this.seoService.deleteRedirect(id);
  }
}
