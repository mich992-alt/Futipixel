// MATCH ENGINE v1.0 — IMPLEMENTACIÓN OFICIAL
// Máquina de estados independiente que rige el desarrollo del partido, reloj, presión, contras, penales y tiros libres.

import { MATCH_CONFIG } from './matchConfig';
import {
  CounterAttackEvent,
  FreeKickTechnique,
  FreeKickZone,
  MatchContext,
  MatchDebugEntry,
  MatchSnapshot,
  MatchState,
  MatchStats,
  PenaltyQuadrant,
} from './matchTypes';
import { PersistentPlayer } from '../league/leagueTypes';

export class MatchEngine {
  private context: MatchContext;
  private state: MatchState = 'PLAYING';
  private timeRemaining: number = MATCH_CONFIG.BASE_MATCH_DURATION;
  private overtimePeriodIndex: number = 0;
  private isOvertime: boolean = false;

  private userScore: number = 0;
  private rivalScore: number = 0;
  private rivalPressure: number = MATCH_CONFIG.PRESSURE.INITIAL;

  private shootingClock: number;
  private shootingClockMax: number;
  private timeSinceLastDangerousLoss: number = 0;

  // Secuencia de desvíos consecutivos para penal / tiro libre / delantero
  private lastDeflectorPlayerId: string | null = null;
  private consecutiveDeflectionsCount: number = 0;

  private activeCounters: CounterAttackEvent[] = [];
  private activeBallCount: number = 0;

  // Pausa y Reanudación
  private isPaused: boolean = false;
  private resumeCountdownSeconds: number = 0;
  private resumePostSetPieceTimer: number = 0;

  // Pelotas paradas
  private pendingPenalty?: {
    timeLimitSeconds: number;
    selectedQuadrant?: PenaltyQuadrant;
    status: 'DECIDING' | 'RESOLVED';
    isGoal?: boolean;
  };
  private pendingFreeKick?: {
    zone: FreeKickZone;
    timeLimitSeconds: number;
    selectedDirection?: FreeKickZone;
    selectedTechnique?: FreeKickTechnique;
    status: 'DECIDING' | 'RESOLVED';
    isGoal?: boolean;
  };

  private stats: MatchStats;
  private debugLog: MatchDebugEntry[] = [];
  public isDebugEnabled: boolean = MATCH_CONFIG.DEBUG_MODE_DEFAULT;

  constructor(context: MatchContext) {
    this.context = context;
    this.shootingClockMax = this.getShootingClockMaxForDivision(context.divisionId);
    this.shootingClock = this.shootingClockMax;

    this.stats = {
      userGoals: 0,
      rivalGoals: 0,
      totalShots: 0,
      shotsOnTarget: 0,
      shotsOffTarget: 0,
      shotsBlockedByPlayers: 0,
      shotsBlockedByKeeper: 0,
      shotAccuracyPercent: 0,
      normalGoals: 0,
      powerOrSuperGoals: 0,
      rivalCountersGenerated: 0,
      rivalCounterGoals: 0,
      penaltiesWon: 0,
      penaltiesScored: 0,
      freeKicksWon: 0,
      freeKicksScored: 0,
      postsHit: 0,
      conceptualCorners: 0,
    };
  }

  // 1. OBTENER LÍMITES DE SHOOTING CLOCK POR DIVISIÓN
  private getShootingClockMaxForDivision(divisionId: number): number {
    if (divisionId >= 18) return MATCH_CONFIG.SHOOTING_CLOCK_DURATIONS.D23_D18;
    if (divisionId >= 12) return MATCH_CONFIG.SHOOTING_CLOCK_DURATIONS.D17_D12;
    if (divisionId >= 6) return MATCH_CONFIG.SHOOTING_CLOCK_DURATIONS.D11_D6;
    if (divisionId >= 2) return MATCH_CONFIG.SHOOTING_CLOCK_DURATIONS.D5_D2;
    return MATCH_CONFIG.SHOOTING_CLOCK_DURATIONS.D1;
  }

