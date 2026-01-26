"use client";

import React from 'react';
import { 
  Droplets, 
  Download, 
  ExternalLink, 
  TrendingUp, 
  BarChart 
} from 'lucide-react';

export default function MilkProductionPage() {
  return (
    <div className="w-full">
      {/* HEADER */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Analyse de la Production Laitière</h2>
          <p className="text-gray-500 text-sm">Suivi centralisé des records de traite et performances par région.</p>
        </div>

        <div className="flex gap-3">
          <div className="bg-blue-600 text-white px-5 py-3 rounded-2xl shadow-lg shadow-blue-100 flex items-center gap-4">
            <div className="bg-white/20 p-2 rounded-xl">
              <Droplets className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-black opacity-80 leading-none mb-1">Total Récolté (24h)</p>
              <p className="text-xl font-black">42,500 <span className="text-sm font-medium">Litres</span></p>
            </div>
          </div>
        </div>
      </header>

      {/* ANALYTICS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Graphique des tendances */}
        <section className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-bold text-gray-800 flex items-center gap-2">
              <BarChart className="w-5 h-5 text-blue-500" />
              Tendances Mensuelles
            </h3>
            <div className="flex bg-gray-50 p-1 rounded-xl">
              <button className="px-4 py-1.5 text-xs font-bold bg-white text-blue-600 shadow-sm rounded-lg transition-all">
                Lait
              </button>
              <button className="px-4 py-1.5 text-xs font-bold text-gray-400 hover:text-gray-600 transition-all">
                Revenus
              </button>
            </div>
          </div>
          
          <div className="h-64 bg-linear-to-t from-blue-50/30 to-transparent rounded-2xl border-b-2 border-blue-100 flex items-end justify-around px-6 pb-4">
            {/* Barres simulées */}
            {[40, 55, 45, 75, 65, 90, 85].map((height, i) => (
              <div 
                key={i} 
                className="w-10 bg-blue-500 rounded-t-lg transition-all hover:bg-blue-600 cursor-pointer relative group" 
                style={{ height: `${height}%` }}
              >
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {height * 100} L
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-between mt-6 px-4 text-[10px] text-gray-400 font-black uppercase tracking-widest">
            <span>Semaine 1</span><span>Semaine 2</span><span>Semaine 3</span><span>Semaine 4</span>
          </div>
        </section>

        {/* Top Régions */}
        <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-8 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-500" />
            Top Régions
          </h3>
          <div className="space-y-8">
            {[
              { name: "Safi", volume: "12,400", percent: "85", color: "bg-blue-600" },
              { name: "Marrakech", volume: "9,800", percent: "65", color: "bg-blue-400" },
              { name: "El Jadida", volume: "7,200", percent: "45", color: "bg-blue-300" }
            ].map((region, i) => (
              <div key={i}>
                <div className="flex justify-between items-end text-sm mb-3">
                  <span className="font-bold text-gray-700">{region.name}</span>
                  <span className="font-black text-blue-600">{region.volume} L</span>
                </div>
                <div className="w-full bg-gray-50 h-3 rounded-full overflow-hidden border border-gray-100">
                  <div 
                    className={`${region.color} h-full rounded-full transition-all duration-1000`} 
                    style={{ width: `${region.percent}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* TABLE RECORDS */}
      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h3 className="font-bold text-gray-800 tracking-tight">Derniers Records de Traite</h3>
          <div className="flex items-center gap-3">
            <input 
              type="date" 
              className="text-xs font-bold text-gray-600 border border-gray-200 bg-gray-50 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
            <button className="p-2.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all border border-gray-100 shadow-sm">
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-widest">Date / Heure</th>
                <th className="px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-widest">Ferme / Éleveur</th>
                <th className="px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-widest">Quantité</th>
                <th className="px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-widest">Opérateur</th>
                <th className="px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {[
                { date: "16 Jan 2026", time: "06:30", type: "Traite Matin", farm: "Ferme Al-Massira", owner: "Omar Bourra", qty: "145", op: "Ahmed Hassan", init: "AH" },
                { date: "16 Jan 2026", time: "07:15", type: "Traite Matin", farm: "Ferme Atlas", owner: "Yassine Mansouri", qty: "88", op: "Karim Louani", init: "KL" }
              ].map((row, i) => (
                <tr key={i} className="hover:bg-blue-50/20 transition-colors group">
                  <td className="px-6 py-4">
                    <p className="text-sm font-black text-gray-800">{row.date}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase">{row.time} ({row.type})</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-gray-700">{row.farm}</p>
                    <p className="text-xs text-gray-400 font-medium">{row.owner}</p>
                  </td>
                  <td className="px-6 py-4 font-black text-blue-600">{row.qty} <span className="text-[10px] font-bold text-blue-400 uppercase">Litres</span></td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-[10px] font-black border border-blue-200">
                        {row.init}
                      </span>
                      <span className="text-sm font-semibold text-gray-600">{row.op}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-gray-300 hover:text-blue-600 hover:bg-white rounded-lg transition-all shadow-none hover:shadow-sm">
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}