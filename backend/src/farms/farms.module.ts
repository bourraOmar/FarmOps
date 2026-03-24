import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FarmsController } from './farms.controller';
import { FarmsService } from './farms.service';
import { Farm, FarmSchema } from './schemas/farm.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Farm.name, schema: FarmSchema }])],
  controllers: [FarmsController],
  providers: [FarmsService],
  exports: [FarmsService],
})
export class FarmsModule {}