  // 2. ACTUALIZACIÓN TICK-A-TICK DEL PARTIDO
  public update(deltaTime: number, currentActiveBalls: number): MatchSnapshot {
    this.activeBallCount = currentActiveBalls;

    // A. Si está pausado, congelación absoluta
    if (this.isPaused) {
      return this.getSnapshot();
    }

    // B. Conteo regresivo de reanudación (2... 1... YA!)
    if (this.state === 'RESUME_COUNTDOWN') {
      this.resumeCountdownSeconds -= deltaTime;
      if (this.resumeCountdownSeconds <= 0) {
        this.resumeCountdownSeconds = 0;
        this.state = this.activeBallCount > 0 ? 'BALL_IN_FLIGHT' : 'PLAYING';
      }
      return this.getSnapshot();
    }

    // C. Pelota parada activa: PENALTY o FREE_KICK (reloj del partido y shooting clock congelados)
    if (this.state === 'PENALTY' && this.pendingPenalty) {
      if (this.pendingPenalty.status === 'DECIDING') {
        this.pendingPenalty.timeLimitSeconds -= deltaTime;
        if (this.pendingPenalty.timeLimitSeconds <= 0) {
          // Timeout de 5s: selección aleatoria con penalización al atacante (*1.25 a la parada del arquero)
          this.executePenaltyDecision(this.getRandomQuadrant(), true);
        }
      } else if (this.pendingPenalty.status === 'RESOLVED') {
        this.resumePostSetPieceTimer -= deltaTime;
        if (this.resumePostSetPieceTimer <= 0) {
          this.pendingPenalty = undefined;
          this.startResumeCountdown();
        }
      }
      return this.getSnapshot();
    }

    if (this.state === 'FREE_KICK' && this.pendingFreeKick) {
      if (this.pendingFreeKick.status === 'DECIDING') {
        this.pendingFreeKick.timeLimitSeconds -= deltaTime;
        if (this.pendingFreeKick.timeLimitSeconds <= 0) {
          this.executeFreeKickDecision(
            this.pendingFreeKick.selectedDirection || this.getRandomFreeKickZone(),
            this.pendingFreeKick.selectedTechnique || 'PLACEMENT',
            true
          );
        }
      } else if (this.pendingFreeKick.status === 'RESOLVED') {
        this.resumePostSetPieceTimer -= deltaTime;
        if (this.resumePostSetPieceTimer <= 0) {
          this.pendingFreeKick = undefined;
          this.startResumeCountdown();
        }
      }
      return this.getSnapshot();
    }

    // D. Actualizar contras activas (banners no obstructivos y resolución temporizada)
    for (const counter of this.activeCounters) {
      counter.timer -= deltaTime;
      if (counter.displayState === 'BANNER' && counter.timer <= 0.5) {
        counter.displayState = 'RESULT';
      } else if (counter.displayState === 'RESULT' && counter.timer <= 0) {
        counter.displayState = 'DONE';
        counter.resolved = true;
      }
    }
    // Filtrar contras ya resueltas
    this.activeCounters = this.activeCounters.filter((c) => !c.resolved);

    // E. Reloj del partido principal
    if (this.timeRemaining > 0) {
      this.timeRemaining -= deltaTime;
      if (this.timeRemaining <= 0) {
        this.timeRemaining = 0;
      }
    }

    // F. Reloj de tiro (Shooting Clock)
    if (this.timeRemaining > 0 && this.state !== 'MATCH_END') {
      this.shootingClock -= deltaTime;
      if (this.shootingClock <= 0) {
        // Pérdida por shooting clock vencido
        this.handleShootingClockExpired();
      }
    }

    // G. Decaimiento natural de presión tras 3s sin pérdidas peligrosas
    this.timeSinceLastDangerousLoss += deltaTime;
    if (this.timeSinceLastDangerousLoss >= MATCH_CONFIG.DECAY_DELAY_SECONDS && this.rivalPressure > 0) {
      const decayRate = MATCH_CONFIG.NATURAL_DECAY_RATES[this.context.divisionId] || 2.0;
      this.rivalPressure = Math.max(0, this.rivalPressure - decayRate * deltaTime);
    }

    // H. Comprobar condiciones de finalización de tiempo
    if (this.timeRemaining <= 0) {
      this.checkTimeExpiration();
    }

    // Actualizar estado general
    if (this.state !== 'MATCH_END' && this.state !== 'PENALTY' && this.state !== 'FREE_KICK') {
      if (this.activeCounters.length > 0) {
        this.state = 'COUNTERATTACK';
      } else if (this.activeBallCount > 0) {
        this.state = 'BALL_IN_FLIGHT';
      } else {
        this.state = 'PLAYING';
      }
    }

    return this.getSnapshot();
  }

