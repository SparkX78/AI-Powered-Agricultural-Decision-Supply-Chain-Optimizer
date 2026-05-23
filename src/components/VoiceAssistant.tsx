/**
 * VoiceAssistant — Enhanced voice overlay for KisanUnnati Nexus Farmer Dashboard
 *
 * Features:
 * - Web Speech API (SpeechRecognition) with graceful fallback to tap-to-command UI
 * - Live transcript display while speaking
 * - Animated waveform bars (idle pulse + active listening bars)
 * - Smart fuzzy command matching from transcript
 * - Ripple rings on mic button during listening
 * - Smooth state machine: idle → listening → processing → done → closed
 * - Bilingual hint (English + Hindi)
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Mic, MicOff, X, Volume2, ChevronRight, CheckCircle2,
  TrendingUp, Truck, History, Sprout, AlertCircle,
} from 'lucide-react';

// ── Types ────────────────────────────────────────────────────────────────────

export type Section = 'overview' | 'prices' | 'tracking' | 'history';

export interface VoiceCommand {
  label: string;
  labelHi: string;          // Hindi label for display
  icon: typeof Mic;
  section: Section;
  desc: string;
  keywords: string[];       // words that trigger this command
}

interface VoiceAssistantProps {
  open: boolean;
  onClose: () => void;
  onNavigate: (section: Section) => void;
}

type VoiceStep = 'idle' | 'listening' | 'processing' | 'done' | 'error' | 'no-speech';

// ── Commands ─────────────────────────────────────────────────────────────────

const COMMANDS: VoiceCommand[] = [
  {
    label: 'Market Prices',
    labelHi: 'बाज़ार भाव',
    icon: TrendingUp,
    section: 'prices',
    desc: "Today's mandi rates for your crops",
    keywords: ['price', 'prices', 'market', 'mandi', 'rate', 'rates', 'bhav', 'bazar', 'bazaar', 'crop'],
  },
  {
    label: 'Track Shipments',
    labelHi: 'शिपमेंट ट्रैक करें',
    icon: Truck,
    section: 'tracking',
    desc: 'Check delivery status of your orders',
    keywords: ['track', 'shipment', 'delivery', 'transit', 'truck', 'transport', 'ship', 'dispatch'],
  },
  {
    label: 'Order History',
    labelHi: 'ऑर्डर इतिहास',
    icon: History,
    section: 'history',
    desc: 'View all past orders and transactions',
    keywords: ['history', 'order', 'orders', 'past', 'previous', 'transaction', 'record', 'itihas'],
  },
  {
    label: 'Dashboard Overview',
    labelHi: 'डैशबोर्ड',
    icon: Sprout,
    section: 'overview',
    desc: 'Go back to the main overview',
    keywords: ['overview', 'home', 'dashboard', 'main', 'summary', 'start', 'back'],
  },
];

// ── Helpers ──────────────────────────────────────────────────────────────────

const matchCommand = (transcript: string): VoiceCommand | null => {
  const lower = transcript.toLowerCase();
  for (const cmd of COMMANDS) {
    if (cmd.keywords.some((kw) => lower.includes(kw))) return cmd;
  }
  return null;
};

// ── Browser Speech API type shims ────────────────────────────────────────────

interface SpeechRecognitionResultItem { transcript: string; confidence: number; }
interface SpeechRecognitionResult { isFinal: boolean; [index: number]: SpeechRecognitionResultItem; }
interface SpeechRecognitionResultList { length: number; resultIndex: number; [index: number]: SpeechRecognitionResult; }
interface SpeechRecognitionEventShim extends Event { results: SpeechRecognitionResultList; resultIndex: number; }
interface SpeechRecognitionErrorEventShim extends Event { error: string; message: string; }

interface SpeechRecognitionInstance extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  abort(): void;
  onstart: ((this: SpeechRecognitionInstance, ev: Event) => void) | null;
  onresult: ((this: SpeechRecognitionInstance, ev: SpeechRecognitionEventShim) => void) | null;
  onerror: ((this: SpeechRecognitionInstance, ev: SpeechRecognitionErrorEventShim) => void) | null;
  onend: ((this: SpeechRecognitionInstance, ev: Event) => void) | null;
}

interface SpeechRecognitionConstructor {
  new(): SpeechRecognitionInstance;
}

// Check if browser supports SpeechRecognition
const getSpeechRecognition = (): SpeechRecognitionConstructor | null => {
  if (typeof window === 'undefined') return null;
  const w = window as Window & {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  };
  return w.SpeechRecognition || w.webkitSpeechRecognition || null;
};

// ── Waveform bars component ───────────────────────────────────────────────────

function WaveformBars({ active }: { active: boolean }) {
  const bars = [0.4, 0.7, 1.0, 0.85, 0.6, 0.9, 0.5, 0.75, 0.45, 0.8, 0.55, 0.65];
  return (
    <div className="flex items-center justify-center gap-[3px] h-10">
      {bars.map((base, i) => (
        <motion.div
          key={i}
          className="w-1 rounded-full"
          style={{ background: active ? '#1a5c2a' : '#94a3b8' }}
          animate={
            active
              ? {
                  height: [
                    `${base * 12 + 4}px`,
                    `${base * 32 + 4}px`,
                    `${base * 8 + 4}px`,
                    `${base * 28 + 4}px`,
                    `${base * 12 + 4}px`,
                  ],
                  opacity: [0.7, 1, 0.8, 1, 0.7],
                }
              : { height: `${base * 10 + 3}px`, opacity: 0.35 }
          }
          transition={
            active
              ? {
                  duration: 0.8 + i * 0.05,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: i * 0.06,
                }
              : { duration: 0.4 }
          }
        />
      ))}
    </div>
  );
}

// ── Ripple rings ──────────────────────────────────────────────────────────────

function RippleRings({ active }: { active: boolean }) {
  if (!active) return null;
  return (
    <>
      {[1, 1.6, 2.2].map((scale, i) => (
        <motion.div
          key={i}
          className="absolute inset-0 rounded-full"
          style={{ background: 'rgba(26,92,42,0.15)' }}
          initial={{ scale: 1, opacity: 0.6 }}
          animate={{ scale, opacity: 0 }}
          transition={{
            duration: 1.8,
            repeat: Infinity,
            delay: i * 0.45,
            ease: 'easeOut',
          }}
        />
      ))}
    </>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function VoiceAssistant({ open, onClose, onNavigate }: VoiceAssistantProps) {
  const [step, setStep]               = useState<VoiceStep>('idle');
  const [transcript, setTranscript]   = useState('');
  const [matched, setMatched]         = useState<VoiceCommand | null>(null);
  const [hasSpeech, setHasSpeech]     = useState(false);   // browser supports speech API
  const [micPermission, setMicPermission] = useState<'unknown' | 'granted' | 'denied'>('unknown');

  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const timeoutRef     = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Detect speech API support on mount
  useEffect(() => {
    setHasSpeech(!!getSpeechRecognition());
  }, []);

  // Reset state when overlay opens
  useEffect(() => {
    if (open) {
      setStep('idle');
      setTranscript('');
      setMatched(null);
    } else {
      stopRecognition();
    }
  }, [open]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopRecognition();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const stopRecognition = useCallback(() => {
    if (recognitionRef.current) {
      try { recognitionRef.current.abort(); } catch (_) { /* ignore */ }
      recognitionRef.current = null;
    }
  }, []);

  const handleClose = useCallback(() => {
    stopRecognition();
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setStep('idle');
    setTranscript('');
    setMatched(null);
    onClose();
  }, [onClose, stopRecognition]);

  const executeCommand = useCallback((cmd: VoiceCommand) => {
    setMatched(cmd);
    setStep('done');
    timeoutRef.current = setTimeout(() => {
      handleClose();
      onNavigate(cmd.section);
    }, 1200);
  }, [handleClose, onNavigate]);

  // ── Start voice recognition ───────────────────────────────────────────────
  const startListening = useCallback(() => {
    const SR = getSpeechRecognition();
    if (!SR) return;

    stopRecognition();
    setTranscript('');
    setStep('listening');

    const recognition = new SR();
    recognition.lang = 'en-IN';
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 3;
    recognitionRef.current = recognition;

    recognition.onstart = () => {
      setMicPermission('granted');
    };

    recognition.onresult = (event: SpeechRecognitionEventShim) => {
      let interim = '';
      let final = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const t = event.results[i][0].transcript;
        if (event.results[i].isFinal) final += t;
        else interim += t;
      }
      setTranscript(final || interim);

      if (final) {
        setStep('processing');
        const cmd = matchCommand(final);
        if (cmd) {
          timeoutRef.current = setTimeout(() => executeCommand(cmd), 600);
        } else {
          timeoutRef.current = setTimeout(() => setStep('no-speech'), 600);
        }
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEventShim) => {
      if (event.error === 'not-allowed') {
        setMicPermission('denied');
        setStep('error');
      } else if (event.error === 'no-speech') {
        setStep('no-speech');
      } else {
        setStep('error');
      }
    };

    recognition.onend = () => {
      if (step === 'listening') setStep('no-speech');
    };

    try {
      recognition.start();
    } catch (_) {
      setStep('error');
    }
  }, [executeCommand, step, stopRecognition]);

  // ── Tap-to-command (fallback / always available) ──────────────────────────
  const handleTapCommand = useCallback((cmd: VoiceCommand) => {
    if (step !== 'idle') return;
    setTranscript(cmd.label);
    setStep('processing');
    timeoutRef.current = setTimeout(() => executeCommand(cmd), 700);
  }, [step, executeCommand]);

  // ── Render ────────────────────────────────────────────────────────────────

  const isListening  = step === 'listening';
  const isProcessing = step === 'processing';
  const isDone       = step === 'done';
  const isError      = step === 'error';
  const isNoSpeech   = step === 'no-speech';
  const isBusy       = isListening || isProcessing;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={() => !isBusy && handleClose()}
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, y: 80, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 80, scale: 0.95 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-0 left-0 right-0 sm:bottom-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:max-w-md w-full z-50"
            role="dialog"
            aria-modal="true"
            aria-label="Voice assistant"
          >
            <div className="bg-card rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden border border-border">

              {/* ── Top gradient bar ── */}
              <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg,#1a5c2a,#c9a227,#1a5c2a)' }} />

              {/* ── Header ── */}
              <div className="flex items-center justify-between px-5 pt-5 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#dcfce7' }}>
                    <Volume2 size={18} style={{ color: '#1a5c2a' }} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">Voice Assistant</p>
                    <p className="text-xs text-muted-foreground">
                      {hasSpeech ? 'Speak or tap a command' : 'Tap a command below'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  disabled={isBusy}
                  className="p-2 rounded-xl hover:bg-muted transition-colors disabled:opacity-40"
                  aria-label="Close voice assistant"
                >
                  <X size={16} className="text-muted-foreground" />
                </button>
              </div>

              {/* ── Mic + waveform area ── */}
              <div className="flex flex-col items-center px-5 py-4 gap-3">
                {/* Waveform */}
                <WaveformBars active={isListening} />

                {/* Mic button */}
                <div className="relative flex items-center justify-center w-20 h-20">
                  <RippleRings active={isListening} />

                  <motion.button
                    whileHover={!isBusy ? { scale: 1.06 } : {}}
                    whileTap={!isBusy ? { scale: 0.94 } : {}}
                    onClick={hasSpeech && !isBusy ? startListening : undefined}
                    disabled={isBusy || !hasSpeech}
                    className="relative w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 disabled:cursor-default"
                    style={{
                      background: isDone
                        ? '#16a34a'
                        : isListening
                        ? 'linear-gradient(135deg,#1a5c2a,#2d7a3e)'
                        : isProcessing
                        ? 'linear-gradient(135deg,#c9a227,#e0b830)'
                        : isError || isNoSpeech
                        ? '#ef4444'
                        : 'linear-gradient(135deg,#1a5c2a,#2d7a3e)',
                    }}
                    aria-label={isListening ? 'Listening…' : 'Start voice command'}
                  >
                    {isDone ? (
                      <CheckCircle2 size={26} className="text-white" />
                    ) : isError ? (
                      <MicOff size={26} className="text-white" />
                    ) : isNoSpeech ? (
                      <AlertCircle size={26} className="text-white" />
                    ) : (
                      <motion.div
                        animate={isListening ? { scale: [1, 1.12, 1] } : {}}
                        transition={{ duration: 0.6, repeat: Infinity }}
                      >
                        <Mic size={26} className="text-white" />
                      </motion.div>
                    )}
                  </motion.button>
                </div>

                {/* Status text */}
                <div className="text-center min-h-[36px] flex flex-col items-center justify-center">
                  <AnimatePresence mode="wait">
                    {step === 'idle' && (
                      <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        {hasSpeech ? (
                          <>
                            <p className="text-sm font-semibold text-foreground">Tap mic to speak</p>
                            <p className="text-xs text-muted-foreground">बोलें या नीचे से चुनें</p>
                          </>
                        ) : (
                          <p className="text-xs text-muted-foreground">Tap a command below to navigate</p>
                        )}
                      </motion.div>
                    )}
                    {isListening && (
                      <motion.div key="listening" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <p className="text-sm font-semibold text-primary animate-pulse">Listening…</p>
                        {transcript && (
                          <p className="text-xs text-muted-foreground mt-0.5 italic">"{transcript}"</p>
                        )}
                      </motion.div>
                    )}
                    {isProcessing && (
                      <motion.div key="processing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <p className="text-sm font-semibold" style={{ color: '#c9a227' }}>Processing…</p>
                        {transcript && (
                          <p className="text-xs text-muted-foreground mt-0.5 italic">"{transcript}"</p>
                        )}
                      </motion.div>
                    )}
                    {isDone && matched && (
                      <motion.div key="done" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                        <p className="text-sm font-bold text-green-600">Navigating to {matched.label}…</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{matched.labelHi}</p>
                      </motion.div>
                    )}
                    {isNoSpeech && (
                      <motion.div key="no-speech" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <p className="text-sm font-semibold text-amber-600">Couldn't understand</p>
                        <button onClick={() => setStep('idle')} className="text-xs text-primary hover:underline mt-0.5">
                          Try again
                        </button>
                      </motion.div>
                    )}
                    {isError && (
                      <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <p className="text-sm font-semibold text-red-600">
                          {micPermission === 'denied' ? 'Mic access denied' : 'Voice unavailable'}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">Use tap commands below</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* ── Divider ── */}
              <div className="flex items-center gap-3 px-5 mb-3">
                <div className="flex-1 h-px bg-border" />
                <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">Quick Commands</span>
                <div className="flex-1 h-px bg-border" />
              </div>

              {/* ── Command buttons ── */}
              <div className="px-5 pb-6 space-y-2">
                {COMMANDS.map((cmd) => {
                  const isActive = isDone && matched?.section === cmd.section;
                  return (
                    <motion.button
                      key={cmd.section}
                      whileHover={!isBusy ? { x: 3 } : {}}
                      whileTap={!isBusy ? { scale: 0.98 } : {}}
                      onClick={() => handleTapCommand(cmd)}
                      disabled={isBusy}
                      className={`w-full flex items-center gap-3 p-3.5 rounded-xl border transition-all duration-200 text-left group disabled:opacity-50 disabled:cursor-not-allowed ${
                        isActive
                          ? 'border-primary bg-green-50'
                          : 'border-border hover:border-primary hover:bg-green-50/50'
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                          isActive ? 'bg-primary/15' : 'bg-muted group-hover:bg-primary/10'
                        }`}
                      >
                        <cmd.icon size={17} className="text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-bold text-foreground">{cmd.label}</p>
                          <span className="text-[10px] text-muted-foreground font-medium">{cmd.labelHi}</span>
                        </div>
                        <p className="text-xs text-muted-foreground truncate">{cmd.desc}</p>
                      </div>
                      {isActive ? (
                        <CheckCircle2 size={15} className="text-primary shrink-0" />
                      ) : (
                        <ChevronRight size={15} className="text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                      )}
                    </motion.button>
                  );
                })}
              </div>

              {/* ── Footer hint ── */}
              <div className="px-5 pb-4 text-center">
                <p className="text-[10px] text-muted-foreground">
                  {hasSpeech
                    ? 'Say "market prices", "track shipment", or "order history"'
                    : 'Tap any command above to navigate instantly'}
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
