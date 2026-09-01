import {
  DivisionInfo,
  FormationType,
  RivalTeam,
  BallSkin,
  Trophy,
  LeagueStanding,
  KitPatternType,
  FanSocialPost,
  ShopItem
} from '../types';

export const DIVISIONS: DivisionInfo[] = [
  {
    id: 23,
    name: '23ª Liga Potrero Sin Césped',
    levelBadge: 'POTRERO',
    tierColor: '#78350f',
    baseRewardPoints: 50,
    coinReward: 150,
    minPointsForPromotion: 5,
    maxPointsForRelegation: -1, // Lowest tier - cannot relegate
    description: 'Canchas de tierra con piedras y pozos. Si no te fracturas el tobillo sumas 3 puntos.'
  },
  {
    id: 22,
    name: '22ª Torneo Barrio Mala Muerte',
    levelBadge: 'MALA MUERTE',
    tierColor: '#854d0e',
    baseRewardPoints: 75,
    coinReward: 200,
    minPointsForPromotion: 6,
    maxPointsForRelegation: 2,
    description: 'El árbitro pita con miedo y los perros cruzan la cancha en pleno contragolpe.'
  },
  {
    id: 21,
    name: '21ª Copa Cerveza Tibia Domingos',
    levelBadge: 'CERVECERA',
    tierColor: '#a16207',
    baseRewardPoints: 100,
    coinReward: 250,
    minPointsForPromotion: 6,
    maxPointsForRelegation: 3,
    description: 'Jugadores con resaca y el arquero fumando apoyado en el palo vertical.'
  },
  {
    id: 20,
    name: '20ª Liga Pueblerina Descalza',
    levelBadge: 'PUEBLERINA',
    tierColor: '#b45309',
    baseRewardPoints: 120,
    coinReward: 300,
    minPointsForPromotion: 6,
    maxPointsForRelegation: 3,
    description: 'Se juega sin canilleras sobre pasto crecido. Puro corazón y patadas al aire.'
  },
  {
    id: 19,
    name: '19ª Regional de Baldíos & Cascajo',
    levelBadge: 'CASCAJO',
    tierColor: '#713f12',
    baseRewardPoints: 150,
    coinReward: 350,
    minPointsForPromotion: 6,
    maxPointsForRelegation: 3,
    description: 'El balón se pincha con los cactus laterales. Máxima rusticidad amateur.'
  },
  {
    id: 18,
    name: '18ª Torneo del Asadito & Gordos',
    levelBadge: 'ASADITO',
    tierColor: '#c2410c',
    baseRewardPoints: 180,
    coinReward: 400,
    minPointsForPromotion: 7,
    maxPointsForRelegation: 3,
    description: 'El premio del partido es un costillar a la parrilla y medio cajón de gaseosas.'
  },
  {
    id: 17,
    name: '17ª Liga San Calambre Parroquial',
    levelBadge: 'PARROQUIA',
    tierColor: '#ea580c',
    baseRewardPoints: 220,
    coinReward: 480,
    minPointsForPromotion: 7,
    maxPointsForRelegation: 4,
    description: 'Bendecidos por el cura antes de entrar para no romperse los ligamentos cruzados.'
  },
  {
    id: 16,
    name: '16ª Circuito Municipal de Rodilleras',
    levelBadge: 'VETERANOS',
    tierColor: '#d97706',
    baseRewardPoints: 260,
    coinReward: 560,
    minPointsForPromotion: 7,
    maxPointsForRelegation: 4,
    description: 'Pases lentos, protestas constantes y rodilleras ortopédicas de última generación.'
  },
  {
    id: 15,
    name: '15ª Rústica de Balón Pesado',
    levelBadge: 'RÚSTICA',
    tierColor: '#ca8a04',
    baseRewardPoints: 300,
    coinReward: 650,
    minPointsForPromotion: 7,
    maxPointsForRelegation: 4,
    description: 'Entradas con los dos pies hacia adelante. Se juega con balón de cuero mojado.'
  },
  {
    id: 14,
    name: '14ª Torneo Pica & Corre Vecinal',
    levelBadge: 'PICADITO',
    tierColor: '#eab308',
    baseRewardPoints: 350,
    coinReward: 750,
    minPointsForPromotion: 7,
    maxPointsForRelegation: 4,
    description: 'Si la tiras afuera te toca ir a buscarla al río o al tejado de la vecina brava.'
  },
  {
    id: 13,
    name: '13ª Copa Tercer Tiempo Obligatorio',
    levelBadge: 'TERCER TIEMPO',
    tierColor: '#65a30d',
    baseRewardPoints: 400,
    coinReward: 850,
    minPointsForPromotion: 7,
    maxPointsForRelegation: 4,
    description: 'Lo importante no es ganar sino las milanesas con papas después de los 90 minutos.'
  },
  {
    id: 12,
    name: '12ª Liga Comarcal de Troncos',
    levelBadge: 'COMARCAL',
    tierColor: '#16a34a',
    baseRewardPoints: 450,
    coinReward: 950,
    minPointsForPromotion: 8,
    maxPointsForRelegation: 4,
    description: 'Los defensas corren en cámara lenta pero pegan codazos dignos de artes marciales.'
  },
  {
    id: 11,
    name: '11ª Torneo de los Desesperados',
    levelBadge: 'DESESPERADOS',
    tierColor: '#059669',
    baseRewardPoints: 500,
    coinReward: 1100,
    minPointsForPromotion: 8,
    maxPointsForRelegation: 4,
    description: 'Nadie quiere caer al fondo del descenso. Choques dramáticos en cada pelota dividida.'
  },
  {
    id: 10,
    name: '10ª Inter-Barrial de Callejones',
    levelBadge: 'CALLEJONES',
    tierColor: '#0d9488',
    baseRewardPoints: 600,
    coinReward: 1300,
    minPointsForPromotion: 8,
    maxPointsForRelegation: 4,
    description: 'Camisetas con números pintados a mano y botines con tapones de plástico gastados.'
  },
  {
    id: 9,
    name: '9ª Liga Regional del Despegue',
    levelBadge: 'DESPEGUE',
    tierColor: '#0891b2',
    baseRewardPoints: 700,
    coinReward: 1500,
    minPointsForPromotion: 8,
    maxPointsForRelegation: 5,
    description: 'Lleno total de hinchas con bombos y banderas hechas de sábanas viejas.'
  },
  {
    id: 8,
    name: '8ª Copa Bronce Departamental',
    levelBadge: 'BRONCE DEP',
    tierColor: '#0284c7',
    baseRewardPoints: 850,
    coinReward: 1800,
    minPointsForPromotion: 8,
    maxPointsForRelegation: 5,
    description: 'Primeros contratos semiprofesionales: viático de micro y dos pares de medias.'
  },
  {
    id: 7,
    name: '7ª Fiebre de Domingo Semipro',
    levelBadge: 'FIEBRE',
    tierColor: '#2563eb',
    baseRewardPoints: 1000,
    coinReward: 2200,
    minPointsForPromotion: 8,
    maxPointsForRelegation: 5,
    description: 'El público empieza a pedir autógrafos en servilletas de papel grasosas.'
  },
  {
    id: 6,
    name: '6ª Torneo La Gran Promesa',
    levelBadge: 'PROMESA',
    tierColor: '#4f46e5',
    baseRewardPoints: 1200,
    coinReward: 2600,
    minPointsForPromotion: 9,
    maxPointsForRelegation: 5,
    description: 'Ojeadores de clubes grandes mirando desde la tribuna con cuadernos arrugados.'
  },
  {
    id: 5,
    name: '5ª Nacional de Plata',
    levelBadge: 'PLATA',
    tierColor: '#7c3aed',
    baseRewardPoints: 1500,
    coinReward: 3200,
    minPointsForPromotion: 9,
    maxPointsForRelegation: 5,
    description: 'Estadios de cemento con alambrado, transmisiones de radio local y arqueros ágiles.'
  },
  {
    id: 4,
    name: '4ª División Oro Profesional',
    levelBadge: 'ORO PROF',
    tierColor: '#9333ea',
    baseRewardPoints: 1800,
    coinReward: 4000,
    minPointsForPromotion: 9,
    maxPointsForRelegation: 5,
    description: 'Partidos televisados en horario nocturno y patrocinadores en las camisetas.'
  },
  {
    id: 3,
    name: '3ª División Diamante Continental',
    levelBadge: 'DIAMANTE',
    tierColor: '#c026d3',
    baseRewardPoints: 2200,
    coinReward: 5000,
    minPointsForPromotion: 9,
    maxPointsForRelegation: 6,
    description: 'Fútbol de alta intensidad, jugadas de pizarra y defensas que no perdonan nada.'
  },
  {
    id: 2,
    name: '2ª División de Honor Platino',
    levelBadge: 'PLATINO',
    tierColor: '#db2777',
    baseRewardPoints: 2800,
    coinReward: 6500,
    minPointsForPromotion: 10,
    maxPointsForRelegation: 6,
    description: 'A un solo paso de la gloria suprema. Presión mediática y estadios repletos.'
  },
  {
    id: 1,
    name: '1ª Superliga Galáctica de Leyendas',
    levelBadge: 'GALÁCTICA',
    tierColor: '#38bdf8',
    baseRewardPoints: 3500,
    coinReward: 10000,
    minPointsForPromotion: 12,
    maxPointsForRelegation: 6,
    description: 'La cima del fútbol mundial. Leyendas inmortales, trofeos de oro macizo y arqueros voladores.'
  }
];

export const BALL_SKINS: BallSkin[] = [
  {
    id: 'ball-classic',
    name: 'Tango Clásico',
    description: 'El balón tradicional blanco y negro con hexágonos vintage.',
    primaryColor: '#ffffff',
    secondaryColor: '#18181b',
    pattern: 'classic',
    trailColor: '#e4e4e7',
    unlockSeason: 1,
    price: 0,
    unlocked: true
  },
  {
    id: 'ball-leather',
    name: 'Cuero Retro 1970',
    description: 'Auténtico balón de cuero marrón de la época dorada.',
    primaryColor: '#b45309',
    secondaryColor: '#78350f',
    pattern: 'leather',
    trailColor: '#d97706',
    unlockSeason: 1,
    price: 250,
    unlocked: false
  },
  {
    id: 'ball-neon',
    name: 'Neón Synthwave',
    description: 'Brilla con tonos fucsia y cian eléctrico estilo arcade 80s.',
    primaryColor: '#ec4899',
    secondaryColor: '#06b6d4',
    pattern: 'neon',
    trailColor: '#f43f5e',
    unlockSeason: 2,
    price: 600,
    unlocked: false
  },
  {
    id: 'ball-flame',
    name: 'Furia de Fuego',
    description: 'Envuelto en llamas ardientes de alta velocidad.',
    primaryColor: '#f97316',
    secondaryColor: '#ef4444',
    pattern: 'flame',
    trailColor: '#ea580c',
    unlockSeason: 3,
    price: 1200,
    unlocked: false
  },
  {
    id: 'ball-gold',
    name: 'Oro Macizo 24K',
    description: 'Forjado en oro puro para los auténticos campeones.',
    primaryColor: '#facc15',
    secondaryColor: '#ca8a04',
    pattern: 'gold',
    trailColor: '#fde047',
    unlockSeason: 4,
    price: 2500,
    unlocked: false
  },
  {
    id: 'ball-cyber',
    name: 'Cyber Matrix 3000',
    description: 'Tecnología holográfica con estela de partículas digitales.',
    primaryColor: '#22c55e',
    secondaryColor: '#10b981',
    pattern: 'cyber',
    trailColor: '#4ade80',
    unlockSeason: 5,
    price: 4000,
    unlocked: false
  },
  {
    id: 'ball-galaxy',
    name: 'Supernova Galáctica',
    description: 'Poder estelar cósmico de la 1ª División.',
    primaryColor: '#8b5cf6',
    secondaryColor: '#ec4899',
    pattern: 'galaxy',
    trailColor: '#a855f7',
    unlockSeason: 6,
    price: 7000,
    unlocked: false
  }
];

