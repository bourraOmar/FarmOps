import axios, { AxiosInstance } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://10.30.250.161:3005'; // Backend local network IP // NOTE: Switch to https://fresh-parts-press.loca.lt if network blocks it

export interface User {
  _id: string;
  email: string;
  fullName: string;
  role: string;
  cin?: string;
  phone: string;
}

export interface CreateAnimalPayload {
  name: string;
  tagId?: string;
  breed?: string;
  gender?: 'Male' | 'Female';
  dob?: string;
  weight?: number;
  photoUrl?: string;
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
  }

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

  async createAnimal(data: CreateAnimalPayload) {
    const res = await this.client.post('/livestock', data);
    return res.data;
  }

  async getAnimals() {
    const res = await this.client.get('/livestock');
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

  async getDashboardStats() {
    const res = await this.client.get<{ totalAnimals: number }>('/livestock/stats');
    return res.data;
  }

  async getNextTagId(): Promise<string> {
    const res = await this.client.get<{ tagId: string }>('/livestock/next-tag-id');
    return res.data.tagId;
  }

  async getWorkers() {
    const res = await this.client.get('/workers');
    return res.data;
  }

  async createWorker(data: { name: string; role: string; phone?: string; email?: string; avatarUrl?: string }) {
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

  async getMilkRecords() {
    const res = await this.client.get('/milk');
    return res.data;
  }

  async getMilkByAnimal(animalId: string) {
    const res = await this.client.get(`/milk/animal/${animalId}`);
    return res.data;
  }

  async getMilkStats() {
    const res = await this.client.get<{ totalToday: number; totalThisMonth: number; recordCount: number }>('/milk/stats');
    return res.data;
  }

  async createMilkRecord(data: { animalId: string; date: string; amountLiters: number; session: string; notes?: string }) {
    const res = await this.client.post('/milk', data);
    return res.data;
  }

  async deleteMilkRecord(id: string): Promise<void> {
    await this.client.delete(`/milk/${id}`);
  }

  async logout(): Promise<void> {
    await AsyncStorage.removeItem('access_token');
    await AsyncStorage.removeItem('user');
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
