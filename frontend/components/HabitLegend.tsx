import type { Habit } from '~backend/habit/types';

interface HabitLegendProps {
  habits: Habit[];
}

export function HabitLegend({ habits }: HabitLegendProps) {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Habit Legend
      </h3>
      
      <div className="space-y-3">
        {habits.map(habit => (
          <div key={habit.id} className="flex items-center gap-3">
            <div
              className="w-4 h-4 rounded border"
              style={{ 
                backgroundColor: habit.color,
                borderColor: habit.color,
              }}
            />
            <div>
              <p className="text-sm font-medium text-gray-900">{habit.name}</p>
              <p className="text-xs text-gray-600 capitalize">{habit.frequency}</p>
            </div>
          </div>
        ))}
        
        {habits.length === 0 && (
          <p className="text-sm text-gray-500">
            No habits to display
          </p>
        )}
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-600 mb-2">Legend:</p>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 border-2 border-blue-500 rounded" />
            <span className="text-xs text-gray-600">Not completed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded" />
            <span className="text-xs text-gray-600">Completed</span>
          </div>
        </div>
      </div>
    </div>
  );
}
