"use client";

import React from 'react';
import {
  Search,
  Filter,
  Eye,
  Slash,
  Trash2,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import Link from 'next/link';

// Simulation de données (à remplacer par ton API plus tard)
const farmers = [
  {
    id: 1,
    name: "Omar Bourra",
    email: "omar@example.com",
    initials: "OB",
    city: "Safi",
    cin: "HH123456",
    livestockCount: 24,
    status: "Actif",
    color: "bg-green-100 text-green-700"
  },
  {
    id: 2,
    name: "Yassine Mansouri",
    email: "yassine@example.com",
    initials: "YM",
    city: "Marrakech",
    cin: "AA987654",
    livestockCount: 0,
    status: "En attente",
    color: "bg-yellow-100 text-yellow-700"
  }
];

export default function FarmersPage() {
  return (
    <div className="w-full">
      {/* HEADER */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Gestion des Éleveurs</h2>
          <p className="text-gray-500 text-sm">
            Consultez, validez ou suspendez les comptes utilisateurs de FarmOps.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:flex-none">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un éleveur..."
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 w-full md:w-64 bg-white"
            />
          </div>
          <button className="bg-white border border-gray-200 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-gray-50 transition-colors">
            <Filter className="w-4 h-4 text-gray-400" />
            Filtres
          </button>
        </div>
      </header>

      {/* TABLE SECTION */}
      <section className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Éleveur</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Ville / CIN</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Bétail</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Statut</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {farmers.map((farmer) => (
                <tr key={farmer.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs ${farmer.color}`}>
                        {farmer.initials}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">{farmer.name}</p>
                        <p className="text-xs text-gray-400">{farmer.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-700 font-medium">{farmer.city}</p>
                    <p className="text-[10px] text-gray-400 font-mono tracking-tighter">{farmer.cin}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-semibold text-gray-600">
                      {farmer.livestockCount} <span className="font-normal text-gray-400 text-xs">Têtes</span>
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${farmer.status === 'Actif'
                        ? 'bg-green-50 text-green-600 border-green-100'
                        : 'bg-yellow-50 text-yellow-600 border-yellow-100'
                      }`}>
                      {farmer.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-1">
                      {farmer.status === 'En attente' ? (
                        <>
                          <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Valider">
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors" title="Rejeter">
                            <XCircle className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <>
                          <Link
                            href={`/farmers/${farmer.id}`}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <button className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors" title="Suspendre">
                            <Slash className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Supprimer">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-400 font-medium">
            Affichage de <span className="text-gray-700">1</span> à <span className="text-gray-700">2</span> sur <span className="text-gray-700">128</span> éleveurs
          </p>
          <div className="flex gap-2">
            <button className="px-4 py-1.5 border border-gray-200 bg-white rounded-lg text-xs font-bold text-gray-500 hover:bg-gray-50 disabled:opacity-50 transition-all">
              Précédent
            </button>
            <button className="px-4 py-1.5 bg-green-600 text-white rounded-lg text-xs font-bold hover:bg-green-700 shadow-sm shadow-green-100 transition-all">
              Suivant
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}