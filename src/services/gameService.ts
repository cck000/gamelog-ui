import api from './api';

// Tipagem (igual aos DTOs de resposta do Java)
export interface Game {
    id: number;
    externalApiId: number;
    title: string;
    imageUrl: string;
    releaseYear: number;
    genres: string;
    platforms: string;
    status: 'QUERO_JOGAR' | 'JOGANDO' | 'ZERADO' | 'ABANDONADO';
}

export interface GameSearchResult {
    externalApiId: number;
    title: string;
    imageUrl: string;
    releaseYear?: number;
    genres?: string;
    platforms?: string;
    inLibrary: boolean; // Importante para a UI
}

export const gameService = {
    // Buscar na biblioteca pessoal
    getMyLibrary: async () => {
        const response = await api.get<Game[]>('/games');
        return response.data;
    },

    // Buscar na API Externa (RAWG via Backend)
    searchGames: async (query: string) => {
        const response = await api.get<GameSearchResult[]>(`/search/games?query=${query}`);
        return response.data;
    },

    // Adicionar jogo
    addGame: async (gameData: Partial<Game>) => {
        const response = await api.post<Game>('/games', gameData);
        return response.data;
    },

    // Remover jogo
    removeGame: async (gameId: number) => {
        await api.delete(`/games/${gameId}`);
    },
    
    // Atualizar Status
    updateStatus: async (gameId: number, status: string) => {
        await api.patch(`/games/${gameId}`, { status });
    }
};