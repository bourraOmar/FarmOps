import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Animal, AnimalDocument } from './schemas/animal.schema';
import { CreateAnimalDto } from './dto/create-animal.dto';

@Injectable()
export class LivestockService {
  constructor(
    @InjectModel(Animal.name) private animalModel: Model<AnimalDocument>,
  ) {}

  async create(
    userId: string,
    createAnimalDto: CreateAnimalDto,
  ): Promise<Animal> {
    const createdAnimal = new this.animalModel({
      ...createAnimalDto,
      userId,
      farmId: new Types.ObjectId(createAnimalDto.farmId),
    });
    return createdAnimal.save();
  }

  async findAll(userId: string, farmId?: string): Promise<Animal[]> {
    const filter: Record<string, any> = { userId };
    if (farmId) {
      filter.farmId = new Types.ObjectId(farmId);
    }
    return this.animalModel.find(filter).exec();
  }

  async countAll(userId: string, farmId?: string): Promise<number> {
    const filter: Record<string, any> = { userId };
    if (farmId) {
      filter.farmId = new Types.ObjectId(farmId);
    }
    return this.animalModel.countDocuments(filter).exec();
  }

  async findOne(id: string, userId: string): Promise<Animal | null> {
    return this.animalModel.findOne({ _id: id, userId }).exec();
  }

  async nextTagId(userId: string, farmId?: string): Promise<string> {
    const filter: Record<string, any> = {
      userId,
      tagId: { $exists: true, $ne: '' },
    };
    if (farmId) {
      filter.farmId = new Types.ObjectId(farmId);
    }
    const animals = await this.animalModel.find(filter, { tagId: 1 }).exec();
    let max = 0;
    for (const a of animals) {
      const n = parseInt((a as unknown as { tagId: string }).tagId, 10);
      if (!isNaN(n) && n > max) max = n;
    }
    return String(max + 1).padStart(6, '0');
  }

  async update(
    id: string,
    userId: string,
    dto: Partial<CreateAnimalDto>,
  ): Promise<Animal | null> {
    return this.animalModel
      .findOneAndUpdate({ _id: id, userId }, dto, { new: true })
      .exec();
  }

  async remove(id: string, userId: string): Promise<void> {
    await this.animalModel.findOneAndDelete({ _id: id, userId }).exec();
  }

  async removeAllByFarm(farmId: string, userId: string): Promise<void> {
    await this.animalModel
      .deleteMany({ farmId: new Types.ObjectId(farmId), userId })
      .exec();
  }
}
