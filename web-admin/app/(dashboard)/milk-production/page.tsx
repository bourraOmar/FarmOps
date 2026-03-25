"use client";

import React, { useState, useEffect } from 'react';
import {
  Droplets,
  Download,
  ExternalLink,
  TrendingUp,
  Loader2,
  ChevronLeft,
  ChevronRight
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
import { AdminStats, MilkRecord, MilkTrend } from '@/lib/types';

export default function MilkProductionPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [records, setRecords] = useState<MilkRecord[]>([]);
  const [trends, setTrends] = useState<MilkTrend[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [statsData, recordsData, trendsData] = await Promise.all([
          apiClient.getAdminStats(),
          apiClient.getAdminMilkRecords(page, 10),
          apiClient.getAdminMilkTrends(30),
        ]);
        setStats(statsData);
        setRecords(recordsData.records);
        setTotalPages(recordsData.totalPages);
        setTotal(recordsData.total);
        setTrends(trendsData);
      } catch (error) {
        console.error('Failed to fetch milk data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [page]);

  const formatNumber = (num: number) => {
    return num.toLocaleString('fr-FR');
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
  };

  const formatRecordDate = (dateStr: string) => {
    const [mm, dd, yyyy] = dateStr.split('/');
    const date = new Date(parseInt(yyyy), parseInt(mm) - 1, parseInt(dd));
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const getSessionLabel = (session: string) => {
    switch (session) {
      case 'Morning':
        return 'Traite Matin';
      case 'Evening':
        return 'Traite Soir';
      case 'Night':
        return 'Traite Nuit';
      default:
        return session;
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Calculate top farms from records
  const topFarms = records.reduce((acc, record) => {
    const farmName = record.farm?.name || 'Inconnu';
    acc[farmName] = (acc[farmName] || 0) + record.amountLiters;
    return acc;
  }, {} as Record<string, number>);

  const topFarmsList = Object.entries(topFarms)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([name, volume], index) => {
      const maxVolume = Object.values(topFarms).reduce((a, b) => Math.max(a, b), 1);
      const percent = Math.round((volume / maxVolume) * 100);
      const colors = ['bg-blue-600', 'bg-blue-400', 'bg-blue-300'];
      return { name, volume, percent, color: colors[index] || 'bg-blue-300' };
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
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Analyse de la Production Laitiere</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            {total} records de traite enregistres.
          </p>
        </div>

        <div className="flex gap-3">
          <div className="bg-blue-600 text-white px-5 py-3 rounded-2xl shadow-lg shadow-blue-100 dark:shadow-none flex items-center gap-4">
            <div className="bg-white/20 p-2 rounded-xl">
              <Droplets className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-black opacity-80 leading-none mb-1">Total Recolte (24h)</p>
              <p className="text-xl font-black">
                {formatNumber(stats?.totalMilkToday || 0)} <span className="text-sm font-medium">Litres</span>
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* ANALYTICS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Graphique des tendances */}
        <section className="lg:col-span-2 bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-500" />
              Tendances (30 derniers jours)
            </h3>
          </div>

          <div className="h-64">
            {trends.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={formatDate}
                    tick={{ fontSize: 10 }}
                    stroke="#9CA3AF"
                    interval={Math.ceil(trends.length / 7)}
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
                    fill="#3B82F6"
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

        {/* Top Fermes */}
        <section className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <h3 className="font-bold text-gray-800 dark:text-white mb-8 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-500" />
            Top Fermes
          </h3>
          <div className="space-y-8">
            {topFarmsList.length > 0 ? (
              topFarmsList.map((farm, i) => (
                <div key={i}>
                  <div className="flex justify-between items-end text-sm mb-3">
                    <span className="font-bold text-gray-700 dark:text-gray-300">{farm.name}</span>
                    <span className="font-black text-blue-600 dark:text-blue-400">{formatNumber(farm.volume)} L</span>
                  </div>
                  <div className="w-full bg-gray-50 dark:bg-gray-800 h-3 rounded-full overflow-hidden border border-gray-100 dark:border-gray-700">
                    <div
                      className={`${farm.color} h-full rounded-full transition-all duration-1000`}
                      style={{ width: `${farm.percent}%` }}
                    ></div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400 dark:text-gray-500 text-sm text-center">
                Aucune donnee disponible
              </p>
            )}
          </div>
        </section>
      </div>

      {/* TABLE RECORDS */}
      <section className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-50 dark:border-gray-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h3 className="font-bold text-gray-800 dark:text-white tracking-tight">Derniers Records de Traite</h3>
          <div className="flex items-center gap-3">
            <button className="p-2.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all border border-gray-100 dark:border-gray-700 shadow-sm">
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          {records.length > 0 ? (
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50/50 dark:bg-gray-800/50">
                <tr>
                  <th className="px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-widest">Date / Session</th>
                  <th className="px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-widest">Ferme / Eleveur</th>
                  <th className="px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-widest">Animal</th>
                  <th className="px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-widest">Quantite</th>
                  <th className="px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                {records.map((record) => (
                  <tr key={record._id} className="hover:bg-blue-50/20 dark:hover:bg-blue-900/10 transition-colors group">
                    <td className="px-6 py-4">
                      <p className="text-sm font-black text-gray-800 dark:text-white">{formatRecordDate(record.date)}</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase">{getSessionLabel(record.session)}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-gray-700 dark:text-gray-200">{record.farm?.name || 'Inconnu'}</p>
                      <p className="text-xs text-gray-400 font-medium">{record.owner?.fullName || 'Inconnu'}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-gray-700 dark:text-gray-200">{record.animal?.name || 'Inconnu'}</p>
                      <p className="text-xs text-gray-400 font-medium">
                        {record.animal?.tagId ? `#${record.animal.tagId}` : ''}
                      </p>
                    </td>
                    <td className="px-6 py-4 font-black text-blue-600 dark:text-blue-400">
                      {record.amountLiters} <span className="text-[10px] font-bold text-blue-400 dark:text-blue-300 uppercase">Litres</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 text-gray-300 dark:text-gray-600 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-gray-800 rounded-lg transition-all shadow-none hover:shadow-sm">
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-12 text-center">
              <Droplets className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">Aucun record de traite trouve</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-gray-50 dark:border-gray-800 flex justify-center items-center gap-4">
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
      </section>
    </div>
  );
}
