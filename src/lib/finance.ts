export type AssetId = 'rv' | 'rf' | 'caja';

export type AssetClass = {
  id: AssetId;
  nombre: string;
  retornoEsperado: number;
  volatilidad: number;
};

export const ASSETS: readonly AssetClass[] = [
  { id: 'rv', nombre: 'Renta variable (acciones)', retornoEsperado: 0.07, volatilidad: 0.16 },
  { id: 'rf', nombre: 'Renta fija (bonos)', retornoEsperado: 0.04, volatilidad: 0.06 },
  { id: 'caja', nombre: 'Caja / depósito a plazo', retornoEsperado: 0.03, volatilidad: 0.01 },
] as const;

export const ASSET_IDS: readonly AssetId[] = ASSETS.map((a) => a.id);

export type ParActivos = 'rv-rf' | 'rv-caja' | 'rf-caja';

export const CORRELACION: Record<ParActivos, number> = {
  'rv-rf': 0.2,
  'rv-caja': 0,
  'rf-caja': 0.1,
};

export const AVISO_SUPUESTOS = 'Supuestos ilustrativos, no son proyecciones.';

export function correlacion(a: AssetId, b: AssetId): number {
  if (a === b) return 1;
  const directo = `${a}-${b}` as ParActivos;
  const inverso = `${b}-${a}` as ParActivos;
  return CORRELACION[directo] ?? CORRELACION[inverso] ?? 0;
}

export function asset(id: AssetId): AssetClass {
  const found = ASSETS.find((a) => a.id === id);
  if (!found) throw new Error(`Activo desconocido: ${id}`);
  return found;
}

export type Weights = Record<AssetId, number>;

export function normalize(weights: Weights): Weights {
  const clean = ASSET_IDS.map((id) => Math.max(0, Number.isFinite(weights[id]) ? weights[id] : 0));
  const total = clean.reduce((s, v) => s + v, 0);
  if (total === 0) {
    const igual = 1 / ASSET_IDS.length;
    return { rv: igual, rf: igual, caja: igual };
  }
  return { rv: clean[0] / total, rf: clean[1] / total, caja: clean[2] / total };
}

export function covarianza(): number[][] {
  return ASSETS.map((a) =>
    ASSETS.map((b) => a.volatilidad * b.volatilidad * correlacion(a.id, b.id)),
  );
}

export function portfolioStats(weights: Weights): { retorno: number; volatilidad: number } {
  const w = normalize(weights);
  const cov = covarianza();
  const ws = ASSET_IDS.map((id) => w[id]);
  const retorno = ASSETS.reduce((s, a, i) => s + ws[i] * a.retornoEsperado, 0);
  let varianza = 0;
  for (let i = 0; i < ws.length; i++) {
    for (let j = 0; j < ws.length; j++) varianza += ws[i] * ws[j] * cov[i][j];
  }
  return { retorno, volatilidad: Math.sqrt(Math.max(0, varianza)) };
}

export function twoAssetVol(w: number, volA: number, volB: number, rho: number): number {
  const v = w * w * volA * volA + (1 - w) ** 2 * volB * volB + 2 * w * (1 - w) * rho * volA * volB;
  // Floating-point error can make perfectly hedged variance slightly negative.
  return Math.sqrt(Math.max(0, v));
}

export type CompoundInput = {
  inicial: number;
  aporteMensual: number;
  tasaAnual: number;
  anios: number;
  inflacionAnual?: number;
};

export type CompoundPoint = { anio: number; aportado: number; valorNominal: number; valorReal: number };

export function compound({ inicial, aporteMensual, tasaAnual, anios, inflacionAnual = 0 }: CompoundInput): CompoundPoint[] {
  const tasaMensual = tasaAnual / 12;
  const puntos: CompoundPoint[] = [{ anio: 0, aportado: inicial, valorNominal: inicial, valorReal: inicial }];
  let valor = inicial;
  let aportado = inicial;
  for (let anio = 1; anio <= anios; anio++) {
    for (let m = 0; m < 12; m++) {
      valor = valor * (1 + tasaMensual) + aporteMensual;
      aportado += aporteMensual;
    }
    puntos.push({
      anio,
      aportado,
      valorNominal: valor,
      valorReal: valor / (1 + inflacionAnual) ** anio,
    });
  }
  return puntos;
}

