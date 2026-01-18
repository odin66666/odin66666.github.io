import React, { useState, useEffect, useCallback, useRef } from 'react';

// ============================================================
// AUDIO SYSTEM - Web Audio API
// ============================================================
const AudioSystem = {
  ctx: null,
  
  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
    return this.ctx;
  },
  
  playTone(frequency, duration, type = 'sine', volume = 0.3) {
    try {
      const ctx = this.init();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscillator.frequency.value = frequency;
      oscillator.type = type;
      
      gainNode.gain.setValueAtTime(volume, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
      
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + duration);
    } catch (e) {
      console.log('Audio not available');
    }
  },
  
  playPreLast() {
    this.playTone(880, 0.2, 'sine', 0.2);
  },
  
  playLast() {
    this.playTone(523.25, 0.5, 'sine', 0.4);
    setTimeout(() => this.playTone(659.25, 0.5, 'sine', 0.3), 100);
    setTimeout(() => this.playTone(783.99, 0.8, 'sine', 0.35), 200);
  },
  
  playChakraComplete() {
    this.playTone(523.25, 0.15, 'triangle', 0.3);
    setTimeout(() => this.playTone(659.25, 0.15, 'triangle', 0.3), 150);
    setTimeout(() => this.playTone(783.99, 0.3, 'triangle', 0.4), 300);
  },
  
  playMeditationComplete() {
    const notes = [523.25, 587.33, 659.25, 698.46, 783.99, 880, 987.77, 1046.5];
    notes.forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 0.4, 'sine', 0.25), i * 150);
    });
  },
  
  playAffirmationDing() {
    this.playTone(698.46, 0.3, 'sine', 0.25); // FA5
  },
  
  playAffirmationComplete() {
    this.playTone(523.25, 0.2, 'triangle', 0.3);
    setTimeout(() => this.playTone(783.99, 0.2, 'triangle', 0.3), 200);
    setTimeout(() => this.playTone(1046.5, 0.4, 'triangle', 0.4), 400);
  }
};

// ============================================================
// SUNRISE CALCULATION (approximate)
// ============================================================
const getSunrise = (date = new Date(), lat = 41.9, lon = 12.5) => {
  // Simplified sunrise calculation
  // Default coordinates: Rome, Italy
  const dayOfYear = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
  
  // Approximate sunrise hour (varies by season)
  const baseHour = 6; // Base sunrise ~6:00
  const variation = Math.cos((dayOfYear - 172) * 2 * Math.PI / 365) * 1.5; // Summer/Winter variation ±1.5h
  
  const sunriseHour = baseHour + variation;
  const sunrise = new Date(date);
  sunrise.setHours(Math.floor(sunriseHour), Math.round((sunriseHour % 1) * 60), 0, 0);
  
  return sunrise;
};

// Get today's sunrise (the one that started the current "spiritual day")
const getTodaySunrise = () => {
  const now = new Date();
  const todaySunrise = getSunrise(now);
  
  // If we're before today's sunrise, the current "day" started at YESTERDAY's sunrise
  if (now < todaySunrise) {
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    return getSunrise(yesterday);
  }
  
  return todaySunrise;
};

// Get next sunrise (when we can meditate again)
const getNextSunrise = () => {
  const now = new Date();
  const todaySunrise = getSunrise(now);
  
  if (now < todaySunrise) {
    return todaySunrise;
  }
  
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  return getSunrise(tomorrow);
};

// Calculate meditation status
const getMeditationStatus = (lastMeditationTime = null) => {
  const now = new Date();
  const currentDaySunrise = getTodaySunrise();
  const nextSunrise = getNextSunrise();
  
  // No previous meditation
  if (!lastMeditationTime) {
    return {
      canMeditate: true,
      status: 'first_time',
      deadline: null,
      waitUntil: null,
      message: 'Prima meditazione - inizia quando vuoi!'
    };
  }
  
  const lastMed = new Date(lastMeditationTime);
  const deadline = new Date(lastMed.getTime() + 36 * 60 * 60 * 1000); // 36h from last meditation
  
  // Check if already meditated in current "spiritual day" (after current sunrise)
  const meditatedToday = lastMed >= currentDaySunrise;
  
  if (meditatedToday) {
    // Already done today - must wait for next sunrise
    return {
      canMeditate: false,
      status: 'wait_sunrise',
      deadline: deadline,
      waitUntil: nextSunrise,
      timeToWait: nextSunrise.getTime() - now.getTime(),
      message: 'Meditazione completata! Attendi la prossima alba.'
    };
  }
  
  // Haven't meditated today
  if (now > deadline) {
    // Deadline passed - cycle lost!
    return {
      canMeditate: true,
      status: 'cycle_lost',
      deadline: null,
      waitUntil: null,
      message: '⚠️ Ciclo perso! Ricomincia la pratica.'
    };
  }
  
  // Can meditate now, show time remaining
  return {
    canMeditate: true,
    status: 'can_meditate',
    deadline: deadline,
    waitUntil: null,
    timeRemaining: deadline.getTime() - now.getTime(),
    message: 'Puoi meditare ora!'
  };
};

