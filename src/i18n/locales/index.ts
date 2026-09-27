import { SupportedLanguageCode } from '../languages';
import { en } from './en';
import { hi } from './hi';
import { ta } from './ta';
import { te } from './te';
import { kn } from './kn';
import { ml } from './ml';
import { mr } from './mr';
import { bn } from './bn';
import { gu } from './gu';
import { pa } from './pa';
import { or } from './or';

export type TranslationDict = typeof en;

export const LOCALES: Record<SupportedLanguageCode, any> = {
  en,
  hi,
  ta,
  te,
  kn,
  ml,
  mr,
  bn,
  gu,
  pa,
  or
};

/**
 * Traverses nested object with dot-notation path like "nav.brand" or "overview.title"
 */
function getNestedValue(obj: any, path: string): string | undefined {
  if (!obj) return undefined;
  const parts = path.split('.');
  let current = obj;
  for (const part of parts) {
    if (current && typeof current === 'object' && part in current) {
      current = current[part];
    } else {
      return undefined;
    }
  }
  return typeof current === 'string' ? current : undefined;
}

/**
 * Resolves translation with fallback to English, replacing {param} variables
 */
export function resolveTranslation(
  lang: SupportedLanguageCode,
  keyPath: string,
  params?: Record<string, string | number>
): string {
  // 1. Try selected language
  let text = getNestedValue(LOCALES[lang], keyPath);

  // 2. Fallback to English if missing
  if (!text && lang !== 'en') {
    text = getNestedValue(LOCALES['en'], keyPath);
  }

  // 3. Last fallback: return the keyPath itself
  if (!text) {
    text = keyPath;
  }

  // 4. Interpolate {param} placeholders if params are provided
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      text = text.replace(new RegExp(`\\{${key}\\}`, 'g'), String(value));
    }
  }

  return text;
}