export const SHOP_ITEMS: ShopItem[] = [
  // --- UNIFORMES & DISEÑOS DE CAMISETAS ---
  {
    id: 'kit-stripes-classic',
    name: 'Camiseta Rayas Verticales Retro',
    category: 'KIT',
    description: 'Estilo clásico bicentenario con franjas verticales de alta definición.',
    price: 300,
    icon: '👕',
    color: '#3b82f6',
    secondaryColor: '#ffffff',
    pattern: 'vertical_stripes',
    unlocked: false
  },
  {
    id: 'kit-hoops-celtic',
    name: 'Camiseta Rayas Horizontales Hoops',
    category: 'KIT',
    description: 'Franjas horizontales estilo escocés con textura de fibra tejida.',
    price: 450,
    icon: '👕',
    color: '#16a34a',
    secondaryColor: '#ffffff',
    pattern: 'hoops',
    unlocked: false
  },
  {
    id: 'kit-sash-diagonal',
    name: 'Banda Diagonal Gloria Eterna',
    category: 'KIT',
    description: 'Icónica franja cruzada diagonal que cruza el pecho con orgullo.',
    price: 600,
    icon: '👕',
    color: '#ffffff',
    secondaryColor: '#dc2626',
    pattern: 'sash',
    unlocked: false
  },
  {
    id: 'kit-halves-retro',
    name: 'Camiseta Mitades Bicolor',
    category: 'KIT',
    description: 'Diseño dividido en dos mitades simétricas de alto contraste.',
    price: 500,
    icon: '👕',
    color: '#dc2626',
    secondaryColor: '#1e3a8a',
    pattern: 'halves',
    unlocked: false
  },
  {
    id: 'kit-sleeves-contrast',
    name: 'Camiseta Mangas Contraste Raglan',
    category: 'KIT',
    description: 'Cuerpo en tono principal y mangas contrastadas estilo Premier League.',
    price: 550,
    icon: '👕',
    color: '#dc2626',
    secondaryColor: '#ffffff',
    pattern: 'sleeves_contrast',
    unlocked: false
  },
  {
    id: 'kit-diamonds-argyle',
    name: 'Diseño Rombos Diamante 90s',
    category: 'KIT',
    description: 'Patrón geométrico retro de rombos vintage del mundial 1994.',
    price: 850,
    icon: '👕',
    color: '#9333ea',
    secondaryColor: '#facc15',
    pattern: 'diamonds',
    unlocked: false
  },
  {
    id: 'kit-retro-wave',
    name: 'Patrón Olas / Zigzag 90s',
    category: 'KIT',
    description: 'Olas geométricas retro y rayos noventeros en el pecho.',
    price: 950,
    icon: '👕',
    color: '#06b6d4',
    secondaryColor: '#facc15',
    pattern: 'retro_wave',
    unlocked: false
  },
  {
    id: 'kit-gradient-pro',
    name: 'Difuminado Pixel Maestro (Gradient)',
    category: 'KIT',
    description: 'Mezcla procedural continua de Color A a Color B con dithering 16-bit.',
    price: 750,
    icon: '🎨',
    color: '#ec4899',
    secondaryColor: '#3b82f6',
    pattern: 'gradient',
    unlocked: false
  },
  {
    id: 'kit-flames-volcano',
    name: 'Llamas Ardientes Volcán',
    category: 'KIT',
    description: 'Degradé flamígero en el pecho para intimidar al arquero rival.',
    price: 1200,
    icon: '🔥',
    color: '#f97316',
    secondaryColor: '#dc2626',
    pattern: 'flames',
    unlocked: false
  },
  {
    id: 'kit-neon-cyber',
    name: 'Armadura Cyber Neón 2077',
    category: 'KIT',
    description: 'Circuitos luminiscentes que brillan bajo los reflectores del estadio.',
    price: 2000,
    icon: '⚡',
    color: '#06b6d4',
    secondaryColor: '#22c55e',
    pattern: 'neon_glow',
    unlocked: false
  },

  // --- SHORTS & PANTALONETAS ---
  {
    id: 'shorts-side-stripes',
    name: 'Shorts con Franjas Laterales Pro',
    category: 'SHORTS',
    description: 'Franjas dobles a los costados para mayor agilidad y estilo moderno.',
    price: 250,
    icon: '🩳',
    color: '#18181b',
    secondaryColor: '#ffffff',
    shortsStyle: 'side_stripes',
    unlocked: false
  },
  {
    id: 'shorts-retro-70s',
    name: 'Shorts Retro Años 70s',
    category: 'SHORTS',
    description: 'Corte ajustado clásico de época de oro con ribetes redondeados.',
    price: 350,
    icon: '🩳',
    color: '#ffffff',
    secondaryColor: '#3b82f6',
    shortsStyle: 'retro_short',
    unlocked: false
  },
  {
    id: 'shorts-boxer-long',
    name: 'Shorts Holgados Élite 90s',
    category: 'SHORTS',
    description: 'Corte holgado hasta las rodillas para remates de máxima potencia.',
    price: 450,
    icon: '🩳',
    color: '#1e3a8a',
    secondaryColor: '#facc15',
    shortsStyle: 'long_boxer',
    unlocked: false
  },
  {
    id: 'shorts-dual-color',
    name: 'Shorts Bicolor Contraste',
    category: 'SHORTS',
    description: 'Diseño asimétrico con cada pierna en un tono diferente del club.',
    price: 650,
    icon: '🩳',
    color: '#dc2626',
    secondaryColor: '#1d4ed8',
    shortsStyle: 'dual_color',
    unlocked: false
  },
  {
    id: 'shorts-gold-piping',
    name: 'Shorts con Ribete Oro Imperial',
    category: 'SHORTS',
    description: 'Costuras doradas de hilo de seda para campeones de 1ª División.',
    price: 1100,
    icon: '🩳',
    color: '#18181b',
    secondaryColor: '#facc15',
    shortsStyle: 'gold_piping',
    unlocked: false
  },

  // --- BOTINES & BOTAS ---
  {
    id: 'boots-speed-red',
    name: 'Botines Mercurial Furia',
    category: 'BOOTS',
    description: 'Botas de fibra ligera con tapones cónicos de alta aceleración.',
    price: 350,
    icon: '👟',
    color: '#ef4444',
    unlocked: false
  },
  {
    id: 'boots-neon-green',
    name: 'Botas Neón Fluor Predator',
    category: 'BOOTS',
    description: 'Adherencia extrema al cuero para disparos con efecto diabólico.',
    price: 700,
    icon: '👟',
    color: '#22c55e',
    unlocked: false
  },
  {
    id: 'boots-gold-legend',
    name: 'Botas de Oro Imperial',
    category: 'BOOTS',
    description: 'Tapones de oro macizo 24K para definiciones quirúrgicas al ángulo.',
    price: 1800,
    icon: '✨',
    color: '#facc15',
    unlocked: false
  },
  {
    id: 'boots-black-classic',
    name: 'Botines Clásicos Copa Cuero Negro',
    category: 'BOOTS',
    description: 'Auténtico cuero de canguro de 1982 para los puristas del balón.',
    price: 400,
    icon: '👟',
    color: '#18181b',
    unlocked: false
  },

  // --- ACCESORIOS ---
  {
    id: 'acc-headband',
    name: 'Cinta Ninja para Cabeza',
    category: 'ACCESSORY',
    description: 'Estilo clásico sudamericano para no perder la concentración.',
    price: 200,
    icon: '🎗️',
    color: '#3b82f6',
    unlocked: false
  },
  {
    id: 'acc-captain-armband',
    name: 'Brazalete de Capitán 16-Bit',
    category: 'ACCESSORY',
    description: 'Autoridad indiscutible y respeto arbitral en el terreno de juego.',
    price: 500,
    icon: '🛡️',
    color: '#eab308',
    unlocked: false
  }
];

export const DEFENDER_SPEECH_BUBBLES = [
  '¡Fallaste, jajaja!',
  '¡Uf, casi me partes!',
  '¡A la tribuna!',
  '¡Puntín zapatero!',
  '¡De aquí no pasa nadie!',
  '¡Tronco!',
  '¡Qué zapatazo!',
  '¡Mío el rebote!',
  '¡Casi me sacas el aire!',
  '¡Por aquí no, crack!'
];

