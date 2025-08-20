import { api } from "encore.dev/api";
import { habitDB } from "./db";
import type { CreateEntryRequest, HabitEntry } from "./types";

// Creates or updates a habit entry for a specific date.
export const createEntry = api<CreateEntryRequest, HabitEntry>(
  { expose: true, method: "POST", path: "/habits/entries" },
  async (req) => {
    const entry = await habitDB.queryRow<HabitEntry>`
      INSERT INTO habit_entries (habit_id, date, completed, value, notes)
      VALUES (${req.habitId}, ${req.date}, ${req.completed}, ${req.value || null}, ${req.notes || null})
      ON CONFLICT (habit_id, date)
      DO UPDATE SET 
        completed = EXCLUDED.completed,
        value = EXCLUDED.value,
        notes = EXCLUDED.notes
      RETURNING id, habit_id as "habitId", date, completed, value, notes, created_at as "createdAt"
    `;
    
    if (!entry) {
      throw new Error("Failed to create entry");
    }
    
    return entry;
  }
);
