import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Worker, WorkerDocument } from './schemas/worker.schema';
import { CreateWorkerDto } from './dto/create-worker.dto';

@Injectable()
export class WorkersService {
  constructor(
    @InjectModel(Worker.name) private workerModel: Model<WorkerDocument>,
  ) {}

  async create(userId: string, dto: CreateWorkerDto): Promise<Worker> {
    return new this.workerModel({
      ...dto,
      userId,
      farmId: new Types.ObjectId(dto.farmId),
    }).save();
  }

  async findAll(userId: string, farmId?: string): Promise<Worker[]> {
    const filter: Record<string, any> = { userId };
    if (farmId) {
      filter.farmId = new Types.ObjectId(farmId);
    }
    return this.workerModel.find(filter).exec();
  }

  async findOne(id: string, userId: string): Promise<Worker | null> {
    return this.workerModel.findOne({ _id: id, userId }).exec();
  }

  async update(
    id: string,
    userId: string,
    dto: Partial<CreateWorkerDto>,
  ): Promise<Worker | null> {
    return this.workerModel
      .findOneAndUpdate({ _id: id, userId }, dto, { new: true })
      .exec();
  }

  async remove(id: string, userId: string): Promise<void> {
    await this.workerModel.findOneAndDelete({ _id: id, userId }).exec();
  }

  async countAll(userId: string, farmId?: string): Promise<number> {
    const filter: Record<string, any> = { userId };
    if (farmId) {
      filter.farmId = new Types.ObjectId(farmId);
    }
    return this.workerModel.countDocuments(filter).exec();
  }

  async removeAllByFarm(farmId: string, userId: string): Promise<void> {
    await this.workerModel
      .deleteMany({ farmId: new Types.ObjectId(farmId), userId })
      .exec();
  }
}
