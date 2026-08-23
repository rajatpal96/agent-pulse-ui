/**
 * API utility for TokenTrail (AgentMeter) UI.
 * Provides authenticated fetch wrappers to pass Bearer tokens automatically.
 */

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
  const headers = getAuthHeaders(init.headers);
  return fetch(input, {
    ...init,
    headers,
  });
}
