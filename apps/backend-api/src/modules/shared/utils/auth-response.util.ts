import { fromNodeHeaders } from 'better-auth/node';
import { FastifyReply, FastifyRequest } from 'fastify';

function extractSetCookies(headers: Headers | undefined): string[] {
  if (!headers) {
    return [];
  }

  const raw =
    typeof (headers as any).raw === 'function'
      ? (headers as any).raw()
      : undefined;
  if (raw?.['set-cookie'] && Array.isArray(raw['set-cookie'])) {
    return raw['set-cookie'] as string[];
  }

  const getSetCookie = (headers as any).getSetCookie;
  if (typeof getSetCookie === 'function') {
    const cookies = getSetCookie.call(headers);
    if (Array.isArray(cookies)) {
      return cookies as string[];
    }
  }

  const single = headers.get('set-cookie');
  return single ? [single] : [];
}

export function forwardSetCookies(
  headers: Headers | undefined,
  reply: FastifyReply,
): void {
  const cookies = extractSetCookies(headers);
  if (!cookies.length) {
    return;
  }
  reply.header('set-cookie', cookies);
}

export function mergeRequestHeadersWithSetCookies(
  request: FastifyRequest,
  headers?: Headers,
): Headers {
  const baseHeaders = fromNodeHeaders(request.headers);
  if (!headers) {
    return baseHeaders;
  }

  const merged = new Headers(baseHeaders);
  const cookies = extractSetCookies(headers);
  if (!cookies.length) {
    return merged;
  }

  const serializedCookies = cookies
    .map((cookie) => cookie?.split(';')[0])
    .filter((cookie): cookie is string => Boolean(cookie));

  if (!serializedCookies.length) {
    return merged;
  }

  const existingCookies = merged.get('cookie');
  const combined = [existingCookies, serializedCookies.join('; ')]
    .filter(Boolean)
    .join('; ');
  merged.set('cookie', combined);
  return merged;
}

export function buildBetterAuthHeaders(
  request: FastifyRequest,
  extra?: Headers,
): Headers {
  if (extra) {
    return mergeRequestHeadersWithSetCookies(request, extra);
  }
  return fromNodeHeaders(request.headers);
}