  // 3. GESTIÓN DE EVENTOS DE JUEGO (GAMEPLAY ENGINE -> MATCH ENGINE)

  // Disparo del usuario (resetea inmediatamente el shooting clock)
  public onShot(isSuperShot: boolean = false, isCurved: boolean = false): void {
    this.shootingClock = this.shootingClockMax;
    this.stats.totalShots += 1;
    this.state = 'BALL_IN_FLIGHT';
    this.logDebug('ON_SHOT', this.rivalPressure, this.rivalPressure);
  }

  // Alias de compatibilidad para PixelCanvas / QA
  public registerShot(isSuperShot: boolean = false, isCurved: boolean = false): void {
    this.onShot(isSuperShot, isCurved);
  }

  // Gol del usuario
  public onGoal(isSuperShot: boolean = false): void {
    this.userScore += 1;
    this.stats.userGoals += 1;
    this.stats.shotsOnTarget += 1;
    if (isSuperShot) {
      this.stats.powerOrSuperGoals += 1;
    } else {
      this.stats.normalGoals += 1;
    }

    // Cláusula 15: pressure = pressure * 0.35
    const oldPressure = this.rivalPressure;
    this.rivalPressure = Math.round(this.rivalPressure * MATCH_CONFIG.PRESSURE.GOAL_MULTIPLIER);
    this.timeSinceLastDangerousLoss = 0;

    // Resetear contador de desvíos consecutivos
    this.resetConsecutiveDeflections();

    this.updateAccuracy();
    this.logDebug('ON_GOAL', oldPressure, this.rivalPressure);
  }

  // Alias de compatibilidad para PixelCanvas
  public registerGoal(
    isSuperShot: boolean = false,
    _isCurvedShot: boolean = false,
    _multiplier: number = 1,
    _totalPoints: number = 150
  ): void {
    this.onGoal(isSuperShot);
  }

  // Impacto en poste o travesaño
  public onPostHit(): void {
    this.stats.postsHit += 1;
    this.stats.shotsOnTarget += 1;
    const oldPressure = this.rivalPressure;
    this.rivalPressure = Math.max(0, this.rivalPressure + MATCH_CONFIG.PRESSURE.POST_HIT);
    this.resetConsecutiveDeflections();
    this.updateAccuracy();
    this.logDebug('ON_POST_HIT', oldPressure, this.rivalPressure);
  }

  // Córner conceptual (defensor desvía fuera por línea de fondo)
  public onCornerConceptual(): void {
    this.stats.conceptualCorners += 1;
    const oldPressure = this.rivalPressure;
    this.rivalPressure = Math.max(0, this.rivalPressure + MATCH_CONFIG.PRESSURE.DEFENDER_OUT_CORNER);
    this.resetConsecutiveDeflections();
    this.logDebug('ON_CORNER_CONCEPTUAL', oldPressure, this.rivalPressure);
  }

  // Portero desvía fuera por línea de fondo
  public onKeeperOut(): void {
    this.stats.shotsOnTarget += 1;
    this.stats.shotsBlockedByKeeper += 1;
    const oldPressure = this.rivalPressure;
    this.rivalPressure = Math.max(0, this.rivalPressure + MATCH_CONFIG.PRESSURE.KEEPER_OUT);
    this.resetConsecutiveDeflections();
    this.updateAccuracy();
    this.logDebug('ON_KEEPER_OUT', oldPressure, this.rivalPressure);
  }