export type FeeDragInput = {
  inicial: number;
  aporteMensual: number;
  tasaAnual: number;
  anios: number;
  comisionAnual: number;
};

export function feeDrag({ inicial, aporteMensual, tasaAnual, anios, comisionAnual }: FeeDragInput): {
  sinComision: number;
  conComision: number;
  perdida: number;
} {
  const final = (tasa: number) => compound({ inicial, aporteMensual, tasaAnual: tasa, anios }).at(-1)!.valorNominal;
  const sinComision = final(tasaAnual);
  const conComision = final(tasaAnual - comisionAnual);
  return { sinComision, conComision, perdida: sinComision - conComision };
}

export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function normalSampler(rand: () => number): () => number {
  return () => {
    const u1 = Math.max(rand(), Number.EPSILON);
    const u2 = rand();
    return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  };
}

export function cholesky(m: number[][]): number[][] {
  const n = m.length;
  const L = Array.from({ length: n }, () => new Array<number>(n).fill(0));
  for (let i = 0; i < n; i++) {
    for (let j = 0; j <= i; j++) {
      let s = m[i][j];
      for (let k = 0; k < j; k++) s -= L[i][k] * L[j][k];
      L[i][j] = i === j ? Math.sqrt(Math.max(s, 0)) : L[j][j] === 0 ? 0 : s / L[j][j];
    }
  }
  return L;
}

function percentil(ordenados: number[], p: number): number {
  const idx = (ordenados.length - 1) * p;
  const lo = Math.floor(idx);
  const hi = Math.ceil(idx);
  return ordenados[lo] + (ordenados[hi] - ordenados[lo]) * (idx - lo);
}

export type MonteCarloInput = {
  weights: Weights;
  inicial: number;
  aporteMensual: number;
  anios: number;
  simulaciones?: number;
  seed: number;
};

export type MonteCarloResult = {
  anios: number[];
  p10: number[];
  p50: number[];
  p90: number[];
  probPerdida: number;
};

export function monteCarlo({ weights, inicial, aporteMensual, anios, simulaciones = 1000, seed }: MonteCarloInput): MonteCarloResult {
  const w = normalize(weights);
  const ws = ASSET_IDS.map((id) => w[id]);
  const mu = ASSETS.map((a) => a.retornoEsperado);
  const L = cholesky(covarianza());
  const normal = normalSampler(mulberry32(seed));
  const aporteAnual = aporteMensual * 12;
  const totalAportado = inicial + aporteAnual * anios;

  const porAnio: number[][] = Array.from({ length: anios + 1 }, () => new Array<number>(simulaciones));
  let perdidas = 0;

  for (let s = 0; s < simulaciones; s++) {
    let valor = inicial;
    porAnio[0][s] = valor;
    for (let t = 1; t <= anios; t++) {
      const z = mu.map(() => normal());
      let r = 0;
      for (let i = 0; i < mu.length; i++) {
        let shock = 0;
        for (let k = 0; k <= i; k++) shock += L[i][k] * z[k];
        r += ws[i] * (mu[i] + shock);
      }
      // Weights are reset each year: the simulation assumes annual rebalancing.
      valor = Math.max(0, valor * (1 + Math.max(r, -1)) + aporteAnual);
      porAnio[t][s] = valor;
    }
    if (valor < totalAportado) perdidas++;
  }

  const p10: number[] = [];
  const p50: number[] = [];
  const p90: number[] = [];
  for (const valores of porAnio) {
    const ordenados = [...valores].sort((a, b) => a - b);
    p10.push(percentil(ordenados, 0.1));
    p50.push(percentil(ordenados, 0.5));
    p90.push(percentil(ordenados, 0.9));
  }

  return {
    anios: porAnio.map((_, i) => i),
    p10,
    p50,
    p90,
    probPerdida: simulaciones > 0 ? perdidas / simulaciones : 0,
  };
}

