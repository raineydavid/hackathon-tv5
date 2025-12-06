# 🚀 Quick Start Guide - Video Player & Gemini Audio

## 30-Second Setup

### 1. Get Your API Key (2 minutes)
```bash
# Visit: https://makersuite.google.com/app/apikey
# Click "Create API Key" and copy it
```

### 2. Add to `.env`
```env
GOOGLE_GENERATIVE_AI_API_KEY=paste_your_key_here
```

### 3. Install & Run
```bash
cd apps/media-discovery
npm install
npm run dev
```

### 4. Visit http://localhost:3000

---

## Using the Features

### 🎬 Watch Videos
1. Go to a TV show page
2. Scroll to "Videos" section
3. Click any thumbnail
4. Video opens in fullscreen modal
5. Press ESC or click X to close

### 🎙️ Talk to Gemini
1. While watching a video, click the **blue microphone** button
2. **Speak your question** clearly
3. Click the **chat bubble** to see responses
4. Ask follow-up questions anytime

---

## API Key Quick Links
- **Create Key**: https://makersuite.google.com/app/apikey
- **Manage Keys**: https://ai.google.dev/
- **Documentation**: https://ai.google.dev/tutorials/quickstart

---

## Common Tasks

### Reset API Key
```bash
# Edit .env
nano .env
# Update GOOGLE_GENERATIVE_AI_API_KEY
# Restart dev server
```

### View Error Messages
```bash
# Open browser DevTools (F12)
# Check Console tab for errors
# Common issues logged there
```

### Test Recording
```bash
# Click microphone button
# Speak for 3-5 seconds
# Release and wait for response
# Check chat panel for message
```

---

## Files You Might Need

| File | Purpose |
|------|---------|
| `.env` | Configuration with API keys |
| `src/components/detail/VideoPlayer.tsx` | Video player modal |
| `src/components/detail/GeminiAudioControl.tsx` | Audio chat interface |
| `src/app/api/gemini-audio/route.ts` | Backend audio handler |

---

## Status Indicators

| Symbol | Meaning |
|--------|---------|
| 🔵 Blue Button | Ready to record |
| 🔴 Red Pulsing | Recording in progress |
| ⚙️ Spinning | Processing response |
| 🔔 Blue Dot | New messages available |

---

## Troubleshooting

### Microphone not working?
```bash
# 1. Allow permission when browser asks
# 2. Check microphone hardware is connected
# 3. Refresh browser (Ctrl+R)
# 4. Check browser console for errors (F12)
```

### No response from Gemini?
```bash
# 1. Verify API key in .env
# 2. Check .env was saved
# 3. Restart dev server (Ctrl+C, npm run dev)
# 4. Check console tab in DevTools
```

### Build errors?
```bash
# 1. Delete node_modules: rm -rf node_modules
# 2. Clear npm cache: npm cache clean --force
# 3. Reinstall: npm install
# 4. Try again: npm run dev
```

---

## Environment Variables

### Required
```env
GOOGLE_GENERATIVE_AI_API_KEY=your_key_here
```

### Optional (already configured)
```env
NEXT_PUBLIC_TMDB_ACCESS_TOKEN=already_set
OPENAI_API_KEY=for_other_features
```

---

## Rate Limits

Google Generative AI free tier:
- **60 requests per minute**
- **15 requests per minute** (heavier models)

For production:
- Upgrade to a paid tier
- Implement request caching
- Add rate limiting on backend

---

## Next Features Coming Soon

- ✨ Text-to-speech responses
- 💾 Conversation history
- 🎯 Context-aware questions
- 📊 Usage analytics
- 🔐 User authentication

---

## Getting Help

1. **Check Errors**: Open DevTools (F12) → Console
2. **Read Logs**: Terminal where you ran `npm run dev`
3. **Review Guide**: See `VIDEO_PLAYER_GUIDE.md` for full docs
4. **Check API Status**: https://status.google.com/

---

## Performance Tips

- Videos lazy-load on scroll
- Audio processes without blocking UI
- Chat messages memoized for efficiency
- Thumbnails cached for faster loading

---

## Security Reminders

⚠️ **Never commit your API key to git**
- Use `.env.local` for local development
- Environment variables in production
- Rotate keys if compromised
- Monitor API usage

---

**Last Updated**: December 6, 2025
**Status**: ✅ Ready to Use