  // Portero atrapa el balón
  public onKeeperCatch(): void {
    this.stats.shotsOnTarget += 1;
    this.stats.shotsBlockedByKeeper += 1;
    const oldPressure = this.rivalPressure;
    this.rivalPressure = Math.min(100, this.rivalPressure + MATCH_CONFIG.PRESSURE.KEEPER_CATCH);
    this.timeSinceLastDangerousLoss = 0;
    this.resetConsecutiveDeflections();
    this.updateAccuracy();

    // Evaluar contraataque desde el portero
    const gkPlayer = this.context.rivalClub.players.find((p) => p.position === 'GK') || this.context.rivalClub.players[0];
    this.evaluateCounterAttack(gkPlayer, 'GK', MATCH_CONFIG.COUNTER_CHANCES.KEEPER_CATCH_BASE);
    this.logDebug('ON_KEEPER_CATCH', oldPressure, this.rivalPressure, gkPlayer.name, gkPlayer.rating);
  }

  // Portero rechaza al campo
  public onKeeperRebound(): void {
    this.stats.shotsOnTarget += 1;
    this.stats.shotsBlockedByKeeper += 1;
    const oldPressure = this.rivalPressure;
    this.rivalPressure = Math.min(100, this.rivalPressure + MATCH_CONFIG.PRESSURE.KEEPER_REBOUND_FIELD);
    this.timeSinceLastDangerousLoss = 0;
    this.resetConsecutiveDeflections();
    this.updateAccuracy();

    const gkPlayer = this.context.rivalClub.players.find((p) => p.position === 'GK') || this.context.rivalClub.players[0];
    this.evaluateCounterAttack(gkPlayer, 'GK', MATCH_CONFIG.COUNTER_CHANCES.KEEPER_REBOUND_BASE);
    this.logDebug('ON_KEEPER_REBOUND', oldPressure, this.rivalPressure, gkPlayer.name, gkPlayer.rating);
  }

  // Tiro fuera (lateral o largo)
  public onBallOut(isLongShot: boolean = false): void {
    this.stats.shotsOffTarget += 1;
    const oldPressure = this.rivalPressure;
    const added = isLongShot ? MATCH_CONFIG.PRESSURE.LONG_SHOT_WIDE : MATCH_CONFIG.PRESSURE.SIDE_SHOT_WIDE;
    this.rivalPressure = Math.min(100, this.rivalPressure + added);
    this.resetConsecutiveDeflections();
    this.updateAccuracy();
    this.logDebug('ON_BALL_OUT', oldPressure, this.rivalPressure);
  }

  // Alias de compatibilidad para PixelCanvas
  public registerBallOut(isLongShot: boolean = false): void {
    this.onBallOut(isLongShot);
  }

  // Alias para atajada de arquero
  public registerKeeperSave(type: 'CATCH' | 'REBOUND' | 'OUT' = 'CATCH', _keeperRating?: number): void {
    if (type === 'CATCH') {
      this.onKeeperCatch();
    } else if (type === 'REBOUND') {
      this.onKeeperRebound();
    } else {
      this.onKeeperOut();
    }
  }

  // Alias para desvío de defensor
  public registerDefenderDeflection(
    defenderId: string,
    isCorner: boolean = false,
    isSuper: boolean = false,
    isCurved: boolean = false,
    row: number = 0,
    xPosRatio: number = 0.5
  ): { triggerPenalty?: boolean; triggerFreeKick?: boolean } {
    if (isCorner) {
      this.onCornerConceptual();
      return {};
    }
    return this.onPlayerDeflectionOrBlock(defenderId, row, xPosRatio, isSuper, isCurved);
  }

  // Alias para pérdida de posesión
  public registerLossOfPossession(_reason?: string): void {
    this.handleShootingClockExpired();
  }

  // Método de instancia para tiempo de recuperación del arquero
  public getGoalkeeperRecoveryTime(keeperRating: number): number {
    return MatchEngine.getGoalkeeperRecoveryTime(keeperRating);
  }

