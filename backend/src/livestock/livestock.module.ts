import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LivestockController } from './livestock.controller';
import { LivestockService } from './livestock.service';
import { Animal, AnimalSchema } from './schemas/animal.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Animal.name, schema: AnimalSchema }])],
  controllers: [LivestockController],
  providers: [LivestockService],
})
export class LivestockModule {}