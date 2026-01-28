"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Sprout, 
  LayoutDashboard, 
  Users, 
  Beef, 
  Droplets, 
  Warehouse, 
  Settings, 
  LogOut 
} from 'lucide-react';

const Sidebar = () => {
  const pathname = usePathname();

  // Fonction pour vérifier si le lien est actif
  const isActive = (path: string) => pathname === path;

  const navItemClass = (path: string) => `
    flex items-center gap-3 px-3 py-2 rounded-lg transition-colors
    ${isActive(path) 
      ? 'text-green-700 bg-green-50 dark:bg-green-900/20 dark:text-green-400 font-medium' 
      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200'}
  `;

  return (
    <aside className="w-64 h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col fixed left-0 top-0 z-50">
      {/* LOGO */}
      <div className="p-6 flex items-center gap-3">
        <div className="bg-green-600 p-2 rounded-lg">
          <Sprout className="text-white w-6 h-6" />
        </div>
        <h1 className="text-xl font-bold text-gray-800 dark:text-white tracking-tight">FarmOps</h1>
      </div>

      {/* NAVIGATION */}
      <nav className="flex-1 px-4 space-y-1 mt-4 overflow-y-auto">
        
        <p className="text-xs font-semibold text-gray-400 uppercase px-3 mb-2">Principal</p>
        
        <Link href="/dashboard" className={navItemClass('/dashboard')}>
          <LayoutDashboard className="w-5 h-5" />
          Dashboard
        </Link>

        <Link href="/farmers" className={navItemClass('/farmers')}>
          <Users className="w-5 h-5" />
          Éleveurs
        </Link>

        <div className="pt-4">
          <p className="text-xs font-semibold text-gray-400 uppercase px-3 mb-2">Gestion</p>
          <Link href="/livestock" className={navItemClass('/livestock')}>
            <Beef className="w-5 h-5" />
            Bétail Global
          </Link>
          <Link href="/milk-production" className={navItemClass('/milk-production')}>
            <Droplets className="w-5 h-5" />
            Production Lait
          </Link>
          <Link href="/farms" className={navItemClass('/farms')}>
            <Warehouse className="w-5 h-5" />
            Fermes
          </Link>
        </div>

        <div className="pt-4">
          <p className="text-xs font-semibold text-gray-400 uppercase px-3 mb-2">Système</p>
          <Link href="/settings" className={navItemClass('/settings')}>
            <Settings className="w-5 h-5" />
            Paramètres
          </Link>
        </div>
      </nav>

      {/* FOOTER - ADMIN PROFILE */}
      <div className="p-4 border-t border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-800 rounded-xl">
          <div className="w-10 h-10 rounded-full bg-green-200 dark:bg-green-900 flex items-center justify-center font-bold text-green-700 dark:text-green-400 shrink-0">
            AD
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">Admin FarmOps</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">admin@myfarmops.app</p>
          </div>
          <button title="Déconnexion" className="text-gray-400 hover:text-red-500 transition-colors">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;