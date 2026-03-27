import { Test, TestingModule } from '@nestjs/testing';
import { AdminService } from './admin.service';
import { getModelToken } from '@nestjs/mongoose';
import { User } from '../users/schemas/user.schema';
import { Farm } from '../farms/schemas/farm.schema';
import { Animal } from '../livestock/schemas/animal.schema';
import { MilkRecord } from '../milk/schemas/milk-record.schema';
import { Worker } from '../workers/schemas/worker.schema';

describe('AdminService', () => {
  let service: AdminService;

  const mockModel = {
    find: jest.fn().mockReturnThis(),
    findById: jest.fn().mockReturnThis(),
    countDocuments: jest.fn().mockReturnThis(),
    exec: jest.fn().mockResolvedValue([]),
    select: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    sort: jest.fn().mockReturnThis(),
    lean: jest.fn().mockReturnThis(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminService,
        { provide: getModelToken(User.name), useValue: mockModel },
        { provide: getModelToken(Farm.name), useValue: mockModel },
        { provide: getModelToken(Animal.name), useValue: mockModel },
        { provide: getModelToken(MilkRecord.name), useValue: mockModel },
        { provide: getModelToken(Worker.name), useValue: mockModel },
      ],
    }).compile();

    service = module.get<AdminService>(AdminService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
