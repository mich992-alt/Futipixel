// LEAGUE ENGINE v1.0 — DEFINICIÓN DE TIPOS
import { FormationType, KitPatternType, CollarStyleType, HairStyleType } from '../../types';

export type PlayerPositionType = 'GK' | 'DEF' | 'MID' | 'FWD';

export interface PersistentPlayer {
  id: string;
  name: string;
  number: number;
  position: PlayerPositionType;
  rating: number; // 1-99
  hairStyle: HairStyleType;
  hairColor: string;
  skinTone: string;
  bootsColor: string;
}

export interface ClubFormationProfile {
  favorite1: FormationType;
  favorite2: FormationType;
  favorite3: FormationType;
  currentFormation: FormationType;
}

export interface ClubColors {
  primary: string;
  secondary: string;
  shorts: string;
  pattern: KitPatternType;
  collarStyle?: CollarStyleType;
  collarColor?: string;
  isGradient?: boolean;
}

export interface ClubEntity {
  id: string; // Identificador único e inmutable en el universo
  name: string;
  shortName: string;
  city: string;
  isPlayerClub: boolean;
  isCanonical?: boolean;
  divisionId: number; // 1 a 23

  // Ratings de club
  attack: number;
  defense: number;
  goalkeeper: number;
  speed: number;
  overallRating: number;

  // Plantilla de 11 jugadores persistentes
  players: PersistentPlayer[];
  starPlayerId: string; // Id del jugador con mayor media actual

  // Tácticas y colores
  tactics: ClubFormationProfile;
  colors: ClubColors;

  // Registro de trayectoria y rachas
  consecutiveChampionships: number; // Contador de títulos consecutivos
  consecutiveLastPlacesInD23: number; // Contador de 8.º puestos consecutivos en D23
  titlesWon: number;
  promotions: number;
  relegations: number;
}

export interface MatchScheduleEntry {
  id: string;
  roundNumber: number; // 1 a 7
  divisionId: number; // 1 a 23
  homeClubId: string;
  awayClubId: string;
  isPlayed: boolean;
  homeScore?: number;
  awayScore?: number;
  isPlayerMatch: boolean;
  isOvertime?: boolean;
}

export interface DivisionStandingRow {
  clubId: string;
  clubName: string;
  shortName: string;
  isPlayerClub: boolean;
  played: number; // PJ
  won: number; // PG
  drawn: number; // PE
  lost: number; // PP
  goalsFor: number; // GF
  goalsAgainst: number; // GC
  goalDifference: number; // DG = GF - GC
  points: number; // PTS = PG*3 + PE
  position: number; // 1 a 8
}

export interface DivisionSeasonReportFacts {
  divisionId: number;
  championClubId: string;
  championClubName: string;
  directPromotedClubId?: string;
  directPromotedClubName?: string;
  playoffPromotionWinnerClubId?: string;
  playoffPromotionWinnerClubName?: string;
  playoffRelegationWinnerClubId?: string;
  playoffRelegationWinnerClubName?: string;
  playoffRelegatedClubId?: string;
  playoffRelegatedClubName?: string;
  directRelegatedClubId?: string;
  directRelegatedClubName?: string;
  presidentStatement?: string;
  fanComment?: string;
}

export interface SeasonReportFacts {
  seasonNumber: number;
  divisionReports: DivisionSeasonReportFacts[];
  isUserPromoted: boolean;
  isUserRelegated: boolean;
  isUserChampion: boolean;
  isCareerCompleted: boolean;
}

export interface PlayoffMatchResult {
  matchType: 'PROMOTION_PLAYOFF' | 'RELEGATION_PLAYOFF';
  divisionId: number;
  homeClub: ClubEntity;
  awayClub: ClubEntity;
  homeScore: number;
  awayScore: number;
  winnerClubId: string;
  loserClubId: string;
  isUserMatch: boolean;
  penaltyShootoutOrOvertimePeriods?: number;
}

export interface DivisionState {
  id: number;
  name: string;
  tierName: string;
  pitchStyle: 'dirt_potrero' | 'municipal_worn' | 'regional_grass' | 'pro_stadium' | 'elite_arena';
  clubIds: string[]; // Exactamente 8 clubes
  schedule: MatchScheduleEntry[]; // 28 partidos (7 fechas x 4 partidos)
  currentRound: number; // 1 a 7
  standings: DivisionStandingRow[];
  promotionPlayoff?: PlayoffMatchResult; // 2.º vs 3.º
  relegationPlayoff?: PlayoffMatchResult; // 6.º vs 7.º
}

export interface LeagueUniverse {
  version: '1.0';
  careerSeason: number;
  userClubId: string;
  divisions: Record<number, DivisionState>; // 1 a 23
  clubs: Record<string, ClubEntity>; // 184 clubes persistentes
  userConsecutiveD1Titles: number; // Condición de victoria: 3 títulos consecutivos en D1
  isCareerCompleted: boolean;
  seasonReportsHistory: SeasonReportFacts[];
}
