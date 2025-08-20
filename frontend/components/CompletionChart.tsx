import { PieChart, TrendingUp } from 'lucide-react';
import type { HabitWithStats } from '~backend/habit/types';

interface CompletionChartProps {
  habits: HabitWithStats[];
}

export function CompletionChart({ habits }: CompletionChartProps) {
  const totalEntries = habits.reduce((sum, h) => sum + h.totalEntries, 0);
  const completedEntries = habits.reduce((sum, h) => sum + h.completedEntries, 0);
  const overallCompletionRate = totalEntries > 0 ? (completedEntries / totalEntries) * 100 : 0;

  const segments = habits.map(h => ({
    name: h.habit.name,
    value: h.completionRate,
    color: h.habit.color,
  })).sort((a, b) => b.value - a.value);

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50">
      <div className="flex items-center gap-3 mb-6">
        <PieChart className="w-6 h-6 text-purple-600" />
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            Completion Rates
          </h2>
          <p className="text-gray-600">
            Performance across all habits
          </p>
        </div>
      </div>

      <div className="text-center mb-6">
        <div className="text-4xl font-bold text-gray-900 mb-2">
          {Math.round(overallCompletionRate)}%
        </div>
        <p className="text-gray-600">Overall Completion Rate</p>
      </div>

      <div className="space-y-4">
        {segments.slice(0, 5).map((segment, index) => (
          <div key={segment.name} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-lg font-bold text-gray-400">
                  #{index + 1}
                </div>
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: segment.color }}
                />
                <span className="font-medium text-gray-900">{segment.name}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <TrendingUp className="w-4 h-4" />
                {Math.round(segment.value)}%
              </div>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="h-2 rounded-full transition-all duration-500"
                style={{ 
                  width: `${segment.value}%`,
                  backgroundColor: segment.color,
                }}
              />
            </div>
          </div>
        ))}
        
        {habits.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <PieChart className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No habits to analyze</p>
          </div>
        )}
      </div>
    </div>
  );
}
