import React, { useState, useMemo } from 'react';
import { FanSocialPost, RivalTeam } from '../types';
import { generateFanSocialPosts } from '../utils/gameGenerators';
import { retroAudio } from '../audio/retroAudio';
import { Trophy, ArrowRight, Coins, Zap, MessageSquare, Flame, Sparkles, Heart, Repeat } from 'lucide-react';

interface MatchEndModalProps {
  playerScore: number;
  rivalScore: number;
  pointsEarned?: number;
  coinsEarned?: number;
  xpEarned?: number;
  streakBonus?: number;
  playerName?: string;
  isRepechaje?: boolean;
  repechajeSuccess?: boolean;
  rivalTeam: RivalTeam;
  isSeasonEnd: boolean;
  onContinue: () => void;
}

export const MatchEndModal: React.FC<MatchEndModalProps> = ({
  playerScore,
  rivalScore,
  pointsEarned = 0,
  coinsEarned = 0,
  xpEarned = 0,
  streakBonus = 1,
  playerName = 'MATADOR',
  isRepechaje = false,
  repechajeSuccess = false,
  rivalTeam,
  isSeasonEnd,
  onContinue,
}) => {
  const [activeTab, setActiveTab] = useState<'SUMMARY' | 'SOCIAL_FEED'>('SUMMARY');

  let isWin = playerScore > rivalScore;
  let isDraw = playerScore === rivalScore;
  let resultTitle = '¡VICTORIA ÉPICA!';
  let resultColor = 'text-emerald-400';
  let badgeBg = 'bg-emerald-600';

  if (isRepechaje) {
    if (repechajeSuccess) {
      resultTitle = '¡SALVAJADA! ¡PERMANENCIA LOGRADA!';
      resultColor = 'text-emerald-400';
      badgeBg = 'bg-emerald-600';
    } else {
      resultTitle = 'DESCENSO CONSUMADO';
      resultColor = 'text-red-500';
      badgeBg = 'bg-red-600';
    }
  } else if (isDraw) {
    resultTitle = 'EMPATE PELEADO';
    resultColor = 'text-amber-400';
    badgeBg = 'bg-amber-600';
  } else if (!isWin) {
    resultTitle = 'DERROTA DOLOROSA';
    resultColor = 'text-red-400';
    badgeBg = 'bg-red-600';
  }

  // Generate humorous post-match tweets & fan comments (STABLE memoized, no shuffle jitter!)
  const fanPosts = useMemo<FanSocialPost[]>(() => {
    return generateFanSocialPosts(
      playerName,
      rivalTeam.name,
      playerScore,
      rivalScore,
      playerScore >= 3
    );
  }, [playerName, rivalTeam.name, playerScore, rivalScore]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md animate-fadeIn font-mono">
      {/* 16-Bit Super Nintendo Ornate Wood Card */}
      <div className="w-full max-w-xl bg-gradient-to-b from-[#2b1706] to-[#140b03] border-4 border-[#8c501c] rounded-2xl p-5 sm:p-6 text-white shadow-[0_12px_40px_rgba(0,0,0,0.9),inset_0_2px_4px_rgba(255,255,255,0.15)] flex flex-col items-center text-center max-h-[92vh] overflow-y-auto">
        {/* Red Ribbon Top Result Badge */}
        <div className="px-4 py-1 bg-gradient-to-r from-red-700 via-red-600 to-red-700 text-yellow-300 border-2 border-yellow-500 rounded-md font-arcade text-xs font-bold shadow-md tracking-wider mb-2 uppercase">
          PITIDO FINAL • 90 MINUTOS
        </div>

        <h2 className={`font-arcade text-lg sm:text-xl font-bold ${resultColor} mb-3 tracking-wide`}>
          {resultTitle}
        </h2>

        {/* Tab Switcher: Match Summary vs Fan Feed */}
        <div className="flex w-full border-b-2 border-[#8c501c] mb-4 gap-1">
          <button
            type="button"
            onClick={() => {
              setActiveTab('SUMMARY');
              retroAudio.playClick();
            }}
            className={`flex-1 py-2 font-arcade text-[10px] sm:text-xs rounded-t-lg transition-colors flex items-center justify-center gap-1.5 ${
              activeTab === 'SUMMARY'
                ? 'bg-[#3b200b] text-yellow-300 border-t-2 border-yellow-400 font-bold'
                : 'text-amber-200/60 hover:text-amber-100 bg-[#1e1005]'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" /> RESUMEN & RECOMPENSAS
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('SOCIAL_FEED');
              retroAudio.playClick();
            }}
            className={`flex-1 py-2 font-arcade text-[10px] sm:text-xs rounded-t-lg transition-colors flex items-center justify-center gap-1.5 ${
              activeTab === 'SOCIAL_FEED'
                ? 'bg-[#3b200b] text-yellow-300 border-t-2 border-yellow-400 font-bold'
                : 'text-amber-200/60 hover:text-amber-100 bg-[#1e1005]'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-cyan-400" /> FEED DE FANÁTICOS ({fanPosts.length})
          </button>
        </div>

        {/* TAB 1: Match Score & Economy Breakdown */}
        {activeTab === 'SUMMARY' && (
          <div className="w-full flex flex-col gap-3">
            {/* Final Scoreboard Box */}
            <div className="w-full bg-[#170e06] p-4 rounded-xl border-2 border-[#59300e] shadow-inner">
              <div className="flex items-center justify-between font-mono text-[10px] text-amber-300/80 uppercase font-bold tracking-wider mb-1">
                <span>{playerName} (TÚ)</span>
                <span className="text-yellow-500 font-arcade">VS</span>
                <span className="break-words max-w-[200px] text-right font-semibold">{rivalTeam.name}</span>
              </div>

              <div className="font-arcade text-3xl sm:text-4xl font-black text-white flex items-center justify-center gap-4 my-2">
                <span className="text-emerald-400 drop-shadow-[0_2px_8px_rgba(52,211,153,0.5)]">{playerScore}</span>
                <span className="text-amber-700">-</span>
                <span className="text-red-400 drop-shadow-[0_2px_8px_rgba(248,113,113,0.5)]">{rivalScore}</span>
              </div>

              <div className="text-xs text-amber-200 font-mono mt-1">
                {isRepechaje ? (
                  repechajeSuccess ? (
                    <span className="text-emerald-400 font-arcade text-[10px]">
                      ✓ Cumpliste la cuota de permanencia.
                    </span>
                  ) : (
                    <span className="text-red-400 font-arcade text-[10px]">
                      ✗ No alcanzaste la cuota. Desciendes a la división inferior.
                    </span>
                  )
                ) : isWin ? (
                  <span className="text-emerald-400 font-arcade text-[10px]">
                    +3 Puntos sumados en la tabla clasificatoria
                  </span>
                ) : isDraw ? (
                  <span className="text-yellow-400 font-arcade text-[10px]">
                    +1 Punto sumado en la tabla clasificatoria
                  </span>
                ) : (
                  <span className="text-red-400 font-arcade text-[10px]">
                    0 Puntos. Derrota dolorosa.
                  </span>
                )}
              </div>
            </div>

            {/* Economy & XP Earnings Breakdown */}
            <div className="grid grid-cols-2 gap-2.5">
              {/* Coins Earned */}
              <div className="bg-[#170e06] p-3 rounded-xl border-2 border-yellow-600/50 shadow-inner flex flex-col items-center">
                <div className="flex items-center gap-1 text-yellow-400 mb-1">
                  <Coins className="w-4 h-4" />
                  <span className="font-arcade text-[10px] font-bold">MONEDAS GANADAS</span>
                </div>
                <span className="font-arcade text-lg sm:text-xl text-yellow-300 font-black">
                  +${coinsEarned.toLocaleString()}
                </span>
                {streakBonus > 1 && (
                  <span className="text-[9px] font-arcade text-amber-400 flex items-center gap-1 mt-0.5">
                    <Flame className="w-3 h-3 text-orange-500" /> Multiplicador {streakBonus}x
                  </span>
                )}
              </div>

              {/* XP Earned */}
              <div className="bg-[#170e06] p-3 rounded-xl border-2 border-green-600/50 shadow-inner flex flex-col items-center">
                <div className="flex items-center gap-1 text-emerald-400 mb-1">
                  <Zap className="w-4 h-4" />
                  <span className="font-arcade text-[10px] font-bold">EXPERIENCIA</span>
                </div>
                <span className="font-arcade text-lg sm:text-xl text-emerald-300 font-black">
                  +{xpEarned} XP
                </span>
                <span className="text-[9px] font-mono text-amber-200/70 mt-0.5">
                  Para subir nivel & RPG
                </span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Fan Social Media Feed */}
        {activeTab === 'SOCIAL_FEED' && (
          <div className="w-full flex flex-col gap-2.5 overflow-y-auto max-h-[50vh] pr-1 text-left">
            <span className="font-arcade text-[9px] text-yellow-300 uppercase tracking-widest text-center block mb-1">
              REACCIONES EN TIEMPO REAL TRAS EL PARTIDO
            </span>
            {fanPosts.map((post) => (
              <div
                key={post.id}
                className="bg-[#170e06] p-3 rounded-xl border-2 border-[#59300e] shadow flex flex-col gap-1.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg bg-[#0e0804] p-1 rounded-full border border-[#442309]">{post.avatar}</span>
                    <div className="flex flex-col">
                      <span className="font-arcade text-[10px] text-yellow-300 font-bold">{post.username}</span>
                      <span className="font-mono text-[9px] text-gray-400">{post.handle}</span>
                    </div>
                  </div>
                  <span className="text-[9px] font-mono text-amber-400/80">hace 2 min</span>
                </div>

                <p className="text-xs text-amber-100 font-sans leading-relaxed pl-1">{post.text}</p>

                <div className="flex items-center gap-4 text-[10px] font-mono text-amber-300/60 pt-1 border-t border-[#331c0c]">
                  <span className="flex items-center gap-1 hover:text-red-400 cursor-pointer">
                    <Heart className="w-3 h-3 text-red-400" /> {post.likes}
                  </span>
                  <span className="flex items-center gap-1 hover:text-green-400 cursor-pointer">
                    <Repeat className="w-3 h-3 text-green-400" /> {post.retweets}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Continue Action Button */}
        <button
          type="button"
          id="btn-match-continue"
          onClick={() => {
            retroAudio.playClick();
            onContinue();
          }}
          className="w-full mt-4 py-3.5 bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-600 hover:from-emerald-500 hover:to-green-500 active:scale-95 text-white rounded-xl font-arcade text-xs sm:text-sm font-bold shadow-2xl border-2 border-green-300 flex items-center justify-center gap-2 transition-all tracking-wider"
        >
          <span>{isSeasonEnd ? 'VER BALANCE DE TEMPORADA' : 'VOLVER AL CUARTEL GENERAL'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
