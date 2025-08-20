import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import backend from '~backend/client';
import { Button } from '@/components/ui/button';
import { HabitCard } from '../components/HabitCard';
import { CreateHabitDialog } from '../components/CreateHabitDialog';

export function HabitsPage() {
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const { data: habitsWithStats, refetch } = useQuery({
    queryKey: ['habits-with-stats'],
    queryFn: () => backend.habit.getHabitsWithStats(),
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Your Habits
          </h1>
          <p className="text-gray-600">
            Track and manage all your habits in one place
          </p>
        </div>
        
        <Button
          onClick={() => setShowCreateDialog(true)}
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Habit
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {habitsWithStats?.habits.map((habitWithStats) => (
          <HabitCard
            key={habitWithStats.habit.id}
            habitWithStats={habitWithStats}
            onUpdate={refetch}
          />
        ))}
        
        {(!habitsWithStats?.habits || habitsWithStats.habits.length === 0) && (
          <div className="col-span-full text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No habits yet
            </h3>
            <p className="text-gray-500 mb-4">
              Create your first habit to get started on your journey
            </p>
            <Button
              onClick={() => setShowCreateDialog(true)}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Habit
            </Button>
          </div>
        )}
      </div>

      <CreateHabitDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSuccess={refetch}
      />
    </div>
  );
}
