import { Target, TrendingUp, Calendar } from 'lucide-react';
import type { HabitWithStats } from '~backend/habit/types';

interface HabitProgressProps {
  habits: HabitWithStats[];
}

export function HabitProgress({ habits }: HabitProgressProps) {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50">
      <div className="flex items-center gap-3 mb-6">
        <Target className="w-6 h-6 text-blue-600" />
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            Detailed Progress
          </h2>
          <p className="text-gray-600">
            Complete breakdown of each habit
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {habits.map((habitWithStats) => {
          const { habit } = habitWithStats;
          
          return (
            <div key={habit.id} className="border border-gray-200 rounded-xl p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: habit.color }}
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900">{habit.name}</h3>
                    <p className="text-sm text-gray-600 capitalize">{habit.frequency}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-900">
                    {Math.round(habitWithStats.completionRate)}%
                  </div>
                  <div className="text-xs text-gray-600">completion</div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-blue-600 mb-1">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <p className="text-lg font-bold text-gray-900">{habitWithStats.totalEntries}</p>
                  <p className="text-xs text-gray-600">Total Days</p>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-green-600 mb-1">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <p className="text-lg font-bold text-gray-900">{habitWithStats.completedEntries}</p>
                  <p className="text-xs text-gray-600">Completed</p>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-orange-600 mb-1">
                    <Target className="w-4 h-4" />
                  </div>
                  <p className="text-lg font-bold text-gray-900">{habitWithStats.longestStreak}</p>
                  <p className="text-xs text-gray-600">Best Streak</p>
                </div>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="h-3 rounded-full transition-all duration-500"
                  style={{ 
                    width: `${habitWithStats.completionRate}%`,
                    backgroundColor: habit.color,
                  }}
                />
              </div>
            </div>
          );
        })}
        
        {habits.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Target className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No habits to analyze</p>
          </div>
        )}
      </div>
    </div>
  );
}
