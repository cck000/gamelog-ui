'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { gameService, Game } from '@/src/services/gameService';

interface GameContextType {
  games: Game[];
  loading: boolean;
  searchLocalQuery: string;
  setSearchLocalQuery: (query: string) => void;
  refreshLibrary: () => Promise<void>;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchLocalQuery, setSearchLocalQuery] = useState('');

  // Função que busca os dados no backend
  const refreshLibrary = async () => {
    setLoading(true);
    try {
      const data = await gameService.getMyLibrary();
      setGames(data);
    } catch (error) {
      console.error('Erro ao carregar biblioteca:', error);
    } finally {
      setLoading(false);
    }
  };

  // Carrega inicial
  useEffect(() => {
    refreshLibrary();
  }, []);

  return (
    <GameContext.Provider value={{ 
      games, 
      loading, 
      searchLocalQuery, 
      setSearchLocalQuery, 
      refreshLibrary 
    }}>
      {children}
    </GameContext.Provider>
  );
}

// Hook personalizado para facilitar o uso
export function useGameLibrary() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGameLibrary deve ser usado dentro de um GameProvider');
  }
  return context;
}