'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { Gamepad2, LogOut, Plus, Search } from 'lucide-react';
import { useState } from 'react';
import { SearchGameModal } from '@/src/components/SearchGameModal';
import { GameProvider, useGameLibrary } from '@/src/contexts/GameContext';    


// Componente interno para poder usar o hook useGameLibrary (que precisa estar dentro do Provider)
function NavbarContent({ setIsAddModalOpen }: { setIsAddModalOpen: (v: boolean) => void }) {
  const router = useRouter();
  const { searchLocalQuery, setSearchLocalQuery } = useGameLibrary(); // Hook do contexto

  const handleLogout = () => {
    Cookies.remove('gamelog_token');
    router.push('/login');
  };

  return (
    <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2 text-white font-bold text-xl min-w-fit">
          <div className="bg-blue-600 p-1.5 rounded-lg">
            <Gamepad2 size={24} />
          </div>
          <span className="hidden md:block">GameLog</span>
        </Link>

        {/* BARRA DE BUSCA (AGORA FILTRA LOCALMENTE) */}
        <div className="flex-1 max-w-md relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input 
            type="text" 
            placeholder="Filter your games..." 
            className="w-full bg-slate-950 border border-slate-800 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-blue-500 transition text-white placeholder-slate-600"
            value={searchLocalQuery}
            // AQUI A MÁGICA: Atualiza o contexto, não redireciona!
            onChange={(e) => setSearchLocalQuery(e.target.value)} 
          />
        </div>

        {/* Ações */}
        <div className="flex items-center gap-3">
          <button 
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-medium transition shadow-lg shadow-blue-900/20"
          >
              <Plus size={16} />
              <span className="hidden sm:inline">Add Game</span>
          </button>
          
          <button onClick={handleLogout} className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-full transition">
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </nav>
  );
}

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <GameProvider> {/* 1. Envolvemos tudo no Provider */}
      <div className="min-h-screen bg-slate-950 text-slate-200">
        
        {/* Componente separado para consumir o contexto dentro do provider */}
        <LibraryManager isModalOpen={isAddModalOpen} setIsModalOpen={setIsAddModalOpen} />

        <NavbarContent setIsAddModalOpen={setIsAddModalOpen} />

        <main className="max-w-7xl mx-auto p-6">
          {children}
        </main>
      </div>
    </GameProvider>
  );
}

// Um pequeno componente auxiliar para conectar o Modal ao Contexto
function LibraryManager({ isModalOpen, setIsModalOpen }: { isModalOpen: boolean, setIsModalOpen: (v: boolean) => void }) {
  const { refreshLibrary } = useGameLibrary(); // Pega a função de atualizar

  return (
    <SearchGameModal 
      isOpen={isModalOpen} 
      onClose={() => setIsModalOpen(false)}
      onGameAdded={() => {
        refreshLibrary(); // 3. Quando adicionar, recarrega a lista global!
      }}
    />
  );
}