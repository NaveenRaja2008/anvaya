'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Globe, Check, ChevronDown, Sparkles } from 'lucide-react';
import { useTranslation } from '../../i18n/context';
import { SUPPORTED_LANGUAGES, SupportedLanguageCode } from '../../i18n/languages';

export const LanguageSelector: React.FC = () => {
  const {
    language,
    languageInfo,
    setLanguage,
    aiLanguagePreference,
    setAiLanguagePreference,
    t
  } = useTranslation();

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectLanguage = (code: SupportedLanguageCode) => {
    setLanguage(code);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Highly visible trigger button */}
      <button
        type="button"
        id="anvaya-language-selector-btn"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 rounded-lg border border-emerald-300 bg-emerald-50/90 px-3 py-1.5 text-xs font-bold text-emerald-900 shadow-xs transition-all hover:bg-emerald-100 hover:border-emerald-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/50 dark:border-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-200 dark:hover:bg-emerald-900/80"
        aria-haspopup="true"
        aria-expanded={isOpen}
        title="Change application language (11 Indian languages supported)"
      >
        <Globe className="h-4 w-4 text-emerald-700 dark:text-emerald-400 animate-pulse" />
        <span className="font-semibold">{languageInfo.name}</span>
        <ChevronDown className={`h-3.5 w-3.5 text-emerald-700 dark:text-emerald-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 origin-top-right rounded-xl border border-slate-200 bg-white p-2 shadow-2xl ring-1 ring-black/5 z-50 dark:border-slate-800 dark:bg-slate-900 animate-in fade-in zoom-in-95 duration-100">
          <div className="border-b border-slate-100 px-3 py-2 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                {t('nav.language')}: 11 Indian Languages
              </span>
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                {languageInfo.name}
              </span>
            </div>
            <p className="mt-0.5 text-[10px] text-slate-500 dark:text-slate-400">
              Numbers, amounts (₹) & financial calculations remain constant.
            </p>
          </div>

          {/* Language Options Grid */}
          <div className="max-h-72 overflow-y-auto py-1.5 space-y-0.5">
            {SUPPORTED_LANGUAGES.map((lang) => {
              const isSelected = lang.code === language;
              return (
                <button
                  key={lang.code}
                  id={`lang-opt-${lang.code}`}
                  onClick={() => handleSelectLanguage(lang.code)}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-xs font-medium transition-colors ${
                    isSelected
                      ? 'bg-emerald-50 text-emerald-900 font-bold dark:bg-emerald-950/80 dark:text-emerald-200'
                      : 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-sm font-semibold">{lang.name}</span>
                    <span className="text-[11px] text-slate-400 dark:text-slate-500">
                      ({lang.englishName})
                    </span>
                  </div>
                  {isSelected && (
                    <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  )}
                </button>
              );
            })}
          </div>

          {/* AI Language Preference Setting */}
          <div className="border-t border-slate-100 mt-1 pt-2 px-2 dark:border-slate-800">
            <div className="flex items-center gap-1.5 mb-1.5 text-[11px] font-semibold text-slate-700 dark:text-slate-300">
              <Sparkles className="h-3 w-3 text-amber-500" />
              <span>AI Response Language:</span>
            </div>
            <div className="grid grid-cols-2 gap-1 text-[10px]">
              <button
                type="button"
                onClick={() => setAiLanguagePreference('same_as_interface')}
                className={`rounded px-2 py-1 text-center font-medium transition-colors ${
                  aiLanguagePreference === 'same_as_interface'
                    ? 'bg-emerald-700 text-white font-bold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                }`}
              >
                Same as Interface
              </button>
              <button
                type="button"
                onClick={() => setAiLanguagePreference('auto_detect')}
                className={`rounded px-2 py-1 text-center font-medium transition-colors ${
                  aiLanguagePreference === 'auto_detect'
                    ? 'bg-emerald-700 text-white font-bold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                }`}
              >
                Detect Automatically
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
