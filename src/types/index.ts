export interface User {
  id: string;
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  xp: number;
  streak: number;
  totalSessions: number;
  createdAt: Date;
}

export interface PracticeSession {
  id: string;
  userId: string;
  transcript: string;
  originalText?: string;
  pronunciationScore: number;
  fluencyScore: number;
  grammarScore: number;
  overallScore: number;
  feedback: Feedback;
  duration: number;
  timestamp: Date;
}

export interface Feedback {
  pronunciation: PronunciationFeedback[];
  grammar: GrammarFeedback[];
  vocabulary: VocabularyFeedback[];
  overall: string;
}

export interface PronunciationFeedback {
  word: string;
  score: number;
  suggestion: string;
  phoneticCorrection?: string;
}

export interface GrammarFeedback {
  error: string;
  correction: string;
  explanation: string;
  position: number;
}

export interface VocabularyFeedback {
  word: string;
  alternatives: string[];
  context: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: Date;
  progress: number;
  maxProgress: number;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: 'pronunciation' | 'grammar' | 'vocabulary' | 'fluency';
  content: string;
  prompts: string[];
  estimatedTime: number;
}