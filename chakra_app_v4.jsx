import React, { useState, useEffect, useCallback, useRef } from 'react';

// ============================================================
// CHAKRA DATA - ESCLUSIVAMENTE DAI PDF "Satanic Power Meditation"
// NESSUNA INVENZIONE - SOLO DATI VERIFICATI
// ============================================================

const CHAKRAS = [
  // ORDINE: Corona → Base (dall'alto verso il basso per la meditazione)
  {
    id: 'crown',
    name: 'Corona',
    nameSanskrit: 'Sahasrara',
    position: 'Cima della testa',
    color: '#8B5CF6', // Viola
    colorName: 'Viola',
    element: 'Acqua',
    planet: 'Giove',
    day: 'Giovedì',
    metal: 'Stagno',
    alignment: 'down', // Punta giù
    petals: '1000 petali (loto)',
    bodyY: 6, // Per figura seduta
    // IMPORTANTE: NON C'È TECNICA DI RESPIRAZIONE PER QUESTO CHAKRA
    breathing: null,
    vibrations: {
      necronomicon: { 
        word: 'MARDUK', 
        pronunciation: 'M-M-M-AH-AH-AH-R-R-R-TH-TH-TH-OO-OO-OO-K-K-K',
        note: 'Roll the R. K is guttural, soft hacking sound in back of throat.'
      }
      // NON C'È CHANT TRADIZIONALE PER QUESTO CHAKRA
    },
    function: 'Illuminazione',
    innerState: 'Beatitudine',
    note: 'Lilith governa la Corona'
  },
  {
    id: 'sixth',
    name: '6° Chakra', // NON "Terzo Occhio" - è DIETRO il terzo occhio
    nameSanskrit: 'Ajna',
    position: 'Dietro il terzo occhio',
    color: '#4F46E5', // Indaco
    colorName: 'Indaco/Blu-violetto',
    element: 'Etere',
    planet: 'Luna',
    day: 'Lunedì',
    metal: 'Argento',
    alignment: 'down',
    petals: '2',
    bodyY: 13,
    breathing: {
      name: 'Kumbhaka Lunar Breath (2 SET)',
      description: 'Esegui ENTRAMBI i set. Stesso numero di round per ciascuno.',
      sets: [
        {
          name: 'SET 1',
          rounds: '6-10 round per nuovi, di più per avanzati',
          steps: [
            'Inspira da entrambe le narici: conta 2',
            'Trattieni: conta 4',
            'Espira: conta 6',
            'Trattieni: conta 4'
          ]
        },
        {
          name: 'SET 2',
          rounds: 'Stesso numero di SET 1',
          steps: [
            'Inspira: conta 6',
            'Trattieni: conta 6',
            'Espira: conta 4',
            '⚠️ NON trattenere alla fine!'
          ]
        }
      ]
    },
    vibrations: {
      necronomicon: { 
        word: 'NANNA', 
        pronunciation: 'N-N-N-N-AH-AH-N-N-N-N-AH-AH',
        alternative: 'THOTH: TH-TH-OH-OH-OH-TH-TH'
      },
      traditional: { 
        word: 'AUM', // NON "OM" - il PDF dice "Ohm" correctly 'AUM'
        pronunciation: 'AH-AH-AH-U-U-U-U-M-M-M-M'
      }
    },
    function: 'Visione psichica',
    innerState: 'Intuizione'
  },
  {
    id: 'throat',
    name: 'Gola',
    nameSanskrit: 'Vishuddi',
    position: 'Gola',
    color: '#0EA5E9', // Blu Cielo
    colorName: 'Blu Cielo',
    element: 'Aria',
    planet: 'Mercurio',
    day: 'Mercoledì',
    metal: 'Mercurio',
    alignment: 'down',
    petals: '16',
    bodyY: 24,
    breathing: {
      name: 'Vibration Breath',
      description: 'Inspira e sull\'espirazione vibra la parola.',
      steps: [
        'Inspira riempiendo i polmoni',
        'Espira vibrando la parola di potere',
        'Continua fino a svuotarti completamente',
        'Ripeti diverse volte'
      ]
    },
    vibrations: {
      necronomicon: { 
        word: 'NEBO', 
        pronunciation: 'N-N-N-NAY-AY-AY-B-B-B-B-OH-OH-OH',
        alternative: 'NINGHIZHIDDA'
      },
      traditional: { 
        word: 'HAM', 
        pronunciation: 'H-H-AH-AH-AH-M-M-M-M',
        tibetan: 'HANG'
      }
    },
    function: 'Comunicazione, auto-espressione',
    innerState: 'Udito psichico, intelletto'
  },
  {
    id: 'heart',
    name: 'Cuore',
    nameSanskrit: 'Anahata',
    position: 'Centro del petto',
    color: '#22C55E', // Verde
    colorName: 'Verde',
    element: 'Fuoco/Aria',
    planet: 'Venere',
    day: 'Venerdì',
    metal: 'Rame',
    alignment: 'yoni', // NON allinea come gli altri - focus sul centro del petto
    petals: '12',
    bodyY: 37,
    breathing: {
      name: 'Alternate Nostril Breathing',
      description: 'Bilancia Ida e Pingala. 3 round per set.',
      steps: [
        '【SET 1 - 3 round】',
        '1. Focus sui 3 chakra inferiori',
        '2. Chiudi DX → Inspira SX (4)',
        '3. Chiudi SX → Espira DX (4)',
        '4. Trattieni dopo espirazione (6)',
        '5. Inspira DX (4) → Chiudi DX → Espira SX (4)',
        '6. Trattieni (6) → Inspira SX (4)...',
        '',
        '【SET 2 - 3 round】',
        '7. Focus sui 3 chakra superiori',
        '8. Inspira SX (4) → Trattieni (6)',
        '9. Espira DX (4) → Inspira DX → Trattieni (6)',
        '10. Espira SX (4)',
        '',
        'Ratio: Inspira 4 / Trattieni 6 / Espira 4'
      ]
    },
    vibrations: {
      necronomicon: { 
        word: 'INANNA', 
        pronunciation: 'EE-EE-EE-EE-N-N-N-N-N-AH-AH-AH-AH-N-N-N-N-N-AH-AH-AH-AH',
        alternative: 'GEBO: G-G-G-G-AY-AY-AY-B-B-B-B-OH-OH-OH-OH'
      },
      traditional: { 
        word: 'YAM', 
        pronunciation: 'Y-Y-AH-AH-AH-M-M-M-M',
        tibetan: 'YANG'
      }
    },
    function: 'Emozioni',
    innerState: 'Sentimenti',
    note: 'Il chakra del cuore NON si allinea come gli altri - focus sul centro del petto'
  },
  {
    id: 'solar',
    name: 'Solare 666',
    nameSanskrit: 'Manipura',
    position: 'Sopra l\'ombelico',
    color: '#F59E0B', // Giallo/Oro
    colorName: 'Giallo',
    element: 'Fuoco',
    planet: 'Sole',
    day: 'Domenica',
    metal: 'Oro',
    alignment: 'down',
    petals: '10',
    bodyY: 50,
    breathing: {
      name: 'Breath of Fire (Kapalabhati)',
      description: '⚠️ NO se incinta/ciclo/pressione alta. Fondazione Kundalini.',
      steps: [
        '1. Contrai addome FORTE e VELOCE (espira)',
        '2. Rilassa - aria entra automaticamente',
        '3. Fai 20 pompaggi rapidi in successione',
        '4. Al 20°: Espira → Inspira a polmoni pieni',
        '5. Contrai ano + abbassa mento al petto',
        '6. TRATTIENI quanto comodo (NON forzare!)',
        '7. Espira lentamente',
        '',
        '= 1 round. Aumenta: 20→30→40→60 pompaggi'
      ]
    },
    vibrations: {
      necronomicon: { 
        word: 'UDDU', 
        pronunciation: 'OO-OO-OO-OO-TH-TH-TH-TH-OO-OO-OO-OO'
      },
      traditional: { 
        word: 'RAM', 
        pronunciation: 'R-R-AH-AH-AH-M-M-M-M',
        tibetan: 'RANG'
      }
    },
    function: 'Volontà, potere, manipolazione',
    innerState: 'Forza di volontà, tempismo',
    note: 'Centrale elettrica dell\'anima - Graal di Lucifero'
  },
  {
    id: 'sacral',
    name: 'Sacrale',
    nameSanskrit: 'Svadhisthana',
    position: 'Tra ombelico e osso pubico',
    color: '#F97316', // Arancione
    colorName: 'Arancione',
    element: 'Acqua',
    planet: 'Marte',
    day: 'Martedì',
    metal: 'Ferro',
    alignment: 'up', // Punta su
    petals: '6',
    bodyY: 60,
    breathing: {
      name: 'Sacral Breath',
      description: 'Attira energia dal Base al Sacrale.',
      steps: [
        '1. Inspira dal naso',
        '2. Visualizza energia che sale da BASE → SACRALE',
        '3. Respira energia nel chakra Sacrale',
        '4. Trattieni: conta 6 (o 4/8 comodo)',
        '5. Espira senza sforzo (lascia cadere l\'aria)',
        '',
        '= 1 round. Ripeti diverse volte.'
      ]
    },
    vibrations: {
      necronomicon: { 
        word: 'NERGAL', 
        pronunciation: 'N-N-N-N-N-N-AIR-AIR-AIR-AIR-AIR-G-G-G-G-G-AH-AH-AH-L-L-L-L'
      },
      traditional: { 
        word: 'VAM', 
        pronunciation: 'V-V-AH-AH-AH-M-M-M-M',
        tibetan: 'VANG'
      }
    },
    function: 'Sessualità, piacere, procreazione, creatività',
    innerState: 'Creatività'
  },
  {
    id: 'base',
    name: 'Base',
    nameSanskrit: 'Muladhara',
    position: 'Base della colonna vertebrale',
    color: '#EF4444', // Rosso
    colorName: 'Rosso',
    element: 'Terra',
    planet: 'Saturno',
    day: 'Sabato',
    metal: 'Piombo',
    alignment: 'up', // Punta su
    petals: '4',
    bodyY: 72,
    breathing: {
      name: 'Base Chakra Breath',
      description: 'Energia su e giù attraverso tutti i chakra.',
      steps: [
        '【INSPIRA】',
        '• Contrai l\'ano',
        '• Visualizza energia in BASE',
        '• Porta energia SU attraverso tutti i chakra → CORONA',
        '• Illumina ogni chakra mentre sali',
        '',
        '【TRATTIENI】',
        '• Nuovi: conta 4',
        '• Medi: conta 10',
        '• Avanzati: quanto comodo',
        '',
        '【ESPIRA】',
        '• Visualizza energia in CORONA',
        '• Porta energia GIÙ attraverso tutti i chakra → BASE',
        '• Illumina ogni chakra mentre scendi',
        '',
        '= 1 round'
      ]
    },
    vibrations: {
      necronomicon: { 
        word: 'NINIB', 
        pronunciation: 'N-N-N-N-N-N-EE-EE-EE-N-N-N-N-N-N-EE-EE-EE-B-B-B-B-B-B-B'
      },
      traditional: { 
        word: 'LAM', 
        pronunciation: 'L-L-AH-AH-AH-M-M-M-M',
        tibetan: 'LANG'
      }
    },
    function: 'Sopravvivenza, radicamento',
    innerState: 'Stabilità',
    note: 'Satana governa la Base'
  }
];

