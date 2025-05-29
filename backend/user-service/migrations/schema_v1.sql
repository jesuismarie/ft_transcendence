-- schema_v1.sql  ────────────────────────────────────────────────
PRAGMA foreign_keys = ON;
PRAGMA journal_mode = WAL;

CREATE TABLE IF NOT EXISTS users (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    email           TEXT    NOT NULL UNIQUE,
    username        TEXT    NOT NULL UNIQUE COLLATE NOCASE,
    passwordHash    TEXT,                                     -- NULL when authProvider ≠ 'local'
    authProvider    TEXT    NOT NULL DEFAULT 'local',         -- 'local' or 'google'
    providerSub     TEXT,                                     -- UNIQUE with authProvider
    avatarPath      TEXT,
    emailVerified   INTEGER NOT NULL DEFAULT 0,
    emailVerifyToken TEXT,
    createdAt       TEXT    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CHECK( (authProvider='local'  AND passwordHash IS NOT NULL)
        OR (authProvider!='local' AND passwordHash IS NULL) )
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_users_provider
    ON users (authProvider, providerSub);

CREATE INDEX IF NOT EXISTS idx_users_username
    ON users (username COLLATE NOCASE);

CREATE TABLE IF NOT EXISTS friends (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    userId    INTEGER NOT NULL,
    friendId  INTEGER NOT NULL,
    UNIQUE(userId, friendId),
    FOREIGN KEY(userId)   REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY(friendId) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_friends_userId
    ON friends (userId);