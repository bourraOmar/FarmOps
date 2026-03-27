"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/api";

export function withAuth<P extends object>(
  Component: React.ComponentType<P>
) {
  return function ProtectedRoute(props: P) {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      const checkAuth = async () => {
        const token = localStorage.getItem("access_token");

        if (!token) {
          router.push("/auth/login");
          return;
        }

        try {
          // Verify token is still valid
          const profile = await apiClient.getProfile();

          // Check if user is admin
          if (profile.role !== "admin") {
            localStorage.removeItem("access_token");
            localStorage.removeItem("user");
            router.push("/auth/login");
            return;
          }

          setIsAuthenticated(true);
        } catch (error) {
          // Token is invalid
          localStorage.removeItem("access_token");
          localStorage.removeItem("user");
          router.push("/auth/login");
        } finally {
          setIsLoading(false);
        }
      };

      checkAuth();
    }, [router]);

    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Vérification de l&apos;authentification...</p>
          </div>
        </div>
      );
    }

    if (!isAuthenticated) {
      return null;
    }

    return <Component {...props} />;
  };
}
