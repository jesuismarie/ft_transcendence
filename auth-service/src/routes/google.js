import { google } from 'googleapis';

// Set up OAuth2 client using your Google credentials
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  `${process.env.BASE_URL}/auth/google/callback`
);

// Scopes for user profile and email access
const scopes = ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'];

export default async function (fastify) {
  // Route to start the Google OAuth flow
  fastify.get('/auth/google', (req, reply) => {
    const url = oauth2Client.generateAuthUrl({ access_type: 'offline', scope: scopes });
    reply.redirect(url);  // Redirect user to Google login
  });

  // Callback route after Google login, where we handle the token and user info
  fastify.get('/auth/google/callback', async (req, reply) => {
    const { code } = req.query;  // Get the code from the query string
    const { tokens } = await oauth2Client.getToken(code);  // Exchange code for tokens
    oauth2Client.setCredentials(tokens);  // Set the tokens to the OAuth2 client

    const oauth2 = google.oauth2({ auth: oauth2Client, version: 'v2' });
    const { data: profile } = await oauth2.userinfo.get();  // Fetch user profile data

    // Find the user in the database, or create one if they don't exist
    let user = await fastify.db.getOrCreateGoogleUser(profile);

    // Create a JWT token for the user and send it back
    const token = fastify.jwt.sign({ id: user.id, role: user.role });
    reply.send({ token });
  });
}
