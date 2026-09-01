import React from 'react';
import { ShieldAlert, Play } from 'lucide-react';
import { retroAudio } from '../audio/retroAudio';

interface RepechajeModalProps {
  targetGoals: number;
  currentDivisionName: string;
  onStartRepechaje: () => void;
}

export const RepechajeModal: React.FC<RepechajeModalProps> = ({
  targetGoals,
  currentDivisionName,
  onStartRepechaje,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fadeIn font-mono">
      {/* 16-Bit SNES Ornate Wood Frame */}
      <div className="w-full max-w-xl bg-gradient-to-b from-[#2b1706] to-[#140b03] border-4 border-red-700 rounded-2xl p-6 text-white shadow-[0_12px_40px_rgba(220,38,38,0.5),inset_0_2px_4px_rgba(255,255,255,0.15)] flex flex-col items-center text-center">
        {/* Warning Icon */}
        <div className="w-16 h-16 rounded-full bg-red-600/20 border-2 border-red-500 flex items-center justify-center text-red-400 mb-3 animate-bounce shadow-lg">
          <ShieldAlert className="w-9 h-9" />
        </div>

        <div className="px-4 py-1 bg-gradient-to-r from-red-800 via-red-600 to-red-800 text-yellow-300 border-2 border-yellow-500 rounded-md font-arcade text-xs font-bold shadow-md tracking-wider mb-2 uppercase">
          ¡ALERTA MÁXIMA DE DESCENSO!
        </div>

        <h2 className="font-arcade text-lg sm:text-xl text-yellow-400 font-bold mb-2">
          DESAFÍO DE PERMANENCIA (REPECHAJE)
        </h2>

        <p className="text-xs text-amber-200/90 font-mono max-w-md mb-4 leading-relaxed">
          Has finalizado la temporada en zona roja de <strong className="text-yellow-300">{currentDivisionName}</strong>.
          Tienes una última oportunidad en un partido relámpago de <span className="text-yellow-300 font-bold">30 SEGUNDOS</span>.
        </p>

        {/* Goal Target Requirement Box */}
        <div className="w-full bg-[#170e06] border-2 border-[#59300e] rounded-xl p-4 mb-5 flex items-center justify-around shadow-inner">
          <div>
            <span className="font-mono text-[9px] text-amber-200/70 uppercase font-bold tracking-wider block mb-1">TIEMPO LÍMITE</span>
            <span
              className="font-mono text-2xl sm:text-3xl font-black text-red-500"
              style={{ textShadow: '0 0 10px rgba(239, 68, 68, 0.7)' }}
            >
              00:30
            </span>
          </div>
          <div className="h-10 w-[2px] bg-[#59300e]" />
          <div>
            <span className="font-mono text-[9px] text-amber-200/70 uppercase font-bold tracking-wider block mb-1">META OBLIGATORIA</span>
            <span className="font-arcade text-2xl font-bold text-emerald-400">+{targetGoals} GOLES</span>
          </div>
        </div>

        {/* CTA Launch Button */}
        <button
          type="button"
          id="btn-launch-repechaje"
          onClick={() => {
            retroAudio.playWhistle(true);
            onStartRepechaje();
          }}
          className="w-full py-4 bg-gradient-to-r from-red-600 via-rose-600 to-red-600 hover:from-red-500 hover:to-rose-500 active:scale-95 text-white rounded-xl font-arcade text-xs sm:text-sm font-bold shadow-2xl border-2 border-red-300 flex items-center justify-center gap-2 transition-all tracking-wider"
        >
          <Play className="w-5 h-5 fill-white" />
          <span>¡JUGAR REPECHAJE Y SALVAR LA CATEGORÍA!</span>
        </button>
      </div>
    </div>
  );
};
