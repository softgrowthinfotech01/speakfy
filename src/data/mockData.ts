import { User, Lesson, Achievement, PracticeSession } from '../types';

export const mockUser: User = {
  id: 'user-1',
  name: 'English Learner',
  level: 'intermediate',
  xp: 2350,
  streak: 7,
  totalSessions: 23,
  createdAt: new Date('2024-01-01')
};

export const mockLessons: Lesson[] = [
  {
    id: 'lesson-1',
    title: 'Common Pronunciation Patterns',
    description: 'Practice the most challenging English sounds for clear communication',
    difficulty: 'beginner',
    category: 'pronunciation',
    content: 'The quick brown fox jumps over the lazy dog. This sentence contains many common English sounds.',
    prompts: [
      'The quick brown fox jumps over the lazy dog',
      'She sells seashells by the seashore',
      'How much wood would a woodchuck chuck'
    ],
    estimatedTime: 10
  },
  {
    id: 'lesson-2',
    title: 'Past Tense Mastery',
    description: 'Learn to use regular and irregular past tense forms correctly',
    difficulty: 'intermediate',
    category: 'grammar',
    content: 'Yesterday I walked to the store and bought some groceries. I have never seen such beautiful flowers before.',
    prompts: [
      'Yesterday I walked to the store',
      'She has lived here for five years',
      'They went to the movies last night'
    ],
    estimatedTime: 15
  },
  {
    id: 'lesson-3',
    title: 'Business Vocabulary',
    description: 'Essential words and phrases for professional communication',
    difficulty: 'advanced',
    category: 'vocabulary',
    content: 'The quarterly report demonstrates significant growth in our market share and revenue streams.',
    prompts: [
      'Let me schedule a meeting to discuss the proposal',
      'Our company aims to increase productivity and efficiency',
      'The presentation was very informative and comprehensive'
    ],
    estimatedTime: 20
  },
  {
    id: 'lesson-4',
    title: 'Conversational Flow',
    description: 'Develop natural rhythm and pacing in spoken English',
    difficulty: 'intermediate',
    category: 'fluency',
    content: 'Having a natural conversation means speaking with appropriate pauses, stress, and intonation patterns.',
    prompts: [
      'How was your weekend? I hope you had a great time!',
      'I really appreciate your help with this project',
      'Would you like to grab coffee sometime this week?'
    ],
    estimatedTime: 12
  },
  {
    id: 'lesson-5',
    title: 'Th Sound Practice',
    description: 'Master the challenging /θ/ and /ð/ sounds',
    difficulty: 'beginner',
    category: 'pronunciation',
    content: 'Think about three things that make you thankful. The weather is nice today.',
    prompts: [
      'Think about three things',
      'The weather is nice today',
      'Thank you for everything'
    ],
    estimatedTime: 8
  },
  {
    id: 'lesson-6',
    title: 'Conditional Sentences',
    description: 'Practice first, second, and third conditional structures',
    difficulty: 'advanced',
    category: 'grammar',
    content: 'If I had studied harder, I would have passed the exam. If it rains tomorrow, we will stay inside.',
    prompts: [
      'If I had more time, I would travel more',
      'If it rains tomorrow, we will cancel the picnic',
      'I would be happier if I lived near the ocean'
    ],
    estimatedTime: 18
  }
];

export const mockAchievements: Achievement[] = [
  {
    id: 'achievement-1',
    title: 'First Steps',
    description: 'Complete your first practice session',
    icon: '🎯',
    unlockedAt: new Date('2024-01-02'),
    progress: 1,
    maxProgress: 1
  },
  {
    id: 'achievement-2',
    title: 'Weekly Warrior',
    description: 'Practice for 7 days in a row',
    icon: '🔥',
    unlockedAt: new Date('2024-01-08'),
    progress: 7,
    maxProgress: 7
  },
  {
    id: 'achievement-3',
    title: 'Perfect Score',
    description: 'Achieve a perfect score in any category',
    icon: '⭐',
    unlockedAt: new Date('2024-01-15'),
    progress: 1,
    maxProgress: 1
  },
  {
    id: 'achievement-4',
    title: 'Pronunciation Pro',
    description: 'Get 90%+ pronunciation score 10 times',
    icon: '🗣️',
    progress: 6,
    maxProgress: 10
  },
  {
    id: 'achievement-5',
    title: 'Grammar Guru',
    description: 'Complete 20 grammar lessons',
    icon: '📝',
    progress: 12,
    maxProgress: 20
  },
  {
    id: 'achievement-6',
    title: 'Vocabulary Master',
    description: 'Learn 100 new words',
    icon: '📚',
    progress: 73,
    maxProgress: 100
  }
];

export const mockRecentScores = [78, 82, 85, 79, 88, 91, 87, 89, 93, 90];