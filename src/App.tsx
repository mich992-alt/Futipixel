import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  BallSkin,
  CareerStats,
  DivisionInfo,
  GameStatus,
  LeagueStanding,
  PlayerCustomization,
  RivalTeam
} from './types';
import {
  BALL_SKINS,
  DIVISIONS,
  INITIAL_TROPHIES
} from './utils/gameGenerators';
import { retroAudio } from './audio/retroAudio';
import { ScoreBoard } from './components/ScoreBoard';
import { PixelCanvas } from './components/PixelCanvas';
import { CareerHub } from './components/CareerHub';
import { CustomizerModal } from './components/CustomizerModal';
import { TrophyCabinet } from './components/TrophyCabinet';
import { RepechajeModal } from './components/RepechajeModal';
import { MatchEndModal } from './components/MatchEndModal';
import { SeasonSummaryModal } from './components/SeasonSummaryModal';
import { PauseModal } from './components/PauseModal';
import { ShopModal } from './components/ShopModal';
import { SkillUpgradeModal } from './components/SkillUpgradeModal';

// OFFICIAL ENGINES v1.0
import { LeagueEngine } from './engines/league/leagueEngine';
import { MatchEngine } from './engines/match/matchEngine';
import { MatchSnapshot } from './engines/match/matchTypes';
import { LeagueUniverse } from './engines/league/leagueTypes';

const STORAGE_KEY = 'PIXEL_GOL_INVADERS_CAREER_V1';