// CATEGORIE DI VIBRAZIONE
const CATEGORIES = [
  { 
    id: 'necronomicon', 
    name: 'Necronomicon', 
    description: 'Nomi degli Dei - Per nuovi e avanzati',
    icon: '📜',
    note: 'Corona non ha chant tradizionale, usa solo Necronomicon'
  },
  { 
    id: 'traditional', 
    name: 'Tradizionale', 
    description: 'Mantra tradizionali - Per nuovi e avanzati',
    icon: '🕉️',
    note: 'Il chakra Corona NON ha chant tradizionale'
  }
];

// AFFERMAZIONE FINALE - VA FATTA SOLO ALLA FINE DOPO TUTTI I 7 CHAKRA
const FINAL_AFFIRMATION = "TUTTI I MIEI CHAKRA SONO COMPLETAMENTE APERTI E L'ENERGIA SPIRITUALE FLUISCE LIBERAMENTE ATTRAVERSO TUTTA LA MIA ANIMA";
const AFFIRMATION_REPS = 3;
const DEFAULT_REPS = 9;

// ============================================================
// AUDIO SYSTEM
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
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = frequency;
      osc.type = type;
      gain.gain.setValueAtTime(volume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + duration);
    } catch (e) { console.log('Audio not available'); }
  },
  playPreLast() { this.playTone(880, 0.2, 'sine', 0.2); },
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
  playAffirmationDing() { this.playTone(698.46, 0.3, 'sine', 0.25); },
  playAffirmationComplete() {
    this.playTone(523.25, 0.2, 'triangle', 0.3);
    setTimeout(() => this.playTone(783.99, 0.2, 'triangle', 0.3), 200);
    setTimeout(() => this.playTone(1046.5, 0.4, 'triangle', 0.4), 400);
  }
};

