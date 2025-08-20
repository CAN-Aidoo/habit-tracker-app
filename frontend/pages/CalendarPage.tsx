import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import backend from '~backend/client';
import { Button } from '@/components/ui/button';
import { CalendarGrid } from '../components/CalendarGrid';
import { HabitLegend } from '../components/HabitLegend';

export function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const { data: habits } = useQuery({
    queryKey: ['habits'],
    queryFn: () => backend.habit.list(),
  });

  const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

  const { data: entries } = useQuery({
    queryKey: ['entries', startOfMonth.toISOString(), endOfMonth.toISOString()],
    queryFn: () => backend.habit.getEntries({
      startDate: startOfMonth.toISOString().split('T')[0],
      endDate: endOfMonth.toISOString().split('T')[0],
    }),
  });

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const monthName = currentDate.toLocaleDateString('en-US', { 
    month: 'long', 
    year: 'numeric' 
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Calendar View
          </h1>
          <p className="text-gray-600">
            Visualize your habit completion across the month
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateMonth('prev')}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          
          <h2 className="text-xl font-semibold text-gray-900 min-w-[200px] text-center">
            {monthName}
          </h2>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateMonth('next')}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        <div className="xl:col-span-3">
          <CalendarGrid
            currentDate={currentDate}
            habits={habits?.habits || []}
            entries={entries?.entries || []}
          />
        </div>
        
        <div>
          <HabitLegend habits={habits?.habits || []} />
        </div>
      </div>
    </div>
  );
}
