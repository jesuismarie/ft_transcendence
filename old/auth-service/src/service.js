// import express from 'express';
// import bodyParser from 'body-parser';
// import {
//   initDb,
//   getUserByUsername,
//   createUser,
//   getUserByGoogleId,
//   updatePassword
// } from './plugins/db.js';

// const app = express();
// const PORT = process.env.PORT || 3000;

// app.use(bodyParser.json());

// // Initialize DB then start server
// initDb()
//   .then(() => {
//     console.log('Database ready. Starting server...');

//     // Example route: Get user by username
//     app.get('/user/:username', (req, res) => {
//       const { username } = req.params;
//       getUserByUsername(username, (err, user) => {
//         if (err) {
//           return res.status(500).json({ error: 'Error fetching user' });
//         }
//         if (!user) {
//           return res.status(404).json({ message: 'User not found' });
//         }
//         res.json(user);
//       });
//     });

//     // Example route: Create new user
//     app.post('/user', (req, res) => {
//       const { username, password, email, googleId } = req.body;
//       if (!username || !password || !email) {
//         return res.status(400).json({ error: 'Missing required fields' });
//       }

//       createUser(username, password, email, googleId || null, (err, newUser) => {
//         if (err) {
//           return res.status(500).json({ error: 'Error creating user' });
//         }
//         res.status(201).json(newUser);
//       });
//     });

//     // Example route: Update password
//     app.put('/user/:id/password', (req, res) => {
//       const { id } = req.params;
//       const { newPassword } = req.body;
//       if (!newPassword) {
//         return res.status(400).json({ error: 'Missing new password' });
//       }

//       updatePassword(id, newPassword, (err) => {
//         if (err) {
//           return res.status(500).json({ error: 'Error updating password' });
//         }
//         res.json({ message: 'Password updated successfully' });
//       });
//     });

//     app.listen(PORT, () => {
//       console.log(`Auth service listening at http://localhost:${PORT}`);
//     });
//   })
//   .catch((err) => {
//     console.error('Failed to initialize database:', err);
//     process.exit(1);
//   });

import express from 'express';
import bodyParser from 'body-parser';
import { initDb, getUserByUsername, createUser, getUserByGoogleId, updatePassword } from './plugins/db.js';
import jwt from 'jsonwebtoken';

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Secret key for JWT (WARNING: should store this in env vars for security)
const JWT_SECRET = 'your-secret-key';

// Root route handler
app.get('/', (req, res) => {
  res.send('Authorization microservice is running.');
});

// Initialize the database
initDb()
  .then(() => {
    console.log('Database ready. Starting server...');
  })
  .catch((err) => {
    console.error('Failed to initialize database. Exiting.');
    process.exit(1); // If DB initialization fails, shut down the server
  });

// Register a new user
app.post('/register', (req, res) => {
  const { username, password, email, googleId } = req.body;

  // Check if the user already exists in the database
  getUserByUsername(username, (err, existingUser) => {
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // If the user doesn't exist, create the new user
    createUser(username, password, email, googleId, (err, newUser) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to create user' });
      }
      return res.status(201).json({ message: 'User created successfully', user: newUser });
    });
  });
});

// Login a user and generate a JWT token
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Fetch the user from the database
  getUserByUsername(username, (err, user) => {
    if (err || !user) {
      return res.status(400).json({ error: 'Invalid username or password' });
    }

    // For simplicity, we're directly comparing passwords (but ideally, hash the password in a real app)
    if (user.password !== password) {
      return res.status(400).json({ error: 'Invalid username or password' });
    }

    // Create a JWT token for the user
    const token = jwt.sign({ userId: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });

    return res.status(200).json({ message: 'Login successful', token });
  });
});

// Protected route - example to get profile info
app.get('/profile', (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Get the token from the header

  if (!token) {
    return res.status(403).json({ error: 'No token provided' });
  }

  // Verify the JWT token
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }

    // Get user profile using the decoded token's userId
    getUserByUsername(decoded.username, (err, user) => {
      if (err || !user) {
        return res.status(404).json({ error: 'User not found' });
      }
      return res.status(200).json({ user });
    });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Auth service listening at http://localhost:${port}`);
});