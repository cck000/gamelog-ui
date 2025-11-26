'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { gameService, GameSearchResult } from '@/src/services/gameService';
import { Loader2, Plus, Check, Search as SearchIcon, Calendar, Monitor } from 'lucide-react';
import Image from 'next/image';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<GameSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [addingId, setAddingId] = useState<number | null>(null);

  const handleSearch = useCallback(async (e: React.FormEvent) => {
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
  }, [query]);

  // Se vier com ?q=Mario na URL, busca automaticamente
  useEffect(() => {
    if (initialQuery) {
      handleSearch(new Event('submit') as never);
    }
  }, [initialQuery, handleSearch]);

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

      // Atualiza a lista local para mostrar que foi adicionado
      setResults(prev => prev.map(g => 
        g.externalApiId === game.externalApiId ? { ...g, inLibrary: true } : g
      ));
    } catch (error) {
      console.error("Erro ao adicionar", error);
    } finally {
      setAddingId(null);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      
      {/* CARD DE BUSCA (Baseado na sua imagem) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl mb-8">
        <h1 className="text-2xl font-bold text-white mb-6">Add New Game</h1>
        
        <form onSubmit={handleSearch} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-400">Game Title</label>
            <div className="relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. The Witcher 3: Wild Hunt"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg py-3 pl-4 pr-12 text-white placeholder-slate-600 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition"
              />
              <button 
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-slate-800 text-slate-400 hover:text-white rounded-md transition"
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : <SearchIcon size={18} />}
              </button>
            </div>
            <p className="text-xs text-slate-500">
              Type the name of the game and we will fetch the details (Platform, Year, Cover) automatically.
            </p>
          </div>
        </form>
      </div>

      {/* LISTA DE RESULTADOS */}
      <div className="space-y-4">
        {results.map((game) => (
          <div 
            key={game.externalApiId}
            className="group bg-slate-900/50 border border-slate-800/50 hover:border-slate-700 hover:bg-slate-900 rounded-xl p-4 flex gap-4 transition-all duration-300"
          >
            {/* Imagem Pequena (Thumbnail) */}
            <div className="w-24 h-32 flex-shrink-0 bg-slate-800 rounded-lg overflow-hidden relative shadow-lg">
              {game.imageUrl ? (
                <Image 
                   src={game.imageUrl} 
                   alt={game.title}
                   fill
                   sizes="96px"
                   className="object-cover group-hover:scale-105 transition-transform"
                   unoptimized
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-600">
                   <SearchIcon size={24} />
                </div>
              )}
            </div>

            {/* Informações */}
            <div className="flex-1 py-1 flex flex-col justify-between">
              <div>
                <h3 className="text-white font-bold text-lg">{game.title}</h3>
                <div className="flex flex-wrap gap-3 mt-2 text-sm text-slate-400">
                  {game.releaseYear && (
                    <div className="flex items-center gap-1.5">
                      <Calendar size={14} className="text-blue-500" />
                      <span>{game.releaseYear}</span>
                    </div>
                  )}
                  {game.platforms && (
                    <div className="flex items-center gap-1.5">
                      <Monitor size={14} className="text-purple-500" />
                      <span className="truncate max-w-[200px]">{game.platforms}</span>
                    </div>
                  )}
                </div>
                {game.genres && (
                    <p className="text-xs text-slate-500 mt-2">{game.genres}</p>
                )}
              </div>

              {/* Botão de Ação */}
              <div className="mt-4 flex justify-end">
                {game.inLibrary ? (
                  <button disabled className="flex items-center gap-2 bg-green-500/10 text-green-500 border border-green-500/20 px-4 py-2 rounded-lg text-sm font-medium cursor-default">
                    <Check size={16} />
                    In Library
                  </button>
                ) : (
                  <button 
                    onClick={() => handleAddGame(game)}
                    disabled={addingId === game.externalApiId}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg text-sm font-medium transition shadow-lg shadow-blue-900/20"
                  >
                    {addingId === game.externalApiId ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Adding...
                      </>
                    ) : (
                      <>
                        <Plus size={16} />
                        Add to Library
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {results.length === 0 && query && !loading && (
          <div className="text-center py-12 text-slate-500">
            No games found matching &quot;{query}&quot;
          </div>
        )}
      </div>
    </div>
  );
}