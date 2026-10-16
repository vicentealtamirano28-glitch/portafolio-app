export type Indicador = { valor: number; fecha: string };
export type Indicadores = { uf: Indicador; dolar: Indicador; ipc: Indicador; tpm: Indicador };
export type Ipc12 = { valor: number; desde: string; hasta: string };

const API = 'https://mindicador.cl/api';
const TTL_MS = 6 * 60 * 60 * 1000;
const TIMEOUT_MS = 5000;
export const IPC_FALLBACK = 0.03;

const isRecord = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null;

function parseIndicador(v: unknown): Indicador | null {
  if (!isRecord(v) || typeof v.valor !== 'number' || !Number.isFinite(v.valor) || typeof v.fecha !== 'string') return null;
  return { valor: v.valor, fecha: v.fecha };
}

function parseIndicadores(v: unknown): Indicadores | null {
  if (!isRecord(v)) return null;
  const uf = parseIndicador(v.uf);
  const dolar = parseIndicador(v.dolar);
  const ipc = parseIndicador(v.ipc);
  const tpm = parseIndicador(v.tpm);
  return uf && dolar && ipc && tpm ? { uf, dolar, ipc, tpm } : null;
}

function parseIpc12(v: unknown): Ipc12 | null {
  if (!isRecord(v) || !Array.isArray(v.serie)) return null;
  const serie = v.serie.map(parseIndicador).filter((x): x is Indicador => x !== null);
  if (serie.length < 12) return null;
  const ultimos = [...serie].sort((a, b) => b.fecha.localeCompare(a.fecha)).slice(0, 12);
  const valor = ultimos.reduce((acc, m) => acc * (1 + m.valor / 100), 1) - 1;
  return { valor, desde: ultimos[11].fecha, hasta: ultimos[0].fecha };
}

async function fetchJson(url: string): Promise<unknown> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, { signal: ctrl.signal, headers: { Accept: 'application/json' } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

async function cached<T>(key: string, url: string, parse: (v: unknown) => T | null): Promise<T | null> {
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      const entry: unknown = JSON.parse(raw);
      if (isRecord(entry) && typeof entry.ts === 'number' && Date.now() - entry.ts < TTL_MS) {
        const data = parse(entry.data);
        if (data) return data;
      }
    }
  } catch {
    // Corrupt or inaccessible storage: fall through to the network.
  }
  try {
    const raw = await fetchJson(url);
    const data = parse(raw);
    if (!data) return null;
    try {
      localStorage.setItem(key, JSON.stringify({ ts: Date.now(), data }));
    } catch {
      // Storage full or blocked (private mode); the value is still usable.
    }
    return data;
  } catch {
    return null;
  }
}

export const getIndicadores = () => cached('portafolio:indicadores', API, parseIndicadores);
export const getIpc12 = () => cached('portafolio:ipc12', `${API}/ipc`, parseIpc12);
