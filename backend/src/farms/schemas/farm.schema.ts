import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type FarmDocument = Farm & Document;

@Schema({ timestamps: true })
export class Farm {
  @Prop({ required: true, index: true })
  userId: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  location: string;

  @Prop()
  size: number; // in hectares

  @Prop()
  description: string;

  @Prop()
  photoUrl: string;
}

export const FarmSchema = SchemaFactory.createForClass(Farm);
