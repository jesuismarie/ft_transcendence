import fp from "fastify-plugin";
import Database from "better-sqlite3";
import path from "path";
import fs from "fs";
import type { FastifyInstance } from "fastify";

export type DB = Database.Database;

export default fp(async function initDb(app: FastifyInstance) {
  const dbPath = process.env.DB_PATH || path.join(process.cwd(), 'data', 'users.db');
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });
  const db = new Database(dbPath);

  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");

  try {
    app.log.info("Creating tournament table...");
    db.exec(`CREATE TABLE IF NOT EXISTS tournament (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      created_by INTEGER NOT NULL,
      max_players_count INTEGER NOT NULL,
      current_players_count INTEGER DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'created' CHECK (status IN ('created', 'in_progress', 'ended', 'error')),
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      started_at TEXT,
      ended_at TEXT
    )`);
    app.log.info("Tournament table created.");
  } catch (err) {
    app.log.error("Error creating tournament table:", err);
  }

  try {
    app.log.info("Creating tournament_player table...");
    db.exec(`CREATE TABLE IF NOT EXISTS tournament_player (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      player_id INTEGER NOT NULL,
      tournament_id INTEGER NOT NULL,
      wins INTEGER NOT NULL DEFAULT 0,
      losses INTEGER NOT NULL DEFAULT 0,
      UNIQUE(player_id, tournament_id)
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
      winner_id INTEGER,
      score_1 INTEGER,
      score_2 INTEGER,
      started_at TEXT,
      game_level INTEGER,
      group_id INTEGER,
      tournament_id INTEGER,
      status TEXT NOT NULL DEFAULT 'created' CHECK (status IN ('created', 'in_progress', 'ended', 'error')),
      UNIQUE(tournament_id, group_id, game_level, player_1, player_2)
    )`);
    app.log.info("Match table created.");
  } catch (err) {
    app.log.error("Error creating match table:", err);
  }

  try {
    app.log.info("Creating match_invitation_request table...");
    db.exec(`CREATE TABLE IF NOT EXISTS match_invitation_request (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id1 INTEGER NOT NULL,
      user_id2 INTEGER NOT NULL,
      date_time TEXT DEFAULT CURRENT_TIMESTAMP,
      is_accepted BOOLEAN
    )`);
    app.log.info("Match_invitation_request table created.");
  } catch (err) {
    app.log.error("Error creating match_invitation_request table:", err);
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
