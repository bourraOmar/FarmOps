"use client";

import React, { useState } from "react";
import { Mail, Lock, LogIn, Clover, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Simulation d'authentification (À connecter avec le backend NestJS plus tard)
    try {
      await new Promise(resolve => setTimeout(resolve, 1500)); // Fake network delay

      if (email === "admin@myfarmops.app" && password === "password") {
        console.log("Login success");
        router.push("/dashboard");
      } else {
        setError("Identifiants incorrects. Essayez admin@myfarmops.app / password");
      }
    } catch (err) {
      setError("Une erreur est survenue lors de la connexion.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-stretch bg-white dark:bg-gray-900 font-sans overflow-hidden">
      {/* CÔTÉ GAUCHE : IMAGE AVEC OVERLAY VERT */}
      <div className="hidden lg:flex w-1/2 relative">
        {/* Overlay Vert (Opacity 60-70% comme sur l'image) */}
        <div className="absolute inset-0 bg-green-900/60 z-10"></div>

        <img
          src="https://images.unsplash.com/photo-1500595046743-cd271d694d30?q=80&w=2070&auto=format&fit=crop"
          alt="Élevage FarmOps"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Contenu textuel à gauche */}
        <div className="relative z-20 p-16 flex flex-col justify-between h-full w-full">
          <div className="mt-10">
            {/* Logo Blanc */}
            <div className="flex items-center gap-3 mb-12">
              <div className="bg-white p-2 rounded-lg">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 3L4 9V21H20V9L12 3Z"
                    stroke="#16a34a"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M9 21V12H15V21"
                    stroke="#16a34a"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <span className="text-white text-2xl font-bold tracking-tight">
                FarmOps
              </span>
            </div>

            <h2 className="text-5xl font-extrabold text-white leading-[1.1] mb-6">
              Gérez votre élevage <br /> avec précision.
            </h2>
            <p className="text-white/90 text-lg max-w-md font-normal">
              Une solution complète pour le suivi du bétail, de la production
              laitière et de la généalogie.
            </p>
          </div>

          <div className="text-white/60 text-xs">
            © 2026 FarmOps System. Solution certifiée pour la traçabilité
            nationale.
          </div>
        </div>
      </div>

      {/* CÔTÉ DROIT : FORMULAIRE BLANC */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16 bg-white dark:bg-gray-900">
        <div className="max-w-md w-full">
          <div className="mb-10 lg:hidden text-center">
            <Clover
              data-lucide="sprout"
              className="text-green-600 w-12 h-12 mx-auto mb-2"
            />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">FarmOps Admin</h1>
          </div>

          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Bienvenue</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-8">
            Veuillez entrer vos identifiants pour accéder au dashboard.
          </p>
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm font-medium">
                {error}
              </div>
            )}
            
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">
                Email Administrateur
              </label>
              <div className="relative">
                <Mail
                  className="w-5 h-5 absolute left-4 top-3.5 text-gray-300"
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@myfarmops.app"
                  required
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl outline-none focus:ring-2 focus:ring-green-500 focus:bg-white dark:focus:bg-gray-900 dark:text-white transition-all disabled:opacity-50"
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="block text-xs font-bold text-gray-400 uppercase">
                  Mot de passe
                </label>
                <a
                  href="#"
                  className="text-xs font-bold text-green-600 hover:underline"
                >
                  Oublié ?
                </a>
              </div>
              <div className="relative">
                <Lock className="w-5 h-5 absolute left-4 top-3.5 text-gray-300" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl outline-none focus:ring-2 focus:ring-green-500 focus:bg-white dark:focus:bg-gray-900 dark:text-white transition-all disabled:opacity-50"
                  disabled={loading}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-green-100 dark:shadow-none hover:bg-green-700 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Connexion...
                </>
              ) : (
                <>
                  Se connecter
                  <LogIn className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-14 text-center">
            <p className="text-xs text-gray-400">
              Besoin d'aide technique ?{" "}
              <Link
                href="#"
                className="text-green-600 font-bold hover:underline"
              >
                Contactez le support
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
