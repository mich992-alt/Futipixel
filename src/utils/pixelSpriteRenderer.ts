import {
  CollarStyleType,
  HairStyleType,
  KitPatternType,
  PlayerCustomization
} from '../types';

/**
 * Utility to darken or lighten a hex color with clamped RGB values
 */
export const shadeColor = (hex: string, percent: number): string => {
  if (!hex || typeof hex !== 'string') return '#ffffff';
  let cleanHex = hex.replace('#', '');
  if (cleanHex.length === 3) {
    cleanHex = cleanHex.split('').map((c) => c + c).join('');
  }
  let num = parseInt(cleanHex, 16);
  if (isNaN(num)) num = 0xffffff;

  const amt = Math.round((percent / 100) * 255);
  let r = (num >> 16) + amt;
  let g = ((num >> 8) & 0x00ff) + amt;
  let b = (num & 0x0000ff) + amt;

  r = Math.min(255, Math.max(0, r));
  g = Math.min(255, Math.max(0, g));
  b = Math.min(255, Math.max(0, b));

  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
};

/**
 * Linearly interpolate between two hex colors
 */
export const interpolateColor = (colorA: string, colorB: string, factor: number): string => {
  const cA = colorA.replace('#', '');
  const cB = colorB.replace('#', '');

  const numA = parseInt(cA.length === 3 ? cA.split('').map((c) => c + c).join('') : cA, 16) || 0;
  const numB = parseInt(cB.length === 3 ? cB.split('').map((c) => c + c).join('') : cB, 16) || 0;

  const rA = numA >> 16;
  const gA = (numA >> 8) & 0xff;
  const bA = numA & 0xff;

  const rB = numB >> 16;
  const gB = (numB >> 8) & 0xff;
  const bB = numB & 0xff;

  const r = Math.round(rA + (rB - rA) * factor);
  const g = Math.round(gA + (gB - gA) * factor);
  const b = Math.round(bA + (bB - bA) * factor);

  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
};

/**
 * Draw a procedural 16-bit dithered gradient rect from colorTop to colorBottom
 */
export const drawDitheredGradientRect = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  colorTop: string,
  colorBottom: string
) => {
  const steps = Math.max(1, Math.floor(h));
  for (let row = 0; row < steps; row++) {
    const factor = row / (steps - 1 || 1);
    const baseCol = interpolateColor(colorTop, colorBottom, factor);
    ctx.fillStyle = baseCol;
    ctx.fillRect(x, y + row, w, 1);

    // 16-Bit Dithering pixels on transition zones
    if (row > 0 && row < steps - 1 && row % 2 === 1) {
      const ditherCol = interpolateColor(colorTop, colorBottom, Math.max(0, factor - 0.2));
      ctx.fillStyle = ditherCol;
      for (let col = 0; col < w; col += 2) {
        ctx.fillRect(x + col + (row % 4 === 1 ? 0 : 1), y + row, 1, 1);
      }
    }
  }
};

/**
 * Render Jersey Pattern on a given torso rectangle
 */
