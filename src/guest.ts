export const PREFIXES = ['Mr.', 'Mrs.', 'Miss', 'Mr. & Mrs.', 'Family', 'Dear'] as const;
export type Prefix = (typeof PREFIXES)[number];

// "Dear" is a greeting style, not part of the name: the message already starts with "Dear"
export function buildDisplayName(prefix: Prefix, name: string) {
  const n = name.trim().replace(/\s+/g, ' ');
  if (!n) return '';
  switch (prefix) {
    case 'Family':
      return `${n} and Family`;
    case 'Dear':
      return n;
    default:
      return `${prefix} ${n}`;
  }
}

// Dots are encoded too so paths like "/Mr. Sanjaya" are never mistaken for a file
export function guestLink(baseUrl: string, displayName: string) {
  const slug = encodeURIComponent(displayName).replace(/\./g, '%2E');
  return `${baseUrl.replace(/\/+$/, '')}/${slug}`;
}

// Reads the guest from "/{name}" or the older "?guest={name}" form
export function readGuestFromUrl(): string {
  try {
    const fromQuery = new URLSearchParams(window.location.search).get('guest');
    if (fromQuery) return fromQuery.trim().slice(0, 80);
    const segment = window.location.pathname.split('/').filter(Boolean)[0] ?? '';
    if (!segment || segment.toLowerCase() === 'admin' || segment === 'index.html') return '';
    return decodeURIComponent(segment).replace(/\s+/g, ' ').trim().slice(0, 80);
  } catch {
    return '';
  }
}
