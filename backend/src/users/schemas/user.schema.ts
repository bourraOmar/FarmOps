import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true }) 
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string; 

  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true, unique: true })
  cin: string; 

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true, enum: ['admin', 'breeder'], default: 'breeder' })
  role: string; 
}

export const UserSchema = SchemaFactory.createForClass(User);