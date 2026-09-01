import React, { useEffect, useRef, useCallback, useState } from 'react';
import {
  BallEntity,
  BallSkin,
  DefenderEntity,
  FloatingTextEntity,
  GoalEntity,
  GoalkeeperEntity,
  ParticleEntity,
  PlayerCustomization,
  RivalTeam,
  SpeechBubbleEntity
} from '../types';
import { parseFormationLines, DEFENDER_SPEECH_BUBBLES } from '../utils/gameGenerators';
import { retroAudio } from '../audio/retroAudio';
import { renderProportionalCharacterSprite } from '../utils/pixelSpriteRenderer';
import { MatchEngine } from '../engines/match/matchEngine';
import { FreeKickTechnique, FreeKickZone, MatchSnapshot, PenaltyQuadrant } from '../engines/match/matchTypes';
import { AlertTriangle, Crosshair } from 'lucide-react';

interface PixelCanvasProps {
  playerCustom: PlayerCustomization;
  ballSkin: BallSkin;
  rivalTeam: RivalTeam;
  isRepechaje?: boolean;
  matchEngine: MatchEngine;
  onGoalScored: (multiplier: number, points: number) => void;
  onShotMissed: () => void;
  onSuperChargedChange?: (charge: number) => void;
  onMatchEngineUpdate?: (snapshot: MatchSnapshot) => void;
  isPaused: boolean;
  isFullscreen?: boolean;
  onOpenPause?: () => void;
}

