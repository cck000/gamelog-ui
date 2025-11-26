'use client';

import { useState } from 'react';
import { gameService, GameSearchResult } from '@/src/services/gameService';
import { Loader2, Plus, Check, Search as SearchIcon, X, Calendar, Monitor } from 'lucide-react';
import Image from 'next/image';

interface SearchGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGameAdded: () => void; // Para avisar o Dashboard que precisa recarregar a lista
}

export function SearchGameModal({ isOpen, onClose, onGameAdded }: SearchGameModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GameSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [addingId, setAddingId] = useState<number | null>(null);

  if (!isOpen) return null;

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      const data = await gameService.searchGames(query);
      setResults(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddGame = async (game: GameSearchResult) => {
    setAddingId(game.externalApiId);
    try {
      await gameService.addGame({
        externalApiId: game.externalApiId,
        title: game.title,
        imageUrl: game.imageUrl,
        releaseYear: game.releaseYear,
        genres: game.genres,
        platforms: game.platforms
      });

      // Atualiza visualmente o botão neste modal
      setResults(prev => prev.map(g => 
        g.externalApiId === game.externalApiId ? { ...g, inLibrary: true } : g
      ));

      // Avisa o componente pai (Dashboard) para atualizar a lista lá trás
      onGameAdded(); 
      
    } catch (error) {
      console.error("Erro ao adicionar", error);
    } finally {
      setAddingId(null);
    }
  };

  return (
    // OVERLAY (Fundo escuro fixo)
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      
      {/* CONTAINER DO MODAL */}
      <div className="bg-slate-900 border border-slate-800 w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden relative animate-in fade-in zoom-in duration-200">
        
        {/* Botão de Fechar */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-slate-800 text-slate-400 hover:text-white rounded-full transition z-10"
        >
          <X size={20} />
        </button>

        {/* HEADER DO MODAL (Busca) */}
        <div className="p-6 border-b border-slate-800 bg-slate-900 z-0">
          <h2 className="text-2xl font-bold text-white mb-4">Add New Game</h2>
          <form onSubmit={handleSearch} className="relative">
             <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
             <input
                type="text"
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for a game (e.g. Zelda)..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-4 pl-12 pr-4 text-white text-lg placeholder-slate-600 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition"
              />
              <button 
                type="submit" 
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : 'Search'}
              </button>
          </form>
        </div>

        {/* CORPO DO MODAL (Lista de Resultados com Scroll) */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
            {results.length === 0 && !loading && (
                <div className="text-center py-20 text-slate-500">
                    {query ? 'No games found.' : 'Search for a game to add to your library.'}
                </div>
            )}

            {results.map((game) => (
                <div 
                    key={game.externalApiId}
                    className="flex gap-4 bg-slate-950/50 p-4 rounded-xl border border-slate-800 hover:border-slate-600 transition"
                >
                    {/* Imagem */}
                    <div className="w-20 h-28 bg-slate-800 rounded-lg flex-shrink-0 overflow-hidden relative">
                        {game.imageUrl && (
                          <Image 
                            src={game.imageUrl} 
                            alt={game.title}
                            fill
                            sizes="80px"
                            className="object-cover"
                            unoptimized
                          />
                        )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 flex flex-col justify-between">
                        <div>
                            <h3 className="font-bold text-white text-lg">{game.title}</h3>
                            <div className="flex flex-wrap gap-3 text-xs text-slate-400 mt-1">
                                {game.releaseYear && <span className="flex items-center gap-1"><Calendar size={12}/> {game.releaseYear}</span>}
                                {game.platforms && <span className="flex items-center gap-1"><Monitor size={12}/> {game.platforms}</span>}
                            </div>
                        </div>

                        {/* Botão */}
                        <div className="self-end mt-2">
                             {game.inLibrary ? (
                                <span className="text-green-500 text-sm flex items-center gap-1 font-medium bg-green-500/10 px-3 py-1.5 rounded-lg border border-green-500/20">
                                    <Check size={14} /> In Library
                                </span>
                             ) : (
                                <button
                                    onClick={() => handleAddGame(game)}
                                    disabled={addingId === game.externalApiId}
                                    className="text-white bg-blue-600 hover:bg-blue-500 px-4 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2 transition disabled:opacity-50"
                                >
                                    {addingId === game.externalApiId ? <Loader2 size={14} className="animate-spin"/> : <Plus size={14}/>}
                                    Add
                                </button>
                             )}
                        </div>
                    </div>
                </div>
            ))}
        </div>

      </div>
    </div>
  );
}