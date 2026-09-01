import React from 'react';
import { CareerStats } from '../types';
import { retroAudio } from '../audio/retroAudio';
import { Zap, Gauge, Timer, ArrowUpCircle, Sparkles, Check } from 'lucide-react';

interface SkillUpgradeModalProps {
  careerStats: CareerStats;
  onUpgradeSkill: (skill: 'moveSpeed' | 'shotVelocity' | 'fireRate') => void;
  onClose: () => void;
}

export const SkillUpgradeModal: React.FC<SkillUpgradeModalProps> = ({
  careerStats,
  onUpgradeSkill,
  onClose,
}) => {
  const level = typeof careerStats?.level === 'number' ? careerStats.level : 1;
  const xp = typeof careerStats?.xp === 'number' ? careerStats.xp : 0;
  const xpToNextLevel = typeof careerStats?.xpToNextLevel === 'number' && careerStats.xpToNextLevel > 0 ? careerStats.xpToNextLevel : 300;
  const skillPoints = typeof careerStats?.skillPoints === 'number' ? careerStats.skillPoints : 0;
  const moveSpeedLevel = typeof careerStats?.moveSpeedLevel === 'number' ? careerStats.moveSpeedLevel : 1;
  const shotVelocityLevel = typeof careerStats?.shotVelocityLevel === 'number' ? careerStats.shotVelocityLevel : 1;
  const fireRateLevel = typeof careerStats?.fireRateLevel === 'number' ? careerStats.fireRateLevel : 1;

  const xpProgress = Math.min(100, Math.round((xp / xpToNextLevel) * 100));

  const handleUpgrade = (skill: 'moveSpeed' | 'shotVelocity' | 'fireRate') => {
    if (skillPoints > 0) {
      retroAudio.playTrophyUnlock();
      onUpgradeSkill(skill);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-md animate-fadeIn font-mono">
      {/* SNES Wooden Frame */}
      <div className="w-full max-w-xl bg-gradient-to-b from-[#2b1706] to-[#140b03] border-3 sm:border-4 border-[#8c501c] rounded-2xl p-4 sm:p-6 text-white shadow-[0_12px_40px_rgba(0,0,0,0.9),inset_0_2px_4px_rgba(255,255,255,0.15)] flex flex-col gap-3 sm:gap-4 max-h-[92vh] overflow-y-auto">
        {/* Red Ribbon Header */}
        <div className="flex items-center justify-between border-b-2 border-[#8c501c]/60 pb-3 gap-2 flex-wrap">
          <div className="px-2.5 sm:px-3 py-1 bg-gradient-to-r from-red-700 via-red-600 to-red-700 text-yellow-300 border-2 border-yellow-500 rounded-md font-arcade text-[10px] sm:text-xs font-bold shadow-md tracking-wider flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-yellow-300" />
            <span>RPG: ENTRENAMIENTO & HABILIDADES</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-2.5 py-1 bg-[#1a0f07] hover:bg-[#331c0c] text-yellow-400 border border-[#8c501c] rounded font-mono text-xs font-bold transition-colors ml-auto"
          >
            ✕ CERRAR
          </button>
        </div>

        {/* Level & XP Gauge Card */}
        <div className="bg-[#170e06] p-3 sm:p-4 rounded-xl border-2 border-[#59300e] shadow-inner flex flex-col gap-2">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="font-arcade text-xs sm:text-sm text-yellow-300 font-bold">NIVEL {level}</span>
              <span className="text-[9px] px-2 py-0.5 bg-yellow-500/20 text-yellow-400 border border-yellow-400/40 rounded font-mono">
                {level < 5 ? 'Promesa' : level < 10 ? 'Profesional' : 'Leyenda'}
              </span>
            </div>
            <div className="flex items-center gap-1.5 bg-[#0e0804] px-2.5 py-1 rounded-lg border border-yellow-500/40">
              <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
              <span className="font-arcade text-[10px] sm:text-xs text-yellow-300 font-bold">
                {skillPoints} {skillPoints === 1 ? 'PUNTO' : 'PUNTOS'} DISP.
              </span>
            </div>
          </div>

          {/* XP Bar */}
          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-[9px] sm:text-[10px] text-amber-200/70">
              <span>EXPERIENCIA (XP)</span>
              <span>{xp} / {xpToNextLevel} XP</span>
            </div>
            <div className="w-full h-2.5 sm:h-3 bg-[#0e0804] rounded-full overflow-hidden border border-[#59300e]">
              <div
                className="h-full bg-gradient-to-r from-emerald-600 via-green-500 to-emerald-400 transition-all duration-300 shadow-[0_0_10px_rgba(34,197,94,0.7)]"
                style={{ width: `${xpProgress}%` }}
              />
            </div>
            <span className="text-[8.5px] sm:text-[9px] text-amber-300/60 italic mt-0.5">
              Ganas XP anotando goles, completando hat-tricks y ganando partidos de liga.
            </span>
          </div>
        </div>

        {/* 3 Skill Attribute Upgrades */}
        <div className="flex flex-col gap-2.5 sm:gap-3">
          {/* Skill 1: Velocidad Horizontal */}
          <div className="bg-[#170e06] p-3 rounded-xl border-2 border-[#59300e] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-inner">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-cyan-600 to-blue-700 border-2 border-cyan-300 flex items-center justify-center shrink-0 shadow">
                <Gauge className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-arcade text-[11px] sm:text-xs text-cyan-300 font-bold truncate">VELOCIDAD HORIZONTAL</span>
                <span className="text-[9px] sm:text-[10px] text-amber-200/70 truncate">Desplazamiento lateral en la cancha</span>
                {/* 10-level Pip Gauge */}
                <div className="flex gap-1 mt-1">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-2.5 sm:w-3.5 h-2 rounded-xs border ${
                        i < moveSpeedLevel
                          ? 'bg-cyan-400 border-cyan-200 shadow-[0_0_4px_rgba(6,182,212,0.8)]'
                          : 'bg-[#0e0804] border-[#442309]'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <button
              type="button"
              disabled={skillPoints <= 0 || moveSpeedLevel >= 10}
              onClick={() => handleUpgrade('moveSpeed')}
              className={`px-3 py-1.5 sm:py-2 rounded-lg font-arcade text-[10px] font-bold border-2 transition-all flex items-center justify-center gap-1.5 shrink-0 self-end sm:self-auto ${
                moveSpeedLevel >= 10
                  ? 'bg-[#1f1005] border-[#442309] text-gray-500 cursor-not-allowed'
                  : skillPoints > 0
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 active:scale-95 text-white border-cyan-300 shadow-md'
                  : 'bg-[#1f1005] border-[#442309] text-amber-200/40 cursor-not-allowed'
              }`}
            >
              {moveSpeedLevel >= 10 ? (
                <>
                  <Check className="w-3 h-3 text-green-400" /> MAX
                </>
              ) : (
                <>
                  <ArrowUpCircle className="w-3.5 h-3.5" /> +1 MEJORAR
                </>
              )}
            </button>
          </div>

          {/* Skill 2: Velocidad de Chute */}
          <div className="bg-[#170e06] p-3 rounded-xl border-2 border-[#59300e] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-inner">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-amber-600 to-orange-700 border-2 border-amber-300 flex items-center justify-center shrink-0 shadow">
                <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-arcade text-[11px] sm:text-xs text-amber-300 font-bold truncate">POTENCIA DE CHUTE</span>
                <span className="text-[9px] sm:text-[10px] text-amber-200/70 truncate">Velocidad del balón hacia el arco</span>
                {/* 10-level Pip Gauge */}
                <div className="flex gap-1 mt-1">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-2.5 sm:w-3.5 h-2 rounded-xs border ${
                        i < shotVelocityLevel
                          ? 'bg-amber-400 border-amber-200 shadow-[0_0_4px_rgba(245,158,11,0.8)]'
                          : 'bg-[#0e0804] border-[#442309]'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <button
              type="button"
              disabled={skillPoints <= 0 || shotVelocityLevel >= 10}
              onClick={() => handleUpgrade('shotVelocity')}
              className={`px-3 py-1.5 sm:py-2 rounded-lg font-arcade text-[10px] font-bold border-2 transition-all flex items-center justify-center gap-1.5 shrink-0 self-end sm:self-auto ${
                shotVelocityLevel >= 10
                  ? 'bg-[#1f1005] border-[#442309] text-gray-500 cursor-not-allowed'
                  : skillPoints > 0
                  ? 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 active:scale-95 text-white border-amber-300 shadow-md'
                  : 'bg-[#1f1005] border-[#442309] text-amber-200/40 cursor-not-allowed'
              }`}
            >
              {shotVelocityLevel >= 10 ? (
                <>
                  <Check className="w-3 h-3 text-green-400" /> MAX
                </>
              ) : (
                <>
                  <ArrowUpCircle className="w-3.5 h-3.5" /> +1 MEJORAR
                </>
              )}
            </button>
          </div>

          {/* Skill 3: Frecuencia de Chute / Cadencia */}
          <div className="bg-[#170e06] p-3 rounded-xl border-2 border-[#59300e] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-inner">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-emerald-600 to-green-700 border-2 border-emerald-300 flex items-center justify-center shrink-0 shadow">
                <Timer className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-arcade text-[11px] sm:text-xs text-emerald-300 font-bold truncate">FRECUENCIA DE CHUTE</span>
                <span className="text-[9px] sm:text-[10px] text-amber-200/70 truncate">Reduce enfriamiento entre disparos</span>
                {/* 10-level Pip Gauge */}
                <div className="flex gap-1 mt-1">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-2.5 sm:w-3.5 h-2 rounded-xs border ${
                        i < fireRateLevel
                          ? 'bg-emerald-400 border-emerald-200 shadow-[0_0_4px_rgba(16,185,129,0.8)]'
                          : 'bg-[#0e0804] border-[#442309]'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <button
              type="button"
              disabled={skillPoints <= 0 || fireRateLevel >= 10}
              onClick={() => handleUpgrade('fireRate')}
              className={`px-3 py-1.5 sm:py-2 rounded-lg font-arcade text-[10px] font-bold border-2 transition-all flex items-center justify-center gap-1.5 shrink-0 self-end sm:self-auto ${
                fireRateLevel >= 10
                  ? 'bg-[#1f1005] border-[#442309] text-gray-500 cursor-not-allowed'
                  : skillPoints > 0
                  ? 'bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 active:scale-95 text-white border-emerald-300 shadow-md'
                  : 'bg-[#1f1005] border-[#442309] text-amber-200/40 cursor-not-allowed'
              }`}
            >
              {fireRateLevel >= 10 ? (
                <>
                  <Check className="w-3 h-3 text-green-400" /> MAX
                </>
              ) : (
                <>
                  <ArrowUpCircle className="w-3.5 h-3.5" /> +1 MEJORAR
                </>
              )}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-2 border-t-2 border-[#8c501c]/60">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white rounded-lg font-arcade text-xs font-bold border-2 border-green-300 shadow-md"
          >
            VOLVER AL HUB
          </button>
        </div>
      </div>
    </div>
  );
};
