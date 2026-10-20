import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as express from 'express';
import * as path from 'path';
import * as fs from 'fs';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: process.env.CORS_ORIGIN || '*',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      credentials: true,
    },
  });

  // Ensure uploads directory exists and serve static assets
  const uploadsDir = path.join(process.cwd(), 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  app.use('/uploads', express.static(uploadsDir));

  // Request size limit protection (10MB)
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ limit: '10mb', extended: true }));

  // Global REST API v1 Versioning
  app.setGlobalPrefix('api/v1');

  // Strict DTO Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // OpenAPI Swagger Documentation
  const config = new DocumentBuilder()
    .setTitle('Dehradun Taxi & Travel Platform API')
    .setDescription(
      'Production-ready backend API for Dehradun Taxi, Outstation Travel, Uttarakhand Tour Packages, Trekking and Safari platform.',
    )
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT access token',
        in: 'header',
      },
      'JWT-auth',
    )
    .addTag('Authentication', 'Staff login and identity verification')
    .addTag('Bookings', 'Public booking requests (PENDING_REVIEW) and admin confirmation')
    .addTag('Pricing & Tariffs', 'Distance and category-based tariff calculations')
    .addTag('Trips & Dispatch', 'Operational trip execution and assignment conflict protection')
    .addTag('Fleet Management', 'Vehicles registry, categories, and compliance validity')
    .addTag('Drivers Management', 'Commercial mountain drivers and license tracking')
    .addTag('Tour Packages & Safaris', 'Uttarakhand sacred yatras and mountain treks')
    .addTag('Payments, Refunds & Invoicing', 'Transactions, GST invoices, and financial adjustments')
    .addTag('Content Management (CMS)', 'SEO-optimized travel guides and editorial content')
    .addTag('Reports & Analytics', 'Business metrics, fleet utilization, and revenue stats')
    .addTag('Health & Monitoring', 'Service uptime and database connectivity')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  SwaggerModule.setup('api/v1/docs', app, document);

  const port = process.env.PORT || process.env.API_PORT || 3001;
  await app.listen(port);
  logger.log(`Dehradun API server running on port ${port} under /api/v1`);
  logger.log(`OpenAPI Documentation available at http://localhost:${port}/api/docs`);
}

bootstrap();
