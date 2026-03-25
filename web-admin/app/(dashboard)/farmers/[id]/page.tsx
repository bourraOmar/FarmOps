"use client";

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  User,
  Briefcase,
  Beef,
  Droplets,
  MapPin,
  Phone,
  Mail,
  Fingerprint,
  Loader2,
  Warehouse,
  CheckCircle2,
  Ban,
  Clock
} from 'lucide-react';
import { apiClient } from '@/lib/api';
import { FarmerProfile } from '@/lib/types';

export default function FarmerProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [profile, setProfile] = useState<FarmerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    try {
      const data = await apiClient.getFarmerProfile(resolvedParams.id);
      setProfile(data);
    } catch (err) {
      console.error('Failed to fetch farmer profile:', err);
      setError('Impossible de charger le profil');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [resolvedParams.id]);

  const handleStatusUpdate = async (status: 'approved' | 'banned' | 'pending') => {
    if (!profile) return;
    setUpdating(true);
    try {
      await apiClient.updateFarmerStatus(resolvedParams.id, status);
      setProfile((prev) =>
        prev ? { ...prev, farmer: { ...prev.farmer, status } } : null
      );
    } catch (error) {
      console.error('Failed to update farmer status:', error);
    } finally {
      setUpdating(false);
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
      month: 'long',
      year: 'numeric',
    });
  };

  const formatMilkDate = (dateStr: string) => {
    const [mm, dd, yyyy] = dateStr.split('/');
    const date = new Date(parseInt(yyyy), parseInt(mm) - 1, parseInt(dd));
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <span className="text-green-600 dark:text-green-400 font-semibold bg-green-50 dark:bg-green-900/30 px-3 py-1 rounded-lg text-sm flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4" />
            Compte Approuve
          </span>
        );
      case 'banned':
        return (
          <span className="text-red-600 dark:text-red-400 font-semibold bg-red-50 dark:bg-red-900/30 px-3 py-1 rounded-lg text-sm flex items-center gap-1">
            <Ban className="w-4 h-4" />
            Compte Suspendu
          </span>
        );
      case 'pending':
      default:
        return (
          <span className="text-yellow-600 dark:text-yellow-400 font-semibold bg-yellow-50 dark:bg-yellow-900/30 px-3 py-1 rounded-lg text-sm flex items-center gap-1">
            <Clock className="w-4 h-4" />
            En Attente
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="w-full h-96 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="w-full">
        <Link
          href="/farmers"
          className="text-sm text-green-600 font-medium flex items-center gap-1 mb-6 hover:underline group w-fit"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Retour a la liste
        </Link>
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-6 rounded-xl text-center">
          {error || 'Eleveur non trouve'}
        </div>
      </div>
    );
  }

  const { farmer, farms, animals, workers, recentMilkRecords, stats } = profile;

  return (
    <div className="w-full">
      {/* HEADER NAVIGATION */}
      <header className="mb-8">
        <Link
          href="/farmers"
          className="text-sm text-green-600 font-medium flex items-center gap-1 mb-6 hover:underline group w-fit"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Retour a la liste
        </Link>

        <div className="flex flex-col md:flex-row justify-between items-start gap-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-green-600 text-white flex items-center justify-center text-3xl font-bold shadow-lg shadow-green-100 dark:shadow-none">
              {getInitials(farmer.fullName)}
            </div>
            <div>
              <h2 className="text-3xl font-extrabold text-gray-800 dark:text-gray-100">{farmer.fullName}</h2>
              <p className="text-gray-500 dark:text-gray-400 flex items-center gap-2 mt-1 flex-wrap">
                Membre depuis le {formatDate(farmer.createdAt)}
              </p>
              <div className="mt-2">
                {getStatusBadge(farmer.status)}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 flex-wrap">
            {farmer.status === 'pending' && (
              <>
                <button
                  onClick={() => handleStatusUpdate('approved')}
                  disabled={updating}
                  className="bg-green-600 text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-green-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  {updating ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                  Approuver
                </button>
                <button
                  onClick={() => handleStatusUpdate('banned')}
                  disabled={updating}
                  className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  <Ban className="w-4 h-4" />
                  Rejeter
                </button>
              </>
            )}
            {farmer.status === 'approved' && (
              <button
                onClick={() => handleStatusUpdate('banned')}
                disabled={updating}
                className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-orange-600 dark:text-orange-400 px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors flex items-center gap-2 shadow-sm disabled:opacity-50"
              >
                {updating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Ban className="w-4 h-4" />}
                Suspendre
              </button>
            )}
            {farmer.status === 'banned' && (
              <button
                onClick={() => handleStatusUpdate('approved')}
                disabled={updating}
                className="bg-green-600 text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-green-700 transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {updating ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                Reactiver le compte
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* COLONNE GAUCHE : INFOS & STAFF */}
        <div className="space-y-6">
          {/* Section: Infos Personnelles */}
          <section className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
            <h3 className="font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
              <User className="w-5 h-5 text-green-600" />
              Informations Personnelles
            </h3>
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <Mail className="w-4 h-4 text-gray-400" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Email</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">{farmer.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <Phone className="w-4 h-4 text-gray-400" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Telephone</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">{farmer.phone || '-'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <Fingerprint className="w-4 h-4 text-gray-400" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">CIN</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300 font-mono font-bold">{farmer.cin || '-'}</p>
                </div>
              </div>
            </div>
          </section>

          {/* Section: Fermes */}
          <section className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
            <h3 className="font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
              <Warehouse className="w-5 h-5 text-green-600" />
              Fermes ({stats.totalFarms})
            </h3>
            {farms.length > 0 ? (
              <div className="space-y-3">
                {farms.map((farm) => (
                  <div
                    key={farm._id}
                    className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-colors border border-transparent hover:border-gray-100 dark:hover:border-gray-700"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 flex items-center justify-center text-xs font-bold">
                        <Warehouse className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">{farm.name}</p>
                        {farm.location && (
                          <p className="text-xs text-gray-400 flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> {farm.location}
                          </p>
                        )}
                      </div>
                    </div>
                    {farm.size > 0 && (
                      <span className="text-[10px] font-bold bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2 py-1 rounded-md">
                        {farm.size} ha
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400 text-center py-4">Aucune ferme enregistree</p>
            )}
          </section>

          {/* Section: Personnel (Workers) */}
          <section className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
            <h3 className="font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-green-600" />
              Personnel ({stats.totalWorkers})
            </h3>
            {workers.length > 0 ? (
              <div className="space-y-3">
                {workers.map((worker) => (
                  <div
                    key={worker._id}
                    className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-colors border border-transparent hover:border-gray-100 dark:hover:border-gray-700"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 flex items-center justify-center text-xs font-bold">
                        {getInitials(worker.name)}
                      </div>
                      <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">{worker.name}</p>
                    </div>
                    <span className="text-[10px] font-bold bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-2 py-1 rounded-md uppercase">
                      {worker.role}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400 text-center py-4">Aucun personnel enregistre</p>
            )}
          </section>
        </div>

        {/* COLONNE DROITE : INVENTAIRE & PRODUCTION */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
              <p className="text-xs text-gray-400 font-medium">Fermes</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">{stats.totalFarms}</p>
            </div>
            <div className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
              <p className="text-xs text-gray-400 font-medium">Betail</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">{stats.totalAnimals}</p>
            </div>
            <div className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
              <p className="text-xs text-gray-400 font-medium">Personnel</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">{stats.totalWorkers}</p>
            </div>
            <div className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
              <p className="text-xs text-gray-400 font-medium">Lait ce mois</p>
              <p className="text-2xl font-bold text-green-600">{stats.totalMilkThisMonth} L</p>
            </div>
          </div>

          {/* Inventaire Betail */}
          <section className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-gray-800 dark:text-white flex items-center gap-2">
                <Beef className="w-5 h-5 text-orange-500" />
                Inventaire du Betail ({stats.totalAnimals})
              </h3>
            </div>
            {animals.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {animals.map((animal) => (
                  <div
                    key={animal._id}
                    className="border border-gray-100 dark:border-gray-700 p-4 rounded-xl flex items-center gap-4 hover:border-orange-100 dark:hover:border-orange-900 hover:bg-orange-50/30 dark:hover:bg-orange-900/10 transition-all cursor-pointer group"
                  >
                    <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-xl text-orange-600 dark:text-orange-400 group-hover:bg-orange-100 dark:group-hover:bg-orange-900/30 transition-colors">
                      <Beef className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-800 dark:text-white">{animal.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                        {animal.breed || 'Race inconnue'}
                        {animal.tagId && ` • ID: #${animal.tagId}`}
                      </p>
                      <p className="text-xs text-gray-400">{animal.farmName}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Beef className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                <p className="text-sm text-gray-400">Aucun animal enregistre</p>
              </div>
            )}
          </section>

          {/* Production Laitiere */}
          <section className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
            <h3 className="font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
              <Droplets className="w-5 h-5 text-blue-500" />
              Production Laitiere Recente
            </h3>
            {recentMilkRecords.length > 0 ? (
              <div className="bg-gray-50/50 dark:bg-gray-800/50 rounded-xl p-2">
                {recentMilkRecords.map((record, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between p-4 ${
                      index !== recentMilkRecords.length - 1 ? 'border-b border-white dark:border-gray-700' : ''
                    }`}
                  >
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {formatMilkDate(record.date)}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-black text-gray-800 dark:text-white">{record.volume}</span>
                      <span className="text-xs font-bold text-gray-400">Litres</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Droplets className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                <p className="text-sm text-gray-400">Aucune production enregistree</p>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
