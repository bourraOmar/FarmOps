import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  _id: Types.ObjectId;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ sparse: true, unique: true })
  cin: string;

  @Prop({ required: true, enum: ['admin', 'farmer'], default: 'farmer' })
  role: string;

  @Prop({
    required: true,
    enum: ['pending', 'approved', 'banned'],
    default: 'pending',
  })
  status: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