export const INITIAL_TROPHIES: Trophy[] = [
  {
    id: 'trophy-debut',
    name: 'Bautismo de Fuego',
    description: 'Marca tu primer gol oficial en el modo carrera.',
    icon: '⚽',
    unlocked: false
  },
  {
    id: 'trophy-hattrick',
    name: 'Hat-Trick Clásico',
    description: 'Consigue 3 goles en un solo partido.',
    icon: '🎩',
    unlocked: false
  },
  {
    id: 'trophy-manita',
    name: 'La Manita Sagrada',
    description: 'Anota 5 goles en un solo partido.',
    icon: '🖐️',
    unlocked: false
  },
  {
    id: 'trophy-double-hattrick',
    name: 'Doble Hat-Trick',
    description: 'Anota 6 goles en un solo partido.',
    icon: '🎪',
    unlocked: false
  },
  {
    id: 'trophy-decena',
    name: 'Festival de 10 Goles',
    description: 'Alcanza 10 goles en un solo partido de 90s.',
    icon: '🔟',
    unlocked: false
  },
  {
    id: 'trophy-quince',
    name: 'Tormenta de 15 Goles',
    description: 'Alcanza 15 goles en un solo partido.',
    icon: '💥',
    unlocked: false
  },
  {
    id: 'trophy-veinte-match',
    name: 'Bombardero Nuclear',
    description: 'Anota 20 goles en un solo partido épico.',
    icon: '🚀',
    unlocked: false
  },
  {
    id: 'trophy-veinticinco-match',
    name: 'Dios del Área (25+ Goles)',
    description: 'Anota 25 o más goles en una exhibición legendaria.',
    icon: '👑',
    unlocked: false
  },
  {
    id: 'trophy-career-25',
    name: 'Bota de Bronce (25 Goles)',
    description: 'Alcanza los 25 goles acumulados en tu carrera.',
    icon: '🥉',
    unlocked: false
  },
  {
    id: 'trophy-career-50',
    name: 'Bota de Plata (50 Goles)',
    description: 'Alcanza los 50 goles acumulados en tu carrera.',
    icon: '🥈',
    unlocked: false
  },
  {
    id: 'trophy-pichichi',
    name: 'Bota de Oro (100 Goles)',
    description: 'Alcanza los 100 goles acumulados en tu carrera.',
    icon: '🥇',
    unlocked: false
  },
  {
    id: 'trophy-career-250',
    name: 'Bota de Diamante (250 Goles)',
    description: 'Alcanza los 250 goles acumulados en tu carrera.',
    icon: '💎',
    unlocked: false
  },
  {
    id: 'trophy-career-500',
    name: 'Leyenda de 500 Goles',
    description: 'Alcanza los 500 goles acumulados en tu carrera.',
    icon: '⚡',
    unlocked: false
  },
  {
    id: 'trophy-streak',
    name: 'Fuego en los Botines',
    description: 'Alcanza una racha de multiplicador x4 o más en un partido.',
    icon: '🔥',
    unlocked: false
  },
  {
    id: 'trophy-sharpshooter',
    name: 'Francotirador Láser',
    description: 'Marca un gol con multiplicador de arco estrecho (x3 o más).',
    icon: '🎯',
    unlocked: false
  },
  {
    id: 'trophy-survivor',
    name: 'Rey del Repechaje',
    description: 'Salva la categoría con éxito en el Desafío de Permanencia de 30s.',
    icon: '🛡️',
    unlocked: false
  },
  {
    id: 'trophy-promotion',
    name: 'Ascenso Soñado',
    description: 'Consigue quedar entre los 2 primeros y ascender de división.',
    icon: '🚀',
    unlocked: false
  },
  {
    id: 'trophy-champion',
    name: 'Campeón de Superliga',
    description: 'Conquista el 1er puesto en la 1ª División de Leyendas.',
    icon: '🏆',
    unlocked: false
  },
  {
    id: 'trophy-perfect-season',
    name: 'Temporada Perfecta (7/7)',
    description: 'Gana los 7 partidos de una misma temporada.',
    icon: '🌟',
    unlocked: false
  },
  {
    id: 'trophy-veteran',
    name: 'Leyenda Eterna (5 Temp.)',
    description: 'Disputa 5 temporadas completas como futbolista profesional.',
    icon: '🎖️',
    unlocked: false
  }
];

export interface DivisionClubDef {
  name: string;
  city: string;
  star: string;
  primaryColor: string;
  secondaryColor: string;
  pattern: KitPatternType;
  hairColor: string;
  formation: FormationType;
}

