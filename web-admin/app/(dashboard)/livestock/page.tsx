"use client";

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  MapPin, 
  Beef, 
  ChevronLeft,
  ChevronRight,
  Loader2
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/lib/api';
import { AdminAnimal } from '@/lib/types';

export default function LivestockPage() {
  const { isAuthenticated } = useAuth();
  const [animals, setAnimals] = useState<AdminAnimal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  const [searchTerm, setSearchTerm] = useState('');
  const [breedFilter, setBreedFilter] = useState('Toutes les Races');

  const fetchLivestock = async (pageToFetch: number, search: string, breed: string) => {
    if (!isAuthenticated) return;
    try {
      setLoading(true);
      setError(null);
      const data = await apiClient.getAdminLivestock(pageToFetch, 20, search, breed);
      setAnimals(data.animals);
      setTotalPages(data.totalPages);
      setTotalRecords(data.total);
      setPage(data.page);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load livestock data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      fetchLivestock(page, searchTerm, breedFilter);
    }, 300); // 300ms debounce on search
    
    return () => clearTimeout(handler);
  }, [page, searchTerm, breedFilter, isAuthenticated]);

  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  return (
    <div className="w-full">
      {/* HEADER */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Inventaire Global du Bétail</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Suivi et traçabilité nationale des bovins enregistrés.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 shadow-sm">
            <p className="text-[10px] uppercase font-black text-gray-400 leading-none mb-1">Total Têtes</p>
            <p className="text-xl font-bold text-green-600 dark:text-green-500">
              {loading && animals.length === 0 ? "..." : totalRecords.toLocaleString()}
            </p>
          </div>
          <button className="bg-green-600 text-white p-2.5 rounded-lg hover:bg-green-700 shadow-md transition-all active:scale-95">
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* FILTERS SECTION */}
      <section className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm mb-6 flex flex-wrap gap-4 items-center">
        <div className="relative flex-1 min-w-[250px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1); // reset to page 1 on new search
            }}
            placeholder="Rechercher par ID ou nom d'animal..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-green-500/20 focus:border-green-500 focus:bg-white dark:focus:bg-black outline-none dark:text-gray-200 transition-all"
          />
        </div>

        <select 
          value={breedFilter}
          onChange={(e) => {
            setBreedFilter(e.target.value);
            setPage(1); // reset to page 1 on filter
          }}
          className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 text-sm rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all cursor-pointer"
        >
          <option value="Toutes les Races">Toutes les Races</option>
          <option value="Holstein">Holstein</option>
          <option value="Montbéliarde">Montbéliarde</option>
          <option value="Jersey">Jersey</option>
          <option value="Limousine">Limousine</option>
        </select>
      </section>

      {/* TABLE SECTION */}
      <section className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden min-h-[400px] flex flex-col">
        {loading ? (
          <div className="flex-1 flex flex-col justify-center items-center py-20">
            <Loader2 className="w-8 h-8 text-green-500 animate-spin mb-4" />
            <p className="text-gray-500 dark:text-gray-400">Chargement de l&apos;inventaire...</p>
          </div>
        ) : error ? (
          <div className="flex-1 flex flex-col justify-center items-center py-20">
            <p className="text-red-500 mb-4">{error}</p>
            <button 
              onClick={() => fetchLivestock(page, searchTerm, breedFilter)}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              Réessayer
            </button>
          </div>
        ) : animals.length === 0 ? (
          <div className="flex-1 flex flex-col justify-center items-center py-20">
            <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
              <Beef className="w-8 h-8 text-gray-400 dark:text-gray-500" />
            </div>
            <p className="text-gray-500 dark:text-gray-400 font-medium text-lg">Aucun animal trouvé</p>
            <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">L&apos;inventaire est actuellement vide.</p>
          </div>
        ) : (
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-800">
                <tr>
                  <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Identifiant (ID)</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Animal / Race</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Propriétaire actuel</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Localisation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {animals.map((animal) => (
                  <tr key={animal._id} className="hover:bg-green-50/30 dark:hover:bg-green-900/10 transition-colors group">
                    <td className="px-6 py-4 font-mono text-sm font-bold text-green-700 dark:text-green-500">
                      {animal.tagId ? `#${animal.tagId}` : 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center text-orange-600 dark:text-orange-400 flex-shrink-0">
                          <Beef className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-800 dark:text-gray-200">{animal.name}</p>
                          <p className="text-[10px] text-gray-400 font-black uppercase">
                            {animal.breed || 'Race Inconnue'} • {animal.gender === 'Female' ? 'Femelle' : 'Mâle'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">{animal.ownerName}</p>
                      <p className="text-[10px] text-gray-400 font-medium italic">{animal.farmName}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 text-sm font-medium">
                        <MapPin className="w-3.5 h-3.5 text-gray-300 dark:text-gray-600" />
                        {animal.farmLocation || 'Non spécifié'}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* PAGINATION */}
        <div className="bg-gray-50 dark:bg-gray-800 px-6 py-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between mt-auto">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
            Page <span className="text-gray-900 dark:text-gray-200">{page}</span> sur {totalPages}
          </span>
          <div className="flex gap-1.5">
            <button 
              onClick={handlePrevPage}
              disabled={page === 1 || loading}
              className="p-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-30 disabled:hover:bg-white dark:disabled:hover:bg-gray-900 transition-all shadow-sm"
            >
              <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>
            <div className="flex items-center px-3 font-semibold text-sm text-gray-700 dark:text-gray-300">
              {page}
            </div>
            <button 
              onClick={handleNextPage}
              disabled={page === totalPages || totalPages === 0 || loading}
              className="p-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-30 disabled:hover:bg-white dark:disabled:hover:bg-gray-900 transition-all shadow-sm"
            >
              <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}