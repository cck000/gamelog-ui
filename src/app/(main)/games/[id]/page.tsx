'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useGameLibrary } from '@/src/contexts/GameContext';
import { gameService } from '@/src/services/gameService';
import { ArrowLeft, Calendar, Gamepad2, Monitor, Trash2, Save, Loader2 } from 'lucide-react';
import Image from 'next/image';

export default function GameDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { games, refreshLibrary } = useGameLibrary();
  
  // Estado local
  const [loading, setLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Encontra o jogo na lista global baseado no ID da URL
  // Convertemos params.id para Number pois vem como string
  const game = games.find(g => g.id === Number(params.id));

  // Se a biblioteca ainda não carregou ou o jogo não existe
  if (!game) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-slate-500">
         <p>Game not found or loading...</p>
         <button onClick={() => router.back()} className="mt-4 text-blue-500 hover:underline">
            Go back
         </button>
      </div>
    );
  }

  // Ação: Mudar Status
  const handleStatusChange = async (newStatus: string) => {
    setLoading(true);
    try {
      await gameService.updateStatus(game.id, newStatus);
      await refreshLibrary(); // Atualiza o contexto global
    } catch (error) {
      console.error("Erro ao atualizar status", error);
    } finally {
      setLoading(false);
    }
  };

  // Ação: Remover Jogo
  const handleRemove = async () => {
    if (!confirm("Are you sure you want to remove this game from your library?")) return;

    setIsDeleting(true);
    try {
      await gameService.removeGame(game.id);
      await refreshLibrary(); // Atualiza a lista
      router.push('/dashboard'); // Volta para home
    } catch (error) {
      console.error("Erro ao remover", error);
      setIsDeleting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in duration-500">
      
      {/* 1. Botão de Retorno (Topo) */}
      <button 
        onClick={() => router.back()}
        className="flex items-center gap-2 text-slate-400 hover:text-white transition mb-8 group"
      >
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        Back to Library
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* COLUNA DA ESQUERDA: Capa e Título */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Capa do Jogo (Estilo Poster) */}
          <div className="aspect-[3/4] w-full bg-slate-800 rounded-2xl overflow-hidden shadow-2xl shadow-black/50 border border-slate-800 relative">
             {game.imageUrl ? (
                <Image 
                  src={game.imageUrl} 
                  alt={game.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                  unoptimized
                  priority
                />
             ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-600">
                    <Gamepad2 size={64} />
                </div>
             )}
          </div>

          {/* Título e Metadados Mobile */}
          <div>
             <h1 className="text-4xl font-bold text-white leading-tight">{game.title}</h1>
             <div className="flex flex-wrap gap-4 mt-4 text-slate-400 text-sm">
                {game.releaseYear && (
                    <span className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
                        <Calendar size={16} className="text-blue-500"/> {game.releaseYear}
                    </span>
                )}
             </div>
          </div>
        </div>


        {/* COLUNA DA DIREITA: Controles e Detalhes */}
        <div className="lg:col-span-7 space-y-8">
            
            {/* CARD DE STATUS (O controle principal) */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-white">My Status</h2>
                    {loading && <Loader2 className="animate-spin text-blue-500" size={20} />}
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                    {/* Dropdown de Status Customizado */}
                    <div className="relative flex-1">
                        <select
                            value={game.status}
                            onChange={(e) => handleStatusChange(e.target.value)}
                            disabled={loading}
                            className="w-full appearance-none bg-slate-950 border border-slate-700 text-white py-3 px-4 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition cursor-pointer disabled:opacity-50"
                        >
                            <option value="QUERO_JOGAR">Quero Jogar</option>
                            <option value="JOGANDO">Jogando</option>
                            <option value="ZERADO">Zerado</option>
                            <option value="ABANDONADO">Abandonado</option>
                        </select>
                        {/* Ícone da seta do select */}
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                        </div>
                    </div>

                    {/* Botão de Remover */}
                    <button 
                        onClick={handleRemove}
                        disabled={isDeleting}
                        className="flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 px-6 py-3 rounded-xl font-medium transition disabled:opacity-50 whitespace-nowrap"
                    >
                        {isDeleting ? <Loader2 className="animate-spin" size={18}/> : <Trash2 size={18} />}
                        Remove
                    </button>
                </div>
            </div>

            {/* CARD DE DETALHES (Plataformas e Gêneros) */}
            <div className="space-y-6">
                
                {/* Plataformas */}
                {game.platforms && (
                    <div>
                        <h3 className="text-slate-500 text-sm font-medium uppercase tracking-wider mb-3">Platforms</h3>
                        <div className="flex flex-wrap gap-2">
                            {game.platforms.split(', ').map((plat) => (
                                <span key={plat} className="flex items-center gap-2 bg-slate-900 text-slate-300 px-4 py-2 rounded-lg border border-slate-800 text-sm">
                                    <Monitor size={14} />
                                    {plat}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Gêneros */}
                {game.genres && (
                    <div>
                        <h3 className="text-slate-500 text-sm font-medium uppercase tracking-wider mb-3">Genres</h3>
                        <div className="flex flex-wrap gap-2">
                            {game.genres.split(', ').map((genre) => (
                                <span key={genre} className="bg-slate-800 text-slate-400 px-3 py-1 rounded-full text-xs border border-slate-700">
                                    {genre}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>

        </div>
      </div>
    </div>
  );
}