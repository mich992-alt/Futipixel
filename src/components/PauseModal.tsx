import React from 'react';
import { Play, Volume2, VolumeX, RotateCcw, Home, HelpCircle } from 'lucide-react';
import { retroAudio } from '../audio/retroAudio';

interface PauseModalProps {
  isMuted: boolean;
  onToggleMute: () => void;
  onResume: () => void;
  onRestartMatch: () => void;
  onExitToHub: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  isMuted,
  onToggleMute,
  onResume,
  onRestartMatch,
  onExitToHub,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fadeIn font-mono">
      {/* 16-Bit SNES Ornate Wood Frame */}
      <div className="w-full max-w-md bg-gradient-to-b from-[#2b1706] to-[#140b03] border-4 border-[#8c501c] rounded-2xl p-6 text-white shadow-[0_12px_40px_rgba(0,0,0,0.9),inset_0_2px_4px_rgba(255,255,255,0.15)] flex flex-col items-center text-center">
        <div className="px-4 py-1 bg-gradient-to-r from-red-700 via-red-600 to-red-700 text-yellow-300 border-2 border-yellow-500 rounded-md font-arcade text-xs font-bold shadow-md tracking-wider mb-2 uppercase">
          JUEGO EN PAUSA
        </div>
        <h2 className="font-arcade text-lg sm:text-xl font-bold text-yellow-400 mb-4">TIEMPO MUERTO</h2>

        {/* Controls Quick Guide */}
        <div className="w-full bg-[#170e06] p-4 rounded-xl border-2 border-[#59300e] mb-4 text-left shadow-inner">
          <span className="font-mono text-[10px] text-amber-300/80 font-bold flex items-center gap-1 mb-2.5 uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5 text-cyan-400" /> GUÍA DE CONTROLES
          </span>
          <div className="flex flex-col gap-1.5 font-mono text-[11px] text-amber-100">
            <div className="flex justify-between">
              <span className="text-amber-200/60">Mover Delantero:</span>
              <span className="text-cyan-300 font-bold">Flechas ◀ ▶ / A, D</span>
            </div>
            <div className="flex justify-between">
              <span className="text-amber-200/60">Tiro a Portería:</span>
              <span className="text-cyan-300 font-bold">Espacio (Space)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-amber-200/60">Super Tiro Especial:</span>
              <span className="text-yellow-400 font-bold">Shift / Z</span>
            </div>
            <div className="flex justify-between">
              <span className="text-amber-200/60">Arco Dinámico:</span>
              <span className="text-emerald-400 font-bold">Multiplicador x4 Goles</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5 w-full">
          <button
            type="button"
            onClick={() => {
              retroAudio.playClick();
              onResume();
            }}
            className="w-full py-3 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 active:scale-95 text-white rounded-xl font-arcade text-xs font-bold shadow-lg border-2 border-green-300 flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>CONTINUAR PARTIDO</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onToggleMute();
              retroAudio.playClick();
            }}
            className="w-full py-2.5 bg-[#1f1005] hover:bg-[#331c0c] active:scale-95 text-amber-200 rounded-xl font-arcade text-xs flex items-center justify-center gap-2 border border-[#59300e]"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            <span>{isMuted ? 'ACTIVAR SONIDO' : 'SILENCIAR SONIDO'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              retroAudio.playClick();
              onRestartMatch();
            }}
            className="w-full py-2.5 bg-[#1f1005] hover:bg-[#331c0c] active:scale-95 text-amber-200 rounded-xl font-arcade text-xs flex items-center justify-center gap-2 border border-[#59300e]"
          >
            <RotateCcw className="w-4 h-4 text-yellow-400" />
            <span>REINICIAR PARTIDO</span>
          </button>

          <button
            type="button"
            onClick={() => {
              retroAudio.playClick();
              onExitToHub();
            }}
            className="w-full py-2.5 bg-red-950/60 hover:bg-red-900/60 active:scale-95 text-red-400 rounded-xl font-arcade text-xs flex items-center justify-center gap-2 border border-red-800"
          >
            <Home className="w-4 h-4" />
            <span>ABANDONAR AL CUARTEL GENERAL</span>
          </button>
        </div>
      </div>
    </div>
  );
};
