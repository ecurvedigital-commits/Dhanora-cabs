import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';
import { NotificationChannel } from '@dehradun/prisma';

@ApiTags('Notifications & Delivery Logs')
@ApiBearerAuth()
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get('logs')
  @RequirePermissions('notification:view')
  @ApiOperation({ summary: 'List recent notification dispatch attempts and status' })
  async getLogs(@Query() query: PaginationDto) {
    return this.notificationsService.getRecentLogs(query.skip, query.take);
  }

  @Post('test-send')
  @RequirePermissions('notification:send')
  @ApiOperation({ summary: 'Queue test notification dispatch (SMS, WhatsApp, Email)' })
  async testSend(
    @Body()
    body: {
      recipient: string;
      channel: NotificationChannel;
      templateName: string;
      subject?: string;
      content: string;
    },
  ) {
    return this.notificationsService.queueNotification(body);
  }
}
