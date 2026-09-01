import React from 'react';
import { CareerStats } from '../types';
import { Trophy as TrophyIcon, Award, ShieldCheck, Flame, Star, ArrowLeft, History, X, Coins, Zap } from 'lucide-react';
import { retroAudio } from '../audio/retroAudio';

interface TrophyCabinetProps {
  careerStats: CareerStats;
  onBack: () => void;
}

export const TrophyCabinet: React.FC<TrophyCabinetProps> = ({ careerStats, onBack }) => {
  const handleExit = () => {
    retroAudio.playClick();
    onBack();
  };

  const totalGoals = careerStats?.totalGoals ?? 0;
  const totalMatches = careerStats?.totalMatches ?? 0;
  const titlesWon = careerStats?.titlesWon ?? 0;
  const relegationsSaved = careerStats?.relegationsSaved ?? 0;
  const trophies = Array.isArray(careerStats?.trophies) ? careerStats.trophies : [];
  const matchHistory = Array.isArray(careerStats?.matchHistory) ? careerStats.matchHistory : [];

  return (
    <div className="w-full max-w-5xl mx-auto bg-gradient-to-b from-[#2b1706] to-[#140b03] border-4 border-[#8c501c] rounded-2xl text-white shadow-[0_12px_40px_rgba(0,0,0,0.9),inset_0_2px_4px_rgba(255,255,255,0.15)] animate-fadeIn font-mono flex flex-col max-h-[92vh] overflow-hidden">
      {/* Sticky Header Bar */}
      <div className="sticky top-0 z-30 bg-[#1a0f07] border-b-2 border-[#8c501c] px-4 py-3 sm:px-6 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <button
            type="button"
            id="btn-trophy-back-header"
            onClick={handleExit}
            className="px-3 py-1.5 bg-[#2b1706] hover:bg-[#3d2008] active:scale-95 rounded-lg border border-[#8c501c] text-yellow-400 font-arcade text-xs flex items-center gap-1.5 shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" /> VOLVER
          </button>
          <div className="px-3 py-1 bg-gradient-to-r from-red-700 via-red-600 to-red-700 text-yellow-300 border-2 border-yellow-500 rounded-md font-arcade text-xs sm:text-sm font-bold shadow-md tracking-wider flex items-center gap-2">
            <TrophyIcon className="w-4 h-4 text-yellow-300 shrink-0" />
            <span>VITRINA DE TROFEOS & HISTORIAL</span>
          </div>
        </div>

        <button
          type="button"
          id="btn-trophy-close-x"
          onClick={handleExit}
          className="p-1.5 bg-[#2b1706] hover:bg-[#3d2008] active:scale-95 rounded-lg border border-[#8c501c] text-amber-200 hover:text-white"
          title="Cerrar vitrina"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Scrollable Body Container */}
      <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
        {/* Career Overview Metric Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-[#170e06] p-3 rounded-xl border-2 border-[#59300e] flex items-center gap-3 shadow-inner">
            <div className="p-2.5 bg-yellow-500/20 rounded-lg text-yellow-400 border border-yellow-500/40 shrink-0">
              <Flame className="w-5 h-5" />
            </div>
            <div className="truncate">
              <span className="text-[9px] text-amber-200/70 font-mono uppercase tracking-wider block font-bold">GOLES TOTALES</span>
              <span className="font-arcade text-base sm:text-lg font-bold text-yellow-400">{totalGoals}</span>
            </div>
          </div>

          <div className="bg-[#170e06] p-3 rounded-xl border-2 border-[#59300e] flex items-center gap-3 shadow-inner">
            <div className="p-2.5 bg-green-500/20 rounded-lg text-green-400 border border-green-500/40 shrink-0">
              <Star className="w-5 h-5" />
            </div>
            <div className="truncate">
              <span className="text-[9px] text-amber-200/70 font-mono uppercase tracking-wider block font-bold">PARTIDOS</span>
              <span className="font-arcade text-base sm:text-lg font-bold text-green-400">{totalMatches}</span>
            </div>
          </div>

          <div className="bg-[#170e06] p-3 rounded-xl border-2 border-[#59300e] flex items-center gap-3 shadow-inner">
            <div className="p-2.5 bg-cyan-500/20 rounded-lg text-cyan-400 border border-cyan-500/40 shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div className="truncate">
              <span className="text-[9px] text-amber-200/70 font-mono uppercase tracking-wider block font-bold">TÍTULOS</span>
              <span className="font-arcade text-base sm:text-lg font-bold text-cyan-400">{titlesWon}</span>
            </div>
          </div>

          <div className="bg-[#170e06] p-3 rounded-xl border-2 border-[#59300e] flex items-center gap-3 shadow-inner">
            <div className="p-2.5 bg-purple-500/20 rounded-lg text-purple-400 border border-purple-500/40 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="truncate">
              <span className="text-[9px] text-amber-200/70 font-mono uppercase tracking-wider block font-bold">REPECHAJES</span>
              <span className="font-arcade text-base sm:text-lg font-bold text-purple-400">{relegationsSaved}</span>
            </div>
          </div>
        </div>

        {/* Trophies Grid */}
        <div>
          <h2 className="font-mono text-[10px] text-yellow-300 mb-3 flex items-center gap-2 uppercase tracking-widest font-bold">
            <TrophyIcon className="w-4 h-4 text-yellow-400" /> TROFEOS Y GALARDONES DE CARRERA
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {trophies.map((trophy) => (
              <div
                key={trophy.id}
                className={`p-4 rounded-xl border-2 flex flex-col items-center text-center transition-all ${
                  trophy.unlocked
                    ? 'bg-[#170e06] border-yellow-500/80 shadow-[0_0_15px_rgba(234,179,8,0.2)] ring-1 ring-yellow-400/40'
                    : 'bg-[#120a03] border-[#442309] opacity-40 grayscale'
                }`}
              >
                <div className="text-3xl mb-2">{trophy.icon}</div>
                <span className="font-arcade text-[10px] sm:text-xs font-bold text-yellow-300 mb-1">
                  {trophy.name}
                </span>
                <p className="text-[10px] text-amber-200/70 font-mono line-clamp-2">
                  {trophy.description}
                </p>
                {trophy.unlocked ? (
                  <span className="mt-2 px-2 py-0.5 bg-yellow-500/20 text-yellow-300 font-arcade text-[8px] rounded border border-yellow-500/50 font-bold">
                    DESBLOQUEADO
                  </span>
                ) : (
                  <span className="mt-2 px-2 py-0.5 bg-[#0e0804] text-gray-500 font-mono text-[8px] rounded border border-[#331c0c]">
                    BLOQUEADO
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Match History Log */}
        <div>
          <h2 className="font-mono text-[10px] text-yellow-300 mb-3 flex items-center gap-2 uppercase tracking-widest font-bold">
            <History className="w-4 h-4 text-emerald-400" /> HISTORIAL RECIENTE DE PARTIDOS
          </h2>
          {matchHistory.length === 0 ? (
            <div className="p-6 bg-[#170e06] rounded-xl border-2 border-[#59300e] text-center text-amber-200/60 font-mono text-xs shadow-inner">
              Aún no has disputado ningún partido oficial. ¡Sal a la cancha!
            </div>
          ) : (
            <div className="max-h-48 overflow-y-auto rounded-xl border-2 border-[#59300e] bg-[#170e06] divide-y divide-[#331c0c] shadow-inner">
              {matchHistory.slice().reverse().map((item, idx) => (
                <div key={idx} className="p-3 flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-3">
                    <span
                      className={`font-arcade text-[9px] px-2 py-0.5 rounded font-bold ${
                        item.result === 'WIN'
                          ? 'bg-green-600 text-white'
                          : item.result === 'DRAW'
                          ? 'bg-yellow-600 text-white'
                          : 'bg-red-600 text-white'
                      }`}
                    >
                      {item.result === 'WIN' ? 'VICTORIA' : item.result === 'DRAW' ? 'EMPATE' : 'DERROTA'}
                    </span>
                    <span className="font-mono text-[11px] text-amber-100">
                      Temp. {item.season} • vs {item.rivalName}
                    </span>
                  </div>
                  <div className="font-arcade font-bold text-white text-xs">
                    {item.playerScore} - {item.rivalScore}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom Exit Button */}
        <div className="pt-2 flex justify-center">
          <button
            type="button"
            id="btn-trophy-back-bottom"
            onClick={handleExit}
            className="w-full sm:w-auto px-8 py-3 bg-[#2b1706] hover:bg-[#3d2008] active:scale-95 rounded-xl border-2 border-[#8c501c] text-yellow-400 font-arcade text-xs flex items-center justify-center gap-2 shadow-lg"
          >
            <ArrowLeft className="w-4 h-4" /> VOLVER AL CENTRO DE CARRERA
          </button>
        </div>
      </div>
    </div>
  );
};
