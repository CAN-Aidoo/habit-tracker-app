import { api } from "encore.dev/api";
import { habitDB } from "./db";
import type { HabitWithStats, HabitStats } from "./types";

interface GetHabitStatsResponse {
  habits: HabitWithStats[];
}

// Retrieves habits with their statistics including streaks and completion rates.
export const getHabitsWithStats = api<void, GetHabitStatsResponse>(
  { expose: true, method: "GET", path: "/habits/stats" },
  async () => {
    const habits = await habitDB.queryAll`
      SELECT id, name, description, frequency, start_date as "startDate", end_date as "endDate", goal, unit, color, icon, created_at as "createdAt", updated_at as "updatedAt"
      FROM habits
      ORDER BY created_at DESC
    `;

    const habitsWithStats: HabitWithStats[] = [];

    for (const habit of habits) {
      // Get all entries for this habit
      const entries = await habitDB.queryAll<{ date: Date; completed: boolean }>`
        SELECT date, completed
        FROM habit_entries
        WHERE habit_id = ${habit.id}
        ORDER BY date DESC
      `;

      // Calculate current streak
      let currentStreak = 0;
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      for (let i = 0; i < entries.length; i++) {
        const entryDate = new Date(entries[i].date);
        entryDate.setHours(0, 0, 0, 0);
        
        const expectedDate = new Date(today);
        expectedDate.setDate(today.getDate() - i);
        
        if (entryDate.getTime() === expectedDate.getTime() && entries[i].completed) {
          currentStreak++;
        } else {
          break;
        }
      }

      // Calculate longest streak
      let longestStreak = 0;
      let tempStreak = 0;

      for (const entry of entries.reverse()) {
        if (entry.completed) {
          tempStreak++;
          longestStreak = Math.max(longestStreak, tempStreak);
        } else {
          tempStreak = 0;
        }
      }

      // Calculate completion rate
      const totalEntries = entries.length;
      const completedEntries = entries.filter(e => e.completed).length;
      const completionRate = totalEntries > 0 ? (completedEntries / totalEntries) * 100 : 0;

      habitsWithStats.push({
        habit,
        currentStreak,
        longestStreak,
        completionRate,
        totalEntries,
        completedEntries,
      });
    }

    return { habits: habitsWithStats };
  }
);

// Retrieves overall statistics across all habits.
export const getOverallStats = api<void, HabitStats>(
  { expose: true, method: "GET", path: "/habits/overall-stats" },
  async () => {
    const totalHabits = await habitDB.queryRow<{ count: number }>`
      SELECT COUNT(*) as count FROM habits
    `;

    const activeHabits = await habitDB.queryRow<{ count: number }>`
      SELECT COUNT(*) as count 
      FROM habits 
      WHERE end_date IS NULL OR end_date >= CURRENT_DATE
    `;

    const today = new Date().toISOString().split('T')[0];
    const todayStats = await habitDB.queryRow<{ total: number; completed: number }>`
      SELECT 
        COUNT(h.id) as total,
        COUNT(CASE WHEN he.completed = true THEN 1 END) as completed
      FROM habits h
      LEFT JOIN habit_entries he ON h.id = he.habit_id AND he.date = ${today}
      WHERE h.end_date IS NULL OR h.end_date >= CURRENT_DATE
    `;

    // Calculate average completion rate
    const completionRates = await habitDB.queryAll<{ rate: number }>`
      SELECT 
        CASE 
          WHEN COUNT(he.id) > 0 
          THEN (COUNT(CASE WHEN he.completed = true THEN 1 END)::float / COUNT(he.id)) * 100
          ELSE 0 
        END as rate
      FROM habits h
      LEFT JOIN habit_entries he ON h.id = he.habit_id
      GROUP BY h.id
    `;

    const averageCompletionRate = completionRates.length > 0
      ? completionRates.reduce((sum, r) => sum + r.rate, 0) / completionRates.length
      : 0;

    return {
      totalHabits: totalHabits?.count || 0,
      activeHabits: activeHabits?.count || 0,
      totalStreaks: 0, // This would require more complex calculation
      averageCompletionRate,
      todayCompleted: todayStats?.completed || 0,
      todayTotal: todayStats?.total || 0,
    };
  }
);
