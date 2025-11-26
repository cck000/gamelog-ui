'use client';

import { useEffect, useState } from 'react';
import { useGameLibrary } from '@/src/contexts/GameContext';
import { gameService, Game } from '@/src/services/gameService';
import { GameCard } from '@/src/components/GameCard';
import { Frown, Gamepad2, Loader2, PlusCircle } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  // Pega tudo do contexto global
  const { games, loading, searchLocalQuery } = useGameLibrary();

  // Lógica de Filtro Local (Case insensitive)
  const filteredGames = games.filter(game => 
    game.title.toLowerCase().includes(searchLocalQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="h-[50vh] flex items-center justify-center text-blue-500">
        <Loader2 size={40} className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
            <h1 className="text-3xl font-bold text-white">My Games</h1>
            <p className="text-slate-400 text-sm mt-1">
                {/* Mostra contagem filtrada vs total */}
                {searchLocalQuery 
                  ? `Found ${filteredGames.length} of ${games.length} games`
                  : `${games.length} ${games.length === 1 ? 'game' : 'games'} in collection`
                }
            </p>
        </div>
      </div>

      {/* Grid de Jogos */}
      {filteredGames.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredGames.map((game) => (
             // Usamos um Link ou div aqui. Se clicar, poderia abrir detalhes.
             <Link key={game.id} 
                href={`/games/${game.id}`}
                className="block transition-transform hover:scale-[1.02] active:scale-95" // Efeito visual de clique
             >
                <GameCard game={game} />
             </Link>
          ))}
        </div>
      ) : (
        // Estado Vazio (Empty State)
        <div className="text-center py-20 bg-slate-900/30 rounded-2xl border border-slate-800 border-dashed">
            {searchLocalQuery ? (
                // Caso a busca não retorne nada
                <>
                   <div className="inline-flex bg-slate-800 p-4 rounded-full mb-4">
                        <Frown className="text-slate-500" size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">No games found</h3>
                    <p className="text-slate-400">
                        We couldn&apos;t find any game matching `&quot;{searchLocalQuery}&quot;` in your library.
                    </p>
                </>
            ) : (
                // Caso a biblioteca esteja vazia mesmo
                <>
                    <div className="inline-flex bg-slate-800 p-4 rounded-full mb-4">
                        <PlusCircle className="text-slate-500" size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Your collection is empty</h3>
                    <p className="text-slate-400 max-w-sm mx-auto mb-6">
                        Start building your library by adding new games via the button above.
                    </p>
                </>
            )}
        </div>
      )}
    </div>
  );
}