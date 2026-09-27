export type SupportedLanguageCode =
  | 'en' // English
  | 'hi' // हिन्दी — Hindi
  | 'ta' // தமிழ் — Tamil
  | 'te' // తెలుగు — Telugu
  | 'kn' // ಕನ್ನಡ — Kannada
  | 'ml' // മലയാളം — Malayalam
  | 'mr' // मराठी — Marathi
  | 'bn' // বাংলা — Bengali
  | 'gu' // ગુજરાતી — Gujarati
  | 'pa' // ਪੰਜਾਬੀ — Punjabi
  | 'or'; // ଓଡ଼ିଆ — Odia

export interface LanguageInfo {
  code: SupportedLanguageCode;
  name: string; // Native name
  englishName: string;
  script: string;
  bcp47: string; // e.g. hi-IN for speech APIs
  bhashiniCode: string;
  direction: 'ltr' | 'rtl';
}

export const SUPPORTED_LANGUAGES: LanguageInfo[] = [
  {
    code: 'en',
    name: 'English',
    englishName: 'English',
    script: 'Latin',
    bcp47: 'en-IN',
    bhashiniCode: 'en',
    direction: 'ltr'
  },
  {
    code: 'hi',
    name: 'हिन्दी',
    englishName: 'Hindi',
    script: 'Devanagari',
    bcp47: 'hi-IN',
    bhashiniCode: 'hi',
    direction: 'ltr'
  },
  {
    code: 'ta',
    name: 'தமிழ்',
    englishName: 'Tamil',
    script: 'Tamil',
    bcp47: 'ta-IN',
    bhashiniCode: 'ta',
    direction: 'ltr'
  },
  {
    code: 'te',
    name: 'తెలుగు',
    englishName: 'Telugu',
    script: 'Telugu',
    bcp47: 'te-IN',
    bhashiniCode: 'te',
    direction: 'ltr'
  },
  {
    code: 'kn',
    name: 'ಕನ್ನಡ',
    englishName: 'Kannada',
    script: 'Kannada',
    bcp47: 'kn-IN',
    bhashiniCode: 'kn',
    direction: 'ltr'
  },
  {
    code: 'ml',
    name: 'മലയാളം',
    englishName: 'Malayalam',
    script: 'Malayalam',
    bcp47: 'ml-IN',
    bhashiniCode: 'ml',
    direction: 'ltr'
  },
  {
    code: 'mr',
    name: 'मराठी',
    englishName: 'Marathi',
    script: 'Devanagari',
    bcp47: 'mr-IN',
    bhashiniCode: 'mr',
    direction: 'ltr'
  },
  {
    code: 'bn',
    name: 'বাংলা',
    englishName: 'Bengali',
    script: 'Bengali',
    bcp47: 'bn-IN',
    bhashiniCode: 'bn',
    direction: 'ltr'
  },
  {
    code: 'gu',
    name: 'ગુજરાતી',
    englishName: 'Gujarati',
    script: 'Gujarati',
    bcp47: 'gu-IN',
    bhashiniCode: 'gu',
    direction: 'ltr'
  },
  {
    code: 'pa',
    name: 'ਪੰਜਾਬੀ',
    englishName: 'Punjabi',
    script: 'Gurmukhi',
    bcp47: 'pa-IN',
    bhashiniCode: 'pa',
    direction: 'ltr'
  },
  {
    code: 'or',
    name: 'ଓଡ଼ିଆ',
    englishName: 'Odia',
    script: 'Odia',
    bcp47: 'or-IN',
    bhashiniCode: 'or',
    direction: 'ltr'
  }
];

export const DEFAULT_LANGUAGE: SupportedLanguageCode = 'en';

export function getLanguageInfo(code: SupportedLanguageCode): LanguageInfo {
  return SUPPORTED_LANGUAGES.find(l => l.code === code) || SUPPORTED_LANGUAGES[0];
}
