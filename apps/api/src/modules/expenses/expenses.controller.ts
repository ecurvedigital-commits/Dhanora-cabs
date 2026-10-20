import { Body, Controller, Get, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ExpensesService } from './expenses.service';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ExpenseType } from '@dehradun/prisma';

@ApiTags('Trip Expenses')
@ApiBearerAuth()
@Controller('expenses')
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Post()
  @RequirePermissions('expense:create')
  @ApiOperation({ summary: 'Record on-trip expense (toll, parking, fuel, state permit)' })
  async recordExpense(
    @Body()
    body: {
      tripId: string;
      expenseType: ExpenseType;
      amountPaise: number;
      description?: string;
      receiptUrl?: string;
    },
    @CurrentUser('id') recordedById: string,
  ) {
    return this.expensesService.recordTripExpense({ ...body, recordedById });
  }

  @Get('trip/:tripId')
  @RequirePermissions('expense:view')
  @ApiOperation({ summary: 'List all operational expenses incurred for a specific trip' })
  async getByTrip(@Param('tripId', ParseUUIDPipe) tripId: string) {
    return this.expensesService.getExpensesByTrip(tripId);
  }
}
