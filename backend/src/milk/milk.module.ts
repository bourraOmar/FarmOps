import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MilkController } from './milk.controller';
import { MilkService } from './milk.service';
import { MilkRecord, MilkRecordSchema } from './schemas/milk-record.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MilkRecord.name, schema: MilkRecordSchema },
    ]),
  ],
  controllers: [MilkController],
  providers: [MilkService],
})
export class MilkModule {}