// ============================================================
// CHAKRA DATA WITH BREATHING TECHNIQUES
// ============================================================
const CHAKRAS = [
  {
    id: 'crown',
    name: 'Corona',
    nameSanskrit: 'Sahasrara',
    subtitle: 'Mille Petali',
    color: '#8B5CF6',
    colorName: 'Viola',
    position: 'Cima della testa',
    planet: 'Giove',
    day: 'Giovedì',
    element: 'Acqua',
    alignment: 'down',
    bodyY: 8,
    breathing: {
      name: 'Nessuna Tecnica',
      description: 'Non c\'è tecnica di respirazione per questo chakra.',
      steps: []
    },
    vibrations: {
      necronomicon: { word: 'MARDUK', pronunciation: 'M-M-M-AH-AH-AH-R-R-R-DH-DH-DH-OO-OO-OO-K-K-K' },
      runic: { word: 'ING', pronunciation: 'E-E-E-E-E-N-N-N-G-G-G-G' },
      sanskrit: { word: 'MAUM', pronunciation: 'M-M-AH-AH-AH-U-U-U-U-M-M-M-M' }
    },
    note: 'Lilith governa la Corona'
  },
  {
    id: 'sixth',
    name: '6° Chakra',
    nameSanskrit: 'Ajna',
    subtitle: 'Terzo Occhio',
    color: '#4F46E5',
    colorName: 'Indaco',
    position: 'Dietro il terzo occhio',
    planet: 'Luna',
    day: 'Lunedì',
    element: 'Etere',
    alignment: 'down',
    bodyY: 15,
    breathing: {
      name: 'Kumbhaka Lunar Breath',
      description: 'Esegui ENTRAMBI i set. Stesso numero di round.',
      steps: [
        '【SET 1】 3-6 round:',
        '• Inspira (2) → Trattieni (4) → Espira (6) → Trattieni (4)',
        '',
        '【SET 2】 Stesso numero:',
        '• Inspira (6) → Trattieni (6) → Espira (4)',
        '• NON trattenere in fondo!'
      ]
    },
    vibrations: {
      necronomicon: { word: 'INANNA', pronunciation: 'EE-EE-EE-N-N-N-N-AH-AH-N-N-N-AH-AH' },
      traditional: { word: 'AUM', pronunciation: 'AH-AH-AH-U-U-U-U-M-M-M-M' },
      runic: { word: 'THOR', pronunciation: 'TH-TH-AH-AH-U-U-U-R-R-R' },
      sanskrit: { word: 'YAUM', pronunciation: 'Y-Y-Y-AH-AH-AH-U-U-U-U-M-M-M-M' }
    }
  },
  {
    id: 'throat',
    name: 'Gola',
    nameSanskrit: 'Vishuddi',
    subtitle: 'Comunicazione',
    color: '#0EA5E9',
    colorName: 'Blu Cielo',
    position: 'Gola',
    planet: 'Mercurio',
    day: 'Mercoledì',
    element: 'Aria',
    alignment: 'down',
    bodyY: 28,
    breathing: {
      name: 'Yogic Humming Breath (Brahmari)',
      description: 'I mantra vanno VIBRATI, mai solo pronunciati.',
      steps: [
        '1. Inspira riempiendo i polmoni',
        '2. Espira con labbra CHIUSE:',
        '   HMMMMMMMM (ronzio)',
        '3. Continua fino a svuotarti',
        '→ Fai 5 round'
      ]
    },
    vibrations: {
      necronomicon: { word: 'NANNA', pronunciation: 'N-N-N-N-AH-AH-N-N-N-AH-AH' },
      traditional: { word: 'HAM', pronunciation: 'H-H-AH-AH-AH-M-M-M-M' },
      runic: { word: 'KAUN', pronunciation: 'K-K-AH-AH-AH-U-U-U-N-N' },
      sanskrit: { word: 'HAUM', pronunciation: 'H-H-H-AH-AH-AH-U-U-U-U-M-M-M-M' }
    }
  },
  {
    id: 'heart',
    name: 'Cuore',
    nameSanskrit: 'Anahata',
    subtitle: 'Centro Connettore',
    color: '#22C55E',
    colorName: 'Verde',
    position: 'Centro del petto',
    planet: 'Venere',
    day: 'Venerdì',
    element: 'Fuoco/Aria',
    alignment: 'yoni',
    bodyY: 38,
    breathing: {
      name: 'Alternate Nostril (Anuloma Viloma)',
      description: 'Bilancia Ida e Pingala. 5 round nuovi, 10+ esperti.',
      steps: [
        '1. Chiudi DX → Inspira SX (4)',
        '2. Trattieni (6)',
        '3. Chiudi SX → Espira DX (4)',
        '4. Inspira DX (4) → Trattieni (6)',
        '5. Chiudi DX → Espira SX (4)',
        '= 1 round'
      ]
    },
    vibrations: {
      necronomicon: { word: 'NEBO', pronunciation: 'N-N-N-NAY-AY-AY-B-B-B-B-OH-OH-OH' },
      traditional: { word: 'YAM', pronunciation: 'Y-Y-AH-AH-AH-M-M-M-M' },
      runic: { word: 'GEBO', pronunciation: 'G-G-G-G-AY-AY-AY-B-B-B-B-OH-OH-OH-OH' },
      sanskrit: { word: 'AUM', pronunciation: 'AH-AH-AH-U-U-U-U-M-M-M-M' }
    }
  },
  {
    id: 'solar',
    name: 'Solare 666',
    nameSanskrit: 'Manipura',
    subtitle: 'Graal di Lucifero',
    color: '#F59E0B',
    colorName: 'Bianco-Oro',
    position: 'Sopra l\'ombelico',
    planet: 'Sole',
    day: 'Domenica',
    element: 'Fuoco',
    alignment: 'down',
    bodyY: 48,
    breathing: {
      name: 'Breath of Fire (Kapalabhati)',
      description: '⚠️ FONDAZIONE KUNDALINI. NO se incinta/pressione alta.',
      steps: [
        '1. Pompa addome FORTE e VELOCE',
        '2. Rilassa - aria entra da sola',
        '3. Fai 20 pompaggi rapidi',
        '4. Al 20°: Espira → Inspira pieno',
        '5. Contrai ano + mento al petto',
        '6. TRATTIENI (non forzare!)',
        '7. Espira lentamente',
        '= 1 round. Aumenta: 20→40→60'
      ]
    },
    vibrations: {
      necronomicon: { word: 'UDDU', pronunciation: 'OO-OO-OO-OO-DH-DH-DH-DH-OO-OO-OO-OO' },
      traditional: { word: 'RAM', pronunciation: 'R-R-AH-AH-AH-M-M-M-M' },
      runic: { word: 'REDA', pronunciation: 'R-R-AY-AY-DH-DH-AH-AH' },
      sanskrit: { word: 'RAUM', pronunciation: 'R-R-AH-AH-AH-U-U-U-U-M-M-M-M' }
    },
    note: 'Centrale elettrica dell\'anima'
  },
  {
    id: 'sacral',
    name: 'Sacrale',
    nameSanskrit: 'Svadhisthana',
    subtitle: 'Energia Sessuale',
    color: '#F97316',
    colorName: 'Arancione',
    position: 'Sotto l\'ombelico',
    planet: 'Marte',
    day: 'Martedì',
    element: 'Acqua',
    alignment: 'up',
    bodyY: 58,
    breathing: {
      name: 'Sacral Breath',
      description: 'Attira energia dal Base al Sacrale.',
      steps: [
        '1. Inspira dal naso',
        '2. Visualizza: BASE → SACRALE',
        '3. Trattieni (6)',
        '4. Espira senza sforzo',
        '= 1 round. Diversi round.'
      ]
    },
    vibrations: {
      necronomicon: { word: 'NERGAL', pronunciation: 'N-N-N-AIR-AIR-AIR-G-G-G-AH-AH-AH-L-L-L' },
      traditional: { word: 'VAM', pronunciation: 'V-V-AH-AH-AH-M-M-M-M' },
      runic: { word: 'DAGUR', pronunciation: 'DH-DH-AH-AH-G-G-U-U-U-R-R-R' },
      sanskrit: { word: 'VAUM', pronunciation: 'V-V-AH-AH-AH-U-U-U-U-M-M-M-M' }
    }
  },
  {
    id: 'base',
    name: 'Base',
    nameSanskrit: 'Muladhara',
    subtitle: 'Radice',
    color: '#EF4444',
    colorName: 'Rosso',
    position: 'Base della colonna',
    planet: 'Saturno',
    day: 'Sabato',
    element: 'Terra',
    alignment: 'up',
    bodyY: 72,
    breathing: {
      name: 'Base Chakra Breath',
      description: 'Energia su e giù attraverso tutti i chakra.',
      steps: [
        '【INSPIRA】 Contrai ano',
        '• BASE → su → CORONA',
        '• Illumina ogni chakra',
        '',
        '【TRATTIENI】 4/10/comodo',
        '',
        '【ESPIRA】',
        '• CORONA → giù → BASE',
        '= 1 round'
      ]
    },
    vibrations: {
      necronomicon: { word: 'NINIB', pronunciation: 'N-N-N-N-EE-EE-EE-N-N-N-N-EE-EE-EE-B-B-B-B-B' },
      traditional: { word: 'LAM', pronunciation: 'L-L-AH-AH-AH-M-M-M-M' },
      runic: { word: 'SOWILO', pronunciation: 'S-S-OH-OH-V-V-EE-EE-LL-OH-OH' },
      sanskrit: { word: 'LAUM', pronunciation: 'L-L-AH-AH-AH-U-U-U-U-M-M-M-M' }
    },
    note: 'Satana governa la Base'
  }
];

