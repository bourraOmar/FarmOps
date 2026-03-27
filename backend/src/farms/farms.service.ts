import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Farm, FarmDocument } from './schemas/farm.schema';
import { CreateFarmDto } from './dto/create-farm.dto';

@Injectable()
export class FarmsService {
  constructor(@InjectModel(Farm.name) private farmModel: Model<FarmDocument>) {}

  async create(userId: string, dto: CreateFarmDto): Promise<Farm> {
    return new this.farmModel({ ...dto, userId }).save();
  }

  async findAll(userId: string): Promise<Farm[]> {
    return this.farmModel.find({ userId }).sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string, userId: string): Promise<FarmDocument> {
    const farm = await this.farmModel.findOne({ _id: id, userId }).exec();
    if (!farm) {
      throw new NotFoundException('Farm not found');
    }
    return farm;
  }

  async update(
    id: string,
    userId: string,
    dto: Partial<CreateFarmDto>,
  ): Promise<Farm | null> {
    const farm = await this.farmModel
      .findOneAndUpdate({ _id: id, userId }, dto, { new: true })
      .exec();
    if (!farm) {
      throw new NotFoundException('Farm not found');
    }
    return farm;
  }

  async remove(id: string, userId: string): Promise<void> {
    const result = await this.farmModel
      .findOneAndDelete({ _id: id, userId })
      .exec();
    if (!result) {
      throw new NotFoundException('Farm not found');
    }
  }

  async countAll(userId: string): Promise<number> {
    return this.farmModel.countDocuments({ userId }).exec();
  }
}
