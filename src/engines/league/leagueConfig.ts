// LEAGUE ENGINE v1.0 — CONFIGURACIÓN CENTRALIZADA
// Todos los parámetros de balance, evolución y reglas de liga se definen aquí.

export const LEAGUE_CONFIG = {
  TOTAL_DIVISIONS: 23,
  TEAMS_PER_DIVISION: 8,
  TOTAL_CLUBS: 184, // 23 * 8
  TOTAL_ROUNDS: 7, // 7 fechas (todos contra todos a 1 rueda)
  MATCHES_PER_ROUND: 4, // 4 partidos por fecha por división

  // Puntuación oficial inviolable
  POINTS_WIN: 3,
  POINTS_DRAW: 1,
  POINTS_LOSS: 0,

  // Ascensos y descensos
  DIRECT_PROMOTIONS: 1, // 1.º asciende directo
  PLAYOFF_PROMOTIONS: 1, // 2.º vs 3.º -> 1 asciende
  TOTAL_PROMOTIONS: 2,

  DIRECT_RELEGATIONS: 1, // 8.º desciende directo
  PLAYOFF_RELEGATIONS: 1, // 6.º vs 7.º -> 1 desciende
  TOTAL_RELEGATIONS: 2,

  // Ratings de inicio por división (D1 élite, D23 potrero)
  DIVISION_BASE_RATINGS: {
    1: { min: 88, max: 94, stdAvg: 91 },
    2: { min: 84, max: 88, stdAvg: 86 },
    3: { min: 80, max: 84, stdAvg: 82 },
    4: { min: 77, max: 81, stdAvg: 79 },
    5: { min: 74, max: 78, stdAvg: 76 },
    6: { min: 71, max: 75, stdAvg: 73 },
    7: { min: 68, max: 72, stdAvg: 70 },
    8: { min: 65, max: 69, stdAvg: 67 },
    9: { min: 62, max: 66, stdAvg: 64 },
    10: { min: 59, max: 63, stdAvg: 61 },
    11: { min: 56, max: 60, stdAvg: 58 },
    12: { min: 53, max: 57, stdAvg: 55 },
    13: { min: 50, max: 54, stdAvg: 52 },
    14: { min: 47, max: 51, stdAvg: 49 },
    15: { min: 44, max: 48, stdAvg: 46 },
    16: { min: 41, max: 45, stdAvg: 43 },
    17: { min: 38, max: 42, stdAvg: 40 },
    18: { min: 35, max: 39, stdAvg: 37 },
    19: { min: 32, max: 36, stdAvg: 34 },
    20: { min: 29, max: 33, stdAvg: 31 },
    21: { min: 26, max: 30, stdAvg: 28 },
    22: { min: 23, max: 27, stdAvg: 25 },
    23: { min: 20, max: 24, stdAvg: 22 },
  } as Record<number, { min: number; max: number; stdAvg: number }>,

  // Evolución de fuerza fin de temporada
  FORCE_CHANGES: {
    CHAMPION: 2.0, // Campeón ++
    PLAYOFF_PROMOTION_WINNER: 1.0, // Ganador repechaje ascenso +
    SAFE_STAY: 0.0, // 4.º, 5.º o ganador repechaje permanencia 0
    PLAYOFF_RELEGATION_LOSER: -1.0, // Perdedor repechaje permanencia -
    DIRECT_RELEGATION_LAST: -2.0, // 8.º o descenso directo --

    // Reglas especiales División 23
    D23_PLAYOFF_LOSER_PENALTY: -1.0, // Perdedor 6.º vs 7.º en D23
    D23_LAST_PLACE_PENALTY: -2.0, // 8.º puesto en D23

    // Reglas especiales División 1
    D1_CHAMPION_PENALTY: -2.0, // Campeón de D1 sufre -2 para defender título
    D1_RUNNER_UP_BOOST: 2.0, // 2.º puesto D1 recibe +2
    D1_THIRD_PLACE_BOOST: 1.0, // 3.º puesto D1 recibe +1

    // Racha extraordinaria
    CONSECUTIVE_TITLES_BOOST: 3.0, // Boost tras 4 campeonatos consecutivos
    CONSECUTIVE_TITLES_THRESHOLD: 4,
  },

  // Condición de Victoria
  VICTORY_D1_CONSECUTIVE_TITLES: 3,

  // Formaciones posibles y pesos
  FORMATIONS_POOL: [
    '4-3-3',
    '4-4-2',
    '4-2-3-1',
    '3-5-2',
    '5-3-2',
    '3-4-3',
    '4-2-2-2',
    '3-4-2-1',
    '4-3-1-2',
    '3-4-1-2',
    '3-2-4-1',
  ] as const,

  // Probabilidad de selección de formación: Fav1 (50%), Fav2 (25%), Fav3 (15%), Sorpresa (10%)
  FORMATION_WEIGHTS: {
    FAV1: 0.50,
    FAV2: 0.25,
    FAV3: 0.15,
    SURPRISE: 0.10,
  },
};
