import React, { useState, useEffect, useCallback } from 'react';
import { Mic, MicOff, Square, Play, AlertCircle } from 'lucide-react';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';

interface VoiceRecorderProps {
  onTranscriptComplete: (transcript: string) => void;
  isAnalyzing: boolean;
  currentLesson?: string;
}

export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({
  onTranscriptComplete,
  isAnalyzing,
  currentLesson
}) => {
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioLevel, setAudioLevel] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const { speak, isSpeaking } = useSpeechSynthesis();

  const handleResult = useCallback((result: string, isFinal: boolean) => {
    if (isFinal) {
      setTranscript(prev => {
        const newTranscript = prev + (prev ? ' ' : '') + result;
        return newTranscript;
      });
      setInterimTranscript('');
    } else {
      setInterimTranscript(result);
    }
  }, []);

  const handleError = useCallback((errorMessage: string) => {
    setError(errorMessage);
    setTimeout(() => setError(null), 5000); // Clear error after 5 seconds
  }, []);

  const { isListening, isSupported, startListening, stopListening } = useSpeechRecognition({
    onResult: handleResult,
    onError: handleError
  });

  // Recording timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isListening) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      setRecordingTime(0);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isListening]);

  // Simulate audio level for visual feedback
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isListening) {
      interval = setInterval(() => {
        setAudioLevel(Math.random() * 100);
      }, 100);
    } else {
      setAudioLevel(0);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isListening]);

  const handleStartRecording = useCallback(() => {
    setTranscript('');
    setInterimTranscript('');
    setError(null);
    startListening();
  }, [startListening]);

  const handleStopRecording = useCallback(() => {
    stopListening();
    const finalTranscript = transcript.trim();
    if (finalTranscript) {
      onTranscriptComplete(finalTranscript);
    }
  }, [stopListening, transcript, onTranscriptComplete]);

  const handlePlayLesson = useCallback(() => {
    if (currentLesson && !isSpeaking) {
      speak(currentLesson);
    }
  }, [currentLesson, speak, isSpeaking]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isSupported) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
        <MicOff className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-red-800 mb-3">Speech Recognition Not Supported</h3>
        <p className="text-red-600 mb-4">
          Your browser doesn't support speech recognition. Please use Chrome, Safari, or Edge for the best experience.
        </p>
        <div className="text-sm text-red-500">
          <p>Supported browsers:</p>
          <ul className="list-disc list-inside mt-2">
            <li>Google Chrome (recommended)</li>
            <li>Microsoft Edge</li>
            <li>Safari (macOS/iOS)</li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Voice Practice</h2>
        <p className="text-gray-600">Click to start recording your speech</p>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* Current Lesson */}
      {currentLesson && (
        <div className="bg-purple-50 rounded-lg p-4 mb-6 border border-purple-100">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-purple-800">Practice Text:</h3>
            <button
              onClick={handlePlayLesson}
              disabled={isSpeaking || isListening}
              className="flex items-center gap-2 px-3 py-1 text-sm bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Listen to practice text"
            >
              <Play className="w-4 h-4" />
              {isSpeaking ? 'Playing...' : 'Listen'}
            </button>
          </div>
          <p className="text-purple-700 leading-relaxed">{currentLesson}</p>
        </div>
      )}

      {/* Recording Controls */}
      <div className="flex justify-center mb-8">
        <div className="relative">
          <button
            onClick={isListening ? handleStopRecording : handleStartRecording}
            disabled={isAnalyzing}
            className={`w-24 h-24 rounded-full flex items-center justify-center text-white font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl ${
              isListening
                ? 'bg-red-500 hover:bg-red-600 animate-pulse'
                : 'bg-purple-600 hover:bg-purple-700'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
            aria-label={isListening ? 'Stop recording' : 'Start recording'}
          >
            {isListening ? <Square className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
          </button>
          
          {/* Audio level indicator */}
          {isListening && (
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center animate-pulse">
              <div 
                className="w-2 h-2 bg-white rounded-full transition-transform duration-100"
                style={{ transform: `scale(${0.5 + audioLevel / 200})` }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Recording Status */}
      {isListening && (
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 rounded-full border border-red-200">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <span className="text-red-700 font-medium">Recording: {formatTime(recordingTime)}</span>
          </div>
        </div>
      )}

      {/* Live Transcript */}
      <div className="min-h-[120px] bg-gray-50 rounded-lg p-4 border-2 border-dashed border-gray-200">
        <h3 className="text-sm font-semibold text-gray-600 mb-2">Live Transcript:</h3>
        <div className="text-gray-800 leading-relaxed min-h-[80px]">
          {transcript && (
            <span className="text-gray-800">{transcript}</span>
          )}
          {interimTranscript && (
            <span className="text-gray-500 italic">
              {transcript ? ' ' : ''}{interimTranscript}
            </span>
          )}
          {!transcript && !interimTranscript && (
            <span className="text-gray-400 italic">Your speech will appear here...</span>
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-6 text-center text-sm text-gray-500">
        <p>
          {isListening 
            ? "Speak clearly into your microphone. Click the square to stop recording."
            : "Click the microphone to start recording your speech."
          }
        </p>
        {!isListening && (
          <p className="mt-2 text-xs">
            Make sure your microphone is enabled and you've granted permission to use it.
          </p>
        )}
      </div>
    </div>
  );
};