'use client';

import { useState, useRef, useEffect } from 'react';
import type { Video } from '@/lib/tmdb';
import { GeminiAudioControl } from './GeminiAudioControl';

interface VideoPlayerProps {
  video: Video;
  isOpen: boolean;
  onClose: () => void;
}

export function VideoPlayer({ video, isOpen, onClose }: VideoPlayerProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const playerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        if (isFullscreen) {
          setIsFullscreen(false);
        } else {
          onClose();
        }
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, isFullscreen, onClose]);

  if (!isOpen) return null;

  const videoUrl = `https://www.youtube.com/embed/${video.key}?autoplay=1&mute=1&modestbranding=1&controls=1&enablejsapi=1&origin=${window.location.origin}`;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/80 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        ref={playerRef}
        className={`fixed z-50 transition-all duration-300 ${
          isFullscreen
            ? 'inset-0'
            : 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] h-[90vh] rounded-lg overflow-hidden'
        }`}
      >
        <div className="relative w-full h-full bg-black flex flex-col">
          {/* Player */}
          <div className="flex-1 relative bg-black">
            <iframe
              src={videoUrl}
              title={video.name}
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
              className="absolute inset-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
          </div>

          {/* Controls bar */}
          <div className="bg-gray-900/95 backdrop-blur-sm border-t border-gray-800 p-4">
            <div className="flex items-center justify-between gap-4">
              {/* Video info */}
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-medium truncate">{video.name}</h3>
                <p className="text-gray-400 text-sm">{video.type}</p>
              </div>

              {/* Audio control */}
              <GeminiAudioControl videoTitle={video.name} />

              {/* Close button */}
              <button
                onClick={onClose}
                className="flex-shrink-0 p-2 hover:bg-gray-800 rounded-lg transition-colors"
                title="Close (Esc)"
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
