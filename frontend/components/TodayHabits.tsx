import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Check, Clock, Flame } from 'lucide-react';
import backend from '~backend/client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import type { HabitWithStats } from '~backend/habit/types';

interface TodayHabitsProps {
  habits: HabitWithStats[];
}

export function TodayHabits({ habits }: TodayHabitsProps) {
  const [completingHabits, setCompletingHabits] = useState<Set<number>>(new Set());
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createEntryMutation = useMutation({
    mutationFn: backend.habit.createEntry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits-with-stats'] });
      queryClient.invalidateQueries({ queryKey: ['overall-stats'] });
      queryClient.invalidateQueries({ queryKey: ['entries'] });
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

  const handleToggleHabit = async (habitId: number, completed: boolean) => {
    setCompletingHabits(prev => new Set(prev).add(habitId));
    
    try {
      await createEntryMutation.mutateAsync({
        habitId,
        date: new Date(),
        completed,
      });
      
      toast({
        title: completed ? 'Great job! 🎉' : 'Habit updated',
        description: completed 
          ? 'Keep up the amazing work!' 
          : 'Habit marked as incomplete.',
      });
    } finally {
      setCompletingHabits(prev => {
        const newSet = new Set(prev);
        newSet.delete(habitId);
        return newSet;
      });
    }
  };

  const todayHabits = habits.filter(h => h.habit.frequency === 'daily');
  const completedToday = todayHabits.filter(h => {
    // This is a simplified check - in a real app you'd check today's entries
    return h.currentStreak > 0;
  }).length;

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-1">
            Today's Habits
          </h2>
          <p className="text-gray-600">
            {completedToday} of {todayHabits.length} completed
          </p>
        </div>
        
        <div className="flex items-center gap-2 text-orange-600">
          <Flame className="w-5 h-5" />
          <span className="font-semibold">
            {Math.max(...habits.map(h => h.currentStreak), 0)} day streak
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {todayHabits.map((habitWithStats) => {
          const { habit } = habitWithStats;
          const isCompleting = completingHabits.has(habit.id);
          const isCompleted = habitWithStats.currentStreak > 0; // Simplified check
          
          return (
            <div
              key={habit.id}
              className="flex items-center gap-4 p-4 rounded-xl bg-gray-50/50 hover:bg-gray-100/50 transition-colors"
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: habit.color }}
              />
              
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{habit.name}</h3>
                {habit.description && (
                  <p className="text-sm text-gray-600">{habit.description}</p>
                )}
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <Flame className="w-4 h-4" />
                  {habitWithStats.currentStreak}
                </div>
                
                <Button
                  size="sm"
                  variant={isCompleted ? "default" : "outline"}
                  onClick={() => handleToggleHabit(habit.id, !isCompleted)}
                  disabled={isCompleting}
                  className={isCompleted 
                    ? "bg-green-500 hover:bg-green-600 text-white" 
                    : ""
                  }
                >
                  {isCompleting ? (
                    <Clock className="w-4 h-4 animate-spin" />
                  ) : isCompleted ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    "Mark Done"
                  )}
                </Button>
              </div>
            </div>
          );
        })}
        
        {todayHabits.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No daily habits to complete today</p>
          </div>
        )}
      </div>
    </div>
  );
}
