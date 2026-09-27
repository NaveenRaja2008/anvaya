'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { SupportedLanguageCode, SUPPORTED_LANGUAGES, LanguageInfo } from './languages';
import { resolveTranslation } from './locales';
import { EVIDENCE_TYPE_LABELS, DOMAIN_TERMINOLOGY } from './terminology';
import { EvidenceType } from '../types/domain';
import { defaultSTTProvider, defaultTTSProvider } from '../providers/speech-provider';

export type AiLanguagePreference = 'same_as_interface' | 'auto_detect';

interface I18nContextType {
  language: SupportedLanguageCode;
  languageInfo: LanguageInfo;
  setLanguage: (lang: SupportedLanguageCode) => void;
  aiLanguagePreference: AiLanguagePreference;
  setAiLanguagePreference: (pref: AiLanguagePreference) => void;
  t: (keyPath: string, params?: Record<string, string | number>) => string;
  getEvidenceLabel: (type: EvidenceType) => string;
  getDomainTerm: (key: string) => string;
  // Voice & Speech
  isSTTSupported: boolean;
  isTTSSupported: boolean;
  isListening: boolean;
  isSpeaking: boolean;
  startListening: (onResult: (text: string, isFinal: boolean) => void, onError?: (err: string) => void) => void;
  stopListening: () => void;
  speak: (text: string) => void;
  stopSpeaking: () => void;
}

const I18nContext = createContext<I18nContextType | null>(null);

const STORAGE_KEY = 'anvaya_preferred_language';
const AI_PREF_KEY = 'anvaya_ai_language_pref';

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<SupportedLanguageCode>('en');
  const [aiLanguagePreference, setAiLanguagePreferenceState] =
    useState<AiLanguagePreference>('same_as_interface');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSTTSupported, setIsSTTSupported] = useState(false);
  const [isTTSSupported, setIsTTSSupported] = useState(false);

  // Initialize language from localStorage or browser preferences
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsSTTSupported(defaultSTTProvider.isSupported());
      setIsTTSSupported(defaultTTSProvider.isSupported());

      const savedLang = localStorage.getItem(STORAGE_KEY) as SupportedLanguageCode;
      if (savedLang && SUPPORTED_LANGUAGES.some((l) => l.code === savedLang)) {
        setLanguageState(savedLang);
      } else if (navigator.language) {
        // Detect browser language if it matches an Indian language
        const prefix = navigator.language.slice(0, 2).toLowerCase();
        const matched = SUPPORTED_LANGUAGES.find((l) => l.code === prefix);
        if (matched) {
          setLanguageState(matched.code);
        }
      }

      const savedAiPref = localStorage.getItem(AI_PREF_KEY) as AiLanguagePreference;
      if (savedAiPref === 'same_as_interface' || savedAiPref === 'auto_detect') {
        setAiLanguagePreferenceState(savedAiPref);
      }
    }
  }, []);

  const setLanguage = useCallback((newLang: SupportedLanguageCode) => {
    setLanguageState(newLang);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, newLang);
    }
  }, []);

  const setAiLanguagePreference = useCallback((pref: AiLanguagePreference) => {
    setAiLanguagePreferenceState(pref);
    if (typeof window !== 'undefined') {
      localStorage.setItem(AI_PREF_KEY, pref);
    }
  }, []);

  // Translation resolver
  const t = useCallback(
    (keyPath: string, params?: Record<string, string | number>): string => {
      return resolveTranslation(language, keyPath, params);
    },
    [language]
  );

  // Localized evidence label
  const getEvidenceLabel = useCallback(
    (type: EvidenceType): string => {
      const labels = EVIDENCE_TYPE_LABELS[type];
      if (!labels) return type;
      return labels[language] || labels.en || type;
    },
    [language]
  );

  // Localized domain terminology
  const getDomainTerm = useCallback(
    (key: string): string => {
      const term = DOMAIN_TERMINOLOGY[key];
      if (!term) return key;
      return term.translations[language] || term.translations.en || term.english;
    },
    [language]
  );

  // Speech to text
  const startListening = useCallback(
    (onResult: (text: string, isFinal: boolean) => void, onError?: (err: string) => void) => {
      if (!defaultSTTProvider.isSupported()) {
        if (onError) onError(t('assistant.voiceNotSupported'));
        return;
      }

      setIsListening(true);
      defaultSTTProvider.startListening({
        language,
        onResult: (text, isFinal) => {
          onResult(text, isFinal);
        },
        onError: (err) => {
          setIsListening(false);
          if (onError) onError(err);
        },
        onEnd: () => {
          setIsListening(false);
        }
      });
    },
    [language, t]
  );

  const stopListening = useCallback(() => {
    defaultSTTProvider.stopListening();
    setIsListening(false);
  }, []);

  // Text to speech
  const speak = useCallback(
    (text: string) => {
      if (!defaultTTSProvider.isSupported()) return;

      setIsSpeaking(true);
      defaultTTSProvider.speak(text, {
        language,
        onStart: () => setIsSpeaking(true),
        onEnd: () => setIsSpeaking(false),
        onError: () => setIsSpeaking(false)
      });
    },
    [language]
  );

  const stopSpeaking = useCallback(() => {
    defaultTTSProvider.cancel();
    setIsSpeaking(false);
  }, []);

  const languageInfo =
    SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];

  return (
    <I18nContext.Provider
      value={{
        language,
        languageInfo,
        setLanguage,
        aiLanguagePreference,
        setAiLanguagePreference,
        t,
        getEvidenceLabel,
        getDomainTerm,
        isSTTSupported,
        isTTSSupported,
        isListening,
        isSpeaking,
        startListening,
        stopListening,
        speak,
        stopSpeaking
      }}
    >
      {children}
    </I18nContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useTranslation must be used within an I18nProvider');
  }
  return context;
}
