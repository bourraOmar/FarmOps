import { Test, TestingModule } from '@nestjs/testing';
import { MilkService } from './milk.service';
import { getModelToken } from '@nestjs/mongoose';
import { MilkRecord } from './schemas/milk-record.schema';

describe('MilkService', () => {
  let service: MilkService;

  const mockMilkModel = {
    find: jest.fn().mockReturnThis(),
    exec: jest.fn().mockResolvedValue([]),
    findOneAndDelete: jest.fn().mockReturnThis(),
    deleteMany: jest.fn().mockReturnThis(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MilkService,
        {
          provide: getModelToken(MilkRecord.name),
          useValue: mockMilkModel,
        },
      ],
    }).compile();

    service = module.get<MilkService>(MilkService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
