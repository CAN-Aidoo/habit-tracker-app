import { SQLDatabase } from "encore.dev/storage/sqldb";

export const habitDB = new SQLDatabase("habit", {
  migrations: "./migrations",
});