// ============================================================
// SUNRISE CALCULATION (Per giorni spirituali alba→alba)
// ============================================================
const getSunrise = (date = new Date(), lat = 41.9, lon = 12.5) => {
  const dayOfYear = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
  const baseHour = 6;
  const variation = Math.cos((dayOfYear - 172) * 2 * Math.PI / 365) * 1.5;
  const sunriseHour = baseHour + variation;
  const sunrise = new Date(date);
  sunrise.setHours(Math.floor(sunriseHour), Math.round((sunriseHour % 1) * 60), 0, 0);
  return sunrise;
};

const getTodaySunrise = () => {
  const now = new Date();
  const todaySunrise = getSunrise(now);
  if (now < todaySunrise) {
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    return getSunrise(yesterday);
  }
  return todaySunrise;
};

const getNextSunrise = () => {
  const now = new Date();
  const todaySunrise = getSunrise(now);
  if (now < todaySunrise) return todaySunrise;
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  return getSunrise(tomorrow);
};

const getMeditationStatus = (lastMeditationTime = null) => {
  const now = new Date();
  const currentDaySunrise = getTodaySunrise();
  const nextSunrise = getNextSunrise();
  
  if (!lastMeditationTime) {
    return { canMeditate: true, status: 'first_time', message: 'Prima meditazione - inizia quando vuoi!' };
  }
  
  const lastMed = new Date(lastMeditationTime);
  const deadline = new Date(lastMed.getTime() + 36 * 60 * 60 * 1000);
  const meditatedToday = lastMed >= currentDaySunrise;
  
  if (meditatedToday) {
    return {
      canMeditate: false, status: 'wait_sunrise', deadline, waitUntil: nextSunrise,
      timeToWait: nextSunrise.getTime() - now.getTime(),
      message: 'Meditazione completata! Attendi la prossima alba.'
    };
  }
  
  if (now > deadline) {
    return { canMeditate: true, status: 'cycle_lost', message: '⚠️ Ciclo perso! Ricomincia la pratica.' };
  }
  
  return {
    canMeditate: true, status: 'can_meditate', deadline,
    timeRemaining: deadline.getTime() - now.getTime(), message: 'Puoi meditare ora!'
  };
};