  // Desvío o bloqueo por un jugador de campo (DEF, MID o FWD)
  public onPlayerDeflectionOrBlock(
    playerId: string,
    row: number, // 0 = Defensor, 1 = Mediocampista, 2 = Delantero
    xPosRatio: number, // 0.0 (izq) a 1.0 (der)
    isSuperShot: boolean = false,
    isCurvedShot: boolean = false
  ): { triggerPenalty?: boolean; triggerFreeKick?: boolean } {
    this.stats.shotsBlockedByPlayers += 1;
    const oldPressure = this.rivalPressure;

    // Buscar jugador en la plantilla rival
    const player = this.context.rivalClub.players.find((p) => p.id === playerId) ||
      this.context.rivalClub.players[row === 0 ? 1 : row === 1 ? 5 : 8] ||
      this.context.rivalClub.players[0];

    const lineType: 'DEF' | 'MID' | 'FWD' = row === 0 ? 'DEF' : row === 1 ? 'MID' : 'FWD';

    // 1. Presión añadida según la línea y el tipo de tiro
    let basePressureAdded = row === 0
      ? MATCH_CONFIG.PRESSURE.BLOCK_DEFENDER
      : row === 1
      ? MATCH_CONFIG.PRESSURE.BLOCK_MIDFIELDER
      : MATCH_CONFIG.PRESSURE.BLOCK_ATTACKER;

    if (isSuperShot) {
      basePressureAdded = MATCH_CONFIG.PRESSURE.SUPER_SHOT_BLOCKED; // 0
    } else if (isCurvedShot) {
      basePressureAdded = Math.round(basePressureAdded / MATCH_CONFIG.PRESSURE.CURVED_SHOT_BLOCKED_DIVISOR);
    }

    this.rivalPressure = Math.min(100, this.rivalPressure + basePressureAdded);
    this.timeSinceLastDangerousLoss = 0;

    // 2. Comprobar secuencias estrictamente consecutivas
    if (this.lastDeflectorPlayerId === playerId) {
      this.consecutiveDeflectionsCount += 1;
    } else {
      this.lastDeflectorPlayerId = playerId;
      this.consecutiveDeflectionsCount = 1;
    }

    // PENALTI: Mismo DEFENSOR desvía 2 consecutivos -> 50% tirada
    if (row === 0 && this.consecutiveDeflectionsCount >= MATCH_CONFIG.SET_PIECE.PENALTY_SAME_DEFENDER_DEFLECTIONS) {
      this.resetConsecutiveDeflections();
      if (Math.random() < MATCH_CONFIG.SET_PIECE.PENALTY_TRIGGER_PROBABILITY) {
        this.triggerPenalty();
        return { triggerPenalty: true };
      }
    }

    // TIRO LIBRE: Mismo MEDIOCAMPISTA desvía 3 consecutivos -> 33% tirada
    if (row === 1 && this.consecutiveDeflectionsCount >= MATCH_CONFIG.SET_PIECE.FREE_KICK_SAME_MIDFIELDER_DEFLECTIONS) {
      this.resetConsecutiveDeflections();
      if (Math.random() < MATCH_CONFIG.SET_PIECE.FREE_KICK_TRIGGER_PROBABILITY) {
        const zone: FreeKickZone = xPosRatio < 0.33 ? 'LEFT' : xPosRatio > 0.66 ? 'RIGHT' : 'CENTER';
        this.triggerFreeKick(zone);
        return { triggerFreeKick: true };
      }
    }

    // DELANTERO: 2 desvíos consecutivos -> reduce ligeramente presión
    if (row === 2 && this.consecutiveDeflectionsCount >= 2) {
      this.rivalPressure = Math.max(0, this.rivalPressure + MATCH_CONFIG.PRESSURE.FORWARD_DOUBLE_DEFLECTION_REDUCE);
      this.resetConsecutiveDeflections();
    }

    // 3. Evaluar contraataque si no es un Super Tiro
    if (!isSuperShot) {
      let baseChance = row === 0
        ? MATCH_CONFIG.COUNTER_CHANCES.DEFENDER_BASE
        : row === 1
        ? MATCH_CONFIG.COUNTER_CHANCES.MIDFIELDER_BASE
        : MATCH_CONFIG.COUNTER_CHANCES.FORWARD_BASE;

      if (isCurvedShot) {
        baseChance /= 10;
      }

      this.evaluateCounterAttack(player, lineType, baseChance);
    }

    this.logDebug('ON_DEFLECTION_BLOCK', oldPressure, this.rivalPressure, player.name, player.rating);
    return {};
  }

