import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import * as fs from 'fs';
import { UploadsService } from './uploads.service';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Uploads & Media Assets')
@ApiBearerAuth()
@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Get()
  @RequirePermissions('media:view')
  @ApiOperation({ summary: 'List media asset records with CDN paths' })
  async getAssets(@Query() query: PaginationDto) {
    return this.uploadsService.getAllAssets(query.skip, query.take);
  }

  @Post('presigned-url')
  @RequirePermissions('media:upload')
  @ApiOperation({ summary: 'Generate presigned S3/R2 direct upload URL or direct fallback' })
  async getPresignedUrl(
    @Body()
    body: {
      filename: string;
      mimeType: string;
      sizeBytes: number;
    },
  ) {
    return this.uploadsService.getPresignedUploadUrl(body);
  }

  @Post('file')
  @RequirePermissions('media:upload')
  @ApiOperation({ summary: 'Upload binary file (image/pdf) via multipart/form-data' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
        altText: { type: 'string' },
        caption: { type: 'string' },
      },
      required: ['file'],
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadPath = path.join(process.cwd(), 'uploads');
          if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
          }
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          const ext = path.extname(file.originalname);
          cb(null, `${uniqueSuffix}${ext}`);
        },
      }),
      limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
      fileFilter: (req, file, cb) => {
        const allowed = [
          'image/jpeg',
          'image/png',
          'image/webp',
          'image/svg+xml',
          'application/pdf',
        ];
        if (allowed.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(
            new BadRequestException(
              `Unsupported MIME type: ${file.mimetype}. Allowed: JPEG, PNG, WEBP, SVG, PDF`,
            ),
            false,
          );
        }
      },
    }),
  )
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body('altText') altText: string,
    @Body('caption') caption: string,
    @CurrentUser('id') uploadedById: string,
  ) {
    if (!file) {
      throw new BadRequestException('No valid file uploaded.');
    }
    return this.uploadsService.saveUploadedFile({
      file,
      altText,
      caption,
      uploadedById: uploadedById || '00000000-0000-0000-0000-000000000001',
    });
  }

  @Post()
  @RequirePermissions('media:upload')
  @ApiOperation({ summary: 'Register uploaded media asset with MIME and size verification' })
  async registerAsset(
    @Body()
    body: {
      filename: string;
      originalName: string;
      mimeType: string;
      sizeBytes: number;
      url: string;
      altText?: string;
      caption?: string;
    },
    @CurrentUser('id') uploadedById: string,
  ) {
    return this.uploadsService.registerMediaAsset({ ...body, uploadedById });
  }
}