// Master mapping of 7 unique rivals per division (8 teams total including the user)
export const DIVISION_RIVALS_MAP: Record<number, DivisionClubDef[]> = {
  23: [
    { name: 'Sacachispas del Asfalto', city: 'Villa Empanada', star: 'El Ñato Chancleta', primaryColor: '#ef4444', secondaryColor: '#ffffff', pattern: 'vertical_stripes', hairColor: '#1c1917', formation: '5-3-2' },
    { name: 'Deportivo Calambre', city: 'Isquiotibial City', star: 'Rodilla Oxidada', primaryColor: '#3b82f6', secondaryColor: '#ffffff', pattern: 'solid', hairColor: '#78350f', formation: '4-4-2' },
    { name: 'Pasto Seco Juniors', city: 'La Pampa Árida', star: 'Rastrillo Gómez', primaryColor: '#ca8a04', secondaryColor: '#18181b', pattern: 'hoops', hairColor: '#451a03', formation: '5-3-2' },
    { name: 'Los Pibes del Fondo', city: 'Villa Peligro', star: 'El Zurdo Peligroso', primaryColor: '#16a34a', secondaryColor: '#ffffff', pattern: 'sash', hairColor: '#1c1917', formation: '4-3-3' },
    { name: 'Sin Piernas FC', city: 'Silla de Ruedas', star: 'Muleta Veloz', primaryColor: '#78350f', secondaryColor: '#fef08a', pattern: 'solid', hairColor: '#a16207', formation: '4-4-2' },
    { name: 'Rechazo Seguro', city: 'Despeje al Techo', star: 'Puntín Zapatero', primaryColor: '#475569', secondaryColor: '#f8fafc', pattern: 'vertical_stripes', hairColor: '#0f172a', formation: '5-3-2' },
    { name: 'Tiburones de Charco', city: 'Laguna Turbia', star: 'Aleta Torcida', primaryColor: '#0284c7', secondaryColor: '#38bdf8', pattern: 'hoops', hairColor: '#172554', formation: '4-4-2' }
  ],
  22: [
    { name: 'Real Barrilito', city: 'Grifo de Cerveza', star: 'Panza de Oro', primaryColor: '#f97316', secondaryColor: '#18181b', pattern: 'solid', hairColor: '#9a3412', formation: '4-4-2' },
    { name: 'Sporting de Chichón', city: 'Gijón Golpeado', star: 'Quini Virtual', primaryColor: '#ef4444', secondaryColor: '#3b82f6', pattern: 'vertical_stripes', hairColor: '#1c1917', formation: '4-3-3' },
    { name: 'Unión Resaca FC', city: 'Madrugada Larga', star: 'Aspirina Pérez', primaryColor: '#84cc16', secondaryColor: '#14532d', pattern: 'sash', hairColor: '#365314', formation: '5-3-2' },
    { name: 'Vino Tinto Pelotero', city: 'Valle de Uva', star: 'Damajuana López', primaryColor: '#881337', secondaryColor: '#ffe4e6', pattern: 'solid', hairColor: '#4c0519', formation: '4-4-2' },
    { name: 'Pelotas Perdidas FC', city: 'Tejado Vecino', star: 'Buscapié Martínez', primaryColor: '#eab308', secondaryColor: '#713f12', pattern: 'hoops', hairColor: '#854d0e', formation: '3-5-2' },
    { name: 'Parálisis Facial FC', city: 'Nervio Muerto', star: 'Cara de Piedra', primaryColor: '#475569', secondaryColor: '#cbd5e1', pattern: 'vertical_stripes', hairColor: '#334155', formation: '4-4-2' },
    { name: 'Golpe de Calor United', city: 'Desierto 45 Grados', star: 'Sombra López', primaryColor: '#dc2626', secondaryColor: '#fef08a', pattern: 'solid', hairColor: '#7f1d1d', formation: '4-3-3' }
  ],
  21: [
    { name: 'Aston Birra', city: 'Birmingham Pub', star: 'Dibu de Cartón', primaryColor: '#9333ea', secondaryColor: '#38bdf8', pattern: 'solid', hairColor: '#581c87', formation: '4-4-2' },
    { name: 'Celta de Vino', city: 'Vigo de Bodega', star: 'Iago Resacas', primaryColor: '#38bdf8', secondaryColor: '#ffffff', pattern: 'solid', hairColor: '#0369a1', formation: '4-3-3' },
    { name: 'Árbitro Comprado FC', city: 'Silbato Roto', star: 'Tarjeta Amarilla', primaryColor: '#facc15', secondaryColor: '#000000', pattern: 'vertical_stripes', hairColor: '#1c1917', formation: '5-3-2' },
    { name: 'Pincharratas Oxidado', city: 'La Plata Vieja', star: 'Verón en Patineta', primaryColor: '#b91c1c', secondaryColor: '#ffffff', pattern: 'vertical_stripes', hairColor: '#450a0a', formation: '4-4-2' },
    { name: 'Caspa de Oro FC', city: 'Champú City', star: 'Melena Despeinada', primaryColor: '#0ea5e9', secondaryColor: '#f1f5f9', pattern: 'sash', hairColor: '#0c4a6e', formation: '3-5-2' },
    { name: 'Tiki-Taka Truncado', city: 'Pase Incompleto', star: 'Xavi Sin Lentes', primaryColor: '#6366f1', secondaryColor: '#e0e7ff', pattern: 'hoops', hairColor: '#312e81', formation: '4-3-3' },
    { name: 'Gimnasia & Masticar', city: 'El Bosque Hambriento', star: 'Diente de Plata', primaryColor: '#1e3a8a', secondaryColor: '#ffffff', pattern: 'solid', hairColor: '#172554', formation: '4-4-2' }
  ],
  20: [
    { name: 'Rayo Vayacano', city: 'Vallecas Relámpago', star: 'Radamel Falso', primaryColor: '#ffffff', secondaryColor: '#ef4444', pattern: 'sash', hairColor: '#1c1917', formation: '4-3-3' },
    { name: 'Defensa & Trastorno', city: 'Florencio Varela', star: 'Taquito Loco', primaryColor: '#15803d', secondaryColor: '#facc15', pattern: 'solid', hairColor: '#14532d', formation: '4-4-2' },
    { name: 'Borussia Dientes', city: 'Dortmund Dental', star: 'Muela Picada', primaryColor: '#facc15', secondaryColor: '#000000', pattern: 'solid', hairColor: '#713f12', formation: '4-2-3-1' },
    { name: 'Atlético Chancla', city: 'Suela Despegada', star: 'Cholo Rabietas', primaryColor: '#dc2626', secondaryColor: '#1d4ed8', pattern: 'vertical_stripes', hairColor: '#1c1917', formation: '5-3-2' },
    { name: 'Chelsea con Queso', city: 'Londres Lácteo', star: 'Enzo Fundido', primaryColor: '#1d4ed8', secondaryColor: '#ffffff', pattern: 'solid', hairColor: '#1e3a8a', formation: '4-3-3' },
    { name: 'Juventus de Peluche', city: 'Turín Suave', star: 'Vlahovic de Algodón', primaryColor: '#000000', secondaryColor: '#ffffff', pattern: 'vertical_stripes', hairColor: '#1c1917', formation: '4-4-2' },
    { name: 'Arsenal de Juguete', city: 'Norte de Londres', star: 'Bukayo Saca-punta', primaryColor: '#dc2626', secondaryColor: '#ffffff', pattern: 'solid', hairColor: '#450a0a', formation: '4-3-3' }
  ],
  19: [
    { name: 'Nottingham Forest Gump', city: 'Corre Forrest', star: 'Teniente Dan', primaryColor: '#dc2626', secondaryColor: '#ffffff', pattern: 'solid', hairColor: '#7f1d1d', formation: '4-4-2' },
    { name: 'Real Suciedad', city: 'San Sebastián de la Mugre', star: 'Oyar-resbalón', primaryColor: '#2563eb', secondaryColor: '#ffffff', pattern: 'vertical_stripes', hairColor: '#1e40af', formation: '4-3-3' },
    { name: 'Bayern de los Caídos', city: 'Múnich Tropezón', star: 'Thomas Muletas', primaryColor: '#b91c1c', secondaryColor: '#ffffff', pattern: 'solid', hairColor: '#7f1d1d', formation: '4-2-3-1' },
    { name: 'PSG Sin Gas', city: 'París Desinflado', star: 'Kylian M-papá', primaryColor: '#1e1b4b', secondaryColor: '#dc2626', pattern: 'sash', hairColor: '#0f172a', formation: '4-3-3' },
    { name: 'Boca Juniors Seniors', city: 'La Bombonerita', star: 'Riquelme en Sillón', primaryColor: '#1e3a8a', secondaryColor: '#eab308', pattern: 'hoops', hairColor: '#172554', formation: '4-4-2' },
    { name: 'River Plate-ado', city: 'Núñez Metálico', star: 'Nacho Fernández', primaryColor: '#ffffff', secondaryColor: '#dc2626', pattern: 'sash', hairColor: '#1c1917', formation: '4-3-3' },
    { name: 'Manchester Sisi', city: 'Mánchester Central', star: 'Erling Jamón', primaryColor: '#38bdf8', secondaryColor: '#ffffff', pattern: 'solid', hairColor: '#0284c7', formation: '4-3-3' }
  ],
  18: [
    { name: 'Inter de Mitad', city: 'Milán Central', star: 'Lau-tardo Martínez', primaryColor: '#1d4ed8', secondaryColor: '#000000', pattern: 'vertical_stripes', hairColor: '#1e3a8a', formation: '3-5-2' },
    { name: 'Napoli de Fideos', city: 'Nápoles Caliente', star: 'Kvara-chatarra', primaryColor: '#0284c7', secondaryColor: '#ffffff', pattern: 'solid', hairColor: '#0369a1', formation: '4-3-3' },
    { name: 'Betis del Asfalto', city: 'Sevilla Verdiblanca', star: 'Joaquín del Chiste', primaryColor: '#16a34a', secondaryColor: '#ffffff', pattern: 'vertical_stripes', hairColor: '#14532d', formation: '4-4-2' },
    { name: 'Sevilla Sin Frenos', city: 'Nervión Derrapante', star: 'Navas Eterno', primaryColor: '#ffffff', secondaryColor: '#dc2626', pattern: 'solid', hairColor: '#1c1917', formation: '4-2-3-1' },
    { name: 'Valencia en Quiebra', city: 'Mestalla con Goteras', star: 'Murciélago Cojo', primaryColor: '#ffffff', secondaryColor: '#000000', pattern: 'solid', hairColor: '#1c1917', formation: '4-4-2' },
    { name: 'Villarreal Submarino Roto', city: 'Cerámica Agrietada', star: 'Gerard Lesionado', primaryColor: '#eab308', secondaryColor: '#1e3a8a', pattern: 'solid', hairColor: '#713f12', formation: '4-4-2' },
    { name: 'Roma Imperial de Plástico', city: 'Coliseo de Telgopor', star: 'Dybala de Cristal', primaryColor: '#881337', secondaryColor: '#eab308', pattern: 'solid', hairColor: '#4c0519', formation: '3-4-3' }
  ],
  17: [
    { name: 'Lazio del Calambre', city: 'Águila Caída', star: 'Immobile Inmóvil', primaryColor: '#7dd3fc', secondaryColor: '#ffffff', pattern: 'solid', hairColor: '#0284c7', formation: '4-3-3' },
    { name: 'Milan de los Abuelos', city: 'San Siro Histórico', star: 'Giroud en Muletas', primaryColor: '#dc2626', secondaryColor: '#000000', pattern: 'vertical_stripes', hairColor: '#1c1917', formation: '4-2-3-1' },
    { name: 'Porto de Contrabando', city: 'Duero Peligroso', star: 'Pepe Cara Dura', primaryColor: '#1d4ed8', secondaryColor: '#ffffff', pattern: 'vertical_stripes', hairColor: '#1e3a8a', formation: '4-4-2' },
    { name: 'Benfica de las Águilas', city: 'Lisboa Encantada', star: 'Di María del Potrero', primaryColor: '#dc2626', secondaryColor: '#ffffff', pattern: 'solid', hairColor: '#7f1d1d', formation: '4-3-3' },
    { name: 'Sporting de Lisboa Verde', city: 'José Alvalade', star: 'Gyökeres Tanque', primaryColor: '#15803d', secondaryColor: '#ffffff', pattern: 'hoops', hairColor: '#14532d', formation: '3-4-3' },
    { name: 'Ajax de los Pibes', city: 'Ámsterdam Canales', star: 'Cruyff Digital', primaryColor: '#ffffff', secondaryColor: '#dc2626', pattern: 'vertical_stripes', hairColor: '#1c1917', formation: '4-3-3' },
    { name: 'PSV de la Bombilla', city: 'Eindhoven Luz', star: 'Luuk de Jong Cabezazo', primaryColor: '#dc2626', secondaryColor: '#ffffff', pattern: 'vertical_stripes', hairColor: '#7f1d1d', formation: '4-3-3' }
  ],
  16: [
    { name: 'Feyenoord de la Sierra', city: 'Róterdam Puerto', star: 'Giménez Martillo', primaryColor: '#dc2626', secondaryColor: '#ffffff', pattern: 'vertical_stripes', hairColor: '#1c1917', formation: '4-3-3' },
    { name: 'Olympique de Marsella Furia', city: 'Velódromo Ardiente', star: 'Aubameyang Moto', primaryColor: '#38bdf8', secondaryColor: '#ffffff', pattern: 'solid', hairColor: '#0284c7', formation: '4-2-3-1' },
    { name: 'Lyon de Seda', city: 'Ródano Suave', star: 'Lacazette Puntero', primaryColor: '#ffffff', secondaryColor: '#1d4ed8', pattern: 'vertical_stripes', hairColor: '#1e3a8a', formation: '4-3-3' },
    { name: 'Mónaco del Casino', city: 'Montecarlo Ruleta', star: 'Ben Yedder Gambeta', primaryColor: '#dc2626', secondaryColor: '#ffffff', pattern: 'sash', hairColor: '#7f1d1d', formation: '4-4-2' },
    { name: 'Lille de los Perros', city: 'Pierre Mauroy', star: 'David Canadiense', primaryColor: '#dc2626', secondaryColor: '#1e3a8a', pattern: 'solid', hairColor: '#1c1917', formation: '4-2-3-1' },
    { name: 'Bayer Leverkusen Invencible', city: 'BayArena Química', star: 'Xabi Alonso Táctico', primaryColor: '#000000', secondaryColor: '#dc2626', pattern: 'solid', hairColor: '#1c1917', formation: '3-4-3' },
    { name: 'Leipzig de las Latas', city: 'Red Bull Arena', star: 'Sesko Cohete', primaryColor: '#ffffff', secondaryColor: '#dc2626', pattern: 'solid', hairColor: '#1c1917', formation: '4-2-2-2' }
  ],
  15: [
    { name: 'Eintracht del Águila Negra', city: 'Frankfurt Finanzas', star: 'Götze Héroe', primaryColor: '#000000', secondaryColor: '#dc2626', pattern: 'vertical_stripes', hairColor: '#1c1917', formation: '3-4-3' },
    { name: 'Stuttgart del Motor', city: 'Mercedes Benz', star: 'Guirassy Goleador', primaryColor: '#ffffff', secondaryColor: '#dc2626', pattern: 'hoops', hairColor: '#1c1917', formation: '4-4-2' },
    { name: 'Tottenham Sin Trofeos', city: 'White Hart Lane', star: 'Son Sonriente', primaryColor: '#ffffff', secondaryColor: '#1e1b4b', pattern: 'solid', hairColor: '#1c1917', formation: '4-3-3' },
    { name: 'Newcastle de las Urracas', city: 'St James Park', star: 'Isak Elástico', primaryColor: '#000000', secondaryColor: '#ffffff', pattern: 'vertical_stripes', hairColor: '#1c1917', formation: '4-3-3' },
    { name: 'West Ham de los Martillos', city: 'Londres Este', star: 'Bowen Flecha', primaryColor: '#881337', secondaryColor: '#38bdf8', pattern: 'solid', hairColor: '#4c0519', formation: '4-2-3-1' },
    { name: 'Brighton de las Gaviotas', city: 'Costa Sur', star: 'Mitoma Driblador', primaryColor: '#2563eb', secondaryColor: '#ffffff', pattern: 'vertical_stripes', hairColor: '#1e40af', formation: '4-2-3-1' },
    { name: 'Real Sociedad de Donosti', city: 'Anoeta Mágica', star: 'Kubo Samurái', primaryColor: '#1d4ed8', secondaryColor: '#ffffff', pattern: 'vertical_stripes', hairColor: '#1e3a8a', formation: '4-3-3' }
  ],
  14: [
    { name: 'Athletic Club de los Leones', city: 'San Mamés Catedral', star: 'Nico Williams Rayo', primaryColor: '#dc2626', secondaryColor: '#ffffff', pattern: 'vertical_stripes', hairColor: '#1c1917', formation: '4-2-3-1' },
    { name: 'Girona de los Sueños', city: 'Montilivi Sorpresa', star: 'Dovbyk Pichichi', primaryColor: '#dc2626', secondaryColor: '#ffffff', pattern: 'vertical_stripes', hairColor: '#1c1917', formation: '4-3-3' },
    { name: 'Atalanta de Bérgamo Diosa', city: 'Gewiss Arena', star: 'Lookman Hat-Trick', primaryColor: '#1d4ed8', secondaryColor: '#000000', pattern: 'vertical_stripes', hairColor: '#1e3a8a', formation: '3-4-3' },
    { name: 'Bologna Revelación', city: 'Renato DallAra', star: 'Zirkzee Elegante', primaryColor: '#1e3a8a', secondaryColor: '#dc2626', pattern: 'vertical_stripes', hairColor: '#172554', formation: '4-2-3-1' },
    { name: 'Fiorentina de la Viola', city: 'Florencia Renacimiento', star: 'Nico González Zurda', primaryColor: '#7c3aed', secondaryColor: '#ffffff', pattern: 'solid', hairColor: '#4c1d95', formation: '4-3-3' },
    { name: 'Flamengo del Mengão', city: 'Maracaná Rugiente', star: 'Gabigol Bicampeón', primaryColor: '#dc2626', secondaryColor: '#000000', pattern: 'hoops', hairColor: '#1c1917', formation: '4-4-2' },
    { name: 'Palmeiras del Verdao', city: 'Allianz Parque', star: 'Endrick Fenómeno', primaryColor: '#15803d', secondaryColor: '#ffffff', pattern: 'solid', hairColor: '#14532d', formation: '4-3-3' }
  ],
  13: [
    { name: 'Sao Paulo Tricolor', city: 'Morumbi Soberano', star: 'Lucas Moura Flash', primaryColor: '#ffffff', secondaryColor: '#dc2626', pattern: 'hoops', hairColor: '#1c1917', formation: '4-2-3-1' },
    { name: 'Fluminense de las Laranjeiras', city: 'Río de Janeiro', star: 'Germán Cano Matador', primaryColor: '#881337', secondaryColor: '#15803d', pattern: 'vertical_stripes', hairColor: '#4c0519', formation: '4-3-3' },
    { name: 'Gremio Inmortal', city: 'Porto Alegre', star: 'Luisito Pistolero', primaryColor: '#0284c7', secondaryColor: '#000000', pattern: 'vertical_stripes', hairColor: '#0369a1', formation: '4-2-3-1' },
    { name: 'Internacional Colorado', city: 'Beira-Rio', star: 'Enner Valencia Toro', primaryColor: '#dc2626', secondaryColor: '#ffffff', pattern: 'solid', hairColor: '#7f1d1d', formation: '4-4-2' },
    { name: 'Atlético Mineiro Galo', city: 'Belo Horizonte', star: 'Hulk Bomba Nuclear', primaryColor: '#000000', secondaryColor: '#ffffff', pattern: 'vertical_stripes', hairColor: '#1c1917', formation: '4-3-3' },
    { name: 'Cruzeiro Raposa', city: 'Mineirão Celeste', star: 'Matheus Pereira 10', primaryColor: '#1d4ed8', secondaryColor: '#ffffff', pattern: 'solid', hairColor: '#1e3a8a', formation: '4-2-3-1' },
    { name: 'Corinthians Timão', city: 'Neo Química Arena', star: 'Yuri Alberto 9', primaryColor: '#ffffff', secondaryColor: '#000000', pattern: 'solid', hairColor: '#1c1917', formation: '4-3-3' }
  ],
  12: [
    { name: 'Racing Club de Avellaneda', city: 'El Cilindro Mágico', star: 'Maravilla Martínez', primaryColor: '#38bdf8', secondaryColor: '#ffffff', pattern: 'vertical_stripes', hairColor: '#0284c7', formation: '4-3-3' },
    { name: 'Independiente Rey de Copas', city: 'Libertadores de América', star: 'Ávalos Tanque', primaryColor: '#dc2626', secondaryColor: '#ffffff', pattern: 'solid', hairColor: '#7f1d1d', formation: '4-4-2' },
    { name: 'San Lorenzo de Almagro', city: 'Boedo Eterno', star: 'Perrito Barrios', primaryColor: '#1d4ed8', secondaryColor: '#dc2626', pattern: 'vertical_stripes', hairColor: '#1e3a8a', formation: '5-3-2' },
    { name: 'Vélez Sarsfield del Fortín', city: 'Liniers Campeón', star: 'Braian Romero Gol', primaryColor: '#ffffff', secondaryColor: '#1d4ed8', pattern: 'sash', hairColor: '#1c1917', formation: '4-3-3' },
    { name: 'Rosario Central Canalla', city: 'Gigante de Arroyito', star: 'Fatura Broun Muro', primaryColor: '#1e3a8a', secondaryColor: '#facc15', pattern: 'vertical_stripes', hairColor: '#172554', formation: '4-2-3-1' },
    { name: 'Newells Old Boys Leproso', city: 'Parque Independencia', star: 'Banega Maestro', primaryColor: '#dc2626', secondaryColor: '#000000', pattern: 'vertical_stripes', hairColor: '#1c1917', formation: '4-3-3' },
    { name: 'Estudiantes de La Plata Pincha', city: 'Estadio UNO', star: 'Enzo Pérez General', primaryColor: '#dc2626', secondaryColor: '#ffffff', pattern: 'vertical_stripes', hairColor: '#7f1d1d', formation: '4-4-2' }
  ],
  11: [
    { name: 'Peñarol Carbonero de Oro', city: 'Campeón del Siglo', star: 'Fiera Aguirre DT', primaryColor: '#facc15', secondaryColor: '#000000', pattern: 'vertical_stripes', hairColor: '#713f12', formation: '4-4-2' },
    { name: 'Nacional Bolso Decano', city: 'Gran Parque Central', star: 'Carneiro Búfalo', primaryColor: '#ffffff', secondaryColor: '#1d4ed8', pattern: 'sash', hairColor: '#1c1917', formation: '4-3-3' },
    { name: 'Colo-Colo Cacique Eterno', city: 'Monumental David Arellano', star: 'Arturo Vidal Rey', primaryColor: '#ffffff', secondaryColor: '#000000', pattern: 'solid', hairColor: '#1c1917', formation: '4-3-3' },
    { name: 'Universidad de Chile La U', city: 'Nacional de Santiago', star: 'Marcelo Díaz Chelo', primaryColor: '#1d4ed8', secondaryColor: '#dc2626', pattern: 'solid', hairColor: '#1e3a8a', formation: '4-3-3' },
    { name: 'Universidad Católica Cruzados', city: 'San Carlos de Apoquindo', star: 'Zampedri Goleador', primaryColor: '#ffffff', secondaryColor: '#1d4ed8', pattern: 'hoops', hairColor: '#1c1917', formation: '4-4-2' },
    { name: 'Atlético Nacional Verdolaga', city: 'Atanasio Girardot', star: 'Cardona Mago', primaryColor: '#15803d', secondaryColor: '#ffffff', pattern: 'vertical_stripes', hairColor: '#14532d', formation: '4-2-3-1' },
    { name: 'Millonarios Embajador', city: 'El Campín Bogotá', star: 'Falcao García Tigre', primaryColor: '#1d4ed8', secondaryColor: '#ffffff', pattern: 'solid', hairColor: '#1e3a8a', formation: '4-4-2' }
  ],
  10: [
    { name: 'América de Cali Escarlata', city: 'Pascual Guerrero', star: 'Adrián Ramos Capi', primaryColor: '#dc2626', secondaryColor: '#ffffff', pattern: 'solid', hairColor: '#7f1d1d', formation: '4-3-3' },
    { name: 'Junior de Barranquilla Tiburón', city: 'Metropolitano Roberto Meléndez', star: 'Carlos Bacca Letal', primaryColor: '#dc2626', secondaryColor: '#ffffff', pattern: 'vertical_stripes', hairColor: '#1c1917', formation: '4-3-3' },
    { name: 'Independiente Santa Fe Cardenal', city: 'Bogotá Histórica', star: 'Hugo Rodallega Hugo', primaryColor: '#dc2626', secondaryColor: '#ffffff', pattern: 'solid', hairColor: '#7f1d1d', formation: '4-4-2' },
    { name: 'Liga de Quito Rey de Copas', city: 'Rodrigo Paz Delgado', star: 'Alex Arce Paraguayo', primaryColor: '#ffffff', secondaryColor: '#dc2626', pattern: 'solid', hairColor: '#1c1917', formation: '4-2-3-1' },
    { name: 'Independiente del Valle Matagigantes', city: 'Sangolquí Cantera', star: 'Kendy Páez Joya', primaryColor: '#000000', secondaryColor: '#1d4ed8', pattern: 'vertical_stripes', hairColor: '#1c1917', formation: '4-3-3' },
    { name: 'Barcelona SC Ídolo del Astillero', city: 'Monumental Guayaquil', star: 'Damián Díaz Kitu', primaryColor: '#facc15', secondaryColor: '#000000', pattern: 'solid', hairColor: '#713f12', formation: '4-3-3' },
    { name: 'Emelec Eléctrico Bombillo', city: 'Capwell Azul', star: 'Jaime Ayoví 9', primaryColor: '#1e3a8a', secondaryColor: '#475569', pattern: 'sash', hairColor: '#172554', formation: '4-4-2' }
  ],
  9: [
    { name: 'Club América de las Águilas', city: 'Estadio Azteca Coloso', star: 'Henry Martín Bomba', primaryColor: '#fef08a', secondaryColor: '#1e3a8a', pattern: 'solid', hairColor: '#854d0e', formation: '4-2-3-1' },
    { name: 'Chivas Rayadas de Guadalajara', city: 'Estadio Akron', star: 'Chicharito Hernández', primaryColor: '#dc2626', secondaryColor: '#ffffff', pattern: 'vertical_stripes', hairColor: '#1c1917', formation: '4-3-3' },
    { name: 'Cruz Azul Máquina Cementera', city: 'Ciudad de los Deportes', star: 'Antuna Brujo', primaryColor: '#1d4ed8', secondaryColor: '#ffffff', pattern: 'solid', hairColor: '#1e3a8a', formation: '3-4-3' },
    { name: 'Pumas UNAM del Pedregal', city: 'Olímpico Universitario', star: 'Chino Huerta Rehilete', primaryColor: '#1e3a8a', secondaryColor: '#eab308', pattern: 'solid', hairColor: '#172554', formation: '4-4-2' },
    { name: 'Tigres UANL Universitarios', city: 'El Volcán Universitario', star: 'Gignac André-Pierre', primaryColor: '#eab308', secondaryColor: '#1d4ed8', pattern: 'solid', hairColor: '#713f12', formation: '4-2-3-1' },
    { name: 'Rayados de Monterrey Pandilla', city: 'BBVA Gigante de Acero', star: 'Sergio Canales Mago', primaryColor: '#1e3a8a', secondaryColor: '#ffffff', pattern: 'vertical_stripes', hairColor: '#172554', formation: '4-3-3' },
    { name: 'Toluca Diablos Rojos', city: 'Nemesio Díez Infierno', star: 'Alexis Vega Talento', primaryColor: '#dc2626', secondaryColor: '#ffffff', pattern: 'solid', hairColor: '#7f1d1d', formation: '4-3-3' }
  ],
  8: [
    { name: 'Al-Hilal de los Millones', city: 'Riad Reino Saudí', star: 'Mitrovic Cañonero', primaryColor: '#1d4ed8', secondaryColor: '#ffffff', pattern: 'solid', hairColor: '#1e3a8a', formation: '4-2-3-1' },
    { name: 'Al-Nassr de los Caballeros', city: 'Mrsool Park', star: 'Cristiano Rolando', primaryColor: '#facc15', secondaryColor: '#1d4ed8', pattern: 'solid', hairColor: '#713f12', formation: '4-3-3' },
    { name: 'Al-Ittihad Tigres de Yeda', city: 'King Abdullah Stadium', star: 'Karim Benzemas', primaryColor: '#facc15', secondaryColor: '#000000', pattern: 'vertical_stripes', hairColor: '#713f12', formation: '4-3-3' },
    { name: 'Inter Miami de las Garzas', city: 'Chase Stadium Rosa', star: 'Lio Memessi', primaryColor: '#f472b6', secondaryColor: '#000000', pattern: 'solid', hairColor: '#831843', formation: '4-3-3' },
    { name: 'LA Galaxy Galáctico', city: 'Dignity Health Park', star: 'Riqui Puig Pases', primaryColor: '#ffffff', secondaryColor: '#1e3a8a', pattern: 'sash', hairColor: '#1c1917', formation: '4-3-3' },
    { name: 'Columbus Crew de la Tripulación', city: 'Lower.com Field', star: 'Cucho Hernández Crack', primaryColor: '#facc15', secondaryColor: '#000000', pattern: 'solid', hairColor: '#713f12', formation: '3-4-2-1' },
    { name: 'LAFC del Ángel Negro', city: 'BMO Stadium', star: 'Denis Bouanga Rayo', primaryColor: '#000000', secondaryColor: '#ca8a04', pattern: 'solid', hairColor: '#1c1917', formation: '4-3-3' }
  ],
  7: [
    { name: 'Galatasaray León de Estambul', city: 'Rams Park Infierno', star: 'Mauro Icardi Goleador', primaryColor: '#eab308', secondaryColor: '#dc2626', pattern: 'vertical_stripes', hairColor: '#713f12', formation: '4-2-3-1' },
    { name: 'Fenerbahce Canarios Amarillos', city: 'Sukru Saracoglu', star: 'Dzeko Diamante', primaryColor: '#1e3a8a', secondaryColor: '#facc15', pattern: 'vertical_stripes', hairColor: '#172554', formation: '4-3-3' },
    { name: 'Besiktas Águilas Negras', city: 'Vodafone Park Bósforo', star: 'Ciro Immobile', primaryColor: '#000000', secondaryColor: '#ffffff', pattern: 'vertical_stripes', hairColor: '#1c1917', formation: '4-2-3-1' },
    { name: 'Olympiacos Pireo Rojo', city: 'Georgios Karaiskakis', star: 'El Kaabi Goleador', primaryColor: '#dc2626', secondaryColor: '#ffffff', pattern: 'vertical_stripes', hairColor: '#7f1d1d', formation: '4-3-3' },
    { name: 'Panathinaikos del Trébol', city: 'Atenas Clásica', star: 'Bernard Artista', primaryColor: '#15803d', secondaryColor: '#ffffff', pattern: 'solid', hairColor: '#14532d', formation: '4-3-3' },
    { name: 'Celtic de Glasgow Trébol', city: 'Celtic Park Verde', star: 'Kyogo Furuhashi Ninja', primaryColor: '#15803d', secondaryColor: '#ffffff', pattern: 'hoops', hairColor: '#14532d', formation: '4-3-3' },
    { name: 'Rangers de Escocia Azul', city: 'Ibrox Stadium', star: 'Tavernier Capitán', primaryColor: '#1d4ed8', secondaryColor: '#ffffff', pattern: 'solid', hairColor: '#1e3a8a', formation: '4-2-3-1' }
  ],
  6: [
    { name: 'Shakhtar Donetsk Minero', city: 'Donbás Arena', star: 'Sudakov Joya', primaryColor: '#ea580c', secondaryColor: '#000000', pattern: 'vertical_stripes', hairColor: '#9a3412', formation: '4-3-3' },
    { name: 'Dinamo de Zagreb de los Balcanes', city: 'Maksimir Stadium', star: 'Petkovic Maestro', primaryColor: '#1d4ed8', secondaryColor: '#ffffff', pattern: 'solid', hairColor: '#1e3a8a', formation: '4-2-3-1' },
    { name: 'Estrella Roja de Belgrado', city: 'Marakana Rajko Mitic', star: 'Ivanic Gambeta', primaryColor: '#dc2626', secondaryColor: '#ffffff', pattern: 'vertical_stripes', hairColor: '#7f1d1d', formation: '4-2-3-1' },
    { name: 'Sparta Praga de Bohemia', city: 'epet ARENA Praga', star: 'Krejci Líder', primaryColor: '#881337', secondaryColor: '#ffffff', pattern: 'solid', hairColor: '#4c0519', formation: '3-4-3' },
    { name: 'Slavia Praga Rojiblanca', city: 'Fortuna Arena', star: 'Provod Motor', primaryColor: '#dc2626', secondaryColor: '#ffffff', pattern: 'vertical_stripes', hairColor: '#1c1917', formation: '4-2-3-1' },
    { name: 'Salzburg de los Toros Rojos', city: 'Red Bull Arena Austria', star: 'Konate Flecha', primaryColor: '#ffffff', secondaryColor: '#dc2626', pattern: 'solid', hairColor: '#1c1917', formation: '4-3-1-2' },
    { name: 'Copenhague de los Leones', city: 'Parken Stadium Dinamarca', star: 'Elyounoussi Crack', primaryColor: '#ffffff', secondaryColor: '#1d4ed8', pattern: 'solid', hairColor: '#1c1917', formation: '4-3-3' }
  ],
  5: [
    { name: 'Sevilla Fútbol Club de Europa', city: 'Ramón Sánchez-Pizjuán', star: 'Lucas Ocampos Guerrero', primaryColor: '#ffffff', secondaryColor: '#dc2626', pattern: 'solid', hairColor: '#1c1917', formation: '4-3-3' },
    { name: 'Villarreal Submarino Amarillo', city: 'Estadio de la Cerámica', star: 'Alex Baena Asistente', primaryColor: '#facc15', secondaryColor: '#1d4ed8', pattern: 'solid', hairColor: '#713f12', formation: '4-4-2' },
    { name: 'Real Betis Balompié Arte', city: 'Benito Villamarín', star: 'Isco Alarcón Magia', primaryColor: '#15803d', secondaryColor: '#ffffff', pattern: 'vertical_stripes', hairColor: '#14532d', formation: '4-2-3-1' },
    { name: 'Real Sociedad de San Sebastián', city: 'Reale Arena Anoeta', star: 'Mikel Merino Pulmón', primaryColor: '#1d4ed8', secondaryColor: '#ffffff', pattern: 'vertical_stripes', hairColor: '#1e3a8a', formation: '4-3-3' },
    { name: 'AS Roma de los Gladiadores', city: 'Stadio Olimpico Roma', star: 'Paulo Dybala Joya', primaryColor: '#881337', secondaryColor: '#facc15', pattern: 'solid', hairColor: '#4c0519', formation: '3-4-2-1' },
    { name: 'Lazio Celeste Romana', city: 'Olimpico di Roma', star: 'Mattia Zaccagni 10', primaryColor: '#7dd3fc', secondaryColor: '#ffffff', pattern: 'solid', hairColor: '#0284c7', formation: '4-3-3' },
    { name: 'Atalanta Bergamo de Europa', city: 'Gewiss Stadium', star: 'Teun Koopmeiners Francotirador', primaryColor: '#1d4ed8', secondaryColor: '#000000', pattern: 'vertical_stripes', hairColor: '#1e3a8a', formation: '3-4-1-2' }
  ],
  4: [
    { name: 'Borussia Dortmund Muro Amarillo', city: 'Signal Iduna Park', star: 'Julian Brandt Cerebro', primaryColor: '#facc15', secondaryColor: '#000000', pattern: 'solid', hairColor: '#713f12', formation: '4-2-3-1' },
    { name: 'Bayer Leverkusen Campeón Invicto', city: 'BayArena Leverkusen', star: 'Florian Wirtz Prodigio', primaryColor: '#000000', secondaryColor: '#dc2626', pattern: 'solid', hairColor: '#1c1917', formation: '3-4-2-1' },
    { name: 'RB Leipzig de Alta Velocidad', city: 'Red Bull Arena Leipzig', star: 'Xavi Simons Diablillo', primaryColor: '#ffffff', secondaryColor: '#dc2626', pattern: 'solid', hairColor: '#1c1917', formation: '4-2-2-2' },
    { name: 'Juventus de Turín Vecchia Signora', city: 'Allianz Stadium Turín', star: 'Dušan Vlahović Tanque', primaryColor: '#000000', secondaryColor: '#ffffff', pattern: 'vertical_stripes', hairColor: '#1c1917', formation: '3-5-2' },
    { name: 'AC Milan Rossonero Histórico', city: 'San Siro Catedral', star: 'Rafael Leão Pantera', primaryColor: '#dc2626', secondaryColor: '#000000', pattern: 'vertical_stripes', hairColor: '#1c1917', formation: '4-2-3-1' },
    { name: 'Inter de Milán Nerazzurro', city: 'Giuseppe Meazza', star: 'Lautaro Martínez Toro', primaryColor: '#1d4ed8', secondaryColor: '#000000', pattern: 'vertical_stripes', hairColor: '#1e3a8a', formation: '3-5-2' },
    { name: 'Napoli del Vesubio', city: 'Diego Armando Maradona', star: 'Khvicha Kvaratskhelia', primaryColor: '#0284c7', secondaryColor: '#ffffff', pattern: 'solid', hairColor: '#0369a1', formation: '4-3-3' }
  ],
  3: [
    { name: 'Chelsea Football Club Blue', city: 'Stamford Bridge Londres', star: 'Cole Palmer Fío', primaryColor: '#1d4ed8', secondaryColor: '#ffffff', pattern: 'solid', hairColor: '#1e3a8a', formation: '4-2-3-1' },
    { name: 'Tottenham Hotspur Spurs', city: 'Tottenham Hotspur Stadium', star: 'Son Heung-min Capitán', primaryColor: '#ffffff', secondaryColor: '#1e1b4b', pattern: 'solid', hairColor: '#1c1917', formation: '4-3-3' },
    { name: 'Manchester United Red Devils', city: 'Old Trafford Teatro Sueños', star: 'Bruno Fernandes Mando', primaryColor: '#dc2626', secondaryColor: '#ffffff', pattern: 'solid', hairColor: '#7f1d1d', formation: '4-2-3-1' },
    { name: 'Aston Villa de los Villanos', city: 'Villa Park Birmingham', star: 'Emiliano Dibu Martínez Muro', primaryColor: '#881337', secondaryColor: '#38bdf8', pattern: 'solid', hairColor: '#4c0519', formation: '4-4-2' },
    { name: 'Newcastle United Geordies', city: 'St James Park', star: 'Bruno Guimarães Jefe', primaryColor: '#000000', secondaryColor: '#ffffff', pattern: 'vertical_stripes', hairColor: '#1c1917', formation: '4-3-3' },
    { name: 'Atlético de Madrid Colchonero', city: 'Cívitas Metropolitano', star: 'Antoine Griezmann Principito', primaryColor: '#dc2626', secondaryColor: '#ffffff', pattern: 'vertical_stripes', hairColor: '#1c1917', formation: '5-3-2' },
    { name: 'Paris Saint-Germain Parque Príncipes', city: 'Parc des Princes París', star: 'Ousmane Dembélé Cohete', primaryColor: '#1e1b4b', secondaryColor: '#dc2626', pattern: 'sash', hairColor: '#0f172a', formation: '4-3-3' }
  ],
  2: [
    { name: 'Arsenal de los Invencibles', city: 'Emirates Stadium Londres', star: 'Bukayo Saka Diamante', primaryColor: '#dc2626', secondaryColor: '#ffffff', pattern: 'solid', hairColor: '#7f1d1d', formation: '4-3-3' },
    { name: 'Liverpool de Anfield Road', city: 'Anfield The Kop', star: 'Mohamed Salah Faraón', primaryColor: '#b91c1c', secondaryColor: '#ffffff', pattern: 'solid', hairColor: '#450a0a', formation: '4-3-3' },
    { name: 'Bayern Múnich Gigante de Baviera', city: 'Allianz Arena Múnich', star: 'Harry Kane Cañón', primaryColor: '#dc2626', secondaryColor: '#ffffff', pattern: 'solid', hairColor: '#7f1d1d', formation: '4-2-3-1' },
    { name: 'FC Barcelona del Tiki Taka', city: 'Camp Nou Blaugrana', star: 'Lamine Yamal Magia Pura', primaryColor: '#1d4ed8', secondaryColor: '#b91c1c', pattern: 'vertical_stripes', hairColor: '#1e3a8a', formation: '4-3-3' },
    { name: 'Boca Juniors de la Bombonera', city: 'Buenos Aires Mística', star: 'Edinson Cavani Matador', primaryColor: '#1e3a8a', secondaryColor: '#facc15', pattern: 'hoops', hairColor: '#172554', formation: '4-4-2' },
    { name: 'River Plate del Monumental', city: 'Núñez Monumental', star: 'Claudio Echeverri Diablito', primaryColor: '#ffffff', secondaryColor: '#dc2626', pattern: 'sash', hairColor: '#1c1917', formation: '4-3-3' },
    { name: 'Manchester City de Guardiola', city: 'Etihad Stadium', star: 'Kevin De Bruyne Cirujano', primaryColor: '#38bdf8', secondaryColor: '#ffffff', pattern: 'solid', hairColor: '#0284c7', formation: '3-2-4-1' }
  ],
  1: [
    { name: 'Real Madrid de las 15 Copas', city: 'Santiago Bernabéu Galáctico', star: 'Vinicius Jr & Bellingham', primaryColor: '#ffffff', secondaryColor: '#eab308', pattern: 'solid', hairColor: '#1c1917', formation: '4-3-1-2' },
    { name: 'Manchester City Campeón del Mundo', city: 'Etihad Arena Mundial', star: 'Erling Haaland Cyborg 9', primaryColor: '#38bdf8', secondaryColor: '#ffffff', pattern: 'solid', hairColor: '#0284c7', formation: '3-2-4-1' },
    { name: 'FC Barcelona de Leyendas', city: 'Spotify Camp Nou', star: 'Pedri & Lewandowski Goles', primaryColor: '#1d4ed8', secondaryColor: '#dc2626', pattern: 'vertical_stripes', hairColor: '#1e3a8a', formation: '4-3-3' },
    { name: 'Bayern Múnich Máquina Bávara', city: 'Allianz Arena Campeones', star: 'Musiala & Kane Explosión', primaryColor: '#dc2626', secondaryColor: '#ffffff', pattern: 'solid', hairColor: '#7f1d1d', formation: '4-2-3-1' },
    { name: 'Liverpool FC de la Furia Roja', city: 'Anfield Nunca Caminarás Solo', star: 'Luis Díaz & Salah Rayos', primaryColor: '#b91c1c', secondaryColor: '#ffffff', pattern: 'solid', hairColor: '#450a0a', formation: '4-3-3' },
    { name: 'Inter de Milán Estrellas Doradas', city: 'San Siro Gloria Eterna', star: 'Lautaro & Barella Guerreros', primaryColor: '#1d4ed8', secondaryColor: '#000000', pattern: 'vertical_stripes', hairColor: '#1e3a8a', formation: '3-5-2' },
    { name: 'Arsenal Gunners de Londres', city: 'Emirates Stadium Champions', star: 'Odegaard & Rice Generales', primaryColor: '#dc2626', secondaryColor: '#ffffff', pattern: 'solid', hairColor: '#7f1d1d', formation: '4-3-3' }
  ]
};

