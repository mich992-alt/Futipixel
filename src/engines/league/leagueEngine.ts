// LEAGUE ENGINE v1.0 — IMPLEMENTACIÓN OFICIAL
// Fuente de verdad única para el universo competitivo de 23 divisiones, 184 clubes y 7 fechas.

import { LEAGUE_CONFIG } from './leagueConfig';
import {
  ClubEntity,
  DivisionState,
  DivisionStandingRow,
  LeagueUniverse,
  MatchScheduleEntry,
  PersistentPlayer,
  PlayerPositionType,
  PlayoffMatchResult,
  SeasonReportFacts,
  DivisionSeasonReportFacts,
} from './leagueTypes';
import { CANONICAL_CLUBS, generateUniqueTeamNames, generateRandomPlayerName } from './namePool';
import { HairStyleType, KitPatternType, CollarStyleType, FormationType } from '../../types';

export class LeagueEngine {
  private static readonly STORAGE_KEY = 'futipixel_league_universe_v1';

  // 1. GENERACIÓN DEL UNIVERSO COMPLETO
  public static createUniverse(userClubCustomName?: string): LeagueUniverse {
    const universeClubs: Record<string, ClubEntity> = {};
    const divisions: Record<number, DivisionState> = {};
    const totalClubsNeeded = LEAGUE_CONFIG.TOTAL_CLUBS;

    // Obtener 184 nombres únicos garantizados
    const allNames = generateUniqueTeamNames(totalClubsNeeded);
    let nameIdx = 0;

    // Crear el club del usuario (ID fijo e inmutable)
    const userClubId = 'club_user_hero';
    const userDivisionId = 23; // El usuario inicia siempre en D23

    const userClub: ClubEntity = {
      id: userClubId,
      name: userClubCustomName || 'FutiPixel C.F.',
      shortName: 'FUT',
      city: 'Potrero City',
      isPlayerClub: true,
      isCanonical: false,
      divisionId: userDivisionId,
      attack: 24,
      defense: 22,
      goalkeeper: 23,
      speed: 24,
      overallRating: 23,
      players: this.generateTeamPlayers('FUT', 23),
      starPlayerId: '',
      tactics: {
        favorite1: '4-3-3',
        favorite2: '4-4-2',
        favorite3: '4-2-3-1',
        currentFormation: '4-3-3',
      },
      colors: {
        primary: '#3b82f6',
        secondary: '#ffffff',
        shorts: '#1e3a8a',
        pattern: 'vertical_stripes',
        collarStyle: 'round',
      },
      consecutiveChampionships: 0,
      consecutiveLastPlacesInD23: 0,
      titlesWon: 0,
      promotions: 0,
      relegations: 0,
    };
    userClub.starPlayerId = this.findStarPlayerId(userClub.players);
    universeClubs[userClubId] = userClub;

    // Distribuir los 183 clubes CPU en las 23 divisiones
    const divisionClubIds: Record<number, string[]> = {};
    for (let d = 1; d <= 23; d++) {
      divisionClubIds[d] = [];
    }
    // Asignar el usuario a la D23
    divisionClubIds[23].push(userClubId);

    // Asignar los canónicos a sus rangos preferidos
    const assignedCanonical = new Set<string>();
    for (const canonical of CANONICAL_CLUBS) {
      if (canonical.name === userClub.name) continue;
      const targetDiv = Math.min(
        23,
        Math.max(
          1,
          Math.floor(
            canonical.preferredDivisionRange[0] +
              Math.random() *
                (canonical.preferredDivisionRange[1] -
                  canonical.preferredDivisionRange[0] +
                  1)
          )
        )
      );

      if (divisionClubIds[targetDiv].length < 8) {
        const clubId = `club_canonical_${canonical.shortName.toLowerCase()}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
        const clubRating = this.getDivisionTargetRating(targetDiv);
        const players = this.generateTeamPlayers(canonical.shortName, clubRating);
        const club: ClubEntity = {
          id: clubId,
          name: canonical.name,
          shortName: canonical.shortName,
          city: canonical.city,
          isPlayerClub: false,
          isCanonical: true,
          divisionId: targetDiv,
          attack: clubRating + Math.floor(Math.random() * 3 - 1),
          defense: clubRating + Math.floor(Math.random() * 3 - 1),
          goalkeeper: clubRating + Math.floor(Math.random() * 3 - 1),
          speed: clubRating + Math.floor(Math.random() * 3 - 1),
          overallRating: clubRating,
          players,
          starPlayerId: this.findStarPlayerId(players),
          tactics: this.generateClubTactics(),
          colors: canonical.colors,
          consecutiveChampionships: 0,
          consecutiveLastPlacesInD23: 0,
          titlesWon: 0,
          promotions: 0,
          relegations: 0,
        };
        universeClubs[clubId] = club;
        divisionClubIds[targetDiv].push(clubId);
        assignedCanonical.add(canonical.name);
      }
    }

    // Llenar todos los slots restantes de cada división hasta tener exactamente 8
    for (let d = 1; d <= 23; d++) {
      while (divisionClubIds[d].length < 8) {
        let teamName = allNames[nameIdx++] || `Club División ${d} - ${divisionClubIds[d].length + 1}`;
        while (
          teamName === userClub.name ||
          assignedCanonical.has(teamName) ||
          Object.values(universeClubs).some((c) => c.name === teamName)
        ) {
          teamName = `${teamName} ${Math.floor(Math.random() * 90 + 10)}`;
        }

        const shortName = this.generateShortName(teamName);
        const clubId = `club_cpu_${d}_${divisionClubIds[d].length + 1}_${Math.random().toString(36).slice(2, 8)}`;
        const clubRating = this.getDivisionTargetRating(d);
        const players = this.generateTeamPlayers(shortName, clubRating);

        const club: ClubEntity = {
          id: clubId,
          name: teamName,
          shortName,
          city: 'Provincia Fútbol',
          isPlayerClub: false,
          isCanonical: false,
          divisionId: d,
          attack: clubRating + Math.floor(Math.random() * 3 - 1),
          defense: clubRating + Math.floor(Math.random() * 3 - 1),
          goalkeeper: clubRating + Math.floor(Math.random() * 3 - 1),
          speed: clubRating + Math.floor(Math.random() * 3 - 1),
          overallRating: clubRating,
          players,
          starPlayerId: this.findStarPlayerId(players),
          tactics: this.generateClubTactics(),
          colors: this.generateProceduralColors(),
          consecutiveChampionships: 0,
          consecutiveLastPlacesInD23: 0,
          titlesWon: 0,
          promotions: 0,
          relegations: 0,
        };
        universeClubs[clubId] = club;
        divisionClubIds[d].push(clubId);
      }
    }

    // Inicializar el estado de cada división con su calendario de 7 fechas x 4 partidos
    for (let d = 1; d <= 23; d++) {
      const cIds = divisionClubIds[d];
      const schedule = this.generateRoundRobinSchedule(d, cIds, userClubId);
      const standings = this.initDivisionStandings(cIds, universeClubs);

      divisions[d] = {
        id: d,
        name: this.getDivisionName(d),
        tierName: this.getDivisionTier(d),
        pitchStyle: this.getDivisionPitchStyle(d),
        clubIds: cIds,
        schedule,
        currentRound: 1,
        standings,
      };
    }

    const universe: LeagueUniverse = {
      version: '1.0',
      careerSeason: 1,
      userClubId,
      divisions,
      clubs: universeClubs,
      userConsecutiveD1Titles: 0,
      isCareerCompleted: false,
      seasonReportsHistory: [],
    };

    this.validateLeagueState(universe);
    this.saveUniverse(universe);
    return universe;
  }

  // 2. CALENDARIO INVIOLABLE: ROUND-ROBIN (7 FECHAS X 4 PARTIDOS)
  // Algoritmo de rotación de polígono estándar para torneos de 8 equipos
  public static generateRoundRobinSchedule(
    divisionId: number,
    teamIds: string[],
    userClubId: string
  ): MatchScheduleEntry[] {
    if (teamIds.length !== 8) {
      throw new Error(`Se requieren exactamente 8 clubes para la división ${divisionId}.`);
    }

    const schedule: MatchScheduleEntry[] = [];
    const teams = [...teamIds];
    // Fijamos el equipo 0 y rotamos los 7 restantes
    const n = teams.length;

    for (let round = 1; round <= 7; round++) {
      for (let i = 0; i < n / 2; i++) {
        const home = teams[i];
        const away = teams[n - 1 - i];
        const isUserMatch = home === userClubId || away === userClubId;

        schedule.push({
          id: `match_d${divisionId}_r${round}_p${i + 1}`,
          roundNumber: round,
          divisionId,
          homeClubId: home,
          awayClubId: away,
          isPlayed: false,
          isPlayerMatch: isUserMatch,
        });
      }

      // Rotación de los equipos (fijando teams[0])
      const fixed = teams[0];
      const rest = teams.slice(1);
      const last = rest.pop()!;
      rest.unshift(last);
      teams.splice(0, teams.length, fixed, ...rest);
    }

    return schedule;
  }

  // 3. INICIALIZACIÓN DE TABLA DE POSICIONES
  public static initDivisionStandings(
    clubIds: string[],
    clubs: Record<string, ClubEntity>
  ): DivisionStandingRow[] {
    const rows: DivisionStandingRow[] = clubIds.map((id, index) => {
      const club = clubs[id];
      return {
        clubId: id,
        clubName: club?.name || `Club ${id}`,
        shortName: club?.shortName || 'CLB',
        isPlayerClub: club?.isPlayerClub || false,
        played: 0,
        won: 0,
        drawn: 0,
        lost: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        goalDifference: 0,
        points: 0,
        position: index + 1,
      };
    });

    return this.calculateStandings(rows, []);
  }

  // 4. CÁLCULO ESTRICTO DE TABLA CON CRITERIOS DE DESEMPATE OFICIALES
  // Orden: 1. PTS, 2. DG, 3. GF, 4. Resultado Directo, 5. Sorteo interno
  public static calculateStandings(
    rows: DivisionStandingRow[],
    playedMatches: MatchScheduleEntry[]
  ): DivisionStandingRow[] {
    const sorted = [...rows].sort((a, b) => {
      // 1. Puntos
      if (b.points !== a.points) return b.points - a.points;
      // 2. Diferencia de Gol
      if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
      // 3. Goles a Favor
      if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;

      // 4. Resultado directo
      const directMatch = playedMatches.find(
        (m) =>
          m.isPlayed &&
          ((m.homeClubId === a.clubId && m.awayClubId === b.clubId) ||
            (m.homeClubId === b.clubId && m.awayClubId === a.clubId))
      );

      if (directMatch && directMatch.homeScore !== undefined && directMatch.awayScore !== undefined) {
        if (directMatch.homeClubId === a.clubId) {
          if (directMatch.homeScore > directMatch.awayScore) return -1;
          if (directMatch.homeScore < directMatch.awayScore) return 1;
        } else {
          if (directMatch.awayScore > directMatch.homeScore) return -1;
          if (directMatch.awayScore < directMatch.homeScore) return 1;
        }
      }

      // 5. Desempate interno determinístico
      return a.clubId.localeCompare(b.clubId);
    });

    return sorted.map((row, idx) => ({
      ...row,
      position: idx + 1,
    }));
  }

  // 5. REGISTRAR RESULTADO DEL PARTIDO DEL USUARIO Y AVANZAR RONDA GLOBAL
  public static recordUserMatchResult(
    universe: LeagueUniverse,
    userGoals: number,
    rivalGoals: number
  ): {
    universe: LeagueUniverse;
    seasonFinished: boolean;
    userDivision: DivisionState;
  } {
    const userDivId = universe.clubs[universe.userClubId].divisionId;
    const userDiv = universe.divisions[userDivId];
    const currentRound = userDiv.currentRound;

    // 1. Encontrar el partido del usuario en la fecha actual
    const userMatch = userDiv.schedule.find(
      (m) => m.roundNumber === currentRound && m.isPlayerMatch && !m.isPlayed
    );

    if (userMatch) {
      userMatch.isPlayed = true;
      if (userMatch.homeClubId === universe.userClubId) {
        userMatch.homeScore = userGoals;
        userMatch.awayScore = rivalGoals;
      } else {
        userMatch.homeScore = rivalGoals;
        userMatch.awayScore = userGoals;
      }
      this.applySingleMatchResultToStandings(userDiv, userMatch);
    }

    // 2. Simular los otros 3 partidos de la división del usuario en esta fecha
    const otherMatches = userDiv.schedule.filter(
      (m) => m.roundNumber === currentRound && !m.isPlayerMatch && !m.isPlayed
    );
    for (const match of otherMatches) {
      this.simulateCpuMatch(universe, match);
      this.applySingleMatchResultToStandings(userDiv, match);
    }

    // 3. Simular simultáneamente las otras 22 divisiones completas para esta misma fecha
    for (let d = 1; d <= 23; d++) {
      if (d === userDivId) continue;
      const div = universe.divisions[d];
      const divMatches = div.schedule.filter(
        (m) => m.roundNumber === currentRound && !m.isPlayed
      );
      for (const m of divMatches) {
        this.simulateCpuMatch(universe, m);
        this.applySingleMatchResultToStandings(div, m);
      }
      div.standings = this.calculateStandings(div.standings, div.schedule);
    }

    // Recalcular tabla de la división del usuario
    userDiv.standings = this.calculateStandings(userDiv.standings, userDiv.schedule);

    // Comprobar si completamos la Fecha 7 (Fin de fase regular)
    if (currentRound >= 7) {
      this.saveUniverse(universe);
      return { universe, seasonFinished: true, userDivision: userDiv };
    } else {
      // Avanzar a la siguiente fecha en todas las divisiones
      for (let d = 1; d <= 23; d++) {
        universe.divisions[d].currentRound += 1;
      }
      this.saveUniverse(universe);
      return { universe, seasonFinished: false, userDivision: userDiv };
    }
  }

  // 6. SIMULACIÓN ESTOCÁSTICA DE PARTIDO CPU
  public static simulateCpuMatch(universe: LeagueUniverse, match: MatchScheduleEntry): void {
    const homeClub = universe.clubs[match.homeClubId];
    const awayClub = universe.clubs[match.awayClubId];

    if (!homeClub || !awayClub) {
      match.homeScore = 1;
      match.awayScore = 0;
      match.isPlayed = true;
      return;
    }

    // Calcular rating efectivo
    let homeRating = homeClub.overallRating;
    let awayRating = awayClub.overallRating;

    // Regla 18: Handicap CPU si está a punto de ganar su 3.er título consecutivo en D1
    if (match.divisionId === 1) {
      if (homeClub.consecutiveChampionships >= 2) {
        homeRating -= 15; // Handicap fuerte antes/durante partido decisivo
      }
      if (awayClub.consecutiveChampionships >= 2) {
        awayRating -= 15;
      }
    }

    // Diferencia y simulación de goles ponderada por ataque y defensa
    const ratingDiff = (homeRating - awayRating) / 10;
    
    // Goles base realistas (promedio 1.2 a 2.5)
    const homeExpected = Math.max(0.2, (homeClub.attack / 35) + (ratingDiff * 0.4));
    const awayExpected = Math.max(0.2, (awayClub.attack / 35) - (ratingDiff * 0.4));

    // Poisson aproximado
    const homeScore = this.samplePoisson(homeExpected);
    const awayScore = this.samplePoisson(awayExpected);

    match.homeScore = homeScore;
    match.awayScore = awayScore;
    match.isPlayed = true;
  }

  // Aplicar un resultado individual a la tabla sin alterar integridad
  private static applySingleMatchResultToStandings(
    div: DivisionState,
    match: MatchScheduleEntry
  ): void {
    if (!match.isPlayed || match.homeScore === undefined || match.awayScore === undefined) return;

    const homeRow = div.standings.find((r) => r.clubId === match.homeClubId);
    const awayRow = div.standings.find((r) => r.clubId === match.awayClubId);

    if (!homeRow || !awayRow) return;

    homeRow.played += 1;
    awayRow.played += 1;

    homeRow.goalsFor += match.homeScore;
    homeRow.goalsAgainst += match.awayScore;
    homeRow.goalDifference = homeRow.goalsFor - homeRow.goalsAgainst;

    awayRow.goalsFor += match.awayScore;
    awayRow.goalsAgainst += match.homeScore;
    awayRow.goalDifference = awayRow.goalsFor - awayRow.goalsAgainst;

    if (match.homeScore > match.awayScore) {
      homeRow.won += 1;
      homeRow.points += LEAGUE_CONFIG.POINTS_WIN;
      awayRow.lost += 1;
    } else if (match.homeScore < match.awayScore) {
      awayRow.won += 1;
      awayRow.points += LEAGUE_CONFIG.POINTS_WIN;
      homeRow.lost += 1;
    } else {
      homeRow.drawn += 1;
      homeRow.points += LEAGUE_CONFIG.POINTS_DRAW;
      awayRow.drawn += 1;
      awayRow.points += LEAGUE_CONFIG.POINTS_DRAW;
    }
  }

  // 7. SIMULAR REPECHAJES CPU (NO ES 50/50, CONSIDERA FUERZA REAL Y FORMA)
  public static simulateCpuPlayoff(
    homeClub: ClubEntity,
    awayClub: ClubEntity,
    divisionId: number,
    matchType: 'PROMOTION_PLAYOFF' | 'RELEGATION_PLAYOFF'
  ): PlayoffMatchResult {
    const diff = (homeClub.overallRating - awayClub.overallRating) / 10;
    let homeScore = this.samplePoisson(1.5 + diff * 0.5);
    let awayScore = this.samplePoisson(1.5 - diff * 0.5);

    let periods = 0;
    // En playoffs debe haber obligatoriamente un ganador
    while (homeScore === awayScore) {
      periods++;
      if (Math.random() < 0.5 + diff * 0.05) {
        homeScore += 1;
      } else {
        awayScore += 1;
      }
    }

    const winnerId = homeScore > awayScore ? homeClub.id : awayClub.id;
    const loserId = homeScore > awayScore ? awayClub.id : homeClub.id;

    return {
      matchType,
      divisionId,
      homeClub,
      awayClub,
      homeScore,
      awayScore,
      winnerClubId: winnerId,
      loserClubId: loserId,
      isUserMatch: false,
      penaltyShootoutOrOvertimePeriods: periods,
    };
  }

  // 8. FINALIZACIÓN Y ORDEN GLOBAL DE TEMPORADA
  // Cláusula 24:
  // 1. Tablas finales
  // 2. Repechajes
  // 3. Campeones
  // 4. Ascensos
  // 5. Descensos
  // 6. Evolución de fuerza
  // 7. Boosts, penalizaciones y reestructuraciones
  // 8. Reporte mundial
  // 9. Redistribución exacta (8 clubes x división)
  // 10. Nueva temporada
  public static finishSeasonAndTransition(
    universe: LeagueUniverse,
    userPlayoffResult?: PlayoffMatchResult
  ): {
    universe: LeagueUniverse;
    report: SeasonReportFacts;
  } {
    const reports: DivisionSeasonReportFacts[] = [];
    const promotionsToDivision: Record<number, string[]> = {};
    const relegationsToDivision: Record<number, string[]> = {};

    for (let d = 1; d <= 23; d++) {
      promotionsToDivision[d] = [];
      relegationsToDivision[d] = [];
    }

    // 1 & 2. Determinar clasificaciones y simular playoffs de todas las divisiones
    for (let d = 1; d <= 23; d++) {
      const div = universe.divisions[d];
      div.standings = this.calculateStandings(div.standings, div.schedule);
      const st = div.standings;

      const champion = universe.clubs[st[0].clubId];
      champion.titlesWon += 1;
      champion.consecutiveChampionships += 1;

      const reportFact: DivisionSeasonReportFacts = {
        divisionId: d,
        championClubId: champion.id,
        championClubName: champion.name,
      };

      // ASCENSOS (D23 a D2)
      if (d > 1) {
        // 1.º Asciende directo
        const directPromoted = universe.clubs[st[0].clubId];
        directPromoted.promotions += 1;
        promotionsToDivision[d - 1].push(directPromoted.id);
        reportFact.directPromotedClubId = directPromoted.id;
        reportFact.directPromotedClubName = directPromoted.name;

        // 2.º vs 3.º -> Repechaje de ascenso
        const club2nd = universe.clubs[st[1].clubId];
        const club3rd = universe.clubs[st[2].clubId];
        let promoPlayoff: PlayoffMatchResult;

        if (userPlayoffResult && userPlayoffResult.divisionId === d && userPlayoffResult.matchType === 'PROMOTION_PLAYOFF') {
          promoPlayoff = userPlayoffResult;
        } else {
          promoPlayoff = this.simulateCpuPlayoff(club2nd, club3rd, d, 'PROMOTION_PLAYOFF');
        }
        div.promotionPlayoff = promoPlayoff;

        const promoWinner = universe.clubs[promoPlayoff.winnerClubId];
        promoWinner.promotions += 1;
        promotionsToDivision[d - 1].push(promoWinner.id);
        reportFact.playoffPromotionWinnerClubId = promoWinner.id;
        reportFact.playoffPromotionWinnerClubName = promoWinner.name;
      } else {
        // En División 1 no hay ascenso
        // 2.º y 3.º reciben boost para siguiente temporada
        const runnerUp = universe.clubs[st[1].clubId];
        const third = universe.clubs[st[2].clubId];
        runnerUp.overallRating += LEAGUE_CONFIG.FORCE_CHANGES.D1_RUNNER_UP_BOOST;
        third.overallRating += LEAGUE_CONFIG.FORCE_CHANGES.D1_THIRD_PLACE_BOOST;
      }

      // PERMANENCIA Y DESCENSOS (D1 a D22)
      if (d < 23) {
        // 6.º vs 7.º -> Repechaje de permanencia
        const club6th = universe.clubs[st[5].clubId];
        const club7th = universe.clubs[st[6].clubId];
        let relPlayoff: PlayoffMatchResult;

        if (userPlayoffResult && userPlayoffResult.divisionId === d && userPlayoffResult.matchType === 'RELEGATION_PLAYOFF') {
          relPlayoff = userPlayoffResult;
        } else {
          relPlayoff = this.simulateCpuPlayoff(club6th, club7th, d, 'RELEGATION_PLAYOFF');
        }
        div.relegationPlayoff = relPlayoff;

        const relWinner = universe.clubs[relPlayoff.winnerClubId];
        const relLoser = universe.clubs[relPlayoff.loserClubId];
        relLoser.relegations += 1;
        relegationsToDivision[d + 1].push(relLoser.id);

        reportFact.playoffRelegationWinnerClubId = relWinner.id;
        reportFact.playoffRelegationWinnerClubName = relWinner.name;
        reportFact.playoffRelegatedClubId = relLoser.id;
        reportFact.playoffRelegatedClubName = relLoser.name;

        // 8.º -> Descenso directo
        const directRelegated = universe.clubs[st[7].clubId];
        directRelegated.relegations += 1;
        relegationsToDivision[d + 1].push(directRelegated.id);
        reportFact.directRelegatedClubId = directRelegated.id;
        reportFact.directRelegatedClubName = directRelegated.name;
      } else {
        // DIVISIÓN 23 (Reglas especiales: no hay D24)
        const club6th = universe.clubs[st[5].clubId];
        const club7th = universe.clubs[st[6].clubId];
        let d23Playoff: PlayoffMatchResult;
        if (userPlayoffResult && userPlayoffResult.divisionId === 23) {
          d23Playoff = userPlayoffResult;
        } else {
          d23Playoff = this.simulateCpuPlayoff(club6th, club7th, 23, 'RELEGATION_PLAYOFF');
        }
        div.relegationPlayoff = d23Playoff;
        const loser23 = universe.clubs[d23Playoff.loserClubId];
        loser23.overallRating = Math.max(15, loser23.overallRating + LEAGUE_CONFIG.FORCE_CHANGES.D23_PLAYOFF_LOSER_PENALTY);

        const lastPlaceD23 = universe.clubs[st[7].clubId];
        lastPlaceD23.consecutiveLastPlacesInD23 += 1;
        lastPlaceD23.overallRating = Math.max(12, lastPlaceD23.overallRating + LEAGUE_CONFIG.FORCE_CHANGES.D23_LAST_PLACE_PENALTY);

        // Reestructuración si queda 8.º dos temporadas consecutivas
        if (lastPlaceD23.consecutiveLastPlacesInD23 >= 2) {
          const std = LEAGUE_CONFIG.DIVISION_BASE_RATINGS[23].stdAvg;
          lastPlaceD23.overallRating = std + Math.floor(Math.random() * 6 - 2); // std -2 a std +3
          lastPlaceD23.consecutiveLastPlacesInD23 = 0;
        }
      }

      // APLICAR EVOLUCIÓN DINÁMICA DE FUERZA (Cláusula 14)
      for (const row of st) {
        const c = universe.clubs[row.clubId];
        if (row.position === 1) {
          c.overallRating += LEAGUE_CONFIG.FORCE_CHANGES.CHAMPION;
          // Si es D1, aplica la penalización de defender el título
          if (d === 1) {
            c.overallRating += LEAGUE_CONFIG.FORCE_CHANGES.D1_CHAMPION_PENALTY;
          }
        } else {
          // Si no fue campeón, rompe la racha de títulos consecutivos
          if (c.consecutiveChampionships > 0 && row.position !== 1) {
            c.consecutiveChampionships = 0;
          }
        }

        // Bonus por 4 campeonatos consecutivos
        if (c.consecutiveChampionships >= LEAGUE_CONFIG.FORCE_CHANGES.CONSECUTIVE_TITLES_THRESHOLD) {
          c.overallRating += LEAGUE_CONFIG.FORCE_CHANGES.CONSECUTIVE_TITLES_BOOST;
          c.consecutiveChampionships = 0;
        }

        // Sincronizar stats del club y sus jugadores
        this.syncClubRatings(c);
      }

      reports.push(reportFact);
    }

    // 3. COMPROBAR CONDICIÓN DE VICTORIA DEL USUARIO
    const userClub = universe.clubs[universe.userClubId];
    let isCareerCompleted = false;

    if (userClub.divisionId === 1 && universe.divisions[1].standings[0].clubId === userClub.id) {
      universe.userConsecutiveD1Titles += 1;
      if (universe.userConsecutiveD1Titles >= LEAGUE_CONFIG.VICTORY_D1_CONSECUTIVE_TITLES) {
        universe.isCareerCompleted = true;
        isCareerCompleted = true;
      }
    } else if (userClub.divisionId === 1) {
      universe.userConsecutiveD1Titles = 0;
    }

    // 4. REDISTRIBUCIÓN EXACTA DE CLUBES ENTRE DIVISIONES (Cláusula 12)
    // Se reconstruyen las listas de 8 clubes por división
    const newDivisionClubs: Record<number, string[]> = {};
    for (let d = 1; d <= 23; d++) {
      newDivisionClubs[d] = [];
    }

    for (let d = 1; d <= 23; d++) {
      const div = universe.divisions[d];
      for (const row of div.standings) {
        const cId = row.clubId;
        // Si fue promovido a d-1
        if (d > 1 && promotionsToDivision[d - 1].includes(cId)) {
          newDivisionClubs[d - 1].push(cId);
          universe.clubs[cId].divisionId = d - 1;
        }
        // Si fue relegado a d+1
        else if (d < 23 && relegationsToDivision[d + 1].includes(cId)) {
          newDivisionClubs[d + 1].push(cId);
          universe.clubs[cId].divisionId = d + 1;
        }
        // Si permanece en d
        else {
          newDivisionClubs[d].push(cId);
          universe.clubs[cId].divisionId = d;
        }
      }
    }

    // 5. INICIAR NUEVA TEMPORADA (RESET DE CALENDARIO Y TABLAS A PJ=0)
    universe.careerSeason += 1;
    for (let d = 1; d <= 23; d++) {
      const cIds = newDivisionClubs[d];
      if (cIds.length !== 8) {
        throw new Error(`Error crítico: División ${d} tiene ${cIds.length} clubes tras transición.`);
      }

      const schedule = this.generateRoundRobinSchedule(d, cIds, universe.userClubId);
      const standings = this.initDivisionStandings(cIds, universe.clubs);

      universe.divisions[d] = {
        id: d,
        name: this.getDivisionName(d),
        tierName: this.getDivisionTier(d),
        pitchStyle: this.getDivisionPitchStyle(d),
        clubIds: cIds,
        schedule,
        currentRound: 1,
        standings,
        promotionPlayoff: undefined,
        relegationPlayoff: undefined,
      };
    }

    const reportFacts: SeasonReportFacts = {
      seasonNumber: universe.careerSeason - 1,
      divisionReports: reports,
      isUserPromoted: userClub.divisionId < (universe.divisions[userClub.divisionId + 1]?.id || 24),
      isUserRelegated: userClub.divisionId > 1 && relegationsToDivision[userClub.divisionId].includes(userClub.id),
      isUserChampion: reports.some((r) => r.championClubId === userClub.id),
      isCareerCompleted,
    };

    universe.seasonReportsHistory.push(reportFacts);
    this.validateLeagueState(universe);
    this.saveUniverse(universe);

    return { universe, report: reportFacts };
  }

  // 9. VALIDACIÓN DE INTEGRIDAD ESTRICTA (Cláusula 27)
  public static validateLeagueState(universe: LeagueUniverse): boolean {
    if (Object.keys(universe.divisions).length !== LEAGUE_CONFIG.TOTAL_DIVISIONS) {
      throw new Error(`Integrity error: Expected 23 divisions, got ${Object.keys(universe.divisions).length}`);
    }

    const uniqueClubIds = new Set<string>();

    for (let d = 1; d <= 23; d++) {
      const div = universe.divisions[d];
      if (!div || div.clubIds.length !== 8) {
        throw new Error(`Integrity error: Division ${d} does not have exactly 8 clubs.`);
      }

      for (const id of div.clubIds) {
        if (uniqueClubIds.has(id)) {
          throw new Error(`Integrity error: Club ${id} exists in multiple divisions.`);
        }
        uniqueClubIds.add(id);
      }

      if (div.schedule.length !== 28) {
        throw new Error(`Integrity error: Division ${d} schedule does not have 28 matches.`);
      }

      // Validar matemáticas de la tabla
      for (const row of div.standings) {
        if (row.goalDifference !== row.goalsFor - row.goalsAgainst) {
          throw new Error(`Integrity error: DG mismatch for ${row.clubName}`);
        }
        if (row.points !== row.won * 3 + row.drawn) {
          throw new Error(`Integrity error: PTS mismatch for ${row.clubName}`);
        }
        if (row.played !== row.won + row.drawn + row.lost) {
          throw new Error(`Integrity error: PJ mismatch for ${row.clubName}`);
        }
      }
    }

    return true;
  }

  // MÉTODOS AUXILIARES Y PERSISTENCIA SEGURA
  public static loadOrCreateUniverse(userClubCustomName?: string): LeagueUniverse {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.version === '1.0' && parsed.divisions && Object.keys(parsed.divisions).length === 23) {
          this.validateLeagueState(parsed);
          return parsed;
        }
      }
    } catch {
      console.warn('[LeagueEngine] Fallback to new universe generation');
    }
    return this.createUniverse(userClubCustomName);
  }

  public static saveUniverse(universe: LeagueUniverse): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(universe));
    } catch (e) {
      console.error('[LeagueEngine] Failed to save universe state:', e);
    }
  }

  // Generar 11 jugadores persistentes con posiciones y ratings
  private static generateTeamPlayers(shortName: string, avgRating: number): PersistentPlayer[] {
    const players: PersistentPlayer[] = [];
    const positions: PlayerPositionType[] = [
      'GK',
      'DEF', 'DEF', 'DEF', 'DEF',
      'MID', 'MID', 'MID',
      'FWD', 'FWD', 'FWD',
    ];

    const hairStyles: HairStyleType[] = [
      'classic', 'short', 'afro', 'long', 'mohawk', 'ponytail', 'mullet', 'buzzcut', 'spiky',
    ];
    const hairColors = ['#09090b', '#713f12', '#ca8a04', '#dc2626', '#94a3b8'];
    const skinTones = ['#fbcfe8', '#fde047', '#fed7aa', '#e2a878', '#a16207', '#78350f'];
    const bootColors = ['#18181b', '#ffffff', '#ef4444', '#3b82f6', '#eab308', '#10b981'];

    positions.forEach((pos, idx) => {
      const rating = Math.min(99, Math.max(15, avgRating + Math.floor(Math.random() * 5 - 2)));
      players.push({
        id: `p_${shortName}_${idx + 1}_${Math.random().toString(36).slice(2, 6)}`,
        name: generateRandomPlayerName(),
        number: idx === 0 ? 1 : idx + 1,
        position: pos,
        rating,
        hairStyle: hairStyles[Math.floor(Math.random() * hairStyles.length)],
        hairColor: hairColors[Math.floor(Math.random() * hairColors.length)],
        skinTone: skinTones[Math.floor(Math.random() * skinTones.length)],
        bootsColor: bootColors[Math.floor(Math.random() * bootColors.length)],
      });
    });

    return players;
  }

  private static findStarPlayerId(players: PersistentPlayer[]): string {
    let max = -1;
    let starId = players[0]?.id || '';
    for (const p of players) {
      if (p.rating > max) {
        max = p.rating;
        starId = p.id;
      }
    }
    return starId;
  }

  private static syncClubRatings(club: ClubEntity): void {
    club.overallRating = Math.min(99, Math.max(10, Math.round(club.overallRating)));
    club.attack = Math.min(99, Math.max(10, Math.round(club.overallRating + (Math.random() * 2 - 1))));
    club.defense = Math.min(99, Math.max(10, Math.round(club.overallRating + (Math.random() * 2 - 1))));
    club.goalkeeper = Math.min(99, Math.max(10, Math.round(club.overallRating + (Math.random() * 2 - 1))));
    club.speed = Math.min(99, Math.max(10, Math.round(club.overallRating + (Math.random() * 2 - 1))));

    // Actualizar ratings de jugadores acordes
    for (const p of club.players) {
      p.rating = Math.min(99, Math.max(10, club.overallRating + Math.floor(Math.random() * 4 - 2)));
    }
    club.starPlayerId = this.findStarPlayerId(club.players);
  }

  private static getDivisionTargetRating(divisionId: number): number {
    const config = LEAGUE_CONFIG.DIVISION_BASE_RATINGS[divisionId];
    if (!config) return 50;
    return Math.floor(config.min + Math.random() * (config.max - config.min + 1));
  }

  private static generateClubTactics(): {
    favorite1: FormationType;
    favorite2: FormationType;
    favorite3: FormationType;
    currentFormation: FormationType;
  } {
    const pool = LEAGUE_CONFIG.FORMATIONS_POOL;
    const f1 = pool[Math.floor(Math.random() * pool.length)];
    const f2 = pool[Math.floor(Math.random() * pool.length)];
    const f3 = pool[Math.floor(Math.random() * pool.length)];
    return {
      favorite1: f1,
      favorite2: f2,
      favorite3: f3,
      currentFormation: f1,
    };
  }

  private static generateProceduralColors(): {
    primary: string;
    secondary: string;
    shorts: string;
    pattern: KitPatternType;
    collarStyle: CollarStyleType;
  } {
    const palettes = [
      { primary: '#ef4444', secondary: '#ffffff', shorts: '#18181b' },
      { primary: '#3b82f6', secondary: '#ffffff', shorts: '#1e3a8a' },
      { primary: '#10b981', secondary: '#000000', shorts: '#ffffff' },
      { primary: '#f59e0b', secondary: '#18181b', shorts: '#18181b' },
      { primary: '#8b5cf6', secondary: '#ffffff', shorts: '#4c1d95' },
      { primary: '#06b6d4', secondary: '#18181b', shorts: '#0891b2' },
      { primary: '#f43f5e', secondary: '#ffffff', shorts: '#881337' },
      { primary: '#84cc16', secondary: '#18181b', shorts: '#365314' },
      { primary: '#ffffff', secondary: '#000000', shorts: '#000000' },
      { primary: '#18181b', secondary: '#fbbf24', shorts: '#18181b' },
    ];
    const patterns: KitPatternType[] = [
      'solid', 'vertical_stripes', 'hoops', 'sash', 'halves', 'diamonds', 'retro_wave',
    ];
    const collars: CollarStyleType[] = ['round', 'v_neck', 'polo'];

    const chosen = palettes[Math.floor(Math.random() * palettes.length)];
    return {
      ...chosen,
      pattern: patterns[Math.floor(Math.random() * patterns.length)],
      collarStyle: collars[Math.floor(Math.random() * collars.length)],
    };
  }

  private static generateShortName(fullName: string): string {
    const clean = fullName.replace(/[^a-zA-Z0-9 ]/g, '').trim().toUpperCase();
    const words = clean.split(/\s+/);
    if (words.length >= 3) {
      return (words[0][0] + words[1][0] + words[2][0]).slice(0, 3);
    }
    if (words.length === 2) {
      return (words[0].slice(0, 2) + words[1][0]).slice(0, 3);
    }
    return clean.slice(0, 3);
  }

  private static samplePoisson(lambda: number): number {
    let l = Math.exp(-lambda);
    let k = 0;
    let p = 1.0;
    do {
      k++;
      p *= Math.random();
    } while (p > l);
    return Math.min(8, Math.max(0, k - 1));
  }

  public static getDivisionName(divisionId: number): string {
    const names: Record<number, string> = {
      1: 'Liga Premier de Honor',
      2: 'División de Plata A',
      3: 'División de Plata B',
      4: 'Torneo Nacional 1.ª',
      5: 'Torneo Nacional 2.ª',
      6: 'Liga Metropolitana A',
      7: 'Liga Metropolitana B',
      8: 'Circuito Regional Élite',
      9: 'Circuito Regional Pro',
      10: 'Liga Provincial A',
      11: 'Liga Provincial B',
      12: 'Torneo del Interior 1.ª',
      13: 'Torneo del Interior 2.ª',
      14: 'Torneo Comunal Élite',
      15: 'Torneo Comunal Centro',
      16: 'Liga Suburbana A',
      17: 'Liga Suburbana B',
      18: 'Liga Barrial Promocional',
      19: 'Circuito Vecinal A',
      20: 'Circuito Vecinal B',
      21: 'Torneo Fango y Barro',
      22: 'Liga Potrero Regional',
      23: 'Potrero del Fondo D23',
    };
    return names[divisionId] || `División ${divisionId}`;
  }

  public static getDivisionTier(divisionId: number): string {
    if (divisionId === 1) return 'ÉLITE MUNDIAL';
    if (divisionId <= 3) return 'PROFESIONAL SUPREMA';
    if (divisionId <= 7) return 'PROFESIONAL REGIONAL';
    if (divisionId <= 13) return 'SEMI-PROFESIONAL';
    if (divisionId <= 18) return 'AMATEUR COMPETITIVO';
    return 'POTRERO BARRIAL';
  }

  public static getDivisionPitchStyle(
    divisionId: number
  ): 'dirt_potrero' | 'municipal_worn' | 'regional_grass' | 'pro_stadium' | 'elite_arena' {
    if (divisionId >= 21) return 'dirt_potrero';
    if (divisionId >= 16) return 'municipal_worn';
    if (divisionId >= 10) return 'regional_grass';
    if (divisionId >= 4) return 'pro_stadium';
    return 'elite_arena';
  }
}
