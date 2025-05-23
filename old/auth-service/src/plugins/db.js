// db.js
import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the SQLite database file
const dbPath = path.join(__dirname, '../../db.sqlite');

// Open the SQLite database
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Oops, couldn\'t open the database:', err);
  } else {
    console.log('Connected to the SQLite database!');
  }
});

// Function to initialize the database and create tables if they don’t exist
export const initDb = () => {
  return new Promise((resolve, reject) => {
    const createUsersTable = `
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        password TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        google_id TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    db.run(createUsersTable, (err) => {
      if (err) {
        console.error('Error creating users table:', err);
        reject(err);
      } else {
        console.log('Users table is good to go.');
        resolve();
      }
    });
  });
};

// Function to get a user by their username
export const getUserByUsername = (username, callback) => {
  const query = 'SELECT * FROM users WHERE username = ?';
  db.get(query, [username], (err, row) => {
    if (err) {
      console.error('Whoops, error fetching user by username:', err);
      callback(err, null);
    } else {
      callback(null, row);
    }
  });
};

// Function to create a new user in the database
export const createUser = (username, password, email, googleId, callback) => {
  const query = 'INSERT INTO users (username, password, email, google_id) VALUES (?, ?, ?, ?)';
  db.run(query, [username, password, email, googleId], function (err) {
    if (err) {
      console.error('Error creating user:', err);
      callback(err, null);
    } else {
      callback(null, { id: this.lastID, username, email, googleId });
    }
  });
};

// Function to get a user by their Google ID
export const getUserByGoogleId = (googleId, callback) => {
  const query = 'SELECT * FROM users WHERE google_id = ?';
  db.get(query, [googleId], (err, row) => {
    if (err) {
      console.error('Error fetching user by Google ID:', err);
      callback(err, null);
    } else {
      callback(null, row);
    }
  });
};

// Function to update a user's password
export const updatePassword = (userId, newPassword, callback) => {
  const query = 'UPDATE users SET password = ? WHERE id = ?';
  db.run(query, [newPassword, userId], (err) => {
    if (err) {
      console.error('Error updating password:', err);
      callback(err);
    } else {
      callback(null);
    }
  });
};
