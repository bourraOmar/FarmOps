import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AnimalDocument = Animal & Document;

@Schema()
export class Animal {
  @Prop({ required: true, index: true })
  userId: string;

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
