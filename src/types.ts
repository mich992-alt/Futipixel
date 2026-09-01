export type GameStatus = 
  | 'MENU'
  | 'CUSTOMIZATION'
  | 'CAREER_HUB'
  | 'MATCH_PREVIEW'
  | 'PLAYING'
  | 'GOAL_CELEBRATION'
  | 'MATCH_END'
  | 'REPECHAJE_INTRO'
  | 'REPECHAJE_PLAYING'
  | 'SEASON_SUMMARY'
  | 'TROPHY_CABINET'
  | 'SKILLS_UPGRADE'
  | 'SHOP'
  | 'PAUSED'
  | 'RETIREMENT';

export type FormationType = 
  | '4-3-3' 
  | '4-4-2' 
  | '5-3-2' 
  | '3-5-2' 
  | '4-2-3-1' 
  | '3-4-3'
  | '4-2-2-2'
  | '3-4-2-1'
  | '4-3-1-2'
  | '3-4-1-2'
  | '3-2-4-1';

export type CollarStyleType = 'round' | 'v_neck' | 'polo';

export type KitPatternType = 
  | 'solid' 
  | 'vertical_stripes' 
  | 'hoops' 
  | 'sash'
  | 'halves'
  | 'sleeves_contrast'
  | 'diamonds'
  | 'retro_wave'
  | 'gradient'
  | 'flames'
  | 'camo'
  | 'vintage_collar'
  | 'neon_glow';

export type ShortsStyleType = 
  | 'classic' 
  | 'retro_short' 
  | 'long_boxer' 
  | 'side_stripes' 
  | 'dual_color' 
  | 'gold_piping';

export type HairStyleType = 
  | 'classic'
  | 'short' 
  | 'afro' 
  | 'long' 
  | 'braids' 
  | 'bald' 
  | 'mohawk' 
  | 'ponytail' 
  | 'mullet' 
  | 'buzzcut' 
  | 'fenomeno' 
  | 'dreadlocks' 
  | 'spiky';

export interface PlayerCustomization {
  name: string;
  number: number;
  pattern: KitPatternType;
  collarStyle?: CollarStyleType;
  collarColor?: string;
  shirtColor: string;
  secondaryShirtColor: string;
  isGradientEnabled?: boolean;
  shortsColor: string;
  secondaryShortsColor?: string;
  socksColor?: string;
  bootsColor: string;
  hairStyle: HairStyleType;
  hairColor: string;
  skinTone: string;
  ballId: string;
  moveSpeedLevel?: number;
  shotVelocityLevel?: number;
  fireRateLevel?: number;
  unlockedPatterns?: KitPatternType[];
  unlockedHairstyles?: HairStyleType[];
}

export interface BallSkin {
  id: string;
  name: string;
  description: string;
  primaryColor: string;
  secondaryColor: string;
  pattern: 'classic' | 'tango' | 'flame' | 'neon' | 'gold' | 'leather' | 'cyber' | 'galaxy';
  trailColor: string;
  unlockSeason: number;
  price: number;
  unlocked: boolean;
}

export interface ShopItem {
  id: string;
  name: string;
  category: 'BALL' | 'BOOTS' | 'KIT' | 'SHORTS' | 'ACCESSORY';
  description: string;
  price: number;
  icon: string;
  color?: string;
  secondaryColor?: string;
  pattern?: KitPatternType;
  shortsStyle?: ShortsStyleType;
  unlocked: boolean;
  equipped?: boolean;
}

export interface RivalTeam {
  name: string;
  shortName: string;
  city: string;
  primaryColor: string;
  secondaryColor: string;
  pattern: KitPatternType;
  hairColor: string;
  formation: FormationType;
  tacticsDescription: string;
  difficultyLevel: number;
  targetGoalsToWin: number;
  rivalStarPlayer: string;
}

export interface DivisionInfo {
  id: number;
  name: string;
  levelBadge: string;
  tierColor: string;
  baseRewardPoints: number;
  coinReward: number;
  minPointsForPromotion: number;
  maxPointsForRelegation: number;
  description: string;
}

