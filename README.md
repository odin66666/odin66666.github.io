# 🔢 WebApp Contatore Vibrazioni

Questa WebApp permette di contare le vibrazioni/ripetizioni con **audio automatico**!

## 📁 STRUTTURA FILE

```
webapp/
├── counter.html          # La WebApp (da hostare)
├── audio/
│   ├── it/               # Audio italiano
│   │   ├── 10.mp3
│   │   ├── 20.mp3
│   │   ├── 30.mp3
│   │   ├── 40.mp3
│   │   ├── 50.mp3
│   │   ├── 60.mp3
│   │   ├── 70.mp3
│   │   ├── 80.mp3
│   │   ├── 90.mp3
│   │   ├── 100.mp3
│   │   ├── 108.mp3
│   │   ├── last.mp3      # "Ultima ripetizione!"
│   │   └── complete.mp3  # Suono finale / "Completato!"
│   │
│   ├── en/               # English audio
│   │   └── (stessi file)
│   │
│   ├── de/               # German audio
│   │   └── (stessi file)
│   │
│   └── sa/               # Sanskrit (opzionale)
│       └── (stessi file)
```

## 🎵 FILE AUDIO NECESSARI (per ogni lingua)

| File | Contenuto | Note |
|------|-----------|------|
| `10.mp3` | "Dieci" | Milestone |
| `20.mp3` | "Venti" | Milestone |
| `30.mp3` | "Trenta" | Milestone |
| `40.mp3` | "Quaranta" | Milestone |
| `50.mp3` | "Cinquanta" | Milestone |
| `60.mp3` | "Sessanta" | Milestone |
| `70.mp3` | "Settanta" | Milestone |
| `80.mp3` | "Ottanta" | Milestone |
| `90.mp3` | "Novanta" | Milestone |
| `100.mp3` | "Cento" | Milestone |
| `108.mp3` | "Centootto" | Milestone speciale |
| `last.mp3` | "Ultima!" | Avviso penultima |
| `complete.mp3` | Campanella o "Completato!" | Suono finale |

**Totale: 13 file per lingua**

## 🌐 HOSTING (gratuito con GitHub Pages)

### Passo 1: Crea repository GitHub
1. Vai su github.com e crea nuovo repository (es. `astro-bot-webapp`)
2. Carica la cartella `webapp/` nel repository

### Passo 2: Attiva GitHub Pages
1. Vai in Settings → Pages
2. Source: `main` branch, cartella `/root` o `/docs`
3. Salva

### Passo 3: Ottieni URL
Dopo qualche minuto avrai:
- WebApp: `https://TUOUSERNAME.github.io/astro-bot-webapp/counter.html`
- Audio: `https://TUOUSERNAME.github.io/astro-bot-webapp/audio`

## ⚙️ CONFIGURAZIONE BOT

Aggiungi al tuo file `.env`:

```env
COUNTER_WEBAPP_URL=https://TUOUSERNAME.github.io/astro-bot-webapp/counter.html
COUNTER_AUDIO_URL=https://TUOUSERNAME.github.io/astro-bot-webapp/audio
```

Oppure in `config.py`:

```python
COUNTER_WEBAPP_URL = "https://TUOUSERNAME.github.io/astro-bot-webapp/counter.html"
COUNTER_AUDIO_URL = "https://TUOUSERNAME.github.io/astro-bot-webapp/audio"
```

## 🎤 COME CREARE GLI AUDIO

### Opzione 1: Registra tu stesso
Usa il telefono o un microfono per registrare i numeri.

### Opzione 2: Text-to-Speech online
- [Google Text-to-Speech](https://cloud.google.com/text-to-speech)
- [Amazon Polly](https://aws.amazon.com/polly/)
- [ttsmp3.com](https://ttsmp3.com/) (gratuito)

### Opzione 3: Suoni semplici
Per i milestone puoi usare semplici "beep" o campane invece dei numeri parlati.

## 🔧 TEST LOCALE

Puoi testare la WebApp localmente aprendo `counter.html` nel browser.
Aggiungi parametri URL per simulare:

```
counter.html?work_id=test&total=40&name=Test&lang=it
```

## 📱 FUNZIONALITÀ WEBAPP

- ✅ Contatore con bottoni grandi (touch-friendly)
- ✅ Barra progresso visiva
- ✅ Audio automatico ogni 10 ripetizioni
- ✅ Audio speciale per ultima e completamento
- ✅ Salvataggio locale (riprende se chiudi per errore)
- ✅ Tema che si adatta a Telegram
- ✅ Toggle per disattivare suoni
- ✅ Comunicazione con il bot alla chiusura

## ⚠️ NOTE IMPORTANTI

1. **HTTPS obbligatorio**: Telegram WebApp richiede HTTPS (GitHub Pages lo fornisce gratis)

2. **Audio mobile**: Su iOS/Android l'audio potrebbe richiedere un primo tap per attivarsi (limitazione browser)

3. **Fallback**: Se non configuri COUNTER_WEBAPP_URL, il bot usa il contatore inline (senza audio automatico)

## 🐛 TROUBLESHOOTING

**Audio non si sente:**
- Verifica che i file .mp3 siano nel percorso corretto
- Controlla la console del browser per errori
- Su mobile, prova a tappare prima di aspettarti l'audio

**WebApp non si apre:**
- Verifica che l'URL sia HTTPS
- Controlla che GitHub Pages sia attivo
- Prova l'URL direttamente nel browser

**Dati non salvati:**
- La WebApp usa `localStorage` per salvare il progresso temporaneo
- Quando completi e chiudi, invia i dati al bot via `sendData()`