export const COLOR_PALETTES = [
  { primary: '#ef4444', secondary: '#ffffff', hair: '#1c1917' }, // Rojo / Blanco
  { primary: '#3b82f6', secondary: '#ffffff', hair: '#78350f' }, // Azul Rey / Blanco
  { primary: '#eab308', secondary: '#18181b', hair: '#eab308' }, // Amarillo / Negro
  { primary: '#22c55e', secondary: '#ffffff', hair: '#1c1917' }, // Verde / Blanco
  { primary: '#a855f7', secondary: '#ffffff', hair: '#451a03' }, // Púrpura / Blanco
  { primary: '#f97316', secondary: '#18181b', hair: '#9a3412' }, // Naranja / Negro
  { primary: '#06b6d4', secondary: '#1e293b', hair: '#172554' }, // Cian / Marino
  { primary: '#ec4899', secondary: '#ffffff', hair: '#831843' }, // Rosa / Blanco
  { primary: '#64748b', secondary: '#f8fafc', hair: '#0f172a' }, // Gris / Hielo
  { primary: '#854d0e', secondary: '#fef08a', hair: '#451a03' }, // Ámbar / Crema
  { primary: '#14b8a6', secondary: '#042f2e', hair: '#292524' }, // Turquesa / Oscuro
  { primary: '#e11d48', secondary: '#ffe4e6', hair: '#18181b' }  // Carmesí / Rosa Claro
];

