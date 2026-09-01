import React, { useState, useEffect, useRef } from 'react';
import {
  BallSkin,
  CollarStyleType,
  HairStyleType,
  KitPatternType,
  PlayerCustomization
} from '../types';
import { BALL_SKINS } from '../utils/gameGenerators';
import { retroAudio } from '../audio/retroAudio';
import { renderProportionalCharacterSprite } from '../utils/pixelSpriteRenderer';
import {
  Sparkles,
  Check,
  Lock,
  Palette,
  User,
  Shirt,
  CircleDot,
  Eye,
  Sliders,
  Footprints
} from 'lucide-react';

interface CustomizerModalProps {
  customization?: PlayerCustomization;
  playerCustom?: PlayerCustomization;
  currentSeason?: number;
  coins?: number;
  unlockedItemIds?: string[];
  onSave?: (newCustom: PlayerCustomization) => void;
  onSaveCustomization?: (newCustom: PlayerCustomization) => void;
  onClose: () => void;
}

const DEFAULT_PLAYER_CUSTOMIZATION: PlayerCustomization = {
  name: 'MATADOR',
  number: 10,
  pattern: 'vertical_stripes',
  collarStyle: 'polo',
  collarColor: '#ffffff',
  shirtColor: '#ef4444',
  secondaryShirtColor: '#1e3a8a',
  shortsColor: '#ffffff',
  socksColor: '#ef4444',
  bootsColor: '#facc15',
  hairStyle: 'classic',
  hairColor: '#1c1917',
  skinTone: '#e2a878',
  ballId: 'ball-classic'
};

const PRESET_COLORS = [
  '#ef4444', // Red
  '#3b82f6', // Blue
  '#22c55e', // Green
  '#eab308', // Yellow
  '#a855f7', // Purple
  '#f97316', // Orange
  '#06b6d4', // Cyan
  '#ec4899', // Pink
  '#18181b', // Black
  '#ffffff', // White
  '#b45309', // Brown
  '#64748b'  // Slate
];

const SKIN_TONES = [
  '#fbcfe8', // Light Pink
  '#fde047', // Pale/Yellow
  '#e2a878', // Medium Tan
  '#a16207', // Warm Bronze
  '#78350f', // Dark Deep
  '#451a03'  // Ebony
];

const HAIR_STYLES: { id: HairStyleType; label: string; desc: string }[] = [
  { id: 'short', label: 'Clásico Tapered', desc: 'Corte moderno con degradado' },
  { id: 'afro', label: 'Afro 70s', desc: 'Volumen retro icónico' },
  { id: 'long', label: 'Melena Larga', desc: 'Estilo sudamericano 90s' },
  { id: 'braids', label: 'Trenzas con Cuentas', desc: 'Trenzas africanas con dorado' },
  { id: 'mohawk', label: 'Cresta Punk', desc: 'Rebeldía pura en la cancha' },
  { id: 'bald', label: 'Rapado Total', desc: 'Aerodinámica máxima' },
  { id: 'ponytail', label: 'Coleta Samurai', desc: 'Elegancia y visión de juego' },
  { id: 'mullet', label: 'Mullet 80s', desc: 'Clásico de época de oro' },
  { id: 'buzzcut', label: 'Militar', desc: 'Corte al ras disciplinado' },
  { id: 'fenomeno', label: 'R9 Flequillo', desc: 'Homenaje al Fenómeno 2002' },
  { id: 'dreadlocks', label: 'Dreadlocks Rasta', desc: 'Estilo rastafari con vincha' },
  { id: 'spiky', label: 'Spiky Anime', desc: 'Puntas anime super saiyajin' }
];

const KIT_PATTERNS: { id: KitPatternType; label: string; isRetro?: boolean }[] = [
  { id: 'solid', label: 'Sólido Clásico' },
  { id: 'vertical_stripes', label: 'Rayas Verticales' },
  { id: 'hoops', label: 'Horizontales (Hoops)' },
  { id: 'sash', label: 'Banda Diagonal' },
  { id: 'halves', label: 'Mitades (Halves)' },
  { id: 'sleeves_contrast', label: 'Mangas Contraste' },
  { id: 'diamonds', label: 'Rombos Diamante 90s', isRetro: true },
  { id: 'retro_wave', label: 'Olas / Zigzag 90s', isRetro: true },
  { id: 'gradient', label: 'Difuminado Maestro', isRetro: true },
  { id: 'flames', label: 'Llamas Ardientes', isRetro: true },
  { id: 'neon_glow', label: 'Armadura Neón', isRetro: true }
];

