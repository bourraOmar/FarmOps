"use client";

import React from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Slash, 
  Trash2, 
  User, 
  Briefcase, 
  Beef, 
  Droplets,
  MapPin,
  Phone,
  Mail,
  Fingerprint
} from 'lucide-react';

export default function FarmerProfilePage({ params }: { params: { id: string } }) {
  // Dans un vrai projet, tu utiliserais params.id pour fetcher les données de l'éleveur via ton API NestJS
  
  return (
    <div className="w-full">
      {/* HEADER NAVIGATION */}
      <header className="mb-8">
        <Link
          href="/farmers"
          className="text-sm text-green-600 font-medium flex items-center gap-1 mb-6 hover:underline group w-fit"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Retour à la liste
        </Link>
        
        <div className="flex flex-col md:flex-row justify-between items-start gap-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-green-600 text-white flex items-center justify-center text-3xl font-bold shadow-lg shadow-green-100">
              OB
            </div>
            <div>
              <h2 className="text-3xl font-extrabold text-gray-800">Omar Bourra</h2>
              <p className="text-gray-500 flex items-center gap-2 mt-1">
                Membre depuis le 12 Décembre 2025 •
                <span className="text-green-600 font-semibold bg-green-50 px-2 py-0.5 rounded-md text-xs">Compte Actif</span>
              </p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button className="bg-white border border-gray-200 text-orange-600 px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-orange-50 transition-colors flex items-center gap-2 shadow-sm">
              <Slash className="w-4 h-4" />
              Suspendre
            </button>
            <button className="bg-red-50 text-red-600 px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-red-100 transition-colors flex items-center gap-2">
              <Trash2 className="w-4 h-4" />
              Supprimer
            </button>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* COLONNE GAUCHE : INFOS & STAFF */}
        <div className="space-y-6">
          {/* Section: Infos Personnelles */}
          <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
              <User className="w-5 h-5 text-green-600" />
              Informations Personnelles
            </h3>
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-50 rounded-lg"><Mail className="w-4 h-4 text-gray-400"/></div>
                <div>
                  <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Email</p>
                  <p className="text-sm text-gray-700 font-medium">omar.bourra@myfarmops.app</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-50 rounded-lg"><Phone className="w-4 h-4 text-gray-400"/></div>
                <div>
                  <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Téléphone</p>
                  <p className="text-sm text-gray-700 font-medium">+212 600 000 000</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-50 rounded-lg"><Fingerprint className="w-4 h-4 text-gray-400"/></div>
                <div>
                  <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">CIN</p>
                  <p className="text-sm text-gray-700 font-mono font-bold">HH123456</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-50 rounded-lg"><MapPin className="w-4 h-4 text-gray-400"/></div>
                <div>
                  <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Localisation</p>
                  <p className="text-sm text-gray-700 font-medium">Safi, Maroc</p>
                </div>
              </div>
            </div>
          </section>

          {/* Section: Personnel (Workers) */}
          <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-green-600" />
              Personnel (Workers)
            </h3>
            <div className="space-y-3">
              {[
                { name: "Ahmed Hassan", role: "Soigneur", init: "AH" },
                { name: "Karim Louani", role: "Traiteur", init: "KL" }
              ].map((worker, index) => (
                <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors border border-transparent hover:border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">
                      {worker.init}
                    </div>
                    <p className="text-sm font-semibold text-gray-700">{worker.name}</p>
                  </div>
                  <span className="text-[10px] font-bold bg-blue-50 text-blue-600 px-2 py-1 rounded-md uppercase">
                    {worker.role}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* COLONNE DROITE : INVENTAIRE & PRODUCTION */}
        <div className="lg:col-span-2 space-y-6">
          {/* Inventaire Bétail */}
          <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-gray-800 flex items-center gap-2">
                <Beef className="w-5 h-5 text-orange-500" />
                Inventaire du Bétail (24)
              </h3>
              <button className="text-green-600 text-sm font-bold hover:underline">Voir tout l'inventaire</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { name: "Marguerite", breed: "Holstein", id: "4402" },
                { name: "Bella", breed: "Montbéliarde", id: "4408" }
              ].map((cow, index) => (
                <div key={index} className="border border-gray-100 p-4 rounded-xl flex items-center gap-4 hover:border-orange-100 hover:bg-orange-50/30 transition-all cursor-pointer group">
                  <div className="bg-orange-50 p-3 rounded-xl text-orange-600 group-hover:bg-orange-100 transition-colors">
                    <Beef className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-800">{cow.name}</p>
                    <p className="text-xs text-gray-500 font-medium">{cow.breed} • ID: #{cow.id}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Production Laitière */}
          <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Droplets className="w-5 h-5 text-blue-500" />
              Production Laitière Récente
            </h3>
            <div className="bg-gray-50/50 rounded-xl p-2">
              {[
                { date: "15 Janvier 2026", volume: "145" },
                { date: "14 Janvier 2026", volume: "138" },
                { date: "13 Janvier 2026", volume: "142" }
              ].map((record, index) => (
                <div key={index} className={`flex items-center justify-between p-4 ${index !== 2 ? 'border-b border-white' : ''}`}>
                  <span className="text-sm font-medium text-gray-500">{record.date}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-black text-gray-800">{record.volume}</span>
                    <span className="text-xs font-bold text-gray-400">Litres</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}