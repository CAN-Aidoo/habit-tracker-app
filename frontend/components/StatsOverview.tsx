import { TrendingUp, Target, Flame, Trophy, Calendar, Award } from 'lucide-react';
import type { HabitStats } from '~backend/habit/types';

interface StatsOverviewProps {
  stats?: HabitStats;
}

export function StatsOverview({ stats }: StatsOverviewProps) {
  const cards = [
    {
      title: 'Total Habits',
      value: stats?.totalHabits || 0,
      icon: Target,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Active Habits',
      value: stats?.activeHabits || 0,
      icon: Flame,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      title: 'Today\'s Progress',
      value: `${stats?.todayCompleted || 0}/${stats?.todayTotal || 0}`,
      icon: Calendar,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Avg. Completion',
      value: `${Math.round(stats?.averageCompletionRate || 0)}%`,
      icon: TrendingUp,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Total Streaks',
      value: stats?.totalStreaks || 0,
      icon: Award,
      color: 'from-yellow-500 to-yellow-600',
      bgColor: 'bg-yellow-50',
    },
    {
      title: 'Achievement Score',
      value: Math.round((stats?.averageCompletionRate || 0) * (stats?.activeHabits || 0) / 10),
      icon: Trophy,
      color: 'from-indigo-500 to-indigo-600',
      bgColor: 'bg-indigo-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cards.map((card) => (
        <div
          key={card.title}
          className={`${card.bgColor} rounded-2xl p-6 border border-white/50 backdrop-blur-sm`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                {card.title}
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {card.value}
              </p>
            </div>
            <div className={`w-14 h-14 bg-gradient-to-r ${card.color} rounded-xl flex items-center justify-center`}>
              <card.icon className="w-7 h-7 text-white" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
