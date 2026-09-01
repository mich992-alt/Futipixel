// POOL DE NOMBRES DE CLUBES Y JUGADORES — 800+ VARIACIONES & EASTER EGGS CANÓNICOS
import { ClubColors } from './leagueTypes';

export interface CanonicalClubPreset {
  name: string;
  shortName: string;
  city: string;
  preferredDivisionRange: [number, number];
  colors: ClubColors;
  isCanonical: true;
}

export const CANONICAL_CLUBS: CanonicalClubPreset[] = [
  {
    name: 'Pixel F.C.',
    shortName: 'PIX',
    city: 'Retroville',
    preferredDivisionRange: [20, 23],
    colors: {
      primary: '#3b82f6',
      secondary: '#ffffff',
      shorts: '#1e3a8a',
      pattern: 'vertical_stripes',
      collarStyle: 'round',
    },
    isCanonical: true,
  },
  {
    name: 'Atlético Bit 8',
    shortName: 'BIT',
    city: 'Chiptown',
    preferredDivisionRange: [18, 22],
    colors: {
      primary: '#ef4444',
      secondary: '#000000',
      shorts: '#000000',
      pattern: 'halves',
      collarStyle: 'v_neck',
    },
    isCanonical: true,
  },
  {
    name: 'Deportivo Sprite',
    shortName: 'SPR',
    city: 'Pixel City',
    preferredDivisionRange: [15, 19],
    colors: {
      primary: '#10b981',
      secondary: '#ffffff',
      shorts: '#047857',
      pattern: 'hoops',
      collarStyle: 'round',
    },
    isCanonical: true,
  },
  {
    name: 'Real Arcade 94',
    shortName: 'ARC',
    city: 'Joyland',
    preferredDivisionRange: [12, 16],
    colors: {
      primary: '#8b5cf6',
      secondary: '#fbbf24',
      shorts: '#ffffff',
      pattern: 'sash',
      collarStyle: 'polo',
      collarColor: '#fbbf24',
    },
    isCanonical: true,
  },
  {
    name: 'Nankatsu Pixel',
    shortName: 'NAN',
    city: 'Shizuoka',
    preferredDivisionRange: [8, 12],
    colors: {
      primary: '#ffffff',
      secondary: '#2563eb',
      shorts: '#2563eb',
      pattern: 'sleeves_contrast',
      collarStyle: 'v_neck',
    },
    isCanonical: true,
  },
  {
    name: 'Inter de Potrero',
    shortName: 'POT',
    city: 'Villa Fango',
    preferredDivisionRange: [21, 23],
    colors: {
      primary: '#eab308',
      secondary: '#18181b',
      shorts: '#18181b',
      pattern: 'vertical_stripes',
      collarStyle: 'round',
    },
    isCanonical: true,
  },
  {
    name: 'Olympique MegaDrive',
    shortName: 'OMD',
    city: 'Sega City',
    preferredDivisionRange: [5, 9],
    colors: {
      primary: '#0284c7',
      secondary: '#f97316',
      shorts: '#0f172a',
      pattern: 'diamonds',
      collarStyle: 'polo',
      collarColor: '#ffffff',
    },
    isCanonical: true,
  },
  {
    name: 'Super Famicom F.C.',
    shortName: 'SFC',
    city: 'Kyoto',
    preferredDivisionRange: [1, 4],
    colors: {
      primary: '#dc2626',
      secondary: '#facc15',
      shorts: '#ffffff',
      pattern: 'retro_wave',
      collarStyle: 'polo',
      collarColor: '#dc2626',
    },
    isCanonical: true,
  },
  {
    name: 'Cosmos Galáctico',
    shortName: 'COS',
    city: 'Nueva Esperanza',
    preferredDivisionRange: [1, 3],
    colors: {
      primary: '#1e1b4b',
      secondary: '#e0e7ff',
      shorts: '#312e81',
      pattern: 'neon_glow',
      collarStyle: 'v_neck',
    },
    isCanonical: true,
  },
];

