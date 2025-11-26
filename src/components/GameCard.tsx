import { Game } from '@/src/services/gameService';
import { Calendar, Gamepad, Monitor } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

interface GameCardProps {
  game: Game;
}
export function GameCard({ game }: GameCardProps) {
  const [imageError, setImageError] = useState(false);
  // Função para definir a cor do badge baseado no status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'JOGANDO': return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'ZERADO': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      case 'ABANDONADO': return 'bg-red-500/20 text-red-400 border-red-500/50';
      default: return 'bg-slate-700/50 text-slate-300 border-slate-600'; // Quero Jogar
    }
  };

  // Formata o texto do status para ficar bonito (Ex: QUERO_JOGAR -> Quero Jogar)
  const formatStatus = (status: string) => {
    return status.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  }

  return (
    <div className="group relative bg-slate-900 rounded-xl overflow-hidden border border-slate-800 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-900/20 transition-all duration-300">
      
      {/* TRATAMENTO DE IMAGEM ROBUSTO:
         1. aspect-video: Força o formato 16:9 (cinemático) independente da imagem original.
         2. w-full: Ocupa toda a largura do card.
         3. object-cover: Corta as bordas da imagem se necessário para preencher sem esticar/deformar.
         4. bg-slate-800: Cor de fundo caso a imagem demore ou falhe.
      */}
      <div className="relative w-full aspect-video bg-slate-800 overflow-hidden">
        {game.imageUrl && !imageError ? (
          <Image
            src={game.imageUrl}
            alt={game.title}
            fill
            sizes="(max-width: 768px) 100vw, 300px"
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
            unoptimized
            priority
            onError={() => setImageError(true)}
          />
        ) : (
          // Fallback se não tiver URL ou erro: Ícone centralizado
          <div className="w-full h-full flex items-center justify-center text-slate-700">
            <Gamepad size={48} />
          </div>
        )}

        {/* Overlay escuro degradê para o texto ficar legível */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-90 pointer-events-none" />
        
        {/* Badge de Status (Posicionado sobre a imagem no canto inferior direito) */}
        <div className={`absolute bottom-3 right-3 px-2.5 py-1 rounded-md text-xs font-bold border backdrop-blur-sm ${getStatusColor(game.status)}`}>
          {formatStatus(game.status)}
        </div>
      </div>

      {/* Informações do Jogo */}
      <div className="p-4 relative -mt-2">
        <h3 className="text-lg font-bold text-white mb-2 truncate">{game.title}</h3>
        
        <div className="flex flex-wrap gap-2 text-xs text-slate-400">
          {/* Ano */}
          <div className="flex items-center gap-1 bg-slate-800 px-2 py-1 rounded">
            <Calendar size={12} />
            <span>{game.releaseYear || 'N/A'}</span>
          </div>

          {/* Plataformas (Mostra só a primeira ou trunca para não quebrar layout) */}
          <div className="flex items-center gap-1 bg-slate-800 px-2 py-1 rounded truncate max-w-[150px]">
            <Monitor size={12} />
            <span className="truncate">{game.platforms || 'Unknown'}</span>
          </div>
        </div>
      </div>
    </div>
  );  
}
