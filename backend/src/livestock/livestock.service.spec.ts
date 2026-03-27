import { Test, TestingModule } from '@nestjs/testing';
import { LivestockService } from './livestock.service';
import { getModelToken } from '@nestjs/mongoose';
import { Animal } from './schemas/animal.schema';

describe('LivestockService', () => {
  let service: LivestockService;

  // Mock implementation of the Mongoose model
  const mockAnimalModel = {
    find: jest.fn().mockReturnThis(),
    exec: jest.fn().mockResolvedValue([{ name: 'Bessie', species: 'Cow' }]),
    findOne: jest.fn().mockReturnThis(),
    countDocuments: jest.fn().mockReturnThis(),
    deleteMany: jest.fn().mockReturnThis(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LivestockService,
        {
          provide: getModelToken(Animal.name),
          useValue: mockAnimalModel,
        },
      ],
    }).compile();

    service = module.get<LivestockService>(LivestockService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of animals for a specific userId', async () => {
      const userId = 'user123';
      
      const result = await service.findAll(userId);
      
      expect(mockAnimalModel.find).toHaveBeenCalledWith({ userId });
      expect(result).toEqual([{ name: 'Bessie', species: 'Cow' }]);
    });
  });

  describe('countAll', () => {
    it('should return the total number of animals for a specific userId', async () => {
      const userId = 'user123';
      mockAnimalModel.exec.mockResolvedValueOnce(5);

      const result = await service.countAll(userId);

      expect(mockAnimalModel.countDocuments).toHaveBeenCalledWith({ userId });
      expect(result).toEqual(5);
    });
  });
});
