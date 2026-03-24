import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type AnimalDocument = Animal & Document;

@Schema({ timestamps: true })
export class Animal {
  @Prop({ required: true, index: true })
  userId: string;

  @Prop({ type: Types.ObjectId, ref: 'Farm', required: true, index: true })
  farmId: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop()
  tagId: string;

  @Prop()
  breed: string;

  @Prop({ enum: ['Male', 'Female'] })
  gender: string;

  @Prop()
  dob: string; // Stored as MM/DD/YYYY

  @Prop()
  weight: number; // in kg

  @Prop()
  photoUrl: string;
}

export const AnimalSchema = SchemaFactory.createForClass(Animal);
