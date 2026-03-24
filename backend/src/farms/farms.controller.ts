import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FarmsService } from './farms.service';
import { CreateFarmDto } from './dto/create-farm.dto';
import { Farm } from './schemas/farm.schema';

@UseGuards(AuthGuard('jwt'))
@Controller('farms')
export class FarmsController {
  constructor(private readonly farmsService: FarmsService) {}

  @Post()
  async create(@Request() req: any, @Body() dto: CreateFarmDto): Promise<Farm> {
    return this.farmsService.create(req.user._id, dto);
  }

  @Get()
  async findAll(@Request() req: any): Promise<Farm[]> {
    return this.farmsService.findAll(req.user._id);
  }

  @Get('stats')
  async getStats(@Request() req: any): Promise<{ totalFarms: number }> {
    const total = await this.farmsService.countAll(req.user._id);
    return { totalFarms: total };
  }

  @Get(':id')
  async findOne(@Request() req: any, @Param('id') id: string): Promise<Farm> {
    return this.farmsService.findOne(id, req.user._id);
  }

  @Patch(':id')
  async update(
    @Request() req: any,
    @Param('id') id: string,
    @Body() dto: Partial<CreateFarmDto>,
  ): Promise<Farm | null> {
    return this.farmsService.update(id, req.user._id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Request() req: any, @Param('id') id: string): Promise<void> {
    return this.farmsService.remove(id, req.user._id);
  }
}
