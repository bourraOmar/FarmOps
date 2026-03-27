import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
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
  async create(
    @Request() req: { user: { _id: string; [key: string]: any } },
    @Body() dto: CreateMilkRecordDto,
  ): Promise<MilkRecord> {
    return this.milkService.create(req.user._id, dto);
  }

  @Get()
  async findAll(
    @Request() req: { user: { _id: string; [key: string]: any } },
    @Query('farmId') farmId?: string,
  ): Promise<MilkRecord[]> {
    return this.milkService.findAll(req.user._id, farmId);
  }

  @Get('stats')
  async getStats(
    @Request() req: { user: { _id: string; [key: string]: any } },
    @Query('farmId') farmId?: string,
  ) {
    return this.milkService.getStats(req.user._id, farmId);
  }

  @Get('animal/:animalId')
  async findByAnimal(
    @Request() req: { user: { _id: string; [key: string]: any } },
    @Param('animalId') animalId: string,
  ): Promise<MilkRecord[]> {
    return this.milkService.findByAnimal(animalId, req.user._id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Request() req: { user: { _id: string; [key: string]: any } },
    @Param('id') id: string,
  ): Promise<void> {
    return this.milkService.remove(id, req.user._id);
  }
}
