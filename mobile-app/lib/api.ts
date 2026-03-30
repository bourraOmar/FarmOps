import axios, { AxiosInstance } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// const API_BASE_URL = 'http://10.30.250.161:3005'; // Backend local network IP // NOTE: Switch to https://fresh-parts-press.loca.lt if network blocks it

const API_BASE_URL = 'http://192.168.8.101:3005'; // Backend local network IP // NOTE: Switch to https://fresh-parts-press.loca.lt if network blocks it

export interface User {
  _id: string;
  email: string;
  fullName: string;
  role: string;
  cin?: string;
  phone: string;
  status?: 'pending' | 'approved' | 'banned';
}

export interface Farm {
  _id: string;
  userId: string;
  name: string;
  location?: string;
  size?: number;
  description?: string;
  photoUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateFarmPayload {
  name: string;
  location?: string;
  size?: number;
  description?: string;
  photoUrl?: string;
}

export interface CreateAnimalPayload {
  farmId: string;
  name: string;
  tagId?: string;
  breed?: string;
  gender?: 'Male' | 'Female';
  dob?: string;
  weight?: number;
  photoUrl?: string;
}

// Global event listener for account status changes (banned/pending)
type AccountStatusCallback = (type: 'banned' | 'pending', message: string) => void;
let _onAccountStatusChange: AccountStatusCallback | null = null;

export function setAccountStatusListener(cb: AccountStatusCallback | null) {
  _onAccountStatusChange = cb;
}

class ApiClient {
  private client: AxiosInstance;

  constructor(baseURL: string) {
    console.log('[API] Connected to backend at:', baseURL);
    this.client = axios.create({
      baseURL,
      timeout: 10000,
      headers: { 'Content-Type': 'application/json' },
    });

    // Request interceptor: attach JWT token
    this.client.interceptors.request.use(
      async (config) => {
        const token = await AsyncStorage.getItem('access_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor: catch banned/pending on ANY API call
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const errorCode = error.response?.data?.error;
        const message = error.response?.data?.message || '';

        if (errorCode === 'ACCOUNT_BANNED' || errorCode === 'ACCOUNT_PENDING') {
          // Clear stored credentials immediately
          await AsyncStorage.removeItem('access_token');
          await AsyncStorage.removeItem('user');
          await AsyncStorage.removeItem('selected_farm_id');

          // Notify the listener (AuthContext)
          const type = errorCode === 'ACCOUNT_BANNED' ? 'banned' : 'pending';
          if (_onAccountStatusChange) {
            _onAccountStatusChange(type, message);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  // ───────── Auth ─────────

  async login(email: string, password: string) {
    const res = await this.client.post('/auth/login', { email, password });
    return res.data; // { access_token, user }
  }

  async signup(data: any) {
    const res = await this.client.post('/auth/signup', data);
    return res.data; // { access_token, user }
  }

  async getProfile(): Promise<User> {
    const res = await this.client.get<User>('/auth/profile');
    return res.data;
  }

  // ───────── Farms ─────────

  async getFarms(): Promise<Farm[]> {
    const res = await this.client.get<Farm[]>('/farms');
    return res.data;
  }

  async getFarmById(id: string): Promise<Farm> {
    const res = await this.client.get<Farm>(`/farms/${id}`);
    return res.data;
  }

  async createFarm(data: CreateFarmPayload): Promise<Farm> {
    const res = await this.client.post<Farm>('/farms', data);
    return res.data;
  }

  async updateFarm(id: string, data: Partial<CreateFarmPayload>): Promise<Farm> {
    const res = await this.client.patch<Farm>(`/farms/${id}`, data);
    return res.data;
  }

  async deleteFarm(id: string): Promise<void> {
    await this.client.delete(`/farms/${id}`);
  }

  async getFarmStats(): Promise<{ totalFarms: number }> {
    const res = await this.client.get<{ totalFarms: number }>('/farms/stats');
    return res.data;
  }

  // ───────── Livestock (Farm-scoped) ─────────

  async createAnimal(data: CreateAnimalPayload) {
    const res = await this.client.post('/livestock', data);
    return res.data;
  }

  async getAnimals(farmId?: string) {
    const params = farmId ? { farmId } : {};
    const res = await this.client.get('/livestock', { params });
    return res.data;
  }

  async getAnimalById(id: string) {
    const res = await this.client.get(`/livestock/${id}`);
    return res.data;
  }

  async updateAnimal(id: string, data: Partial<CreateAnimalPayload>) {
    const res = await this.client.patch(`/livestock/${id}`, data);
    return res.data;
  }

  async deleteAnimal(id: string): Promise<void> {
    await this.client.delete(`/livestock/${id}`);
  }

  async getDashboardStats(farmId?: string) {
    const params = farmId ? { farmId } : {};
    const res = await this.client.get<{ totalAnimals: number }>('/livestock/stats', { params });
    return res.data;
  }

  async getNextTagId(farmId?: string): Promise<string> {
    const params = farmId ? { farmId } : {};
    const res = await this.client.get<{ tagId: string }>('/livestock/next-tag-id', { params });
    return res.data.tagId;
  }

  // ───────── Workers (Farm-scoped) ─────────

  async getWorkers(farmId?: string) {
    const params = farmId ? { farmId } : {};
    const res = await this.client.get('/workers', { params });
    return res.data;
  }

  async createWorker(data: { farmId: string; name: string; role: string; phone?: string; email?: string; avatarUrl?: string }) {
    const res = await this.client.post('/workers', data);
    return res.data;
  }

  async getWorkerById(id: string) {
    const res = await this.client.get(`/workers/${id}`);
    return res.data;
  }

  async updateWorker(id: string, data: { name?: string; role?: string; phone?: string; email?: string; avatarUrl?: string }) {
    const res = await this.client.patch(`/workers/${id}`, data);
    return res.data;
  }

  async deleteWorker(id: string): Promise<void> {
    await this.client.delete(`/workers/${id}`);
  }

  // ───────── Milk Records (Farm-scoped) ─────────

  async getMilkRecords(farmId?: string) {
    const params = farmId ? { farmId } : {};
    const res = await this.client.get('/milk', { params });
    return res.data;
  }

  async getMilkByAnimal(animalId: string) {
    const res = await this.client.get(`/milk/animal/${animalId}`);
    return res.data;
  }

  async getMilkStats(farmId?: string) {
    const params = farmId ? { farmId } : {};
    const res = await this.client.get<{ totalToday: number; totalThisMonth: number; recordCount: number }>('/milk/stats', { params });
    return res.data;
  }

  async createMilkRecord(data: { farmId: string; animalId: string; date: string; amountLiters: number; session: string; notes?: string }) {
    const res = await this.client.post('/milk', data);
    return res.data;
  }

  async deleteMilkRecord(id: string): Promise<void> {
    await this.client.delete(`/milk/${id}`);
  }

  // ───────── Auth Utils ─────────

  async logout(): Promise<void> {
    await AsyncStorage.removeItem('access_token');
    await AsyncStorage.removeItem('user');
    await AsyncStorage.removeItem('selected_farm_id');
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