// Prefijos y raíces para generar más de 800 nombres únicos
const PREFIXES = [
  'Atlético', 'Real', 'Deportivo', 'Sporting', 'Unión', 'Racing', 'Inter',
  'Juventud', 'Defensores de', 'Estudiantes de', 'Gimnasia de', 'Ferro',
  'Alianza', 'Huracán de', 'Central', 'Libertad', 'Progreso', 'Victoria',
  'Independiente', 'San Lorenzo de', 'Boca de', 'River de', 'Nacional',
  'Cruzeiro', 'Flamengo de', 'Palmeiras de', 'Santos de', 'Peñarol de',
  'Cerro', 'Guaraní', 'Wanderers', 'Danubio', 'Everton', 'Arsenal de',
  'Aston', 'Celtic de', 'Rangers de', 'Borussia', 'Bayer', 'Ajax', 'Feyenoord',
  'Sparta', 'Dinamo', 'Lokomotiv', 'Zenit', 'Shakhtar', 'Benfica', 'Porto',
  'Braga', 'Milan de', 'Lazio de', 'Fiorentina', 'Torino', 'Sampdoria',
  'Parma', 'Atalanta de', 'Napoli de', 'Roma de', 'Valencia de', 'Sevilla de',
  'Betis de', 'Villarreal', 'Celta de', 'Mallorca', 'Espanyol de', 'Getafe',
  'Osasuna', 'Rayo', 'Granada', 'Cadiz', 'Alavés', 'Valladolid', 'Zaragoza',
  'Tigres de', 'Rayados de', 'Águilas de', 'Pumas de', 'Chivas de', 'Cruz Azul de',
  'Toluca', 'Atlas', 'León', 'Pachuca', 'Necaxa', 'Puebla', 'Tiburones de',
  'Cobresal', 'Cobreloa', 'Colo Colo de', 'Audax', 'Palestino', 'Huachipato',
  'Millonarios de', 'Santa Fe', 'América de', 'Cali', 'Junior de', 'Medellín',
  'Nacional de', 'Tolima', 'Once Caldas', 'Pereira', 'Bucaramanga', 'Pasto',
  'Emelec', 'Barcelona de', 'Liga de', 'Independiente del Valle', 'Aucas',
  'Cuenca', 'Delfín', 'Macará', 'Olimpia de', 'Libertad de', 'Sol de América',
  'Luqueño', 'Guaraní de', 'Nacional de Asunción', 'Bolívar', 'The Strongest',
  'Wilstermann', 'Blooming', 'Oriente', 'San José', 'Always Ready',
  'Alianza Lima de', 'Universitario de', 'Sporting Cristal de', 'Melgar',
  'Cienciano', 'Sport Boys', 'César Vallejo', 'Binacional', 'Cusco F.C.',
  'Caracas', 'Táchira', 'Zamora', 'Metropolitanos', 'Monagas', 'Mineros',
  'Deportivo Lara', 'Aragua', 'Portuguesa', 'Estudiantes de Mérida'
];

const LOCALITIES = [
  'Potrero', 'La Pampa', 'San Martín', 'Belgrano', 'Palermo', 'Boedo',
  'Avellaneda', 'Rosario', 'Córdoba', 'Mendoza', 'Tucumán', 'La Plata',
  'Quilmes', 'Banfield', 'Lanús', 'Morón', 'Tigre', 'Vicente López',
  'San Isidro', 'Rivadavia', 'Caballito', 'Flores', 'Barracas', 'Pompeya',
  'Mataderos', 'Liniers', 'Chacarita', 'Villa Crespo', 'Villa Urquiza',
  'Saavedra', 'Colegiales', 'Núñez', 'Devoto', 'Versalles', 'Monte Castro',
  'Agronomía', 'Paternal', 'Constitución', 'San Telmo', 'Monserrat',
  'Retiro', 'Recoleta', 'Balvanera', 'Almagro', 'Parque Patricios',
  'Villa Lugano', 'Villa Soldati', 'Villa Riachuelo', 'Monte Grande', 'Ezeiza',
  'Canning', 'Temperley', 'Lomas de Zamora', 'Adrogué', 'Burzaco',
  'Longchamps', 'Glew', 'Guernica', 'Alejandro Korn', 'San Vicente',
  'Florencio Varela', 'Berazategui', 'Hudson', 'Plátanos', 'Ranelagh',
  'Villa Elisa', 'City Bell', 'Gonnet', 'Tolosa', 'Los Hornos', 'Villa Elvira',
  'San Fernando', 'Beccar', 'Victoria', 'Virreyes', 'Campana', 'Zárate',
  'Escobar', 'Pilar', 'Del Viso', 'Tortuguitas', 'Grand Bourg', 'Los Polvorines',
  'San Miguel', 'Bella Vista', 'Muñiz', 'José C. Paz', 'Moreno', 'Paso del Rey',
  'Merlo', 'Padua', 'Ituzaingó', 'Castelar', 'Haedo', 'Ramos Mejía',
  'Ciudadela', 'Santos Lugares', 'Caseros', 'Palomar', 'Hurlingham', 'Villa Tesei',
  'Tres de Febrero', 'San Martín', 'Villa Ballester', 'Boulogne', 'Carapachay'
];

