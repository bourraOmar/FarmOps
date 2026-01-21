import '../globals.css';
import Sidebar from '@/components/Sidebar';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>
        <div className="flex">
          <Sidebar />
          <main className="ml-64 p-8 w-full bg-gray-50 min-h-screen">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
