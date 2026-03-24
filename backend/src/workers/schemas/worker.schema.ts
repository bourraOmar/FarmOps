import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type WorkerDocument = Worker & Document;

@Schema({ timestamps: true })
export class Worker {
  @Prop({ required: true, index: true })
  userId: string;

  @Prop({ type: Types.ObjectId, ref: 'Farm', required: true, index: true })
  farmId: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  role: string;

  @Prop()
  phone: string;

  @Prop()
  email: string;

  @Prop()
  avatarUrl: string;
}

export const WorkerSchema = SchemaFactory.createForClass(Worker);
