/**
 * Utility functions for URL validation, normalization, and display formatting.
 */

export function normalizeUrl(rawUrl) {
  if (!rawUrl || typeof rawUrl !== 'string') return '';
  const trimmed = rawUrl.trim();
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  return `https://${trimmed}`;
}

export function isValidUrl(url) {
  if (!url || typeof url !== 'string') return false;
  try {
    const normalized = normalizeUrl(url);
    const parsed = new URL(normalized);
    // Allow http only on localhost / 127.0.0.1
    if (parsed.protocol === 'http:') {
      return parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1';
    }
    return parsed.protocol === 'https:' && Boolean(parsed.hostname);
  } catch {
    return false;
  }
}

export function formatDisplayDomain(url) {
  if (!url) return '';
  try {
    const normalized = normalizeUrl(url);
    const parsed = new URL(normalized);
    return parsed.hostname.replace(/^www\./i, '');
  } catch {
    return url;
  }
}
