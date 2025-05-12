CREATE TABLE IF NOT EXISTS tournament (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  maxPlayersCount INTEGER NOT NULL,
  currentPlayersCount INTEGER DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  started_at TEXT,
  ended_at TEXT
);

CREATE TABLE IF NOT EXISTS tournament_player (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  player_id INTEGER NOT NULL,
  tournament_id INTEGER NOT NULL,
  UNIQUE(player_id, tournament_id)
);

CREATE TABLE IF NOT EXISTS match (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  player_1 INTEGER,
  player_2 INTEGER,
  winner_id INTEGER,
  score_1 INTEGER,
  score_2 INTEGER,
  started_at TEXT,
  ended_at TEXT,
  gameLevel INTEGER NOT NULL,
  group_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'created',
  UNIQUE(group_id, gameLevel)
);