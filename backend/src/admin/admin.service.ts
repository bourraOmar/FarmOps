import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../users/schemas/user.schema';
import { Farm, FarmDocument } from '../farms/schemas/farm.schema';
import { Animal, AnimalDocument } from '../livestock/schemas/animal.schema';
import {
  MilkRecord,
  MilkRecordDocument,
} from '../milk/schemas/milk-record.schema';
import { Worker, WorkerDocument } from '../workers/schemas/worker.schema';

export interface AdminStats {
  totalFarmers: number;
  totalFarms: number;
  totalAnimals: number;
  totalMilkToday: number;
  totalMilkThisMonth: number;
}

export interface FarmerWithStats {
  _id: string;
  email: string;
  fullName: string;
  phone: string;
  cin: string;
  createdAt: Date;
  farmCount: number;
  animalCount: number;
}

export interface FarmWithOwner {
  _id: string;
  name: string;
  location: string;
  size: number;
  description: string;
  photoUrl: string;
  createdAt: Date;
  owner: {
    _id: string;
    fullName: string;
    email: string;
  };
  animalCount: number;
  milkProductionToday: number;
}

export interface MilkRecordWithDetails {
  _id: string;
  date: string;
  amountLiters: number;
  session: string;
  notes: string;
  createdAt: Date;
  farm: {
    _id: string;
    name: string;
  };
  animal: {
    _id: string;
    name: string;
    tagId: string;
  };
  owner: {
    _id: string;
    fullName: string;
  };
}

export interface MilkTrend {
  date: string;
  totalLiters: number;
}

