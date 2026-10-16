const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');

export function url(path: string): string {
  return `${BASE}${path}`;
}

export function sinBase(pathname: string): string {
  return pathname.startsWith(BASE) ? pathname.slice(BASE.length) || '/' : pathname;
}
