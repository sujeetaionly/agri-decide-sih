import { TextToSpeech } from '@capacitor-community/text-to-speech';
import { Capacitor } from '@capacitor/core';

export type SpeechLanguage = 'hi' | 'mr' | 'gu' | 'raj' | 'en' | string;

export interface VoiceRecognitionSession {
  stop: () => void;
}

function getApiBaseUrl(): string {
  if (typeof window !== 'undefined') {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return 'http://127.0.0.1:8000/api/v1';
    }
  }
  return (import.meta as any).env?.VITE_API_URL || 'https://fasal-disha.onrender.com/api/v1';
}

let activeAudio: HTMLAudioElement | null = null;
let activeUtterance: SpeechSynthesisUtterance | null = null;
let keepAliveTimer: any = null;
let currentSessionId = 0;

function getSpeechSynthesisLang(lang: SpeechLanguage): string {
  if (lang === 'mr') return 'mr-IN';
  if (lang === 'gu') return 'gu-IN';
  if (lang === 'en') return 'en-IN';
  if (lang === 'pa') return 'pa-IN';
  if (lang === 'ta') return 'ta-IN';
  if (lang === 'te') return 'te-IN';
  if (lang === 'kn') return 'kn-IN';
  if (lang === 'bn') return 'bn-IN';
  return 'hi-IN';
}

function playViaWebSpeech(
  cleanText: string,
  lang: SpeechLanguage,
  sessionId: number,
  onStart?: () => void,
  onEnd?: () => void,
  onError?: (e: any) => void
): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    if (onError) onError(new Error('Speech synthesis not available'));
    if (onEnd) onEnd();
    return;
  }

  try {
    window.speechSynthesis.cancel();
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }

    if (sessionId !== currentSessionId) return;

    const targetLang = getSpeechSynthesisLang(lang);
    const utterance = new SpeechSynthesisUtterance(',  ' + cleanText);
    utterance.lang = targetLang;
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    activeUtterance = utterance;
    (window as any).__activeUtterance = utterance;

    utterance.onstart = () => {
      if (sessionId !== currentSessionId) {
        window.speechSynthesis.cancel();
        return;
      }
      if (onStart) onStart();
      clearInterval(keepAliveTimer);
      keepAliveTimer = setInterval(() => {
        if (window.speechSynthesis.speaking) {
          window.speechSynthesis.pause();
          window.speechSynthesis.resume();
        } else {
          clearInterval(keepAliveTimer);
        }
      }, 10000);
    };

    utterance.onend = () => {
      clearInterval(keepAliveTimer);
      if (activeUtterance === utterance) {
        activeUtterance = null;
        (window as any).__activeUtterance = null;
      }
      if (sessionId === currentSessionId && onEnd) onEnd();
    };

    utterance.onerror = (e) => {
      clearInterval(keepAliveTimer);
      if (activeUtterance === utterance) {
        activeUtterance = null;
        (window as any).__activeUtterance = null;
      }
      if (sessionId === currentSessionId) {
        if (onError) onError(e);
        else if (onEnd) onEnd();
      }
    };

    window.speechSynthesis.speak(utterance);
  } catch (err) {
    clearInterval(keepAliveTimer);
    activeUtterance = null;
    if (sessionId === currentSessionId) {
      if (onError) onError(err);
      else if (onEnd) onEnd();
    }
  }
}

