"use client";

import React, { useState, useEffect } from 'react';
import {
  Search,
  Eye,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Users,
  CheckCircle2,
  XCircle,
  Ban
} from 'lucide-react';
import Link from 'next/link';
import { apiClient } from '@/lib/api';
import { Farmer } from '@/lib/types';

export default function FarmersPage() {
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchFarmers = async () => {
    setLoading(true);
    try {
      const data = await apiClient.getAdminFarmers(page, 20);
      setFarmers(data.farmers);
      setTotalPages(data.totalPages);
      setTotal(data.total);
    } catch (error) {
      console.error('Failed to fetch farmers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFarmers();
  }, [page]);

  const handleStatusUpdate = async (farmerId: string, status: 'approved' | 'banned' | 'pending') => {
    setUpdating(farmerId);
    try {
      await apiClient.updateFarmerStatus(farmerId, status);
      // Update local state
      setFarmers((prev) =>
        prev.map((f) => (f._id === farmerId ? { ...f, status } : f))
      );
    } catch (error) {
      console.error('Failed to update farmer status:', error);
    } finally {
      setUpdating(null);
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

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border border-green-100 dark:border-green-900">
            Approuve
          </span>
        );
      case 'banned':
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900">
            Suspendu
          </span>
        );
      case 'pending':
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 border border-yellow-100 dark:border-yellow-900">
            En attente
          </span>
        );
    }
  };

  const filteredFarmers = farmers.filter((farmer) => {
    const matchesSearch =
      farmer.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      farmer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      farmer.cin?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || farmer.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const colors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-purple-500',
    'bg-orange-500',
    'bg-pink-500',
    'bg-indigo-500',
  ];

  const getColor = (index: number) => colors[index % colors.length];

  // Count by status
  const pendingCount = farmers.filter((f) => f.status === 'pending').length;
  const approvedCount = farmers.filter((f) => f.status === 'approved').length;
  const bannedCount = farmers.filter((f) => f.status === 'banned').length;

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
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Gestion des Eleveurs</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            {total} eleveurs enregistres dans le systeme.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:flex-none">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un eleveur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 w-full md:w-64 bg-white dark:bg-gray-900 dark:text-gray-200"
            />
          </div>
        </div>
      </header>

      {/* STATUS FILTERS */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setStatusFilter('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            statusFilter === 'all'
              ? 'bg-gray-800 dark:bg-white text-white dark:text-gray-900'
              : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
          }`}
        >
          Tous ({farmers.length})
        </button>
        <button
          onClick={() => setStatusFilter('pending')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            statusFilter === 'pending'
              ? 'bg-yellow-500 text-white'
              : 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-900 hover:bg-yellow-100 dark:hover:bg-yellow-900/40'
          }`}
        >
          En attente ({pendingCount})
        </button>
        <button
          onClick={() => setStatusFilter('approved')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            statusFilter === 'approved'
              ? 'bg-green-500 text-white'
              : 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-900 hover:bg-green-100 dark:hover:bg-green-900/40'
          }`}
        >
          Approuves ({approvedCount})
        </button>
        <button
          onClick={() => setStatusFilter('banned')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            statusFilter === 'banned'
              ? 'bg-red-500 text-white'
              : 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900 hover:bg-red-100 dark:hover:bg-red-900/40'
          }`}
        >
          Suspendus ({bannedCount})
        </button>
      </div>

      {/* TABLE SECTION */}
      <section className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          {filteredFarmers.length > 0 ? (
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-800">
                <tr>
                  <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Eleveur</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Fermes</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Statut</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Inscription</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {filteredFarmers.map((farmer, index) => (
                  <tr key={farmer._id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 ${getColor(index)} rounded-full flex items-center justify-center font-bold text-xs text-white`}>
                          {getInitials(farmer.fullName)}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{farmer.fullName}</p>
                          <p className="text-xs text-gray-400 font-mono">{farmer.cin || '-'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-700 dark:text-gray-300">{farmer.email}</p>
                      <p className="text-xs text-gray-400">{farmer.phone}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                        {farmer.farmCount} <span className="font-normal text-gray-400 dark:text-gray-500 text-xs">ferme(s)</span>
                      </span>
                      <p className="text-xs text-gray-400">{farmer.animalCount} animaux</p>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(farmer.status)}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {farmer.createdAt ? formatDate(farmer.createdAt) : '-'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1">
                        {/* View Profile */}
                        <Link
                          href={`/farmers/${farmer._id}`}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                          title="Voir profil"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>

                        {/* Approve Button - show for pending */}
                        {farmer.status === 'pending' && (
                          <button
                            onClick={() => handleStatusUpdate(farmer._id, 'approved')}
                            disabled={updating === farmer._id}
                            className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors disabled:opacity-50"
                            title="Approuver"
                          >
                            {updating === farmer._id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <CheckCircle2 className="w-4 h-4" />
                            )}
                          </button>
                        )}

                        {/* Reject Button - show for pending */}
                        {farmer.status === 'pending' && (
                          <button
                            onClick={() => handleStatusUpdate(farmer._id, 'banned')}
                            disabled={updating === farmer._id}
                            className="p-2 text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50"
                            title="Rejeter"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}

                        {/* Ban Button - show for approved */}
                        {farmer.status === 'approved' && (
                          <button
                            onClick={() => handleStatusUpdate(farmer._id, 'banned')}
                            disabled={updating === farmer._id}
                            className="p-2 text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg transition-colors disabled:opacity-50"
                            title="Suspendre"
                          >
                            {updating === farmer._id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Ban className="w-4 h-4" />
                            )}
                          </button>
                        )}

                        {/* Unban Button - show for banned */}
                        {farmer.status === 'banned' && (
                          <button
                            onClick={() => handleStatusUpdate(farmer._id, 'approved')}
                            disabled={updating === farmer._id}
                            className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors disabled:opacity-50"
                            title="Reactiver"
                          >
                            {updating === farmer._id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <CheckCircle2 className="w-4 h-4" />
                            )}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-12 text-center">
              <Users className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">Aucun eleveur trouve</p>
            </div>
          )}
        </div>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-800/30 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-400 font-medium">
              Page <span className="text-gray-700 dark:text-gray-300">{page}</span> sur <span className="text-gray-700 dark:text-gray-300">{totalPages}</span> ({total} eleveurs)
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-1.5 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg text-xs font-bold text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 transition-all flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                Precedent
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-1.5 bg-green-600 text-white rounded-lg text-xs font-bold hover:bg-green-700 shadow-sm shadow-green-100 dark:shadow-none disabled:opacity-50 transition-all flex items-center gap-1"
              >
                Suivant
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