export const FORMATIONS: FormationType[] = [
  '4-3-3', '4-4-2', '5-3-2', '3-5-2', '4-2-3-1', '3-4-3', '4-2-2-2', '3-4-2-1', '4-3-1-2', '3-4-1-2', '3-2-4-1'
];

export const TACTICS_DESCRIPTIONS: Record<FormationType, string> = {
  '4-3-3': 'Muro de 4 defensas en el fondo, 3 medios dinámicos y 3 atacantes abiertos.',
  '4-4-2': 'Formación clásica equilibrada. 4 defensas cerrados, 4 en el medio y 2 presionando.',
  '5-3-2': 'Autobús en el área ("Catenaccio"). 5 defensores amurallados frente al arco.',
  '3-5-2': 'Gran barrera en el mediocampo con 5 jugadores y 3 defensas en el fondo.',
  '4-2-3-1': 'Línea de 4 defensas, doble pivote y creadores cubriendo todos los ángulos.',
  '3-4-3': 'Ataque vertical y constante. 3 defensas de cobertura y 4 volantes activos.',
  '4-2-2-2': 'Cuadrado mágico con 4 defensas, 2 pivotes de contención y 2 mediapuntas creativos.',
  '3-4-2-1': '3 centrales férreos, 4 volantes carrileros y 2 enganches veloces.',
  '4-3-1-2': 'Línea de 4 sólida con un enganche creativo clásico suelto detrás de los delanteros.',
  '3-4-1-2': 'Defensa de 3 con carrilero largo, enganche y doble punta.',
  '3-2-4-1': 'Estructura posicional moderna tipo Pep: 3 centrales, 2 pivotes y 4 volantes ofensivos.'
};