  // Vencimiento del Shooting Clock
  private handleShootingClockExpired(): void {
    const oldPressure = this.rivalPressure;
    this.rivalPressure = Math.min(100, this.rivalPressure + MATCH_CONFIG.PRESSURE.SHOOTING_CLOCK_EXPIRED);
    this.timeSinceLastDangerousLoss = 0;
    this.shootingClock = this.shootingClockMax;
    this.resetConsecutiveDeflections();

    // Seleccionar línea recuperadora aleatoria
    const roll = Math.random();
    let line: 'DEF' | 'MID' | 'FWD' = 'MID';
    let player = this.context.rivalClub.players[5];

    if (roll < 0.25) {
      line = 'DEF';
      player = this.context.rivalClub.players[2] || player;
    } else if (roll < 0.65) {
      line = 'MID';
      player = this.context.rivalClub.players[6] || player;
    } else {
      line = 'FWD';
      player = this.context.rivalClub.players[9] || player;
    }

    this.evaluateCounterAttack(player, line, MATCH_CONFIG.COUNTER_CHANCES.SHOOTING_CLOCK_EXPIRED_BASE);
    this.logDebug('ON_SHOOTING_CLOCK_EXPIRED', oldPressure, this.rivalPressure, player.name, player.rating);
  }

  // 4. SISTEMA COMBINADO DE CONTRAATAQUE (Cláusulas 8, 9, 13)
  // Regla absoluta: 1 error -> máx 1 contra -> máx 1 gol
  private evaluateCounterAttack(
    player: PersistentPlayer,
    line: 'DEF' | 'MID' | 'FWD' | 'GK',
    baseChance: number
  ): void {
    // Si ya terminó el tiempo principal (0:00), no pueden iniciarse nuevas contras
    if (this.timeRemaining <= 0) return;

    // Si ya existe una contra activa en proceso de visualización, no encadenar
    if (this.activeCounters.length > 0) return;

    const diffFactor = this.context.difficultyFactor;
    const playerRatingBonus = (player.rating - 50) / 100; // -0.3 a +0.4
    const pressureBonus = (this.rivalPressure / 100) * 0.35; // hasta +0.35 a presión 100

    const counterProb = Math.min(0.85, Math.max(0.05, (baseChance + playerRatingBonus + pressureBonus) * diffFactor));
    const counterRoll = Math.random();

    if (counterRoll < counterProb) {
      this.stats.rivalCountersGenerated += 1;

      // 2.ª resolución estadística: ¿Termina en gol?
      const rivalAttackBonus = (this.context.rivalClub.attack - 50) / 150;
      const goalProb = Math.min(0.70, Math.max(0.10, (0.30 + rivalAttackBonus + playerRatingBonus * 0.5) * diffFactor));
      const goalRoll = Math.random();
      const isGoal = goalRoll < goalProb;

      if (isGoal) {
        this.rivalScore += 1;
        this.stats.rivalGoals += 1;
        this.stats.rivalCounterGoals += 1;
      }

      const counterEvent: CounterAttackEvent = {
        id: `counter_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        timestamp: Date.now(),
        recovererPlayer: player,
        recovererLine: line,
        dangerLevel: Math.round(counterProb * 100),
        isGoal,
        resolved: false,
        displayState: 'BANNER',
        timer: 1.0, // 0.5s Banner + 0.5s Resultado
      };

      this.activeCounters.push(counterEvent);
      this.logDebug(
        'COUNTER_TRIGGERED',
        this.rivalPressure,
        this.rivalPressure,
        player.name,
        player.rating,
        counterProb,
        counterRoll,
        goalProb,
        goalRoll
      );
    }
  }

  // 5. PELOTAS PARADAS: PENALTI Y TIRO LIBRE
  public triggerPenalty(): void {
    this.state = 'PENALTY';
    this.stats.penaltiesWon += 1;
    this.pendingPenalty = {
      timeLimitSeconds: MATCH_CONFIG.SET_PIECE.DECISION_TIMEOUT_SECONDS,
      status: 'DECIDING',
    };
  }

  public executePenaltyDecision(quadrant: PenaltyQuadrant, isTimeout: boolean = false): void {
    if (!this.pendingPenalty || this.pendingPenalty.status !== 'DECIDING') return;

    this.pendingPenalty.selectedQuadrant = quadrant;
    this.pendingPenalty.status = 'RESOLVED';
    this.resumePostSetPieceTimer = MATCH_CONFIG.SET_PIECE.POST_SET_PIECE_RESULT_DELAY;

    // Resolución frente al arquero
    const gk = this.context.rivalClub.players.find((p) => p.position === 'GK') || this.context.rivalClub.players[0];
    let gkSaveChance = 0.20 + (gk.rating / 250); // 20% base a ~60% élite
    if (isTimeout) {
      gkSaveChance *= MATCH_CONFIG.SET_PIECE.TIMEOUT_KEEPER_SAVE_MULTIPLIER; // *1.25
    }

    const isGoal = Math.random() > Math.min(0.65, gkSaveChance);
    this.pendingPenalty.isGoal = isGoal;

    if (isGoal) {
      this.userScore += 1;
      this.stats.userGoals += 1;
      this.stats.penaltiesScored += 1;
      this.stats.shotsOnTarget += 1;
    } else {
      this.stats.shotsBlockedByKeeper += 1;
    }

    // Cláusula 23: pressure = 0
    this.rivalPressure = MATCH_CONFIG.PRESSURE.PENALTY_EXECUTED;
    this.shootingClock = this.shootingClockMax;
    this.updateAccuracy();
  }

  public triggerFreeKick(zone: FreeKickZone = 'CENTER'): void {
    this.state = 'FREE_KICK';
    this.stats.freeKicksWon += 1;
    this.pendingFreeKick = {
      zone,
      timeLimitSeconds: MATCH_CONFIG.SET_PIECE.DECISION_TIMEOUT_SECONDS,
      status: 'DECIDING',
    };
  }

  public executeFreeKickDecision(
    direction: FreeKickZone,
    technique: FreeKickTechnique,
    isTimeout: boolean = false
  ): void {
    if (!this.pendingFreeKick || this.pendingFreeKick.status !== 'DECIDING') return;

    this.pendingFreeKick.selectedDirection = direction;
    this.pendingFreeKick.selectedTechnique = technique;
    this.pendingFreeKick.status = 'RESOLVED';
    this.resumePostSetPieceTimer = MATCH_CONFIG.SET_PIECE.POST_SET_PIECE_RESULT_DELAY;

    const gk = this.context.rivalClub.players.find((p) => p.position === 'GK') || this.context.rivalClub.players[0];
    let goalChance = 0.35 - (gk.rating / 300); // 35% base a ~15% contra élite
    if (isTimeout) {
      goalChance /= MATCH_CONFIG.SET_PIECE.TIMEOUT_KEEPER_SAVE_MULTIPLIER;
    }

    const isGoal = Math.random() < Math.max(0.12, goalChance);
    this.pendingFreeKick.isGoal = isGoal;

    if (isGoal) {
      this.userScore += 1;
      this.stats.userGoals += 1;
      this.stats.freeKicksScored += 1;
      this.stats.shotsOnTarget += 1;
    }

    // Cláusula 28: pressure = pressure * 0.25
    this.rivalPressure = Math.round(this.rivalPressure * MATCH_CONFIG.PRESSURE.FREE_KICK_EXECUTED_MULTIPLIER);
    this.shootingClock = this.shootingClockMax;
    this.updateAccuracy();
  }

  // 6. PAUSA Y REANUDACIÓN (2... 1... YA!)
  public pause(): void {
    this.isPaused = true;
    this.state = 'PAUSED';
  }

  public resume(): void {
    this.isPaused = false;
    this.startResumeCountdown();
  }

  private startResumeCountdown(): void {
    this.state = 'RESUME_COUNTDOWN';
    this.resumeCountdownSeconds = 2.0; // 2 segundos que muestran 2... 1... YA!
  }

  // 7. COMPROBACIÓN DE FIN DE TIEMPO Y REPECHAJES (PRÓRROGAS)
  private checkTimeExpiration(): void {
    // Si quedan balones en vuelo o contras o penales pendientes, esperar
    if (this.activeBallCount > 0 || this.activeCounters.length > 0 || this.pendingPenalty || this.pendingFreeKick) {
      this.state = 'TIME_EXPIRED_PENDING_ACTION';
      return;
    }

    // Si es repechaje (Playoff) y continúa empatado: aplicar prórroga
    if (this.context.isPlayoff && this.userScore === this.rivalScore) {
      this.isOvertime = true;
      const extraSeconds = MATCH_CONFIG.OVERTIME_BLOCKS[this.overtimePeriodIndex] || 10;
      this.timeRemaining = extraSeconds;
      this.overtimePeriodIndex += 1;
      this.state = 'PLAYING';
      return;
    }

    // Partido concluido definitivamente
    this.state = 'MATCH_END';
  }

  // 8. ESCALA DE RECUPERACIÓN TRAS ESTIRADA DEL PORTERO (Cláusula 32)
  public static getGoalkeeperRecoveryTime(keeperRating: number): number {
    const scale = MATCH_CONFIG.GOALKEEPER_RECOVERY_SCALE;
    const normalized = Math.min(1, Math.max(0, (keeperRating - 20) / 75)); // 20 a 95
    const index = Math.min(scale.length - 1, Math.floor((1 - normalized) * scale.length));
    return scale[index];
  }

  // 9. SNAPSHOT Y HELPERS
  public getSnapshot(): MatchSnapshot {
    return {
      state: this.state,
      timeRemaining: Math.max(0, this.timeRemaining),
      overtimePeriodIndex: this.overtimePeriodIndex,
      isOvertime: this.isOvertime,
      userScore: this.userScore,
      rivalScore: this.rivalScore,
      rivalPressure: Math.min(100, Math.max(0, this.rivalPressure)),
      shootingClock: Math.max(0, this.shootingClock),
      shootingClockMax: this.shootingClockMax,
      activeCounters: [...this.activeCounters],
      stats: { ...this.stats },
      activeBallCount: this.activeBallCount,
      isPaused: this.isPaused,
      resumeCountdownSeconds: this.resumeCountdownSeconds,
      pendingPenalty: this.pendingPenalty ? { ...this.pendingPenalty } : undefined,
      pendingFreeKick: this.pendingFreeKick ? { ...this.pendingFreeKick } : undefined,
      debugLog: [...this.debugLog],
    };
  }

  private resetConsecutiveDeflections(): void {
    this.lastDeflectorPlayerId = null;
    this.consecutiveDeflectionsCount = 0;
  }

  private updateAccuracy(): void {
    if (this.stats.totalShots > 0) {
      this.stats.shotAccuracyPercent = Math.round(
        (this.stats.shotsOnTarget / this.stats.totalShots) * 100
      );
    }
  }

  private getRandomQuadrant(): PenaltyQuadrant {
    const quads: PenaltyQuadrant[] = [
      'TOP_LEFT',
      'BOTTOM_LEFT',
      'TOP_CENTER',
      'BOTTOM_CENTER',
      'TOP_RIGHT',
      'BOTTOM_RIGHT',
    ];
    return quads[Math.floor(Math.random() * quads.length)];
  }

  private getRandomFreeKickZone(): FreeKickZone {
    const zones: FreeKickZone[] = ['LEFT', 'CENTER', 'RIGHT'];
    return zones[Math.floor(Math.random() * zones.length)];
  }

  private logDebug(
    eventType: string,
    before: number,
    after: number,
    recovererName?: string,
    recovererRating?: number,
    counterChance?: number,
    counterRoll?: number,
    goalChance?: number,
    goalRoll?: number
  ): void {
    if (!this.isDebugEnabled) return;
    this.debugLog.unshift({
      timestamp: Date.now(),
      eventType,
      pressureBefore: before,
      pressureAfter: after,
      recovererName,
      recovererRating,
      counterChance,
      counterRoll,
      goalChance,
      goalRoll,
      shootingClock: Math.round(this.shootingClock * 10) / 10,
      state: this.state,
    });
    if (this.debugLog.length > 30) {
      this.debugLog.pop();
    }
  }
}