export type QuizOpcion = { texto: string; puntos: number };
export type QuizPregunta = { id: string; pregunta: string; opciones: readonly QuizOpcion[] };

export const RISK_QUIZ: readonly QuizPregunta[] = [
  {
    id: 'horizonte',
    pregunta: '¿En cuánto tiempo crees que necesitarás este dinero?',
    opciones: [
      { texto: 'En menos de 2 años', puntos: 0 },
      { texto: 'Entre 2 y 5 años', puntos: 1 },
      { texto: 'Entre 5 y 10 años', puntos: 2 },
      { texto: 'En más de 10 años', puntos: 3 },
    ],
  },
  {
    id: 'caida',
    pregunta: 'Tu inversión cae 20% en pocos meses. ¿Qué harías?',
    opciones: [
      { texto: 'Vendo todo para no perder más', puntos: 0 },
      { texto: 'Vendo una parte', puntos: 1 },
      { texto: 'No hago nada y espero', puntos: 2 },
      { texto: 'Aprovecho de invertir más', puntos: 3 },
    ],
  },
  {
    id: 'objetivo',
    pregunta: '¿Cuál es tu objetivo principal?',
    opciones: [
      { texto: 'Cuidar lo que tengo, aunque crezca poco', puntos: 0 },
      { texto: 'Crecer algo más que la inflación', puntos: 1 },
      { texto: 'Hacer crecer bastante mi dinero en el largo plazo', puntos: 3 },
    ],
  },
  {
    id: 'ingresos',
    pregunta: '¿Qué tan estables son tus ingresos?',
    opciones: [
      { texto: 'Inestables; podría necesitar este dinero ante una emergencia', puntos: 0 },
      { texto: 'Bastante estables, pero sin fondo de emergencia', puntos: 1 },
      { texto: 'Estables y ya tengo un fondo de emergencia', puntos: 3 },
    ],
  },
  {
    id: 'experiencia',
    pregunta: '¿Qué experiencia tienes invirtiendo?',
    opciones: [
      { texto: 'Ninguna', puntos: 0 },
      { texto: 'He tenido depósitos a plazo o fondos mutuos conservadores', puntos: 1 },
      { texto: 'He invertido en acciones, ETFs o fondos de renta variable', puntos: 3 },
    ],
  },
];

export type PerfilId = 'conservador' | 'moderado' | 'agresivo';
export type Perfil = { id: PerfilId; descripcion: string; weights: Weights };

const PERFILES: readonly (Perfil & { puntajeMaximo: number })[] = [
  {
    puntajeMaximo: 5,
    id: 'conservador',
    descripcion:
      'Priorizas la estabilidad. Aceptas un crecimiento menor a cambio de que el valor de tu portafolio se mueva poco.',
    weights: { rv: 0.2, rf: 0.6, caja: 0.2 },
  },
  {
    puntajeMaximo: 10,
    id: 'moderado',
    descripcion:
      'Buscas un equilibrio: algo de crecimiento con renta variable, amortiguado por una base de renta fija.',
    weights: { rv: 0.5, rf: 0.4, caja: 0.1 },
  },
  {
    puntajeMaximo: Number.POSITIVE_INFINITY,
    id: 'agresivo',
    descripcion:
      'Tienes un horizonte largo y toleras caídas fuertes en el camino a cambio de un mayor retorno esperado.',
    weights: { rv: 0.8, rf: 0.15, caja: 0.05 },
  },
];

export function riskProfile(score: number): Perfil {
  const { id, descripcion, weights } = PERFILES.find((p) => score <= p.puntajeMaximo)!;
  return { id, descripcion, weights };
}
