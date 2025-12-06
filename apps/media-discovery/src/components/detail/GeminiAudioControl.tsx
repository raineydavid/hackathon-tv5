'use client';

import { useState, useRef, useCallback, useEffect } from 'react';

interface GeminiAudioControlProps {
  videoTitle: string;
}

interface AudioMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export function GeminiAudioControl({ videoTitle }: GeminiAudioControlProps) {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [messages, setMessages] = useState<AudioMessage[]>([]);
  const [showMessages, setShowMessages] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const playAudioResponse = useCallback((base64Audio: string) => {
    try {
      const audio = new Audio(`data:audio/mpeg;base64,${base64Audio}`);
      audio.play().catch((error) => console.error('Error playing audio:', error));
    } catch (error) {
      console.error('Error creating audio element:', error);
    }
  }, []);

  const sendAudioToGemini = useCallback(
    async (audioBlob: Blob) => {
      try {
        setIsProcessing(true);
        // Convert blob to base64
        const reader = new FileReader();
        reader.onloadend = async () => {
          const audioData = reader.result as string;
          const base64Audio = audioData.split(',')[1];

          try {
            // Send to backend API for Gemini processing
            const response = await fetch('/api/gemini-audio', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                audio: base64Audio,
                videoTitle,
                context: 'User is watching a TV show and asking about it',
              }),
            });

            const result = await response.json();

            if (result.success) {
              // Add user message
              setMessages((prev) => [
                ...prev,
                {
                  role: 'user',
                  content: result.userTranscript || 'Audio message',
                  timestamp: Date.now(),
                },
              ]);

              // Add assistant response
              setMessages((prev) => [
                ...prev,
                {
                  role: 'assistant',
                  content: result.response,
                  timestamp: Date.now(),
                },
              ]);

              // Play response audio if available
              if (result.audioResponse) {
                playAudioResponse(result.audioResponse);
              }
            }
          } finally {
            setIsProcessing(false);
          }
        };

        reader.readAsDataURL(audioBlob);
      } catch (error) {
        console.error('Error sending audio to Gemini:', error);
        setIsProcessing(false);
      }
    },
    [videoTitle, playAudioResponse]
  );

  const startListening = useCallback(async () => {
    try {
      setIsListening(true);
      audioChunksRef.current = [];

      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // Create MediaRecorder
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus',
      });

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        // Process audio
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await sendAudioToGemini(audioBlob);

        // Clean up stream
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;
    } catch (error) {
      console.error('Error accessing microphone:', error);
      setIsListening(false);
    }
  }, [sendAudioToGemini]);

  const stopListening = useCallback(() => {
    if (mediaRecorderRef.current && isListening) {
      mediaRecorderRef.current.stop();
      setIsListening(false);
    }
  }, [isListening]);

  return (
    <div className="flex flex-col gap-2">
      {/* Messages panel */}
      {showMessages && (
        <div className="fixed bottom-20 right-4 w-96 max-h-96 bg-gray-900 border border-gray-700 rounded-lg shadow-lg flex flex-col z-50">
          {/* Header */}
          <div className="sticky top-0 p-3 border-b border-gray-700 bg-gray-800 flex items-center justify-between">
            <h3 className="text-white font-medium text-sm">Chat about "{videoTitle}"</h3>
            <button
              onClick={() => setShowMessages(false)}
              className="p-1 hover:bg-gray-700 rounded transition-colors"
            >
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {messages.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-4">
                Click the microphone to ask questions about the video
              </p>
            ) : (
              messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                      msg.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700 text-gray-100'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
      )}

      {/* Control buttons */}
      <div className="flex items-center gap-2">
        {/* Microphone button */}
        <button
          onClick={isListening ? stopListening : startListening}
          disabled={isProcessing}
          className={`flex-shrink-0 p-2 rounded-lg transition-all ${
            isListening
              ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse'
              : isProcessing
                ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
          title={isListening ? 'Stop recording' : 'Start recording (click to speak)'}
        >
          {isProcessing ? (
            <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
              <path d="M17 16.91c-1.48 1.46-3.51 2.36-5.76 2.36-2.25 0-4.28-.9-5.76-2.36l-1.41 1.41c1.98 1.96 4.71 3.17 7.17 3.17s5.19-1.21 7.17-3.17l-1.41-1.41z" />
            </svg>
          )}
        </button>

        {/* Messages toggle */}
        <button
          onClick={() => setShowMessages(!showMessages)}
          className="flex-shrink-0 p-2 hover:bg-gray-800 rounded-lg transition-colors relative"
          title="Show messages"
        >
          <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v9a2 2 0 01-2 2h-4l-4 4v-4z" />
          </svg>
          {messages.length > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full" />
          )}
        </button>
      </div>
    </div>
  );
}

