import { Test, TestingModule } from '@nestjs/testing';
import { FarmsService } from './farms.service';
import { getModelToken } from '@nestjs/mongoose';
import { Farm } from './schemas/farm.schema';

describe('FarmsService', () => {
  let service: FarmsService;

  const mockFarmModel = {
    find: jest.fn().mockReturnThis(),
    exec: jest.fn().mockResolvedValue([]),
    findOne: jest.fn().mockReturnThis(),
    countDocuments: jest.fn().mockReturnThis(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FarmsService,
        {
          provide: getModelToken(Farm.name),
          useValue: mockFarmModel,
        },
      ],
    }).compile();

    service = module.get<FarmsService>(FarmsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
