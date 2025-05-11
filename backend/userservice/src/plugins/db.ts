import fp from 'fastify-plugin';
import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { FastifyInstance } from 'fastify';

export type DB = Database.Database;

function ensureColumn(db: DB, col: string, ddl: string) {
    const exists = db
        .prepare(`PRAGMA table_info(users)`)
        .all()
        .some((row: any) => row.name === col);
    if (!exists) db.exec(`ALTER TABLE users ADD COLUMN ${ddl}`);
}

export default fp(async function dbPlugin(app: FastifyInstance) {
    const dataDir = path.join(__dirname, '../data');
    fs.mkdirSync(dataDir, { recursive: true });
    const dbPath = path.join(dataDir, 'users.db');
    const db = new Database(dbPath);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');

    // migrations / DDL
    db.exec(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    displayName TEXT NOT NULL,
    passwordHash TEXT NOT NULL,
    avatarPath TEXT,
    rating INTEGER NOT NULL DEFAULT 1000,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP
  )`);
    ensureColumn(db, 'avatarPath', 'avatarPath TEXT');
    ensureColumn(db, 'rating', 'rating INTEGER NOT NULL DEFAULT 1000');
    
    db.exec(`CREATE TABLE IF NOT EXISTS friends (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER NOT NULL,
    friendId INTEGER NOT NULL,
    UNIQUE(userId, friendId),
    FOREIGN KEY(userId) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY(friendId) REFERENCES users(id) ON DELETE CASCADE
  )`);
    
    db.exec(`CREATE INDEX IF NOT EXISTS idx_users_displayName ON users(displayName)`);
    db.exec(`CREATE INDEX IF NOT EXISTS idx_friends_userId ON friends(userId)`);
    
    app.decorate('db', db);

    app.addHook('onClose', (instance, done) => {
        instance.log.info('Closing SQLite DB');
        db.close();
        done();
    });
});

declare module 'fastify' {
    interface FastifyInstance {
        db: DB;
    }
}