export interface AdminAnimal {
  _id: string;
  name: string;
  tagId: string;
  breed: string;
  gender: string;
  dob: Date;
  status: string;
  userId: string;
  farmId: string;
  createdAt: Date;
  ownerName: string;
  farmName: string;
  farmLocation: string;
}

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Farm.name) private farmModel: Model<FarmDocument>,
    @InjectModel(Animal.name) private animalModel: Model<AnimalDocument>,
    @InjectModel(MilkRecord.name) private milkModel: Model<MilkRecordDocument>,
    @InjectModel(Worker.name) private workerModel: Model<WorkerDocument>,
  ) {}

  async getAggregateStats(): Promise<AdminStats> {
    const today = new Date();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const yyyy = today.getFullYear();
    const todayStr = `${mm}/${dd}/${yyyy}`;
    const monthPrefix = `${mm}/`;

    const [totalFarmers, totalFarms, totalAnimals, todayRecords, monthRecords] =
      await Promise.all([
        this.userModel.countDocuments({ role: 'farmer' }).exec(),
        this.farmModel.countDocuments().exec(),
        this.animalModel.countDocuments().exec(),
        this.milkModel.find({ date: todayStr }).exec(),
        this.milkModel
          .find({ date: { $regex: `^${monthPrefix}.*/${yyyy}$` } })
          .exec(),
      ]);

    return {
      totalFarmers,
      totalFarms,
      totalAnimals,
      totalMilkToday: todayRecords.reduce((sum, r) => sum + r.amountLiters, 0),
      totalMilkThisMonth: monthRecords.reduce(
        (sum, r) => sum + r.amountLiters,
        0,
      ),
    };
  }

  async getAllFarmers(
    page: number,
    limit: number,
  ): Promise<{
    farmers: FarmerWithStats[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;

    const [farmers, total] = await Promise.all([
      this.userModel
        .find({ role: 'farmer' })
        .select('-password')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .lean()
        .exec(),
      this.userModel.countDocuments({ role: 'farmer' }).exec(),
    ]);

    const farmersWithStats = await Promise.all(
      farmers.map(async (farmer) => {
        const [farmCount, animalCount] = await Promise.all([
          this.farmModel.countDocuments({ userId: farmer._id.toString() }),
          this.animalModel.countDocuments({ userId: farmer._id.toString() }),
        ]);

        return {
          _id: farmer._id.toString(),
          email: farmer.email,
          fullName: farmer.fullName,
          phone: farmer.phone,
          cin: farmer.cin,
          status: (farmer as any).status || 'pending',
          createdAt: (farmer as any).createdAt,
          farmCount,
          animalCount,
        };
      }),
    );

    return {
      farmers: farmersWithStats,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getAllFarms(
    page: number,
    limit: number,
  ): Promise<{
    farms: FarmWithOwner[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;

    const today = new Date();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const yyyy = today.getFullYear();
    const todayStr = `${mm}/${dd}/${yyyy}`;

    const [farms, total] = await Promise.all([
      this.farmModel
        .find()
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .lean()
        .exec(),
      this.farmModel.countDocuments().exec(),
    ]);

    const farmsWithOwner = await Promise.all(
      farms.map(async (farm) => {
        const [owner, animalCount, todayMilk] = await Promise.all([
          this.userModel
            .findById(farm.userId)
            .select('fullName email')
            .lean()
            .exec(),
          this.animalModel.countDocuments({ farmId: farm._id }),
          this.milkModel.find({ farmId: farm._id, date: todayStr }).exec(),
        ]);

        return {
          _id: (farm._id as any).toString(),
          name: farm.name,
          location: farm.location || '',
          size: farm.size || 0,
          description: farm.description || '',
          photoUrl: farm.photoUrl || '',
          createdAt: (farm as any).createdAt,
          owner: owner
            ? {
                _id: (owner._id as any).toString(),
                fullName: owner.fullName,
                email: owner.email,
              }
            : { _id: '', fullName: 'Unknown', email: '' },
          animalCount,
          milkProductionToday: todayMilk.reduce(
            (sum, r) => sum + r.amountLiters,
            0,
          ),
        };
      }),
    );

    return {
      farms: farmsWithOwner,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getAllLivestock(
    page: number,
    limit: number,
    search?: string,
    breed?: string,
  ): Promise<{
    animals: AdminAnimal[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;

    const query: any = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { tagId: { $regex: search, $options: 'i' } },
      ];
    }
    if (breed && breed !== 'Toutes les Races') {
      query.breed = breed;
    }

    const [animals, total] = await Promise.all([
      this.animalModel
        .find(query)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .lean()
        .exec(),
      this.animalModel.countDocuments(query).exec(),
    ]);

    const animalsWithDetails = await Promise.all(
      animals.map(async (animal) => {
        const [owner, farm] = await Promise.all([
          this.userModel
            .findById(animal.userId)
            .select('fullName')
            .lean()
            .exec(),
          this.farmModel
            .findById(animal.farmId)
            .select('name location')
            .lean()
            .exec(),
        ]);

        return {
          _id: (animal._id as any).toString(),
          name: animal.name,
          tagId: animal.tagId || '',
          breed: animal.breed || '',
          gender: animal.gender || '',
          dob: (animal as any).dob,
          status: (animal as any).status || 'Active',
          userId: animal.userId ? animal.userId.toString() : '',
          farmId: animal.farmId ? animal.farmId.toString() : '',
          createdAt: (animal as any).createdAt,
          ownerName: owner ? owner.fullName : 'Unknown',
          farmName: farm ? farm.name : 'Unknown',
          farmLocation: farm?.location || '',
        };
      }),
    );

    return {
      animals: animalsWithDetails,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getAllMilkRecords(
    page: number,
    limit: number,
  ): Promise<{
    records: MilkRecordWithDetails[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;

    const [records, total] = await Promise.all([
      this.milkModel
        .find()
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .lean()
        .exec(),
      this.milkModel.countDocuments().exec(),
    ]);

    const recordsWithDetails = await Promise.all(
      records.map(async (record) => {
        const [farm, animal, owner] = await Promise.all([
          this.farmModel.findById(record.farmId).select('name').lean().exec(),
          this.animalModel
            .findById(record.animalId)
            .select('name tagId')
            .lean()
            .exec(),
          this.userModel
            .findById(record.userId)
            .select('fullName')
            .lean()
            .exec(),
        ]);

        return {
          _id: (record._id as any).toString(),
          date: record.date,
          amountLiters: record.amountLiters,
          session: record.session,
          notes: record.notes || '',
          createdAt: (record as any).createdAt,
          farm: farm
            ? { _id: (farm._id as any).toString(), name: farm.name }
            : { _id: '', name: 'Unknown' },
          animal: animal
            ? {
                _id: (animal._id as any).toString(),
                name: animal.name,
                tagId: animal.tagId || '',
              }
            : { _id: '', name: 'Unknown', tagId: '' },
          owner: owner
            ? { _id: (owner._id as any).toString(), fullName: owner.fullName }
            : { _id: '', fullName: 'Unknown' },
        };
      }),
    );

    return {
      records: recordsWithDetails,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getMilkProductionTrends(days: number): Promise<MilkTrend[]> {
    const trends: MilkTrend[] = [];
    const today = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);

      const mm = String(date.getMonth() + 1).padStart(2, '0');
      const dd = String(date.getDate()).padStart(2, '0');
      const yyyy = date.getFullYear();
      const dateStr = `${mm}/${dd}/${yyyy}`;

      const records = await this.milkModel.find({ date: dateStr }).exec();
      const totalLiters = records.reduce((sum, r) => sum + r.amountLiters, 0);

      trends.push({
        date: `${yyyy}-${mm}-${dd}`,
        totalLiters,
      });
    }

    return trends;
  }

  async getFarmerProfile(farmerId: string): Promise<{
    farmer: any;
    farms: any[];
    animals: any[];
    workers: any[];
    recentMilkRecords: any[];
    stats: {
      totalFarms: number;
      totalAnimals: number;
      totalWorkers: number;
      totalMilkThisMonth: number;
    };
  }> {
    const farmer = await this.userModel
      .findById(farmerId)
      .select('-password')
      .lean()
      .exec();

    if (!farmer) {
      throw new NotFoundException('Farmer not found');
    }

    const userId = farmer._id.toString();

    // Get all farms for this farmer
    const farms = await this.farmModel.find({ userId }).lean().exec();

    const farmIds = farms.map((f) => f._id);

    // Get all animals for this farmer
    const animals = await this.animalModel
      .find({ userId })
      .limit(10)
      .lean()
      .exec();

    // Get all workers for this farmer's farms
    const workers = await this.workerModel.find({ userId }).lean().exec();

    // Get recent milk records
    const recentMilkRecords = await this.milkModel
      .find({ userId })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean()
      .exec();

    // Calculate this month's milk production
    const today = new Date();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    const monthRecords = await this.milkModel
      .find({
        userId,
        date: { $regex: `^${mm}/.*/${yyyy}$` },
      })
      .exec();

    const totalMilkThisMonth = monthRecords.reduce(
      (sum, r) => sum + r.amountLiters,
      0,
    );

    // Get counts
    const [totalAnimals, totalWorkers] = await Promise.all([
      this.animalModel.countDocuments({ userId }),
      this.workerModel.countDocuments({ userId }),
    ]);

    // Format animals with farm info
    const animalsWithDetails = await Promise.all(
      animals.map(async (animal) => {
        const farm = farms.find(
          (f) => f._id.toString() === animal.farmId?.toString(),
        );
        return {
          _id: (animal._id as any).toString(),
          name: animal.name,
          tagId: animal.tagId || '',
          breed: animal.breed || '',
          gender: animal.gender || '',
          farmName: farm?.name || 'Unknown',
        };
      }),
    );

    // Format milk records with date aggregation
    const milkByDate: Record<string, number> = {};
    recentMilkRecords.forEach((record) => {
      milkByDate[record.date] =
        (milkByDate[record.date] || 0) + record.amountLiters;
    });

    const milkRecordsByDate = Object.entries(milkByDate)
      .map(([date, volume]) => ({ date, volume }))
      .slice(0, 7);

    return {
      farmer: {
        _id: farmer._id.toString(),
        email: farmer.email,
        fullName: farmer.fullName,
        phone: farmer.phone,
        cin: farmer.cin,
        status: (farmer as any).status || 'pending',
        createdAt: (farmer as any).createdAt,
      },
      farms: farms.map((f) => ({
        _id: (f._id as any).toString(),
        name: f.name,
        location: f.location || '',
        size: f.size || 0,
      })),
      animals: animalsWithDetails,
      workers: workers.map((w) => ({
        _id: (w._id as any).toString(),
        name: w.name,
        role: w.role,
        phone: w.phone || '',
      })),
      recentMilkRecords: milkRecordsByDate,
      stats: {
        totalFarms: farms.length,
        totalAnimals,
        totalWorkers,
        totalMilkThisMonth,
      },
    };
  }

  async updateFarmerStatus(
    farmerId: string,
    status: 'pending' | 'approved' | 'banned',
  ): Promise<{ success: boolean; message: string }> {
    const farmer = await this.userModel.findById(farmerId).exec();

    if (!farmer) {
      throw new NotFoundException('Farmer not found');
    }

    if (farmer.role !== 'farmer') {
      throw new Error('Cannot update status of non-farmer users');
    }

    farmer.status = status;
    await farmer.save();

    const statusMessages = {
      pending: 'Farmer status set to pending',
      approved: 'Farmer has been approved',
      banned: 'Farmer has been banned',
    };

    return {
      success: true,
      message: statusMessages[status],
    };
  }
}
