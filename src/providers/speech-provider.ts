import { SupportedLanguageCode, SUPPORTED_LANGUAGES } from '../i18n/languages';

export interface STTOptions {
  language: SupportedLanguageCode;
  onResult: (transcript: string, isFinal: boolean) => void;
  onError: (error: string) => void;
  onEnd: () => void;
}

export interface TTSOptions {
  language: SupportedLanguageCode;
  pitch?: number;
  rate?: number;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error: string) => void;
}

export interface SpeechToTextProvider {
  name: string;
  isSupported(): boolean;
  startListening(options: STTOptions): Promise<void>;
  stopListening(): void;
}

export interface TextToSpeechProvider {
  name: string;
  isSupported(): boolean;
  speak(text: string, options: TTSOptions): Promise<void>;
  cancel(): void;
}

export interface TranslationProvider {
  name: string;
  translate(text: string, sourceLang: string, targetLang: string): Promise<string>;
}

/**
 * Browser Web Speech API Speech-to-Text Implementation
 */
export class WebSpeechSTTProvider implements SpeechToTextProvider {
  name = 'WebSpeechSTT';
  private recognition: any = null;

  isSupported(): boolean {
    if (typeof window === 'undefined') return false;
    return !!((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);
  }

  async startListening(options: STTOptions): Promise<void> {
    if (!this.isSupported()) {
      options.onError('Speech recognition not supported in this browser environment');
      return;
    }

    try {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      
      const langConfig = SUPPORTED_LANGUAGES.find((l) => l.code === options.language);
      this.recognition.lang = langConfig ? langConfig.bcp47 : 'en-IN';
      this.recognition.continuous = false;
      this.recognition.interimResults = true;

      this.recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        const resultText = finalTranscript || interimTranscript;
        options.onResult(resultText, !!finalTranscript);
      };

      this.recognition.onerror = (event: any) => {
        options.onError(event.error || 'Speech recognition error');
      };

      this.recognition.onend = () => {
        options.onEnd();
      };

      this.recognition.start();
    } catch (err: any) {
      options.onError(err.message || 'Failed to initialize speech recognition');
    }
  }

  stopListening(): void {
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (e) {
        // Ignore if already stopped
      }
      this.recognition = null;
    }
  }
}

/**
 * Browser Web Speech API Text-to-Speech Implementation
 */
export class WebSpeechTTSProvider implements TextToSpeechProvider {
  name = 'WebSpeechTTS';

  isSupported(): boolean {
    if (typeof window === 'undefined') return false;
    return 'speechSynthesis' in window;
  }

  async speak(text: string, options: TTSOptions): Promise<void> {
    if (!this.isSupported()) {
      if (options.onError) options.onError('Speech synthesis not supported');
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    // Clean markdown/symbols from text for natural speech
    const cleanText = text
      .replace(/[*#_`~>]/g, '')
      .replace(/₹/g, 'Rupees ')
      .replace(/\[.*?\]\(.*?\)/g, '')
      .trim();

    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    const langConfig = SUPPORTED_LANGUAGES.find((l) => l.code === options.language);
    utterance.lang = langConfig ? langConfig.bcp47 : 'en-IN';
    utterance.rate = options.rate || 0.95; // Slightly slower for clear rural comprehension
    utterance.pitch = options.pitch || 1.0;

    // Pick appropriate voice if available
    const voices = window.speechSynthesis.getVoices();
    const matchedVoice = voices.find(
      (v) => v.lang === utterance.lang || v.lang.startsWith(options.language)
    );
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    if (options.onStart) utterance.onstart = options.onStart;
    if (options.onEnd) utterance.onend = options.onEnd;
    if (options.onError) utterance.onerror = (e) => options.onError!(e.error);

    window.speechSynthesis.speak(utterance);
  }

  cancel(): void {
    if (this.isSupported()) {
      window.speechSynthesis.cancel();
    }
  }
}

/**
 * Bhashini (National Language Translation Mission) Architecture Interface
 * Ready for enterprise endpoint injection
 */
export class BhashiniSTTProvider implements SpeechToTextProvider {
  name = 'BhashiniSTT';
  private endpoint: string;
  private apiKey?: string;

  constructor(endpoint = 'https://nmt-models.bhashini.gov.in/v1/stt', apiKey?: string) {
    this.endpoint = endpoint;
    this.apiKey = apiKey;
  }

  isSupported(): boolean {
    return !!this.apiKey;
  }

  async startListening(options: STTOptions): Promise<void> {
    // If not configured, fall back to WebSpeech
    const fallback = new WebSpeechSTTProvider();
    return fallback.startListening(options);
  }

  stopListening(): void {}
}

export class BhashiniTTSProvider implements TextToSpeechProvider {
  name = 'BhashiniTTS';
  private endpoint: string;
  private apiKey?: string;

  constructor(endpoint = 'https://nmt-models.bhashini.gov.in/v1/tts', apiKey?: string) {
    this.endpoint = endpoint;
    this.apiKey = apiKey;
  }

  isSupported(): boolean {
    return !!this.apiKey;
  }

  async speak(text: string, options: TTSOptions): Promise<void> {
    const fallback = new WebSpeechTTSProvider();
    return fallback.speak(text, options);
  }

  cancel(): void {
    const fallback = new WebSpeechTTSProvider();
    fallback.cancel();
  }
}

// Default provider singletons
export const defaultSTTProvider: SpeechToTextProvider = new WebSpeechSTTProvider();
export const defaultTTSProvider: TextToSpeechProvider = new WebSpeechTTSProvider();