export const renderJerseyPattern = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  pattern: KitPatternType,
  primaryColor: string,
  secondaryColor: string,
  isGradient: boolean = false
) => {
  const p = primaryColor;
  const s = secondaryColor;

  // 1. Torso Base Fill
  if (isGradient || pattern === 'gradient') {
    drawDitheredGradientRect(ctx, x, y, w, h, p, s);
  } else {
    ctx.fillStyle = p;
    ctx.fillRect(x, y, w, h);
  }

  // 2. Pattern Overlays
  if (pattern === 'vertical_stripes') {
    const stripeWidth = Math.max(2, Math.floor(w / 7));
    ctx.fillStyle = s;
    for (let sx = x + stripeWidth; sx < x + w - stripeWidth / 2; sx += stripeWidth * 2) {
      ctx.fillRect(sx, y, stripeWidth, h);
    }
  } else if (pattern === 'hoops') {
    const hoopHeight = Math.max(2, Math.floor(h / 6));
    ctx.fillStyle = s;
    for (let sy = y + hoopHeight; sy < y + h; sy += hoopHeight * 2) {
      ctx.fillRect(x, sy, w, hoopHeight);
    }
  } else if (pattern === 'sash') {
    ctx.fillStyle = s;
    ctx.beginPath();
    ctx.moveTo(x + 2, y);
    ctx.lineTo(x + Math.floor(w * 0.4), y);
    ctx.lineTo(x + w, y + Math.floor(h * 0.8));
    ctx.lineTo(x + w, y + h);
    ctx.lineTo(x + Math.floor(w * 0.6), y + h);
    ctx.lineTo(x, y + Math.floor(h * 0.25));
    ctx.closePath();
    ctx.fill();
  } else if (pattern === 'halves') {
    ctx.fillStyle = s;
    ctx.fillRect(x + Math.floor(w / 2), y, Math.ceil(w / 2), h);
  } else if (pattern === 'sleeves_contrast') {
    ctx.fillStyle = s;
    ctx.fillRect(x, y, Math.max(2, Math.floor(w * 0.22)), h);
    ctx.fillRect(x + w - Math.max(2, Math.floor(w * 0.22)), y, Math.max(2, Math.floor(w * 0.22)), h);
  } else if (pattern === 'diamonds') {
    // 90s Retro Diamonds (Argyle)
    ctx.fillStyle = s;
    const dW = Math.max(4, Math.floor(w / 3.2));
    const dH = Math.max(4, Math.floor(h / 3));
    for (let dx = x + 2; dx < x + w - 2; dx += dW) {
      for (let dy = y + 1; dy < y + h - 1; dy += dH) {
        ctx.beginPath();
        ctx.moveTo(dx + dW / 2, dy);
        ctx.lineTo(dx + dW, dy + dH / 2);
        ctx.lineTo(dx + dW / 2, dy + dH);
        ctx.lineTo(dx, dy + dH / 2);
        ctx.closePath();
        ctx.fill();
      }
    }
  } else if (pattern === 'retro_wave') {
    // 90s Retro Wave / ZigZag
    ctx.fillStyle = s;
    ctx.beginPath();
    ctx.moveTo(x, y + Math.floor(h * 0.35));
    ctx.lineTo(x + Math.floor(w * 0.25), y + Math.floor(h * 0.25));
    ctx.lineTo(x + Math.floor(w * 0.5), y + Math.floor(h * 0.4));
    ctx.lineTo(x + Math.floor(w * 0.75), y + Math.floor(h * 0.25));
    ctx.lineTo(x + w, y + Math.floor(h * 0.35));
    ctx.lineTo(x + w, y + Math.floor(h * 0.6));
    ctx.lineTo(x + Math.floor(w * 0.75), y + Math.floor(h * 0.5));
    ctx.lineTo(x + Math.floor(w * 0.5), y + Math.floor(h * 0.65));
    ctx.lineTo(x + Math.floor(w * 0.25), y + Math.floor(h * 0.5));
    ctx.lineTo(x, y + Math.floor(h * 0.6));
    ctx.closePath();
    ctx.fill();
  } else if (pattern === 'flames') {
    // Flame tips
    ctx.fillStyle = s;
    const flameW = Math.max(3, Math.floor(w / 4));
    for (let fx = x + 1; fx < x + w - 1; fx += flameW) {
      ctx.beginPath();
      ctx.moveTo(fx, y + h);
      ctx.lineTo(fx + flameW / 2, y + Math.floor(h * 0.3));
      ctx.lineTo(fx + flameW, y + h);
      ctx.closePath();
      ctx.fill();
    }
  } else if (pattern === 'neon_glow') {
    ctx.fillStyle = s;
    ctx.fillRect(x + 2, y + 2, w - 4, 1);
    ctx.fillRect(x + 2, y + h - 3, w - 4, 1);
    ctx.fillRect(x + Math.floor(w / 2) - 1, y + 2, 2, h - 4);
    ctx.fillRect(x + 4, y + Math.floor(h / 2), w - 8, 1);
  }

  // 3. Pro 16-Bit Textile Shading & Muscle Highlights
  const pHighlight = shadeColor(p, 26);
  const pShadow = shadeColor(p, -26);
  const pDeepShadow = shadeColor(p, -46);

  // Upper chest/shoulder highlight
  ctx.fillStyle = pHighlight;
  ctx.fillRect(x + 2, y, w - 4, 1);
  ctx.fillRect(x + 1, y + 1, 2, Math.floor(h * 0.35));
  ctx.fillRect(x + w - 3, y + 1, 2, Math.floor(h * 0.35));

  // Bottom drape shadow
  ctx.fillStyle = pShadow;
  ctx.fillRect(x + 1, y + h - 3, w - 2, 2);
  ctx.fillStyle = pDeepShadow;
  ctx.fillRect(x + 1, y + h - 1, w - 2, 1);

  // Center seam shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.18)';
  ctx.fillRect(x + Math.floor(w / 2) - 0.5, y + 2, 1, h - 4);
};

/**
 * Render Collar Style (Front & Back Views)
 */