export async function speakText(
  text: string,
  lang: SpeechLanguage = 'hi',
  onStart?: () => void,
  onEnd?: () => void,
  onError?: (e: any) => void
): Promise<void> {
  // First, stop any prior audio (this increments currentSessionId)
  stopSpeaking();
  // Capture this active session ID
  const sessionId = currentSessionId;

  if (!text || !text.trim()) {
    if (onEnd) onEnd();
    return;
  }

  const cleanText = text.replace(/[*_#`]/g, '').trim();
  const targetLang = getSpeechSynthesisLang(lang);

  // 1. Android / iOS Native Platform Engine (100% hardware native sound)
  if (Capacitor.isNativePlatform()) {
    try {
      if (onStart) onStart();
      await TextToSpeech.stop();
      if (sessionId !== currentSessionId) return;
      await TextToSpeech.speak({
        text: cleanText,
        lang: targetLang,
        rate: 0.95,
        pitch: 1.0,
        volume: 1.0,
        category: 'ambient',
      });
      if (sessionId === currentSessionId && onEnd) onEnd();
      return;
    } catch (nativeErr) {
      console.warn('[TTS] Native engine fallback:', nativeErr);
    }
  }

  // 2. High-Fidelity Audio Stream (Backend MP3 TTS Proxy)
  const ttsLang = lang === 'mr' ? 'mr' : lang === 'gu' ? 'gu' : lang === 'en' ? 'en' : 'hi';
  let hasStarted = false;

  try {
    const audioUrl = `${getApiBaseUrl()}/tts?text=${encodeURIComponent(cleanText)}&lang=${ttsLang}`;
    const audio = new Audio(audioUrl);
    activeAudio = audio;

    audio.onplay = () => {
      if (sessionId !== currentSessionId) {
        audio.pause();
        return;
      }
      hasStarted = true;
      if (onStart) onStart();
    };

    audio.onended = () => {
      if (activeAudio === audio) activeAudio = null;
      if (sessionId === currentSessionId && onEnd) onEnd();
    };

    audio.onerror = () => {
      if (activeAudio === audio) activeAudio = null;
      if (!hasStarted && sessionId === currentSessionId) {
        playViaWebSpeech(cleanText, lang, sessionId, onStart, onEnd, onError);
      }
    };

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        if (activeAudio === audio) activeAudio = null;
        if (!hasStarted && sessionId === currentSessionId) {
          playViaWebSpeech(cleanText, lang, sessionId, onStart, onEnd, onError);
        }
      });
    }
  } catch {
    if (!hasStarted && sessionId === currentSessionId) {
      playViaWebSpeech(cleanText, lang, sessionId, onStart, onEnd, onError);
    }
  }
}

export function stopSpeaking(): void {
  // Invalidate any active session
  currentSessionId++;

  if (Capacitor.isNativePlatform()) {
    try {
      TextToSpeech.stop().catch(() => {});
    } catch {}
  }

  if (activeAudio) {
    try {
      activeAudio.pause();
      activeAudio.removeAttribute('src');
      activeAudio.load();
      activeAudio.onplay = null;
      activeAudio.onended = null;
      activeAudio.onerror = null;
    } catch {}
    activeAudio = null;
  }

  clearInterval(keepAliveTimer);
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch {}
    activeUtterance = null;
    (window as any).__activeUtterance = null;
  }
}

export function startVoiceRecognition(
  lang: SpeechLanguage = 'hi',
  onResult: (text: string, isFinal: boolean) => void,
  onError?: (err: any) => void,
  onEnd?: () => void
): VoiceRecognitionSession {
  const SpeechRecognition =
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

  if (!SpeechRecognition) {
    console.warn('Speech recognition not supported in this browser.');
    if (onError) onError(new Error('Speech recognition not supported'));
    if (onEnd) onEnd();
    return { stop: () => {} };
  }

  const recognition = new SpeechRecognition();
  if (lang === 'mr') recognition.lang = 'mr-IN';
  else if (lang === 'gu') recognition.lang = 'gu-IN';
  else if (lang === 'en') recognition.lang = 'en-IN';
  else recognition.lang = 'hi-IN';

  recognition.interimResults = true;
  recognition.continuous = false;

  recognition.onresult = (event: any) => {
    let interimTranscript = '';
    let finalTranscript = '';

    for (let i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        finalTranscript += event.results[i][0].transcript;
      } else {
        interimTranscript += event.results[i][0].transcript;
      }
    }

    const transcript = finalTranscript || interimTranscript;
    onResult(transcript, !!finalTranscript);
  };

  recognition.onerror = (event: any) => {
    console.warn('Speech recognition error:', event.error);
    if (onError) onError(event);
  };

  recognition.onend = () => {
    if (onEnd) onEnd();
  };

  try {
    recognition.start();
  } catch (e) {
    console.warn('Speech recognition failed to start:', e);
    if (onError) onError(e);
  }

  return {
    stop: () => {
      try {
        recognition.stop();
      } catch {}
    },
  };
}
