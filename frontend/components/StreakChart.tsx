import { BarChart3, TrendingUp } from 'lucide-react';
import type { HabitWithStats } from '~backend/habit/types';

interface StreakChartProps {
  habits: HabitWithStats[];
}

export function StreakChart({ habits }: StreakChartProps) {
  const maxStreak = Math.max(...habits.map(h => h.longestStreak), 1);
  
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50">
      <div className="flex items-center gap-3 mb-6">
        <BarChart3 className="w-6 h-6 text-blue-600" />
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            Streak Overview
          </h2>
          <p className="text-gray-600">
            Your longest streaks across all habits
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {habits.slice(0, 5).map((habitWithStats) => {
          const { habit } = habitWithStats;
          const percentage = maxStreak > 0 ? (habitWithStats.longestStreak / maxStreak) * 100 : 0;
          
          return (
            <div key={habit.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: habit.color }}
                  />
                  <span className="font-medium text-gray-900">{habit.name}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <TrendingUp className="w-4 h-4" />
                  {habitWithStats.longestStreak} days
                </div>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
        
        {habits.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <BarChart3 className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No habits to display</p>
          </div>
        )}
      </div>
    </div>
  );
}
