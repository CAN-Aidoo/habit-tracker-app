import { api } from "encore.dev/api";
import { habitDB } from "./db";
import type { Habit } from "./types";

interface ListHabitsResponse {
  habits: Habit[];
}

// Retrieves all habits, ordered by creation date.
export const list = api<void, ListHabitsResponse>(
  { expose: true, method: "GET", path: "/habits" },
  async () => {
    const habits = await habitDB.queryAll<Habit>`
      SELECT id, name, description, frequency, start_date as "startDate", end_date as "endDate", goal, unit, color, icon, created_at as "createdAt", updated_at as "updatedAt"
      FROM habits
      ORDER BY created_at DESC
    `;
    
    return { habits };
  }
);
