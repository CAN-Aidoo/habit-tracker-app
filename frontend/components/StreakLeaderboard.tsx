import { Trophy, Flame, Medal, Award } from 'lucide-react';
import type { HabitWithStats } from '~backend/habit/types';

interface StreakLeaderboardProps {
  habits: HabitWithStats[];
}

export function StreakLeaderboard({ habits }: StreakLeaderboardProps) {
  const sortedHabits = [...habits].sort((a, b) => b.longestStreak - a.longestStreak);
  
  const getRankIcon = (index: number) => {
    switch (index) {
      case 0: return { icon: Trophy, color: 'text-yellow-500' };
      case 1: return { icon: Medal, color: 'text-gray-400' };
      case 2: return { icon: Award, color: 'text-orange-600' };
      default: return { icon: Flame, color: 'text-gray-500' };
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50">
      <div className="flex items-center gap-3 mb-6">
        <Trophy className="w-6 h-6 text-yellow-600" />
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            Streak Leaderboard
          </h2>
          <p className="text-gray-600">
            Your longest streaks ranked
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {sortedHabits.slice(0, 5).map((habitWithStats, index) => {
          const { habit } = habitWithStats;
          const rankInfo = getRankIcon(index);
          
          return (
            <div
              key={habit.id}
              className={`flex items-center gap-4 p-4 rounded-xl transition-all ${
                index === 0 
                  ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200' 
                  : 'bg-gray-50 hover:bg-gray-100'
              }`}
            >
              <div className={`w-8 h-8 flex items-center justify-center ${rankInfo.color}`}>
                <rankInfo.icon className="w-5 h-5" />
              </div>
              
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: habit.color }}
              />
              
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{habit.name}</h3>
                <p className="text-sm text-gray-600">
                  Current: {habitWithStats.currentStreak} days
                </p>
              </div>

              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">
                  {habitWithStats.longestStreak}
                </div>
                <div className="text-xs text-gray-600">days</div>
              </div>
            </div>
          );
        })}
        
        {habits.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Trophy className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No streaks to display</p>
          </div>
        )}
      </div>
    </div>
  );
}
