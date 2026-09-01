import React from 'react';
import { CareerStats, DivisionInfo, LeagueStanding, PlayerCustomization, RivalTeam } from '../types';
import { Trophy, Play, Palette, Award, Star, Flame, ShieldAlert, Zap, ShoppingBag, Coins, Sparkles, User } from 'lucide-react';
import { retroAudio } from '../audio/retroAudio';

interface CareerHubProps {
  careerStats: CareerStats;
  currentDivision: DivisionInfo;
  leagueStandings: LeagueStanding[];
  nextRival: RivalTeam;
  currentMatchNumber: number;
  playerCustom: PlayerCustomization;
  onStartMatch: () => void;
  onOpenCustomizer?: () => void;
  onOpenTrophies?: () => void;
  onOpenSkills?: () => void;
  onOpenShop?: () => void;
}

export const CareerHub: React.FC<CareerHubProps> = ({
  careerStats,
  currentDivision,
  leagueStandings,
  nextRival,
  currentMatchNumber,
  playerCustom,
  onStartMatch,
  onOpenCustomizer,
  onOpenTrophies,
  onOpenSkills,
  onOpenShop,
}) => {
  const playerStanding = leagueStandings.find((t) => t.isPlayerTeam);
  const playerRank = leagueStandings.findIndex((t) => t.isPlayerTeam) + 1;
  const isNearRelegation = playerRank >= 5 && currentDivision.id < 23;

  const coins = typeof careerStats?.coins === 'number' ? careerStats.coins : 0;
  const level = typeof careerStats?.level === 'number' ? careerStats.level : 1;
  const xp = typeof careerStats?.xp === 'number' ? careerStats.xp : 0;
  const xpToNextLevel = typeof careerStats?.xpToNextLevel === 'number' && careerStats.xpToNextLevel > 0 ? careerStats.xpToNextLevel : 300;
  const skillPoints = typeof careerStats?.skillPoints === 'number' ? careerStats.skillPoints : 0;
  const moveSpeedLevel = typeof careerStats?.moveSpeedLevel === 'number' ? careerStats.moveSpeedLevel : 1;
  const shotVelocityLevel = typeof careerStats?.shotVelocityLevel === 'number' ? careerStats.shotVelocityLevel : 1;
  const fireRateLevel = typeof careerStats?.fireRateLevel === 'number' ? careerStats.fireRateLevel : 1;
  const trophies = Array.isArray(careerStats?.trophies) ? careerStats.trophies : [];

  const xpProgress = Math.min(100, Math.round((xp / xpToNextLevel) * 100));

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-4 sm:gap-5 text-white animate-fadeIn pb-6 font-mono">
      {/* 16-Bit Super Nintendo Wood & Red Ribbon Top Banner */}
      <div className="bg-gradient-to-b from-[#2b1706] to-[#140b03] border-4 border-[#8c501c] rounded-2xl p-4 sm:p-5 shadow-[0_12px_40px_rgba(0,0,0,0.9),inset_0_2px_4px_rgba(255,255,255,0.15)] relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
              {/* Red Ribbon Division Badge */}
              <div
                className="px-3 py-0.5 bg-gradient-to-r from-red-700 via-red-600 to-red-700 text-yellow-300 border-2 border-yellow-500 rounded font-arcade text-[10px] sm:text-xs font-bold shadow-md uppercase tracking-wider"
              >
                {currentDivision.name}
              </div>
              <span className="text-[10px] text-amber-300/80 font-mono uppercase tracking-widest font-bold">
                TEMPORADA {(careerStats?.currentSeason || 1).toString().padStart(2, '0')} • DIVISIÓN #{currentDivision.id}
              </span>
            </div>
            <h1 className="font-arcade text-base sm:text-xl text-yellow-400 font-bold tracking-wide drop-shadow">
              CUARTEL GENERAL: MODO CARRERA 16-BIT
            </h1>
            <p className="text-[11px] text-amber-200/70 font-mono mt-1 max-w-xl">
              {currentDivision.description}
            </p>
          </div>

          {/* Hub Navigation Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* RPG Skills Button */}
            <button
              type="button"
              id="btn-nav-skills"
              onClick={() => {
                retroAudio.playClick();
                onOpenSkills?.();
              }}
              className="px-3 py-2 bg-[#1f1005] hover:bg-[#331c0c] active:scale-95 text-white rounded-lg border-2 border-cyan-500/60 font-arcade text-[11px] flex items-center gap-1.5 transition-all shadow-md relative"
            >
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              <span>HABILIDADES (LV.{level})</span>
              {skillPoints > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white text-[9px] font-arcade px-1.5 py-0.2 rounded-full border border-yellow-300 animate-bounce">
                  +{skillPoints}
                </span>
              )}
            </button>

            {/* Shop Button */}
            <button
              type="button"
              id="btn-nav-shop"
              onClick={() => {
                retroAudio.playClick();
                onOpenShop?.();
              }}
              className="px-3 py-2 bg-[#1f1005] hover:bg-[#331c0c] active:scale-95 text-white rounded-lg border-2 border-yellow-500/60 font-arcade text-[11px] flex items-center gap-1.5 transition-all shadow-md"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-yellow-400" />
              <span>TIENDA (${coins.toLocaleString()})</span>
            </button>

            {/* Customizer Vestuario */}
            <button
              type="button"
              id="btn-nav-customizer"
              onClick={() => {
                retroAudio.playClick();
                onOpenCustomizer?.();
              }}
              className="px-3 py-2 bg-[#1f1005] hover:bg-[#331c0c] active:scale-95 text-white rounded-lg border-2 border-[#8c501c] font-arcade text-[11px] flex items-center gap-1.5 transition-all shadow-md"
            >
              <Palette className="w-3.5 h-3.5 text-pink-400" />
              <span>VESTUARIO</span>
            </button>

            {/* Trophy Cabinet */}
            <button
              type="button"
              id="btn-nav-trophies"
              onClick={() => {
                retroAudio.playClick();
                onOpenTrophies?.();
              }}
              className="px-3 py-2 bg-[#1f1005] hover:bg-[#331c0c] active:scale-95 text-white rounded-lg border-2 border-yellow-600/70 font-arcade text-[11px] flex items-center gap-1.5 transition-all shadow-md"
            >
              <Trophy className="w-3.5 h-3.5 text-yellow-400" />
              <span>VITRINA</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main 3-Column Dashboard Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5">
        {/* Left Column: Player Card & RPG Status (3 Cols) */}
        <div className="lg:col-span-3 flex flex-col gap-3.5">
          {/* Player Card Preview */}
          <div className="bg-gradient-to-b from-[#2b1706] to-[#140b03] border-4 border-[#8c501c] p-4 rounded-xl flex flex-col gap-3 shadow-xl">
            <div className="flex items-center justify-between border-b border-[#8c501c]/50 pb-2">
              <span className="text-[10px] text-amber-300/80 uppercase font-bold tracking-widest flex items-center gap-1">
                <User className="w-3 h-3 text-yellow-400" /> FICHA DEL ATACANTE
              </span>
              <button
                type="button"
                onClick={() => onOpenCustomizer?.()}
                className="text-[9px] font-mono text-cyan-400 hover:underline font-bold"
              >
                EDITAR
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-lg border-2 border-yellow-500/60 flex items-center justify-center font-arcade text-sm font-bold shadow shrink-0"
                style={{ backgroundColor: playerCustom.shirtColor }}
              >
                #{playerCustom.number}
              </div>
              <div className="flex flex-col truncate">
                <span className="font-arcade text-xs text-yellow-300 font-bold truncate">{playerCustom.name}</span>
                <span className="text-[10px] text-amber-200/70 font-mono">Dorsal #{playerCustom.number}</span>
                <span className="text-[9px] text-emerald-400 font-arcade mt-0.5">NIVEL {level} • {coins.toLocaleString()} $</span>
              </div>
            </div>

            {/* RPG Skill Overview */}
            <div className="bg-[#120a03] p-2.5 rounded-lg border border-[#59300e] flex flex-col gap-1.5 text-[10px]">
              <div className="flex justify-between items-center">
                <span className="text-cyan-300">Velocidad Horiz.</span>
                <span className="font-arcade text-white font-bold">Nv.{moveSpeedLevel}/10</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-amber-300">Potencia Chute</span>
                <span className="font-arcade text-white font-bold">Nv.{shotVelocityLevel}/10</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-emerald-300">Frecuencia Chute</span>
                <span className="font-arcade text-white font-bold">Nv.{fireRateLevel}/10</span>
              </div>
            </div>
          </div>

          {/* XP Progress Box */}
          <div className="bg-gradient-to-b from-[#2b1706] to-[#140b03] border-4 border-[#8c501c] p-3.5 rounded-xl shadow-xl flex flex-col gap-2">
            <div className="flex justify-between text-[10px] text-amber-300/80 font-bold uppercase">
              <span>EXPERIENCIA (XP)</span>
              <span>{xp}/{xpToNextLevel}</span>
            </div>
            <div className="w-full bg-[#0e0804] h-2.5 rounded-full overflow-hidden border border-[#59300e]">
              <div
                className="bg-gradient-to-r from-emerald-600 to-green-400 h-full rounded-full transition-all duration-300 shadow-[0_0_6px_rgba(34,197,94,0.6)]"
                style={{ width: `${xpProgress}%` }}
              />
            </div>
            <span className="text-[9px] text-amber-200/60 italic">
              Goles anotados: {careerStats?.totalGoals || 0} • Hat-tricks: {careerStats?.hatTricks || 0}
            </span>
          </div>

          {/* Quick Trophy Shelf */}
          <div className="bg-gradient-to-b from-[#2b1706] to-[#140b03] border-4 border-[#8c501c] p-3.5 rounded-xl flex flex-col gap-2.5 shadow-xl">
            <div className="flex items-center justify-between border-b border-[#8c501c]/50 pb-1.5">
              <span className="text-[10px] text-amber-300/80 uppercase font-bold tracking-widest">VITRINA DE TROFEOS</span>
              <button
                type="button"
                onClick={() => onOpenTrophies?.()}
                className="text-[9px] font-mono text-cyan-400 hover:underline font-bold"
              >
                VER ({trophies.filter((t) => t.unlocked).length}/{trophies.length})
              </button>
            </div>

            <div className="grid grid-cols-3 gap-1.5">
              {trophies.slice(0, 6).map((trophy) => (
                <div
                  key={trophy.id}
                  title={trophy.name + ': ' + trophy.description}
                  className={`aspect-square rounded border flex items-center justify-center text-base transition-all ${
                    trophy.unlocked
                      ? 'bg-[#1a0f07] border-yellow-500 shadow-[0_0_8px_rgba(202,138,4,0.3)]'
                      : 'bg-[#120a03] border-[#442309] grayscale opacity-40'
                  }`}
                >
                  {trophy.icon}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Center Hero: Next Matchup & Play Game (6 Cols) */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          <div className="bg-gradient-to-b from-[#2b1706] to-[#140b03] border-4 border-[#8c501c] rounded-2xl p-4 sm:p-5 shadow-2xl flex flex-col justify-between flex-1">
            <div>
              <div className="flex items-center justify-between border-b-2 border-[#8c501c]/50 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span className="font-arcade text-xs text-yellow-400 font-bold">PRÓXIMO PARTIDO OFICIAL</span>
                </div>
                <span className="font-mono text-[10px] text-amber-300/80 font-bold uppercase tracking-widest">
                  FECHA {currentMatchNumber} DE 7
                </span>
              </div>

              {/* Matchup Banner */}
              <div className="grid grid-cols-5 items-center gap-2 bg-[#170e06] p-4 rounded-xl border-2 border-[#59300e] mb-4 shadow-inner">
                {/* Home Player */}
                <div className="col-span-2 flex flex-col items-center text-center px-1">
                  <div
                    className="w-14 h-14 rounded-xl border-2 border-yellow-500/60 flex items-center justify-center font-arcade text-sm font-bold shadow-lg mb-2"
                    style={{ backgroundColor: playerCustom.shirtColor }}
                  >
                    #{playerCustom.number}
                  </div>
                  <span className="font-arcade text-xs text-yellow-300 font-bold break-words text-center">
                    {playerCustom.name}
                  </span>
                  <span className="text-[9px] text-amber-200/60 font-mono uppercase tracking-widest mt-0.5">LOCAL</span>
                </div>

                {/* VS Center Badge */}
                <div className="col-span-1 flex flex-col items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-[#0e0804] border-2 border-yellow-500/60 flex items-center justify-center font-arcade text-xs text-yellow-400 font-bold shadow">
                    VS
                  </div>
                  <span className="text-[9px] font-mono text-amber-300/60 mt-1 uppercase font-bold">90s</span>
                </div>

                {/* Away Rival Club */}
                <div className="col-span-2 flex flex-col items-center text-center px-1">
                  <div
                    className="w-14 h-14 rounded-xl border-2 border-red-500/60 flex items-center justify-center font-arcade text-xs font-bold shadow-lg mb-2 text-center"
                    style={{ backgroundColor: nextRival.primaryColor, color: nextRival.secondaryColor }}
                  >
                    {nextRival.shortName}
                  </div>
                  <span className="font-arcade text-[11px] text-red-300 font-bold break-words text-center leading-tight">
                    {nextRival.name}
                  </span>
                  <span className="text-[9px] text-amber-200/60 font-mono uppercase tracking-widest mt-0.5">VISITANTE</span>
                </div>
              </div>

              {/* Rival Tactical Scouting */}
              <div className="bg-[#170e06] p-3.5 rounded-xl border-2 border-[#59300e] flex flex-col gap-2 mb-4 text-xs font-mono shadow-inner">
                <div className="flex items-center justify-between">
                  <span className="text-amber-200/70 text-[10px] uppercase tracking-widest font-bold">FORMACIÓN RIVAL:</span>
                  <span className="font-arcade text-yellow-400 font-bold text-[10px]">{nextRival.formation}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-amber-200/70 text-[10px] uppercase tracking-widest font-bold">ESTRELLA RIVAL:</span>
                  <span className="text-gray-200 font-bold text-[11px]">{nextRival.rivalStarPlayer}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-amber-200/70 text-[10px] uppercase tracking-widest font-bold">CUOTA OBJETIVO:</span>
                  <span className="text-emerald-400 font-bold text-[11px]">
                    +{nextRival.targetGoalsToWin} GOLES
                  </span>
                </div>
                <p className="text-[11px] text-amber-100/80 italic border-t border-[#331c0c] pt-2 mt-0.5 font-sans">
                  "{nextRival.tacticsDescription}"
                </p>
              </div>
            </div>

            {/* Big Launch Match Action Button */}
            <button
              type="button"
              id="btn-start-match-hero"
              onClick={() => {
                retroAudio.playWhistle(true);
                onStartMatch();
              }}
              className="w-full py-4 bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-600 hover:from-emerald-500 hover:to-green-500 active:scale-[0.98] text-white rounded-xl font-arcade text-xs sm:text-sm font-bold shadow-2xl border-2 border-green-300 flex items-center justify-center gap-3 transition-all tracking-wider"
            >
              <Play className="w-5 h-5 fill-white" />
              <span>SALTAR A LA CANCHA (JUGAR PARTIDO)</span>
            </button>
          </div>
        </div>

        {/* Right Column: League Standings Table (3 Cols) */}
        <div className="lg:col-span-3 flex flex-col gap-3.5">
          <div className="bg-gradient-to-b from-[#2b1706] to-[#140b03] border-4 border-[#8c501c] rounded-xl p-3.5 shadow-xl flex flex-col">
            <div className="flex items-center justify-between border-b-2 border-[#8c501c]/50 pb-2 mb-2.5">
              <div>
                <span className="text-[10px] text-amber-300/80 uppercase font-bold tracking-widest block">TABLA DE POSICIONES</span>
                <span className="text-[8px] text-amber-200/50 font-mono">8 CLUBES • 7 FECHAS</span>
              </div>
              <span className="text-[9px] font-mono text-amber-200/60">PJ / DIF / PTS</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="text-[9px] text-amber-200/70 border-b border-[#59300e]">
                    <th className="pb-1.5 font-bold w-6">#</th>
                    <th className="pb-1.5 font-bold">CLUB</th>
                    <th className="pb-1.5 text-center font-bold w-6">PJ</th>
                    <th className="pb-1.5 text-center font-bold w-7">DIF</th>
                    <th className="pb-1.5 text-right font-bold w-7">PTS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#331c0c]">
                  {leagueStandings.map((team, idx) => {
                    const pos = idx + 1;
                    const isPromotion = pos <= 2;
                    const isRelegation = pos >= 7 && currentDivision.id < 23;
                    const goalDiff = team.goalsFor - team.goalsAgainst;

                    return (
                      <tr
                        key={team.teamName}
                        className={`transition-colors ${
                          team.isPlayerTeam
                            ? 'bg-[#1e3a1e] font-bold text-green-300 border-l-2 border-l-green-400'
                            : 'hover:bg-[#1a0f07] text-amber-100/90'
                        }`}
                      >
                        <td className="py-2 pl-0.5 font-mono text-[10px]">
                          <span
                            className={`inline-block w-4 h-4 text-center leading-4 rounded text-[9px] font-bold ${
                              isPromotion
                                ? 'bg-green-900/70 text-green-300 border border-green-500/50'
                                : isRelegation
                                ? 'bg-red-900/70 text-red-300 border border-red-500/50'
                                : 'text-gray-400'
                            }`}
                          >
                            {pos}
                          </span>
                        </td>
                        <td className="py-2 font-mono text-[10px] pr-1 leading-snug font-semibold">
                          <span className={team.isPlayerTeam ? 'text-green-300 font-bold' : 'text-amber-100/90'}>
                            {team.teamName}
                          </span>
                        </td>
                        <td className="py-2 text-center text-amber-200/70 font-mono text-[10px]">{team.played}</td>
                        <td className="py-2 text-center font-mono text-[9px] text-amber-200/60">
                          {goalDiff > 0 ? `+${goalDiff}` : goalDiff}
                        </td>
                        <td className="py-2 text-right pr-0.5 font-arcade font-bold text-yellow-400 text-[10px]">
                          {team.points}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Division Legend */}
            <div className="mt-2 pt-2 border-t border-[#442309] flex items-center justify-between text-[8px] font-mono text-amber-200/60">
              <span className="flex items-center gap-1 text-green-400 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span> 1º y 2º: Ascenso (2)
              </span>
              <span className="flex items-center gap-1 text-red-400 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span> 7º y 8º: Descenso (2)
              </span>
            </div>
          </div>

          {/* Relegation Warning Box */}
          {isNearRelegation && (
            <div className="bg-red-950/60 border-2 border-red-700/80 p-3 rounded-xl shadow-lg">
              <h3 className="text-[11px] font-bold text-red-400 mb-1 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5" /> ALERTA DE DESCENSO
              </h3>
              <p className="text-[9px] leading-tight text-amber-100/90 font-mono">
                Estás en zona de peligro. Si quedas en los últimos puestos tendrás que disputar el Repechaje de 30 segundos.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
