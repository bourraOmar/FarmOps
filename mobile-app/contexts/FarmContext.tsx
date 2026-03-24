import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiClient, Farm } from '../lib/api';
import { useAuth } from './AuthContext';

interface FarmContextType {
  farms: Farm[];
  selectedFarm: Farm | null;
  loading: boolean;
  selectFarm: (farm: Farm) => Promise<void>;
  refreshFarms: () => Promise<void>;
  createFarm: (data: { name: string; location?: string; size?: number; description?: string }) => Promise<Farm>;
  deleteFarm: (id: string) => Promise<void>;
}

const FarmContext = createContext<FarmContextType | undefined>(undefined);

export const useFarm = () => {
  const ctx = useContext(FarmContext);
  if (!ctx) throw new Error('useFarm must be used within FarmProvider');
  return ctx;
};

export const FarmProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [farms, setFarms] = useState<Farm[]>([]);
  const [selectedFarm, setSelectedFarm] = useState<Farm | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshFarms = useCallback(async () => {
    try {
      const list = await apiClient.getFarms();
      setFarms(list);

      // Auto-select saved farm or first farm
      const savedId = await AsyncStorage.getItem('selected_farm_id');
      const match = list.find((f) => f._id === savedId);
      if (match) {
        setSelectedFarm(match);
      } else if (list.length > 0) {
        setSelectedFarm(list[0]);
        await AsyncStorage.setItem('selected_farm_id', list[0]._id);
      } else {
        setSelectedFarm(null);
      }
    } catch (e) {
      console.error('[FarmContext] Failed to load farms', e);
    } finally {
      setLoading(false);
    }
  }, []);

  // Only fetch farms when the user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      refreshFarms();
    } else {
      // Reset state when not authenticated (e.g. after logout)
      setFarms([]);
      setSelectedFarm(null);
      setLoading(false);
    }
  }, [isAuthenticated, refreshFarms]);

  const selectFarm = async (farm: Farm) => {
    setSelectedFarm(farm);
    await AsyncStorage.setItem('selected_farm_id', farm._id);
  };

  const createFarm = async (data: { name: string; location?: string; size?: number; description?: string }): Promise<Farm> => {
    const farm = await apiClient.createFarm(data);
    await refreshFarms();
    await selectFarm(farm);
    return farm;
  };

  const deleteFarm = async (id: string) => {
    await apiClient.deleteFarm(id);
    await refreshFarms();
  };

  return (
    <FarmContext.Provider value={{ farms, selectedFarm, loading, selectFarm, refreshFarms, createFarm, deleteFarm }}>
      {children}
    </FarmContext.Provider>
  );
};
