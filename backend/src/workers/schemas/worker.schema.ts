import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type WorkerDocument = Worker & Document;

@Schema()
export class Worker {
  @Prop({ required: true, index: true })
  userId: string;

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