export default function App() {
  // --- 1. Persistent Player Customization State ---
  const [playerCustom, setPlayerCustom] = useState<PlayerCustomization>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.playerCustom) return parsed.playerCustom;
      } catch (e) {
        console.error(e);
      }
    }
    return {
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
  });

  // --- 2. Persistent League Universe (LEAGUE ENGINE v1.0) ---
  const [universe, setUniverse] = useState<LeagueUniverse>(() => {
    return LeagueEngine.loadOrCreateUniverse(playerCustom.name);
  });

  // --- 3. Persistent Career Stats ---
  const [careerStats, setCareerStats] = useState<CareerStats>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.careerStats) {
          return {
            coins: 500,
            level: 1,
            xp: 0,
            xpToNextLevel: 300,
            skillPoints: 2,
            moveSpeedLevel: 1,
            shotVelocityLevel: 1,
            fireRateLevel: 1,
            unlockedBallIds: ['ball-classic'],
            unlockedItemIds: [],
            ...parsed.careerStats,
            currentDivision: Math.max(1, Math.min(23, parsed.careerStats.currentDivision || 23))
          };
        }
      } catch (e) {
        console.error(e);
      }
    }
    return {
      playerName: 'MATADOR',
      age: 17,
      currentSeason: 1,
      currentDivision: 23, // Start at Division 23 as per contract
      coins: 500,
      level: 1,
      xp: 0,
      xpToNextLevel: 300,
      skillPoints: 2,
      moveSpeedLevel: 1,
      shotVelocityLevel: 1,
      fireRateLevel: 1,
      unlockedBallIds: ['ball-classic'],
      unlockedItemIds: [],
      totalGoals: 0,
      totalMatches: 0,
      totalWins: 0,
      totalDraws: 0,
      totalLosses: 0,
      relegationsSaved: 0,
      promotionsEarned: 0,
      titlesWon: 0,
      goldenBoots: 0,
      hatTricks: 0,
      highestStreak: 0,
      trophies: INITIAL_TROPHIES,
      matchHistory: []
    };
  });

  // Active View / Game Status
  const [gameStatus, setGameStatus] = useState<GameStatus>('CAREER_HUB');
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Live Match State & MatchEngine Instance Reference
  const matchEngineRef = useRef<MatchEngine | null>(null);
  const [matchSnapshot, setMatchSnapshot] = useState<MatchSnapshot | null>(null);
  const [superCharge, setSuperCharge] = useState(100);

  // Modals state
  const [showCustomizer, setShowCustomizer] = useState(false);
  const [showTrophies, setShowTrophies] = useState(false);
  const [showSkills, setShowSkills] = useState(false);
  const [showShop, setShowShop] = useState(false);
  const [showMatchEndModal, setShowMatchEndModal] = useState(false);
  const [lastMatchCoins, setLastMatchCoins] = useState(0);
  const [lastMatchXp, setLastMatchXp] = useState(0);
  const [lastMatchPoints, setLastMatchPoints] = useState(0);
  const [lastMatchStreakBonus, setLastMatchStreakBonus] = useState(1);
  const [showRepechajeIntro, setShowRepechajeIntro] = useState(false);
  const [showSeasonSummary, setShowSeasonSummary] = useState(false);
  const [seasonOutcome, setSeasonOutcome] = useState<'PROMOTION' | 'RELEGATION' | 'MAINTENANCE' | 'CHAMPION'>('MAINTENANCE');
  const [oldDivisionForSummary, setOldDivisionForSummary] = useState<DivisionInfo>(DIVISIONS[0]);
  const [newDivisionForSummary, setNewDivisionForSummary] = useState<DivisionInfo>(DIVISIONS[0]);

  // Current Division state from Universe
  const userClubEntity = universe.clubs[universe.userClubId];
  const userDivisionId = userClubEntity?.divisionId || 23;
  const currentDivision = DIVISIONS.find((d) => d.id === userDivisionId) || DIVISIONS[0];
  const userDivisionState = universe.divisions[userDivisionId];
  const currentRound = Math.min(7, Math.max(1, userDivisionState?.currentRound || 1));

  // Current Rival Club from official round-robin schedule
  const currentMatchSchedule = userDivisionState?.schedule.find(
    (m) => m.roundNumber === currentRound && m.isPlayerMatch && !m.isPlayed
  );

  const rivalClubId = currentMatchSchedule
    ? currentMatchSchedule.homeClubId === universe.userClubId
      ? currentMatchSchedule.awayClubId
      : currentMatchSchedule.homeClubId
    : userDivisionState?.clubIds.find((id) => id !== universe.userClubId) || 'club_cpu_rival';

  const rivalClubEntity = universe.clubs[rivalClubId] || {
    id: 'club_cpu_fallback',
    name: 'Rival Potrero',
    shortName: 'RIV',
    city: 'Potrero',
    isPlayerClub: false,
    isCanonical: false,
    divisionId: userDivisionId,
    attack: 25,
    defense: 25,
    goalkeeper: 25,
    speed: 25,
    overallRating: 25,
    players: [],
    starPlayerId: '',
    tactics: {
      favorite1: '4-3-3',
      favorite2: '4-4-2',
      favorite3: '4-2-3-1',
      currentFormation: '4-3-3',
    },
    colors: {
      primary: '#dc2626',
      secondary: '#ffffff',
      shorts: '#172554',
      pattern: 'vertical_stripes',
      collarStyle: 'round',
    },
    consecutiveChampionships: 0,
    consecutiveLastPlacesInD23: 0,
    titlesWon: 0,
    promotions: 0,
    relegations: 0,
  };

  // Convert rival entity to RivalTeam shape for UI compatibility
  const currentRival: RivalTeam = {
    name: rivalClubEntity.name,
    shortName: rivalClubEntity.shortName,
    city: rivalClubEntity.city,
    primaryColor: rivalClubEntity.colors.primary,
    secondaryColor: rivalClubEntity.colors.secondary,
    pattern: rivalClubEntity.colors.pattern as any,
    hairColor: '#1c1917',
    formation: rivalClubEntity.tactics.currentFormation as any,
    tacticsDescription: `Ofensiva: ${rivalClubEntity.attack} • Defensa: ${rivalClubEntity.defense} • Portería: ${rivalClubEntity.goalkeeper}`,
    difficultyLevel: Math.max(1, Math.round((24 - userDivisionId) * 0.45)),
    targetGoalsToWin: Math.max(1, Math.floor((24 - userDivisionId) / 5) + 1),
    rivalStarPlayer:
      rivalClubEntity.players.find((p) => p.id === rivalClubEntity.starPlayerId)?.name || 'Goleador Rival'
  };

  // Convert official division standings to LeagueStanding shape for UI
  const leagueStandings: LeagueStanding[] = userDivisionState
    ? userDivisionState.standings.map((st) => ({
        teamName: st.clubName,
        played: st.played,
        won: st.won,
        drawn: st.drawn,
        lost: st.lost,
        goalsFor: st.goalsFor,
        goalsAgainst: st.goalsAgainst,
        points: st.points,
        isPlayerTeam: st.clubId === universe.userClubId
      }))
    : [];

  // Current active ball skin
  const currentBallSkin: BallSkin =
    BALL_SKINS.find((b) => b.id === playerCustom.ballId) || BALL_SKINS[0];

  // Save to LocalStorage on changes
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          playerCustom,
          careerStats: {
            ...careerStats,
            currentDivision: userDivisionId,
            currentSeason: universe.careerSeason
          }
        })
      );
    } catch (e) {
      console.error('Failed to save career data:', e);
    }
  }, [playerCustom, careerStats, userDivisionId, universe.careerSeason]);

  // Fullscreen helper
  const toggleFullscreen = () => {
    try {
      if (!document.fullscreenElement && !(document as any).webkitFullscreenElement) {
        const root = document.documentElement as any;
        if (root.requestFullscreen) {
          root.requestFullscreen().catch(() => setIsFullscreen((prev) => !prev));
        } else if (root.webkitRequestFullscreen) {
          root.webkitRequestFullscreen();
          setIsFullscreen(true);
        } else {
          setIsFullscreen((prev) => !prev);
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen().catch(() => setIsFullscreen(false));
        } else if ((document as any).webkitExitFullscreen) {
          (document as any).webkitExitFullscreen();
          setIsFullscreen(false);
        } else {
          setIsFullscreen(false);
        }
      }
    } catch (e) {
      setIsFullscreen((prev) => !prev);
    }
  };

  // Helper to unlock trophies
  const unlockTrophy = useCallback((trophyId: string) => {
    setCareerStats((prev) => {
      const existing = prev.trophies.find((t) => t.id === trophyId);
      if (existing && !existing.unlocked) {
        retroAudio.playTrophyUnlock();
        return {
          ...prev,
          trophies: prev.trophies.map((t) =>
            t.id === trophyId ? { ...t, unlocked: true, unlockedAtSeason: universe.careerSeason } : t
          )
        };
      }
      return prev;
    });
  }, [universe.careerSeason]);

  // Shop & RPG Upgrade Handlers
  const handleBuyBall = (ball: BallSkin) => {
    if ((careerStats.coins || 0) >= ball.price) {
      setCareerStats((prev) => ({
        ...prev,
        coins: (prev.coins || 0) - ball.price,
        unlockedBallIds: [...(prev.unlockedBallIds || ['ball-classic']), ball.id]
      }));
      setPlayerCustom((prev) => ({
        ...prev,
        ballId: ball.id
      }));
    }
  };

  const handleBuyItem = (item: any) => {
    if ((careerStats.coins || 0) >= item.price) {
      setCareerStats((prev) => ({
        ...prev,
        coins: (prev.coins || 0) - item.price,
        unlockedItemIds: [...(prev.unlockedItemIds || []), item.id]
      }));
      if (item.category === 'BOOTS' && item.color) {
        setPlayerCustom((prev) => ({ ...prev, bootsColor: item.color }));
      } else if (item.category === 'KIT' && item.pattern) {
        setPlayerCustom((prev) => ({ ...prev, pattern: item.pattern }));
      } else if (item.category === 'SHORTS' && item.shortsStyle) {
        setPlayerCustom((prev) => ({ ...prev, shortsStyle: item.shortsStyle }));
      }
    }
  };

  const handleUpgradeSkill = (skill: 'moveSpeed' | 'shotVelocity' | 'fireRate') => {
    setCareerStats((prev) => {
      if ((prev.skillPoints || 0) <= 0) return prev;
      const key =
        skill === 'moveSpeed'
          ? 'moveSpeedLevel'
          : skill === 'shotVelocity'
          ? 'shotVelocityLevel'
          : 'fireRateLevel';
      const currentVal = prev[key] || 1;
      if (currentVal >= 10) return prev;
      return {
        ...prev,
        skillPoints: prev.skillPoints - 1,
        [key]: currentVal + 1
      };
    });
    setPlayerCustom((prev) => {
      const key =
        skill === 'moveSpeed'
          ? 'moveSpeedLevel'
          : skill === 'shotVelocity'
          ? 'shotVelocityLevel'
          : 'fireRateLevel';
      const currentVal = prev[key] || 1;
      return {
        ...prev,
        [key]: Math.min(10, currentVal + 1)
      };
    });
  };

  // Start regular 60s Match (MATCH ENGINE v1.0)
  const handleStartMatch = () => {
    const engine = new MatchEngine({
      isPlayoff: false,
      divisionId: userDivisionId,
      userClub: userClubEntity,
      rivalClub: rivalClubEntity,
      difficultyFactor: Math.max(1, 24 - userDivisionId),
    });

    matchEngineRef.current = engine;
    setMatchSnapshot(engine.getSnapshot());
    setSuperCharge(100);
    setGameStatus('PLAYING');
    setIsPaused(false);
  };

  // Start Repechaje / Playoff Match
  const handleStartRepechaje = () => {
    setShowRepechajeIntro(false);
    const engine = new MatchEngine({
      isPlayoff: true,
      divisionId: userDivisionId,
      userClub: userClubEntity,
      rivalClub: rivalClubEntity,
      difficultyFactor: Math.max(1, 24 - userDivisionId) + 2,
    });

    matchEngineRef.current = engine;
    setMatchSnapshot(engine.getSnapshot());
    setSuperCharge(100);
    setGameStatus('REPECHAJE_PLAYING');
    setIsPaused(false);
  };

  // Match Finished Handler (MATCH ENGINE & LEAGUE ENGINE INTEGRATION)
  const handleMatchFinished = useCallback(() => {
    retroAudio.playWhistle(true);

    const engine = matchEngineRef.current;
    if (!engine) return;

    const finalSnap = engine.finishMatch();
    const finalPlayerScore = finalSnap.userScore;
    const finalRivalScore = finalSnap.rivalScore;

    const isWin = finalPlayerScore > finalRivalScore;
    const isDraw = finalPlayerScore === finalRivalScore;
    const matchPoints = isWin ? 3 : isDraw ? 1 : 0;

    // Economy & XP calculations
    const baseCoins = isWin ? 600 : isDraw ? 250 : 120;
    const goalBonusCoins = finalPlayerScore * 75;
    const totalMatchCoins = baseCoins + goalBonusCoins;

    const baseExp = isWin ? 250 : isDraw ? 120 : 60;
    const goalBonusExp = finalPlayerScore * 35;
    const totalMatchXp = baseExp + goalBonusExp;

    setLastMatchPoints(matchPoints);
    setLastMatchCoins(totalMatchCoins);
    setLastMatchXp(totalMatchXp);
    setLastMatchStreakBonus(1);

    // Update Career Stats
    setCareerStats((prev) => {
      let newCoins = (prev.coins || 0) + totalMatchCoins;
      let newXp = (prev.xp || 0) + totalMatchXp;
      let newLevel = prev.level || 1;
      let newSkillPoints = prev.skillPoints || 0;
      let currentXpReq = prev.xpToNextLevel || 300;

      while (newXp >= currentXpReq) {
        newXp -= currentXpReq;
        newLevel += 1;
        newSkillPoints += 2;
        currentXpReq = Math.round(currentXpReq * 1.35);
        retroAudio.playLevelUp();
      }

      const isHatTrick = finalPlayerScore >= 3;
      if (isHatTrick) unlockTrophy('trophy-hattrick');
      if (finalPlayerScore >= 5) unlockTrophy('trophy-goleador');

      return {
        ...prev,
        coins: newCoins,
        xp: newXp,
        level: newLevel,
        skillPoints: newSkillPoints,
        xpToNextLevel: currentXpReq,
        totalGoals: prev.totalGoals + finalPlayerScore,
        totalMatches: prev.totalMatches + 1,
        totalWins: prev.totalWins + (isWin ? 1 : 0),
        totalDraws: prev.totalDraws + (isDraw ? 1 : 0),
        totalLosses: prev.totalLosses + (!isWin && !isDraw ? 1 : 0),
        hatTricks: prev.hatTricks + (isHatTrick ? 1 : 0),
        matchHistory: [
          ...prev.matchHistory,
          {
            season: universe.careerSeason,
            matchNumber: currentRound,
            rivalName: currentRival.name,
            playerScore: finalPlayerScore,
            rivalScore: finalRivalScore,
            result: isWin ? 'WIN' : isDraw ? 'DRAW' : 'LOSS',
            division: currentDivision.name
          }
        ]
      };
    });

    // Record match result in LeagueEngine & simulate all other matches of the round
    const { seasonFinished } = LeagueEngine.recordUserMatchResult(
      universe,
      finalPlayerScore,
      finalRivalScore
    );

    LeagueEngine.saveUniverse(universe);
    setUniverse({ ...universe });

    setShowMatchEndModal(true);
  }, [universe, currentRound, currentRival.name, currentDivision.name, unlockTrophy]);

  // Handle Close Match End Modal & Advance Fixture
  const handleContinueAfterMatch = () => {
    setShowMatchEndModal(false);

    if (currentRound < 7) {
      setGameStatus('CAREER_HUB');
    } else {
      // Season End (Fechas 7/7 completed): Check standings for promotion/relegation/repechaje
      const standings = userDivisionState.standings;
      const userRank = standings.findIndex((st) => st.clubId === universe.userClubId) + 1;

      const oldDiv = currentDivision;
      setOldDivisionForSummary(oldDiv);

      if (userRank <= 2) {
        const outcome = userDivisionId === 1 ? 'CHAMPION' : 'PROMOTION';
        setSeasonOutcome(outcome);
        const nextDivId = Math.max(1, userDivisionId - 1);
        const nextDiv = DIVISIONS.find((d) => d.id === nextDivId) || DIVISIONS[0];
        setNewDivisionForSummary(nextDiv);
        if (outcome === 'CHAMPION') unlockTrophy('trophy-champion');
        if (outcome === 'PROMOTION') unlockTrophy('trophy-promotion');
      } else if (userRank >= 7 && userDivisionId < 23) {
        setSeasonOutcome('RELEGATION');
        const nextDivId = Math.min(23, userDivisionId + 1);
        const nextDiv = DIVISIONS.find((d) => d.id === nextDivId) || DIVISIONS[0];
        setNewDivisionForSummary(nextDiv);
      } else {
        setSeasonOutcome('MAINTENANCE');
        setNewDivisionForSummary(oldDiv);
      }

      setShowSeasonSummary(true);
    }
  };

  // Start Next Season Transition (LEAGUE ENGINE v1.0)
  const handleStartNextSeason = () => {
    setShowSeasonSummary(false);

    // Run official universe season advancement
    const { universe: updatedUniverse } = LeagueEngine.finishSeasonAndTransition(universe);
    LeagueEngine.saveUniverse(updatedUniverse);
    setUniverse({ ...updatedUniverse });

    const newUserDiv = updatedUniverse.clubs[updatedUniverse.userClubId]?.divisionId || 23;

    // Age up player and sync career stats
    setCareerStats((prev) => ({
      ...prev,
      age: prev.age + 1,
      currentSeason: updatedUniverse.careerSeason,
      currentDivision: newUserDiv
    }));

    setGameStatus('CAREER_HUB');
  };

  // Callback when match engine tick occurs in PixelCanvas
  const handleMatchEngineUpdate = (snapshot: MatchSnapshot) => {
    setMatchSnapshot(snapshot);
    if (snapshot.state === 'MATCH_END' && gameStatus !== 'MATCH_END' && !showMatchEndModal) {
      setGameStatus('MATCH_END');
      handleMatchFinished();
    }
  };

  return (
    <main className="min-h-screen bg-[#0e0804] text-white flex flex-col items-center justify-start p-2 sm:p-4 selection:bg-yellow-500 selection:text-black">
      {/* Dynamic View Switcher */}
      {gameStatus === 'CAREER_HUB' && (
        <CareerHub
          careerStats={careerStats}
          currentDivision={currentDivision}
          leagueStandings={leagueStandings}
          nextRival={currentRival}
          currentMatchNumber={currentRound}
          playerCustom={playerCustom}
          onStartMatch={handleStartMatch}
          onOpenCustomizer={() => setShowCustomizer(true)}
          onOpenTrophies={() => setShowTrophies(true)}
          onOpenSkills={() => setShowSkills(true)}
          onOpenShop={() => setShowShop(true)}
        />
      )}

      {(gameStatus === 'PLAYING' || gameStatus === 'REPECHAJE_PLAYING' || gameStatus === 'MATCH_END') && matchEngineRef.current && (
        <div className="w-full max-w-4xl flex flex-col gap-3">
          {/* Retro ScoreBoard HUD with Pressure Bar & Shooting Clock */}
          <ScoreBoard
            playerScore={matchSnapshot?.userScore ?? 0}
            rivalScore={matchSnapshot?.rivalScore ?? 0}
            matchTimeRemaining={matchSnapshot?.timeRemaining ?? 60}
            isRepechaje={gameStatus === 'REPECHAJE_PLAYING'}
            isOvertime={matchSnapshot?.isOvertime ?? false}
            overtimePeriodIndex={matchSnapshot?.overtimePeriodIndex ?? 0}
            repechajeTargetGoals={currentRival.targetGoalsToWin}
            division={currentDivision}
            playerCustom={playerCustom}
            rivalTeam={currentRival}
            playerAge={careerStats.age}
            currentSeason={universe.careerSeason}
            currentMatchNumber={currentRound}
            superCharge={superCharge}
            rivalPressure={matchSnapshot?.rivalPressure ?? 0}
            shootingClock={matchSnapshot?.shootingClock ?? 16}
            shootingClockMax={matchSnapshot?.shootingClockMax ?? 16}
            isMuted={isMuted}
            coins={careerStats.coins}
            isFullscreen={isFullscreen}
            onToggleMute={() => {
              const muted = retroAudio.toggleMute();
              setIsMuted(muted);
            }}
            onPause={() => {
              setIsPaused(true);
              matchEngineRef.current?.pause();
            }}
            onToggleFullscreen={toggleFullscreen}
          />

          {/* 16-Bit Pixel Art Game Canvas */}
          <PixelCanvas
            playerCustom={playerCustom}
            ballSkin={currentBallSkin}
            rivalTeam={currentRival}
            isRepechaje={gameStatus === 'REPECHAJE_PLAYING'}
            matchEngine={matchEngineRef.current}
            onGoalScored={() => {
              // Goals are registered by MatchEngine internally and reflected on the scoreboard
            }}
            onShotMissed={() => {
              // Misses update stats in MatchEngine
            }}
            onSuperChargedChange={(charge) => setSuperCharge(charge)}
            onMatchEngineUpdate={handleMatchEngineUpdate}
            isPaused={isPaused}
            isFullscreen={isFullscreen}
          />
        </div>
      )}

      {/* Modals & Dialogs */}
      {showCustomizer && (
        <CustomizerModal
          playerCustom={playerCustom}
          customization={playerCustom}
          currentSeason={universe.careerSeason}
          coins={careerStats.coins}
          unlockedItemIds={careerStats.unlockedItemIds}
          onSave={(newCustom) => {
            setPlayerCustom(newCustom);
            setShowCustomizer(false);
          }}
          onSaveCustomization={(newCustom) => {
            setPlayerCustom(newCustom);
            setShowCustomizer(false);
          }}
          onClose={() => setShowCustomizer(false)}
        />
      )}

      {showTrophies && (
        <TrophyCabinet
          trophies={careerStats.trophies}
          onClose={() => setShowTrophies(false)}
        />
      )}

      {showSkills && (
        <SkillUpgradeModal
          stats={careerStats}
          onUpgradeSkill={handleUpgradeSkill}
          onClose={() => setShowSkills(false)}
        />
      )}

      {showShop && (
        <ShopModal
          coins={careerStats.coins || 0}
          unlockedBallIds={careerStats.unlockedBallIds || ['ball-classic']}
          unlockedItemIds={careerStats.unlockedItemIds || []}
          equippedBallId={playerCustom.ballId}
          onBuyBall={handleBuyBall}
          onBuyItem={handleBuyItem}
          onEquipBall={(ballId) => setPlayerCustom((prev) => ({ ...prev, ballId }))}
          onClose={() => setShowShop(false)}
        />
      )}

      {isPaused && (
        <PauseModal
          onResume={() => {
            setIsPaused(false);
            matchEngineRef.current?.resume();
          }}
          onQuitMatch={() => {
            setIsPaused(false);
            setGameStatus('CAREER_HUB');
          }}
          onToggleMute={() => {
            const muted = retroAudio.toggleMute();
            setIsMuted(muted);
          }}
          isMuted={isMuted}
        />
      )}

      {showMatchEndModal && (
        <MatchEndModal
          playerScore={matchSnapshot?.userScore ?? 0}
          rivalScore={matchSnapshot?.rivalScore ?? 0}
          pointsEarned={lastMatchPoints}
          coinsEarned={lastMatchCoins}
          xpEarned={lastMatchXp}
          streakBonus={lastMatchStreakBonus}
          playerName={playerCustom.name}
          isRepechaje={gameStatus === 'REPECHAJE_PLAYING'}
          repechajeSuccess={(matchSnapshot?.userScore ?? 0) >= currentRival.targetGoalsToWin}
          rivalTeam={currentRival}
          isSeasonEnd={currentRound >= 7}
          onContinue={handleContinueAfterMatch}
        />
      )}

      {showRepechajeIntro && (
        <RepechajeModal
          division={currentDivision}
          onStartRepechaje={handleStartRepechaje}
          onAcceptRelegation={() => {
            setShowRepechajeIntro(false);
            const nextDivId = Math.min(23, userDivisionId + 1);
            const nextDiv = DIVISIONS.find((d) => d.id === nextDivId) || DIVISIONS[0];
            setOldDivisionForSummary(currentDivision);
            setNewDivisionForSummary(nextDiv);
            setSeasonOutcome('RELEGATION');
            setShowSeasonSummary(true);
          }}
        />
      )}

      {showSeasonSummary && (
        <SeasonSummaryModal
          seasonNumber={universe.careerSeason}
          newAge={careerStats.age + 1}
          outcome={seasonOutcome}
          oldDivision={oldDivisionForSummary}
          newDivision={newDivisionForSummary}
          seasonGoals={careerStats.totalGoals}
          seasonPoints={lastMatchPoints}
          onStartNextSeason={handleStartNextSeason}
        />
      )}
    </main>
  );
}
