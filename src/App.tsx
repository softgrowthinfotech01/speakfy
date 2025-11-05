import React, { useState, useEffect, useCallback } from 'react';
import { Mic, BarChart3, BookOpen, User } from 'lucide-react';
import { VoiceRecorder } from './components/VoiceRecorder';
import { AnalysisResults } from './components/AnalysisResults';
import { ProgressTracker } from './components/ProgressTracker';
import { LessonManager } from './components/LessonManager';
import { AnalysisService } from './services/analysisService';
import { mockUser, mockLessons, mockAchievements, mockRecentScores } from './data/mockData';
import { PracticeSession, Lesson, User as UserType } from './types';

type AppView = 'practice' | 'lessons' | 'progress' | 'profile';

function App() {
  const [currentView, setCurrentView] = useState<AppView>('practice');
  const [currentSession, setCurrentSession] = useState<PracticeSession | null>(null);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [user, setUser] = useState<UserType>(mockUser);

  // Initialize with first lesson
  useEffect(() => {
    if (!currentLesson && mockLessons.length > 0) {
      setCurrentLesson(mockLessons[0]);
    }
  }, [currentLesson]);

  const handleTranscriptComplete = useCallback(async (transcript: string) => {
    if (!transcript || !transcript.trim()) {
      console.warn('Empty transcript received');
      return;
    }

    setIsAnalyzing(true);
    
    try {
      // Simulate analysis delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      const feedback = AnalysisService.analyzeComplete(transcript, currentLesson?.content);
      
      // Calculate scores with proper validation
      const pronunciationScore = feedback.pronunciation.length > 0
        ? feedback.pronunciation.reduce((sum, p) => sum + (p.score || 0), 0) / feedback.pronunciation.length
        : 85;
      
      const grammarScore = Math.max(50, 95 - (feedback.grammar.length * 10));
      
      const wordCount = transcript.trim().split(/\s+/).length;
      const fluencyScore = Math.min(95, Math.max(60, 
        100 - (wordCount < 10 ? 20 : 0) - (wordCount > 100 ? 10 : 0)
      ));
      
      const overallScore = (pronunciationScore + grammarScore + fluencyScore) / 3;

      const session: PracticeSession = {
        id: `session-${Date.now()}`,
        userId: user.id,
        transcript: transcript.trim(),
        originalText: currentLesson?.content,
        pronunciationScore: Math.round(pronunciationScore),
        grammarScore: Math.round(grammarScore),
        fluencyScore: Math.round(fluencyScore),
        overallScore: Math.round(overallScore),
        feedback,
        duration: 30,
        timestamp: new Date()
      };

      // Update user stats
      const xpGained = Math.round(overallScore * 2);
      setUser(prev => ({
        ...prev,
        xp: prev.xp + xpGained,
        totalSessions: prev.totalSessions + 1,
        streak: prev.streak + (Math.random() > 0.3 ? 1 : 0) // Simulate streak logic
      }));

      setCurrentSession(session);
    } catch (error) {
      console.error('Error during analysis:', error);
      // Handle error state here if needed
    } finally {
      setIsAnalyzing(false);
    }
  }, [currentLesson, user.id]);

  const handleNewSession = useCallback(() => {
    setCurrentSession(null);
  }, []);

  const handleSelectLesson = useCallback((lesson: Lesson) => {
    setCurrentLesson(lesson);
    setCurrentView('practice');
    setCurrentSession(null);
  }, []);

  const navigationItems = [
    { id: 'practice' as AppView, label: 'Practice', icon: Mic },
    { id: 'lessons' as AppView, label: 'Lessons', icon: BookOpen },
    { id: 'progress' as AppView, label: 'Progress', icon: BarChart3 },
    { id: 'profile' as AppView, label: 'Profile', icon: User }
  ];

  const renderCurrentView = () => {
    switch (currentView) {
      case 'practice':
        return currentSession ? (
          <AnalysisResults session={currentSession} onNewSession={handleNewSession} />
        ) : (
          <VoiceRecorder
            onTranscriptComplete={handleTranscriptComplete}
            isAnalyzing={isAnalyzing}
            currentLesson={currentLesson?.content}
          />
        );
      case 'lessons':
        return (
          <LessonManager
            lessons={mockLessons}
            onSelectLesson={handleSelectLesson}
            currentLesson={currentLesson || undefined}
          />
        );
      case 'progress':
        return (
          <ProgressTracker
            user={user}
            achievements={mockAchievements}
            recentScores={mockRecentScores}
          />
        );
      case 'profile':
        return (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">{user.name}</h2>
            <p className="text-gray-600 mb-6">Level {Math.floor(user.xp / 1000) + 1} • {user.level}</p>
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                <div className="text-2xl font-bold text-purple-600">{user.xp.toLocaleString()}</div>
                <div className="text-sm text-purple-600">Total XP</div>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                <div className="text-2xl font-bold text-blue-600">{user.streak}</div>
                <div className="text-sm text-blue-600">Day Streak</div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                <Mic className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-800">VoiceCoach</h1>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 px-3 py-1 bg-yellow-100 rounded-full border border-yellow-200">
                <span className="text-sm font-semibold text-yellow-800">{user.xp.toLocaleString()} XP</span>
              </div>
              <div className="flex items-center gap-1 px-3 py-1 bg-red-100 rounded-full border border-red-200">
                <span className="text-sm font-semibold text-red-800">{user.streak}🔥</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Navigation Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <nav className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4">
              <div className="space-y-2">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setCurrentView(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${
                        currentView === item.id
                          ? 'bg-purple-100 text-purple-700 border-purple-200 shadow-sm'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </nav>

            {/* Current Lesson Quick Info */}
            {currentLesson && currentView !== 'lessons' && (
              <div className="mt-6 bg-white rounded-2xl shadow-lg border border-gray-100 p-4">
                <h3 className="font-semibold text-gray-800 mb-2">Current Lesson</h3>
                <p className="text-sm text-gray-600 mb-2">{currentLesson.title}</p>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span className={`px-2 py-1 rounded-full border ${
                    currentLesson.difficulty === 'beginner' ? 'bg-green-100 text-green-800 border-green-200' :
                    currentLesson.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                    'bg-red-100 text-red-800 border-red-200'
                  }`}>
                    {currentLesson.difficulty}
                  </span>
                  <span>{currentLesson.estimatedTime} min</span>
                </div>
              </div>
            )}
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {isAnalyzing && (
              <div className="mb-8 bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center">
                <div className="animate-spin w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Analyzing Your Speech</h3>
                <p className="text-gray-600">Our AI is evaluating your pronunciation, grammar, and fluency...</p>
              </div>
            )}
            {renderCurrentView()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;