const SUFFIXES = [
  'F.C.', 'C.F.', 'S.C.', 'United', 'City', 'Rovers', 'Athletic', 'Town',
  'Juniors', 'Sons', 'Real', 'Sport', 'Stars', 'Warriors', 'Knights', 'Lions',
  'Bulls', 'Hawks', 'Eagles', 'Falcons', 'Wolves', 'Foxes', 'Bears', 'Dragons',
  'Titans', 'Pioneers', 'Comets', 'Rockets', 'Gladiators', 'Spartans', 'Vikings',
  'Dynamos', 'Thunder', 'Storm', 'Lightning', 'Blaze', 'Galaxy', 'Cosmos',
  'Vanguard', 'Heritage', 'Alliance', 'Union', 'Summit', 'Apex', 'Prime',
  'Elite', 'Academia', 'Cantera', 'Semillero', 'Filial', 'Reserva', 'Veteranos',
  'del Norte', 'del Sur', 'del Este', 'del Oeste', 'Central', 'Metropolitano',
  'Costero', 'Andino', 'Austral', 'Fronterizo', 'Portuario', 'Ferroviario',
  'Minero', 'Industrial', 'Agrario', 'Naval', 'Aéreo', 'Suburbano', 'Vecinal',
  'Barrial', 'Comunal', 'Provincial', 'Nacional', 'Federal', 'Republicano'
];

// Genera un pool garantizado de más de 800 nombres únicos
export function generateUniqueTeamNames(count: number): string[] {
  const set = new Set<string>();
  
  // Agregar primero los canónicos
  for (const c of CANONICAL_CLUBS) {
    set.add(c.name);
  }

  // Combinaciones estructuradas
  for (const pref of PREFIXES) {
    for (const loc of LOCALITIES) {
      if (set.size >= count + 200) break;
      set.add(`${pref} ${loc}`);
    }
  }

  for (const loc of LOCALITIES) {
    for (const suff of SUFFIXES) {
      if (set.size >= count + 300) break;
      set.add(`${loc} ${suff}`);
    }
  }

  for (const pref of PREFIXES) {
    for (const suff of SUFFIXES) {
      if (set.size >= count + 400) break;
      set.add(`${pref} ${suff}`);
    }
  }

  return Array.from(set).slice(0, count);
}

export const FIRST_NAMES = [
  'Mateo', 'Santiago', 'Lucas', 'Thiago', 'Benjamín', 'Joaquín', 'Martín',
  'Nicolás', 'Agustín', 'Tomás', 'Julián', 'Lautaro', 'Facundo', 'Gonzalo',
  'Federico', 'Franco', 'Ignacio', 'Rodrigo', 'Emiliano', 'Enzo', 'Leandro',
  'Ezequiel', 'Alexis', 'Diego', 'Gabriel', 'Maximiliano', 'Nahuel', 'Matías',
  'Pablo', 'Alejandro', 'Ramiro', 'Braian', 'Cristian', 'Damián', 'Emanuel',
  'Fabián', 'Germán', 'Hernán', 'Iván', 'Javier', 'Kevin', 'Leonardo',
  'Manuel', 'Néstor', 'Oscar', 'Patricio', 'Rubén', 'Sergio', 'Ulises',
  'Valentín', 'Walter', 'Yael', 'Zacarías', 'Bruno', 'César', 'Darío',
  'Elías', 'Felipe', 'Guido', 'Hugo', 'Ismael', 'Jeremías', 'Lionel',
  'Marcos', 'Nelson', 'Octavio', 'Paulo', 'Renzo', 'Sebastián', 'Tadeo'
];

export const LAST_NAMES = [
  'González', 'Rodríguez', 'Gómez', 'Fernández', 'López', 'Díaz', 'Martínez',
  'Pérez', 'García', 'Sánchez', 'Romero', 'Sosa', 'Álvarez', 'Torres',
  'Ruiz', 'Ramírez', 'Flores', 'Benítez', 'Acosta', 'Medina', 'Herrera',
  'Aguirre', 'Pereyra', 'Gutiérrez', 'Giménez', 'Molina', 'Silva', 'Castro',
  'Rojas', 'Ortiz', 'Núñez', 'Luna', 'Juárez', 'Cabrera', 'Ríos', 'Morales',
  'Godoy', 'Moreno', 'Ferreyra', 'Domínguez', 'Carrizo', 'Peralta', 'Castillo',
  'Ledesma', 'Quiroga', 'Vega', 'Vera', 'Muñoz', 'Ojeda', 'Ponce', 'Villalba',
  'Cardozo', 'Navarro', 'Coronel', 'Vázquez', 'Ramos', 'Bustos', 'Maldonado',
  'Correa', 'Figueroa', 'Vargas', 'Mansilla', 'Farías', 'Rivero', 'Bravo',
  'Acuña', 'Montenegro', 'Pacheco', 'Salinas', 'Lucero', 'Miranda', 'Barrios'
];

export function generateRandomPlayerName(): string {
  const fn = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
  const ln = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
  return `${fn} ${ln}`;
}
