"use client";

import React, { useState, useEffect } from 'react';
import {
  Warehouse,
  Map as MapIcon,
  Plus,
  Search,
  ExternalLink,
  MapPin,
  Loader2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { apiClient } from '@/lib/api';
import { Farm } from '@/lib/types';

export default function FarmsPage() {
  const [farms, setFarms] = useState<Farm[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchFarms = async () => {
      setLoading(true);
      try {
        const data = await apiClient.getAdminFarms(page, 10);
        setFarms(data.farms);
        setTotalPages(data.totalPages);
        setTotal(data.total);
      } catch (error) {
        console.error('Failed to fetch farms:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFarms();
  }, [page]);

  const filteredFarms = farms.filter(
    (farm) =>
      farm.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      farm.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      farm.owner?.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <div className="w-full h-96 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* HEADER */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Infrastructures & Exploitations</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            {total} fermes enregistrees dans le systeme.
          </p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button className="flex-1 md:flex-none bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-4 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-200">
            <MapIcon className="w-4 h-4 text-green-600 dark:text-green-500" />
            Vue Carte
          </button>
        </div>
      </header>

      {/* FILTERS SECTION */}
      <section className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm mb-8 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            placeholder="Rechercher une ferme, un lieu, un proprietaire..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 dark:focus:border-green-500 transition-all text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
          />
        </div>
      </section>

      {/* FARMS GRID */}
      {filteredFarms.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-12 text-center">
          <Warehouse className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">Aucune ferme trouvee</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredFarms.map((farm) => (
            <div
              key={farm._id}
              className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden group hover:border-green-300 dark:hover:border-green-500 transition-all duration-300"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-50 dark:bg-green-900/20 rounded-xl flex items-center justify-center text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform">
                      <Warehouse className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800 dark:text-white">{farm.name}</h3>
                      <p className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {farm.location || 'Emplacement non specifie'}
                      </p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-[10px] font-black rounded uppercase tracking-wider">
                    Active
                  </span>
                </div>

                {/* KPI Grid */}
                <div className="grid grid-cols-3 gap-4 py-4 border-y border-gray-50 dark:border-gray-700 my-4 text-center">
                  <div>
                    <p className="text-[10px] text-gray-400 dark:text-gray-500 font-black uppercase mb-1">Betail</p>
                    <p className="text-sm font-black text-gray-700 dark:text-gray-200">{farm.animalCount || 0}</p>
                  </div>
                  <div className="border-x border-gray-50 dark:border-gray-700">
                    <p className="text-[10px] text-gray-400 dark:text-gray-500 font-black uppercase mb-1">Surface</p>
                    <p className="text-sm font-black text-gray-700 dark:text-gray-200">{farm.size || 0} ha</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 dark:text-gray-500 font-black uppercase mb-1">Production/j</p>
                    <p className="text-sm font-black text-green-600 dark:text-green-500">{farm.milkProductionToday || 0}L</p>
                  </div>
                </div>

                {/* Description */}
                {farm.description && (
                  <div className="mb-4">
                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{farm.description}</p>
                  </div>
                )}
              </div>

              {/* Card Footer */}
              <div className="bg-gray-50/50 dark:bg-gray-900/50 px-6 py-4 flex justify-between items-center border-t border-gray-50 dark:border-gray-700">
                <p className="text-[11px] text-gray-400 dark:text-gray-500 font-medium flex items-center gap-2">
                  <span className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-[10px] text-white font-bold">
                    {getInitials(farm.owner?.fullName || 'NA')}
                  </span>
                  <span className="font-bold text-gray-700 dark:text-gray-200">{farm.owner?.fullName || 'Inconnu'}</span>
                </p>
                <button className="text-green-600 dark:text-green-500 text-xs font-bold hover:underline flex items-center gap-1">
                  Details <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center items-center gap-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Page {page} sur {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>
      )}
    </div>
  );
}
