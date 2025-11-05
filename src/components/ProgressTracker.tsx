import React, { useMemo } from 'react';
import { Trophy, Flame, Target, TrendingUp, Calendar, Award } from 'lucide-react';
import { User, Achievement } from '../types';

interface ProgressTrackerProps {
  user: User;
  achievements: Achievement[];
  recentScores: number[];
}

export const ProgressTracker: React.FC<ProgressTrackerProps> = ({ 
  user, 
  achievements, 
  recentScores 
}) => {
  const { level, xpToNextLevel, xpProgress } = useMemo(() => {
    const currentLevel = Math.floor(user.xp / 1000) + 1;
    const xpForNextLevel = 1000 - (user.xp % 1000);
    const progressPercentage = (user.xp % 1000) / 1000 * 100;
    
    return {
      level: currentLevel,
      xpToNextLevel: xpForNextLevel,
      xpProgress: progressPercentage
    };
  }, [user.xp]);

  const averageScore = useMemo(() => {
    if (recentScores.length === 0) return 0;
    return Math.round(recentScores.reduce((sum, score) => sum + score, 0) / recentScores.length);
  }, [recentScores]);

  const { unlockedAchievements, nextAchievement } = useMemo(() => {
    const unlocked = achievements.filter(a => a.unlockedAt);
    const next = achievements.find(a => !a.unlockedAt);
    return { unlockedAchievements: unlocked, nextAchievement: next };
  }, [achievements]);

  const recentPerformanceData = useMemo(() => {
    return recentScores.slice(-7);
  }, [recentScores]);

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Your Progress</h2>
        <p className="text-gray-600">Keep up the great work!</p>
      </div>

      {/* User Level & XP */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 text-white text-xl font-bold mb-4 shadow-lg">
          {level}
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Level {level}</h3>
        <div className="max-w-xs mx-auto">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>{user.xp.toLocaleString()} XP</span>
            <span>{xpToNextLevel.toLocaleString()} XP to next level</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full transition-all duration-1000"
              style={{ width: `${Math.min(100, Math.max(0, xpProgress))}%` }}
            />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="text-center p-4 bg-red-50 rounded-lg border border-red-100">
          <Flame className="w-6 h-6 text-red-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-red-600">{user.streak}</div>
          <div className="text-sm text-red-600">Day Streak</div>
        </div>

        <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-100">
          <Target className="w-6 h-6 text-blue-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-blue-600">{averageScore}%</div>
          <div className="text-sm text-blue-600">Avg Score</div>
        </div>

        <div className="text-center p-4 bg-green-50 rounded-lg border border-green-100">
          <Calendar className="w-6 h-6 text-green-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-green-600">{user.totalSessions}</div>
          <div className="text-sm text-green-600">Sessions</div>
        </div>

        <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-100">
          <Award className="w-6 h-6 text-purple-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-purple-600">{unlockedAchievements.length}</div>
          <div className="text-sm text-purple-600">Achievements</div>
        </div>
      </div>

      {/* Recent Performance Chart */}
      {recentPerformanceData.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Recent Performance
          </h3>
          <div className="flex items-end justify-between h-32 bg-gray-50 rounded-lg p-4 gap-1">
            {recentPerformanceData.map((score, index) => (
              <div key={`score-${index}`} className="flex flex-col items-center flex-1">
                <div 
                  className="w-full max-w-6 bg-gradient-to-t from-purple-500 to-blue-500 rounded-t-sm mb-2 transition-all duration-1000 min-h-[4px]"
                  style={{ height: `${Math.max(4, (score / 100) * 80)}px` }}
                  title={`Score: ${score}%`}
                />
                <span className="text-xs text-gray-600">{score}%</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Achievements */}
      {unlockedAchievements.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            Recent Achievements
          </h3>
          <div className="space-y-3">
            {unlockedAchievements.slice(-3).map((achievement) => (
              <div key={achievement.id} className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="text-2xl" role="img" aria-label="Achievement icon">
                  {achievement.icon}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-yellow-800">{achievement.title}</h4>
                  <p className="text-sm text-yellow-600">{achievement.description}</p>
                </div>
                {achievement.unlockedAt && (
                  <div className="text-xs text-yellow-600">
                    {achievement.unlockedAt.toLocaleDateString()}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Next Achievement */}
      {nextAchievement && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Next Achievement</h3>
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="text-2xl grayscale" role="img" aria-label="Locked achievement">
                {nextAchievement.icon}
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-800">{nextAchievement.title}</h4>
                <p className="text-sm text-gray-600">{nextAchievement.description}</p>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
              <div 
                className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-1000"
                style={{ 
                  width: `${Math.min(100, Math.max(0, (nextAchievement.progress / nextAchievement.maxProgress) * 100))}%` 
                }}
              />
            </div>
            <div className="text-xs text-gray-600 text-right">
              {nextAchievement.progress} / {nextAchievement.maxProgress}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};