export const PixelCanvas: React.FC<PixelCanvasProps> = ({
  playerCustom,
  ballSkin,
  rivalTeam,
  isRepechaje = false,
  matchEngine,
  onGoalScored,
  onShotMissed,
  onSuperChargedChange,
  onMatchEngineUpdate,
  isPaused,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [engineSnapshot, setEngineSnapshot] = useState<MatchSnapshot>(() => matchEngine.getSnapshot());
  const [showDebugOverlay, setShowDebugOverlay] = useState(false);
  const [superChargeState, setSuperChargeState] = useState(100);

  // Virtual resolution for retro pixel rendering
  const V_WIDTH = 800;
  const V_HEIGHT = 600;

  // Calculate RPG player attributes
  const moveSpeedLevel = playerCustom.moveSpeedLevel || 1;
  const shotVelocityLevel = playerCustom.shotVelocityLevel || 1;
  const fireRateLevel = playerCustom.fireRateLevel || 1;

  // Difficulty base multiplier from Rival Rating (Division 23 -> 1)
  const rivalDifficulty = rivalTeam.difficultyLevel || 1;

  // CalibraciÃ³n temporal de QA. Unidades lÃ³gicas por segundo, NO por frame.
  // D23: ~5.9s para cruzar el ancho jugable; mejoras suben de forma gradual.
  const calibratedPlayerSpeed = 118 + (moveSpeedLevel - 1) * 8;

  // Game state references
  const playerRef = useRef({
    x: V_WIDTH / 2 - 19,
    y: V_HEIGHT - 65,
    width: 38,
    height: 48,
    speed: calibratedPlayerSpeed,
    isKicking: false,
    kickTimer: 0,
    shotCooldown: 0,
    superCharge: 100,
  });

  const ballsRef = useRef<BallEntity[]>([]);
  const defendersRef = useRef<DefenderEntity[]>([]);
  const speechBubblesRef = useRef<SpeechBubbleEntity[]>([]);
  const lastShotTypeRef = useRef<'NORMAL' | 'SUPER' | 'CURVO' | 'NINGUNO'>('NINGUNO');

  const goalkeeperRef = useRef<GoalkeeperEntity>({
    x: V_WIDTH / 2 - 18,
    y: 70,
    width: 36,
    height: 44,
    speed: 1.5,
    direction: 1,
    diveState: 'idle',
    diveTimer: 0,
    gloveColor: '#f97316',
    shirtColor: '#eab308'
  });

  const goalRef = useRef<GoalEntity>({
    x: V_WIDTH / 2 - 90,
    y: 18,
    width: 180,
    height: 55,
    minWidth: 90,
    maxWidth: 240,
    direction: 1,
    speed: 1.2,
    expandSpeed: 0.65,
    isExpanding: false
  });

  const particlesRef = useRef<ParticleEntity[]>([]);
  const floatingTextsRef = useRef<FloatingTextEntity[]>([]);
  const screenShakeRef = useRef(0);
  const goalCelebrationTimerRef = useRef(0);

  // Input states (Keyboard & Touch)
  const keysRef = useRef<{ left: boolean; right: boolean; shoot: boolean; superShoot: boolean; curveShoot: boolean }>({
    left: false,
    right: false,
    shoot: false,
    superShoot: false,
    curveShoot: false
  });

  const touchInputRef = useRef<{ left: boolean; right: boolean }>({ left: false, right: false });
  // Evita forzar un render de React a 60 FPS. El motor fÃ­sico sigue a RAF; el HUD se sincroniza ~10 FPS o ante cambios crÃ­ticos.
  const lastUiSyncRef = useRef(0);
  const lastUiStateRef = useRef(engineSnapshot.state);
  const lastUiScoreRef = useRef({ user: engineSnapshot.userScore, rival: engineSnapshot.rivalScore });

  // Selection states for Set Pieces
  const [selectedFreeKickZone, setSelectedFreeKickZone] = useState<FreeKickZone>('CENTER');
  const [selectedFreeKickTech, setSelectedFreeKickTech] = useState<FreeKickTechnique>('PLACEMENT');

  // Initialize defenders based on tactical formation with individual speeds (5.5s - 7.0s cruce de campo)
  const initDefenders = useCallback(() => {
    const formationLines = parseFormationLines(rivalTeam.formation);
    const defenders: DefenderEntity[] = [];
    let idCounter = 1;

    // Tactical Row 0: Defenders Line (Top, y = 145)
    const defCount = formationLines.defenders;
    const defLaneWidth = (V_WIDTH - 80) / defCount;
    for (let i = 0; i < defCount; i++) {
      const initialX = 40 + i * defLaneWidth + (defLaneWidth - 34) / 2;
      const individualSpeed = 105 + ((i * 7 + 0 * 13) % 10) * 1.15; // unidades/s; D23 aprox. 105-115
      defenders.push({
        id: idCounter++,
        row: 0,
        col: i,
        x: initialX,
        y: 145,
        baseY: 145,
        dodgeOffsetY: 0,
        width: 34,
        height: 44,
        speed: individualSpeed,
        direction: i % 2 === 0 ? 1 : -1,
        pattern: rivalTeam.pattern || 'vertical_stripes',
        shirtColor: rivalTeam.primaryColor,
        secondaryShirtColor: rivalTeam.secondaryColor,
        shortsColor: rivalTeam.secondaryColor,
        hairColor: rivalTeam.hairColor,
        hairStyle: i % 2 === 0 ? 'short' : 'afro',
        skinTone: i % 3 === 0 ? '#fbcfe8' : i % 3 === 1 ? '#e2a878' : '#78350f',
        number: 2 + i,
        isStunned: false,
        stunTimer: 0,
        tackleAnimTimer: 0,
        aiState: i % 2 === 0 ? 'MOVING_RIGHT' : 'MOVING_LEFT',
        stateTimer: Math.floor(50 + (i * 23) % 70),
        pauseDuration: Math.floor(25 + (i * 17) % 35),
        speedMultiplier: 1.0,
        baseSpeed: individualSpeed
      });
    }

    // Tactical Row 1: Midfielders Line (Center, y = 260)
    const midCount = formationLines.midfielders;
    const midLaneWidth = (V_WIDTH - 80) / midCount;
    for (let i = 0; i < midCount; i++) {
      const initialX = 40 + i * midLaneWidth + (midLaneWidth - 34) / 2;
      const individualSpeed = 106 + ((i * 7 + 1 * 13) % 10) * 1.15; // unidades/s
      defenders.push({
        id: idCounter++,
        row: 1,
        col: i,
        x: initialX,
        y: 260,
        baseY: 260,
        dodgeOffsetY: 0,
        width: 34,
        height: 44,
        speed: individualSpeed,
        direction: (i + 1) % 2 === 0 ? 1 : -1,
        pattern: rivalTeam.pattern || 'vertical_stripes',
        shirtColor: rivalTeam.primaryColor,
        secondaryShirtColor: rivalTeam.secondaryColor,
        shortsColor: rivalTeam.secondaryColor,
        hairColor: rivalTeam.hairColor,
        hairStyle: 'mohawk',
        skinTone: i % 2 === 0 ? '#e2a878' : '#a16207',
        number: 6 + i,
        isStunned: false,
        stunTimer: 0,
        tackleAnimTimer: 0,
        aiState: (i + 1) % 2 === 0 ? 'MOVING_RIGHT' : 'MOVING_LEFT',
        stateTimer: Math.floor(45 + (i * 19) % 75),
        pauseDuration: Math.floor(20 + (i * 13) % 40),
        speedMultiplier: 1.0,
        baseSpeed: individualSpeed
      });
    }

    // Tactical Row 2: Forwards Line (Bottom, y = 375)
    const fwCount = formationLines.forwards;
    const fwLaneWidth = (V_WIDTH - 80) / fwCount;
    for (let i = 0; i < fwCount; i++) {
      const initialX = 40 + i * fwLaneWidth + (fwLaneWidth - 34) / 2;
      const individualSpeed = 107 + ((i * 7 + 2 * 13) % 9) * 1.15; // unidades/s
      defenders.push({
        id: idCounter++,
        row: 2,
        col: i,
        x: initialX,
        y: 375,
        baseY: 375,
        dodgeOffsetY: 0,
        width: 34,
        height: 44,
        speed: individualSpeed,
        direction: i % 2 === 0 ? -1 : 1,
        pattern: rivalTeam.pattern || 'vertical_stripes',
        shirtColor: rivalTeam.primaryColor,
        secondaryShirtColor: rivalTeam.secondaryColor,
        shortsColor: rivalTeam.secondaryColor,
        hairColor: rivalTeam.hairColor,
        hairStyle: 'short',
        skinTone: i % 2 === 0 ? '#fbcfe8' : '#451a03',
        number: 9 + i,
        isStunned: false,
        stunTimer: 0,
        tackleAnimTimer: 0,
        aiState: i % 2 === 0 ? 'MOVING_LEFT' : 'MOVING_RIGHT',
        stateTimer: Math.floor(50 + (i * 29) % 65),
        pauseDuration: Math.floor(25 + (i * 21) % 30),
        speedMultiplier: 1.0,
        baseSpeed: individualSpeed
      });
    }

    defendersRef.current = defenders;
  }, [rivalTeam]);

  const triggerSpeechBubble = (text: string, x: number, y: number) => {
    speechBubblesRef.current.push({
      id: Math.floor(Math.random() * 100000),
      text,
      x,
      y: y - 24,
      life: 0,
      maxLife: 70,
      color: '#ffffff'
    });
  };

  const spawnGoalParticles = (x: number, y: number, color: string) => {
    const colors = ['#facc15', '#38bdf8', '#ef4444', '#22c55e', '#a855f7', '#ffffff', color];
    for (let i = 0; i < 45; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 6;
      particlesRef.current.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 3 + Math.random() * 4,
        life: 0,
        maxLife: 45 + Math.random() * 30,
        shape: Math.random() > 0.4 ? 'confetti' : 'circle'
      });
    }
  };

  const spawnTurfSparks = (x: number, y: number, isGrass: boolean = true) => {
    for (let i = 0; i < 10; i++) {
      particlesRef.current.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 4,
        vy: -Math.random() * 3 - 1,
        color: isGrass ? '#4ade80' : '#fde047',
        size: 2 + Math.random() * 2,
        life: 0,
        maxLife: 20 + Math.random() * 15,
        shape: 'rect'
      });
    }
  };

  const addFloatingText = (text: string, x: number, y: number, color: string = '#facc15', size: number = 18) => {
    floatingTextsRef.current.push({
      x,
      y,
      text,
      color,
      size,
      alpha: 1,
      life: 0
    });
  };

  // Trigger Shot
  const shootBall = (isSuper: boolean = false, isCurved: boolean = false) => {
    const snap = matchEngine.getSnapshot();
    if (snap.state === 'PENALTY' || snap.state === 'FREE_KICK' || snap.state === 'RESUME_COUNTDOWN') return;

    const player = playerRef.current;
    if (player.shotCooldown > 0) return;

    if (isSuper && player.superCharge < 50) return;

    if (isSuper) {
      player.superCharge = Math.max(0, player.superCharge - 50);
      setSuperChargeState(player.superCharge);
      if (onSuperChargedChange) onSuperChargedChange(player.superCharge);
    }

    player.isKicking = true;
    player.kickTimer = 10;

    const baseCooldownSeconds = isSuper ? 0.47 : isCurved ? 0.40 : 0.33;
    player.shotCooldown = Math.max(0.13, baseCooldownSeconds - (fireRateLevel - 1) * 0.025);

    let curveVal = 0;
    if (keysRef.current.left || touchInputRef.current.left) curveVal = -0.35;
    if (keysRef.current.right || touchInputRef.current.right) curveVal = 0.35;

    if (isCurved) {
      curveVal = curveVal !== 0 ? curveVal * 3.5 : (Math.random() > 0.5 ? 1.4 : -1.4);
    }

    const ballX = player.x + player.width / 2;
    const ballY = player.y - 8;

    // Velocidad en unidades lÃ³gicas por segundo para que no dependa de FPS/React renders.
    const vyBase = isSuper
      ? -650 - (shotVelocityLevel - 1) * 24
      : isCurved
      ? -520 - (shotVelocityLevel - 1) * 21
      : -560 - (shotVelocityLevel - 1) * 21;

    lastShotTypeRef.current = isSuper ? 'SUPER' : isCurved ? 'CURVO' : 'NORMAL';

    ballsRef.current.push({
      x: ballX,
      y: ballY,
      vx: curveVal * 132,
      vy: vyBase,
      radius: isSuper ? 9 : 7,
      active: true,
      isSuperShot: isSuper,
      isCurvedShot: isCurved,
      curve: curveVal,
      trail: [],
      skinId: ballSkin.id,
      piercedCount: 0,
      bounceCount: 0
    });

    // Registrar disparo en MatchEngine (resetea inmediatamente el Shooting Clock)
    if (typeof matchEngine?.onShot === 'function') {
      matchEngine.onShot(isSuper, isCurved);
    } else if (typeof matchEngine?.registerShot === 'function') {
      matchEngine.registerShot(isSuper, isCurved);
    }

    retroAudio.playKick(isSuper);
    spawnTurfSparks(ballX, ballY + 10, true);

    if (isSuper) {
      addFloatingText('â¡ Â¡SUPER TIRO!', ballX - 30, ballY - 15, '#facc15', 16);
    } else if (isCurved) {
      addFloatingText('ð Â¡TIRO CURVO!', ballX - 30, ballY - 15, '#38bdf8', 16);
    }
  };

  // Reset defenders and entities on team change
  useEffect(() => {
    initDefenders();
    ballsRef.current = [];
    particlesRef.current = [];
    floatingTextsRef.current = [];
    speechBubblesRef.current = [];
  }, [initDefenders]);

  // Keyboard handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isPaused) return;

      if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
        keysRef.current.left = true;
      }
      if (e.code === 'ArrowRight' || e.code === 'KeyD') {
        keysRef.current.right = true;
      }
      if (e.code === 'Space') {
        e.preventDefault();
        shootBall(false, false);
      }
      if (e.code === 'ShiftLeft' || e.code === 'ShiftRight' || e.code === 'KeyE' || e.code === 'KeyZ') {
        e.preventDefault();
        shootBall(true, false);
      }
      if (e.code === 'KeyC' || e.code === 'KeyQ') {
        e.preventDefault();
        shootBall(false, true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
        keysRef.current.left = false;
      }
      if (e.code === 'ArrowRight' || e.code === 'KeyD') {
        keysRef.current.right = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isPaused, ballSkin, shotVelocityLevel, fireRateLevel]);

  // Main Canvas Game Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let lastTime = performance.now();

    const gameLoop = (currentTime: number) => {
      const dt = Math.min(0.1, (currentTime - lastTime) / 1000);
      lastTime = currentTime;

      // 1. UPDATE MATCH ENGINE & TICK LOGIC
      const activeCount = ballsRef.current.filter((b) => b.active).length;
      const snapshot = matchEngine.update(dt, activeCount);
      const criticalUiChange =
        snapshot.state !== lastUiStateRef.current ||
        snapshot.userScore !== lastUiScoreRef.current.user ||
        snapshot.rivalScore !== lastUiScoreRef.current.rival;
      if (criticalUiChange || currentTime - lastUiSyncRef.current >= 100) {
        lastUiSyncRef.current = currentTime;
        lastUiStateRef.current = snapshot.state;
        lastUiScoreRef.current = { user: snapshot.userScore, rival: snapshot.rivalScore };
        setEngineSnapshot(snapshot);
        if (onMatchEngineUpdate) onMatchEngineUpdate(snapshot);
      }

      if (!isPaused && snapshot.state !== 'PENALTY' && snapshot.state !== 'FREE_KICK' && snapshot.state !== 'RESUME_COUNTDOWN' && snapshot.state !== 'PAUSED') {
        const player = playerRef.current;
        const goal = goalRef.current;
        const gk = goalkeeperRef.current;

        // Player Movement (Continuous Keyboard & Touch)
        let moveDir = 0;
        if (keysRef.current.left || touchInputRef.current.left) moveDir -= 1;
        if (keysRef.current.right || touchInputRef.current.right) moveDir += 1;

        player.x += moveDir * player.speed * dt;
        if (player.x < 35) player.x = 35;
        if (player.x + player.width > V_WIDTH - 35) player.x = V_WIDTH - 35 - player.width;

        if (player.kickTimer > 0) player.kickTimer--;
        if (player.shotCooldown > 0) player.shotCooldown = Math.max(0, player.shotCooldown - dt);

        // Super charge build up
        if (player.superCharge < 100) {
          player.superCharge = Math.min(100, player.superCharge + 2.1 * dt);
          if (Math.floor(player.superCharge) % 5 === 0) {
            setSuperChargeState(player.superCharge);
            if (onSuperChargedChange) onSuperChargedChange(player.superCharge);
          }
        }

        // Dynamic Goal Movement & Width Oscillation
        goal.x += goal.speed * 60 * goal.direction * dt;
        if (goal.x <= 40) {
          goal.x = 40;
          goal.direction = 1;
        } else if (goal.x + goal.width >= V_WIDTH - 40) {
          goal.x = V_WIDTH - 40 - goal.width;
          goal.direction = -1;
        }

        if (goal.isExpanding) {
          goal.width += goal.expandSpeed * 60 * dt;
          if (goal.width >= goal.maxWidth) {
            goal.width = goal.maxWidth;
            goal.isExpanding = false;
          }
        } else {
          goal.width -= goal.expandSpeed * 60 * dt;
          if (goal.width <= goal.minWidth) {
            goal.width = goal.minWidth;
            goal.isExpanding = true;
          }
        }

        // Goalkeeper Movement & Recovering State
        const balls = ballsRef.current;
        const incomingBall = balls.find((b) => b.active && b.y < 270 && b.y > 60 && b.vy < 0);

        if (gk.diveTimer > 0) {
          gk.diveTimer--;
          if (gk.diveTimer <= 0) gk.diveState = 'idle';
        }

        if (gk.diveState !== 'recovering') {
          if (incomingBall) {
            const targetX = incomingBall.x - gk.width / 2;
            const gkDiff = targetX - gk.x;
            gk.x += Math.sign(gkDiff) * Math.min(gk.speed * 1.3 * 60 * dt, Math.abs(gkDiff));
          } else {
            gk.stateTimer = (gk.stateTimer || 60) - 1;
            if (gk.stateTimer <= 0) {
              const rand = Math.random();
              if (rand < 0.25) {
                gk.aiState = 'PAUSED';
                gk.stateTimer = Math.floor(20 + Math.random() * 30);
              } else if (rand < 0.62) {
                gk.aiState = 'MOVING_LEFT';
                gk.direction = -1;
                gk.stateTimer = Math.floor(30 + Math.random() * 60);
              } else {
                gk.aiState = 'MOVING_RIGHT';
                gk.direction = 1;
                gk.stateTimer = Math.floor(30 + Math.random() * 60);
              }
            }

            if (gk.aiState !== 'PAUSED') {
              gk.x += gk.speed * 0.85 * 60 * gk.direction * dt;
            }
          }

          const gkMinX = goal.x - 10;
          const gkMaxX = goal.x + goal.width + 10 - gk.width;
          if (gk.x <= gkMinX) {
            gk.x = gkMinX;
            gk.direction = 1;
          } else if (gk.x >= gkMaxX) {
            gk.x = gkMaxX;
            gk.direction = -1;
          }
        }

        // Defenders Movement: movimiento horizontal individual, no congelado
        const defenders = defendersRef.current;
        for (let i = 0; i < defenders.length; i++) {
          const def = defenders[i];
          if (def.isStunned) {
            def.stunTimer--;
            if (def.stunTimer <= 0) {
              def.isStunned = false;
            }
            continue;
          }

          if (def.tackleAnimTimer > 0) def.tackleAnimTimer--;

          def.stateTimer = (def.stateTimer || 60) - 1;
          if (def.stateTimer <= 0) {
            const r = Math.random();
            if (r < 0.48) {
              def.direction = -1;
              def.aiState = 'MOVING_LEFT';
            } else {
              def.direction = 1;
              def.aiState = 'MOVING_RIGHT';
            }
            def.stateTimer = Math.floor(50 + ((def.id * 31) % 50) + Math.random() * 40);
          }

          const currentSpeed = def.baseSpeed || 108;
          def.x += currentSpeed * (def.direction || 1) * dt;

          const minX = 35;
          const maxX = V_WIDTH - 35 - def.width;
          if (def.x <= minX) {
            def.x = minX;
            def.direction = 1;
            def.aiState = 'MOVING_RIGHT';
          } else if (def.x >= maxX) {
            def.x = maxX;
            def.direction = -1;
            def.aiState = 'MOVING_LEFT';
          }

          def.y = def.baseY;
        }

        // Update Balls & Collisions
        for (let bIdx = balls.length - 1; bIdx >= 0; bIdx--) {
          const ball = balls[bIdx];
          if (!ball.active) {
            balls.splice(bIdx, 1);
            continue;
          }

          ball.trail.push({
            x: ball.x,
            y: ball.y,
            alpha: 1,
            color: ball.isSuperShot ? '#facc15' : ball.isCurvedShot ? '#38bdf8' : ballSkin.trailColor
          });
          if (ball.trail.length > 8) ball.trail.shift();

          ball.x += ball.vx * dt;
          ball.y += ball.vy * dt;
          if (ball.isCurvedShot) {
            ball.vx += ball.curve * 324 * dt;
          } else {
            ball.vx += ball.curve * 144 * dt;
          }

          // Boundaries bounce
          if (ball.x - ball.radius < 25) {
            ball.x = 25 + ball.radius;
            ball.vx = Math.abs(ball.vx) * 0.8;
            retroAudio.playBounce();
          } else if (ball.x + ball.radius > V_WIDTH - 25) {
            ball.x = V_WIDTH - 25 - ball.radius;
            ball.vx = -Math.abs(ball.vx) * 0.8;
            retroAudio.playBounce();
          }

          // 1. Collision with Defenders
          for (const def of defenders) {
            if (
              ball.x + ball.radius > def.x &&
              ball.x - ball.radius < def.x + def.width &&
              ball.y + ball.radius > def.y &&
              ball.y - ball.radius < def.y + def.height
            ) {
              const phrase = DEFENDER_SPEECH_BUBBLES[Math.floor(Math.random() * DEFENDER_SPEECH_BUBBLES.length)];

              if (ball.isSuperShot || ball.isCurvedShot) {
                if (ball.piercedCount < 2) {
                  ball.piercedCount++;
                  def.isStunned = true;
                  def.stunTimer = 110;
                  spawnTurfSparks(def.x + def.width / 2, def.y + def.height / 2, false);
                  retroAudio.playDefenderHit(ball.piercedCount);
                  triggerSpeechBubble('Â¡Â¡KO!! Â¡QuÃ© zapatazo!', def.x, def.y);
                  addFloatingText(
                    `ð¥ Â¡SUPERA DEFENSOR! (${ball.piercedCount}/2)`,
                    def.x - 25,
                    def.y - 12,
                    ball.isSuperShot ? '#facc15' : '#38bdf8',
                    13
                  );
                  matchEngine.registerDefenderDeflection(String(def.id), false, true, true);
                } else {
                  ball.active = false;
                  def.tackleAnimTimer = 25;
                  spawnTurfSparks(ball.x, ball.y, false);
                  retroAudio.playDefenderBlock();
                  triggerSpeechBubble('Â¡Frenado heroico!', def.x, def.y);
                  addFloatingText('â Â¡FRENADO AL 3ER JUGADOR!', def.x - 30, def.y - 10, '#ef4444', 14);
                  matchEngine.registerDefenderDeflection(String(def.id), false, false, false);
                  onShotMissed();
                  break;
                }
              } else {
                if (ball.bounceCount < 2) {
                  ball.bounceCount++;
                  def.tackleAnimTimer = 15;
                  // Rebote fÃ­sico hacia abajo/afuera del defensor (para no re-colisionar de inmediato)
                  ball.vy = Math.abs(ball.vy) * 0.65;
                  const hitSide = ball.x < def.x + def.width / 2 ? -1 : 1;
                  ball.vx = hitSide * (168 + Math.random() * 132);
                  ball.y = def.y + def.height + ball.radius + 4;

                  spawnTurfSparks(ball.x, ball.y, true);
                  retroAudio.playDefenderHit(ball.bounceCount);
                  triggerSpeechBubble(phrase, def.x, def.y);
                  addFloatingText(`Â¡REBOTE! (${ball.bounceCount}/2)`, def.x - 10, def.y - 10, '#38bdf8', 13);
                  matchEngine.registerDefenderDeflection(String(def.id), false, false, false);
                } else {
                  ball.active = false;
                  def.tackleAnimTimer = 20;
                  spawnTurfSparks(ball.x, ball.y, true);
                  retroAudio.playDefenderBlock();
                  triggerSpeechBubble('Â¡MÃ­o el balÃ³n!', def.x, def.y);
                  addFloatingText('Â¡BALÃN PERDIDO!', def.x - 15, def.y - 10, '#ef4444', 15);
                  matchEngine.registerLossOfPossession('DEFENDER_INTERCEPTION');
                  onShotMissed();
                  break;
                }
              }
            }
          }

          if (!ball.active) continue;

          // 2. Collision with Goalkeeper
          if (
            ball.x + ball.radius > gk.x - 6 &&
            ball.x - ball.radius < gk.x + gk.width + 6 &&
            ball.y - ball.radius < gk.y + gk.height &&
            ball.y + ball.radius > gk.y
          ) {
            if (gk.diveState === 'recovering') {
              // Arquero recuperÃ¡ndose: gol cantado
            } else if (ball.isSuperShot) {
              gk.diveState = 'recovering';
              const recoveryFrames = Math.round(matchEngine.getGoalkeeperRecoveryTime(rivalDifficulty * 3.5) * 60);
              gk.diveTimer = recoveryFrames;
              spawnTurfSparks(gk.x + gk.width / 2, gk.y + gk.height / 2, false);
              retroAudio.playBounce();
              addFloatingText('Â¡QUEMÃ LOS GUANTES!', gk.x - 30, gk.y + 20, '#facc15', 14);
            } else {
              ball.active = false;
              gk.diveState = ball.x < gk.x + gk.width / 2 ? 'diving_left' : 'diving_right';
              gk.diveTimer = 35;
              retroAudio.playSave();
              spawnTurfSparks(ball.x, ball.y, false);
              addFloatingText('ð§¤ Â¡ATAJADÃN!', gk.x - 20, gk.y + 20, '#38bdf8', 16);
              matchEngine.registerKeeperSave('CATCH', rivalDifficulty * 3.5);
              onShotMissed();
              continue;
            }
          }

          // 3. Collision with Goal Net
          if (ball.y - ball.radius <= goal.y + goal.height - 10) {
            if (ball.x >= goal.x && ball.x <= goal.x + goal.width) {
              const widthRatio = (goal.maxWidth - goal.width) / (goal.maxWidth - goal.minWidth);
              let multiplier = 1;
              let multiplierLabel = 'x1';
              if (widthRatio > 0.75) {
                multiplier = 4;
                multiplierLabel = 'x4 GOLAZO AL ÃNGULO';
              } else if (widthRatio > 0.45) {
                multiplier = 2.5;
                multiplierLabel = 'x2.5 GRAN DISPARO';
              } else if (widthRatio > 0.2) {
                multiplier = 1.5;
                multiplierLabel = 'x1.5 BUEN TIRO';
              }

              const baseGoalPoints = 150;
              const totalPoints = Math.round(
                baseGoalPoints * multiplier * (ball.isSuperShot ? 1.5 : ball.isCurvedShot ? 1.3 : 1)
              );

              ball.active = false;
              screenShakeRef.current = 15;
              goalCelebrationTimerRef.current = 60;
              spawnGoalParticles(ball.x, goal.y + 20, ballSkin.primaryColor);
              retroAudio.playGoal();

              player.superCharge = Math.min(100, player.superCharge + 18);
              if (onSuperChargedChange) onSuperChargedChange(player.superCharge);

              addFloatingText(
                `Â¡Â¡GOOOOL!! +${totalPoints} PTS (${multiplierLabel})`,
                goal.x + goal.width / 2 - 100,
                goal.y + 70,
                '#facc15',
                20
              );

              matchEngine.registerGoal(ball.isSuperShot, ball.isCurvedShot, multiplier, totalPoints);
              onGoalScored(multiplier, totalPoints);
              continue;
            } else {
              ball.active = false;
              spawnTurfSparks(ball.x, ball.y, true);
              retroAudio.playBounce();
              addFloatingText('Â¡FUERA!', ball.x - 20, ball.y + 20, '#94a3b8', 14);
              matchEngine.registerBallOut();
              onShotMissed();
            }
          }

          if (ball.y < -30 || ball.y > V_HEIGHT + 30) {
            ball.active = false;
          }
        }

        // Floating texts update
        const fTexts = floatingTextsRef.current;
        for (let i = fTexts.length - 1; i >= 0; i--) {
          const t = fTexts[i];
          t.y -= 0.8;
          t.life++;
          if (t.life > 45) t.alpha -= 0.03;
          if (t.alpha <= 0) fTexts.splice(i, 1);
        }

        // Particles update
        const particles = particlesRef.current;
        for (let i = particles.length - 1; i >= 0; i--) {
          const p = particles[i];
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.15;
          p.life++;
          if (p.life >= p.maxLife) particles.splice(i, 1);
        }

        // Speech bubbles update
        const speechBubbles = speechBubblesRef.current;
        for (let i = speechBubbles.length - 1; i >= 0; i--) {
          const b = speechBubbles[i];
          b.maxLife = (b.maxLife || 70) - 1;
          if (b.maxLife <= 0) speechBubbles.splice(i, 1);
        }

        if (goalCelebrationTimerRef.current > 0) {
          goalCelebrationTimerRef.current--;
        }
      }

      // --- 2. RENDER PIPELINE ---
      ctx.clearRect(0, 0, V_WIDTH, V_HEIGHT);

      ctx.save();
      if (screenShakeRef.current > 0) {
        const shakeX = (Math.random() - 0.5) * screenShakeRef.current;
        const shakeY = (Math.random() - 0.5) * screenShakeRef.current;
        ctx.translate(shakeX, shakeY);
        screenShakeRef.current *= 0.85;
        if (screenShakeRef.current < 0.5) screenShakeRef.current = 0;
      }

      // 1. Pitch Turf
      const stripeHeight = 40;
      for (let y = 0; y < V_HEIGHT; y += stripeHeight) {
        ctx.fillStyle = (y / stripeHeight) % 2 === 0 ? '#15803d' : '#166534';
        ctx.fillRect(0, y, V_WIDTH, stripeHeight);
      }

      // Pitch Boundary Markings
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.lineWidth = 3;
      ctx.strokeRect(25, 15, V_WIDTH - 50, V_HEIGHT - 30);
      ctx.strokeRect(V_WIDTH / 2 - 140, 15, 280, 125);
      ctx.strokeRect(V_WIDTH / 2 - 70, 15, 140, 45);

      // Penalty Spot & Arc
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.beginPath();
      ctx.arc(V_WIDTH / 2, 95, 3.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(V_WIDTH / 2, 95, 45, 0.15 * Math.PI, 0.85 * Math.PI);
      ctx.stroke();

      // Goal Post & Dynamic Net Rendering
      const goal = goalRef.current;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
      ctx.fillRect(goal.x, goal.y, goal.width, goal.height);

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 1;
      const netGrid = 9;
      for (let gx = goal.x; gx <= goal.x + goal.width; gx += netGrid) {
        ctx.beginPath();
        ctx.moveTo(gx, goal.y);
        ctx.lineTo(gx, goal.y + goal.height);
        ctx.stroke();
      }
      for (let gy = goal.y; gy <= goal.y + goal.height; gy += netGrid) {
        ctx.beginPath();
        ctx.moveTo(goal.x, gy);
        ctx.lineTo(goal.x + goal.width, gy);
        ctx.stroke();
      }

      // Goal Frame (White Post)
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(goal.x, goal.y + goal.height);
      ctx.lineTo(goal.x, goal.y);
      ctx.lineTo(goal.x + goal.width, goal.y);
      ctx.lineTo(goal.x + goal.width, goal.y + goal.height);
      ctx.stroke();

      // 2. Render Goalkeeper
      const gk = goalkeeperRef.current;
      renderProportionalCharacterSprite(ctx, {
        x: gk.x,
        y: gk.y,
        width: gk.width,
        height: gk.height,
        isBackView: false,
        isGoalie: true,
        diveState: gk.diveState,
        custom: {
          name: 'ARQUERO',
          number: 1,
          pattern: 'solid',
          shirtColor: gk.diveState === 'recovering' ? '#94a3b8' : gk.shirtColor,
          secondaryShirtColor: '#000000',
          shortsColor: '#172554',
          socksColor: '#ffffff',
          bootsColor: '#f97316',
          hairColor: '#451a03',
          hairStyle: 'classic',
          skinTone: '#e2a878',
          ballId: 'ball-classic',
        }
      });

      // 3. Render Defenders
      const defenders = defendersRef.current;
      for (const def of defenders) {
        if (def.isStunned) {
          ctx.save();
          ctx.translate(def.x + def.width / 2, def.y + def.height / 2);
          ctx.rotate(Math.PI / 2);
          renderProportionalCharacterSprite(ctx, {
            x: -def.width / 2,
            y: -def.height / 2,
            width: def.width,
            height: def.height,
            isBackView: false,
            isStunned: true,
            custom: {
              name: `DEF ${def.number}`,
              number: def.number,
              pattern: def.pattern,
              shirtColor: def.shirtColor,
              secondaryShirtColor: def.secondaryShirtColor,
              shortsColor: def.shortsColor,
              socksColor: def.shirtColor,
              bootsColor: '#111827',
              hairColor: def.hairColor,
              hairStyle: def.hairStyle as any,
              skinTone: def.skinTone,
              ballId: 'ball-classic',
            }
          });
          ctx.restore();

          const starAngle = (Date.now() / 150) % (Math.PI * 2);
          ctx.fillStyle = '#facc15';
          ctx.font = '12px monospace';
          ctx.fillText('ð«', def.x + Math.cos(starAngle) * 12 + 6, def.y - 12 + Math.sin(starAngle) * 4);
        } else {
          renderProportionalCharacterSprite(ctx, {
            x: def.x,
            y: def.y,
            width: def.width,
            height: def.height,
            isBackView: false,
            custom: {
              name: `DEF ${def.number}`,
              number: def.number,
              pattern: def.pattern,
              shirtColor: def.shirtColor,
              secondaryShirtColor: def.secondaryShirtColor,
              shortsColor: def.shortsColor,
              socksColor: def.shirtColor,
              bootsColor: '#111827',
              hairColor: def.hairColor,
              hairStyle: def.hairStyle as any,
              skinTone: def.skinTone,
              ballId: 'ball-classic',
            }
          });
        }
      }

      // 4. Render Player
      const player = playerRef.current;
      renderProportionalCharacterSprite(ctx, {
        x: player.x,
        y: player.y,
        width: player.width,
        height: player.height,
        isBackView: true,
        isKicking: player.isKicking,
        kickTimer: player.kickTimer,
        custom: playerCustom
      });

      // 5. Render Active Balls & Glow Trails
      const balls = ballsRef.current;
      for (const ball of balls) {
        if (!ball.active) continue;

        for (let i = 0; i < ball.trail.length; i++) {
          const t = ball.trail[i];
          ctx.fillStyle = t.color;
          ctx.globalAlpha = (i / ball.trail.length) * 0.6;
          ctx.beginPath();
          ctx.arc(t.x, t.y, ball.radius * 0.75, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 1.0;

        ctx.fillStyle = 'rgba(0,0,0,0.3)';
        ctx.beginPath();
        ctx.ellipse(ball.x, ball.y + 6, ball.radius, ball.radius * 0.4, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = ball.isSuperShot ? '#facc15' : ball.isCurvedShot ? '#38bdf8' : ballSkin.primaryColor;
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = ball.isSuperShot ? '#ef4444' : ball.isCurvedShot ? '#ffffff' : ballSkin.secondaryColor;
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius * 0.4, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // 6. Render Particles
      const particles = particlesRef.current;
      for (const p of particles) {
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, 1 - p.life / p.maxLife);
        ctx.fillRect(p.x, p.y, p.size, p.size);
      }
      ctx.globalAlpha = 1.0;

      // 7. Render Floating Texts
      const fTexts = floatingTextsRef.current;
      for (const t of fTexts) {
        ctx.save();
        ctx.globalAlpha = t.alpha;
        ctx.font = `bold ${t.size}px "Courier New", monospace`;
        ctx.fillStyle = '#000000';
        ctx.fillText(t.text, t.x + 2, t.y + 2);
        ctx.fillStyle = t.color;
        ctx.fillText(t.text, t.x, t.y);
        ctx.restore();
      }

      // 8. Render Speech Bubbles
      const speechBubbles = speechBubblesRef.current;
      for (const b of speechBubbles) {
        ctx.save();
        ctx.font = 'bold 11px monospace';
        const textWidth = ctx.measureText(b.text).width;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
        ctx.strokeStyle = '#facc15';
        ctx.lineWidth = 1.5;
        ctx.fillRect(b.x - textWidth / 2 - 6, b.y - 16, textWidth + 12, 20);
        ctx.strokeRect(b.x - textWidth / 2 - 6, b.y - 16, textWidth + 12, 20);
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.fillText(b.text, b.x, b.y - 2);
        ctx.restore();
      }

      ctx.restore();

      animationFrameId = requestAnimationFrame(gameLoop);
    };

    animationFrameId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isPaused, ballSkin, matchEngine, onGoalScored, onShotMissed, onSuperChargedChange, onMatchEngineUpdate, rivalDifficulty]);

  return (
    <div
      ref={containerRef}
      id="retro-canvas-wrapper"
      className="relative w-full max-w-4xl mx-auto rounded-2xl overflow-hidden border-4 border-[#8c501c] bg-[#0c0803] shadow-[0_15px_50px_rgba(0,0,0,0.9)] flex flex-col items-center select-none"
    >
      {/* 1. NON-INTRUSIVE TOP HUD BANNER FOR RIVAL COUNTER-ATTACK */}
      {engineSnapshot.activeCounters.length > 0 && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 bg-gradient-to-r from-red-950 via-red-800 to-red-950 px-4 py-1.5 rounded-full border-2 border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.8)] animate-pulse">
          <AlertTriangle className="w-4 h-4 text-yellow-300 animate-bounce" />
          <span className="font-arcade text-xs text-white font-bold tracking-wider">
            {engineSnapshot.activeCounters[0].isGoal ? 'â¡ Â¡CONTRA RIVAL PELIGROSA!' : 'â¡ Â¡CONTRA RIVAL EN CURSO!'}
          </span>
        </div>
      )}

      {/* 2. RESUME COUNTDOWN OVERLAY ("2...", "1...", "Â¡YA!") */}
      {engineSnapshot.state === 'RESUME_COUNTDOWN' && (
        <div className="absolute inset-0 z-40 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center">
          <span className="font-arcade text-6xl text-yellow-400 font-black animate-ping drop-shadow-[0_4px_20px_rgba(250,204,21,0.9)]">
            {Math.ceil(engineSnapshot.resumeCountdownSeconds) === 0
              ? 'Â¡YA!'
              : Math.ceil(engineSnapshot.resumeCountdownSeconds)}
          </span>
          <span className="text-sm font-arcade text-white mt-4 uppercase tracking-widest">Â¡REANUDANDO JUEGO!</span>
        </div>
      )}

      {/* 3. PENALTY MINIGAME OVERLAY (6 QUADRANTS) */}
      {engineSnapshot.state === 'PENALTY' && engineSnapshot.pendingPenalty && (
        <div className="absolute inset-0 z-50 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-4 text-white font-mono animate-fadeIn">
          <div className="w-full max-w-md bg-gradient-to-b from-[#2b1706] to-[#140b03] border-4 border-yellow-500 rounded-2xl p-5 shadow-2xl flex flex-col items-center text-center">
            <div className="px-3 py-1 bg-yellow-500 text-black font-arcade text-xs font-bold rounded mb-2">
              Â¡PENALTI A FAVOR!
            </div>
            <h3 className="font-arcade text-sm sm:text-base text-yellow-300 mb-1">ELIGE TU CUADRANTE DE DISPARO</h3>
            <span className="text-[10px] text-amber-200/80 mb-3">
              Tiempo para decidir: <strong className="text-red-400 text-xs">{Math.ceil(engineSnapshot.pendingPenalty.timeLimitSeconds)}s</strong>
            </span>

            {/* 6 Quadrant Grid (2 Rows x 3 Cols) */}
            <div className="grid grid-cols-3 gap-2 w-full mb-4">
              {(
                [
                  { id: 'TOP_LEFT', label: 'â ARRIBA IZQ' },
                  { id: 'TOP_CENTER', label: 'â¬ AL CENTRO' },
                  { id: 'TOP_RIGHT', label: 'â ARRIBA DER' },
                  { id: 'BOTTOM_LEFT', label: 'â RASO IZQ' },
                  { id: 'BOTTOM_CENTER', label: 'â¬ RASO CENTRO' },
                  { id: 'BOTTOM_RIGHT', label: 'â RASO DER' },
                ] as { id: PenaltyQuadrant; label: string }[]
              ).map((quad) => (
                <button
                  key={quad.id}
                  type="button"
                  disabled={engineSnapshot.pendingPenalty?.status === 'RESOLVED'}
                  onClick={() => {
                    retroAudio.playKick(true);
                    matchEngine.executePenaltyDecision(quad.id);
                  }}
                  className="py-3 px-1.5 bg-[#170e06] hover:bg-yellow-600/30 active:scale-95 border-2 border-yellow-500/60 hover:border-yellow-400 rounded-lg font-arcade text-[10px] sm:text-xs text-yellow-300 transition-all flex flex-col items-center justify-center gap-1 shadow-inner disabled:opacity-50"
                >
                  <Crosshair className="w-4 h-4 text-yellow-400" />
                  <span>{quad.label}</span>
                </button>
              ))}
            </div>

            {engineSnapshot.pendingPenalty.status === 'RESOLVED' && (
              <div className="font-arcade text-base font-bold text-emerald-400 animate-bounce">
                {engineSnapshot.pendingPenalty.isGoal ? 'â½ Â¡Â¡GOOOOOOL DE PENALTI!!' : 'ð§¤ Â¡ATAJÃ EL ARQUERO!'}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. FREE KICK MINIGAME OVERLAY (3 ZONES + TECHNIQUE) */}
      {engineSnapshot.state === 'FREE_KICK' && engineSnapshot.pendingFreeKick && (
        <div className="absolute inset-0 z-50 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-4 text-white font-mono animate-fadeIn">
          <div className="w-full max-w-lg bg-gradient-to-b from-[#2b1706] to-[#140b03] border-4 border-cyan-500 rounded-2xl p-5 shadow-2xl flex flex-col items-center text-center">
            <div className="px-3 py-1 bg-cyan-500 text-black font-arcade text-xs font-bold rounded mb-2">
              Â¡TIRO LIBRE DIRECTO!
            </div>
            <h3 className="font-arcade text-sm sm:text-base text-cyan-300 mb-1">CONFIGURA TU TIRO A PUERTA</h3>
            <span className="text-[10px] text-amber-200/80 mb-3">
              Tiempo para ejecutar: <strong className="text-red-400 text-xs">{Math.ceil(engineSnapshot.pendingFreeKick.timeLimitSeconds)}s</strong>
            </span>

            {/* Zone Selection (3 Options) */}
            <div className="w-full mb-3 text-left">
              <span className="text-[10px] text-amber-300/80 uppercase font-bold block mb-1">1. ZONA DE IMPACTO:</span>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'LEFT', label: 'ð POSTE IZQUIERDO' },
                  { id: 'CENTER', label: 'ð§± POR ARRIBA DE BARRERA' },
                  { id: 'RIGHT', label: 'ð POSTE DERECHO' },
                ].map((z) => (
                  <button
                    key={z.id}
                    type="button"
                    onClick={() => setSelectedFreeKickZone(z.id as FreeKickZone)}
                    className={`py-2 px-1 rounded border text-[9px] font-arcade transition-all ${
                      selectedFreeKickZone === z.id
                        ? 'bg-cyan-600 text-white border-cyan-300 font-bold shadow'
                        : 'bg-[#170e06] text-gray-300 border-[#59300e] hover:bg-[#251508]'
                    }`}
                  >
                    {z.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Technique Selection (3 Options) */}
            <div className="w-full mb-4 text-left">
              <span className="text-[10px] text-amber-300/80 uppercase font-bold block mb-1">2. TÃCNICA DE EJECUCIÃN:</span>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'POWER', label: 'â¡ POTENCIA PURA' },
                  { id: 'CURVE', label: 'ð EFECTO CHANFLE' },
                  { id: 'PLACEMENT', label: 'ð¯ COLOCACIÃN' },
                ].map((tech) => (
                  <button
                    key={tech.id}
                    type="button"
                    onClick={() => setSelectedFreeKickTech(tech.id as FreeKickTechnique)}
                    className={`py-2 px-1 rounded border text-[9px] font-arcade transition-all ${
                      selectedFreeKickTech === tech.id
                        ? 'bg-yellow-600 text-white border-yellow-300 font-bold shadow'
                        : 'bg-[#170e06] text-gray-300 border-[#59300e] hover:bg-[#251508]'
                    }`}
                  >
                    {tech.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Shoot Button */}
            <button
              type="button"
              disabled={engineSnapshot.pendingFreeKick.status === 'RESOLVED'}
              onClick={() => {
                retroAudio.playKick(true);
                matchEngine.executeFreeKickDecision(selectedFreeKickZone, selectedFreeKickTech);
              }}
              className="w-full py-3 bg-gradient-to-r from-cyan-600 via-blue-600 to-cyan-600 hover:from-cyan-500 hover:to-blue-500 active:scale-95 text-white font-arcade text-xs font-bold rounded-xl border-2 border-cyan-300 shadow-xl transition-all disabled:opacity-50"
            >
              Â¡CHUTAR TIRO LIBRE!
            </button>

            {engineSnapshot.pendingFreeKick.status === 'RESOLVED' && (
              <div className="font-arcade text-base font-bold text-emerald-400 mt-2 animate-bounce">
                {engineSnapshot.pendingFreeKick.isGoal ? 'â½ Â¡Â¡GOLAZO DE TIRO LIBRE!!' : 'â EL TIRO SE FUE O FUE ATAJADO'}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main HTML5 Canvas Element */}
      <canvas
        ref={canvasRef}
        width={V_WIDTH}
        height={V_HEIGHT}
        className="w-full h-auto aspect-[4/3] block bg-[#15803d]"
        style={{ imageRendering: 'pixelated' }}
      />

      {/* MOBILE & DESKTOP TOUCH CONTROLS BAR (ALWAYS ACCESSIBLE DURING PLAYING) */}
      <div
        id="touch-controls-bar"
        className="w-full bg-gradient-to-b from-[#180e05] to-[#0d0702] p-2 sm:p-2.5 border-t-2 border-[#59300e] flex items-center justify-between gap-2 select-none touch-none touch-control pb-[max(0.5rem,env(safe-area-inset-bottom))]"
        onContextMenu={(e) => e.preventDefault()}
        style={{
          touchAction: 'none',
          WebkitTouchCallout: 'none',
          WebkitUserSelect: 'none',
          userSelect: 'none'
        }}
      >
        {/* Left Control Cluster: Movement (IZQUIERDA / DERECHA) */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* BotÃ³n IZQUIERDA */}
          <button
            type="button"
            id="btn-ctrl-left"
            draggable={false}
            onPointerDown={(e) => {
              e.preventDefault();
              try {
                (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
              } catch {}
              touchInputRef.current.left = true;
            }}
            onPointerUp={(e) => {
              e.preventDefault();
              try {
                (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
              } catch {}
              touchInputRef.current.left = false;
            }}
            onPointerLeave={() => {
              touchInputRef.current.left = false;
            }}
            onPointerCancel={() => {
              touchInputRef.current.left = false;
            }}
            onLostPointerCapture={() => {
              touchInputRef.current.left = false;
            }}
            onContextMenu={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            className="w-14 h-12 sm:w-16 sm:h-13 bg-gradient-to-b from-[#2d1908] to-[#170c04] active:from-[#4a280c] active:to-[#2d1908] border-2 border-amber-600/70 hover:border-amber-400 active:border-yellow-300 rounded-xl flex flex-col items-center justify-center text-amber-200 active:text-yellow-300 font-arcade shadow-[0_4px_10px_rgba(0,0,0,0.6)] active:scale-95 transition-transform cursor-pointer touch-control"
            style={{
              touchAction: 'none',
              WebkitTouchCallout: 'none',
              WebkitUserSelect: 'none',
              userSelect: 'none'
            }}
          >
            <span className="text-base sm:text-lg leading-none select-none">â</span>
            <span className="text-[8px] sm:text-[9px] font-bold tracking-tighter select-none">IZQ</span>
          </button>

          {/* BotÃ³n DERECHA */}
          <button
            type="button"
            id="btn-ctrl-right"
            draggable={false}
            onPointerDown={(e) => {
              e.preventDefault();
              try {
                (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
              } catch {}
              touchInputRef.current.right = true;
            }}
            onPointerUp={(e) => {
              e.preventDefault();
              try {
                (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
              } catch {}
              touchInputRef.current.right = false;
            }}
            onPointerLeave={() => {
              touchInputRef.current.right = false;
            }}
            onPointerCancel={() => {
              touchInputRef.current.right = false;
            }}
            onLostPointerCapture={() => {
              touchInputRef.current.right = false;
            }}
            onContextMenu={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            className="w-14 h-12 sm:w-16 sm:h-13 bg-gradient-to-b from-[#2d1908] to-[#170c04] active:from-[#4a280c] active:to-[#2d1908] border-2 border-amber-600/70 hover:border-amber-400 active:border-yellow-300 rounded-xl flex flex-col items-center justify-center text-amber-200 active:text-yellow-300 font-arcade shadow-[0_4px_10px_rgba(0,0,0,0.6)] active:scale-95 transition-transform cursor-pointer touch-control"
            style={{
              touchAction: 'none',
              WebkitTouchCallout: 'none',
              WebkitUserSelect: 'none',
              userSelect: 'none'
            }}
          >
            <span className="text-base sm:text-lg leading-none select-none">â¶</span>
            <span className="text-[8px] sm:text-[9px] font-bold tracking-tighter select-none">DER</span>
          </button>
        </div>

        {/* Right Control Cluster: Actions (TIRO / CURVO / SUPER) */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* BotÃ³n TIRO CURVO */}
          <button
            type="button"
            id="btn-ctrl-curve"
            draggable={false}
            onPointerDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              try { (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId); } catch {}
              shootBall(false, true);
            }}
            onPointerUp={(e) => { try { (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId); } catch {} }}
            onPointerCancel={(e) => { try { (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId); } catch {} }}
            onDragStart={(e) => e.preventDefault()}
            onContextMenu={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            className="h-12 sm:h-13 px-2 sm:px-3 bg-gradient-to-b from-sky-950 to-[#071c2b] active:from-sky-800 active:to-sky-950 border-2 border-sky-500/70 hover:border-sky-400 active:border-cyan-300 rounded-xl flex flex-col items-center justify-center text-sky-200 active:text-cyan-100 font-arcade shadow-[0_4px_10px_rgba(0,0,0,0.6)] active:scale-95 transition-transform cursor-pointer touch-control"
            style={{
              touchAction: 'none',
              WebkitTouchCallout: 'none',
              WebkitUserSelect: 'none',
              userSelect: 'none'
            }}
          >
            <span className="text-sm sm:text-base leading-none select-none">ð</span>
            <span className="font-bold tracking-tighter text-[8px] sm:text-[9px] select-none">CURVO</span>
          </button>

          {/* BotÃ³n SUPER TIRO */}
          <button
            type="button"
            id="btn-ctrl-super"
            draggable={false}
            disabled={superChargeState < 50}
            onPointerDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              try { (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId); } catch {}
              if (superChargeState >= 50) {
                shootBall(true, false);
              }
            }}
            onPointerUp={(e) => { try { (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId); } catch {} }}
            onPointerCancel={(e) => { try { (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId); } catch {} }}
            onDragStart={(e) => e.preventDefault()}
            onContextMenu={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            className={`h-12 sm:h-13 px-2.5 sm:px-3.5 bg-gradient-to-b rounded-xl flex flex-col items-center justify-center font-arcade shadow-[0_4px_10px_rgba(0,0,0,0.6)] active:scale-95 transition-transform border-2 touch-control ${
              superChargeState >= 50
                ? 'from-amber-900 to-[#3b1d03] active:from-yellow-600 active:to-amber-800 border-yellow-400 text-yellow-300 animate-pulse shadow-[0_0_12px_rgba(250,204,21,0.5)] cursor-pointer'
                : 'from-[#1a1005] to-[#0d0702] border-amber-900/40 text-amber-500/30 opacity-50 cursor-not-allowed'
            }`}
            style={{
              touchAction: 'none',
              WebkitTouchCallout: 'none',
              WebkitUserSelect: 'none',
              userSelect: 'none'
            }}
          >
            <span className="text-sm sm:text-base leading-none select-none">â¡</span>
            <span className="font-bold tracking-tighter text-[8px] sm:text-[9px] select-none">SUPER</span>
          </button>

          {/* BotÃ³n TIRO NORMAL */}
          <button
            type="button"
            id="btn-ctrl-shoot"
            draggable={false}
            onPointerDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              try { (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId); } catch {}
              shootBall(false, false);
            }}
            onPointerUp={(e) => { try { (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId); } catch {} }}
            onPointerCancel={(e) => { try { (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId); } catch {} }}
            onDragStart={(e) => e.preventDefault()}
            onContextMenu={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            className="h-12 sm:h-13 px-3.5 sm:px-4.5 bg-gradient-to-b from-emerald-800 to-emerald-950 active:from-emerald-600 active:to-emerald-900 border-2 border-emerald-400 hover:border-emerald-300 active:border-emerald-200 rounded-xl flex flex-col items-center justify-center text-white active:text-yellow-200 font-arcade shadow-[0_4px_12px_rgba(16,185,129,0.4)] active:scale-95 transition-transform cursor-pointer touch-control"
            style={{
              touchAction: 'none',
              WebkitTouchCallout: 'none',
              WebkitUserSelect: 'none',
              userSelect: 'none'
            }}
          >
            <span className="text-base sm:text-lg leading-none select-none">â½</span>
            <span className="font-bold tracking-wider text-[9px] sm:text-[10px] select-none">TIRO</span>
          </button>
        </div>
      </div>

      {/* DEBUG TELEMETRY OVERLAY TOGGLE */}
      <div className="w-full bg-[#120a03] p-1.5 px-3 border-t border-[#59300e] flex items-center justify-between text-[8px] font-mono text-amber-200/70">
        <div className="flex items-center gap-2">
          <span>MATCH ENGINE v1.0 â¢ ESTADO: <strong className="text-cyan-300">{engineSnapshot.state}</strong></span>
          <span>â¢</span>
          <span>TIEMPO: <strong className="text-yellow-300">{engineSnapshot.timeRemaining.toFixed(1)}s</strong></span>
        </div>

        <button
          type="button"
          onClick={() => setShowDebugOverlay((p) => !p)}
          className="text-amber-400 hover:underline font-bold"
        >
          {showDebugOverlay ? 'OCULTAR TELEMETRÃA' : 'VER TELEMETRÃA QA'}
        </button>
      </div>

      {showDebugOverlay && (
        <div className="w-full bg-[#0a0502] p-2.5 text-[9px] font-mono text-cyan-300 border-t border-[#59300e] flex flex-col gap-2">
          {/* Match & Pressure Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div>PRESIÃN: {engineSnapshot.rivalPressure.toFixed(1)}%</div>
            <div>RELOJ TIRO: {engineSnapshot.shootingClock.toFixed(1)}s</div>
            <div>DISPAROS: {engineSnapshot.stats.totalShots} (A PUERTA: {engineSnapshot.stats.shotsOnTarget})</div>
            <div>CONTRAS RIVAL: {engineSnapshot.stats.rivalCountersGenerated} (GOLES: {engineSnapshot.stats.rivalCounterGoals})</div>
          </div>

          {/* QA Movement & Combat Telemetry */}
          <div className="pt-1.5 border-t border-[#59300e]/60 grid grid-cols-1 sm:grid-cols-2 gap-1 text-[8px] text-yellow-200/90 bg-[#120803] p-2 rounded">
            <div><strong>PLAYER SPEED:</strong> {calibratedPlayerSpeed.toFixed(1)} u/s (~{(692 / calibratedPlayerSpeed).toFixed(1)}s cruce)</div>
            <div><strong>DIVISION SPEED MODIFIER:</strong> 1.00 (Div 23 Base)</div>
            <div><strong>FIRE RATE / COOLDOWN:</strong> {Math.max(0.13, 0.33 - (fireRateLevel - 1) * 0.025).toFixed(2)}s (Lvl {fireRateLevel})</div>
            <div><strong>SHOT VELOCITY:</strong> Normal {(-560 - (shotVelocityLevel - 1) * 21).toFixed(0)} u/s | Super {(-650 - (shotVelocityLevel - 1) * 24).toFixed(0)} u/s | Curvo {(-520 - (shotVelocityLevel - 1) * 21).toFixed(0)} u/s</div>
            <div><strong>DEFENDER SPEED RANGE:</strong> 105 - 116 u/s (~6.0s - 6.6s)</div>
            <div><strong>ACTIVE BALLS:</strong> {ballsRef.current.filter((b) => b.active).length}</div>
            <div><strong>LAST SHOT TYPE:</strong> {lastShotTypeRef.current}</div>
          </div>
        </div>
      )}
    </div>
  );
};
