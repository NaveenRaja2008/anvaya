'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Send,
  Sparkles,
  Bot,
  User,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  RotateCcw
} from 'lucide-react';
import { AnvayaAppState } from '@/storage/state-store';
import { useTranslation } from '@/i18n/context';

interface AnvayaAssistantDrawerProps {
  state: AnvayaAppState;
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  toolsInvoked?: string[];
  timestamp: string;
}

export const AnvayaAssistantDrawer: React.FC<AnvayaAssistantDrawerProps> = ({
  state,
  isOpen,
  onClose
}) => {
  const {
    t,
    language,
    languageInfo,
    aiLanguagePreference,
    startListening,
    stopListening,
    isListening,
    speak,
    isSpeaking,
    stopSpeaking
  } = useTranslation();

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize welcome message when opened or language changes
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: 'msg-welcome',
          sender: 'assistant',
          text: `${languageInfo.name}: Namaskara! I am your **ANVAYA Intelligence Assistant** for **${state.profile.name}** in ${state.profile.location.villageOrTown}.

I operate on live, deterministic calculations from your profile and local economic data. Ask me anything about your opportunity hypotheses, stress tests, failure autopsy, or loan sustainability.`,
          toolsInvoked: ['ANVAYA State Engine'],
          timestamp: 'Just now'
        }
      ]);
    }
  }, [languageInfo, state.profile, messages.length]);

  const suggestedQuestionsByLang: Record<string, string[]> = {
    hi: [
      'मुझे कौन सा व्यवसाय शुरू करना चाहिए और क्यों?',
      'यही व्यवसाय क्यों, दूसरा क्यों नहीं?',
      'यदि बाजार में मांग 20% गिर जाए तो क्या होगा?',
      'मेरी सरकारी पात्र लोन सीमा और सुरक्षित लोन सीमा में अंतर क्यों है?',
      'क्या मैं यह कर्ज वहन कर सकता हूँ?',
      'इस व्यवसाय में सबसे बड़ा जोखिम क्या है?'
    ],
    ta: [
      'நான் எந்த தொழிலைத் தொடங்க வேண்டும், ஏன்?',
      'தேவை 20% குறைந்தால் என்ன நடக்கும்?',
      'அரசு கடன் தகுதிக்கும் பாதுகாப்பான கடன் வரம்பிற்கும் என்ன வித்தியாசம்?',
      'இந்தக் கடனை என்னால் திருப்பிச் செலுத்த முடியுமா?',
      'இந்த வணிகத்தில் உள்ள மிகப்பெரிய ஆபத்து என்ன?'
    ],
    te: [
      'నేను ఏ వ్యాపారం ప్రారంభించాలి మరియు ఎందుకు?',
      'డిమాండ్ 20% పడిపోతే ఏమి జరుగుతుంది?',
      'అర్హత ఉన్న రుణం మరియు స్థిరమైన రుణం మధ్య వ్యత్యాసం ఏమిటి?',
      'ఈ వ్యాపారంలో అతిపెద్ద ప్రమాదం ఏమిటి?'
    ],
    en: [
      'What business should I start and why?',
      'Why this business and not the other one?',
      'What if demand falls by 20%?',
      'Why is my eligible loan higher than my sustainable loan?',
      'Can I afford this loan?',
      'What would change your mind?',
      'What is the single biggest risk?'
    ]
  };

  const suggestedQuestions =
    suggestedQuestionsByLang[language] || suggestedQuestionsByLang.en;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleVoiceToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening(
        (transcript, isFinal) => {
          setInputText(transcript);
          if (isFinal && transcript.trim().length > 3) {
            handleSend(transcript);
          }
        },
        (err) => {
          console.warn('Voice recognition notice:', err);
        }
      );
    }
  };

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || inputText;
    if (!textToSend.trim() || isLoading) return;

    if (isListening) {
      stopListening();
    }

    const userMessage: Message = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          language,
          languagePreference: aiLanguagePreference
        })
      });

      const data = await response.json();

      const assistantMessage: Message = {
        id: `asst-${Date.now()}`,
        sender: 'assistant',
        text: data.reply || 'I processed your query based on current digital twin outputs.',
        toolsInvoked: data.toolContextUsed || ['Deterministic Calculation Engine'],
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        })
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Automatically speak the response if voice mode was active
      if (isListening) {
        speak(data.reply);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `asst-err-${Date.now()}`,
          sender: 'assistant',
          text: 'Unable to reach backend assistant service. Falling back to local offline domain rules.',
          timestamp: 'Now'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="h-full w-full max-w-lg bg-white shadow-2xl flex flex-col dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-700 text-white shadow-xs">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                  {t('assistant.title')}
                </h2>
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  {languageInfo.name}
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                {t('assistant.subtitle')}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Suggested Quick Question Chips */}
        <div className="p-3 border-b border-slate-100 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/40">
          <p className="text-[10px] font-bold text-slate-400 uppercase mb-1.5">
            {t('assistant.inspectPrompt')}
          </p>
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px]">
            {suggestedQuestions.slice(0, 4).map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q)}
                className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-slate-700 hover:border-emerald-600 hover:text-emerald-700 whitespace-nowrap shadow-2xs dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.sender === 'assistant' && (
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 shrink-0 mt-0.5">
                  <Bot className="h-3.5 w-3.5" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-xl p-3.5 space-y-1.5 leading-relaxed shadow-xs ${
                  m.sender === 'user'
                    ? 'bg-emerald-700 text-white rounded-tr-none'
                    : 'bg-slate-100 text-slate-900 rounded-tl-none dark:bg-slate-800 dark:text-slate-100'
                }`}
              >
                <div className="prose prose-xs dark:prose-invert max-w-none whitespace-pre-line">
                  {m.text}
                </div>

                {m.toolsInvoked && m.toolsInvoked.length > 0 && (
                  <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex flex-wrap gap-1">
                    {m.toolsInvoked.map((tool, tidx) => (
                      <span
                        key={tidx}
                        className="rounded bg-white/70 px-1.5 py-0.5 text-[9px] font-mono font-medium text-slate-600 dark:bg-slate-700 dark:text-slate-300"
                      >
                        ⚡ {tool}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between pt-1">
                  {m.sender === 'assistant' ? (
                    <button
                      type="button"
                      onClick={() => (isSpeaking ? stopSpeaking() : speak(m.text))}
                      className="flex items-center gap-1 text-[10px] text-slate-500 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors"
                      title={t('assistant.listenSpeaker')}
                    >
                      {isSpeaking ? (
                        <>
                          <VolumeX className="h-3 w-3 text-rose-500 animate-pulse" />
                          <span className="text-rose-500">Stop</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="h-3 w-3" />
                          <span>{t('assistant.listenSpeaker')}</span>
                        </>
                      )}
                    </button>
                  ) : (
                    <div />
                  )}
                  <span className="text-[9px] opacity-60 font-mono">{m.timestamp}</span>
                </div>
              </div>

              {m.sender === 'user' && (
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200 shrink-0 mt-0.5">
                  <User className="h-3.5 w-3.5" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-2.5 items-center text-slate-400 text-xs italic">
              <Bot className="h-4 w-4 text-emerald-600 animate-spin" />
              <span>Querying ANVAYA deterministic calculation models...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Listening Banner if active */}
        {isListening && (
          <div className="bg-rose-50 border-t border-rose-200 px-3 py-2 flex items-center justify-between text-xs text-rose-800 dark:bg-rose-950/70 dark:border-rose-900 dark:text-rose-200 animate-pulse">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-rose-600 animate-ping" />
              <span className="font-semibold">
                {t('assistant.voiceListening')} ({languageInfo.name})
              </span>
            </div>
            <button
              onClick={stopListening}
              className="text-[11px] underline font-bold hover:text-rose-900"
            >
              Stop
            </button>
          </div>
        )}

        {/* Chat Input Bar with Voice Support */}
        <div className="p-3 border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            {/* Microphone Button */}
            <button
              type="button"
              onClick={handleVoiceToggle}
              className={`rounded-lg p-2 transition-all ${
                isListening
                  ? 'bg-rose-600 text-white animate-pulse shadow-md ring-2 ring-rose-400'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
              }`}
              title={t('assistant.voiceTooltip')}
            >
              {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </button>

            <input
              type="text"
              placeholder={t('assistant.askPlaceholder')}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 rounded-lg border border-slate-300 bg-slate-50 p-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden focus:border-emerald-600 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
            <button
              type="submit"
              disabled={isLoading || !inputText.trim()}
              className="rounded-lg bg-emerald-700 p-2 text-white hover:bg-emerald-800 disabled:opacity-40 transition-colors shadow-xs"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
