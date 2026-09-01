// MATCH ENGINE v1.0 — CONFIGURACIÓN CENTRALIZADA
// Centraliza todos los parámetros balanceables de tiempo, presión, contraataques, penales, tiros libres y recuperaciones.

export const MATCH_CONFIG = {
  // Duración base en segundos
  BASE_MATCH_DURATION: 60,

  // Prórrogas de repechaje sucesivas (+30, +15, +10, +10...)
  OVERTIME_BLOCKS: [30, 15, 10, 10, 10, 10, 10, 10, 10, 10],

  // Shooting clock por rangos de división
  SHOOTING_CLOCK_DURATIONS: {
    D23_D18: 16,
    D17_D12: 14,
    D11_D6: 12,
    D5_D2: 11,
    D1: 10,
  },

  // Matriz de presión rival (0 - 100)
  PRESSURE: {
    MIN: 0,
    MAX: 100,
    INITIAL: 0,
    GOAL_MULTIPLIER: 0.35, // pressure = pressure * 0.35
    PENALTY_EXECUTED: 0, // pressure = 0
    FREE_KICK_EXECUTED_MULTIPLIER: 0.25, // pressure = pressure * 0.25
    POST_HIT: -12,
    DEFENDER_OUT_CORNER: -8,
    KEEPER_OUT: -7,
    KEEPER_REBOUND_FIELD: 2,
    KEEPER_CATCH: 5,
    LONG_SHOT_WIDE: 2,
    SIDE_SHOT_WIDE: 3,
    BLOCK_DEFENDER: 8,
    BLOCK_MIDFIELDER: 14,
    BLOCK_ATTACKER: 22,
    SUPER_SHOT_BLOCKED: 0,
    CURVED_SHOT_BLOCKED_DIVISOR: 10, // pressure / 10
    SHOOTING_CLOCK_EXPIRED: 18,
    FORWARD_DOUBLE_DEFLECTION_REDUCE: -6, // Delantero desvía 2 consecutivos
  },

  // Decaimiento natural de presión tras 3 segundos sin pérdidas peligrosas (por segundo)
  DECAY_DELAY_SECONDS: 3.0,
  NATURAL_DECAY_RATES: {
    23: 3.0,
    22: 3.0,
    21: 2.8,
    20: 2.8,
    19: 2.6,
    18: 2.6,
    17: 2.4,
    16: 2.4,
    15: 2.2,
    14: 2.2,
    13: 2.0,
    12: 2.0,
    11: 1.8,
    10: 1.8,
    9: 1.6,
    8: 1.6,
    7: 1.4,
    6: 1.4,
    5: 1.25,
    4: 1.25,
    3: 1.10,
    2: 1.10,
    1: 1.0,
  } as Record<number, number>,

  // Dificultad progresiva por división (D23 ≈ 0.70 a D1 ≈ 1.25)
  DIVISION_DIFFICULTY_FACTORS: {
    23: 0.70,
    22: 0.725,
    21: 0.75,
    20: 0.775,
    19: 0.80,
    18: 0.825,
    17: 0.85,
    16: 0.875,
    15: 0.90,
    14: 0.925,
    13: 0.95,
    12: 0.975,
    11: 1.00,
    10: 1.025,
    9: 1.05,
    8: 1.075,
    7: 1.10,
    6: 1.125,
    5: 1.15,
    4: 1.175,
    3: 1.20,
    2: 1.225,
    1: 1.25,
  } as Record<number, number>,

  // Probabilidades de contraataque por línea recuperadora y eventos
  COUNTER_CHANCES: {
    FORWARD_BASE: 0.35,
    MIDFIELDER_BASE: 0.22,
    DEFENDER_BASE: 0.12,
    KEEPER_CATCH_BASE: 0.28,
    KEEPER_REBOUND_BASE: 0.14,
    SHOOTING_CLOCK_EXPIRED_BASE: 0.30,
  },

  // Pelota parada: condiciones y minijuegos
  SET_PIECE: {
    DECISION_TIMEOUT_SECONDS: 5.0,
    PENALTY_SAME_DEFENDER_DEFLECTIONS: 2,
    PENALTY_TRIGGER_PROBABILITY: 0.50, // 50%
    FREE_KICK_SAME_MIDFIELDER_DEFLECTIONS: 3,
    FREE_KICK_TRIGGER_PROBABILITY: 0.33, // 33%
    TIMEOUT_KEEPER_SAVE_MULTIPLIER: 1.25, // multiplicador de atajada si expiran los 5s
    POST_SET_PIECE_RESULT_DELAY: 1.5, // 1.5s para mostrar resultado/sonido
  },

  // Escala de recuperación tras estirada del portero (3.0s a 0.5s)
  GOALKEEPER_RECOVERY_SCALE: [
    3.00, 2.75, 2.50, 2.25, 2.00, 1.75, 1.50, 1.25, 1.00, 0.75, 0.50,
  ],

  // Debug logger flag
  DEBUG_MODE_DEFAULT: false,
};
