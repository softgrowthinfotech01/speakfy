import React, { useState, useMemo } from 'react';
import { BookOpen, Clock, ChevronRight, Play, Volume2 } from 'lucide-react';
import { Lesson } from '../types';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';

interface LessonManagerProps {
  lessons: Lesson[];
  onSelectLesson: (lesson: Lesson) => void;
  currentLesson?: Lesson;
}

export const LessonManager: React.FC<LessonManagerProps> = ({ 
  lessons, 
  onSelectLesson, 
  currentLesson 
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const { speak, isSpeaking } = useSpeechSynthesis();

  const categories = useMemo(() => [
    { value: 'all', label: 'All Categories' },
    { value: 'pronunciation', label: 'Pronunciation' },
    { value: 'grammar', label: 'Grammar' },
    { value: 'vocabulary', label: 'Vocabulary' },
    { value: 'fluency', label: 'Fluency' }
  ], []);

  const difficulties = useMemo(() => [
    { value: 'all', label: 'All Levels' },
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' }
  ], []);

  const filteredLessons = useMemo(() => {
    return lessons.filter(lesson => {
      const categoryMatch = selectedCategory === 'all' || lesson.category === selectedCategory;
      const difficultyMatch = selectedDifficulty === 'all' || lesson.difficulty === selectedDifficulty;
      return categoryMatch && difficultyMatch;
    });
  }, [lessons, selectedCategory, selectedDifficulty]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800 border-green-200';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'advanced': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'pronunciation': return '🗣️';
      case 'grammar': return '📝';
      case 'vocabulary': return '📚';
      case 'fluency': return '💬';
      default: return '📖';
    }
  };

  const handlePlayLesson = (lesson: Lesson, event: React.MouseEvent) => {
    event.stopPropagation();
    if (!isSpeaking && lesson.content) {
      speak(lesson.content);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Practice Lessons</h2>
        <p className="text-gray-600">Choose a lesson to improve your English skills</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-8">
        <div className="flex-1 min-w-[200px]">
          <label htmlFor="category-select" className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            id="category-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            {categories.map(category => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1 min-w-[200px]">
          <label htmlFor="difficulty-select" className="block text-sm font-medium text-gray-700 mb-2">
            Difficulty
          </label>
          <select
            id="difficulty-select"
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            {difficulties.map(difficulty => (
              <option key={difficulty.value} value={difficulty.value}>
                {difficulty.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Current Lesson */}
      {currentLesson && (
        <div className="mb-8 p-6 bg-purple-50 rounded-lg border border-purple-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="text-2xl" role="img" aria-label={currentLesson.category}>
              {getCategoryIcon(currentLesson.category)}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-purple-800">Currently Practicing</h3>
              <p className="text-purple-700">{currentLesson.title}</p>
            </div>
            <button
              onClick={(e) => handlePlayLesson(currentLesson, e)}
              disabled={isSpeaking}
              className="p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
              aria-label={`Listen to ${currentLesson.title}`}
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>
          <p className="text-purple-600 text-sm">{currentLesson.description}</p>
        </div>
      )}

      {/* Lessons List */}
      <div className="space-y-4">
        {filteredLessons.map((lesson) => (
          <div
            key={lesson.id}
            onClick={() => onSelectLesson(lesson)}
            className={`p-6 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-md focus-within:ring-2 focus-within:ring-purple-500 focus-within:ring-offset-2 ${
              currentLesson?.id === lesson.id 
                ? 'border-purple-200 bg-purple-50' 
                : 'border-gray-200 hover:border-purple-200'
            }`}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onSelectLesson(lesson);
              }
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 flex-1">
                <div className="text-2xl" role="img" aria-label={lesson.category}>
                  {getCategoryIcon(lesson.category)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-gray-800">{lesson.title}</h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getDifficultyColor(lesson.difficulty)}`}>
                      {lesson.difficulty}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-2">{lesson.description}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{lesson.estimatedTime} min</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <BookOpen className="w-3 h-3" />
                      <span>{lesson.prompts?.length || 0} exercises</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => handlePlayLesson(lesson, e)}
                  disabled={isSpeaking}
                  className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                  title="Listen to lesson"
                  aria-label={`Listen to ${lesson.title}`}
                >
                  <Volume2 className="w-4 h-4" />
                </button>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredLessons.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No lessons found</h3>
          <p className="text-gray-500">Try adjusting your filters to see more lessons.</p>
        </div>
      )}
    </div>
  );
};