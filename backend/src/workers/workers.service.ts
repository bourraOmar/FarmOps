import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Worker, WorkerDocument } from './schemas/worker.schema';
import { CreateWorkerDto } from './dto/create-worker.dto';

@Injectable()
export class WorkersService {
  constructor(
    @InjectModel(Worker.name) private workerModel: Model<WorkerDocument>,
  ) {}

  async create(userId: string, dto: CreateWorkerDto): Promise<Worker> {
    return new this.workerModel({ ...dto, userId }).save();
  }

  async findAll(userId: string): Promise<Worker[]> {
    return this.workerModel.find({ userId }).exec();
  }

  async findOne(id: string, userId: string): Promise<Worker | null> {
    return this.workerModel.findOne({ _id: id, userId }).exec();
  }

  async update(id: string, userId: string, dto: Partial<CreateWorkerDto>): Promise<Worker | null> {
    return this.workerModel.findOneAndUpdate({ _id: id, userId }, dto, { new: true }).exec();
  }

  async remove(id: string, userId: string): Promise<void> {
    await this.workerModel.findOneAndDelete({ _id: id, userId }).exec();
  }
}
