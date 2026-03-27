import { Test, TestingModule } from '@nestjs/testing';
import { WorkersService } from './workers.service';
import { getModelToken } from '@nestjs/mongoose';
import { Worker } from './schemas/worker.schema';

describe('WorkersService', () => {
  let service: WorkersService;

  const mockWorkerModel = {
    find: jest.fn().mockReturnThis(),
    findOne: jest.fn().mockReturnThis(),
    findOneAndUpdate: jest.fn().mockReturnThis(),
    findOneAndDelete: jest.fn().mockReturnThis(),
    deleteMany: jest.fn().mockReturnThis(),
    countDocuments: jest.fn().mockReturnThis(),
    exec: jest.fn().mockResolvedValue([]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WorkersService,
        {
          provide: getModelToken(Worker.name),
          useValue: mockWorkerModel,
        },
      ],
    }).compile();

    service = module.get<WorkersService>(WorkersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
