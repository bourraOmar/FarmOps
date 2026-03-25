import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { AdminService } from './admin.service';

@Controller('admin')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('stats')
  async getStats() {
    return this.adminService.getAggregateStats();
  }

  @Get('farmers')
  async getFarmers(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
  ) {
    return this.adminService.getAllFarmers(
      parseInt(page, 10) || 1,
      parseInt(limit, 10) || 20,
    );
  }

  @Get('farmers/:id')
  async getFarmerProfile(@Param('id') id: string) {
    return this.adminService.getFarmerProfile(id);
  }

  @Patch('farmers/:id/status')
  async updateFarmerStatus(
    @Param('id') id: string,
    @Body('status') status: 'pending' | 'approved' | 'banned',
  ) {
    return this.adminService.updateFarmerStatus(id, status);
  }

  @Get('farms')
  async getFarms(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
  ) {
    return this.adminService.getAllFarms(
      parseInt(page, 10) || 1,
      parseInt(limit, 10) || 20,
    );
  }

  @Get('livestock')
  async getLivestock(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
    @Query('search') search?: string,
    @Query('breed') breed?: string,
  ) {
    return this.adminService.getAllLivestock(
      parseInt(page, 10) || 1,
      parseInt(limit, 10) || 20,
      search,
      breed,
    );
  }

  @Get('milk-records')
  async getMilkRecords(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
  ) {
    return this.adminService.getAllMilkRecords(
      parseInt(page, 10) || 1,
      parseInt(limit, 10) || 20,
    );
  }

  @Get('milk-trends')
  async getMilkTrends(@Query('days') days: string = '7') {
    return this.adminService.getMilkProductionTrends(parseInt(days, 10) || 7);
  }
}
