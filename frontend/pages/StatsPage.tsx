import { useQuery } from '@tanstack/react-query';
import backend from '~backend/client';
import { StatsOverview } from '../components/StatsOverview';
import { CompletionChart } from '../components/CompletionChart';
import { StreakLeaderboard } from '../components/StreakLeaderboard';
import { HabitProgress } from '../components/HabitProgress';

export function StatsPage() {
  const { data: overallStats } = useQuery({
    queryKey: ['overall-stats'],
    queryFn: () => backend.habit.getOverallStats(),
  });

  const { data: habitsWithStats } = useQuery({
    queryKey: ['habits-with-stats'],
    queryFn: () => backend.habit.getHabitsWithStats(),
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Statistics & Analytics
        </h1>
        <p className="text-gray-600">
          Deep insights into your habit-building journey
        </p>
      </div>

      <StatsOverview stats={overallStats} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <CompletionChart habits={habitsWithStats?.habits || []} />
        <StreakLeaderboard habits={habitsWithStats?.habits || []} />
      </div>

      <HabitProgress habits={habitsWithStats?.habits || []} />
    </div>
  );
}
