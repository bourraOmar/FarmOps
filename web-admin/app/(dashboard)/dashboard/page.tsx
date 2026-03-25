"use client";

import React, { useState, useEffect } from 'react';
import {
  Users,
  Beef,
  Droplets,
  TrendingUp,
  Calendar,
  Download,
  Loader2
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { apiClient } from '@/lib/api';
import { AdminStats, MilkTrend } from '@/lib/types';

export default function DashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [trends, setTrends] = useState<MilkTrend[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<7 | 30>(7);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, trendsData] = await Promise.all([
          apiClient.getAdminStats(),
          apiClient.getAdminMilkTrends(period),
        ]);
        setStats(statsData);
        setTrends(trendsData);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    setLoading(true);
    fetchData();
  }, [period]);

  const formatNumber = (num: number) => {
    return num.toLocaleString('fr-FR');
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
  };

  const today = new Date().toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

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
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Tableau de Bord</h2>
          <p className="text-gray-500 dark:text-gray-400">
            Bienvenue sur l'administration de FarmOps.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-800 dark:text-gray-200 transition-colors">
            <Calendar className="w-4 h-4 text-gray-400" />
            {today}
          </button>
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 flex items-center gap-2 transition-all shadow-sm">
            <Download className="w-4 h-4" />
            Exporter Rapport
          </button>
        </div>
      </header>

      {/* STATS CARDS (KPIs) */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Card: Eleveurs */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded-lg text-blue-600 dark:text-blue-400">
              <Users className="w-6 h-6" />
            </div>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Total Eleveurs</p>
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
            {formatNumber(stats?.totalFarmers || 0)}
          </h3>
        </div>

        {/* Card: Betail */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-orange-50 dark:bg-orange-900/20 p-2 rounded-lg text-orange-600 dark:text-orange-400">
              <Beef className="w-6 h-6" />
            </div>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Betail Enregistre</p>
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
            {formatNumber(stats?.totalAnimals || 0)}
          </h3>
        </div>

        {/* Card: Lait Aujourd'hui */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded-lg text-green-600 dark:text-green-400">
              <Droplets className="w-6 h-6" />
            </div>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Production Lait (Aujourd'hui)</p>
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
            {formatNumber(stats?.totalMilkToday || 0)} L
          </h3>
        </div>

        {/* Card: Lait ce mois */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-purple-50 dark:bg-purple-900/20 p-2 rounded-lg text-purple-600 dark:text-purple-400">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Production ce Mois</p>
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
            {formatNumber(stats?.totalMilkThisMonth || 0)} L
          </h3>
        </div>
      </section>

      {/* CHARTS & ALERTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart Section */}
        <section className="lg:col-span-2 bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h4 className="font-bold text-gray-800 dark:text-white">Analyse de la Production Laitiere</h4>
            <select
              className="text-sm border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-md p-1 outline-none focus:ring-1 focus:ring-green-500 dark:text-gray-200"
              value={period}
              onChange={(e) => setPeriod(Number(e.target.value) as 7 | 30)}
            >
              <option value={7}>7 derniers jours</option>
              <option value={30}>30 derniers jours</option>
            </select>
          </div>
          <div className="h-64">
            {trends.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={formatDate}
                    tick={{ fontSize: 12 }}
                    stroke="#9CA3AF"
                  />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    stroke="#9CA3AF"
                    tickFormatter={(value) => `${value}L`}
                  />
                  <Tooltip
                    formatter={(value: number) => [`${formatNumber(value)} L`, 'Production']}
                    labelFormatter={(label) => formatDate(label)}
                  />
                  <Bar
                    dataKey="totalLiters"
                    fill="#22C55E"
                    radius={[4, 4, 0, 0]}
                    name="Production"
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full bg-gray-50 dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-700 flex items-center justify-center">
                <p className="text-gray-400 dark:text-gray-500 text-sm">
                  Aucune donnee de production disponible
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Stats Section */}
        <section className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <h4 className="font-bold text-gray-800 dark:text-white mb-6">Statistiques Rapides</h4>
          <div className="space-y-4">
            {/* Stat 1 */}
            <div className="flex gap-4 p-3 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors border-l-4 border-blue-500 bg-blue-50/30 dark:bg-blue-900/10">
              <Users className="text-blue-600 dark:text-blue-400 w-5 h-5 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">Total Fermes</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{formatNumber(stats?.totalFarms || 0)} fermes enregistrees</p>
              </div>
            </div>

            {/* Stat 2 */}
            <div className="flex gap-4 p-3 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg transition-colors border-l-4 border-orange-400">
              <Beef className="text-orange-600 dark:text-orange-400 w-5 h-5 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">Betail Total</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{formatNumber(stats?.totalAnimals || 0)} animaux</p>
              </div>
            </div>

            {/* Stat 3 */}
            <div className="flex gap-4 p-3 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors border-l-4 border-green-400">
              <Droplets className="text-green-600 dark:text-green-400 w-5 h-5 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">Moyenne Journaliere</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {trends.length > 0
                    ? formatNumber(Math.round(trends.reduce((sum, t) => sum + t.totalLiters, 0) / trends.length))
                    : '0'
                  } L/jour
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