export const renderCollar = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  collarStyle: CollarStyleType = 'round',
  collarColor: string = '#ffffff',
  isBackView: boolean = false
) => {
  const c = collarColor;
  const cShadow = shadeColor(c, -30);
  const cHighlight = shadeColor(c, 25);
  const midX = x + Math.floor(w / 2);

  if (isBackView) {
    // Back Collar: wraps around neck
    if (collarStyle === 'polo') {
      // Polo turned up collar on the back
      ctx.fillStyle = c;
      ctx.fillRect(midX - 7, y - 2, 14, 4);
      ctx.fillStyle = cHighlight;
      ctx.fillRect(midX - 7, y - 2, 14, 1);
      ctx.fillStyle = cShadow;
      ctx.fillRect(midX - 7, y + 1, 14, 1);
      // Wing tips
      ctx.fillRect(midX - 8, y - 1, 2, 3);
      ctx.fillRect(midX + 6, y - 1, 2, 3);
    } else if (collarStyle === 'v_neck') {
      ctx.fillStyle = c;
      ctx.fillRect(midX - 6, y - 1, 12, 2);
      ctx.fillStyle = cShadow;
      ctx.fillRect(midX - 6, y + 1, 12, 1);
    } else {
      // Classic Round Crewneck
      ctx.fillStyle = c;
      ctx.fillRect(midX - 6, y - 1, 12, 3);
      ctx.fillStyle = cHighlight;
      ctx.fillRect(midX - 5, y - 1, 10, 1);
    }
  } else {
    // Front Collar
    if (collarStyle === 'polo') {
      // Flared Polo Lapels with button placket
      ctx.fillStyle = c;
      // Left lapel
      ctx.beginPath();
      ctx.moveTo(midX - 2, y);
      ctx.lineTo(midX - 7, y + 1);
      ctx.lineTo(midX - 5, y + 6);
      ctx.lineTo(midX - 1, y + 4);
      ctx.closePath();
      ctx.fill();

      // Right lapel
      ctx.beginPath();
      ctx.moveTo(midX + 2, y);
      ctx.lineTo(midX + 7, y + 1);
      ctx.lineTo(midX + 5, y + 6);
      ctx.lineTo(midX + 1, y + 4);
      ctx.closePath();
      ctx.fill();

      // Central placket & button
      ctx.fillStyle = cShadow;
      ctx.fillRect(midX - 1.5, y + 1, 3, 5);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(midX - 0.5, y + 3, 1, 1);
    } else if (collarStyle === 'v_neck') {
      // Sharp V-Neck
      ctx.fillStyle = c;
      ctx.beginPath();
      ctx.moveTo(midX - 6, y);
      ctx.lineTo(midX - 1, y + 5);
      ctx.lineTo(midX + 1, y + 5);
      ctx.lineTo(midX + 6, y);
      ctx.lineTo(midX + 4, y);
      ctx.lineTo(midX, y + 3.5);
      ctx.lineTo(midX - 4, y);
      ctx.closePath();
      ctx.fill();
    } else {
      // Classic Round Crew Neck
      ctx.fillStyle = c;
      ctx.beginPath();
      ctx.arc(midX, y + 1, 5, 0, Math.PI);
      ctx.lineWidth = 2;
      ctx.strokeStyle = c;
      ctx.stroke();
      ctx.fillStyle = cHighlight;
      ctx.fillRect(midX - 5, y, 10, 1);
    }
  }
};

/**
 * Render Hair style (Front and Back)
 */
