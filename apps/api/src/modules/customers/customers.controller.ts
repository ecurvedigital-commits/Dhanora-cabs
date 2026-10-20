import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CustomersService } from './customers.service';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Customers')
@ApiBearerAuth()
@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Get()
  @RequirePermissions('customer:view')
  @ApiOperation({ summary: 'List customer profiles with booking summaries' })
  async findAll(@Query() query: PaginationDto) {
    return this.customersService.findAll(query.skip, query.take);
  }

  @Get(':id')
  @RequirePermissions('customer:view')
  @ApiOperation({ summary: 'Get customer profile and operator notes' })
  async findById(@Param('id', ParseUUIDPipe) id: string) {
    return this.customersService.findById(id);
  }

  @Patch(':id')
  @RequirePermissions('customer:manage')
  @ApiOperation({ summary: 'Update customer contact info and preferences' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body()
    body: {
      fullName?: string;
      email?: string;
      address?: string;
      preferencesJson?: any;
      emergencyContactName?: string;
      emergencyContactPhone?: string;
    },
  ) {
    return this.customersService.updateCustomer(id, body);
  }

  @Post(':id/notes')
  @RequirePermissions('customer:note')
  @ApiOperation({ summary: 'Add an operational or preferences note to a customer profile' })
  async addNote(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('note') note: string,
    @Body('isPinned') isPinned: boolean = false,
    @CurrentUser('id') authorId: string,
  ) {
    return this.customersService.addNote(id, authorId, note, isPinned);
  }
}
