/**
 * API utility for TokenTrail (AgentMeter) UI.
 * Directly routes all API requests to api.tokentrail.xyz (NEXT_PUBLIC_API_BASE_URL)
 * and ingestion requests to ingest.tokentrail.xyz (NEXT_PUBLIC_INGEST_BASE_URL)
 * instead of proxying through www, and attaches Bearer token automatically.
 */

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.tokentrail.xyz';
export const INGEST_BASE_URL =
  process.env.NEXT_PUBLIC_INGEST_BASE_URL || 'https://ingest.tokentrail.xyz';

/**
 * Resolves a given endpoint path to the full target API URL on `api.` or `ingest.`
 */
export function resolveApiUrl(path: string): string {
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  const cleanApiBase = API_BASE_URL.replace(/\/+$/, '');
  const cleanIngestBase = INGEST_BASE_URL.replace(/\/+$/, '');

  // Handle /ingest/v1/...
  if (path.startsWith('/ingest/v1/')) {
    const cleanPath = path.replace(/^\/ingest/, '');
    return `${cleanIngestBase}${cleanPath}`;
  }
  if (path.startsWith('ingest/v1/')) {
    const cleanPath = path.replace(/^ingest/, '');
    return `${cleanIngestBase}/${cleanPath.replace(/^\/+/, '')}`;
  }

  // Handle /api/v1/... -> https://api.tokentrail.xyz/v1/...
  if (path.startsWith('/api/v1/')) {
    const cleanPath = path.replace(/^\/api/, '');
    return `${cleanApiBase}${cleanPath}`;
  }
  if (path.startsWith('api/v1/')) {
    const cleanPath = path.replace(/^api/, '');
    return `${cleanApiBase}/${cleanPath.replace(/^\/+/, '')}`;
  }

  // Handle direct /v1/...
  if (path.startsWith('/v1/')) {
    return `${cleanApiBase}${path}`;
  }

  if (path.startsWith('/')) {
    return `${cleanApiBase}${path}`;
  }

  return `${cleanApiBase}/${path}`;
}

export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return (
    localStorage.getItem('tokentrail_token') ||
    localStorage.getItem('agentmeter_token') ||
    localStorage.getItem('token') ||
    null
  );
}

export function getAuthHeaders(extraHeaders: HeadersInit = {}): Headers {
  const headers = new Headers(extraHeaders);
  const token = getAuthToken();
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  return headers;
}

export async function apiFetch(input: RequestInfo | URL, init: RequestInit = {}): Promise<Response> {
  const url = typeof input === 'string' ? resolveApiUrl(input) : input;
  const headers = getAuthHeaders(init.headers);
  return fetch(url, {
    ...init,
    headers,
  });
}
