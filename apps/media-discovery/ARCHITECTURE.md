# Architecture & Data Flow Diagrams

## 1. Component Hierarchy

```
App (TV Show Detail Page)
│
├── Backdrop (Background image)
├── DetailHero (Title, poster, year)
├── CastSection (Actor information)
│
├── VideoSection ⭐ (Updated)
│   └── VideoPlayer (one per selected video) ⭐ NEW
│       └── GeminiAudioControl (Audio interaction) ⭐ NEW
│
├── RelatedSection (Similar shows, recommendations)
└── Footer
```

## 2. Audio Interaction Flow

```
User clicks video
    ↓
VideoPlayer opens (modal)
    ↓
User clicks microphone button
    ↓
Browser requests microphone permission
    ↓
MediaRecorder starts recording
    ↓
User speaks question
    ↓
User releases (stops recording)
    ↓
Audio blob created from MediaRecorder
    ↓
Convert to base64
    ↓
POST to /api/gemini-audio
    ↓
Backend receives audio data
    ↓
Process with Google Gemini API
    ↓
Return transcription + response
    ↓
Display in chat panel
    ↓
(Optional) Play audio response via Web Audio API
```

## 3. API Request/Response Flow

```
Frontend                        Backend                     Google Gemini
   │                              │                              │
   ├─ Record audio ──────────────→│                              │
   │  (base64 encoded)            │                              │
   │                              ├─ Send to Gemini ──────────→│
   │                              │  with context              │
   │                              │                            ├─ Process question
   │                              │                            ├─ Generate response
   │                              │←─ Return response ────────│
   │←─ Return response ───────────┤                            │
   │  + transcription             │                            │
   │  + AI response               │                            │
   │                              │                            │
```

## 4. Component Communication

```
VideoSection
    │
    ├─ Manages video state
    │  (selected video, isOpen)
    │
    ├─ Renders video grid
    │
    └─ Opens VideoPlayer when clicked
        │
        └─ VideoPlayer
            │
            ├─ Renders iframe for YouTube
            │
            ├─ Manages modal state
            │  (fullscreen, closed)
            │
            └─ Contains GeminiAudioControl
                │
                ├─ Records audio
                │
                ├─ Sends to backend
                │
                └─ Displays messages
```

## 5. State Management

```
VideoSection
├─ selectedVideo: Video | null
└─ Passes to: VideoPlayer → onClose()

VideoPlayer
├─ isOpen: boolean
├─ isFullscreen: boolean
└─ Passes videoTitle to: GeminiAudioControl

GeminiAudioControl
├─ isListening: boolean
├─ isProcessing: boolean
├─ messages: AudioMessage[]
├─ showMessages: boolean
└─ refs
   ├─ mediaRecorderRef
   ├─ audioChunksRef
   ├─ streamRef
   └─ messagesEndRef (auto-scroll)
```

## 6. File Structure

```
media-discovery/
│
├── src/
│   ├── components/
│   │   └── detail/
│   │       ├── VideoPlayer.tsx ⭐ NEW
│   │       ├── GeminiAudioControl.tsx ⭐ NEW
│   │       ├── VideoSection.tsx (UPDATED)
│   │       ├── index.ts (UPDATED)
│   │       └── ... (other components)
│   │
│   ├── app/
│   │   ├── tv/
│   │   │   └── [id]/
│   │   │       └── page.tsx (uses VideoSection)
│   │   │
│   │   └── api/
│   │       └── gemini-audio/ ⭐ NEW
│   │           └── route.ts
│   │
│   └── lib/
│       ├── tmdb.ts (existing)
│       └── ...
│
├── .env (UPDATED with API key)
├── package.json (UPDATED with @google/generative-ai)
├── VIDEO_PLAYER_GUIDE.md ⭐ NEW
├── QUICK_START.md ⭐ NEW
├── IMPLEMENTATION_SUMMARY.md ⭐ NEW
└── setup-video-player.sh ⭐ NEW
```

## 7. Technology Stack

