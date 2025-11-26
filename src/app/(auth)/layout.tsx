import React from 'react';
import { Gamepad2 } from 'lucide-react'; // Ícone para o logo
import Link from 'next/link';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col">
      {/* Navbar Simplificada (Baseada na imagem) */}
      <nav className="w-full p-6 flex justify-between items-center max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-2 text-white font-bold text-xl hover:opacity-80 transition">
          <div className="bg-blue-600 p-1.5 rounded-lg">
            <Gamepad2 size={24} />
          </div>
          GameLog
        </Link>
        
        <div className="hidden md:flex gap-8 text-sm font-medium text-slate-400">
          <Link href="#" className="hover:text-white transition">Home</Link>
          <Link href="#" className="hover:text-white transition">Browse</Link>
          <Link href="#" className="hover:text-white transition">Community</Link>
        </div>

        <Link href="/register">
          <button className="bg-blue-900/30 hover:bg-blue-800/50 text-blue-400 border border-blue-800 px-4 py-2 rounded-lg text-sm font-medium transition">
            Sign Up
          </button>
        </Link>
      </nav>

      {/* Conteúdo Centralizado (Onde vão ficar os formulários) */}
      <main className="flex-1 flex items-center justify-center p-4">
        {children}
      </main>
    </div>
  );
}