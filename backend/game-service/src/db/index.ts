import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";
import fs from "fs/promises";
import path from "path";

let db: Database;

export async function initDb() {
  db = await open({
    filename: "./game.db",
    driver: sqlite3.Database,
  });

  const schema = await fs.readFile(path.resolve("src/db/schema.sql"), "utf-8");
  await db.exec(schema);
}

export function getDb(): Database {
  return db;
}
