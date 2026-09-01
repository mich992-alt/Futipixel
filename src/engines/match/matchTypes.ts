// MATCH ENGINE v1.0 — TIPOS Y CONTRATOS DE EVENTOS
import { ClubEntity, PersistentPlayer } from '../league/leagueTypes';

export type MatchState =
  | 'PLAYING'
  | 'BALL_IN_FLIGHT'
  | 'COUNTERATTACK'
  | 'PENALTY'
  | 'FREE_KICK'
  | 'PAUSED'
  | 'RESUME_COUNTDOWN'
  | 'TIME_EXPIRED_PENDING_ACTION'
  | 'MATCH_END';

export type PenaltyQuadrant =
  | 'TOP_LEFT'
  | 'BOTTOM_LEFT'
  | 'TOP_CENTER'
  | 'BOTTOM_CENTER'
  | 'TOP_RIGHT'
  | 'BOTTOM_RIGHT';

export type FreeKickZone = 'LEFT' | 'CENTER' | 'RIGHT';
export type FreeKickTechnique = 'CURVE' | 'POWER' | 'PLACEMENT';

export interface CounterAttackEvent {
  id: string;
  timestamp: number;
  recovererPlayer: PersistentPlayer;
  recovererLine: 'DEF' | 'MID' | 'FWD' | 'GK';
  dangerLevel: number; // 0 - 100
  isGoal: boolean;
  resolved: boolean;
  displayState: 'BANNER' | 'RESULT' | 'DONE';
  timer: number;
}

export interface MatchStats {
  userGoals: number;
  rivalGoals: number;
  totalShots: number;
  shotsOnTarget: number;
  shotsOffTarget: number;
  shotsBlockedByPlayers: number;
  shotsBlockedByKeeper: number;
  shotAccuracyPercent: number;
  normalGoals: number;
  powerOrSuperGoals: number;
  rivalCountersGenerated: number;
  rivalCounterGoals: number;
  penaltiesWon: number;
  penaltiesScored: number;
  freeKicksWon: number;
  freeKicksScored: number;
  postsHit: number;
  conceptualCorners: number;
}

export interface MatchContext {
  isPlayoff: boolean;
  divisionId: number;
  userClub: ClubEntity;
  rivalClub: ClubEntity;
  difficultyFactor: number;
}

export interface MatchSnapshot {
  state: MatchState;
  timeRemaining: number; // segundos
  overtimePeriodIndex: number;
  isOvertime: boolean;
  userScore: number;
  rivalScore: number;
  rivalPressure: number; // 0 - 100
  shootingClock: number; // segundos restantes para pérdida
  shootingClockMax: number;
  activeCounters: CounterAttackEvent[];
  stats: MatchStats;
  activeBallCount: number;
  isPaused: boolean;
  resumeCountdownSeconds: number; // 2 -> 1 -> 0 (YA)
  pendingPenalty?: {
    timeLimitSeconds: number;
    selectedQuadrant?: PenaltyQuadrant;
    status: 'DECIDING' | 'RESOLVED';
    isGoal?: boolean;
  };
  pendingFreeKick?: {
    zone: FreeKickZone;
    timeLimitSeconds: number;
    selectedDirection?: FreeKickZone;
    selectedTechnique?: FreeKickTechnique;
    status: 'DECIDING' | 'RESOLVED';
    isGoal?: boolean;
  };
  debugLog: MatchDebugEntry[];
}

export interface MatchDebugEntry {
  timestamp: number;
  eventType: string;
  pressureBefore: number;
  pressureAfter: number;
  recovererName?: string;
  recovererRating?: number;
  counterChance?: number;
  counterRoll?: number;
  goalChance?: number;
  goalRoll?: number;
  shootingClock: number;
  state: MatchState;
}
