"use client";

import '../globals.css';
import Sidebar from '@/components/Sidebar';
import { withAuth } from '@/components/withAuth';

function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <Sidebar />
      <main className="ml-64 p-8 w-full bg-gray-50 dark:bg-black min-h-screen">
        {children}
      </main>
    </div>
  );
}

export default withAuth(DashboardLayout);
