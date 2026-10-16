const NS = 'http://www.w3.org/2000/svg';

// SVG presentation attributes don't resolve CSS custom properties, so the palette is duplicated here.
export const COLOR = {
  ink: '#1F1B16',
  inkSoft: '#4A4238',
  accent: '#1F5F4A',
  ochre: '#B7791F',
  accentBand: 'rgb(31 95 74 / 0.18)',
  ochreBand: 'rgb(183 121 31 / 0.25)',
  paper: '#F6F1E7',
} as const;

type Attrs = Record<string, string | number>;

export function el<K extends keyof SVGElementTagNameMap>(tag: K, attrs: Attrs = {}, text?: string): SVGElementTagNameMap[K] {
  const node = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, String(v));
  if (text !== undefined) node.textContent = text;
  return node;
}

export function linear(d0: number, d1: number, r0: number, r1: number): (v: number) => number {
  const span = d1 - d0 || 1;
  return (v) => r0 + ((v - d0) / span) * (r1 - r0);
}

export function path(points: readonly (readonly [number, number])[]): string {
  return points.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
}

export function niceMax(v: number): number {
  if (v <= 0) return 1;
  const mag = 10 ** Math.floor(Math.log10(v));
  const step = [1, 2, 2.5, 5, 10].find((s) => s * mag >= v) ?? 10;
  return step * mag;
}

export type Chart = { svg: SVGSVGElement; width: number; height: number; pad: { t: number; r: number; b: number; l: number } };

export function chart(container: Element, maxWidth: number, height: number, pad = { t: 16, r: 16, b: 32, l: 64 }): Chart {
  // Match the viewBox to the rendered width so tick labels stay legible on narrow screens instead of scaling down.
  const width = Math.min(maxWidth, Math.max(300, Math.round(container.clientWidth) || maxWidth));
  container.replaceChildren();
  const svg = el('svg', { viewBox: `0 0 ${width} ${height}`, class: 'chart-svg', 'aria-hidden': 'true', focusable: 'false' });
  container.append(svg);
  return { svg, width, height, pad };
}

export function yAxis(c: Chart, max: number, y: (v: number) => number, fmt: (v: number) => string, ticks = 4): void {
  for (let i = 0; i <= ticks; i++) {
    const v = (max / ticks) * i;
    const yy = y(v);
    c.svg.append(
      el('line', { x1: c.pad.l, x2: c.width - c.pad.r, y1: yy, y2: yy, class: 'grid' }),
      el('text', { x: c.pad.l - 8, y: yy + 4, 'text-anchor': 'end', class: 'tick' }, fmt(v)),
    );
  }
}

export function xAxisYears(c: Chart, anios: number, x: (v: number) => number): void {
  const step = anios <= 10 ? 1 : anios <= 20 ? 5 : 10;
  for (let a = 0; a <= anios; a += step) {
    c.svg.append(el('text', { x: x(a), y: c.height - c.pad.b + 18, 'text-anchor': 'middle', class: 'tick' }, String(a)));
  }
  c.svg.append(
    el('text', { x: c.width - c.pad.r, y: c.height - 2, 'text-anchor': 'end', class: 'tick' }, 'años'),
  );
}