export function getDivisionRivals(divisionId: number): DivisionClubDef[] {
  return DIVISION_RIVALS_MAP[divisionId] || DIVISION_RIVALS_MAP[23];
}

export function generateRandomRival(divisionId: number, matchIndex: number, seasonNumber: number): RivalTeam {
  const rivals = getDivisionRivals(divisionId);
  // Match index is 1 to 7, so pick rival (matchIndex - 1) % 7
  const clubIndex = Math.max(0, Math.min(6, (matchIndex - 1) % rivals.length));
  const clubData = rivals[clubIndex];

  const difficultyLevel = Math.max(1, Math.min(10, Math.ceil((24 - divisionId) / 2.3)));
  const targetGoalsToWin = Math.max(1, Math.min(6, Math.floor((24 - divisionId) / 4) + (matchIndex >= 4 ? 1 : 0)));

  return {
    name: clubData.name,
    shortName: clubData.name.split(' ')[0].substring(0, 5).toUpperCase(),
    city: clubData.city,
    primaryColor: clubData.primaryColor,
    secondaryColor: clubData.secondaryColor,
    pattern: clubData.pattern,
    hairColor: clubData.hairColor,
    formation: clubData.formation,
    tacticsDescription: TACTICS_DESCRIPTIONS[clubData.formation] || 'Bloque táctico equilibrado.',
    difficultyLevel,
    targetGoalsToWin,
    rivalStarPlayer: clubData.star
  };
}

export function parseFormationLines(formation: FormationType): { defenders: number; midfielders: number; forwards: number } {
  const parts = formation.split('-').map(Number);
  if (parts.length === 3) {
    return {
      defenders: parts[0],
      midfielders: parts[1],
      forwards: parts[2]
    };
  } else if (parts.length === 4) {
    return {
      defenders: parts[0],
      midfielders: parts[1] + parts[2],
      forwards: parts[3]
    };
  }
  return { defenders: 4, midfielders: 4, forwards: 2 };
}

export function generateLeagueStandings(
  divisionId: number,
  playerTeamName: string,
  currentMatch: number,
  playerWins: number,
  playerDraws: number,
  playerLosses: number,
  playerGoalsFor: number,
  playerGoalsAgainst: number
): LeagueStanding[] {
  const divisionRivals = getDivisionRivals(divisionId);
  const totalMatchesSoFar = playerWins + playerDraws + playerLosses;
  const playerPoints = playerWins * 3 + playerDraws * 1;

  const standings: LeagueStanding[] = [
    {
      teamName: `${playerTeamName} (TÚ)`,
      played: totalMatchesSoFar,
      won: playerWins,
      drawn: playerDraws,
      lost: playerLosses,
      goalsFor: playerGoalsFor,
      goalsAgainst: playerGoalsAgainst,
      points: playerPoints,
      isPlayerTeam: true
    }
  ];

  divisionRivals.forEach((rival, i) => {
    // If no matches have been played yet, everyone must have strictly 0 points and 0 goals!
    if (totalMatchesSoFar === 0) {
      standings.push({
        teamName: rival.name,
        played: 0,
        won: 0,
        drawn: 0,
        lost: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        points: 0,
        isPlayerTeam: false
      });
      return;
    }

    // Generate realistic simulated points for the other 7 teams in this division
    let rWins = Math.min(totalMatchesSoFar, Math.floor(totalMatchesSoFar * Math.max(0.05, 0.75 - i * 0.10)));
    if (rWins < 0) rWins = 0;
    const remainingMatches = totalMatchesSoFar - rWins;
    const rDraws = Math.max(0, Math.min(remainingMatches, Math.floor(remainingMatches * 0.4)));
    const rLosses = Math.max(0, totalMatchesSoFar - rWins - rDraws);
    
    const rGF = rWins * 2 + rDraws * 1 + (i % 2 === 0 ? 1 : 0);
    const rGA = rLosses * 2 + rDraws * 1;

    standings.push({
      teamName: rival.name,
      played: totalMatchesSoFar,
      won: rWins,
      drawn: rDraws,
      lost: rLosses,
      goalsFor: rGF,
      goalsAgainst: rGA,
      points: rWins * 3 + rDraws * 1,
      isPlayerTeam: false
    });
  });

  // Sort by points desc, then goal difference desc, then goalsFor desc
  return standings.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    const diffB = b.goalsFor - b.goalsAgainst;
    const diffA = a.goalsFor - a.goalsAgainst;
    if (diffB !== diffA) return diffB - diffA;
    if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
    return a.teamName.localeCompare(b.teamName);
  });
}

