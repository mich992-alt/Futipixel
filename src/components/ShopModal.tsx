import React, { useState } from 'react';
import { BallSkin, ShopItem } from '../types';
import { BALL_SKINS, SHOP_ITEMS } from '../utils/gameGenerators';
import { retroAudio } from '../audio/retroAudio';
import { ShoppingBag, Coins, Check, Lock, Sparkles } from 'lucide-react';

interface ShopModalProps {
  coins?: number;
  unlockedBallIds: string[];
  unlockedItemIds: string[];
  onBuyBall: (ball: BallSkin) => void;
  onBuyItem: (item: ShopItem) => void;
  onClose: () => void;
}

export const ShopModal: React.FC<ShopModalProps> = ({
  coins = 0,
  unlockedBallIds,
  unlockedItemIds,
  onBuyBall,
  onBuyItem,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'BALLS' | 'GEAR'>('BALLS');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-md animate-fadeIn font-mono">
      {/* 16-Bit Super Nintendo Ornate Wood Card */}
      <div className="w-full max-w-2xl bg-gradient-to-b from-[#2b1706] to-[#140b03] border-3 sm:border-4 border-[#8c501c] rounded-2xl p-4 sm:p-6 text-white shadow-[0_12px_40px_rgba(0,0,0,0.9),inset_0_2px_4px_rgba(255,255,255,0.15)] flex flex-col max-h-[92vh] overflow-y-auto">
        {/* Red Ribbon Top Header */}
        <div className="flex items-center justify-between border-b-2 border-[#8c501c]/60 pb-3 mb-3 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <div className="px-2.5 sm:px-3 py-1 bg-gradient-to-r from-red-700 via-red-600 to-red-700 text-yellow-300 border-2 border-yellow-500 rounded-md font-arcade text-[10px] sm:text-xs font-bold shadow-md tracking-wider flex items-center gap-1.5">
              <ShoppingBag className="w-3.5 h-3.5 text-yellow-300" />
              <span>TIENDA DE DESBLOQUEABLES</span>
            </div>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            {/* Coins Counter */}
            <div className="flex items-center gap-1 bg-[#0e0804] px-2.5 py-1 rounded-lg border-2 border-yellow-500/60 shadow">
              <Coins className="w-3.5 h-3.5 text-yellow-400" />
              <span className="font-arcade text-[10px] sm:text-xs text-yellow-300 font-bold">${coins.toLocaleString()}</span>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="px-2 py-1 bg-[#1a0f07] hover:bg-[#331c0c] text-yellow-400 border border-[#8c501c] rounded font-mono text-xs font-bold transition-colors"
            >
              ✕ CERRAR
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b-2 border-[#8c501c] mb-3 gap-1">
          <button
            type="button"
            onClick={() => {
              setActiveTab('BALLS');
              retroAudio.playClick();
            }}
            className={`flex-1 py-1.5 sm:py-2 font-arcade text-[10px] sm:text-xs rounded-t-lg transition-colors flex items-center justify-center gap-1.5 ${
              activeTab === 'BALLS'
                ? 'bg-[#3b200b] text-yellow-300 border-t-2 border-yellow-400 font-bold'
                : 'text-amber-200/60 hover:text-amber-100 bg-[#1e1005]'
            }`}
          >
            <span>⚽ BALONES</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('GEAR');
              retroAudio.playClick();
            }}
            className={`flex-1 py-1.5 sm:py-2 font-arcade text-[10px] sm:text-xs rounded-t-lg transition-colors flex items-center justify-center gap-1.5 ${
              activeTab === 'GEAR'
                ? 'bg-[#3b200b] text-yellow-300 border-t-2 border-yellow-400 font-bold'
                : 'text-amber-200/60 hover:text-amber-100 bg-[#1e1005]'
            }`}
          >
            <span>👟 BOTAS & GEAR</span>
          </button>
        </div>

        {/* Tab 1: Balls */}
        {activeTab === 'BALLS' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 overflow-y-auto max-h-[52vh] pr-1">
            {BALL_SKINS.map((ball) => {
              const isOwned = unlockedBallIds.includes(ball.id) || ball.price === 0;
              const canAfford = coins >= ball.price;

              return (
                <div
                  key={ball.id}
                  className={`p-2.5 sm:p-3 rounded-xl border-2 flex items-center justify-between gap-2.5 transition-all ${
                    isOwned
                      ? 'bg-[#170e06] border-green-600/60 shadow'
                      : 'bg-[#120a03] border-[#59300e]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    {/* Ball Preview Icon */}
                    <div
                      className="w-10 h-10 rounded-full border-2 border-white flex items-center justify-center shrink-0 shadow-lg"
                      style={{ backgroundColor: ball.primaryColor }}
                    >
                      <div
                        className="w-3.5 h-3.5 rounded-full"
                        style={{ backgroundColor: ball.secondaryColor }}
                      />
                    </div>

                    <div className="flex flex-col min-w-0 flex-1">
                      <span className="font-arcade text-[11px] sm:text-xs text-yellow-300 font-bold truncate">{ball.name}</span>
                      <span className="text-[8.5px] sm:text-[9px] text-amber-200/70 font-mono truncate">{ball.description}</span>
                      <span className="text-[9px] sm:text-[10px] text-yellow-400 font-arcade mt-0.5 font-bold truncate">
                        {ball.price === 0 ? 'GRATIS' : `$${ball.price.toLocaleString()}`}
                      </span>
                    </div>
                  </div>

                  {/* Buy / Owned Button */}
                  {isOwned ? (
                    <span className="px-2 py-1 bg-green-900/60 text-green-300 border border-green-500 rounded font-arcade text-[8.5px] font-bold flex items-center gap-1 shrink-0">
                      <Check className="w-3 h-3" /> OK
                    </span>
                  ) : (
                    <button
                      type="button"
                      disabled={!canAfford}
                      onClick={() => {
                        retroAudio.playTrophyUnlock();
                        onBuyBall(ball);
                      }}
                      className={`px-2.5 py-1 rounded-lg font-arcade text-[9px] font-bold border-2 transition-all flex items-center gap-1 shrink-0 ${
                        canAfford
                          ? 'bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 active:scale-95 text-white border-yellow-300 shadow-md'
                          : 'bg-[#1a0f07] border-[#442309] text-gray-500 cursor-not-allowed opacity-60'
                      }`}
                    >
                      <Coins className="w-3 h-3 text-yellow-300" /> COMPRAR
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Tab 2: Gear & Accessories */}
        {activeTab === 'GEAR' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 overflow-y-auto max-h-[52vh] pr-1">
            {SHOP_ITEMS.map((item) => {
              const isOwned = unlockedItemIds.includes(item.id);
              const canAfford = coins >= item.price;

              return (
                <div
                  key={item.id}
                  className={`p-2.5 sm:p-3 rounded-xl border-2 flex items-center justify-between gap-2.5 transition-all ${
                    isOwned
                      ? 'bg-[#170e06] border-green-600/60 shadow'
                      : 'bg-[#120a03] border-[#59300e]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <div className="w-10 h-10 rounded-xl bg-[#0e0804] border-2 border-[#59300e] flex items-center justify-center text-lg shrink-0 shadow">
                      {item.icon}
                    </div>

                    <div className="flex flex-col min-w-0 flex-1">
                      <span className="font-arcade text-[11px] sm:text-xs text-yellow-300 font-bold truncate">{item.name}</span>
                      <span className="text-[8.5px] sm:text-[9px] text-amber-200/70 font-mono truncate">{item.description}</span>
                      <span className="text-[9px] sm:text-[10px] text-yellow-400 font-arcade mt-0.5 font-bold truncate">
                        ${item.price.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {isOwned ? (
                    <span className="px-2 py-1 bg-green-900/60 text-green-300 border border-green-500 rounded font-arcade text-[8.5px] font-bold flex items-center gap-1 shrink-0">
                      <Check className="w-3 h-3" /> OK
                    </span>
                  ) : (
                    <button
                      type="button"
                      disabled={!canAfford}
                      onClick={() => {
                        retroAudio.playTrophyUnlock();
                        onBuyItem(item);
                      }}
                      className={`px-2.5 py-1 rounded-lg font-arcade text-[9px] font-bold border-2 transition-all flex items-center gap-1 shrink-0 ${
                        canAfford
                          ? 'bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 active:scale-95 text-white border-yellow-300 shadow-md'
                          : 'bg-[#1a0f07] border-[#442309] text-gray-500 cursor-not-allowed opacity-60'
                      }`}
                    >
                      <Coins className="w-3 h-3 text-yellow-300" /> COMPRAR
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-end pt-3 border-t-2 border-[#8c501c]/60 mt-3">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white rounded-lg font-arcade text-xs font-bold border-2 border-green-300 shadow-md"
          >
            VOLVER AL HUB
          </button>
        </div>
      </div>
    </div>
  );
};