const CATEGORIES = [
  { id: 'necronomicon', name: 'Necronomicon', level: 'Nuovi/Esperti', icon: '📜' },
  { id: 'traditional', name: 'Tradizionale', level: 'Nuovi/Esperti', icon: '🕉️' },
  { id: 'runic', name: 'Runico', level: 'Intermedio/Avanzato', icon: 'ᚱ' },
  { id: 'sanskrit', name: 'Sanscrito', level: 'SOLO Esperti', icon: '🔥' }
];

const FINAL_AFFIRMATION = "TUTTI I MIEI CHAKRA SONO COMPLETAMENTE E TOTALMENTE POTENZIATI IN MANIERA SANA E POSITIVA PER ME ORA E PER SEMPRE";
const AFFIRMATION_REPS = 3;

const DEFAULT_REPS = 9;

// ============================================================
// UTILITY FUNCTIONS
// ============================================================
const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const formatDuration = (seconds) => {
  if (seconds < 60) return `${seconds} sec`;
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins < 60) return secs > 0 ? `${mins} min ${secs} sec` : `${mins} min`;
  const hours = Math.floor(mins / 60);
  const remainMins = mins % 60;
  return `${hours}h ${remainMins}m`;
};

const formatCountdown = (ms) => {
  if (ms <= 0) return '00:00:00';
  const hours = Math.floor(ms / (1000 * 60 * 60));
  const mins = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
  const secs = Math.floor((ms % (1000 * 60)) / 1000);
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

// ============================================================
// HUMAN FIGURE SVG COMPONENT
// ============================================================
const HumanFigure = ({ activeChakra, completedChakras, nightMode, imageUrl = null }) => {
  const bodyColor = nightMode ? '#1f2937' : '#374151';
  const strokeColor = nightMode ? '#374151' : '#4b5563';
  
  // Se c'è un'immagine custom, usala come sfondo
  if (imageUrl) {
    return (
      <div className="relative w-20 h-44">
        <img src={imageUrl} alt="Human figure" className="w-full h-full object-contain opacity-70" />
        {/* Overlay chakras */}
        <svg viewBox="0 0 100 220" className="absolute inset-0 w-full h-full">
          {CHAKRAS.map((chakra) => {
            const isActive = activeChakra === chakra.id;
            const isCompleted = completedChakras.includes(chakra.id);
            const yPos = chakra.bodyY * 2.2 + 10;
            
            return (
              <g key={chakra.id}>
                {isActive && (
                  <circle
                    cx="50"
                    cy={yPos}
                    r="14"
                    fill={chakra.color}
                    opacity="0.5"
                    className="animate-pulse"
                  />
                )}
                <circle
                  cx="50"
                  cy={yPos}
                  r={isActive ? 8 : 5}
                  fill={isActive || isCompleted ? chakra.color : 'transparent'}
                  stroke={isActive ? '#fff' : isCompleted ? chakra.color : 'rgba(255,255,255,0.3)'}
                  strokeWidth={isActive ? 2 : 1}
                  className={isActive ? 'animate-pulse' : ''}
                  style={{
                    filter: isActive ? `drop-shadow(0 0 8px ${chakra.color})` : 'none',
                  }}
                />
                {isCompleted && !isActive && (
                  <text x="50" y={yPos + 3} textAnchor="middle" fill="#fff" fontSize="6" fontWeight="bold">✓</text>
                )}
              </g>
            );
          })}
        </svg>
      </div>
    );
  }
  
  // Default SVG figure
  return (
    <svg viewBox="0 0 100 200" className="w-20 h-40">
      <defs>
        <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={bodyColor} />
          <stop offset="100%" stopColor={nightMode ? '#111827' : '#1f2937'} />
        </linearGradient>
      </defs>
      
      <ellipse cx="50" cy="20" rx="15" ry="18" fill="url(#bodyGradient)" stroke={strokeColor} strokeWidth="1"/>
      <rect x="44" y="36" width="12" height="12" fill="url(#bodyGradient)"/>
      <path d="M30 48 L70 48 L65 120 L35 120 Z" fill="url(#bodyGradient)" stroke={strokeColor} strokeWidth="1"/>
      <path d="M30 50 L15 90 L20 92 L32 55" fill="url(#bodyGradient)"/>
      <path d="M70 50 L85 90 L80 92 L68 55" fill="url(#bodyGradient)"/>
      <path d="M38 120 L35 180 L42 180 L48 125" fill="url(#bodyGradient)"/>
      <path d="M62 120 L65 180 L58 180 L52 125" fill="url(#bodyGradient)"/>
      
      {CHAKRAS.map((chakra) => {
        const isActive = activeChakra === chakra.id;
        const isCompleted = completedChakras.includes(chakra.id);
        const yPos = chakra.bodyY * 1.8 + 5;
        
        return (
          <g key={chakra.id}>
            {isActive && (
              <circle
                cx="50"
                cy={yPos}
                r="12"
                fill={chakra.color}
                opacity="0.4"
                className="animate-pulse"
              />
            )}
            <circle
              cx="50"
              cy={yPos}
              r={isActive ? 7 : 4}
              fill={isActive || isCompleted ? chakra.color : bodyColor}
              stroke={isActive ? '#fff' : isCompleted ? chakra.color : strokeColor}
              strokeWidth={isActive ? 2 : 1}
              className={isActive ? 'animate-pulse' : ''}
              style={{
                filter: isActive ? `drop-shadow(0 0 6px ${chakra.color})` : 'none',
                transition: 'all 0.5s ease'
              }}
            />
            {isCompleted && !isActive && (
              <text x="50" y={yPos + 2} textAnchor="middle" fill="#fff" fontSize="5" fontWeight="bold">✓</text>
            )}
          </g>
        );
      })}
    </svg>
  );
};

// ============================================================
// CHAKRA SHAPE ICON
// ============================================================
const ChakraShapeIcon = ({ alignment, color, size = 24 }) => {
  const style = { color, fontSize: size, lineHeight: 1 };
  if (alignment === 'down') return <span style={style}>▼</span>;
  if (alignment === 'up') return <span style={style}>▲</span>;
  return <span style={style}>◇</span>;
};

// ============================================================
// BREATHING PANEL COMPONENT
// ============================================================
const BreathingPanel = ({ breathing, isExpanded, onToggle, nightMode }) => {
  return (
    <div className={`rounded-lg overflow-hidden ${nightMode ? 'bg-black/60' : 'bg-black/40'}`}>
      <button
        onClick={onToggle}
        className="w-full p-2 flex items-center justify-between text-left"
      >
        <div className="flex items-center gap-2">
          <span className="text-sm">🌬️</span>
          <span className={`font-medium text-xs ${nightMode ? 'text-purple-300' : 'text-purple-200'}`}>
            {breathing.name}
          </span>
        </div>
        <span className="text-purple-400 text-xs">{isExpanded ? '▲' : '▼'}</span>
      </button>
      
      {isExpanded && (
        <div className="px-2 pb-2 border-t border-purple-800/50">
          <p className={`text-xs mt-2 mb-2 ${nightMode ? 'text-purple-400' : 'text-purple-300'}`}>
            {breathing.description}
          </p>
          {breathing.steps.length > 0 && (
            <div className={`rounded p-2 ${nightMode ? 'bg-purple-950/50' : 'bg-purple-900/30'}`}>
              {breathing.steps.map((step, i) => (
                <p key={i} className={`text-xs font-mono whitespace-pre-wrap ${nightMode ? 'text-purple-200' : 'text-purple-100'}`}>
                  {step}
                </p>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ============================================================
// TIMER COMPONENT
// ============================================================
const Timer = ({ seconds, nightMode }) => {
  return (
    <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${nightMode ? 'bg-black/60 text-purple-300' : 'bg-black/40 text-purple-200'}`}>
      <span>⏱️</span>
      <span className="font-mono">{formatTime(seconds)}</span>
    </div>
  );
};

// ============================================================
// DEADLINE TIMER COMPONENT
// ============================================================
const DeadlineTimer = ({ nightMode, lastMeditationTime }) => {
  const [status, setStatus] = useState(null);
  const [timeDisplay, setTimeDisplay] = useState('');
  
  useEffect(() => {
    const updateStatus = () => {
      const newStatus = getMeditationStatus(lastMeditationTime);
      setStatus(newStatus);
      
      if (newStatus.status === 'wait_sunrise' && newStatus.timeToWait) {
        setTimeDisplay(formatCountdown(newStatus.timeToWait));
      } else if (newStatus.status === 'can_meditate' && newStatus.timeRemaining) {
        setTimeDisplay(formatCountdown(newStatus.timeRemaining));
      } else {
        setTimeDisplay('--:--:--');
      }
    };
    
    updateStatus();
    const interval = setInterval(updateStatus, 1000);
    return () => clearInterval(interval);
  }, [lastMeditationTime]);
  
  if (!status) return null;
  
  // Already meditated today - waiting for sunrise
  if (status.status === 'wait_sunrise') {
    return (
      <div className={`text-center p-2 rounded-lg ${nightMode ? 'bg-green-950/30' : 'bg-green-900/30'}`}>
        <div className="text-green-400 text-xs">✓ Meditazione completata oggi!</div>
        <div className="text-green-300 text-xs mt-1">Prossima alba tra:</div>
        <div className="font-mono text-lg font-bold text-green-400">
          {timeDisplay}
        </div>
      </div>
    );
  }
  
  // Cycle lost
  if (status.status === 'cycle_lost') {
    return (
      <div className={`text-center p-2 rounded-lg bg-red-900/40`}>
        <div className="text-red-400 text-sm font-bold">⚠️ Ciclo perso!</div>
        <div className="text-red-300 text-xs mt-1">
          Sono passate più di 36h dall'ultima meditazione.
        </div>
        <div className="text-red-200 text-xs mt-1">
          Ricomincia la pratica per costruire un nuovo ciclo.
        </div>
      </div>
    );
  }
  
  // First time
  if (status.status === 'first_time') {
    return (
      <div className={`text-center p-2 rounded-lg ${nightMode ? 'bg-purple-950/30' : 'bg-purple-900/30'}`}>
        <div className={`text-xs ${nightMode ? 'text-purple-300' : 'text-purple-200'}`}>
          🌟 Prima meditazione
        </div>
        <div className="text-purple-400 text-xs mt-1">
          Inizia quando vuoi per avviare il ciclo!
        </div>
      </div>
    );
  }
  
  // Can meditate - show deadline
  const isUrgent = status.timeRemaining && status.timeRemaining < 6 * 60 * 60 * 1000;
  const isCritical = status.timeRemaining && status.timeRemaining < 2 * 60 * 60 * 1000;
  
  return (
    <div className={`text-center p-2 rounded-lg ${
      isCritical ? 'bg-red-900/50' : isUrgent ? 'bg-yellow-900/30' : nightMode ? 'bg-black/40' : 'bg-purple-900/30'
    }`}>
      <div className={`text-xs ${nightMode ? 'text-purple-400' : 'text-purple-300'}`}>
        ⏰ Tempo rimanente per completare
      </div>
      <div className={`font-mono text-lg font-bold ${
        isCritical ? 'text-red-400' : isUrgent ? 'text-yellow-400' : 'text-white'
      }`}>
        {timeDisplay}
      </div>
      {isCritical && (
        <div className="text-red-400 text-xs animate-pulse">⚠️ URGENTE! Rischi di perdere il ciclo!</div>
      )}
      {isUrgent && !isCritical && (
        <div className="text-yellow-400 text-xs">Completa presto la meditazione!</div>
      )}
    </div>
  );
};

// ============================================================
// AFFIRMATION SCREEN COMPONENT
// ============================================================
const AffirmationScreen = ({ onComplete, audioEnabled, nightMode }) => {
  const [count, setCount] = useState(0);
  
  const handleTap = () => {
    const newCount = count + 1;
    
    if (audioEnabled) {
      if (newCount < AFFIRMATION_REPS) {
        AudioSystem.playAffirmationDing();
      } else {
        AudioSystem.playAffirmationComplete();
      }
    }
    
    setCount(newCount);
    
    if (newCount >= AFFIRMATION_REPS) {
      setTimeout(() => {
        onComplete();
      }, 1500);
    }
  };
  
  const isComplete = count >= AFFIRMATION_REPS;
  const textPrimary = nightMode ? 'text-purple-200' : 'text-white';
  const textSecondary = nightMode ? 'text-purple-400' : 'text-purple-300';
  
  return (
    <div className={`min-h-screen bg-gradient-to-b ${nightMode ? 'from-black via-purple-950 to-black' : 'from-gray-900 via-purple-900 to-gray-900'} flex flex-col items-center justify-center p-4`}>
      <div className="text-center max-w-md">
        
        {/* Chakra row */}
        <div className="flex justify-center gap-1.5 mb-4">
          {CHAKRAS.map((c, i) => (
            <div 
              key={c.id}
              className="w-5 h-5 rounded-full"
              style={{ 
                backgroundColor: c.color,
                boxShadow: `0 0 10px ${c.color}66`,
                animation: `pulse 1.5s ease-in-out infinite`,
                animationDelay: `${i * 0.1}s`
              }}
            />
          ))}
        </div>
        
        <div className="text-4xl mb-3">✨</div>
        
        <h2 className={`text-lg font-bold ${textPrimary} mb-2`}>
          Affermazione Finale
        </h2>
        
        <p className={`${textSecondary} text-xs mb-4`}>
          Tocca per ogni ripetizione
        </p>
        
        {/* Counter */}
        <div 
          className={`${nightMode ? 'bg-purple-950/50 border-purple-700' : 'bg-purple-900/60 border-purple-400'} border rounded-xl p-4 mb-4 cursor-pointer transition-all ${!isComplete ? 'hover:scale-102 active:scale-98' : ''}`}
          onClick={!isComplete ? handleTap : undefined}
        >
          {/* Count display */}
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className={`text-4xl font-bold ${isComplete ? 'text-green-400' : textPrimary}`}>
              {count}
            </div>
            <div className={`${textSecondary} text-lg`}>/ {AFFIRMATION_REPS}</div>
          </div>
          
          {/* Progress dots */}
          <div className="flex justify-center gap-2 mb-3">
            {[...Array(AFFIRMATION_REPS)].map((_, i) => (
              <div 
                key={i}
                className={`w-4 h-4 rounded-full transition-all ${
                  i < count ? 'bg-green-500' : nightMode ? 'bg-gray-700' : 'bg-gray-600'
                }`}
              />
            ))}
          </div>
          
          {/* Affirmation text */}
          <p className={`text-sm ${textPrimary} font-bold leading-relaxed`}>
            "{FINAL_AFFIRMATION}"
          </p>
        </div>
        
        {isComplete && (
          <div className="text-green-400 text-lg font-bold animate-pulse">
            ✓ Completato!
          </div>
        )}
        
        {!isComplete && (
          <p className={`${textSecondary} text-xs animate-pulse`}>
            Tocca il riquadro per ogni ripetizione
          </p>
        )}
      </div>
    </div>
  );
};

// ============================================================
// MAIN APP COMPONENT
// ============================================================
export default function ChakraMeditationApp() {
  const [screen, setScreen] = useState('intro');
  const [category, setCategory] = useState(null);
  const [currentChakraIndex, setCurrentChakraIndex] = useState(0);
  const [count, setCount] = useState(0);
  const [targetReps, setTargetReps] = useState(DEFAULT_REPS);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [completedChakras, setCompletedChakras] = useState([]);
  const [breathingExpanded, setBreathingExpanded] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [nightMode, setNightMode] = useState(false);
  
  // Custom image URL (can be set from bot)
  const [humanImageUrl, setHumanImageUrl] = useState(null);
  
  // Last meditation time (from localStorage or bot)
  const [lastMeditationTime, setLastMeditationTime] = useState(null);
  
  // Timer states
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [chakraTimes, setChakraTimes] = useState({});
  const [currentChakraStartTime, setCurrentChakraStartTime] = useState(null);
  const timerRef = useRef(null);
  
  // Session data for summary
  const [sessionData, setSessionData] = useState(null);
  
  // Check meditation status
  const [meditationStatus, setMeditationStatus] = useState(null);

  const currentChakra = CHAKRAS[currentChakraIndex];

  // Load last meditation time from localStorage
  useEffect(() => {
    try {
      const lastCompleted = localStorage.getItem('chakra_meditation_latest');
      if (lastCompleted) {
        const data = JSON.parse(lastCompleted);
        if (data.date) {
          setLastMeditationTime(data.date);
        }
      }
    } catch (e) {
      console.log('Could not load last meditation time');
    }
  }, []);
  
  // Update meditation status
  useEffect(() => {
    const status = getMeditationStatus(lastMeditationTime);
    setMeditationStatus(status);
  }, [lastMeditationTime]);

  // Timer effect
  useEffect(() => {
    if ((screen === 'meditation' || screen === 'affirmation') && !isTransitioning) {
      timerRef.current = setInterval(() => {
        setTotalSeconds(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [screen, isTransitioning]);

  // Check for custom image from URL params or localStorage
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const imgUrl = params.get('human_image') || localStorage.getItem('chakra_human_image');
    if (imgUrl) {
      setHumanImageUrl(imgUrl);
    }
  }, []);

  const handleCategorySelect = (cat) => {
    setCategory(cat);
    setScreen('meditation');
    setCurrentChakraIndex(0);
    setCount(0);
    setCompletedChakras([]);
    setBreathingExpanded(false);
    setTotalSeconds(0);
    setChakraTimes({});
    setCurrentChakraStartTime(Date.now());
  };

  const recordChakraTime = useCallback((chakraId) => {
    if (currentChakraStartTime) {
      const elapsed = Math.floor((Date.now() - currentChakraStartTime) / 1000);
      setChakraTimes(prev => ({
        ...prev,
        [chakraId]: elapsed
      }));
    }
  }, [currentChakraStartTime]);

  const handleCount = useCallback(() => {
    if (isTransitioning) return;
    
    const newCount = count + 1;
    
    if (audioEnabled) {
      if (newCount === targetReps - 1) {
        AudioSystem.playPreLast();
      } else if (newCount === targetReps) {
        AudioSystem.playLast();
      }
    }
    
    setCount(newCount);

    if (newCount >= targetReps) {
      recordChakraTime(currentChakra.id);
      setCompletedChakras(prev => [...prev, currentChakra.id]);
      
      if (currentChakraIndex < CHAKRAS.length - 1) {
        setIsTransitioning(true);
        if (audioEnabled) {
          setTimeout(() => AudioSystem.playChakraComplete(), 300);
        }
        setTimeout(() => {
          setCurrentChakraIndex(currentChakraIndex + 1);
          setCount(0);
          setIsTransitioning(false);
          setBreathingExpanded(false);
          setCurrentChakraStartTime(Date.now());
        }, 2000);
      } else {
        // All chakras complete - go to affirmation
        setTimeout(() => {
          if (audioEnabled) AudioSystem.playMeditationComplete();
          setScreen('affirmation');
        }, 1500);
      }
    }
  }, [count, targetReps, isTransitioning, currentChakraIndex, currentChakra, audioEnabled, recordChakraTime]);

  const handleAffirmationComplete = () => {
    const now = new Date().toISOString();
    
    // Save session data
    const finalSessionData = {
      date: now,
      category: category,
      categoryName: CATEGORIES.find(c => c.id === category)?.name,
      totalDuration: totalSeconds,
      repsPerChakra: targetReps,
      totalReps: targetReps * 7,
      chakraTimes: chakraTimes,
      affirmationReps: AFFIRMATION_REPS,
      completed: true
    };
    
    setSessionData(finalSessionData);
    
    // Update last meditation time
    setLastMeditationTime(now);
    
    // Save to localStorage
    try {
      const saved = JSON.parse(localStorage.getItem('chakra_meditation_history') || '[]');
      saved.push(finalSessionData);
      localStorage.setItem('chakra_meditation_history', JSON.stringify(saved));
      localStorage.setItem('chakra_meditation_latest', JSON.stringify(finalSessionData));
    } catch (e) {
      console.log('Could not save to localStorage');
    }
    
    setScreen('summary');
  };

  const getVibration = (chakra, cat) => {
    return chakra.vibrations[cat] || chakra.vibrations.necronomicon;
  };

  // Theme classes
  const bgGradient = nightMode 
    ? 'from-black via-gray-950 to-black' 
    : 'from-gray-900 via-purple-900 to-gray-900';
  const textPrimary = nightMode ? 'text-purple-200' : 'text-white';
  const textSecondary = nightMode ? 'text-purple-400' : 'text-purple-300';
  const cardBg = nightMode ? 'bg-black/70' : 'bg-purple-900/50';

  // ============================================================
  // INTRO SCREEN
  // ============================================================
  if (screen === 'intro') {
    const canStart = meditationStatus?.canMeditate ?? true;
    
    return (
      <div className={`min-h-screen bg-gradient-to-b ${bgGradient} flex flex-col items-center justify-center p-4`}>
        <div className="text-center max-w-md">
          {/* Night mode toggle */}
          <div className="absolute top-4 right-4">
            <button
              onClick={() => setNightMode(!nightMode)}
              className={`p-2 rounded-full ${nightMode ? 'bg-yellow-500/20 text-yellow-400' : 'bg-purple-800/50 text-purple-300'}`}
            >
              {nightMode ? '☀️' : '🌙'}
            </button>
          </div>
          
          <div className="text-5xl mb-3">🌀</div>
          <h1 className={`text-2xl font-bold ${textPrimary} mb-2`}>
            Meditazione Chakra Completa
          </h1>
          <p className={`${textSecondary} text-xs mb-3`}>
            ⚠️ Prerequisito: L'anima deve essere già aperta
          </p>
          
          {/* Deadline timer - shows correct status */}
          <div className="mb-4">
            <DeadlineTimer nightMode={nightMode} lastMeditationTime={lastMeditationTime} />
          </div>
          
          {/* Show content only if can meditate */}
          {canStart ? (
            <>
              <div className={`${cardBg} rounded-lg p-3 mb-3 text-left`}>
                <p className={`${textPrimary} text-sm mb-2 font-medium`}>4 Passi per ogni Chakra:</p>
                <ol className={`${textSecondary} text-xs space-y-1 list-decimal list-inside`}>
                  <li>Visualizza e allinea il chakra</li>
                  <li>Esegui la respirazione specifica</li>
                  <li>Vibra la parola di potere</li>
                  <li>Medita sul chakra</li>
                </ol>
              </div>
              
              <div className={`${nightMode ? 'bg-yellow-900/20' : 'bg-yellow-900/30'} rounded-lg p-2 mb-3`}>
                <p className="text-yellow-200 text-xs">
                  📌 Scegli UNA categoria e mantienila per TUTTA la sessione
                </p>
              </div>
              
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <label className={`${textSecondary} text-xs`}>Ripetizioni:</label>
                  <input 
                    type="number" 
                    value={targetReps} 
                    onChange={(e) => setTargetReps(Math.max(1, parseInt(e.target.value) || 1))}
                    className={`w-14 ${nightMode ? 'bg-gray-900' : 'bg-purple-800'} text-white rounded px-2 py-1 text-center text-sm`}
                    min="1"
                  />
                </div>
                <button
                  onClick={() => setAudioEnabled(!audioEnabled)}
                  className={`px-2 py-1 rounded text-xs ${audioEnabled ? 'bg-green-600' : 'bg-gray-600'} text-white`}
                >
                  {audioEnabled ? '🔊' : '🔇'}
                </button>
              </div>
              
              <button
                onClick={() => setScreen('category')}
                className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 px-8 rounded-full text-lg transition-all transform hover:scale-105"
              >
                Inizia Meditazione
              </button>
            </>
          ) : (
            /* Already meditated today - show waiting message */
            <div className={`${cardBg} rounded-lg p-4 mt-4`}>
              <p className={`${textPrimary} text-sm text-center`}>
                🧘 Hai già completato la meditazione per questo ciclo.
              </p>
              <p className={`${textSecondary} text-xs text-center mt-2`}>
                Attendi la prossima alba per poter meditare di nuovo.
              </p>
              <p className={`${textSecondary} text-xs text-center mt-2`}>
                I giorni spirituali vanno da alba a alba.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ============================================================
  // CATEGORY SELECTION
  // ============================================================
  if (screen === 'category') {
    return (
      <div className={`min-h-screen bg-gradient-to-b ${bgGradient} flex flex-col items-center justify-center p-4`}>
        <h2 className={`text-xl font-bold ${textPrimary} mb-4`}>
          Scegli la Categoria
        </h2>
        <div className="grid gap-3 w-full max-w-sm">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategorySelect(cat.id)}
              className={`${nightMode ? 'bg-gray-900/70 hover:bg-gray-800/70 border-purple-700' : 'bg-purple-800/50 hover:bg-purple-700/70 border-purple-500'} border rounded-xl p-3 text-left transition-all`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{cat.icon}</span>
                <div>
                  <div className={`${textPrimary} font-bold text-sm`}>{cat.name}</div>
                  <div className={`${textSecondary} text-xs`}>{cat.level}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
        <button
          onClick={() => setScreen('intro')}
          className={`mt-4 ${textSecondary} hover:text-purple-200 text-sm`}
        >
          ← Indietro
        </button>
      </div>
    );
  }

  // ============================================================
  // MEDITATION SCREEN
  // ============================================================
  if (screen === 'meditation') {
    const vibration = getVibration(currentChakra, category);
    const progress = ((currentChakraIndex + (count / targetReps)) / CHAKRAS.length) * 100;
    const isPreLast = count === targetReps - 2;
    const isLastOne = count === targetReps - 1;

    return (
      <div 
        className={`min-h-screen flex flex-col p-3 transition-all duration-1000`}
        style={{ 
          background: nightMode 
            ? `linear-gradient(to bottom, #000, ${currentChakra.color}15, #000)`
            : `linear-gradient(to bottom, #1a1a2e, ${currentChakra.color}22, #1a1a2e)` 
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <Timer seconds={totalSeconds} nightMode={nightMode} />
          <div className={`${textSecondary} text-xs`}>
            {currentChakraIndex + 1}/7 • {CATEGORIES.find(c => c.id === category)?.icon}
          </div>
          <div className="flex gap-2">
            <button onClick={() => setNightMode(!nightMode)} className={`${textSecondary} text-xs`}>
              {nightMode ? '☀️' : '🌙'}
            </button>
            <button onClick={() => setAudioEnabled(!audioEnabled)} className={`${textSecondary} text-xs`}>
              {audioEnabled ? '🔊' : '🔇'}
            </button>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className={`h-1.5 ${nightMode ? 'bg-gray-800' : 'bg-gray-700'} rounded-full overflow-hidden mb-2`}>
          <div 
            className="h-full transition-all duration-300"
            style={{ width: `${progress}%`, backgroundColor: currentChakra.color }}
          />
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col items-center justify-center">
          
          {/* Human figure + Chakra display */}
          <div className="flex items-center justify-center gap-3 mb-3">
            <HumanFigure 
              activeChakra={currentChakra.id} 
              completedChakras={completedChakras}
              nightMode={nightMode}
              imageUrl={humanImageUrl}
            />
            
            {/* Chakra Circle */}
            <div 
              className={`relative w-32 h-32 rounded-full flex items-center justify-center transition-all duration-500 cursor-pointer ${isTransitioning ? 'scale-110 opacity-50' : 'scale-100 opacity-100'}`}
              style={{ 
                backgroundColor: currentChakra.color,
                boxShadow: `0 0 ${nightMode ? '30px' : '40px'} ${currentChakra.color}44`
              }}
              onClick={handleCount}
            >
              <div className="flex items-center gap-1">
                <div className="text-center">
                  <div className={`text-3xl font-bold text-white drop-shadow-lg ${isLastOne ? 'animate-pulse' : ''}`}>
                    {count}
                  </div>
                  <div className="text-white/60 text-xs">/ {targetReps}</div>
                </div>
                <ChakraShapeIcon 
                  alignment={currentChakra.alignment} 
                  color="rgba(255,255,255,0.5)" 
                  size={24}
                />
              </div>
            </div>
          </div>

          {/* Status indicators */}
          {isPreLast && !isTransitioning && (
            <p className="text-yellow-400 text-sm mb-1 animate-pulse">⚡ Penultima!</p>
          )}
          {isLastOne && !isTransitioning && (
            <p className="text-green-400 text-sm mb-1 animate-pulse font-bold">🎯 ULTIMA!</p>
          )}
          {isTransitioning && (
            <p className="text-green-400 text-base font-bold animate-pulse mb-1">✓ Completato!</p>
          )}

          {/* Chakra Info */}
          <div className="text-center mb-2">
            <h2 className={`text-lg font-bold ${textPrimary}`}>
              {currentChakra.name}
            </h2>
            <p className={`${textSecondary} text-xs`}>
              {currentChakra.nameSanskrit} • {currentChakra.colorName} • {currentChakra.day}
            </p>
          </div>

          {/* Vibration */}
          <div className={`${nightMode ? 'bg-black/60' : 'bg-black/40'} rounded-xl p-2 w-full max-w-xs text-center mb-2`}>
            <div 
              className="text-xl font-bold mb-1"
              style={{ color: currentChakra.color }}
            >
              {vibration.word}
            </div>
            <div className={`${textSecondary} text-xs font-mono`}>
              {vibration.pronunciation}
            </div>
          </div>

          {/* Breathing */}
          <div className="w-full max-w-xs mb-2">
            <BreathingPanel 
              breathing={currentChakra.breathing}
              isExpanded={breathingExpanded}
              onToggle={() => setBreathingExpanded(!breathingExpanded)}
              nightMode={nightMode}
            />
          </div>

          {currentChakra.note && (
            <p className="text-yellow-300/70 text-xs text-center">
              ✨ {currentChakra.note}
            </p>
          )}

          {!isTransitioning && !isPreLast && !isLastOne && (
            <p className={`${textSecondary} text-xs mt-2 animate-pulse`}>
              Tocca il chakra per ogni vibrazione
            </p>
          )}
        </div>

        {/* Bottom dots */}
        <div className="flex justify-center gap-1.5 pb-2">
          {CHAKRAS.map((c, i) => (
            <div 
              key={c.id}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                i === currentChakraIndex ? 'ring-1 ring-white ring-opacity-50' : ''
              }`}
              style={{ 
                backgroundColor: completedChakras.includes(c.id) || i === currentChakraIndex 
                  ? c.color 
                  : nightMode ? '#1f2937' : '#374151'
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  // ============================================================
  // AFFIRMATION SCREEN
  // ============================================================
  if (screen === 'affirmation') {
    return (
      <AffirmationScreen 
        onComplete={handleAffirmationComplete}
        audioEnabled={audioEnabled}
        nightMode={nightMode}
      />
    );
  }

  // ============================================================
  // SUMMARY SCREEN
  // ============================================================
  if (screen === 'summary' && sessionData) {
    const avgTimePerChakra = Math.floor(sessionData.totalDuration / 7);
    
    return (
      <div className={`min-h-screen bg-gradient-to-b ${bgGradient} p-4 overflow-auto`}>
        <div className="max-w-md mx-auto">
          
          {/* Header */}
          <div className="text-center mb-4">
            <div className="flex justify-center gap-1.5 mb-3">
              {CHAKRAS.map((c, i) => (
                <div 
                  key={c.id}
                  className="w-5 h-5 rounded-full"
                  style={{ 
                    backgroundColor: c.color,
                    boxShadow: `0 0 10px ${c.color}66`,
                    animation: `pulse 1.5s ease-in-out infinite`,
                    animationDelay: `${i * 0.1}s`
                  }}
                />
              ))}
            </div>
            <div className="text-4xl mb-2">✨</div>
            <h1 className={`text-xl font-bold ${textPrimary}`}>
              Meditazione Completata!
            </h1>
            <p className={`${textSecondary} text-xs mt-1`}>
              Il tuo ciclo è stato mantenuto
            </p>
          </div>

          {/* Stats Card */}
          <div className={`${cardBg} rounded-xl p-4 mb-4`}>
            <h2 className={`${textPrimary} font-bold text-sm mb-3 text-center`}>📊 RIEPILOGO SESSIONE</h2>
            
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className={`${nightMode ? 'bg-black/40' : 'bg-purple-800/40'} rounded-lg p-2 text-center`}>
                <div className="text-2xl">⏱️</div>
                <div className={`${textPrimary} font-bold`}>{formatDuration(sessionData.totalDuration)}</div>
                <div className={`${textSecondary} text-xs`}>Durata totale</div>
              </div>
              <div className={`${nightMode ? 'bg-black/40' : 'bg-purple-800/40'} rounded-lg p-2 text-center`}>
                <div className="text-2xl">🔢</div>
                <div className={`${textPrimary} font-bold`}>{sessionData.totalReps + sessionData.affirmationReps}</div>
                <div className={`${textSecondary} text-xs`}>Vibrazioni + Affermazioni</div>
              </div>
            </div>
            
            <div className={`${nightMode ? 'bg-black/40' : 'bg-purple-800/40'} rounded-lg p-2 mb-3`}>
              <div className="flex justify-between items-center">
                <span className={`${textSecondary} text-xs`}>Categoria:</span>
                <span className={`${textPrimary} text-sm font-medium`}>
                  {CATEGORIES.find(c => c.id === sessionData.category)?.icon} {sessionData.categoryName}
                </span>
              </div>
              <div className="flex justify-between items-center mt-1">
                <span className={`${textSecondary} text-xs`}>Reps per chakra:</span>
                <span className={`${textPrimary} text-sm`}>{sessionData.repsPerChakra}</span>
              </div>
              <div className="flex justify-between items-center mt-1">
                <span className={`${textSecondary} text-xs`}>Affermazioni:</span>
                <span className={`${textPrimary} text-sm`}>{sessionData.affirmationReps}x</span>
              </div>
              <div className="flex justify-between items-center mt-1">
                <span className={`${textSecondary} text-xs`}>Media per chakra:</span>
                <span className={`${textPrimary} text-sm`}>{formatDuration(avgTimePerChakra)}</span>
              </div>
            </div>

            {/* Per-chakra times */}
            <div className={`${textSecondary} text-xs mb-2`}>Tempo per chakra:</div>
            <div className="space-y-1">
              {CHAKRAS.map((c) => {
                const time = sessionData.chakraTimes[c.id] || 0;
                const percentage = sessionData.totalDuration > 0 ? (time / sessionData.totalDuration) * 100 : 0;
                return (
                  <div key={c.id} className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: c.color }}
                    />
                    <div className={`${textSecondary} text-xs flex-shrink-0 w-14`}>{c.name}</div>
                    <div className={`flex-1 h-2 ${nightMode ? 'bg-gray-800' : 'bg-gray-700'} rounded-full overflow-hidden`}>
                      <div 
                        className="h-full rounded-full transition-all"
                        style={{ width: `${percentage}%`, backgroundColor: c.color }}
                      />
                    </div>
                    <div className={`${textPrimary} text-xs w-10 text-right`}>{formatTime(time)}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Next meditation info */}
          <div className={`${nightMode ? 'bg-green-950/30' : 'bg-green-900/30'} rounded-lg p-3 mb-4`}>
            <p className="text-green-400 text-sm text-center font-medium">
              ✓ Ciclo mantenuto!
            </p>
            <p className="text-green-300 text-xs text-center mt-1">
              Prossima meditazione disponibile: dopo l'alba
            </p>
            <p className={`${textSecondary} text-xs text-center mt-1`}>
              Hai 36 ore da adesso per completare la prossima sessione
            </p>
          </div>

          {/* Telegram note */}
          <div className={`${nightMode ? 'bg-blue-950/30' : 'bg-blue-900/30'} rounded-lg p-3 mb-4`}>
            <p className="text-blue-300 text-xs text-center">
              📱 I dati sono stati salvati e sincronizzati con il bot
            </p>
          </div>

          {/* Close button (returns to bot) */}
          <div className="text-center">
            <p className={`${textSecondary} text-xs`}>
              Chiudi questa finestra per tornare al bot
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
