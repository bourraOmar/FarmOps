import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { User, UserSchema } from '../users/schemas/user.schema';
import { Farm, FarmSchema } from '../farms/schemas/farm.schema';
import { Animal, AnimalSchema } from '../livestock/schemas/animal.schema';
import { MilkRecord, MilkRecordSchema } from '../milk/schemas/milk-record.schema';
import { Worker, WorkerSchema } from '../workers/schemas/worker.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Farm.name, schema: FarmSchema },
      { name: Animal.name, schema: AnimalSchema },
      { name: MilkRecord.name, schema: MilkRecordSchema },
      { name: Worker.name, schema: WorkerSchema },
    ]),
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
