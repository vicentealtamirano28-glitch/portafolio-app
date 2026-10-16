const clp = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 });
const pct = new Intl.NumberFormat('es-CL', { style: 'percent', minimumFractionDigits: 1, maximumFractionDigits: 1 });
const num = new Intl.NumberFormat('es-CL', { maximumFractionDigits: 2 });

export const formatCLP = (v: number) => clp.format(v);
export const formatPct = (v: number) => pct.format(v);
export const formatNum = (v: number) => num.format(v);

export function formatCompactCLP(v: number): string {
  const abs = Math.abs(v);
  if (abs >= 1e9) return `$${num.format(v / 1e9)} mil M`;
  if (abs >= 1e6) return `$${num.format(v / 1e6)} M`;
  if (abs >= 1e3) return `$${num.format(Math.round(v / 1e3))} mil`;
  return clp.format(v);
}

export function formatMes(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('es-CL', { month: 'short', year: 'numeric', timeZone: 'UTC' });
}

export function formatFecha(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('es-CL', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
}
