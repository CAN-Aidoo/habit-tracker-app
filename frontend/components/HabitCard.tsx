import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Flame, 
  Target, 
  TrendingUp,
  Check,
  Clock
} from 'lucide-react';
import backend from '~backend/client';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/components/ui/use-toast';
import type { HabitWithStats } from '~backend/habit/types';

interface HabitCardProps {
  habitWithStats: HabitWithStats;
  onUpdate: () => void;
}

export function HabitCard({ habitWithStats, onUpdate }: HabitCardProps) {
  const [isCompleting, setIsCompleting] = useState(false);
  const { habit } = habitWithStats;
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const deleteHabitMutation = useMutation({
    mutationFn: backend.habit.deleteHabit,
    onSuccess: () => {
      toast({
        title: 'Habit deleted',
        description: 'The habit has been successfully deleted.',
      });
      onUpdate();
    },
    onError: (error) => {
      console.error('Failed to delete habit:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete habit. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const createEntryMutation = useMutation({
    mutationFn: backend.habit.createEntry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits-with-stats'] });
      queryClient.invalidateQueries({ queryKey: ['overall-stats'] });
      queryClient.invalidateQueries({ queryKey: ['entries'] });
      toast({
        title: 'Great job! 🎉',
        description: 'Keep up the amazing work!',
      });
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

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this habit? This action cannot be undone.')) {
      deleteHabitMutation.mutate({ id: habit.id });
    }
  };

  const handleMarkComplete = async () => {
    setIsCompleting(true);
    try {
      await createEntryMutation.mutateAsync({
        habitId: habit.id,
        date: new Date(),
        completed: true,
      });
    } finally {
      setIsCompleting(false);
    }
  };

  const isCompleted = habitWithStats.currentStreak > 0; // Simplified check

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 hover:shadow-lg transition-all duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: habit.color }}
          />
          <div>
            <h3 className="font-semibold text-gray-900">{habit.name}</h3>
            {habit.description && (
              <p className="text-sm text-gray-600 mt-1">{habit.description}</p>
            )}
          </div>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={handleDelete}
              className="text-red-600 focus:text-red-600"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 text-orange-600 mb-1">
            <Flame className="w-4 h-4" />
          </div>
          <p className="text-lg font-bold text-gray-900">{habitWithStats.currentStreak}</p>
          <p className="text-xs text-gray-600">Current</p>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 text-blue-600 mb-1">
            <Target className="w-4 h-4" />
          </div>
          <p className="text-lg font-bold text-gray-900">{habitWithStats.longestStreak}</p>
          <p className="text-xs text-gray-600">Best</p>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 text-green-600 mb-1">
            <TrendingUp className="w-4 h-4" />
          </div>
          <p className="text-lg font-bold text-gray-900">
            {Math.round(habitWithStats.completionRate)}%
          </p>
          <p className="text-xs text-gray-600">Rate</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex-1 bg-gray-200 rounded-full h-2">
          <div
            className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-500"
            style={{ width: `${habitWithStats.completionRate}%` }}
          />
        </div>
        
        <Button
          size="sm"
          variant={isCompleted ? "default" : "outline"}
          onClick={handleMarkComplete}
          disabled={isCompleting || isCompleted}
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
}
