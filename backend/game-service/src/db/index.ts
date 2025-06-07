import fp from "fastify-plugin";
import Database from "better-sqlite3";
import path from "path";
import fs from "fs";
import type { FastifyInstance } from "fastify";

export type DB = Database.Database;

export default fp(async function initDb(app: FastifyInstance) {
  const dbPath =
    process.env.DB_PATH || path.join(process.cwd(), "data", "game.db");
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });
  const db = new Database(dbPath);

  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");

  try {
    app.log.info("Creating tournament table...");
    db.exec(`CREATE TABLE IF NOT EXISTS tournament (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      created_by INTEGER NOT NULL,
      name TEXT NOT NULL,
      max_players_count INTEGER NOT NULL,
      current_players_count INTEGER DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'created' CHECK (status IN ('created', 'in_progress', 'ended', 'error')),
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      started_at TEXT,
      ended_at TEXT,
      winner INTEGER
    )`);
    app.log.info("Tournament table created.");
  } catch (err) {
    app.log.error("Error creating tournament table:", err);
  }

  try {
    app.log.info("Creating tournament_player table...");
    db.exec(`CREATE TABLE IF NOT EXISTS tournament_player (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      tournament_id INTEGER NOT NULL,
      wins INTEGER NOT NULL DEFAULT 0,
      losses INTEGER NOT NULL DEFAULT 0,
      UNIQUE(user_id, tournament_id)
    )`);
    app.log.info("Tournament_player table created.");
  } catch (err) {
    app.log.error("Error creating tournament_player table:", err);
  }

  try {
    app.log.info("Creating match table...");
    db.exec(`CREATE TABLE IF NOT EXISTS match (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      player_1 INTEGER,
      player_2 INTEGER,
      winner INTEGER,
      score_1 INTEGER,
      score_2 INTEGER,
      started_at TEXT,
      game_level INTEGER NOT NULL DEFAULT 1,
      group_id INTEGER NOT NULL DEFAULT 0,
      tournament_id INTEGER NOT NULL DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'created' CHECK (status IN ('created', 'in_progress', 'ended', 'error')),
      UNIQUE(tournament_id, group_id, game_level, player_1, player_2)
    )`);
    app.log.info("Match table created.");
  } catch (err) {
    app.log.error("Error creating match table:", err);
  }

  app.decorate("db", db);

  app.addHook("onClose", (app, done) => {
    app.log.info("Closing DB...");
    db.close();
    done();
  });
});

declare module "fastify" {
  interface FastifyInstance {
    db: DB;
  }
}
