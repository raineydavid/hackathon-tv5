# Video Player & Gemini Audio Integration

This guide explains the new video playback and Gemini Live audio interaction features added to the media discovery app.

## Features Implemented

### 1. **In-App Video Player (iframe-based)**
- Videos now play directly within the app using YouTube's embedded player
- Click on any video thumbnail to open a fullscreen player modal
- Features include:
  - Native YouTube video controls
  - Keyboard support (ESC to close)
  - Smooth transitions and responsive design
  - Video information display in the player header

### 2. **Gemini Live Audio Interaction**
- Real-time audio interaction while watching videos
- Click the microphone button to record a question
- The audio is sent to Google Gemini API for processing
- Get contextual responses about the TV show you're watching

## Setup Instructions

### 1. Install Dependencies

```bash
cd apps/media-discovery
npm install
```

The following packages are automatically installed:
- `@google/generative-ai` - Google Generative AI SDK for Gemini API

### 2. Configure Environment Variables

Update `.env` with your API keys:

```env
# Google Generative AI (Gemini) Configuration
GOOGLE_GENERATIVE_AI_API_KEY=your_google_generative_ai_api_key_here
```

**To get a Gemini API Key:**
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click "Create API Key"
3. Copy the key and paste it in your `.env` file

### 3. Enable Feature Flags (Optional)

In `.env`, you can control the features:

```env
ENABLE_VIDEO_PLAYER=true      # Enable video player iframe
ENABLE_GEMINI_AUDIO=true      # Enable audio interaction
```

### 4. Run the Development Server

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000)

## How to Use

### Playing Videos

1. Navigate to a TV show detail page
2. Scroll to the "Videos" section
3. Click on any video thumbnail to open it
4. The video will play in a modal with the YouTube player
5. Press ESC or click the X button to close

### Using Gemini Audio

While a video is playing:

1. Click the **blue microphone button** in the controls
2. **Speak your question** about the video/show (e.g., "Who is the main character?" or "What's the plot?")
3. Release when done - the button will turn **red and pulse** while recording
4. Wait for processing (button shows spinning icon)
5. **View the response** in the chat panel that appears
6. Click the **chat icon** to toggle the message panel

### Chat Interface

- Messages appear in a floating panel on the right
- User messages appear in **blue** on the right
- AI responses appear in **gray** on the left
- Scroll through your conversation history
- Click the X to close the panel (messages are preserved)

## Architecture

### Frontend Components

**`VideoPlayer.tsx`**
- Modal-based video player component
- Embeds YouTube iframe
- Handles ESC key for closing
- Manages fullscreen state
- Displays video information

**`GeminiAudioControl.tsx`**
- Audio recording component
- Microphone access handling
- Real-time transcription display
- Chat message management
- Audio response playback

**`VideoSection.tsx`** (Updated)
- Now displays videos as clickable thumbnails
- Opens `VideoPlayer` modal on click
- Maintains existing video filtering logic

### Backend API

**`/api/gemini-audio` (POST)**
- Accepts base64-encoded audio
- Processes audio with Gemini API
- Returns:
  - User transcription
  - AI-generated response
  - Optional audio response (future enhancement)

Request body:
```json
{
  "audio": "base64-encoded-audio",
  "videoTitle": "Show Title",
  "context": "User is watching..."
}
```

Response:
```json
{
  "success": true,
  "userTranscript": "What's the plot?",
  "response": "The show follows...",
  "audioResponse": "optional-base64-audio"
}
```

## Technical Details

### Audio Recording
- Uses Web Audio API's `MediaRecorder`
- Records in WebM format with Opus codec
- Converts to base64 for transmission
- Handles browser permission requests

### Gemini Integration
- Uses Google Generative AI SDK
- Model: `gemini-pro` for text generation
- Includes context about the show being watched
- Processes questions about the video content

### Future Enhancements

1. **Speech-to-Text Improvement**
   - Integrate Google Cloud Speech-to-Text API
   - Improve transcription accuracy

2. **Text-to-Speech Responses**
   - Add Google Cloud Text-to-Speech
   - Auto-play AI responses as audio

3. **Advanced Context**
   - Include show synopsis in prompts
   - Store conversation history
   - Personalized responses based on user preferences

4. **Real-time Streaming**
   - Implement streaming responses
   - Progressive message updates
   - Real-time audio playback

## Troubleshooting

### Microphone Permission Denied
- Check browser permissions
- Allow microphone access when prompted
- Ensure HTTPS in production

### "API key not found" Error
- Verify `GOOGLE_GENERATIVE_AI_API_KEY` in `.env`
- Restart dev server after updating `.env`

### Videos Not Playing
- Check internet connection
- Verify YouTube availability in your region
- Ensure ad blockers aren't interfering

### No Audio Response
- Audio response is optional in current version
- Check console for error messages
- Verify API key and rate limits

## Dependencies

```json
{
  "@google/generative-ai": "^0.11.0",
  "react": "^19.0.0",
  "next": "^15.0.3"
}
```

## Browser Support

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support (iOS 14.5+)
- Mobile browsers: ✅ Supported

## API Rate Limits

Google Generative AI has rate limits:
- Free tier: 60 requests per minute
- For production, consider upgrading to a paid tier

## Security Notes

- API keys should never be committed to version control
- Use `.env.local` for local development
- In production, use environment variable management
- Audio data is not stored, only processed
- Conversations are not persisted by default

## Performance Tips

1. Video thumbnails are lazy-loaded
2. Audio processing is async to prevent UI blocking
3. Chat panel uses virtual scrolling for large conversations
4. Messages are memoized to prevent unnecessary re-renders

## Support

For issues or feature requests:
1. Check the troubleshooting section
2. Review browser console for errors
3. Verify API key configuration
4. Check network tab for API responses
