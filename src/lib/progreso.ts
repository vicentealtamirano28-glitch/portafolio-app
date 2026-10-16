const KEY = 'portafolio:progreso';

export function leerProgreso(): string[] {
  try {
    const v: unknown = JSON.parse(localStorage.getItem(KEY) ?? '[]');
    return Array.isArray(v) ? v.filter((s): s is string => typeof s === 'string') : [];
  } catch {
    return [];
  }
}

export function marcarCompletada(slug: string): void {
  const actual = leerProgreso();
  if (actual.includes(slug)) return;
  try {
    localStorage.setItem(KEY, JSON.stringify([...actual, slug]));
  } catch {
    // Storage unavailable: progress simply won't persist.
  }
}
