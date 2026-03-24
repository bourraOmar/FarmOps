import { Controller, Get, Post, Patch, Delete, Body, Param, Query, HttpCode, HttpStatus, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { LivestockService } from './livestock.service';
import { CreateAnimalDto } from './dto/create-animal.dto';
import { Animal } from './schemas/animal.schema';

@UseGuards(AuthGuard('jwt'))
@Controller('livestock')
export class LivestockController {
  constructor(private readonly livestockService: LivestockService) {}

  @Post()
  async create(@Request() req: any, @Body() createAnimalDto: CreateAnimalDto): Promise<Animal> {
    return this.livestockService.create(req.user._id, createAnimalDto);
  }

  @Get()
  async findAll(@Request() req: any, @Query('farmId') farmId?: string): Promise<Animal[]> {
    return this.livestockService.findAll(req.user._id, farmId);
  }

  @Get('stats')
  async getStats(@Request() req: any, @Query('farmId') farmId?: string): Promise<{ totalAnimals: number }> {
    const total = await this.livestockService.countAll(req.user._id, farmId);
    return { totalAnimals: total };
  }

  @Get('next-tag-id')
  async getNextTagId(@Request() req: any, @Query('farmId') farmId?: string): Promise<{ tagId: string }> {
    const tagId = await this.livestockService.nextTagId(req.user._id, farmId);
    return { tagId };
  }

  @Get(':id')
  async findOne(@Request() req: any, @Param('id') id: string): Promise<Animal | null> {
    return this.livestockService.findOne(id, req.user._id);
  }

  @Patch(':id')
  async update(
    @Request() req: any,
    @Param('id') id: string,
    @Body() dto: Partial<CreateAnimalDto>,
  ): Promise<Animal | null> {
    return this.livestockService.update(id, req.user._id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Request() req: any, @Param('id') id: string): Promise<void> {
    return this.livestockService.remove(id, req.user._id);
  }
}