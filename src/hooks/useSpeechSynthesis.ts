import { useState, useCallback, useRef, useEffect } from 'react';

export const useSpeechSynthesis = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported] = useState('speechSynthesis' in window);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (utteranceRef.current) {
        speechSynthesis.cancel();
      }
    };
  }, []);

  const speak = useCallback((text: string, options?: { 
    rate?: number; 
    pitch?: number; 
    volume?: number;
    voice?: SpeechSynthesisVoice;
  }) => {
    if (!isSupported || !text.trim()) return;

    try {
      // Stop any ongoing speech
      speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = Math.max(0.1, Math.min(10, options?.rate || 0.9));
      utterance.pitch = Math.max(0, Math.min(2, options?.pitch || 1));
      utterance.volume = Math.max(0, Math.min(1, options?.volume || 0.8));
      utterance.lang = 'en-US';

      // Set voice if provided
      if (options?.voice) {
        utterance.voice = options.voice;
      } else {
        // Try to find a good English voice
        const voices = speechSynthesis.getVoices();
        const englishVoice = voices.find(voice => 
          voice.lang.startsWith('en') && voice.default
        ) || voices.find(voice => voice.lang.startsWith('en'));
        
        if (englishVoice) {
          utterance.voice = englishVoice;
        }
      }

      utterance.onstart = () => {
        setIsSpeaking(true);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        utteranceRef.current = null;
      };

      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event.error);
        setIsSpeaking(false);
        utteranceRef.current = null;
      };

      utteranceRef.current = utterance;
      speechSynthesis.speak(utterance);
    } catch (error) {
      console.error('Error in speech synthesis:', error);
      setIsSpeaking(false);
    }
  }, [isSupported]);

  const stop = useCallback(() => {
    try {
      speechSynthesis.cancel();
      setIsSpeaking(false);
      utteranceRef.current = null;
    } catch (error) {
      console.error('Error stopping speech synthesis:', error);
    }
  }, []);

  const pause = useCallback(() => {
    try {
      speechSynthesis.pause();
    } catch (error) {
      console.error('Error pausing speech synthesis:', error);
    }
  }, []);

  const resume = useCallback(() => {
    try {
      speechSynthesis.resume();
    } catch (error) {
      console.error('Error resuming speech synthesis:', error);
    }
  }, []);

  return {
    speak,
    stop,
    pause,
    resume,
    isSpeaking,
    isSupported
  };
};