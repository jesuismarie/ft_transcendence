<h1>🔐 AUTH-SERVICE</h1>

* Login / Logout
* JWT-based session management
* Permissions
* Google SSO (OAuth 2.0)
  <br>
  <h1>Tech Stack</h1>

* Backend: Fastify (Node.js)
* Auth Tokens: JWT (JSON Web Token)
* Database: SQLite
* OAuth Provider: Google (SSO)
* Containerization: Docker
* Frontend: Typescript-based SPA consuming this service via REST API
  <br>
  <h1>Architecture</h1>
  
  ```
  auth-service/
  ├── docker/
  │   └── Dockerfile
  ├── public/
  │   └── index.php
  ├── src/
  │   ├── login.php
  │   ├── logout.php
  │   ├── session.php
  │   ├── google_sso.php
  │   └── permissions.php
  ├── utils/
  │   └── token.php
  ├── .env
  └── docker-compose.yml
  ```

  > **Note:** Content of .env file
  ```
  JWT_SECRET=your_jwt_secret_here
  GOOGLE_CLIENT_ID=your_google_client_id
  GOOGLE_CLIENT_SECRET=your_google_client_secret
  BASE_URL=http://localhost:3000
  ```
  <h1>Start/Stop</h1>

  ```
  docker-compose up --build
  docker-compose down --volumes --rmi all
  ```
  <h1>Some Test Ideas</h1>

  Register:
  ```
  curl -X POST http://localhost:3000/register \
     -H "Content-Type: application/json" \
     -d '{"username": "newuser", "password": "password123", "email": "newuser@example.com"}'
  ```
  Login:
  ```
  curl -X POST http://localhost:3000/login \
     -H "Content-Type: application/json" \
     -d '{"username": "newuser", "password": "password123"}'
  ```
  Profile (with JWT Token):
  ```
  curl -X GET http://localhost:3000/profile \
     -H "Authorization: Bearer <your-jwt-token-here>"
  ```
  Ensure the Token is Correctly Passed<br>
  When using cURL to access the /profile endpoint, make sure you're passing the correct JWT token in the Authorization header
  ```


  
  curl -X GET http://localhost:3000/profile \
     -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJuYW1lIjoibmV3dXNlciIsImlhdCI6MTc0Njk5MjU0OSwiZXhwIjoxNzQ2OTk2MTQ5fQ.CwF6_N5CxBEoXpRTaa0Pcm2JIub3x1_pfn9He07DrZA"
  ```
