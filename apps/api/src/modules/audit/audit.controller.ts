import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuditService } from './audit.service';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';

@ApiTags('Audit & Compliance')
@ApiBearerAuth()
@Controller('audit')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get('logs')
  @RequirePermissions('audit:view')
  @ApiOperation({ summary: 'List platform audit logs with entity and action filters' })
  async getLogs(
    @Query() query: PaginationDto,
    @Query('entityName') entityName?: string,
    @Query('entityId') entityId?: string,
  ) {
    return this.auditService.getLogs(query.skip, query.take, entityName, entityId);
  }
}
