import { api, APIError } from "encore.dev/api";
import { habitDB } from "./db";

interface DeleteHabitRequest {
  id: number;
}

// Deletes a habit and all its entries.
export const deleteHabit = api<DeleteHabitRequest, void>(
  { expose: true, method: "DELETE", path: "/habits/:id" },
  async (req) => {
    const result = await habitDB.queryRow`
      DELETE FROM habits WHERE id = ${req.id} RETURNING id
    `;
    
    if (!result) {
      throw APIError.notFound("Habit not found");
    }
  }
);
