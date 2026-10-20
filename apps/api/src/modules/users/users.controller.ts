import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Users & RBAC')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @RequirePermissions('user:view')
  @ApiOperation({ summary: 'List all operational and administrative users' })
  async findAll(@Query() query: PaginationDto) {
    return this.usersService.findAll(query.skip, query.take);
  }

  @Get(':id')
  @RequirePermissions('user:view')
  @ApiOperation({ summary: 'Get user details by ID' })
  async findById(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.findById(id);
  }

  @Post()
  @RequirePermissions('user:create')
  @ApiOperation({ summary: 'Create a new staff user' })
  async create(
    @Body()
    body: {
      email: string;
      password: string;
      fullName: string;
      phone?: string;
    },
  ) {
    return this.usersService.create(body);
  }

  @Post(':id/roles')
  @RequirePermissions('user:manage_roles')
  @ApiOperation({ summary: 'Assign a role to a user' })
  async assignRole(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('roleId', ParseUUIDPipe) roleId: string,
    @CurrentUser('id') currentUserId: string,
  ) {
    return this.usersService.assignRole(id, roleId, currentUserId);
  }

  @Get('roles')
  @RequirePermissions('user:manage_roles')
  @ApiOperation({ summary: 'List all operational and system roles with permissions' })
  async getRoles() {
    return this.usersService.getRoles();
  }
}