const COLLAR_STYLES: { id: CollarStyleType; label: string; desc: string }[] = [
  { id: 'round', label: 'Cuello Redondo', desc: 'Crew neck clásico elástico' },
  { id: 'v_neck', label: 'Cuello en V', desc: 'Escote en pico deportivo' },
  { id: 'polo', label: 'Cuello Tipo Polo', desc: 'Solapas abiertas desplegadas' }
];

export const CustomizerModal: React.FC<CustomizerModalProps> = ({
  customization,
  playerCustom,
  currentSeason = 1,
  coins = 0,
  unlockedItemIds = [],
  onSave,
  onSaveCustomization,
  onClose,
}) => {
  const base = customization || playerCustom || DEFAULT_PLAYER_CUSTOMIZATION;

  const [formData, setFormData] = useState<PlayerCustomization>({
    ...DEFAULT_PLAYER_CUSTOMIZATION,
    ...base,
    collarStyle: base?.collarStyle || 'round',
    collarColor: base?.collarColor || '#ffffff',
    pattern: base?.pattern || 'solid',
    secondaryShirtColor: base?.secondaryShirtColor || '#ffffff',
    isGradientEnabled: base?.isGradientEnabled ?? false,
    socksColor: base?.socksColor || base?.shirtColor || '#22c55e',
    bootsColor: base?.bootsColor || '#facc15'
  });

  const [activeTab, setActiveTab] = useState<'IDENTITY' | 'KIT' | 'GEAR' | 'BALLS'>('KIT');

  // Interactive Live Canvas Refs
  const frontCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const backCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number>(0);

  // Live Canvas 60 FPS Render Loop for Dual Previews
  useEffect(() => {
    let animCount = 0;

    const renderDualPreview = () => {
      animCount += 0.05;

      // 1. Render Front Canvas
      if (frontCanvasRef.current) {
        const ctx = frontCanvasRef.current.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, 120, 160);
          ctx.save();
          ctx.scale(2.5, 2.5);
          renderProportionalCharacterSprite(ctx, {
            x: 8,
            y: 4,
            width: 32,
            height: 52,
            isBackView: false,
            custom: formData,
            animationFrame: animCount
          });
          ctx.restore();
        }
      }

      // 2. Render Back Canvas (In-Game Perspective)
      if (backCanvasRef.current) {
        const ctx = backCanvasRef.current.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, 120, 160);
          ctx.save();
          ctx.scale(2.5, 2.5);
          renderProportionalCharacterSprite(ctx, {
            x: 8,
            y: 4,
            width: 32,
            height: 52,
            isBackView: true,
            custom: formData,
            animationFrame: animCount
          });
          ctx.restore();
        }
      }

      animationFrameRef.current = requestAnimationFrame(renderDualPreview);
    };

    animationFrameRef.current = requestAnimationFrame(renderDualPreview);

    return () => {
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, [formData]);

  const handleSave = () => {
    retroAudio.playClick();
    if (onSave) onSave(formData);
    if (onSaveCustomization) onSaveCustomization(formData);
    onClose();
  };

  /**
   * Helper component for infinite color selector with native OS color wheel + quick palette
   */
  const ColorPickerSection: React.FC<{
    label: string;
    value: string;
    onChange: (color: string) => void;
    idPrefix: string;
  }> = ({ label, value, onChange, idPrefix }) => (
    <div className="flex flex-col gap-1.5 bg-[#170e06] p-2.5 rounded-xl border border-[#59300e]">
      <div className="flex items-center justify-between">
        <label className="text-yellow-300/90 text-[10px] uppercase font-bold tracking-wider">
          {label}
        </label>
        <div className="flex items-center gap-2">
          {/* OS Native Color Wheel Picker (<input type="color">) */}
          <div className="relative flex items-center gap-1.5 bg-[#0e0804] px-2 py-1 rounded border border-[#59300e]">
            <input
              type="color"
              id={`${idPrefix}-native-picker`}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent p-0"
              title="Abrir paleta infinita de 16.7 millones de colores"
            />
            <span className="text-[10px] font-mono text-amber-300 font-bold uppercase select-all">
              {value}
            </span>
          </div>
        </div>
      </div>

      {/* Quick 12 Retro Color Swatches */}
      <div className="grid grid-cols-6 sm:grid-cols-12 gap-1 mt-1">
        {PRESET_COLORS.map((c) => (
          <button
            key={`${idPrefix}-${c}`}
            type="button"
            onClick={() => {
              onChange(c);
              retroAudio.playClick();
            }}
            className={`h-6 rounded border-2 flex items-center justify-center transition-transform ${
              value.toLowerCase() === c.toLowerCase()
                ? 'border-yellow-400 scale-110 shadow-md ring-1 ring-yellow-400'
                : 'border-[#442309] hover:scale-105'
            }`}
            style={{ backgroundColor: c }}
            title={c}
          >
            {value.toLowerCase() === c.toLowerCase() && (
              <Check className="w-3 h-3 text-black drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]" />
            )}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-md animate-fadeIn font-mono">
      {/* 16-Bit Super Nintendo Ornate Wood Card */}
      <div
        id="customizer-modal-card"
        className="w-full max-w-4xl bg-gradient-to-b from-[#2b1706] to-[#140b03] border-3 sm:border-4 border-[#8c501c] rounded-2xl p-4 sm:p-6 text-white shadow-[0_12px_40px_rgba(0,0,0,0.9),inset_0_2px_4px_rgba(255,255,255,0.15)] flex flex-col max-h-[94vh] overflow-y-auto"
      >
        {/* Red Ribbon Top Header */}
        <div className="relative mb-3 pb-3 border-b-2 border-[#8c501c]/60 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <div className="px-3 py-1 bg-gradient-to-r from-red-700 via-red-600 to-red-700 text-yellow-300 border-2 border-yellow-500 rounded-md font-arcade text-xs sm:text-sm font-bold shadow-md tracking-wider flex items-center gap-2">
              <Palette className="w-4 h-4 text-yellow-300" />
              <span>SUITE DE PERSONALIZACIÓN PRO (16-BIT)</span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1 bg-[#1a0f07] hover:bg-[#331c0c] text-yellow-400 border border-[#8c501c] rounded font-mono text-xs font-bold transition-colors ml-auto"
          >
            ✕ CERRAR
          </button>
        </div>

        {/* Main 2-Column Layout: Left Live Canvas Previews, Right Customizer Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-4">
          {/* LEFT: Dual Live Canvas (Frontal & Posterior 16-Bit Sprites) */}
          <div className="lg:col-span-4 bg-[#170e06] p-3.5 rounded-xl border-2 border-[#59300e] flex flex-col items-center justify-between shadow-inner">
            <span className="font-arcade text-[10px] text-yellow-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5" /> VISTA DUAL SIMULTÁNEA 16-BIT
            </span>

            {/* Canvas Dual Frame */}
            <div className="grid grid-cols-2 gap-2.5 w-full">
              {/* Front View Canvas */}
              <div className="bg-[#0e0804] p-2 rounded-lg border border-[#442309] flex flex-col items-center relative overflow-hidden shadow-inner">
                <span className="text-[9px] font-mono text-amber-300/90 mb-1 font-bold uppercase">
                  FRONTAL
                </span>
                <div className="w-[120px] h-[150px] flex items-center justify-center bg-[radial-gradient(#261407_1px,transparent_1px)] [background-size:8px_8px] rounded border border-[#3b1d07]">
                  <canvas
                    ref={frontCanvasRef}
                    width={120}
                    height={160}
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="text-[8px] font-mono text-amber-200/60 mt-1">Rostro & Escudo</span>
              </div>

              {/* Back View Canvas (In-Game Perspective!) */}
              <div className="bg-[#0e0804] p-2 rounded-lg border-2 border-yellow-500/70 flex flex-col items-center relative overflow-hidden shadow-[0_0_12px_rgba(234,179,8,0.2)]">
                <span className="text-[9px] font-mono text-yellow-400 mb-1 font-bold uppercase flex items-center gap-1">
                  ★ EN PARTIDO
                </span>
                <div className="w-[120px] h-[150px] flex items-center justify-center bg-[radial-gradient(#261407_1px,transparent_1px)] [background-size:8px_8px] rounded border border-[#3b1d07]">
                  <canvas
                    ref={backCanvasRef}
                    width={120}
                    height={160}
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="text-[8px] font-mono text-yellow-300/80 mt-1 font-bold">Dorsal #{formData.number}</span>
              </div>
            </div>

            {/* Player Info Summary Badge */}
            <div className="mt-3 w-full text-center bg-[#0e0804] p-2 rounded-lg border border-[#59300e]">
              <span className="font-arcade text-xs text-yellow-300 font-bold block truncate">
                {formData.name || 'JUGADOR'}
              </span>
              <span className="text-[9.5px] text-amber-200/70 font-mono block">
                Cuello: {formData.collarStyle?.toUpperCase()} • {formData.pattern?.toUpperCase()}
              </span>
              {formData.isGradientEnabled && (
                <span className="inline-block mt-1 text-[8.5px] px-2 py-0.5 bg-gradient-to-r from-red-600 to-yellow-600 text-white rounded font-arcade">
                  DIFUMINADO ACTIVO
                </span>
              )}
            </div>
          </div>

          {/* RIGHT: Customization Controls & Tabs */}
          <div className="lg:col-span-8 flex flex-col min-w-0">
            {/* Tabs Navigation */}
            <div className="flex border-b-2 border-[#8c501c] mb-3 gap-1 flex-wrap">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('KIT');
                  retroAudio.playClick();
                }}
                className={`flex-1 py-2 font-arcade text-[10px] sm:text-xs rounded-t-lg transition-colors flex items-center justify-center gap-1.5 min-w-[90px] ${
                  activeTab === 'KIT'
                    ? 'bg-[#3b200b] text-yellow-300 border-t-2 border-yellow-400 font-bold'
                    : 'text-amber-200/60 hover:text-amber-100 bg-[#1e1005]'
                }`}
              >
                <Shirt className="w-3.5 h-3.5" /> CAMISETA & CUELLO
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('IDENTITY');
                  retroAudio.playClick();
                }}
                className={`flex-1 py-2 font-arcade text-[10px] sm:text-xs rounded-t-lg transition-colors flex items-center justify-center gap-1.5 min-w-[90px] ${
                  activeTab === 'IDENTITY'
                    ? 'bg-[#3b200b] text-yellow-300 border-t-2 border-yellow-400 font-bold'
                    : 'text-amber-200/60 hover:text-amber-100 bg-[#1e1005]'
                }`}
              >
                <User className="w-3.5 h-3.5" /> JUGADOR & PEINADO
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('GEAR');
                  retroAudio.playClick();
                }}
                className={`flex-1 py-2 font-arcade text-[10px] sm:text-xs rounded-t-lg transition-colors flex items-center justify-center gap-1.5 min-w-[90px] ${
                  activeTab === 'GEAR'
                    ? 'bg-[#3b200b] text-yellow-300 border-t-2 border-yellow-400 font-bold'
                    : 'text-amber-200/60 hover:text-amber-100 bg-[#1e1005]'
                }`}
              >
                <Footprints className="w-3.5 h-3.5" /> SHORTS, MEDIAS & BOTAS
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('BALLS');
                  retroAudio.playClick();
                }}
                className={`flex-1 py-2 font-arcade text-[10px] sm:text-xs rounded-t-lg transition-colors flex items-center justify-center gap-1.5 min-w-[90px] ${
                  activeTab === 'BALLS'
                    ? 'bg-[#3b200b] text-yellow-300 border-t-2 border-yellow-400 font-bold'
                    : 'text-amber-200/60 hover:text-amber-100 bg-[#1e1005]'
                }`}
              >
                <CircleDot className="w-3.5 h-3.5" /> BALONES
              </button>
            </div>

            {/* TAB 1: KIT & COLLAR (The Core Canvas Requirement) */}
            {activeTab === 'KIT' && (
              <div className="flex flex-col gap-3 font-mono overflow-y-auto max-h-[54vh] pr-1.5">
                {/* 1. Estilos de Cuello */}
                <div className="bg-[#170e06] p-3 rounded-xl border border-[#59300e]">
                  <label className="block text-yellow-300/90 text-[10px] uppercase font-bold tracking-wider mb-2">
                    ESTILO DE CUELLO DE LA CAMISETA
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {COLLAR_STYLES.map((cs) => (
                      <button
                        key={cs.id}
                        type="button"
                        onClick={() => {
                          setFormData({ ...formData, collarStyle: cs.id });
                          retroAudio.playClick();
                        }}
                        className={`p-2.5 rounded-lg border-2 text-left transition-all flex flex-col justify-between ${
                          formData.collarStyle === cs.id
                            ? 'bg-yellow-500/20 border-yellow-400 text-yellow-300 font-bold shadow'
                            : 'bg-[#120a03] border-[#442309] text-amber-200/70 hover:bg-[#221206]'
                        }`}
                      >
                        <span className="font-arcade text-[10px]">{cs.label}</span>
                        <span className="text-[8.5px] text-amber-200/60 font-mono mt-0.5">{cs.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Color Independiente del Cuello (Input Type Color + Native Palette) */}
                <ColorPickerSection
                  label="COLOR DEL CUELLO (INDEPENDIENTE)"
                  value={formData.collarColor || '#ffffff'}
                  onChange={(col) => setFormData({ ...formData, collarColor: col })}
                  idPrefix="collar"
                />

                {/* 3. Patrones de Diseño de Camiseta */}
                <div className="bg-[#170e06] p-3 rounded-xl border border-[#59300e]">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-yellow-300/90 text-[10px] uppercase font-bold tracking-wider">
                      PATRÓN DE DISEÑO DEL UNIFORME
                    </label>
                    {/* Procedural Gradient Toggle */}
                    <button
                      type="button"
                      onClick={() => {
                        setFormData({ ...formData, isGradientEnabled: !formData.isGradientEnabled });
                        retroAudio.playClick();
                      }}
                      className={`px-2.5 py-1 rounded-md border text-[9px] font-arcade flex items-center gap-1.5 transition-all ${
                        formData.isGradientEnabled
                          ? 'bg-gradient-to-r from-amber-600 to-red-600 text-white border-yellow-300 font-bold shadow'
                          : 'bg-[#0e0804] text-amber-200/60 border-[#59300e] hover:text-amber-100'
                      }`}
                    >
                      <Sliders className="w-3 h-3" />
                      <span>{formData.isGradientEnabled ? '★ DIFUMINADO PIXEL ON' : 'DIFUMINAR (GRADIENT)'}</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                    {KIT_PATTERNS.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => {
                          setFormData({ ...formData, pattern: p.id });
                          retroAudio.playClick();
                        }}
                        className={`p-2 rounded-lg border text-left font-arcade text-[9px] transition-all flex items-center justify-between ${
                          formData.pattern === p.id
                            ? 'bg-yellow-500/20 border-yellow-400 text-yellow-300 font-bold shadow'
                            : 'bg-[#120a03] border-[#442309] text-amber-200/70 hover:bg-[#221206]'
                        }`}
                      >
                        <span className="truncate">{p.label}</span>
                        {p.isRetro && (
                          <span className="text-[8px] px-1 py-0.2 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded shrink-0">
                            90s
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 4. Color Principal de la Camiseta (Color A) */}
                <ColorPickerSection
                  label="COLOR PRINCIPAL DE LA CAMISETA (COLOR A)"
                  value={formData.shirtColor}
                  onChange={(col) => setFormData({ ...formData, shirtColor: col })}
                  idPrefix="shirt-p"
                />

                {/* 5. Color Secundario / Patrón (Color B) */}
                <ColorPickerSection
                  label="COLOR SECUNDARIO / PATRÓN & DIFUMINADO (COLOR B)"
                  value={formData.secondaryShirtColor}
                  onChange={(col) => setFormData({ ...formData, secondaryShirtColor: col })}
                  idPrefix="shirt-s"
                />
              </div>
            )}

            {/* TAB 2: IDENTITY & HAIRSTYLE */}
            {activeTab === 'IDENTITY' && (
              <div className="flex flex-col gap-3 font-mono overflow-y-auto max-h-[54vh] pr-1.5">
                {/* Dorsal Name & Number Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                  <div className="sm:col-span-8 bg-[#170e06] p-2.5 rounded-xl border border-[#59300e]">
                    <label className="block text-yellow-300/90 text-[10px] uppercase font-bold tracking-wider mb-1">
                      NOMBRE EN LA ESPALDA (PROYECCIÓN BLANCA)
                    </label>
                    <input
                      type="text"
                      maxLength={10}
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value.toUpperCase() })}
                      className="w-full bg-[#0e0804] border-2 border-[#59300e] rounded px-3 py-1.5 text-white font-arcade text-xs focus:border-yellow-400 focus:outline-none uppercase shadow-inner"
                      placeholder="MATADOR"
                    />
                  </div>

                  <div className="sm:col-span-4 bg-[#170e06] p-2.5 rounded-xl border border-[#59300e]">
                    <label className="block text-yellow-300/90 text-[10px] uppercase font-bold tracking-wider mb-1">
                      DORSAL (1-99)
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={99}
                      value={formData.number}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          number: Math.min(99, Math.max(1, Number(e.target.value) || 10))
                        })
                      }
                      className="w-full bg-[#0e0804] border-2 border-[#59300e] rounded px-3 py-1.5 text-white font-arcade text-xs focus:border-yellow-400 focus:outline-none shadow-inner"
                    />
                  </div>
                </div>

                {/* Hairstyles Catalog */}
                <div className="bg-[#170e06] p-3 rounded-xl border border-[#59300e]">
                  <label className="block text-yellow-300/90 text-[10px] uppercase font-bold tracking-wider mb-2">
                    ESTILOS DE PEINADO (16-BIT PROPORCIONAL)
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                    {HAIR_STYLES.map((h) => (
                      <button
                        key={h.id}
                        type="button"
                        onClick={() => {
                          setFormData({ ...formData, hairStyle: h.id });
                          retroAudio.playClick();
                        }}
                        className={`p-2 rounded-lg border text-left transition-all flex flex-col justify-between ${
                          formData.hairStyle === h.id
                            ? 'bg-yellow-500/20 border-yellow-400 text-yellow-300 font-bold shadow'
                            : 'bg-[#120a03] border-[#442309] text-amber-200/70 hover:bg-[#221206]'
                        }`}
                      >
                        <span className="font-arcade text-[9.5px] truncate">{h.label}</span>
                        <span className="text-[8px] text-amber-200/60 font-mono mt-0.5 truncate">{h.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Hair Color Picker */}
                <ColorPickerSection
                  label="COLOR DEL CABELLO (PALETA INFINITA)"
                  value={formData.hairColor}
                  onChange={(col) => setFormData({ ...formData, hairColor: col })}
                  idPrefix="hair"
                />

                {/* Skin Tone Selector */}
                <div className="bg-[#170e06] p-3 rounded-xl border border-[#59300e]">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-yellow-300/90 text-[10px] uppercase font-bold tracking-wider">
                      TONO DE PIEL DEL JUGADOR
                    </label>
                    <div className="flex items-center gap-1.5 bg-[#0e0804] px-2 py-1 rounded border border-[#59300e]">
                      <input
                        type="color"
                        value={formData.skinTone}
                        onChange={(e) => setFormData({ ...formData, skinTone: e.target.value })}
                        className="w-5 h-5 rounded cursor-pointer border-0 bg-transparent p-0"
                        title="Tono de piel personalizado"
                      />
                      <span className="text-[9.5px] font-mono text-amber-300 font-bold uppercase">
                        {formData.skinTone}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-6 gap-2">
                    {SKIN_TONES.map((tone) => (
                      <button
                        key={tone}
                        type="button"
                        onClick={() => {
                          setFormData({ ...formData, skinTone: tone });
                          retroAudio.playClick();
                        }}
                        className={`h-8 rounded-lg border-2 transition-transform flex items-center justify-center ${
                          formData.skinTone === tone
                            ? 'border-yellow-400 scale-105 shadow-md ring-2 ring-yellow-400/40'
                            : 'border-[#442309] hover:scale-102'
                        }`}
                        style={{ backgroundColor: tone }}
                      >
                        {formData.skinTone === tone && (
                          <Check className="w-3.5 h-3.5 text-black drop-shadow" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: GEAR, SHORTS, SOCKS & BOOTS */}
            {activeTab === 'GEAR' && (
              <div className="flex flex-col gap-3 font-mono overflow-y-auto max-h-[54vh] pr-1.5">
                {/* Shorts Color */}
                <ColorPickerSection
                  label="COLOR DE LOS SHORTS / PANTALÓN"
                  value={formData.shortsColor}
                  onChange={(col) => setFormData({ ...formData, shortsColor: col })}
                  idPrefix="shorts"
                />

                {/* Socks Color */}
                <ColorPickerSection
                  label="COLOR DE LAS MEDIAS / CALCETAS"
                  value={formData.socksColor || formData.shirtColor}
                  onChange={(col) => setFormData({ ...formData, socksColor: col })}
                  idPrefix="socks"
                />

                {/* Boots Color */}
                <ColorPickerSection
                  label="COLOR DE LOS BOTINES / BOTAS"
                  value={formData.bootsColor}
                  onChange={(col) => setFormData({ ...formData, bootsColor: col })}
                  idPrefix="boots"
                />
              </div>
            )}

            {/* TAB 4: BALL SKINS */}
            {activeTab === 'BALLS' && (
              <div className="flex flex-col gap-2 overflow-y-auto max-h-[54vh] pr-1.5 font-mono">
                <span className="text-[10px] text-yellow-300/90 uppercase font-bold tracking-wider">
                  BALONES DESBLOQUEABLES
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {BALL_SKINS.map((ball) => {
                    const isUnlocked = currentSeason >= ball.unlockSeason || ball.unlocked;
                    const isSelected = formData.ballId === ball.id;

                    return (
                      <button
                        key={ball.id}
                        type="button"
                        disabled={!isUnlocked}
                        onClick={() => {
                          if (isUnlocked) {
                            setFormData({ ...formData, ballId: ball.id });
                            retroAudio.playClick();
                          }
                        }}
                        className={`p-2.5 rounded-lg border-2 text-left flex items-center gap-3 transition-all ${
                          isSelected
                            ? 'bg-[#3b200b] border-yellow-400 shadow-md ring-1 ring-yellow-400/50'
                            : isUnlocked
                            ? 'bg-[#190d04] border-[#59300e] hover:border-[#8c501c]'
                            : 'bg-[#120a03]/60 border-[#331c0c] opacity-40 cursor-not-allowed'
                        }`}
                      >
                        {/* Ball Icon Preview */}
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
                          <span className="font-arcade text-[10px] text-white flex items-center gap-1 truncate">
                            {ball.name}
                            {isSelected && <Check className="w-3 h-3 text-yellow-400 shrink-0" />}
                          </span>
                          <span className="text-[8.5px] text-amber-200/60 font-mono truncate">{ball.description}</span>
                          {!isUnlocked && (
                            <span className="text-[8px] font-mono text-yellow-500 flex items-center gap-1 mt-0.5">
                              <Lock className="w-2.5 h-2.5" /> Temp. {ball.unlockSeason}
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t-2 border-[#8c501c]/60 flex-wrap">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-[#1f1005] hover:bg-[#331c0c] rounded-lg font-mono text-xs text-amber-200 border border-[#59300e] transition-colors"
          >
            CANCELAR
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 active:scale-95 text-white rounded-lg font-arcade text-xs font-bold shadow-lg border-2 border-green-300 flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-yellow-300" /> GUARDAR PERSONALIZACIÓN
          </button>
        </div>
      </div>
    </div>
  );
};
