import { api, APIError } from "encore.dev/api";
import { habitDB } from "./db";
import type { UpdateHabitRequest, Habit } from "./types";

// Updates an existing habit.
export const update = api<UpdateHabitRequest, Habit>(
  { expose: true, method: "PUT", path: "/habits/:id" },
  async (req) => {
    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (req.name !== undefined) {
      updates.push(`name = $${paramIndex++}`);
      values.push(req.name);
    }
    if (req.description !== undefined) {
      updates.push(`description = $${paramIndex++}`);
      values.push(req.description);
    }
    if (req.frequency !== undefined) {
      updates.push(`frequency = $${paramIndex++}`);
      values.push(req.frequency);
    }
    if (req.startDate !== undefined) {
      updates.push(`start_date = $${paramIndex++}`);
      values.push(req.startDate);
    }
    if (req.endDate !== undefined) {
      updates.push(`end_date = $${paramIndex++}`);
      values.push(req.endDate);
    }
    if (req.goal !== undefined) {
      updates.push(`goal = $${paramIndex++}`);
      values.push(req.goal);
    }
    if (req.unit !== undefined) {
      updates.push(`unit = $${paramIndex++}`);
      values.push(req.unit);
    }
    if (req.color !== undefined) {
      updates.push(`color = $${paramIndex++}`);
      values.push(req.color);
    }
    if (req.icon !== undefined) {
      updates.push(`icon = $${paramIndex++}`);
      values.push(req.icon);
    }

    if (updates.length === 0) {
      throw APIError.invalidArgument("No fields to update");
    }

    updates.push(`updated_at = NOW()`);
    values.push(req.id);

    const query = `
      UPDATE habits 
      SET ${updates.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING id, name, description, frequency, start_date as "startDate", end_date as "endDate", goal, unit, color, icon, created_at as "createdAt", updated_at as "updatedAt"
    `;

    const habit = await habitDB.rawQueryRow<Habit>(query, ...values);
    
    if (!habit) {
      throw APIError.notFound("Habit not found");
    }
    
    return habit;
  }
);
