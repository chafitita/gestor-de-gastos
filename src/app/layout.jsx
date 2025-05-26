
import { Inter } from 'next/font/google'; 
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { cn } from '@/lib/utils';
import { Wallet } from 'lucide-react';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata = {
  title: 'Gestor de Gastos',
  description: 'Administra tus ingresos y gastos de forma eficaz.',
};

export default function RootLayout({
  children,
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background font-sans antialiased", inter.variable)}>
        <header className="bg-primary text-primary-foreground py-4 shadow-md">
          <div className="container mx-auto flex items-center justify-center sm:justify-start">
            <Wallet className="h-8 w-8 mr-3" />
            <h1 className="text-2xl font-bold tracking-tight">
              Gestor de Gastos
            </h1>
          </div>
        </header>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
