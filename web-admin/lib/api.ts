import { AdminStats, Farm, MilkRecord, Farmer, MilkTrend, FarmerProfile, AdminAnimal } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3005';

export interface LoginResponse {
  access_token: string;
}

export interface User {
  _id: string;
  email: string;
  fullName: string;
  role: string;
  cin: string;
  phone: string;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private getAuthHeader(): HeadersInit {
    const token = localStorage.getItem('access_token');
    if (token) {
      return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      };
    }
    return {
      'Content-Type': 'application/json',
    };
  }

  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await fetch(`${this.baseUrl}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      // NestJS returns { statusCode, message, error } — use message for the descriptive text
      const message = errorBody.message || errorBody.error || 'Email ou mot de passe incorrect';
      throw new Error(message);
    }

    return response.json();
  }

  async getProfile(): Promise<User> {
    const response = await fetch(`${this.baseUrl}/auth/profile`, {
      method: 'GET',
      headers: this.getAuthHeader(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch profile');
    }

    return response.json();
  }

  async logout(): Promise<void> {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
  }

  // Admin endpoints
  async getAdminStats(): Promise<AdminStats> {
    const response = await fetch(`${this.baseUrl}/admin/stats`, {
      method: 'GET',
      headers: this.getAuthHeader(),
    });
    if (!response.ok) {
      throw new Error('Failed to fetch admin stats');
    }
    return response.json();
  }

  async getAdminFarmers(
    page = 1,
    limit = 20
  ): Promise<{
    farmers: Farmer[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const response = await fetch(
      `${this.baseUrl}/admin/farmers?page=${page}&limit=${limit}`,
      {
        method: 'GET',
        headers: this.getAuthHeader(),
      }
    );
    if (!response.ok) {
      throw new Error('Failed to fetch farmers');
    }
    return response.json();
  }

  async getAdminFarms(
    page = 1,
    limit = 20
  ): Promise<{
    farms: Farm[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const response = await fetch(
      `${this.baseUrl}/admin/farms?page=${page}&limit=${limit}`,
      {
        method: 'GET',
        headers: this.getAuthHeader(),
      }
    );
    if (!response.ok) {
      throw new Error('Failed to fetch farms');
    }
    return response.json();
  }

  async getAdminLivestock(
    page = 1,
    limit = 20,
    search = '',
    breed = ''
  ): Promise<{
    animals: AdminAnimal[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    let url = `${this.baseUrl}/admin/livestock?page=${page}&limit=${limit}`;
    if (search) url += `&search=${encodeURIComponent(search)}`;
    if (breed && breed !== 'Toutes les Races') url += `&breed=${encodeURIComponent(breed)}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: this.getAuthHeader(),
    });
    if (!response.ok) {
      throw new Error('Failed to fetch livestock');
    }
    return response.json();
  }

  async getAdminMilkRecords(
    page = 1,
    limit = 20
  ): Promise<{
    records: MilkRecord[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const response = await fetch(
      `${this.baseUrl}/admin/milk-records?page=${page}&limit=${limit}`,
      {
        method: 'GET',
        headers: this.getAuthHeader(),
      }
    );
    if (!response.ok) {
      throw new Error('Failed to fetch milk records');
    }
    return response.json();
  }

  async getAdminMilkTrends(days = 7): Promise<MilkTrend[]> {
    const response = await fetch(
      `${this.baseUrl}/admin/milk-trends?days=${days}`,
      {
        method: 'GET',
        headers: this.getAuthHeader(),
      }
    );
    if (!response.ok) {
      throw new Error('Failed to fetch milk trends');
    }
    return response.json();
  }

  async getFarmerProfile(farmerId: string): Promise<FarmerProfile> {
    const response = await fetch(
      `${this.baseUrl}/admin/farmers/${farmerId}`,
      {
        method: 'GET',
        headers: this.getAuthHeader(),
      }
    );
    if (!response.ok) {
      throw new Error('Failed to fetch farmer profile');
    }
    return response.json();
  }

  async updateFarmerStatus(
    farmerId: string,
    status: 'pending' | 'approved' | 'banned'
  ): Promise<{ success: boolean; message: string }> {
    const response = await fetch(
      `${this.baseUrl}/admin/farmers/${farmerId}/status`,
      {
        method: 'PATCH',
        headers: this.getAuthHeader(),
        body: JSON.stringify({ status }),
      }
    );
    if (!response.ok) {
      throw new Error('Failed to update farmer status');
    }
    return response.json();
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
