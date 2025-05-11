// import { getUserByUsername } from '../plugins/db.js';
// import db from '../plugins/db.js';
import { initDb, getUserByUsername, createUser, getUserByGoogleId, updatePassword } from '../plugins/db.js';

import bcrypt from 'bcrypt';
import jwt from '@fastify/jwt';

export default async function (fastify, options) {
  fastify.post('/login', async (request, reply) => {
    const { username, password } = request.body;  // Get username and password from the request body

    // Get the user from the database by their username
    const user = await new Promise((resolve, reject) => {
      getUserByUsername(username, (err, user) => {
        if (err) return reject(err);  // If there's an error, reject the promise
        resolve(user);  // Otherwise, resolve the promise with the user data
      });
    });

    // If no user is found, return an error
    if (!user) {
      return reply.status(400).send({ error: 'User not found' });
    }

    // Compare the provided password with the hashed one in the database
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return reply.status(401).send({ error: 'Invalid password' });  // If passwords don't match, return an error
    }

    // Sign and create a JWT token for the user
    const token = fastify.jwt.sign({ id: user.id, username: user.username });
    return reply.send({ token });  // Send the token back to the client
  });
}