export interface LeagueStanding {
  teamName: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
  isPlayerTeam?: boolean;
}

export interface Trophy {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAtSeason?: number;
  dateUnlocked?: string;
  unlocked: boolean;
}

export interface CareerStats {
  playerName: string;
  age: number;
  currentSeason: number;
  currentDivision: number;
  // Economy & RPG Progression
  coins: number;
  level: number;
  xp: number;
  xpToNextLevel: number;
  skillPoints: number;
  moveSpeedLevel: number; // 1 - 10
  shotVelocityLevel: number; // 1 - 10
  fireRateLevel: number; // 1 - 10
  unlockedBallIds?: string[];
  unlockedItemIds?: string[];
  // Performance
  totalGoals: number;
  totalMatches: number;
  totalWins: number;
  totalDraws: number;
  totalLosses: number;
  relegationsSaved: number;
  promotionsEarned: number;
  titlesWon: number;
  goldenBoots: number;
  hatTricks: number;
  highestStreak: number;
  trophies: Trophy[];
  matchHistory: {
    season: number;
    matchNumber: number;
    rivalName: string;
    playerScore: number;
    rivalScore: number;
    result: 'WIN' | 'DRAW' | 'LOSS';
    division: string;
  }[];
}

export interface DefenderEntity {
  id: number;
  row: number; // 0: Defenders, 1: Midfielders, 2: Forwards
  col: number;
  x: number;
  y: number;
  baseY: number;
  width: number;
  height: number;
  speed: number;
  baseSpeed: number;
  direction: number; // 1 or -1
  pattern: KitPatternType;
  shirtColor: string;
  secondaryShirtColor: string;
  shortsColor: string;
  hairColor: string;
  hairStyle: string;
  skinTone: string;
  number: number;
  isStunned: boolean;
  stunTimer: number;
  tackleAnimTimer: number;
  dodgeOffsetY: number;
  // Independent AI rhythm & movement pattern
  aiState: 'MOVING' | 'PAUSED' | 'DECELERATING' | 'ACCELERATING' | 'MOVING_LEFT' | 'MOVING_RIGHT';
  stateTimer: number;
  pauseDuration: number;
  speedMultiplier: number;
  minX?: number;
  maxX?: number;
}

export interface BallEntity {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  active: boolean;
  isSuperShot: boolean;
  isCurvedShot?: boolean;
  curve: number;
  trail: { x: number; y: number; alpha: number; color: string }[];
  skinId: string;
  piercedCount: number;
  bounceCount: number;
}

export interface GoalkeeperEntity {
  x: number;
  y: number;
  baseY?: number;
  width: number;
  height: number;
  speed: number;
  direction: number;
  diveState: 'idle' | 'diving_left' | 'diving_right' | 'stunned_ground' | 'recovering';
  diveTimer: number;
  gloveColor: string;
  shirtColor: string;
  shortsColor?: string;
  aiState?: 'MOVING_LEFT' | 'MOVING_RIGHT' | 'PAUSED' | 'idle';
  stateTimer?: number;
}

export interface GoalEntity {
  x: number;
  y: number;
  width: number;
  height: number;
  minWidth: number;
  maxWidth: number;
  direction: number;
  speed: number;
  expandSpeed: number;
  isExpanding: boolean;
}

export interface ParticleEntity {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  life: number;
  maxLife: number;
  shape?: 'rect' | 'circle' | 'star' | 'confetti';
}

export interface FloatingTextEntity {
  x: number;
  y: number;
  text: string;
  color: string;
  size: number;
  alpha: number;
  life: number;
}

export interface SpeechBubbleEntity {
  id: number;
  x: number;
  y: number;
  text: string;
  life: number;
  maxLife: number;
  color: string;
}

export interface FanSocialPost {
  id: string;
  avatar: string;
  username: string;
  handle: string;
  text: string;
  likes: number;
  retweets: number;
  sentiment: 'POSITIVE' | 'NEUTRAL' | 'FUNNY_ANGRY' | 'MEME';
}
