/**
 * Universal Language Resolver Utility for TakeUp Platform
 * Handles plain string API responses, JSON dual-language payloads, and offline fallbacks seamlessly.
 */

export interface DualLangObject {
  bn?: string;
  en?: string;
  [key: string]: any;
}

export const resolveBilingualText = (
  apiValue: string | DualLangObject | null | undefined,
  fallbackBn: string,
  fallbackEn: string,
  isBn: boolean
): string => {
  if (!apiValue) {
    return isBn ? fallbackBn : fallbackEn;
  }

  // 1. If API returned a direct object with { bn, en }
  if (typeof apiValue === 'object') {
    if (isBn) {
      return apiValue.bn || apiValue.en || fallbackBn;
    } else {
      return apiValue.en || apiValue.bn || fallbackEn;
    }
  }

  // 2. If API returned a string, check if it's a JSON payload like {"bn": "...", "en": "..."}
  if (typeof apiValue === 'string') {
    const trimmed = apiValue.trim();
    if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
      try {
        const parsed = JSON.parse(trimmed);
        if (parsed && (parsed.bn || parsed.en)) {
          if (isBn) {
            return parsed.bn || parsed.en || fallbackBn;
          } else {
            return parsed.en || parsed.bn || fallbackEn;
          }
        }
      } catch (e) {
        // Not JSON, continue to plain string handling
      }
    }

    // If plain string from backend (e.g. English title)
    if (!isBn) {
      return trimmed || fallbackEn;
    } else {
      // In Bangla mode, if API string is non-Bengali, prefer fallbackBn for rich display
      const hasBengaliChar = /[\u0980-\u09FF]/.test(trimmed);
      return hasBengaliChar ? trimmed : fallbackBn;
    }
  }

  return isBn ? fallbackBn : fallbackEn;
};
