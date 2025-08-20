export type HabitFrequency = "daily" | "weekly" | "monthly";

export interface Habit {
  id: number;
  name: string;
  description?: string;
  frequency: HabitFrequency;
  startDate: Date;
  endDate?: Date;
  goal?: number;
  unit?: string;
  color: string;
  icon: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface HabitEntry {
  id: number;
  habitId: number;
  date: Date;
  completed: boolean;
  value?: number;
  notes?: string;
  createdAt: Date;
}

export interface CreateHabitRequest {
  name: string;
  description?: string;
  frequency: HabitFrequency;
  startDate: Date;
  endDate?: Date;
  goal?: number;
  unit?: string;
  color?: string;
  icon?: string;
}

export interface UpdateHabitRequest {
  id: number;
  name?: string;
  description?: string;
  frequency?: HabitFrequency;
  startDate?: Date;
  endDate?: Date;
  goal?: number;
  unit?: string;
  color?: string;
  icon?: string;
}

export interface CreateEntryRequest {
  habitId: number;
  date: Date;
  completed: boolean;
  value?: number;
  notes?: string;
}

export interface HabitWithStats {
  habit: Habit;
  currentStreak: number;
  longestStreak: number;
  completionRate: number;
  totalEntries: number;
  completedEntries: number;
}

export interface HabitStats {
  totalHabits: number;
  activeHabits: number;
  totalStreaks: number;
  averageCompletionRate: number;
  todayCompleted: number;
  todayTotal: number;
}
