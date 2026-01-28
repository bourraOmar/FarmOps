"use client";

import React from 'react';
import { 
  Warehouse, 
  Map as MapIcon, 
  Plus, 
  Search, 
  ExternalLink,
  MapPin
} from 'lucide-react';

export default function FarmsPage() {
  return (
    <div className="w-full">
      {/* HEADER */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Infrastructures & Exploitations</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Surveillance des fermes et gestion des effectifs (Workers).</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button className="flex-1 md:flex-none bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-4 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-200">
            <MapIcon className="w-4 h-4 text-green-600 dark:text-green-500" /> 
            Vue Carte
          </button>
          <button className="flex-1 md:flex-none bg-green-600 dark:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 dark:hover:bg-green-700 shadow-md transition-all active:scale-95">
            Ajouter une Ferme
          </button>
        </div>
      </header>

      {/* FILTERS SECTION */}
      <section className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm mb-8 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            placeholder="Rechercher une ferme, un lieu..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 dark:focus:border-green-500 transition-all text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
          />
        </div>
        <select className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 px-4 py-2 rounded-lg text-sm text-gray-600 dark:text-gray-300 outline-none focus:ring-2 focus:ring-green-500/20 transition-all cursor-pointer">
          <option>Toutes les régions</option>
          <option>Safi</option>
          <option>Marrakech</option>
        </select>
      </section>

      {/* FARMS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Farm Card 1 */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden group hover:border-green-300 dark:hover:border-green-500 transition-all duration-300">
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-50 dark:bg-green-900/20 rounded-xl flex items-center justify-center text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform">
                  <Warehouse className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 dark:text-white">Ferme Al-Massira</h3>
                  <p className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> Safi, Route de Sebt Gzoula
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
                <p className="text-[10px] text-gray-400 dark:text-gray-500 font-black uppercase mb-1">Bétail</p>
                <p className="text-sm font-black text-gray-700 dark:text-gray-200">24</p>
              </div>
              <div className="border-x border-gray-50 dark:border-gray-700">
                <p className="text-[10px] text-gray-400 dark:text-gray-500 font-black uppercase mb-1">Personnel</p>
                <p className="text-sm font-black text-gray-700 dark:text-gray-200">03 Workers</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-400 dark:text-gray-500 font-black uppercase mb-1">Production</p>
                <p className="text-sm font-black text-green-600 dark:text-green-500">145L/j</p>
              </div>
            </div>

            {/* Workers List */}
            <div className="space-y-3">
              <p className="text-[10px] font-black text-gray-300 dark:text-gray-600 uppercase tracking-widest">Équipe assignée</p>
              <div className="flex flex-wrap gap-2">
                <span className="flex items-center gap-2 bg-gray-50 dark:bg-gray-900 px-3 py-1.5 rounded-full border border-gray-100 dark:border-gray-700 text-[11px] font-bold text-gray-600 dark:text-gray-300">
                  <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-[8px] text-white">AH</div>
                  Ahmed Hassan
                </span>
                <span className="flex items-center gap-2 bg-gray-50 dark:bg-gray-900 px-3 py-1.5 rounded-full border border-gray-100 dark:border-gray-700 text-[11px] font-bold text-gray-600 dark:text-gray-300">
                  <div className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center text-[8px] text-white">KL</div>
                  Karim Louani
                </span>
              </div>
            </div>
          </div>

          {/* Card Footer */}
          <div className="bg-gray-50/50 dark:bg-gray-900/50 px-6 py-4 flex justify-between items-center border-t border-gray-50 dark:border-gray-700">
            <p className="text-[11px] text-gray-400 dark:text-gray-500 font-medium">
              Propriétaire : <span className="font-bold text-gray-700 dark:text-gray-200">Omar Bourra</span>
            </p>
            <button className="text-green-600 dark:text-green-500 text-xs font-bold hover:underline flex items-center gap-1">
              Détails <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>
        
        {/* Placeholder pour une 2ème ferme (Exemple) */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm border-dashed flex items-center justify-center p-12 opacity-50 hover:opacity-100 transition-opacity">
           <div className="text-center">
              <Plus className="w-8 h-8 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
              <p className="text-sm text-gray-400 dark:text-gray-500 font-medium">Emplacement pour nouvelle ferme</p>
           </div>
        </div>
      </div>
    </div>
  );
}