"use client";

import React from 'react';
import { 
  Users, 
  Beef, 
  Droplets, 
  TrendingUp, 
  Calendar, 
  Download, 
  BarChart3, 
  AlertCircle, 
  UserPlus, 
  Info 
} from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="w-full">
      {/* HEADER */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Tableau de Bord</h2>
          <p className="text-gray-500">
            Bienvenue sur l'administration de FarmOps.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white border border-gray-200 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-gray-50 transition-colors">
            <Calendar className="w-4 h-4 text-gray-400" />
            16 Janvier 2026
          </button>
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 flex items-center gap-2 transition-all shadow-sm">
            <Download className="w-4 h-4" />
            Exporter Rapport
          </button>
        </div>
      </header>

      {/* STATS CARDS (KPIs) */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Card: Éleveurs */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
              <Users className="w-6 h-6" />
            </div>
            <span className="text-green-500 text-xs font-bold">+12%</span>
          </div>
          <p className="text-sm text-gray-500 font-medium">Total Éleveurs</p>
          <h3 className="text-2xl font-bold text-gray-800">1,284</h3>
        </div>

        {/* Card: Bétail */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-orange-50 p-2 rounded-lg text-orange-600">
              <Beef className="w-6 h-6" />
            </div>
            <span className="text-green-500 text-xs font-bold">+5%</span>
          </div>
          <p className="text-sm text-gray-500 font-medium">Bétail Enregistré</p>
          <h3 className="text-2xl font-bold text-gray-800">8,420</h3>
        </div>

        {/* Card: Lait */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-green-50 p-2 rounded-lg text-green-600">
              <Droplets className="w-6 h-6" />
            </div>
            <span className="text-red-500 text-xs font-bold">-2%</span>
          </div>
          <p className="text-sm text-gray-500 font-medium">Production Lait (L)</p>
          <h3 className="text-2xl font-bold text-gray-800">42,500</h3>
        </div>

        {/* Card: Revenu */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-purple-50 p-2 rounded-lg text-purple-600">
              <TrendingUp className="w-6 h-6" />
            </div>
            <span className="text-green-500 text-xs font-bold">Stable</span>
          </div>
          <p className="text-sm text-gray-500 font-medium">Revenu Estimé</p>
          <h3 className="text-2xl font-bold text-gray-800">150k MAD</h3>
        </div>
      </section>

      {/* CHARTS & ALERTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart Section */}
        <section className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h4 className="font-bold text-gray-800">Analyse de la Production Laitière</h4>
            <select className="text-sm border border-gray-200 bg-gray-50 rounded-md p-1 outline-none focus:ring-1 focus:ring-green-500">
              <option>7 derniers jours</option>
              <option>30 derniers jours</option>
            </select>
          </div>
          <div className="h-64 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="w-10 h-10 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-400 text-sm">
                Le graphique s'affichera ici avec Chart.js
              </p>
            </div>
          </div>
        </section>

        {/* Notifications Section */}
        <section className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h4 className="font-bold text-gray-800 mb-6">Alertes Récentes</h4>
          <div className="space-y-4">
            {/* Alert 1 */}
            <div className="flex gap-4 p-3 hover:bg-red-50 rounded-lg transition-colors border-l-4 border-red-500 bg-red-50/30">
              <AlertCircle className="text-red-600 w-5 h-5 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-gray-800">Production en baisse</p>
                <p className="text-xs text-gray-500">Ferme "Al-Amal" : -20% ce matin.</p>
              </div>
            </div>

            {/* Alert 2 */}
            <div className="flex gap-4 p-3 hover:bg-orange-50 rounded-lg transition-colors border-l-4 border-orange-400">
              <UserPlus className="text-orange-600 w-5 h-5 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-gray-800">Nouvel Éleveur</p>
                <p className="text-xs text-gray-500">Demande d'inscription à Safi.</p>
              </div>
            </div>

            {/* Alert 3 */}
            <div className="flex gap-4 p-3 hover:bg-blue-50 rounded-lg transition-colors border-l-4 border-blue-400">
              <Info className="text-blue-600 w-5 h-5 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-gray-800">Mise à jour système</p>
                <p className="text-xs text-gray-500">Prévue pour demain à 02h00.</p>
              </div>
            </div>
          </div>
          <button className="w-full mt-6 py-2 text-sm font-medium text-gray-500 hover:text-green-600 transition-colors border border-transparent hover:border-green-100 rounded-lg">
            Voir toutes les notifications
          </button>
        </section>
      </div>
    </div>
  );
}