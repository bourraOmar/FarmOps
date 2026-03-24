import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type MilkRecordDocument = MilkRecord & Document;

@Schema({ timestamps: true })
export class MilkRecord {
  @Prop({ required: true, index: true })
  userId: string;

  @Prop({ type: Types.ObjectId, ref: 'Farm', required: true, index: true })
  farmId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Animal', required: true })
  animalId: Types.ObjectId;

  @Prop({ required: true })
  date: string; // MM/DD/YYYY

  @Prop({ required: true })
  amountLiters: number;

  @Prop({ enum: ['Morning', 'Evening', 'Night'], required: true })
  session: string;

  @Prop()
  notes: string;
}

export const MilkRecordSchema = SchemaFactory.createForClass(MilkRecord);
