import { api } from "encore.dev/api";
import { Query } from "encore.dev/api";
import { habitDB } from "./db";
import type { HabitEntry } from "./types";

interface GetEntriesRequest {
  habitId?: Query<number>;
  startDate?: Query<string>;
  endDate?: Query<string>;
}

interface GetEntriesResponse {
  entries: HabitEntry[];
}

// Retrieves habit entries with optional filtering by habit ID and date range.
export const getEntries = api<GetEntriesRequest, GetEntriesResponse>(
  { expose: true, method: "GET", path: "/habits/entries" },
  async (req) => {
    let query = `
      SELECT id, habit_id as "habitId", date, completed, value, notes, created_at as "createdAt"
      FROM habit_entries
      WHERE 1=1
    `;
    const params: any[] = [];
    let paramIndex = 1;

    if (req.habitId) {
      query += ` AND habit_id = $${paramIndex++}`;
      params.push(req.habitId);
    }

    if (req.startDate) {
      query += ` AND date >= $${paramIndex++}`;
      params.push(req.startDate);
    }

    if (req.endDate) {
      query += ` AND date <= $${paramIndex++}`;
      params.push(req.endDate);
    }

    query += ` ORDER BY date DESC`;

    const entries = await habitDB.rawQueryAll<HabitEntry>(query, ...params);
    
    return { entries };
  }
);