```
Frontend
├─ React 19.0.0 (UI framework)
├─ Next.js 15.0.3 (framework)
├─ TypeScript (type safety)
├─ Tailwind CSS (styling)
└─ Web Audio API (recording)

Backend
├─ Next.js API Routes (serverless)
└─ Google Generative AI SDK (@google/generative-ai)

External Services
├─ YouTube (video hosting/iframe)
├─ Google Generative AI (Gemini API)
└─ TMDB (media database)
```

## 8. Audio Processing Pipeline

```
User's Microphone
    ↓
Web Audio API - MediaRecorder
    ↓
Audio Blob (webm/opus)
    ↓
FileReader API
    ↓
Base64 Encoding
    ↓
JSON Payload
    ↓
HTTP POST Request
    ↓
Backend Processing
    ↓
Google Generative AI API
    ↓
Text Response
    ↓
Display in Chat UI
    ↓
(Optional) Web Audio API - Playback
```

## 9. Error Handling Flow

```
User Action
    ↓
Try {
    ├─ Get Microphone
    ├─ Record Audio
    ├─ Send to API
    ├─ Process Response
    └─ Display Messages
} Catch Error {
    ├─ Log to console
    ├─ Reset UI state
    ├─ Show error indication
    └─ Allow retry
}
```

## 10. User Journey Map

```
Start
  │
  ├─ Browse Shows
  │   ├─ Search Results
  │   └─ Show Details
  │       │
  │       ├─ Read Info
  │       ├─ View Cast
  │       │
  │       └─ Browse Videos ←──────────────┐
  │           │                           │
  │           ├─ Click Video Thumbnail    │
  │           │   │                       │
  │           │   ├─ VideoPlayer Opens    │
  │           │   │   │                   │
  │           │   │   ├─ Watch Video      │
  │           │   │   │                   │
  │           │   │   ├─ Click Microphone │
  │           │   │   │   │               │
  │           │   │   │   ├─ Speak Q&A ───→ Get Response
  │           │   │   │   │
  │           │   │   │   └─ View Chat ────→ Ask More?
  │           │   │   │
  │           │   │   └─ Close (ESC)
  │           │   │
  │           │   └─ Select Another Video ─┘
  │           │
  │           └─ Back to Show Details
  │
  └─ End
```

## 11. Security & Data Flow

```
User's Browser
├─ Microphone Audio (local)
├─ No storage in browser
└─ Sent to backend via HTTPS

Backend Server
├─ Receives base64 audio
├─ Passes to Google Gemini
├─ No local storage
└─ Returns response

Google Servers
├─ Processes with Gemini
├─ May log for quality
├─ Governed by Google's privacy policy
└─ Returns text response

Response
├─ Returned to frontend
├─ Displayed in chat
├─ Can be audio-encoded (future)
└─ Stored in browser memory only
```

## 12. Sequence Diagram - User Interaction

```
User          Frontend        Backend         Google API
  │               │              │                │
  ├─ Click ──────→│              │                │
  │  video        │              │                │
  │               │── open────→   │                │
  │            (modal)            │                │
  │               │              │                │
  ├─ Speak ──────→│              │                │
  │               │──record────→  │                │
  │               │  (base64)     │                │
  │               │               │                │
  │               │───────────────POST─────→      │
  │               │               │    (audio)    │
  │               │               │               │
  │               │               │──request────→│
  │               │               │  (question)  │
  │               │               │               │
  │               │               │←response─────│
  │               │               │  (answer)    │
  │               │←──response────│               │
  │               │  (text)       │               │
  │←──display────│               │                │
  │  message     │               │                │
  │               │               │                │
  ├─ View ──────→│               │                │
  │  chat        │               │                │
  │               │               │                │
  └────Close─────→│               │                │
                  │──close───→    │                │
```

## 13. Performance Optimization

```
Initial Load
├─ Video Section renders
│  └─ Thumbnails lazy-load
│     └─ Only visible thumbnails fetch images

On Video Click
├─ VideoPlayer opens
│  └─ YouTube iframe embedded (cached by browser)

Audio Processing
├─ Happens on Web Worker thread
├─ UI remains responsive
└─ Messages update incrementally

Message Display
├─ Messages memoized
├─ Scroll virtualized for large lists
└─ CSS animations use GPU acceleration
```

---

**Note**: This diagram shows the architecture as of December 6, 2025.
Future enhancements may modify these flows (e.g., WebSocket for real-time streaming).
