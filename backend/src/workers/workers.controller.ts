import {
  Controller,
  Get,
  Post,
  Patch,
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
import { WorkersService } from './workers.service';
import { CreateWorkerDto } from './dto/create-worker.dto';
import { Worker } from './schemas/worker.schema';

@UseGuards(AuthGuard('jwt'))
@Controller('workers')
export class WorkersController {
  constructor(private readonly workersService: WorkersService) {}

  @Post()
  async create(
    @Request() req: { user: { _id: string; [key: string]: any } },
    @Body() dto: CreateWorkerDto,
  ): Promise<Worker> {
    return this.workersService.create(req.user._id, dto);
  }

  @Get()
  async findAll(
    @Request() req: { user: { _id: string; [key: string]: any } },
    @Query('farmId') farmId?: string,
  ): Promise<Worker[]> {
    return this.workersService.findAll(req.user._id, farmId);
  }

  @Get(':id')
  async findOne(
    @Request() req: { user: { _id: string; [key: string]: any } },
    @Param('id') id: string,
  ): Promise<Worker | null> {
    return this.workersService.findOne(id, req.user._id);
  }

  @Patch(':id')
  async update(
    @Request() req: { user: { _id: string; [key: string]: any } },
    @Param('id') id: string,
    @Body() dto: Partial<CreateWorkerDto>,
  ): Promise<Worker | null> {
    return this.workersService.update(id, req.user._id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Request() req: { user: { _id: string; [key: string]: any } },
    @Param('id') id: string,
  ): Promise<void> {
    return this.workersService.remove(id, req.user._id);
  }
}
