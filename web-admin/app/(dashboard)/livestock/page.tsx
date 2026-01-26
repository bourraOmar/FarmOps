"use client";

import React from 'react';
import { 
  Search, 
  Plus, 
  MapPin, 
  Beef, 
  FileText, 
  HeartPulse, 
  History, 
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export default function LivestockPage() {
  return (
    <div className="w-full">
      {/* HEADER */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Inventaire Global du Bétail</h2>
          <p className="text-gray-500 text-sm">Suivi et traçabilité nationale des bovins enregistrés.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white border border-gray-200 rounded-lg px-4 py-2 shadow-sm">
            <p className="text-[10px] uppercase font-black text-gray-400 leading-none mb-1">Total Têtes</p>
            <p className="text-xl font-bold text-green-600">14,250</p>
          </div>
          <button className="bg-green-600 text-white p-2.5 rounded-lg hover:bg-green-700 shadow-md transition-all active:scale-95">
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* FILTERS SECTION */}
      <section className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm mb-6 flex flex-wrap gap-4 items-center">
        <div className="relative flex-1 min-w-75">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher par ID (#MA-...), nom ou éleveur..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500/20 focus:border-green-500 focus:bg-white outline-none transition-all"
          />
        </div>

        <select className="bg-gray-50 border border-gray-200 text-gray-600 text-sm rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all cursor-pointer">
          <option>Toutes les Races</option>
          <option>Holstein</option>
          <option>Montbéliarde</option>
          <option>Jersey</option>
          <option>Limousine</option>
        </select>

        <select className="bg-gray-50 border border-gray-200 text-gray-600 text-sm rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all cursor-pointer">
          <option>Tous les États</option>
          <option>En Ferme</option>
          <option>Vendu</option>
          <option>En Transit</option>
          <option>Soin Médical</option>
        </select>

        <button className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-gray-700 px-2 transition-colors">
          <SlidersHorizontal className="w-4 h-4" />
          Plus de filtres
        </button>
      </section>

      {/* TABLE SECTION */}
      <section className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Identifiant (ID)</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Animal / Race</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Propriétaire actuel</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Localisation</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Statut</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {/* Row 1 */}
              <tr className="hover:bg-green-50/30 transition-colors group">
                <td className="px-6 py-4 font-mono text-sm font-bold text-green-700">#MA-9920-A</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600">
                      <Beef className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-800">Marguerite</p>
                      <p className="text-[10px] text-gray-400 font-black uppercase">Holstein • Femelle</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm font-semibold text-gray-700">Omar Bourra</p>
                  <p className="text-[10px] text-gray-400 font-medium italic">Ferme Al-Massira</p>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5 text-gray-500 text-sm font-medium">
                    <MapPin className="w-3.5 h-3.5 text-gray-300" />
                    Safi
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2.5 py-1 bg-green-50 text-green-700 text-[10px] font-black rounded-md border border-green-100 uppercase tracking-wider">
                    En Ferme
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Fiche complète">
                      <FileText className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Historique de santé">
                      <HeartPulse className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>

              {/* Row 2 */}
              <tr className="hover:bg-gray-50/50 transition-colors group">
                <td className="px-6 py-4 font-mono text-sm font-bold text-green-700">#MA-4408-B</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 group-hover:bg-orange-50 group-hover:text-orange-500 transition-colors">
                      <Beef className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-800">Bella</p>
                      <p className="text-[10px] text-gray-400 font-black uppercase">Montbéliarde • Femelle</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 italic text-gray-400 text-sm font-medium">En transit</td>
                <td className="px-6 py-4 italic text-gray-400 text-sm font-medium">Marché Hebdomadaire</td>
                <td className="px-6 py-4">
                  <span className="px-2.5 py-1 bg-orange-50 text-orange-700 text-[10px] font-black rounded-md border border-orange-100 uppercase tracking-wider">
                    Vendu
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                      <FileText className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <History className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 flex items-center justify-between">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
            Page <span className="text-gray-900">1</span> sur 1,425
          </span>
          <div className="flex gap-1.5">
            <button className="p-2 border border-gray-200 bg-white rounded-lg hover:bg-gray-50 disabled:opacity-30 transition-all shadow-sm">
              <ChevronLeft className="w-4 h-4 text-gray-600" />
            </button>
            <button className="px-3.5 py-1.5 border border-green-600 bg-green-600 text-white rounded-lg text-xs font-black shadow-sm shadow-green-100">
              1
            </button>
            <button className="px-3.5 py-1.5 border border-gray-200 bg-white text-gray-600 rounded-lg text-xs font-black hover:bg-gray-50 transition-all">
              2
            </button>
            <button className="p-2 border border-gray-200 bg-white rounded-lg hover:bg-gray-50 transition-all shadow-sm">
              <ChevronRight className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}