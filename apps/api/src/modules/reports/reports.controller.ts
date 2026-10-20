import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ReportsService } from './reports.service';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';

@ApiTags('Reports & Analytics')
@ApiBearerAuth()
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('overview')
  @RequirePermissions('report:view')
  @ApiOperation({ summary: 'Get operational metrics: revenue, booking states, fleet utilization' })
  async getOverview() {
    return this.reportsService.getDashboardOverview();
  }
}