// ============================================================
// UTILITY FUNCTIONS
// ============================================================
const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const formatCountdown = (ms) => {
  if (ms <= 0) return '00:00:00';
  const hours = Math.floor(ms / (1000 * 60 * 60));
  const mins = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
  const secs = Math.floor((ms % (1000 * 60)) / 1000);
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

// ============================================================
// CHAKRA ALIGNMENT ICON
// ============================================================
const AlignmentIcon = ({ alignment, color, size = 20 }) => {
  const style = { color, fontSize: size, lineHeight: 1 };
  if (alignment === 'down') return <span style={style}>▼</span>;
  if (alignment === 'up') return <span style={style}>▲</span>;
  return <span style={style}>◇</span>; // yoni per cuore
};

// ============================================================
// BREATHING PANEL - Mostra come fare la respirazione
// ============================================================
const BreathingPanel = ({ breathing, isExpanded, onToggle, nightMode }) => {
  if (!breathing) {
    // Corona non ha respirazione
    return (
      <div className={`rounded-lg p-3 ${nightMode ? 'bg-purple-950/50' : 'bg-purple-900/30'}`}>
        <div className="flex items-center gap-2 text-yellow-400">
          <span>⚠️</span>
          <span className="text-sm font-medium">Nessuna tecnica di respirazione per questo chakra</span>
        </div>
        <p className={`text-xs mt-2 ${nightMode ? 'text-purple-400' : 'text-purple-300'}`}>
          Passa direttamente alla vibrazione.
        </p>
      </div>
    );
  }

  return (
    <div className={`rounded-lg overflow-hidden ${nightMode ? 'bg-black/60' : 'bg-black/40'}`}>
      <button onClick={onToggle} className="w-full p-3 flex items-center justify-between text-left">
        <div className="flex items-center gap-2">
          <span>🌬️</span>
          <span className={`font-medium text-sm ${nightMode ? 'text-purple-300' : 'text-purple-200'}`}>
            {breathing.name}
          </span>
        </div>
        <span className="text-purple-400">{isExpanded ? '▲' : '▼'}</span>
      </button>
      
      {isExpanded && (
        <div className="px-3 pb-3 border-t border-purple-800/50">
          <p className={`text-xs mt-2 mb-3 ${nightMode ? 'text-yellow-400' : 'text-yellow-300'}`}>
            {breathing.description}
          </p>
          
          {/* Se ha 2 set (come il 6° chakra) */}
          {breathing.sets ? (
            <div className="space-y-3">
              {breathing.sets.map((set, idx) => (
                <div key={idx} className={`rounded p-2 ${nightMode ? 'bg-purple-950/50' : 'bg-purple-900/30'}`}>
                  <div className="text-purple-400 text-xs font-bold mb-1">{set.name}</div>
                  <div className="text-purple-300 text-xs mb-2">{set.rounds}</div>
                  {set.steps.map((step, i) => (
                    <p key={i} className={`text-xs ${nightMode ? 'text-purple-200' : 'text-purple-100'}`}>
                      {step}
                    </p>
                  ))}
                </div>
              ))}
            </div>
          ) : (
            /* Respirazione normale */
            <div className={`rounded p-2 ${nightMode ? 'bg-purple-950/50' : 'bg-purple-900/30'}`}>
              {breathing.steps.map((step, i) => (
                <p key={i} className={`text-xs whitespace-pre-wrap ${
                  step === '' ? 'h-2' : nightMode ? 'text-purple-200' : 'text-purple-100'
                }`}>
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
  
  if (status.status === 'wait_sunrise') {
    return (
      <div className={`text-center p-3 rounded-lg ${nightMode ? 'bg-green-950/30' : 'bg-green-900/30'}`}>
        <div className="text-green-400 text-sm">✓ Meditazione completata oggi!</div>
        <div className="text-green-300 text-xs mt-1">Prossima alba tra:</div>
        <div className="font-mono text-xl font-bold text-green-400">{timeDisplay}</div>
      </div>
    );
  }
  
  if (status.status === 'cycle_lost') {
    return (
      <div className="text-center p-3 rounded-lg bg-red-900/40">
        <div className="text-red-400 text-sm font-bold">⚠️ Ciclo perso!</div>
        <div className="text-red-300 text-xs mt-1">Sono passate più di 36h dall'ultima meditazione.</div>
      </div>
    );
  }
  
  if (status.status === 'first_time') {
    return (
      <div className={`text-center p-3 rounded-lg ${nightMode ? 'bg-purple-950/30' : 'bg-purple-900/30'}`}>
        <div className={`text-sm ${nightMode ? 'text-purple-300' : 'text-purple-200'}`}>🌟 Prima meditazione</div>
        <div className="text-purple-400 text-xs mt-1">Inizia quando vuoi!</div>
      </div>
    );
  }
  
  const isUrgent = status.timeRemaining && status.timeRemaining < 6 * 60 * 60 * 1000;
  const isCritical = status.timeRemaining && status.timeRemaining < 2 * 60 * 60 * 1000;
  
  return (
    <div className={`text-center p-3 rounded-lg ${
      isCritical ? 'bg-red-900/50' : isUrgent ? 'bg-yellow-900/30' : nightMode ? 'bg-black/40' : 'bg-purple-900/30'
    }`}>
      <div className={`text-xs ${nightMode ? 'text-purple-400' : 'text-purple-300'}`}>⏰ Deadline ciclo</div>
      <div className={`font-mono text-xl font-bold ${isCritical ? 'text-red-400' : isUrgent ? 'text-yellow-400' : 'text-white'}`}>
        {timeDisplay}
      </div>
      {isCritical && <div className="text-red-400 text-xs animate-pulse">⚠️ URGENTE!</div>}
    </div>
  );
};

// ============================================================
// AFFIRMATION SCREEN - SOLO ALLA FINE DOPO TUTTI I 7 CHAKRA
// ============================================================
const AffirmationScreen = ({ onComplete, audioEnabled, nightMode }) => {
  const [count, setCount] = useState(0);
  
  const handleTap = () => {
    const newCount = count + 1;
    if (audioEnabled) {
      newCount < AFFIRMATION_REPS ? AudioSystem.playAffirmationDing() : AudioSystem.playAffirmationComplete();
    }
    setCount(newCount);
    if (newCount >= AFFIRMATION_REPS) {
      setTimeout(onComplete, 1500);
    }
  };
  
  const isComplete = count >= AFFIRMATION_REPS;
  const textPrimary = nightMode ? 'text-purple-200' : 'text-white';
  const textSecondary = nightMode ? 'text-purple-400' : 'text-purple-300';
  
  return (
    <div className={`min-h-screen bg-gradient-to-b ${nightMode ? 'from-black via-purple-950 to-black' : 'from-gray-900 via-purple-900 to-gray-900'} flex flex-col items-center justify-center p-4`}>
      <div className="text-center max-w-md">
        {/* Rainbow chakra dots */}
        <div className="flex justify-center gap-2 mb-6">
          {CHAKRAS.map((c, i) => (
            <div key={c.id} className="w-6 h-6 rounded-full" style={{ 
              backgroundColor: c.color, 
              boxShadow: `0 0 15px ${c.color}88`,
              animation: `pulse 1.5s ease-in-out infinite`,
              animationDelay: `${i * 0.1}s`
            }}/>
          ))}
        </div>
        
        <div className="text-5xl mb-4">✨</div>
        <h2 className={`text-xl font-bold ${textPrimary} mb-2`}>Affermazione Finale</h2>
        <p className={`${textSecondary} text-sm mb-6`}>
          Ripeti l'affermazione {AFFIRMATION_REPS} volte ad alta voce
        </p>
        
        <div 
          className={`${nightMode ? 'bg-purple-950/50 border-purple-700' : 'bg-purple-900/60 border-purple-400'} border-2 rounded-xl p-6 mb-6 cursor-pointer transition-all ${!isComplete ? 'hover:scale-102 active:scale-98' : ''}`}
          onClick={!isComplete ? handleTap : undefined}
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className={`text-5xl font-bold ${isComplete ? 'text-green-400' : textPrimary}`}>{count}</div>
            <div className={`${textSecondary} text-2xl`}>/ {AFFIRMATION_REPS}</div>
          </div>
          
          <div className="flex justify-center gap-3 mb-4">
            {[...Array(AFFIRMATION_REPS)].map((_, i) => (
              <div key={i} className={`w-5 h-5 rounded-full transition-all ${i < count ? 'bg-green-500 shadow-lg shadow-green-500/50' : nightMode ? 'bg-gray-700' : 'bg-gray-600'}`}/>
            ))}
          </div>
          
          <p className={`text-base ${textPrimary} font-bold leading-relaxed italic`}>
            "{FINAL_AFFIRMATION}"
          </p>
        </div>
        
        {isComplete && <div className="text-green-400 text-xl font-bold animate-pulse">✓ Completato!</div>}
        {!isComplete && <p className={`${textSecondary} text-sm animate-pulse`}>Tocca dopo ogni ripetizione</p>}
      </div>
    </div>
  );
};

// ============================================================
// MAIN APP
// ============================================================
export default function ChakraMeditationApp() {
  const [screen, setScreen] = useState('intro');
  const [category, setCategory] = useState(null);
  const [currentChakraIndex, setCurrentChakraIndex] = useState(0);
  const [count, setCount] = useState(0);
  const [targetReps, setTargetReps] = useState(DEFAULT_REPS);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [completedChakras, setCompletedChakras] = useState([]);
  const [breathingExpanded, setBreathingExpanded] = useState(true); // Aperto di default
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [nightMode, setNightMode] = useState(true);
  const [lastMeditationTime, setLastMeditationTime] = useState(null);
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [meditationStatus, setMeditationStatus] = useState(null);
  const timerRef = useRef(null);

  const currentChakra = CHAKRAS[currentChakraIndex];

  // Load saved data
  useEffect(() => {
    try {
      const lastCompleted = localStorage.getItem('chakra_meditation_latest');
      if (lastCompleted) {
        const data = JSON.parse(lastCompleted);
        if (data.date) setLastMeditationTime(data.date);
      }
    } catch (e) { console.log('Could not load'); }
  }, []);
  
  useEffect(() => {
    setMeditationStatus(getMeditationStatus(lastMeditationTime));
  }, [lastMeditationTime]);

  // Timer
  useEffect(() => {
    if (screen === 'meditation' && !isTransitioning) {
      timerRef.current = setInterval(() => setTotalSeconds(prev => prev + 1), 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [screen, isTransitioning]);

  const handleCategorySelect = (cat) => {
    // Se categoria è tradizionale e il chakra non ha vibrazione tradizionale, avvisa
    setCategory(cat);
    setScreen('meditation');
    setCurrentChakraIndex(0);
    setCount(0);
    setCompletedChakras([]);
    setBreathingExpanded(true);
    setTotalSeconds(0);
  };

  const handleCount = useCallback(() => {
    if (isTransitioning) return;
    const newCount = count + 1;
    if (audioEnabled) {
      if (newCount === targetReps - 1) AudioSystem.playPreLast();
      else if (newCount === targetReps) AudioSystem.playLast();
    }
    setCount(newCount);

    if (newCount >= targetReps) {
      setCompletedChakras(prev => [...prev, currentChakra.id]);
      
      if (currentChakraIndex < CHAKRAS.length - 1) {
        setIsTransitioning(true);
        if (audioEnabled) setTimeout(() => AudioSystem.playChakraComplete(), 300);
        setTimeout(() => {
          setCurrentChakraIndex(currentChakraIndex + 1);
          setCount(0);
          setIsTransitioning(false);
          setBreathingExpanded(true);
        }, 2000);
      } else {
        // TUTTI I 7 CHAKRA COMPLETATI → VAI ALL'AFFERMAZIONE FINALE
        setTimeout(() => {
          if (audioEnabled) AudioSystem.playMeditationComplete();
          setScreen('affirmation');
        }, 1500);
      }
    }
  }, [count, targetReps, isTransitioning, currentChakraIndex, currentChakra, audioEnabled]);

  const handleAffirmationComplete = () => {
    const now = new Date().toISOString();
    setLastMeditationTime(now);
    try {
      localStorage.setItem('chakra_meditation_latest', JSON.stringify({ date: now, category }));
    } catch (e) {}
    setScreen('complete');
  };

  const getVibration = (chakra, cat) => {
    // Se la categoria non esiste per questo chakra, usa necronomicon
    return chakra.vibrations[cat] || chakra.vibrations.necronomicon;
  };

  const bgGradient = nightMode ? 'from-black via-gray-950 to-black' : 'from-gray-900 via-purple-900 to-gray-900';
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
        <div className="text-center max-w-md w-full">
          <div className="absolute top-4 right-4">
            <button onClick={() => setNightMode(!nightMode)} className={`p-2 rounded-full ${nightMode ? 'bg-yellow-500/20 text-yellow-400' : 'bg-purple-800/50 text-purple-300'}`}>
              {nightMode ? '☀️' : '🌙'}
            </button>
          </div>
          
          <div className="text-6xl mb-4">🌀</div>
          <h1 className={`text-2xl font-bold ${textPrimary} mb-2`}>Full Chakra Meditation</h1>
          <p className={`${textSecondary} text-sm mb-4`}>Basata sui testi di Joy of Satan</p>
          
          <div className="mb-4">
            <DeadlineTimer nightMode={nightMode} lastMeditationTime={lastMeditationTime} />
          </div>
          
          {canStart ? (
            <>
              <div className={`${cardBg} rounded-lg p-4 mb-4 text-left`}>
                <p className={`${textPrimary} text-sm mb-2 font-bold`}>4 Passi per ogni Chakra:</p>
                <ol className={`${textSecondary} text-sm space-y-1 list-decimal list-inside`}>
                  <li>Allinea correttamente il chakra</li>
                  <li>Esegui la respirazione specifica</li>
                  <li>Vibra la parola di potere</li>
                  <li>Medita sul chakra</li>
                </ol>
              </div>
              
              <div className={`${nightMode ? 'bg-yellow-900/30' : 'bg-yellow-900/40'} rounded-lg p-3 mb-4`}>
                <p className="text-yellow-200 text-sm">⚠️ L'anima deve essere già aperta prima di fare questa meditazione!</p>
              </div>
              
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <label className={`${textSecondary} text-sm`}>Ripetizioni:</label>
                  <input type="number" value={targetReps} onChange={(e) => setTargetReps(Math.max(1, parseInt(e.target.value) || 1))}
                    className={`w-16 ${nightMode ? 'bg-gray-900' : 'bg-purple-800'} text-white rounded px-2 py-1 text-center`} min="1"/>
                </div>
                <button onClick={() => setAudioEnabled(!audioEnabled)} className={`px-3 py-1 rounded ${audioEnabled ? 'bg-green-600' : 'bg-gray-600'} text-white`}>
                  {audioEnabled ? '🔊' : '🔇'}
                </button>
              </div>
              
              <button onClick={() => setScreen('category')} className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 px-8 rounded-full text-lg transition-all transform hover:scale-105 w-full">
                Inizia Meditazione
              </button>
            </>
          ) : (
            <div className={`${cardBg} rounded-lg p-4`}>
              <p className={`${textPrimary} text-sm text-center`}>🧘 Meditazione completata per oggi.</p>
              <p className={`${textSecondary} text-xs text-center mt-2`}>I giorni spirituali vanno da alba a alba.</p>
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
        <h2 className={`text-xl font-bold ${textPrimary} mb-2`}>Scegli la Categoria</h2>
        <p className={`${textSecondary} text-sm mb-6`}>Mantieni la stessa per tutta la sessione</p>
        
        <div className="grid gap-4 w-full max-w-sm">
          {CATEGORIES.map((cat) => (
            <button key={cat.id} onClick={() => handleCategorySelect(cat.id)}
              className={`${nightMode ? 'bg-gray-900/70 hover:bg-gray-800/70 border-purple-700' : 'bg-purple-800/50 hover:bg-purple-700/70 border-purple-500'} border rounded-xl p-4 text-left transition-all`}>
              <div className="flex items-center gap-3">
                <span className="text-3xl">{cat.icon}</span>
                <div>
                  <div className={`${textPrimary} font-bold`}>{cat.name}</div>
                  <div className={`${textSecondary} text-sm`}>{cat.description}</div>
                </div>
              </div>
              {cat.note && <p className="text-yellow-400/70 text-xs mt-2">⚠️ {cat.note}</p>}
            </button>
          ))}
        </div>
        
        <button onClick={() => setScreen('intro')} className={`mt-6 ${textSecondary} hover:text-purple-200`}>← Indietro</button>
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
    
    // Avviso se categoria tradizionale ma chakra non ha vibrazione tradizionale
    const noTraditional = category === 'traditional' && !currentChakra.vibrations.traditional;

    return (
      <div className="min-h-screen flex flex-col p-4 transition-all duration-1000"
        style={{ background: nightMode ? `linear-gradient(to bottom, #000, ${currentChakra.color}15, #000)` : `linear-gradient(to bottom, #1a1a2e, ${currentChakra.color}22, #1a1a2e)` }}>
        
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${nightMode ? 'bg-black/60' : 'bg-black/40'}`}>
            <span>⏱️</span>
            <span className="font-mono text-white">{formatTime(totalSeconds)}</span>
          </div>
          <div className={`${textSecondary} text-sm`}>{currentChakraIndex + 1}/7</div>
          <div className="flex gap-2">
            <button onClick={() => setAudioEnabled(!audioEnabled)} className={`${textSecondary}`}>{audioEnabled ? '🔊' : '🔇'}</button>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className={`h-2 ${nightMode ? 'bg-gray-800' : 'bg-gray-700'} rounded-full overflow-hidden mb-4`}>
          <div className="h-full transition-all duration-300" style={{ width: `${progress}%`, backgroundColor: currentChakra.color }}/>
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col items-center justify-center">
          
          {/* Chakra name and info */}
          <div className="text-center mb-4">
            <div className="flex items-center justify-center gap-2 mb-1">
              <h2 className={`text-2xl font-bold ${textPrimary}`}>{currentChakra.name}</h2>
              <AlignmentIcon alignment={currentChakra.alignment} color={currentChakra.color} size={24}/>
            </div>
            <p className={`${textSecondary} text-sm`}>{currentChakra.nameSanskrit} • {currentChakra.colorName}</p>
            <p className={`${textSecondary} text-xs`}>{currentChakra.planet} • {currentChakra.day}</p>
          </div>

          {/* Counter circle */}
          <div 
            className={`relative w-36 h-36 rounded-full flex items-center justify-center transition-all duration-500 cursor-pointer mb-4 ${isTransitioning ? 'scale-110 opacity-50' : 'scale-100 opacity-100'}`}
            style={{ backgroundColor: currentChakra.color, boxShadow: `0 0 50px ${currentChakra.color}66` }}
            onClick={handleCount}
          >
            <div className="text-center">
              <div className={`text-4xl font-bold text-white drop-shadow-lg ${isLastOne ? 'animate-pulse' : ''}`}>{count}</div>
              <div className="text-white/60 text-sm">/ {targetReps}</div>
            </div>
          </div>

          {/* Status messages */}
          {isPreLast && !isTransitioning && <p className="text-yellow-400 text-sm mb-2 animate-pulse">⚡ Penultima!</p>}
          {isLastOne && !isTransitioning && <p className="text-green-400 text-sm mb-2 animate-pulse font-bold">🎯 ULTIMA!</p>}
          {isTransitioning && <p className="text-green-400 text-lg font-bold animate-pulse mb-2">✓ Completato!</p>}

          {/* Vibration box */}
          {noTraditional && (
            <div className="bg-yellow-900/40 rounded-lg p-2 mb-3 max-w-xs">
              <p className="text-yellow-300 text-xs text-center">⚠️ Questo chakra non ha chant tradizionale - uso Necronomicon</p>
            </div>
          )}
          
          <div className={`${nightMode ? 'bg-black/60' : 'bg-black/40'} rounded-xl p-4 w-full max-w-xs text-center mb-4`}>
            <div className="text-2xl font-bold mb-2" style={{ color: currentChakra.color }}>{vibration.word}</div>
            <div className={`${textSecondary} text-sm font-mono leading-relaxed`}>{vibration.pronunciation}</div>
            {vibration.alternative && (
              <div className={`${textSecondary} text-xs mt-2 opacity-70`}>Alternativa: {vibration.alternative}</div>
            )}
            {vibration.note && (
              <div className="text-yellow-400/70 text-xs mt-2">{vibration.note}</div>
            )}
          </div>

          {/* Breathing panel */}
          <div className="w-full max-w-xs mb-4">
            <BreathingPanel 
              breathing={currentChakra.breathing} 
              isExpanded={breathingExpanded} 
              onToggle={() => setBreathingExpanded(!breathingExpanded)} 
              nightMode={nightMode}
            />
          </div>

          {/* Notes */}
          {currentChakra.note && <p className="text-yellow-300/70 text-xs text-center mb-2">✨ {currentChakra.note}</p>}
          
          {!isTransitioning && !isPreLast && !isLastOne && (
            <p className={`${textSecondary} text-sm animate-pulse`}>Tocca per ogni vibrazione</p>
          )}
        </div>

        {/* Chakra dots */}
        <div className="flex justify-center gap-2 pb-4">
          {CHAKRAS.map((c, i) => (
            <div key={c.id} className={`w-3 h-3 rounded-full transition-all ${i === currentChakraIndex ? 'ring-2 ring-white ring-opacity-50 scale-125' : ''}`}
              style={{ backgroundColor: completedChakras.includes(c.id) || i === currentChakraIndex ? c.color : nightMode ? '#1f2937' : '#374151' }}/>
          ))}
        </div>
      </div>
    );
  }

  // ============================================================
  // AFFIRMATION SCREEN
  // ============================================================
  if (screen === 'affirmation') {
    return <AffirmationScreen onComplete={handleAffirmationComplete} audioEnabled={audioEnabled} nightMode={nightMode}/>;
  }

  // ============================================================
  // COMPLETE SCREEN
  // ============================================================
  if (screen === 'complete') {
    return (
      <div className={`min-h-screen bg-gradient-to-b ${bgGradient} flex flex-col items-center justify-center p-4`}>
        <div className="text-center max-w-md">
          <div className="flex justify-center gap-2 mb-6">
            {CHAKRAS.map((c, i) => (
              <div key={c.id} className="w-6 h-6 rounded-full" style={{ 
                backgroundColor: c.color, 
                boxShadow: `0 0 15px ${c.color}88`,
                animation: `pulse 1.5s ease-in-out infinite`,
                animationDelay: `${i * 0.1}s`
              }}/>
            ))}
          </div>
          
          <div className="text-6xl mb-4">🎉</div>
          <h1 className={`text-2xl font-bold ${textPrimary} mb-2`}>Meditazione Completata!</h1>
          <p className={`${textSecondary} mb-6`}>Tutti i 7 chakra sono stati potenziati</p>
          
          <div className={`${nightMode ? 'bg-green-950/30' : 'bg-green-900/30'} rounded-lg p-4 mb-6`}>
            <p className="text-green-400 font-medium">✓ Ciclo mantenuto!</p>
            <p className="text-green-300 text-sm mt-1">Prossima meditazione: dopo la prossima alba</p>
          </div>
          
          <button 
            onClick={() => {
              setScreen('intro');
              setCompletedChakras([]);
              setCurrentChakraIndex(0);
              setCount(0);
              setTotalSeconds(0);
            }}
            className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 px-8 rounded-full"
          >
            Torna alla Home
          </button>
        </div>
      </div>
    );
  }

  return null;
}
