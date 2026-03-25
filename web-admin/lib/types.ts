export interface Farm {
  _id: string;
  name: string;
  location: string;
  size: number;
  description: string;
  photoUrl: string;
  createdAt: string;
  owner?: {
    _id: string;
    fullName: string;
    email: string;
  };
  animalCount?: number;
  milkProductionToday?: number;
}

export interface Animal {
  _id: string;
  name: string;
  tagId: string;
  breed: string;
  gender: 'Male' | 'Female';
  dob: string;
  weight: number;
  photoUrl: string;
  farmId: string;
}

export interface AdminAnimal {
  _id: string;
  name: string;
  tagId: string;
  breed: string;
  gender: string;
  dob: string;
  status: string;
  userId: string;
  farmId: string;
  createdAt: string;
  ownerName: string;
  farmName: string;
  farmLocation: string;
}

export interface MilkRecord {
  _id: string;
  date: string;
  amountLiters: number;
  session: 'Morning' | 'Evening' | 'Night';
  notes: string;
  createdAt: string;
  farm?: {
    _id: string;
    name: string;
  };
  animal?: {
    _id: string;
    name: string;
    tagId: string;
  };
  owner?: {
    _id: string;
    fullName: string;
  };
}

export interface AdminStats {
  totalFarmers: number;
  totalFarms: number;
  totalAnimals: number;
  totalMilkToday: number;
  totalMilkThisMonth: number;
}

export interface MilkTrend {
  date: string;
  totalLiters: number;
}

export interface Farmer {
  _id: string;
  email: string;
  fullName: string;
  phone: string;
  cin: string;
  status: 'pending' | 'approved' | 'banned';
  createdAt: string;
  farmCount: number;
  animalCount: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
}

export interface FarmerProfileFarm {
  _id: string;
  name: string;
  location: string;
  size: number;
}

export interface FarmerProfileAnimal {
  _id: string;
  name: string;
  tagId: string;
  breed: string;
  gender: string;
  farmName: string;
}

export interface FarmerProfileWorker {
  _id: string;
  name: string;
  role: string;
  phone: string;
}

export interface FarmerProfileMilkRecord {
  date: string;
  volume: number;
}

export interface FarmerProfile {
  farmer: {
    _id: string;
    email: string;
    fullName: string;
    phone: string;
    cin: string;
    status: 'pending' | 'approved' | 'banned';
    createdAt: string;
  };
  farms: FarmerProfileFarm[];
  animals: FarmerProfileAnimal[];
  workers: FarmerProfileWorker[];
  recentMilkRecords: FarmerProfileMilkRecord[];
  stats: {
    totalFarms: number;
    totalAnimals: number;
    totalWorkers: number;
    totalMilkThisMonth: number;
  };
}
