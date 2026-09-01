import React from 'react';
import { DivisionInfo, PlayerCustomization, RivalTeam } from '../types';
import { Volume2, VolumeX, Pause, Zap, Maximize2, Minimize2, Coins, Flame, Timer, ShieldAlert } from 'lucide-react';
import { retroAudio } from '../audio/retroAudio';

interface ScoreBoardProps {
  playerScore: number;
  rivalScore: number;
  matchTimeRemaining: number;
  isRepechaje?: boolean;
  isOvertime?: boolean;
  overtimePeriodIndex?: number;
  repechajeTargetGoals?: number;
  division: DivisionInfo;
  playerCustom: PlayerCustomization;
  rivalTeam: RivalTeam;
  playerAge: number;
  currentSeason: number;
  currentMatchNumber: number;
  superCharge: number;
  rivalPressure?: number;
  shootingClock?: number;
  shootingClockMax?: number;
  isMuted: boolean;
  coins?: number;
  isFullscreen?: boolean;
  onToggleMute: () => void;
  onPause: () => void;
  onToggleFullscreen?: () => void;
}

export const ScoreBoard: React.FC<ScoreBoardProps> = ({
  playerScore,
  rivalScore,
  matchTimeRemaining,
  isRepechaje = false,
  isOvertime = false,
  overtimePeriodIndex = 0,
  repechajeTargetGoals = 3,
  division,
  playerCustom,
  rivalTeam,
  playerAge,
  currentSeason,
  currentMatchNumber,
  superCharge,
  rivalPressure = 0,
  shootingClock = 16,
  shootingClockMax = 16,
  isMuted,
  coins = 0,
  isFullscreen = false,
  onToggleMute,
  onPause,
  onToggleFullscreen,
}) => {
  // Format seconds to mm:ss
  const minutes = Math.floor(matchTimeRemaining / 60);
  const seconds = Math.floor(matchTimeRemaining % 60);
  const timeFormatted = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  // Determinación de color dinámico para la barra de presión rival (Azul -> Amarillo -> Naranja -> Rojo)
  const getPressureColor = (val: number) => {
    if (val < 25) return 'from-blue-600 to-cyan-400';
    if (val < 50) return 'from-cyan-500 to-yellow-400';
    if (val < 75) return 'from-yellow-500 to-orange-500';
    return 'from-orange-500 to-red-600 shadow-[0_0_8px_rgba(239,68,68,0.8)]';
  };

  return (
    <div
      id="retro-scoreboard-hud"
      className="w-full max-w-4xl mx-auto bg-gradient-to-b from-[#2b1706] to-[#140b03] border-4 border-[#8c501c] rounded-xl p-2.5 sm:p-3.5 text-white shadow-[0_8px_30px_rgba(0,0,0,0.8)] flex flex-col gap-2 font-mono"
    >
      {/* Top Bar: Division, Season, Age & Utility Buttons */}
      <div className="flex items-center justify-between text-xs sm:text-sm border-b-2 border-[#8c501c]/50 pb-2">
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="flex flex-col">
            <span className="text-[8px] sm:text-[9px] text-amber-200/70 uppercase tracking-widest font-bold">DIVISIÓN</span>
            <span
              className="font-arcade text-[10px] sm:text-xs font-bold uppercase tracking-wider text-yellow-400 truncate max-w-[140px] sm:max-w-none"
              style={{ color: division.tierColor || '#facc15' }}
            >
              {division.name}
            </span>
          </div>

          <div className="flex flex-col border-l border-[#8c501c]/60 pl-2 sm:pl-4">
            <span className="text-[8px] sm:text-[9px] text-amber-200/70 uppercase tracking-widest font-bold">CALENDARIO</span>
            <span className="font-arcade text-[10px] sm:text-xs font-bold text-cyan-300">
              T.{currentSeason.toString().padStart(2, '0')} • FECHA {currentMatchNumber}/7
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {coins !== undefined && (
            <div className="hidden sm:flex items-center gap-1 bg-[#0e0804] px-2.5 py-0.5 rounded border border-yellow-500/40">
              <Coins className="w-3.5 h-3.5 text-yellow-400" />
              <span className="font-arcade text-[10px] text-yellow-300 font-bold">${coins.toLocaleString()}</span>
            </div>
          )}

          <div className="hidden sm:flex flex-col items-end border-l border-[#8c501c]/60 pl-2">
            <span className="text-[8px] text-amber-200/70 uppercase tracking-widest font-bold">EDAD</span>
            <span className="text-white font-mono text-xs font-bold">{playerAge} AÑOS</span>
          </div>

          <div className="flex items-center gap-1.5 border-l border-[#8c501c]/60 pl-2 sm:pl-3">
            {onToggleFullscreen && (
              <button
                type="button"
                id="btn-fullscreen-match"
                onClick={() => {
                  onToggleFullscreen();
                  retroAudio.playClick();
                }}
                className={`p-1.5 rounded border active:scale-95 transition-colors ${
                  isFullscreen
                    ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50'
                    : 'bg-[#1a0f07] hover:bg-[#331c0c] text-amber-200 border-[#8c501c]'
                }`}
                title={isFullscreen ? 'Salir de pantalla completa' : 'Modo móvil / Pantalla completa'}
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            )}

            <button
              type="button"
              id="btn-sound-toggle"
              onClick={() => {
                onToggleMute();
                retroAudio.playClick();
              }}
              className="p-1.5 bg-[#1a0f07] hover:bg-[#331c0c] active:scale-95 rounded border border-[#8c501c] text-amber-200 transition-colors"
              title={isMuted ? 'Activar sonido' : 'Silenciar'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            </button>

            <button
              type="button"
              id="btn-pause-game"
              onClick={() => {
                onPause();
                retroAudio.playClick();
              }}
              className="p-1.5 bg-[#1a0f07] hover:bg-[#331c0c] active:scale-95 rounded border border-[#8c501c] text-amber-200 transition-colors"
              title="Pausa"
            >
              <Pause className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Scoreboard: Teams, LED Clock & Score Display */}
      <div className="grid grid-cols-3 items-center gap-2 bg-[#170e06] p-2.5 sm:p-3 rounded-lg border-2 border-[#59300e] shadow-inner">
        {/* Left: Player Team */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div
            className="w-9 h-9 sm:w-11 sm:h-11 rounded border-2 border-yellow-500/60 flex items-center justify-center font-arcade text-xs font-bold shadow-lg shrink-0"
            style={{ backgroundColor: playerCustom.shirtColor, color: '#ffffff' }}
          >
            #{playerCustom.number}
          </div>
          <div className="flex flex-col truncate">
            <span className="font-arcade text-xs sm:text-sm font-bold text-yellow-300 truncate">
              {playerCustom.name}
            </span>
            <span className="text-[9px] text-amber-200/60 font-mono hidden sm:block uppercase tracking-wider">LOCAL</span>
          </div>
        </div>

        {/* Center: Glowing LED Digital Match Timer & Score */}
        <div className="flex flex-col items-center justify-center">
          {/* Match Clock with Elegant Dark neon red glow */}
          <div className="flex items-center gap-2 bg-[#0e0804] px-3.5 py-0.5 rounded border border-[#59300e] shadow-inner">
            <span
              className={`font-mono text-xl sm:text-2xl font-black ${
                isRepechaje || isOvertime ? 'text-amber-400 animate-pulse' : 'text-red-500'
              }`}
              style={{ textShadow: '0 0 10px rgba(239, 68, 68, 0.7)' }}
            >
              {timeFormatted}
            </span>
          </div>
          <span className="text-[8px] text-amber-200/70 mt-0.5 uppercase tracking-widest font-bold">
            {isOvertime
              ? `PRÓRROGA • BLOQUE +${overtimePeriodIndex}`
              : isRepechaje
              ? 'REPECHAJE DE PERMANENCIA'
              : 'TIEMPO OFICIAL'}
          </span>

          {/* Goals Display */}
          <div className="flex items-center gap-3 mt-0.5 font-arcade text-base sm:text-xl font-black">
            <span className="text-emerald-400 drop-shadow">{playerScore}</span>
            <span className="text-amber-700">-</span>
            <span className="text-red-400 drop-shadow">{rivalScore}</span>
          </div>
        </div>

        {/* Right: Rival Club */}
        <div className="flex items-center justify-end gap-2 sm:gap-3 text-right">
          <div className="flex flex-col items-end truncate">
            <span className="font-arcade text-xs sm:text-sm font-bold text-red-300 truncate">
              {rivalTeam.name}
            </span>
            <span className="text-[9px] text-amber-200/60 font-mono hidden sm:block uppercase tracking-wider">
              {rivalTeam.formation} • {rivalTeam.rivalStarPlayer}
            </span>
          </div>
          <div
            className="w-9 h-9 sm:w-11 sm:h-11 rounded border-2 border-red-500/60 flex items-center justify-center font-arcade text-xs font-bold shadow-lg shrink-0"
            style={{ backgroundColor: rivalTeam.primaryColor, color: rivalTeam.secondaryColor }}
          >
            {rivalTeam.shortName}
          </div>
        </div>
      </div>

      {/* RIVAL PRESSURE & SHOOTING CLOCK HUD BARS (MATCH ENGINE v1.0) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-[#170e06] p-2 rounded-lg border border-[#59300e]">
        {/* Barra de Presión Rival (0-100) — Fina y no invasiva: Azul -> Amarillo -> Naranja -> Rojo */}
        <div className="flex items-center gap-2">
          <Flame className={`w-3.5 h-3.5 ${rivalPressure >= 60 ? 'text-red-400 animate-bounce' : 'text-cyan-400'}`} />
          <span className="text-[8px] font-arcade font-bold text-amber-200/80 shrink-0">PRESIÓN RIVAL</span>
          <div className="w-full bg-[#0e0804] h-2 rounded-full overflow-hidden p-0.5 border border-[#59300e]">
            <div
              className={`h-full rounded-full transition-all duration-300 bg-gradient-to-r ${getPressureColor(
                rivalPressure
              )}`}
              style={{ width: `${Math.min(100, Math.max(0, rivalPressure))}%` }}
            />
          </div>
          <span className="text-[8px] font-arcade text-yellow-300 font-bold min-w-[28px] text-right">
            {Math.round(rivalPressure)}%
          </span>
        </div>

        {/* Reloj de Tiro (Shooting Clock) — Cuenta regresiva hasta pérdida */}
        <div className="flex items-center gap-2">
          <Timer className={`w-3.5 h-3.5 ${shootingClock <= 4 ? 'text-red-400 animate-spin' : 'text-amber-400'}`} />
          <span className="text-[8px] font-arcade font-bold text-amber-200/80 shrink-0">RELOJ DE TIRO</span>
          <div className="w-full bg-[#0e0804] h-2 rounded-full overflow-hidden p-0.5 border border-[#59300e]">
            <div
              className={`h-full rounded-full transition-all duration-150 ${
                shootingClock <= 4 ? 'bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.9)]' : 'bg-amber-400'
              }`}
              style={{ width: `${Math.min(100, Math.max(0, (shootingClock / shootingClockMax) * 100))}%` }}
            />
          </div>
          <span
            className={`text-[8px] font-arcade font-bold min-w-[28px] text-right ${
              shootingClock <= 4 ? 'text-red-400 animate-pulse' : 'text-amber-300'
            }`}
          >
            {Math.max(0, Math.ceil(shootingClock))}s
          </span>
        </div>
      </div>

      {/* Bottom Bar: Super Shot Energy Bar & Tactical Multiplier Tips */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-0.5">
        {/* Super Shot Charge Gauge */}
        <div className="w-full sm:w-1/2 flex items-center gap-2 bg-[#170e06] px-3 py-1 rounded-lg border border-[#59300e]">
          <Zap className={`w-3.5 h-3.5 ${superCharge >= 50 ? 'text-amber-400 animate-bounce' : 'text-amber-200/40'}`} />
          <span className="text-[9px] font-arcade font-bold text-amber-200/80 shrink-0">SUPER TIRO</span>
          <div className="w-full bg-[#0e0804] h-2 rounded-full overflow-hidden p-0.5 border border-[#59300e]">
            <div
              className={`h-full rounded-full transition-all duration-200 ${
                superCharge >= 50
                  ? 'bg-gradient-to-r from-yellow-500 to-amber-300 shadow-[0_0_8px_rgba(234,179,8,0.7)]'
                  : 'bg-emerald-600'
              }`}
              style={{ width: `${superCharge}%` }}
            />
          </div>
          <span className="text-[9px] font-arcade text-yellow-400 font-bold min-w-[28px] text-right">
            {Math.round(superCharge)}%
          </span>
        </div>

        {/* Keyboard Helper / Controls Guide */}
        <div className="text-[9px] text-amber-200/70 font-mono hidden md:flex items-center gap-2">
          <span>MOVER: <strong className="text-cyan-300">A-D / ◀ ▶</strong></span>
          <span>•</span>
          <span>TIRO: <strong className="text-cyan-300">[SPACE]</strong></span>
          <span>•</span>
          <span>CURVO: <strong className="text-sky-300">[C / Q]</strong></span>
          <span>•</span>
          <span>SUPER: <strong className="text-yellow-300">[E / SHIFT]</strong></span>
        </div>
      </div>
    </div>
  );
};
