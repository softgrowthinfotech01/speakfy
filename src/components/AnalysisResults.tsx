import React, { useMemo } from 'react';
import { CheckCircle, AlertCircle, BookOpen, Target, TrendingUp, Volume2 } from 'lucide-react';
import { PracticeSession } from '../types';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';

interface AnalysisResultsProps {
  session: PracticeSession;
  onNewSession: () => void;
}

export const AnalysisResults: React.FC<AnalysisResultsProps> = ({ session, onNewSession }) => {
  const { speak, isSpeaking } = useSpeechSynthesis();

  const getScoreColor = useMemo(() => (score: number) => {
    if (score >= 85) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 70) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  }, []);

  const getScoreIcon = useMemo(() => (score: number) => {
    if (score >= 85) return <CheckCircle className="w-5 h-5 text-green-600" />;
    return <AlertCircle className="w-5 h-5 text-yellow-600" />;
  }, []);

  const handlePlayFeedback = () => {
    if (!isSpeaking && session.feedback.overall) {
      speak(session.feedback.overall);
    }
  };

  const handlePlayWord = (word: string, phoneticCorrection?: string) => {
    if (!isSpeaking) {
      const textToSpeak = phoneticCorrection ? `${word}. Correct pronunciation: ${phoneticCorrection}` : word;
      speak(textToSpeak, { rate: 0.7 });
    }
  };

  // Memoize filtered pronunciation feedback to avoid recalculation
  const poorPronunciationWords = useMemo(() => 
    session.feedback.pronunciation
      .filter(p => p.score < 85)
      .slice(0, 3)
  , [session.feedback.pronunciation]);

  const vocabularySuggestions = useMemo(() => 
    session.feedback.vocabulary.slice(0, 2)
  , [session.feedback.vocabulary]);

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Analysis Results</h2>
        <p className="text-gray-600">Here's how you performed</p>
      </div>

      {/* Overall Score */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 text-white text-2xl font-bold mb-4 shadow-lg">
          {Math.round(session.overallScore)}
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Overall Score</h3>
        <p className="text-gray-600">Great job on your practice session!</p>
      </div>

      {/* Score Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className={`p-4 rounded-lg border ${getScoreColor(session.pronunciationScore)}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold">Pronunciation</span>
            {getScoreIcon(session.pronunciationScore)}
          </div>
          <div className="text-2xl font-bold mb-1">{Math.round(session.pronunciationScore)}%</div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-current h-2 rounded-full transition-all duration-1000"
              style={{ width: `${Math.min(100, Math.max(0, session.pronunciationScore))}%` }}
            />
          </div>
        </div>

        <div className={`p-4 rounded-lg border ${getScoreColor(session.grammarScore)}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold">Grammar</span>
            {getScoreIcon(session.grammarScore)}
          </div>
          <div className="text-2xl font-bold mb-1">{Math.round(session.grammarScore)}%</div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-current h-2 rounded-full transition-all duration-1000"
              style={{ width: `${Math.min(100, Math.max(0, session.grammarScore))}%` }}
            />
          </div>
        </div>

        <div className={`p-4 rounded-lg border ${getScoreColor(session.fluencyScore)}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold">Fluency</span>
            {getScoreIcon(session.fluencyScore)}
          </div>
          <div className="text-2xl font-bold mb-1">{Math.round(session.fluencyScore)}%</div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-current h-2 rounded-full transition-all duration-1000"
              style={{ width: `${Math.min(100, Math.max(0, session.fluencyScore))}%` }}
            />
          </div>
        </div>
      </div>

      {/* Transcript */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <BookOpen className="w-5 h-5" />
          Your Speech
        </h3>
        <div className="bg-gray-50 rounded-lg p-4 border">
          <p className="text-gray-800 leading-relaxed">{session.transcript || 'No transcript available'}</p>
        </div>
      </div>

      {/* Pronunciation Feedback */}
      {poorPronunciationWords.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <Target className="w-5 h-5" />
            Pronunciation Tips
          </h3>
          <div className="space-y-3">
            {poorPronunciationWords.map((p, index) => (
              <div key={`${p.word}-${index}`} className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-blue-800">"{p.word}"</span>
                    <button
                      onClick={() => handlePlayWord(p.word, p.phoneticCorrection)}
                      disabled={isSpeaking}
                      className="p-1 text-blue-600 hover:bg-blue-100 rounded disabled:opacity-50"
                      aria-label={`Listen to pronunciation of ${p.word}`}
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="text-sm text-blue-600">{Math.round(p.score)}%</span>
                </div>
                <p className="text-blue-700 text-sm mb-1">{p.suggestion}</p>
                {p.phoneticCorrection && (
                  <p className="text-blue-600 text-sm font-mono">{p.phoneticCorrection}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Grammar Feedback */}
      {session.feedback.grammar.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            Grammar Corrections
          </h3>
          <div className="space-y-3">
            {session.feedback.grammar.map((g, index) => (
              <div key={`grammar-${index}`} className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                <div className="font-semibold text-yellow-800 mb-1">{g.error}</div>
                <div className="text-yellow-700 text-sm mb-2">
                  <span className="font-medium">Correction:</span> {g.correction}
                </div>
                <p className="text-yellow-600 text-sm">{g.explanation}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Vocabulary Suggestions */}
      {vocabularySuggestions.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Vocabulary Enhancement
          </h3>
          <div className="space-y-3">
            {vocabularySuggestions.map((v, index) => (
              <div key={`vocab-${index}`} className="bg-green-50 rounded-lg p-4 border border-green-200">
                <div className="font-semibold text-green-800 mb-2">
                  Instead of "{v.word}", try:
                </div>
                <div className="flex flex-wrap gap-2 mb-2">
                  {v.alternatives.map((alt, altIndex) => (
                    <span 
                      key={`${alt}-${altIndex}`}
                      className="px-2 py-1 bg-green-100 text-green-700 rounded-md text-sm font-medium"
                    >
                      {alt}
                    </span>
                  ))}
                </div>
                <p className="text-green-600 text-sm">{v.context}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Overall Feedback */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Overall Feedback</h3>
        <div className="bg-purple-50 rounded-lg p-4 border border-purple-200 relative">
          <p className="text-purple-800 leading-relaxed pr-12">{session.feedback.overall}</p>
          <button
            onClick={handlePlayFeedback}
            disabled={isSpeaking}
            className="absolute top-4 right-4 p-2 text-purple-600 hover:bg-purple-100 rounded-full transition-colors disabled:opacity-50"
            title="Listen to feedback"
            aria-label="Listen to overall feedback"
          >
            <Volume2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 justify-center">
        <button
          onClick={onNewSession}
          className="px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
        >
          Practice Again
        </button>
      </div>
    </div>
  );
};