export const renderHair = (
  ctx: CanvasRenderingContext2D,
  headX: number,
  headY: number,
  headW: number,
  hairStyle: HairStyleType,
  hairColor: string,
  isBackView: boolean = false
) => {
  const hCol = hairColor || '#1c1917';
  const hHighlight = shadeColor(hCol, 30);
  const hShadow = shadeColor(hCol, -30);
  const midX = headX + headW / 2;

  ctx.fillStyle = hCol;

  if (hairStyle === 'bald') {
    // No hair, just smooth skull top
    return;
  }

  if (hairStyle === 'afro') {
    // 70s Voluminous Afro
    ctx.beginPath();
    ctx.arc(midX, headY + (isBackView ? 3 : 2), headW * 0.75, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = hHighlight;
    ctx.beginPath();
    ctx.arc(midX - 2, headY - 1, headW * 0.4, 0, Math.PI * 2);
    ctx.fill();
  } else if (hairStyle === 'mohawk') {
    // Punk Mohawk
    const mwW = 6;
    const mwH = isBackView ? 16 : 14;
    ctx.fillRect(midX - mwW / 2, headY - 6, mwW, mwH);
    ctx.fillStyle = hHighlight;
    ctx.fillRect(midX - mwW / 2 + 1, headY - 6, mwW - 2, 2);
    ctx.fillStyle = hShadow;
    ctx.fillRect(midX - mwW / 2, headY + mwH - 8, mwW, 2);
  } else if (hairStyle === 'long') {
    // Long hair down past shoulders
    ctx.fillRect(headX - 2, headY - 2, headW + 4, 8);
    ctx.fillRect(headX - 3, headY + 3, 4, isBackView ? 16 : 12);
    ctx.fillRect(headX + headW - 1, headY + 3, 4, isBackView ? 16 : 12);
    if (isBackView) {
      ctx.fillRect(headX - 1, headY + 5, headW + 2, 12);
    }
    ctx.fillStyle = hHighlight;
    ctx.fillRect(headX, headY - 2, headW, 2);
  } else if (hairStyle === 'braids' || hairStyle === 'dreadlocks') {
    // Braids / Dreadlocks with gold beads
    ctx.fillRect(headX - 2, headY - 3, headW + 4, 8);
    ctx.fillRect(headX - 3, headY + 4, 3, 14);
    ctx.fillRect(headX + headW, headY + 4, 3, 14);
    if (isBackView) {
      ctx.fillRect(headX - 1, headY + 5, headW + 2, 12);
    }
    // Gold and neon beads
    ctx.fillStyle = '#facc15';
    ctx.fillRect(headX - 3, headY + 12, 3, 2);
    ctx.fillRect(headX + headW, headY + 12, 3, 2);
    ctx.fillStyle = '#22c55e';
    ctx.fillRect(headX - 3, headY + 16, 3, 2);
  } else if (hairStyle === 'ponytail') {
    // Ponytail
    ctx.fillRect(headX - 1, headY - 2, headW + 2, 8);
    if (isBackView) {
      ctx.fillRect(midX - 3, headY + 5, 6, 12);
      ctx.fillStyle = '#ef4444'; // Red scrunchie
      ctx.fillRect(midX - 3, headY + 4, 6, 2);
    } else {
      ctx.fillRect(headX + headW - 1, headY + 4, 3, 8);
    }
  } else if (hairStyle === 'mullet') {
    // 80s Mullet
    ctx.fillRect(headX - 1, headY - 2, headW + 2, 7);
    ctx.fillRect(headX - 2, headY + 5, headW + 4, 10);
    ctx.fillStyle = hHighlight;
    ctx.fillRect(headX, headY - 2, headW, 2);
  } else if (hairStyle === 'buzzcut') {
    ctx.fillRect(headX, headY - 1, headW, 4);
    ctx.fillStyle = hHighlight;
    ctx.fillRect(headX + 1, headY - 1, headW - 2, 1);
  } else if (hairStyle === 'fenomeno') {
    // R9 famous triangle fringe
    if (!isBackView) {
      ctx.fillRect(midX - 3, headY - 1, 6, 3);
    } else {
      ctx.fillStyle = shadeColor(hCol, -40);
      ctx.fillRect(headX + 1, headY, headW - 2, 3);
    }
  } else if (hairStyle === 'spiky') {
    // Anime Super Spiky
    ctx.fillRect(headX - 1, headY - 1, headW + 2, 7);
    // Spikes
    ctx.beginPath();
    ctx.moveTo(headX - 1, headY);
    ctx.lineTo(headX + 1, headY - 6);
    ctx.lineTo(headX + 4, headY);
    ctx.lineTo(midX, headY - 7);
    ctx.lineTo(headX + headW - 4, headY);
    ctx.lineTo(headX + headW - 1, headY - 6);
    ctx.lineTo(headX + headW + 1, headY);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = hHighlight;
    ctx.fillRect(midX - 1, headY - 6, 2, 2);
  } else {
    // Classic Modern Tapered Crop
    ctx.fillRect(headX - 1, headY - 2, headW + 2, 7);
    ctx.fillRect(headX - 2, headY + 2, 2, 4);
    ctx.fillRect(headX + headW, headY + 2, 2, 4);
    ctx.fillStyle = hHighlight;
    ctx.fillRect(headX, headY - 2, headW, 2);
  }
};

/**
 * Render Dorsal Number and Name on Back of Jersey with Strict Proportions & Anti-Overflow
 * - Ensures text NEVER exceeds 80% of torso width.
 * - Dynamic font sizing and abbreviation prevents overflowing.
 */
export const renderJerseyBackText = (
  ctx: CanvasRenderingContext2D,
  torsoX: number,
  torsoY: number,
  torsoW: number,
  torsoH: number,
  rawName: string,
  rawNumber: number | string
) => {
  const midX = torsoX + Math.floor(torsoW / 2);
  const maxAllowedWidth = torsoW * 0.80; // Strictly capped at 80% torso width

  // 1. Name on Back: Upper Torso below collar
  let nameStr = (rawName || 'JUGADOR').trim().toUpperCase();
  if (nameStr.length > 9) {
    nameStr = nameStr.slice(0, 7) + '..';
  }

  // Dynamic font sizing to ensure it fits within 80% width
  let nameFontSize = 4;
  ctx.font = `bold ${nameFontSize}px "Press Start 2P", monospace`;
  let nameWidth = ctx.measureText(nameStr).width;
  while (nameWidth > maxAllowedWidth && nameFontSize > 2.5) {
    nameFontSize -= 0.5;
    ctx.font = `bold ${nameFontSize}px "Press Start 2P", monospace`;
    nameWidth = ctx.measureText(nameStr).width;
  }
  if (nameWidth > maxAllowedWidth) {
    nameStr = nameStr.slice(0, 4) + '..';
    ctx.font = `bold 2.5px "Press Start 2P", monospace`;
  }

  const nameY = torsoY + 5.5;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Crisp 1px pixel border outline
  ctx.fillStyle = '#000000';
  ctx.fillText(nameStr, midX - 0.6, nameY);
  ctx.fillText(nameStr, midX + 0.6, nameY);
  ctx.fillText(nameStr, midX, nameY - 0.6);
  ctx.fillText(nameStr, midX, nameY + 0.6);
  ctx.fillStyle = '#ffffff';
  ctx.fillText(nameStr, midX, nameY);

  // 2. Dorsal Number (1-99) in Center Torso
  const numStr = (rawNumber ?? 10).toString().slice(0, 2);
  let numFontSize = numStr.length > 1 ? 6 : 7.5;
  ctx.font = `bold ${numFontSize}px "Press Start 2P", monospace`;
  let numWidth = ctx.measureText(numStr).width;
  while (numWidth > maxAllowedWidth * 0.85 && numFontSize > 4) {
    numFontSize -= 0.5;
    ctx.font = `bold ${numFontSize}px "Press Start 2P", monospace`;
    numWidth = ctx.measureText(numStr).width;
  }

  const numberY = torsoY + 12;
  ctx.fillStyle = '#000000';
  ctx.fillText(numStr, midX - 0.7, numberY);
  ctx.fillText(numStr, midX + 0.7, numberY);
  ctx.fillText(numStr, midX, numberY - 0.7);
  ctx.fillText(numStr, midX, numberY + 0.7);
  ctx.fillStyle = '#ffffff';
  ctx.fillText(numStr, midX, numberY);

  // Subtle gold dorsal shine strip
  ctx.fillStyle = 'rgba(254, 240, 138, 0.7)';
  ctx.fillRect(midX - 3, torsoY + 9.5, 6, 0.8);
};

/**
 * 16-BIT PROPORTIONAL PRO SPRITE RENDERER (Full Body, Front or Back)
 */
export const renderProportionalCharacterSprite = (
  ctx: CanvasRenderingContext2D,
  options: {
    x: number;
    y: number;
    width: number;
    height: number;
    isBackView: boolean;
    custom: PlayerCustomization;
    isKicking?: boolean;
    kickTimer?: number;
    isStunned?: boolean;
    isGoalie?: boolean;
    diveState?: 'diving_left' | 'diving_right' | 'idle' | 'recovering' | 'stunned_ground' | string;
    animationFrame?: number;
    scale?: number;
  }
) => {
  const {
    x,
    y,
    width: w,
    height: h,
    isBackView,
    custom,
    isKicking = false,
    kickTimer = 0,
    isStunned = false,
    isGoalie = false,
    diveState = 'idle',
    animationFrame = 0,
    scale = 1
  } = options;

  ctx.save();
  ctx.imageSmoothingEnabled = false;

  const anim = animationFrame || 0;
  const kickRecoil = (isKicking || kickTimer > 0) ? 6 : 0;

  // Stunned Wobble
  if (isStunned) {
    const wobble = Math.sin(anim * 8) * 2;
    ctx.translate(wobble, 0);
  }

  // --- PALETTES & TONAL RAMPS ---
  const skinTone = custom.skinTone || '#e2a878';
  const skinHighlight = shadeColor(skinTone, 22);
  const skinShadow = shadeColor(skinTone, -26);
  const skinDeepShadow = shadeColor(skinTone, -45);

  const shirtP = custom.shirtColor || '#22c55e';
  const shirtS = custom.secondaryShirtColor || '#ffffff';
  const collarCol = custom.collarColor || '#ffffff';
  const collarStyle = custom.collarStyle || 'round';
  const pattern = custom.pattern || 'solid';
  const isGradient = !!custom.isGradientEnabled || pattern === 'gradient';

  const shortsBase = custom.shortsColor || '#18181b';
  const shortsSec = custom.secondaryShortsColor || shirtS;
  const shortsHighlight = shadeColor(shortsBase, 25);
  const shortsShadow = shadeColor(shortsBase, -28);

  const socksBase = custom.socksColor || shirtP;
  const bootsBase = custom.bootsColor || '#facc15';
  const hairCol = custom.hairColor || '#1c1917';

  // 1. Dithered 16-Bit Ground Shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
  ctx.beginPath();
  ctx.ellipse(x + w / 2, y + h + 2, w * 0.55, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  // 2. Head & Neck Dimensions
  const headW = 14;
  const headH = 13;
  const headX = x + Math.floor((w - headW) / 2);
  const headY = y + 2;

  // 3. Torso & Arms Dimensions
  const torsoW = 22;
  const torsoH = 19;
  const torsoX = x + Math.floor((w - torsoW) / 2);
  const torsoY = y + 15;

  // --- BACK VIEW (IN-GAME PERSPECTIVE) ---
  if (isBackView) {
    // A. Muscular Deltoids & Shoulders Base
    ctx.fillStyle = shirtP;
    ctx.fillRect(torsoX - 2, torsoY, torsoW + 4, torsoH);

    // B. Jersey Pattern with procedural gradients & textures
    renderJerseyPattern(ctx, torsoX, torsoY, torsoW, torsoH, pattern, shirtP, shirtS, isGradient);

    // C. Upper Deltoid Caps & Sleeves
    ctx.fillStyle = shadeColor(shirtP, 25);
    ctx.fillRect(torsoX - 3, torsoY + 1, 3, 7);
    ctx.fillRect(torsoX + torsoW, torsoY + 1, 3, 7);

    // D. Neck & Trapezius muscles
    ctx.fillStyle = skinTone;
    ctx.fillRect(headX + 2, headY + headH - 3, headW - 4, 6);
    ctx.fillStyle = skinHighlight;
    ctx.fillRect(headX + 3, headY + headH - 3, headW - 6, 2);
    ctx.fillStyle = skinShadow;
    ctx.fillRect(headX + 2, headY + headH + 1, headW - 4, 2);

    // E. Back Collar
    renderCollar(ctx, torsoX, torsoY, torsoW, collarStyle, collarCol, true);

    // F. Head & Hair Back
    ctx.fillStyle = skinTone;
    ctx.fillRect(headX, headY, headW, headH);
    ctx.fillStyle = skinShadow;
    ctx.fillRect(headX, headY + headH - 4, headW, 4);
    renderHair(ctx, headX, headY, headW, custom.hairStyle, hairCol, true);

    // G. Back Name and Dorsal Number (Strictly bounded to max 80% torso width)
    renderJerseyBackText(ctx, torsoX, torsoY, torsoW, torsoH, custom.name, custom.number);

    // I. Shorts (with side stripe & waist trim)
    const shortsW = 20;
    const shortsH = 10;
    const shortsX = x + Math.floor((w - shortsW) / 2);
    const shortsY = torsoY + torsoH - 1;

    ctx.fillStyle = shortsBase;
    ctx.fillRect(shortsX, shortsY, shortsW, shortsH);
    ctx.fillStyle = shortsHighlight;
    ctx.fillRect(shortsX, shortsY, shortsW, 2);
    ctx.fillStyle = shortsShadow;
    ctx.fillRect(shortsX, shortsY + shortsH - 3, shortsW, 3);
    // Glute seam divider
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.fillRect(x + w / 2 - 0.5, shortsY + 2, 1, shortsH - 2);
    // Side piping
    ctx.fillStyle = shortsSec;
    ctx.fillRect(shortsX, shortsY + 1, 2, shortsH - 1);
    ctx.fillRect(shortsX + shortsW - 2, shortsY + 1, 2, shortsH - 1);

    // J. Muscular Legs & Calves (Gastrocnemius volume)
    const legW = 6;
    const legH = 6;
    const leftLegX = shortsX + 2;
    const rightLegX = shortsX + shortsW - 8;
    const legsY = shortsY + shortsH;

    // Left leg
    ctx.fillStyle = skinTone;
    ctx.fillRect(leftLegX, legsY, legW, legH);
    ctx.fillStyle = skinHighlight;
    ctx.fillRect(leftLegX, legsY, 2, legH - 1);
    ctx.fillStyle = skinShadow;
    ctx.fillRect(leftLegX + legW - 2, legsY, 2, legH);

    // Right leg (kicking animation offset if shooting)
    ctx.fillStyle = skinTone;
    ctx.fillRect(rightLegX, legsY - kickRecoil, legW, legH + kickRecoil);
    ctx.fillStyle = skinHighlight;
    ctx.fillRect(rightLegX, legsY - kickRecoil, 2, legH);
    ctx.fillStyle = skinShadow;
    ctx.fillRect(rightLegX + legW - 2, legsY - kickRecoil, 2, legH + kickRecoil);

    // K. Socks with white ribbed top turn-down
    const socksY = legsY + legH;
    const socksH = 4;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(leftLegX, socksY - 1, legW, 1);
    ctx.fillRect(rightLegX, socksY - 1 - kickRecoil, legW, 1);

    ctx.fillStyle = socksBase;
    ctx.fillRect(leftLegX, socksY, legW, socksH);
    ctx.fillRect(rightLegX, socksY - kickRecoil, legW, socksH);
    ctx.fillStyle = shadeColor(socksBase, -25);
    ctx.fillRect(leftLegX + legW - 2, socksY, 2, socksH);
    ctx.fillRect(rightLegX + legW - 2, socksY - kickRecoil, 2, socksH);

    // L. Pro Boots with heel counter & studs
    const bootW = 9;
    const bootH = 4;
    const bootY = socksY + socksH;
    const leftBootX = leftLegX - 1;
    const rightBootX = rightLegX - 1;

    ctx.fillStyle = bootsBase;
    ctx.fillRect(leftBootX, bootY, bootW, bootH);
    ctx.fillRect(rightBootX, bootY - kickRecoil, bootW, bootH);

    // Heel counter & brand logo
    ctx.fillStyle = '#000000';
    ctx.fillRect(leftBootX + 1, bootY + 1, 2, 2);
    ctx.fillRect(rightBootX + 1, bootY + 1 - kickRecoil, 2, 2);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(leftBootX + 4, bootY + 1, 3, 1);
    ctx.fillRect(rightBootX + 4, bootY + 1 - kickRecoil, 3, 1);

    // Studs on turf
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(leftBootX + 1, bootY + bootH, 2, 1);
    ctx.fillRect(leftBootX + 6, bootY + bootH, 2, 1);
    ctx.fillRect(rightBootX + 1, bootY + bootH - kickRecoil, 2, 1);
    ctx.fillRect(rightBootX + 6, bootY + bootH - kickRecoil, 2, 1);

  } else {
    // --- FRONT VIEW (DEFENDERS, GOALKEEPERS & CUSTOMIZER FRONTAL) ---

    // A. Muscular Deltoids & Shoulders
    ctx.fillStyle = shirtP;
    ctx.fillRect(torsoX - 2, torsoY, torsoW + 4, torsoH);

    // B. Jersey Pattern with textures & dithered gradients
    renderJerseyPattern(ctx, torsoX, torsoY, torsoW, torsoH, pattern, shirtP, shirtS, isGradient);

    // C. Biceps & Forearms on sides
    if (isGoalie) {
      // Long Goalie Sleeves with elbow pads
      ctx.fillStyle = shirtP;
      ctx.fillRect(torsoX - 4, torsoY + 2, 4, 14);
      ctx.fillRect(torsoX + torsoW, torsoY + 2, 4, 14);
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(torsoX - 4, torsoY + 8, 4, 4);
      ctx.fillRect(torsoX + torsoW, torsoY + 8, 4, 4);
    } else {
      // Short athletic sleeves + bare muscular arms
      ctx.fillStyle = shirtP;
      ctx.fillRect(torsoX - 3, torsoY + 1, 3, 7);
      ctx.fillRect(torsoX + torsoW, torsoY + 1, 3, 7);

      // Bare arms
      ctx.fillStyle = skinTone;
      ctx.fillRect(torsoX - 3, torsoY + 8, 3, 7);
      ctx.fillRect(torsoX + torsoW, torsoY + 8, 3, 7);
      ctx.fillStyle = skinHighlight;
      ctx.fillRect(torsoX - 3, torsoY + 8, 1, 6);
      ctx.fillRect(torsoX + torsoW + 2, torsoY + 8, 1, 6);
      ctx.fillStyle = skinShadow;
      ctx.fillRect(torsoX - 1, torsoY + 9, 1, 6);
      ctx.fillRect(torsoX + torsoW, torsoY + 9, 1, 6);
    }

    // D. Front Collar
    renderCollar(ctx, torsoX, torsoY, torsoW, collarStyle, collarCol, false);

    // E. Chest Badge & Front Dorsal Number
    ctx.fillStyle = '#facc15';
    ctx.fillRect(torsoX + 3, torsoY + 5, 3, 3); // Gold Club Crest Shield
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(torsoX + 4, torsoY + 6, 1, 1);

    // Front number
    const frontDorsal = (custom.number ?? 10).toString();
    ctx.font = 'bold 8px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#000000';
    ctx.fillText(frontDorsal, torsoX + torsoW - 6 + 1, torsoY + 12 + 1);
    ctx.fillStyle = '#ffffff';
    ctx.fillText(frontDorsal, torsoX + torsoW - 6, torsoY + 12);

    // F. Neck & Head
    ctx.fillStyle = skinTone;
    ctx.fillRect(headX + 2, headY + headH - 3, headW - 4, 6);
    ctx.fillStyle = skinShadow;
    ctx.fillRect(headX + 2, headY + headH + 1, headW - 4, 2);

    // Head Face Box
    ctx.fillStyle = skinTone;
    ctx.fillRect(headX, headY, headW, headH);

    // Cheeks & Jawline Shading
    ctx.fillStyle = skinHighlight;
    ctx.fillRect(headX + 1, headY + 1, headW - 2, 2);
    ctx.fillStyle = skinShadow;
    ctx.fillRect(headX, headY + headH - 3, headW, 3);
    ctx.fillStyle = skinDeepShadow;
    ctx.fillRect(headX + 2, headY + headH - 1, headW - 4, 1);

    // G. Expressive Face: Eyebrows, Realistic Eyes with whites & pupils, Nose, Mouth
    // Eyebrows
    ctx.fillStyle = hairCol;
    ctx.fillRect(headX + 2, headY + 4, 4, 1);
    ctx.fillRect(headX + headW - 6, headY + 4, 4, 1);

    // Eyes: White sclera + dark iris + highlight dot
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(headX + 2, headY + 5, 4, 2);
    ctx.fillRect(headX + headW - 6, headY + 5, 4, 2);

    ctx.fillStyle = '#1c1917';
    ctx.fillRect(headX + 3, headY + 5, 2, 2);
    ctx.fillRect(headX + headW - 5, headY + 5, 2, 2);

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(headX + 4, headY + 5, 1, 1);
    ctx.fillRect(headX + headW - 4, headY + 5, 1, 1);

    // Nose bridge & tip shadow
    ctx.fillStyle = skinShadow;
    ctx.fillRect(headX + Math.floor(headW / 2) - 1, headY + 7, 2, 2);

    // Mouth / Expression
    ctx.fillStyle = '#831843';
    ctx.fillRect(headX + Math.floor(headW / 2) - 2, headY + 10, 4, 1);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(headX + Math.floor(headW / 2) - 1, headY + 10, 2, 1);

    // Hair Front
    renderHair(ctx, headX, headY, headW, custom.hairStyle, hairCol, false);

    // H. Shorts
    const shortsW = 20;
    const shortsH = 10;
    const shortsX = x + Math.floor((w - shortsW) / 2);
    const shortsY = torsoY + torsoH - 1;

    ctx.fillStyle = shortsBase;
    ctx.fillRect(shortsX, shortsY, shortsW, shortsH);
    ctx.fillStyle = shortsHighlight;
    ctx.fillRect(shortsX, shortsY, shortsW, 2);
    ctx.fillStyle = shortsShadow;
    ctx.fillRect(shortsX, shortsY + shortsH - 3, shortsW, 3);
    // Center fly seam & side stripes
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.fillRect(x + w / 2 - 0.5, shortsY + 2, 1, shortsH - 2);
    ctx.fillStyle = shortsSec;
    ctx.fillRect(shortsX, shortsY + 1, 2, shortsH - 1);
    ctx.fillRect(shortsX + shortsW - 2, shortsY + 1, 2, shortsH - 1);

    // I. Legs & Kneecaps
    const legW = 6;
    const legH = 6;
    const leftLegX = shortsX + 2;
    const rightLegX = shortsX + shortsW - 8;
    const legsY = shortsY + shortsH;

    // Running animation cycle for defenders
    const runCycle = Math.sin(anim * 12) * 3;
    const leftOffset = isStunned ? 0 : runCycle;
    const rightOffset = isStunned ? 0 : -runCycle;

    // Left Quad
    ctx.fillStyle = skinTone;
    ctx.fillRect(leftLegX, legsY, legW, legH + leftOffset);
    ctx.fillStyle = skinHighlight;
    ctx.fillRect(leftLegX + 1, legsY, 2, legH - 1);
    ctx.fillStyle = skinShadow;
    ctx.fillRect(leftLegX + 1, legsY + legH - 2 + leftOffset, 4, 2); // Kneecap shadow

    // Right Quad
    ctx.fillStyle = skinTone;
    ctx.fillRect(rightLegX, legsY, legW, legH + rightOffset);
    ctx.fillStyle = skinHighlight;
    ctx.fillRect(rightLegX + 1, legsY, 2, legH - 1);
    ctx.fillStyle = skinShadow;
    ctx.fillRect(rightLegX + 1, legsY + legH - 2 + rightOffset, 4, 2);

    // J. Socks
    const socksY = legsY + legH;
    const socksH = 4;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(leftLegX, socksY - 1 + leftOffset, legW, 1);
    ctx.fillRect(rightLegX, socksY - 1 + rightOffset, legW, 1);

    ctx.fillStyle = socksBase;
    ctx.fillRect(leftLegX, socksY + leftOffset, legW, socksH);
    ctx.fillRect(rightLegX, socksY + rightOffset, legW, socksH);
    ctx.fillStyle = shadeColor(socksBase, -25);
    ctx.fillRect(leftLegX + legW - 2, socksY + leftOffset, 2, socksH);
    ctx.fillRect(rightLegX + legW - 2, socksY + rightOffset, 2, socksH);

    // K. Front Boots (with laces & toe box)
    const bootW = 9;
    const bootH = 4;
    const bootY = socksY + socksH;
    const leftBootX = leftLegX - 1;
    const rightBootX = rightLegX - 1;

    ctx.fillStyle = bootsBase;
    ctx.fillRect(leftBootX, bootY + leftOffset, bootW, bootH);
    ctx.fillRect(rightBootX, bootY + rightOffset, bootW, bootH);

    // White Laces & Brand Stripes
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(leftBootX + 2, bootY + leftOffset, 5, 1);
    ctx.fillRect(leftBootX + 3, bootY + 1 + leftOffset, 3, 1);
    ctx.fillRect(rightBootX + 2, bootY + rightOffset, 5, 1);
    ctx.fillRect(rightBootX + 3, bootY + 1 + rightOffset, 3, 1);

    // Toe box shadow & studs
    ctx.fillStyle = '#000000';
    ctx.fillRect(leftBootX, bootY + bootH - 1 + leftOffset, bootW, 1);
    ctx.fillRect(rightBootX, bootY + bootH - 1 + rightOffset, bootW, 1);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(leftBootX + 1, bootY + bootH + leftOffset, 2, 1);
    ctx.fillRect(leftBootX + 6, bootY + bootH + leftOffset, 2, 1);
    ctx.fillRect(rightBootX + 1, bootY + bootH + rightOffset, 2, 1);
    ctx.fillRect(rightBootX + 6, bootY + bootH + rightOffset, 2, 1);

    // L. Goalkeeper Gloves
    if (isGoalie) {
      const gloveBase = custom.bootsColor || '#f97316';
      const gloveGrip = '#ffffff';
      const gloveW = 9;
      const gloveH = 10;

      if (diveState === 'diving_left') {
        ctx.fillStyle = gloveBase;
        ctx.fillRect(x - 8, y + 8, gloveW + 2, gloveH + 1);
        ctx.fillStyle = gloveGrip;
        ctx.fillRect(x - 6, y + 10, gloveW - 2, gloveH - 3);
        ctx.fillStyle = gloveBase;
        ctx.fillRect(x + 3, y + 12, gloveW, gloveH);
      } else if (diveState === 'diving_right') {
        ctx.fillStyle = gloveBase;
        ctx.fillRect(x + w - 3, y + 8, gloveW + 2, gloveH + 1);
        ctx.fillStyle = gloveGrip;
        ctx.fillRect(x + w - 1, y + 10, gloveW - 2, gloveH - 3);
        ctx.fillStyle = gloveBase;
        ctx.fillRect(x + w - 11, y + 12, gloveW, gloveH);
      } else {
        ctx.fillStyle = gloveBase;
        ctx.fillRect(torsoX - 6, torsoY + 12, gloveW, gloveH);
        ctx.fillRect(torsoX + torsoW - 3, torsoY + 12, gloveW, gloveH);
        ctx.fillStyle = gloveGrip;
        ctx.fillRect(torsoX - 5, torsoY + 14, gloveW - 2, gloveH - 4);
        ctx.fillRect(torsoX + torsoW - 2, torsoY + 14, gloveW - 2, gloveH - 4);
      }
    }
  }

  // Stunned Stars Animation Orbiting Head
  if (isStunned) {
    const starTime = Date.now() / 150;
    const starRadiusX = 18;
    const starRadiusY = 6;
    const starCenterY = y - 4;
    const starColors = ['#fde047', '#f97316', '#38bdf8', '#fbbf24'];

    for (let sIdx = 0; sIdx < 4; sIdx++) {
      const starAngle = starTime + (sIdx * Math.PI) / 2;
      const sx = x + w / 2 + Math.cos(starAngle) * starRadiusX;
      const sy = starCenterY + Math.sin(starAngle) * starRadiusY;
      const starSize = Math.sin(starAngle) > 0 ? 4 : 2.5;

      ctx.fillStyle = starColors[sIdx];
      ctx.fillRect(sx - starSize / 2, sy - starSize / 2, starSize, starSize);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(sx - 1, sy - starSize, 2, starSize * 2);
      ctx.fillRect(sx - starSize, sy - 1, starSize * 2, 2);
    }
  }

  ctx.restore();
};
