import { useQuery } from '@tanstack/react-query';
import backend from '~backend/client';
import { StatsCards } from '../components/StatsCards';
import { TodayHabits } from '../components/TodayHabits';
import { StreakChart } from '../components/StreakChart';
import { QuickActions } from '../components/QuickActions';

export function Dashboard() {
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
          Good morning! 🌅
        </h1>
        <p className="text-gray-600">
          Ready to build some amazing habits today?
        </p>
      </div>

      <StatsCards stats={overallStats} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <TodayHabits habits={habitsWithStats?.habits || []} />
          <StreakChart habits={habitsWithStats?.habits || []} />
        </div>
        
        <div>
          <QuickActions />
        </div>
      </div>
    </div>
  );
}
