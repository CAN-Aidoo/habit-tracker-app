import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Check } from 'lucide-react';
import backend from '~backend/client';
import { useToast } from '@/components/ui/use-toast';
import type { Habit, HabitEntry } from '~backend/habit/types';

interface CalendarGridProps {
  currentDate: Date;
  habits: Habit[];
  entries: HabitEntry[];
}

export function CalendarGrid({ currentDate, habits, entries }: CalendarGridProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createEntryMutation = useMutation({
    mutationFn: backend.habit.createEntry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['entries'] });
      queryClient.invalidateQueries({ queryKey: ['habits-with-stats'] });
    },
    onError: (error) => {
      console.error('Failed to update habit:', error);
      toast({
        title: 'Error',
        description: 'Failed to update habit. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const startOfCalendar = new Date(startOfMonth);
  startOfCalendar.setDate(startOfCalendar.getDate() - startOfCalendar.getDay());

  const days = [];
  const current = new Date(startOfCalendar);
  
  while (current <= endOfMonth || current.getDay() !== 0) {
    days.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  const getEntriesForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return entries.filter(entry => 
      entry.date.toString().split('T')[0] === dateStr
    );
  };

  const handleToggleEntry = async (habitId: number, date: Date, currentlyCompleted: boolean) => {
    await createEntryMutation.mutateAsync({
      habitId,
      date,
      completed: !currentlyCompleted,
    });
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50">
      <div className="grid grid-cols-7 gap-1 mb-4">
        {weekDays.map(day => (
          <div key={day} className="p-2 text-center text-sm font-medium text-gray-600">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => {
          const isCurrentMonth = day.getMonth() === currentDate.getMonth();
          const isToday = day.toDateString() === new Date().toDateString();
          const dayEntries = getEntriesForDate(day);
          
          return (
            <div
              key={index}
              className={`min-h-[120px] p-2 border border-gray-100 rounded-lg ${
                isCurrentMonth ? 'bg-white' : 'bg-gray-50'
              } ${isToday ? 'ring-2 ring-blue-500' : ''}`}
            >
              <div className={`text-sm font-medium mb-2 ${
                isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
              }`}>
                {day.getDate()}
              </div>
              
              <div className="space-y-1">
                {habits.slice(0, 3).map(habit => {
                  const entry = dayEntries.find(e => e.habitId === habit.id);
                  const isCompleted = entry?.completed || false;
                  
                  return (
                    <button
                      key={habit.id}
                      onClick={() => handleToggleEntry(habit.id, day, isCompleted)}
                      className={`w-full h-6 rounded text-xs flex items-center justify-center transition-all ${
                        isCompleted
                          ? 'text-white'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                      style={{
                        backgroundColor: isCompleted ? habit.color : 'transparent',
                        border: `1px solid ${habit.color}`,
                      }}
                    >
                      {isCompleted && <Check className="w-3 h-3" />}
                    </button>
                  );
                })}
                
                {habits.length > 3 && (
                  <div className="text-xs text-gray-400 text-center">
                    +{habits.length - 3} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
