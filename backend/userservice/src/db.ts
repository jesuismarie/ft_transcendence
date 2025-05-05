import Database from 'better-sqlite3';
import path from 'path';
import {existsSync} from "node:fs";
import {mkdirSync} from "fs";
import {open} from "fs";


// Check if the database file exists, if not create it
const dbDir = path.join(__dirname, '..', 'data');
if (!existsSync(dbDir)) {
    mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(__dirname, '..', 'data', 'app.db');
if (!existsSync(dbPath)) {
    open(dbPath, 'w', (err) => {
        if (err) {
            console.error('Error creating database file:', err);
            process.exit(1);
        }
    });
}
// SQLite in WAL mode for concurrent reads.
const db = new Database(dbPath);

db.pragma('journal_mode = WAL');

db.exec(`CREATE TABLE IF NOT EXISTS users (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  email         TEXT    UNIQUE NOT NULL,
  displayName   TEXT    NOT NULL,
  passwordHash  TEXT    NOT NULL,
  createdAt     TEXT    NOT NULL DEFAULT (datetime('now'))
)`);

export default db;