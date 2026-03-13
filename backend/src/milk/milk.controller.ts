import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { MilkService } from './milk.service';
import { CreateMilkRecordDto } from './dto/create-milk-record.dto';
import { MilkRecord } from './schemas/milk-record.schema';

@UseGuards(AuthGuard('jwt'))
@Controller('milk')
export class MilkController {
  constructor(private readonly milkService: MilkService) {}

  @Post()
  async create(@Request() req: any, @Body() dto: CreateMilkRecordDto): Promise<MilkRecord> {
    return this.milkService.create(req.user._id, dto);
  }

  @Get()
  async findAll(@Request() req: any): Promise<MilkRecord[]> {
    return this.milkService.findAll(req.user._id);
  }

  @Get('stats')
  async getStats(@Request() req: any) {
    return this.milkService.getStats(req.user._id);
  }

  @Get('animal/:animalId')
  async findByAnimal(@Request() req: any, @Param('animalId') animalId: string): Promise<MilkRecord[]> {
    return this.milkService.findByAnimal(animalId, req.user._id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Request() req: any, @Param('id') id: string): Promise<void> {
    return this.milkService.remove(id, req.user._id);
  }
}
