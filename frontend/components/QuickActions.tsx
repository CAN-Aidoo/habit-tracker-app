import { useState } from 'react';
import { Plus, Calendar, BarChart3, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CreateHabitDialog } from './CreateHabitDialog';

export function QuickActions() {
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const actions = [
    {
      title: 'New Habit',
      description: 'Create a new habit to track',
      icon: Plus,
      color: 'from-blue-500 to-purple-600',
      onClick: () => setShowCreateDialog(true),
    },
    {
      title: 'View Calendar',
      description: 'See your monthly progress',
      icon: Calendar,
      color: 'from-green-500 to-teal-600',
      onClick: () => window.location.href = '/calendar',
    },
    {
      title: 'Check Stats',
      description: 'Analyze your performance',
      icon: BarChart3,
      color: 'from-orange-500 to-red-600',
      onClick: () => window.location.href = '/stats',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Quick Actions
        </h2>
        
        <div className="space-y-3">
          {actions.map((action) => (
            <Button
              key={action.title}
              variant="outline"
              className="w-full justify-start h-auto p-4 hover:bg-gray-50"
              onClick={action.onClick}
            >
              <div className={`w-10 h-10 bg-gradient-to-r ${action.color} rounded-lg flex items-center justify-center mr-3`}>
                <action.icon className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-900">{action.title}</p>
                <p className="text-sm text-gray-600">{action.description}</p>
              </div>
            </Button>
          ))}
        </div>
      </div>

      {/* Motivational Quote */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-3 mb-3">
          <Target className="w-6 h-6" />
          <h3 className="font-semibold">Daily Motivation</h3>
        </div>
        <p className="text-sm opacity-90 leading-relaxed">
          "Success is the sum of small efforts repeated day in and day out."
        </p>
        <p className="text-xs opacity-75 mt-2">— Robert Collier</p>
      </div>

      <CreateHabitDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSuccess={() => window.location.reload()}
      />
    </div>
  );
}
