import { api } from "encore.dev/api";
import { habitDB } from "./db";
import type { CreateHabitRequest, Habit } from "./types";

// Creates a new habit.
export const create = api<CreateHabitRequest, Habit>(
  { expose: true, method: "POST", path: "/habits" },
  async (req) => {
    const habit = await habitDB.queryRow<Habit>`
      INSERT INTO habits (name, description, frequency, start_date, end_date, goal, unit, color, icon)
      VALUES (${req.name}, ${req.description || null}, ${req.frequency}, ${req.startDate}, ${req.endDate || null}, ${req.goal || null}, ${req.unit || null}, ${req.color || '#3B82F6'}, ${req.icon || 'target'})
      RETURNING id, name, description, frequency, start_date as "startDate", end_date as "endDate", goal, unit, color, icon, created_at as "createdAt", updated_at as "updatedAt"
    `;
    
    if (!habit) {
      throw new Error("Failed to create habit");
    }
    
    return habit;
  }
);
