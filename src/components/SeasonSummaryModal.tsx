import React from 'react';
import { DivisionInfo } from '../types';
import { Trophy as TrophyIcon, Sparkles, TrendingUp, TrendingDown, Cake, ArrowRight, CheckCircle2 } from 'lucide-react';
import { retroAudio } from '../audio/retroAudio';
import { BALL_SKINS } from '../utils/gameGenerators';

interface SeasonSummaryModalProps {
  seasonNumber: number;
  newAge: number;
  outcome: 'PROMOTION' | 'RELEGATION' | 'MAINTENANCE' | 'CHAMPION';
  oldDivision: DivisionInfo;
  newDivision: DivisionInfo;
  seasonGoals: number;
  seasonPoints: number;
  newUnlockedBallName?: string;
  onStartNextSeason: () => void;
}

export const SeasonSummaryModal: React.FC<SeasonSummaryModalProps> = ({
  seasonNumber,
  newAge,
  outcome,
  oldDivision,
  newDivision,
  seasonGoals,
  seasonPoints,
  onStartNextSeason,
}) => {
  const nextSeasonBall = BALL_SKINS.find((b) => b.unlockSeason === seasonNumber + 1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fadeIn font-mono">
      {/* 16-Bit SNES Ornate Wood Frame */}
      <div className="w-full max-w-lg bg-gradient-to-b from-[#2b1706] to-[#140b03] border-4 border-[#8c501c] rounded-2xl p-6 text-white shadow-[0_12px_40px_rgba(0,0,0,0.9),inset_0_2px_4px_rgba(255,255,255,0.15)] flex flex-col items-center text-center">
        {/* Red Ribbon Top Header */}
        <div className="px-4 py-1 bg-gradient-to-r from-red-700 via-red-600 to-red-700 text-yellow-300 border-2 border-yellow-500 rounded-md font-arcade text-xs sm:text-sm font-bold shadow-md tracking-wider flex items-center gap-2 mb-3">
          <TrophyIcon className="w-4 h-4 text-yellow-300" />
          <span>BALANCE DE TEMPORADA {seasonNumber}</span>
        </div>

        {/* Outcome Card */}
        <div className="w-full bg-[#170e06] p-4 rounded-xl border-2 border-[#59300e] my-2 shadow-inner">
          {outcome === 'CHAMPION' && (
            <div className="flex flex-col items-center gap-1.5">
              <span className="text-4xl">🏆</span>
              <span className="font-arcade text-yellow-300 text-sm sm:text-base font-bold">¡CAMPEÓN DE LA SUPERLIGA!</span>
              <span className="text-xs text-amber-200/80 font-mono">Has alcanzado la cima del fútbol mundial de 16 bits.</span>
            </div>
          )}
          {outcome === 'PROMOTION' && (
            <div className="flex flex-col items-center gap-1.5">
              <TrendingUp className="w-8 h-8 text-green-400 animate-bounce" />
              <span className="font-arcade text-green-400 text-sm sm:text-base font-bold">¡ASCENSO CONSEGUIDO!</span>
              <span className="text-xs text-amber-200/80 font-mono">
                Avanzas de <strong className="text-yellow-300">{oldDivision.name}</strong> a <strong className="text-green-300">{newDivision.name}</strong>.
              </span>
            </div>
          )}
          {outcome === 'MAINTENANCE' && (
            <div className="flex flex-col items-center gap-1.5">
              <CheckCircle2 className="w-8 h-8 text-cyan-400" />
              <span className="font-arcade text-cyan-300 text-sm sm:text-base font-bold">PERMANENCIA ASEGURADA</span>
              <span className="text-xs text-amber-200/80 font-mono">
                Mantienes tu plaza en la <strong className="text-yellow-300">{newDivision.name}</strong>.
              </span>
            </div>
          )}
          {outcome === 'RELEGATION' && (
            <div className="flex flex-col items-center gap-1.5">
              <TrendingDown className="w-8 h-8 text-red-500" />
              <span className="font-arcade text-red-400 text-sm sm:text-base font-bold">DESCENSO DE CATEGORÍA</span>
              <span className="text-xs text-amber-200/80 font-mono">
                Bajas a la <strong className="text-red-300">{newDivision.name}</strong>. ¡Toca remontar en la próxima temporada!
              </span>
            </div>
          )}
        </div>

        {/* Season Statistics & Birthday Box */}
        <div className="grid grid-cols-3 gap-2.5 w-full mb-3">
          <div className="bg-[#170e06] p-2.5 rounded-lg border-2 border-[#59300e] flex flex-col items-center shadow-inner">
            <span className="text-[9px] font-mono text-amber-200/70 uppercase font-bold tracking-wider">GOLES TEMP.</span>
            <span className="font-arcade text-base font-bold text-yellow-300">{seasonGoals}</span>
          </div>
          <div className="bg-[#170e06] p-2.5 rounded-lg border-2 border-[#59300e] flex flex-col items-center shadow-inner">
            <span className="text-[9px] font-mono text-amber-200/70 uppercase font-bold tracking-wider">PUNTOS</span>
            <span className="font-arcade text-base font-bold text-green-400">{seasonPoints}</span>
          </div>
          <div className="bg-[#170e06] p-2.5 rounded-lg border-2 border-[#59300e] flex flex-col items-center shadow-inner">
            <span className="text-[9px] font-mono text-amber-200/70 flex items-center gap-1 uppercase font-bold tracking-wider">
              <Cake className="w-3 h-3 text-pink-400" /> EDAD
            </span>
            <span className="font-arcade text-base font-bold text-pink-400">{newAge} AÑOS</span>
          </div>
        </div>

        {/* Unlocked Reward Box */}
        {nextSeasonBall && (
          <div className="w-full bg-[#170e06] border-2 border-yellow-500/60 rounded-xl p-3 mb-4 flex items-center gap-3 text-left shadow-inner">
            <div
              className="w-10 h-10 rounded-full border-2 border-white flex items-center justify-center shrink-0 shadow"
              style={{ backgroundColor: nextSeasonBall.primaryColor }}
            >
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: nextSeasonBall.secondaryColor }} />
            </div>
            <div>
              <span className="text-[9px] font-arcade text-yellow-400 font-bold flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-yellow-300" /> ¡NUEVO BALÓN DESBLOQUEADO!
              </span>
              <span className="font-arcade text-xs text-white block">{nextSeasonBall.name}</span>
              <span className="text-[10px] text-amber-200/70 font-mono">{nextSeasonBall.description}</span>
            </div>
          </div>
        )}

        {/* Action Button */}
        <button
          type="button"
          id="btn-start-next-season"
          onClick={() => {
            retroAudio.playTrophyUnlock();
            onStartNextSeason();
          }}
          className="w-full py-3.5 bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-600 hover:from-emerald-500 hover:to-green-500 active:scale-95 text-white rounded-xl font-arcade text-xs sm:text-sm font-bold shadow-2xl border-2 border-green-300 flex items-center justify-center gap-2 transition-all tracking-wider"
        >
          <span>COMENZAR TEMPORADA {seasonNumber + 1}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
