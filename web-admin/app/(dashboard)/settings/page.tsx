"use client";

import React from 'react';
import { 
  BellRing, 
  Mail, 
  Save, 
  Database, 
  ShieldCheck,
  Monitor
} from 'lucide-react';
import { ModeToggle } from '@/components/mode-toggle';

export default function SettingsPage() {
  const handleSave = () => {
    // Cette fonction sera liée à ton service NestJS pour sauvegarder les configurations
    console.log("Sauvegarde des paramètres système...");
  };

  return (
    <div className="w-full animate-in fade-in duration-500">
      {/* HEADER */}
      <header className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 tracking-tight">Paramètres du Système</h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Configurez les seuils d'alertes et les préférences de notification globales pour FarmOps.
        </p>
      </header>

      <div className="max-w-4xl space-y-6">
        
        {/* SECTION: SEUILS D'ALERTES */}
        <section className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden transition-all hover:shadow-md">
          <div className="p-6 border-b border-gray-50 dark:border-gray-800 flex items-center gap-4 bg-gray-50/30 dark:bg-gray-800/20">
            <div className="p-2.5 bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400 rounded-xl">
              <BellRing className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-gray-800 dark:text-gray-200">Seuils d'Alertes de Production</h3>
              <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wider">
                Intelligence Opérationnelle
              </p>
            </div>
          </div>
          
          <div className="p-6 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="max-w-md">
                <p className="text-sm font-bold text-gray-700 dark:text-gray-200">Chute de production laitière</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                  Générer une alerte critique si la production d'une exploitation baisse subitement.
                </p>
              </div>
              <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800 p-1.5 rounded-xl border border-gray-100 dark:border-gray-700">
                <input
                  type="number"
                  defaultValue="15"
                  className="w-16 px-2 py-1.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-black text-center text-gray-700 dark:text-gray-100 outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                />
                <span className="text-xs font-black text-gray-400 pr-2">%</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="max-w-md">
                <p className="text-sm font-bold text-gray-700 dark:text-gray-200">Alerte de santé (Poids)</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                  Seuil de perte de masse pondérale hebdomadaire déclenchant un suivi vétérinaire.
                </p>
              </div>
              <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800 p-1.5 rounded-xl border border-gray-100 dark:border-gray-700">
                <input
                  type="number"
                  defaultValue="5"
                  className="w-16 px-2 py-1.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-black text-center text-gray-700 dark:text-gray-100 outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                />
                <span className="text-xs font-black text-gray-400 pr-2">KG</span>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden transition-all hover:shadow-md">
          <div className="p-6 border-b border-gray-50 dark:border-gray-800 flex items-center gap-4 bg-gray-50/30 dark:bg-gray-800/20">
            <div className="p-2.5 bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 rounded-xl">
              <Mail className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-gray-800 dark:text-gray-200">Canaux de Communication</h3>
          </div>
          <div className="p-4 space-y-2">
            {[
              { label: "Envoyer les rapports quotidiens par Email", sub: "Résumé PDF envoyé chaque matin à 06h00." },
              { label: "Notifications Push (App Mobile Admin)", sub: "Alertes en temps réel sur smartphone." }
            ].map((item, index) => (
              <label
                key={index}
                className="flex items-center justify-between cursor-pointer p-4 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-all group border border-transparent hover:border-gray-100 dark:hover:border-gray-700"
              >
                <div>
                  <span className="text-sm font-bold text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {item.label}
                  </span>
                  <p className="text-[10px] text-gray-400 font-medium">{item.sub}</p>
                </div>
                <div className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                </div>
              </label>
            ))}
          </div>  
        </section>

        {/* SECTION: APPARENCE */}
        <section className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden transition-all hover:shadow-md">
          <div className="p-6 border-b border-gray-50 dark:border-gray-800 flex items-center gap-4 bg-gray-50/30 dark:bg-gray-800/20">
            <div className="p-2.5 bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400 rounded-xl">
              <Monitor className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-gray-800 dark:text-gray-200">Apparence</h3>
              <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wider">
                Personnalisation de l'interface
              </p>
            </div>
          </div>
          
          <div className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-gray-700 dark:text-gray-300">Mode Sombre</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Basculer entre le thème clair et sombre pour l'interface.
              </p>
            </div>
            <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <ModeToggle />
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-2xl border border-green-100 dark:border-green-900 flex items-center gap-4">
              <div className="bg-white dark:bg-green-900/40 p-2 rounded-lg text-green-600 dark:text-green-400 shadow-sm"><Database className="w-4 h-4"/></div>
              <div>
                <p className="text-[10px] font-black text-green-700 dark:text-green-400 uppercase">Base de données</p>
                <p className="text-xs text-green-600/80 dark:text-green-400/80 font-medium">Dernière sauvegarde : Il y a 2h</p>
              </div>
           </div>
           <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-900 flex items-center gap-4">
              <div className="bg-white dark:bg-blue-900/40 p-2 rounded-lg text-blue-600 dark:text-blue-400 shadow-sm"><ShieldCheck className="w-4 h-4"/></div>
              <div>
                <p className="text-[10px] font-black text-blue-700 dark:text-blue-400 uppercase">Certificat SSL</p>
                <p className="text-xs text-blue-600/80 dark:text-blue-400/80 font-medium">Valide jusqu'au 12/2026</p>
              </div>
           </div>
        </div>

        {/* ACTION BUTTON */}
        <div className="flex justify-end pt-4">
          <button
            onClick={handleSave}
            className="bg-green-600 text-white px-10 py-3.5 rounded-2xl font-bold text-sm hover:bg-green-700 shadow-xl shadow-green-100 dark:shadow-none transition-all active:scale-95 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Enregistrer les modifications
          </button>
        </div>
      </div>
    </div>
  );
}