// 15 Non-Repeating Comments System featuring Betting, Referee/VAR, Shot Efficiency Stats, and Star Parodies
export function generateFanSocialPosts(
  playerName: string,
  rivalName: string,
  playerScore: number,
  rivalScore: number,
  hatTrick: boolean,
  shotsCount: number = 0
): FanSocialPost[] {
  const isWin = playerScore > rivalScore;
  const isDraw = playerScore === rivalScore;
  const isLoss = playerScore < rivalScore;
  const highShotsLowGoals = shotsCount >= 14 && playerScore <= 2;

  const ACCOUNTS_POOL = [
    { name: 'Cristiano Rolando', handle: '@CRoland_Siuuu', avatar: '👑' },
    { name: 'Lio Memessi', handle: '@ElPulgaMemes', avatar: '🐐' },
    { name: 'Kylian Mbappitas', handle: '@MbappitasNinja', avatar: '🐢' },
    { name: 'Erling Jalando', handle: '@ErlingCyborg9', avatar: '🤖' },
    { name: 'Pep Guardiolo', handle: '@GuardioloTiki', avatar: '🧠' },
    { name: 'Cholo Cholistas', handle: '@CholoCuchillo', avatar: '🥋' },
    { name: 'Dibu Martínez de Cartón', handle: '@DibuMuro', avatar: '🧤' },
    { name: 'Luka Modrikis', handle: '@Modrikis10', avatar: '🎻' },
    { name: 'Neymar Rodando', handle: '@NeymarRolls', avatar: '🎭' },
    { name: 'Vinicius Express', handle: '@ViniDribble', avatar: '⚡' },
    { name: 'Zlatan Platanovic', handle: '@DiosPlatanovic', avatar: '🦁' },
    { name: 'Kun Agüero Gamer', handle: '@KunStreamer', avatar: '🎮' },
    { name: 'Carles Puyolazo', handle: '@PuyolMelena', avatar: '🛡️' },
    { name: 'Luis Suaritos Mordisco', handle: '@Suaritos9', avatar: '🧛' },
    { name: 'El Tío del Asado', handle: '@ElTioDelAsado', avatar: '🥩' },
    { name: 'Apostador Desesperado', handle: '@ParleySalvador', avatar: '🎲' },
    { name: 'El Ludópata del Potrero', handle: '@BetMaster99', avatar: '💸' },
    { name: 'VAR Fanático', handle: '@OjoDeHalconVAR', avatar: '📺' },
    { name: 'Árbitro Comprado Fan', handle: '@SilbatoDudoso', avatar: '🟨' },
    { name: 'Analista de Sillón', handle: '@TacticaModerna', avatar: '📊' },
    { name: 'Perrito del Potrero', handle: '@PerritoPotrero', avatar: '🐶' },
    { name: 'Ultra Hincha Rabioso', handle: '@LaBandaDelTablon', avatar: '🥁' },
    { name: 'Vecino del Estadio', handle: '@BalonesEnMiTecho', avatar: '🏠' },
    { name: 'Madre con Chancla', handle: '@MamaPreocupada', avatar: '🩴' }
  ];

  // Pools of varied comment templates
  const winPool = [
    // Betting
    `¡APOSTÉ LA CASA Y EL AUTO A QUE GANABAS! Menos mal no me fallaste ${playerName}, ¡hoy cenamos langosta con toda la familia! 🦞💸💰`,
    `Mi suegro me prestó los ahorros del mes para meterle a tu victoria... ¡Gracias por salvar mi matrimonio hermano! 🙌🏠`,
    `El parley de 8 combinadas estaba en juego al minuto 88. ¡Ese gol me pagó las vacaciones en el Caribe! 🌴💵`,
    // Referee & VAR
    `El árbitro hizo todo lo posible para que nos empataran con ese penal fantasma, ¡pero la justicia divina existe! 🟨🎪`,
    `¿Vieron el codazo que no cobraron en el primer tiempo? El VAR hoy estaba mirando una serie en Netflix. ¡Ganamos contra 12! 📺😠`,
    // Performance & Praise
    hatTrick
      ? `¡SIUUU! ¡HAT-TRICK MONUMENTAL de ${playerName} ante ${rivalName}! ¡Definición quirúrgica de Balón de Oro! ⚽🔥👑`
      : `¡Partidazo táctico! ${playerName} manejó la presión y selló los 3 puntos de oro. ¡El ascenso a la siguiente división está cerca! 🚀`,
    `Qué manera de acariciar el balón tiene ${playerName}. Finta, pausa y misil al ángulo. ¡Fútbol champagne puro! 🪄🇦🇷`,
    `Algoritmo de gol activado: ${playerScore} goles en 60 segundos. ¡Los defensas de ${rivalName} quedaron en modo reinicio! 🤖💥`,
    `¡Qué alegría, qué jogo bonito! ${playerName} jugó con una sonrisa de oreja a oreja y armó un carnaval en la cancha. 🤙🎉`,
    `Hoy el asado y los choripanes van por cuenta de la hinchada. ¡3 puntos vitales para no perder la punta! 🥩🍺`,
    // Tactics / Stats
    highShotsLowGoals
      ? `Chutaste como 20 veces para meter apenas ${playerScore} goles... ¡Menos mal ganamos, porque la puntería hoy estaba para el olvido! 🎯😅`
      : `Efectividad letal en el área: cada remate con potencia iba con pasaporte directo a las redes rivales. 🎯⚡`,
    `Ganamos con categoría, pero la defensa en la segunda línea debe cerrar los espacios más rápido si queremos el campeonato. 🛡️`,
    // Rival Salt & Memes
    `Soy hincha de ${rivalName} y reconozco que jugaron con el corazón, aunque el segundo gol fue pura carambola con suerte. 🤡📉`,
    `Si Zlatan hubiera jugado este partido, terminaba 10 a 0. Igual buen triunfo de ${playerName}. 🦁`,
    `El arquero de ${rivalName} todavía está buscando la pelota en los reflectores del estadio... ¡Qué zapatazo! 🚀🧤`
  ];

  const drawPool = [
    // Betting
    `¡NOOOO! ¡Se me cayó la apuesta combinada por un solo gol! Ahora le tendré que explicar a mis hijos que no salimos a comer el domingo... 😭📉`,
    `Aposté al empate con cuota x4.5 y me salvé sobre la campana... pero casi me da un infarto en el descuento. 💔🎲`,
    // Referee & VAR
    `El árbitro adicionó apenas 30 segundos cuando el arquero de ${rivalName} se pasó todo el partido haciendo tiempo en el suelo. ⏱️😤`,
    `Una mano clarísima en el área rival que el juez no quiso pitar. Un empate con sabor a injusticia total. 🟨📺`,
    // Performance & Stats
    highShotsLowGoals
      ? `Disparaste ${shotsCount || 18} veces al arco y no pudimos pasar del ${playerScore}-${rivalScore}. ¡Hay que afinar la puntería en los entrenamientos ya! 🤦‍♂️⚽`
      : `Empate con sabor a poco ante ${rivalName}. Dejamos escapar 2 puntos claves en la lucha por los 2 puestos de ascenso. 😕`,
    `Faltó sangre y rebeldía en los últimos 15 segundos. No podemos conformarnos con repartir puntos de local.`,
    `El arquero rival se vistió de superhéroe y sacó 3 pelotas de la línea con las uñas. Punto que suma pero duele. 🧤`,
    `Por lo menos mantuvimos el invicto y la portería no sufrió más de la cuenta. A ganar el próximo partido sí o sí. 🛡️`,
    `Mucho toque intrascendente y pocos tiros directos con veneno. El técnico tiene que cambiar la táctica. 🧠`,
    `Guau guau 🐶... Vi el partido desde el alambrado y les faltó rematar más cruzado. ¡A meter garra muchachos!`,
    `El asado queda a medio gas. 1 punto que nos mantiene en pelea, pero la próxima fecha es una final. 🥩`,
    `Si no metemos los goles cuando dominamos el partido, el rival se agranda. Típico empate de liga dura.`,
    `La hinchada acompañó con bombos y banderas, pero nos faltó el gol de la victoria en la jugada final. 🥁`,
    `A descansar y poner la cabeza en frío. El torneo de 7 fechas no te da respiro. 🧊`,
    `Buen esfuerzo físico de ${playerName}, pero el cerrojo defensivo de ${rivalName} fue impenetrable hoy.`
  ];

  const lossPool = [
    // Betting
    `¡PERDÍ TODO MI SUELDO! Ahora le tendré que explicar a mis hijos que no tenemos para cenar porque aposté todo a tu victoria y no metiste los goles... 😭📉💸`,
    `Mi banco me está bloqueando las tarjetas por culpa de esta derrota... ¡Tenías que meter solo 1 gol más ${playerName}! 🤦‍♂️💔`,
    // Referee & VAR
    `¡EL ARBITRAJE FUE UN ESCÁNDALO! Nos anularon un gol legítimo y no expulsaron al defensa de ${rivalName} tras la patada voladora. 😡🎪`,
    `El juez de línea levantaba el banderín hasta cuando sacábamos del medio... qué robo a mano armada. 🚩`,
    // Performance & Stats
    highShotsLowGoals
      ? `¡Chutaste más de ${shotsCount || 20} veces y no entró ninguna! Rompiste todos los carteles del estadio menos la red. ¡Inaudito! 🎯❌`
      : `Derrota durísima contra ${rivalName}. Si jugamos con esta desatención defensiva, nos metemos directo en zona de descenso. 😡🚧`,
    `Tanto humo con ${playerName} y hoy la defensa rival lo anuló completamente. Hay que ser autocríticos y entrenar el doble. 👎`,
    `Cero generación de juego y pelotazos sin destino. El resultado refleja exactamente lo que se vio en cancha. 🧠📉`,
    `¡JAJAJAJA baile total! Los hinchas de ${rivalName} nos estamos haciendo un festín en las redes. Vayan comprando pasajes a la B. 🕺😂`,
    `En las malas mucho más. Hoy nos caímos pero nos levantamos juntos el próximo partido. ¡Cabeza arriba! 👊❤️`,
    `Tuvimos dos tiros en los palos que pudieron cambiar la historia. La suerte hoy no estuvo de nuestro lado. 🥅`,
    `El potrero enseña que de las derrotas se aprende más que de los triunfos. ¡A revertir esto la próxima fecha! 🐕🥁`,
    `Los defensores parecían estatuas en el área chica. No se puede conceder tantos goles tan fácil.`,
    `Hoy el asado se quemó por completo. Mañana dieta estricta y sesión táctica a primera hora. 🥩🚫`,
    `Una tarde negra para el club. Quedan pocas fechas en la temporada y no hay más margen de error. ⏳`,
    `El arquero rival parecía una pared de concreto. Toca levantar el ánimo y ajustar la puntería.`
  ];

  const chosenPool = isWin ? winPool : isDraw ? drawPool : lossPool;
  
  // Shuffle accounts and templates deterministically per match
  const shuffledAccounts = [...ACCOUNTS_POOL].sort(() => Math.random() - 0.5);
  const shuffledComments = [...chosenPool].sort(() => Math.random() - 0.5);

  const posts: FanSocialPost[] = [];
  const count = 15;

  for (let i = 0; i < count; i++) {
    const acc = shuffledAccounts[i % shuffledAccounts.length];
    const text = shuffledComments[i % shuffledComments.length];
    
    let sentiment: 'POSITIVE' | 'NEUTRAL' | 'FUNNY_ANGRY' | 'MEME' = 'POSITIVE';
    if (text.includes('😭') || text.includes('PERDÍ') || text.includes('robo') || text.includes('VERGÜENZA') || text.includes('😡')) {
      sentiment = 'FUNNY_ANGRY';
    } else if (text.includes('Zlatan') || text.includes('asado') || text.includes('🐶') || text.includes('JAJAJA')) {
      sentiment = 'MEME';
    } else if (text.includes('táctica') || text.includes('Empate') || text.includes('autocríticos') || text.includes('orden')) {
      sentiment = 'NEUTRAL';
    }

    posts.push({
      id: `post-${Date.now()}-${i}-${Math.random().toString(36).substring(2, 6)}`,
      avatar: acc.avatar,
      username: acc.name,
      handle: acc.handle,
      text: text,
      likes: Math.floor(Math.random() * 3500) + 250,
      retweets: Math.floor(Math.random() * 1200) + 60,
      sentiment
    });
  }

  return posts;
}
