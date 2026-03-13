import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { MilkRecord, MilkRecordDocument } from './schemas/milk-record.schema';
import { CreateMilkRecordDto } from './dto/create-milk-record.dto';

@Injectable()
export class MilkService {
  constructor(
    @InjectModel(MilkRecord.name)
    private milkModel: Model<MilkRecordDocument>,
  ) {}

  async create(userId: string, dto: CreateMilkRecordDto): Promise<MilkRecord> {
    return new this.milkModel({
      ...dto,
      userId,
      animalId: new Types.ObjectId(dto.animalId),
    }).save();
  }

  async findAll(userId: string): Promise<MilkRecord[]> {
    return this.milkModel.find({ userId }).sort({ createdAt: -1 }).exec();
  }

  async findByAnimal(animalId: string, userId: string): Promise<MilkRecord[]> {
    return this.milkModel
      .find({ userId, animalId: new Types.ObjectId(animalId) })
      .sort({ createdAt: -1 })
      .exec();
  }

  async getStats(userId: string): Promise<{ totalToday: number; totalThisMonth: number; recordCount: number }> {
    const today = new Date();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const yyyy = today.getFullYear();
    const todayStr = `${mm}/${dd}/${yyyy}`;
    const monthPrefix = `${mm}/`;

    const [allRecords, todayRecords, monthRecords] = await Promise.all([
      this.milkModel.find({ userId }).exec(),
      this.milkModel.find({ userId, date: todayStr }).exec(),
      this.milkModel.find({ userId, date: { $regex: `^${monthPrefix}` } }).exec(),
    ]);

    return {
      totalToday: todayRecords.reduce((s, r) => s + r.amountLiters, 0),
      totalThisMonth: monthRecords.reduce((s, r) => s + r.amountLiters, 0),
      recordCount: allRecords.length,
    };
  }

  async remove(id: string, userId: string): Promise<void> {
    await this.milkModel.findOneAndDelete({ _id: id, userId }).exec();
  }
}
