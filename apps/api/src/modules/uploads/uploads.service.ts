import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class UploadsService {
  constructor(private readonly prisma: PrismaService) {}

  async registerMediaAsset(data: {
    filename: string;
    originalName: string;
    mimeType: string;
    sizeBytes: number;
    url: string;
    altText?: string;
    caption?: string;
    uploadedById: string;
  }) {
    // Request size limit enforcement: 10MB
    const MAX_SIZE_BYTES = 10 * 1024 * 1024;
    if (data.sizeBytes > MAX_SIZE_BYTES) {
      throw new BadRequestException('File size exceeds the 10MB limit.');
    }

    const ALLOWED_MIME_TYPES = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/svg+xml',
      'application/pdf',
    ];
    if (!ALLOWED_MIME_TYPES.includes(data.mimeType)) {
      throw new BadRequestException(`Unsupported MIME type: ${data.mimeType}`);
    }

    return this.prisma.mediaAsset.create({
      data: {
        filename: data.filename,
        originalName: data.originalName,
        mimeType: data.mimeType,
        sizeBytes: data.sizeBytes,
        url: data.url,
        altText: data.altText,
        caption: data.caption,
        bucketPath: `uploads/${new Date().getFullYear()}/${data.filename}`,
        uploadedById: data.uploadedById,
      },
    });
  }

  async saveUploadedFile(data: {
    file: Express.Multer.File;
    altText?: string;
    caption?: string;
    uploadedById: string;
  }) {
    const fileUrl = `/uploads/${data.file.filename}`;
    return this.prisma.mediaAsset.create({
      data: {
        filename: data.file.filename,
        originalName: data.file.originalname,
        mimeType: data.file.mimetype,
        sizeBytes: data.file.size,
        url: fileUrl,
        altText: data.altText,
        caption: data.caption,
        bucketPath: `local://${data.file.filename}`,
        uploadedById: data.uploadedById,
      },
    });
  }

  async getPresignedUploadUrl(data: {
    filename: string;
    mimeType: string;
    sizeBytes: number;
  }) {
    const ALLOWED_MIME_TYPES = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/svg+xml',
      'application/pdf',
    ];
    if (!ALLOWED_MIME_TYPES.includes(data.mimeType)) {
      throw new BadRequestException(`Unsupported MIME type: ${data.mimeType}`);
    }
    const MAX_SIZE_BYTES = 10 * 1024 * 1024;
    if (data.sizeBytes > MAX_SIZE_BYTES) {
      throw new BadRequestException('File size exceeds the 10MB limit.');
    }

    const uniqueId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const sanitizedName = data.filename.replace(/[^a-zA-Z0-9.-]/g, '_');
    const objectKey = `uploads/${new Date().getFullYear()}/${uniqueId}-${sanitizedName}`;

    const s3Bucket = process.env.S3_BUCKET || process.env.AWS_S3_BUCKET;
    const s3Endpoint = process.env.S3_ENDPOINT || 'https://s3.amazonaws.com';

    if (s3Bucket) {
      return {
        mode: 's3',
        uploadUrl: `${s3Endpoint}/${s3Bucket}/${objectKey}`,
        publicUrl: `${s3Endpoint}/${s3Bucket}/${objectKey}`,
        key: objectKey,
        headers: {
          'Content-Type': data.mimeType,
        },
      };
    }

    // Direct API upload fallback
    return {
      mode: 'direct',
      uploadUrl: '/api/v1/uploads/file',
      publicUrl: `/uploads/${objectKey}`,
      key: objectKey,
    };
  }

  async getAllAssets(skip = 0, take = 20) {
    const [total, items] = await Promise.all([
      this.prisma.mediaAsset.count(),
      this.prisma.mediaAsset.findMany({
        skip,
        take,
        include: { uploadedBy: { select: { fullName: true, email: true } } },
        orderBy: { createdAt: 'desc' },
      }),
    ]);
    return { total, items };
  }
}
