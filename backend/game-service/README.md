# Game Service

The `game-service` is a backend service for managing tournaments, matches, and player interactions in the Pong game. It is built using Fastify and SQLite, providing a lightweight and efficient solution for handling game-related operations.

---

## Table of Contents

- [Features](#features)
- [Setup](#setup)
- [Database Schema](#database-schema)
- [API Endpoints](#api-endpoints)
  - [Tournament Routes](#tournament-routes)
  - [Match Routes](#match-routes)
  - [Match Invitation Routes](#match-invitation-routes)
- [Logic Overview](#logic-overview)
- [Development](#development)
- [License](#license)

---

## Features

- Create, start, and manage tournaments.
- Register and unregister players from tournaments.
- Handle match creation and history retrieval.
- Manage match invitations between players.
- SQLite database for persistent storage.

---

## Setup

### Prerequisites

- Node.js (v16 or higher)
- npm (v8 or higher)

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd backend/game-service
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up the database:

   - The database is automatically initialized on service startup.
   - By default, the SQLite database is stored in `data/users.db`.

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Access the service at `http://localhost:3000`.

---

## Database Schema

The database consists of the following tables:

1. **tournament**: Stores tournament details.
2. **tournament_player**: Tracks players registered in tournaments.
3. **match**: Stores match details, including scores and statuses.
4. **match_invitation_request**: Handles match invitations between players.

---

## API Endpoints

### Tournament Routes

#### Create Tournament

- **Endpoint**: `POST /create-tournament`
- **Request Body**:
  ```json
  {
    "name": "Tournament Name",
    "max_players_count": 8,
    "created_by": 1
  }
  ```
- **Response**:
  ```json
  {
    "message": "Tournament created successfully",
    "tournament_id": 1,
    "name": "Tournament Name"
  }
  ```

#### Start Tournament

- **Endpoint**: `POST /start-tournament`
- **Request Body**:
  ```json
  {
    "tournament_id": 1
  }
  ```
- **Response**:
  ```json
  {
    "message": "Tournament started"
  }
  ```

#### Get Tournaments Info

- **Endpoint**: `POST /get-tournaments-info`
- **Request Body**:
  ```json
  {
    "tournament_id": 1
  }
  ```
- **Response**:
  ```json
  [
    {
      "id": 1,
      "name": "Tournament Name",
      "created_by": 1,
      "max_players_count": 8,
      "current_players_count": 8,
      "status": "in_progress",
      "participants": [1, 2, 3, 4]
    }
  ]
  ```

#### Register to Tournament

- **Endpoint**: `POST /register-to-tournament`
- **Request Body**:
  ```json
  {
    "user_id": 2,
    "tournament_id": 1
  }
  ```
- **Response**:
  ```json
  {
    "message": "User registered to tournament"
  }
  ```

#### Unregister from Tournament

- **Endpoint**: `POST /unregister-from-tournament`
- **Request Body**:
  ```json
  {
    "user_id": 2,
    "tournament_id": 1
  }
  ```
- **Response**:
  ```json
  {
    "message": "User unregistered from tournament"
  }
  ```

#### Delete Tournament

- **Endpoint**: `DELETE /delete-tournament`
- **Request Body**:
  ```json
  {
    "tournament_id": 1
  }
  ```
- **Response**:
  ```json
  {
    "message": "Tournament deleted successfully"
  }
  ```

---

### Match Routes

#### Create Match

- **Endpoint**: `POST /create-match`
- **Request Body**:
  ```json
  {
    "player_1": 1,
    "player_2": 2,
    "tournament_id": 1,
    "group_id": 1,
    "game_level": 1
  }
  ```
- **Response**:
  ```json
  {
    "message": "Tournament match created"
  }
  ```

#### Get Match History by User

- **Endpoint**: `POST /get-match-history-by-user`
- **Request Body**:
  ```json
  {
    "user_id": 1,
    "limit": 10,
    "offset": 0
  }
  ```
- **Response**:
  ```json
  {
    "totalCount": 5,
    "matches": [
      {
        "id": 1,
        "opponent": 2,
        "status": "ended",
        "is_won": true,
        "score": {
          "user": 10,
          "opponent": 5
        },
        "date": "2023-10-01T12:00:00Z"
      }
    ]
  }
  ```

#### Get Tournament Match History

- **Endpoint**: `POST /get-tournament-match-history`
- **Request Body**:
  ```json
  {
    "tournament_id": 1,
    "limit": 10,
    "offset": 0,
    "statuses": ["ended"]
  }
  ```
- **Response**:
  ```json
  {
    "total_count": 3,
    "matches": [
      {
        "id": 1,
        "user1_id": 1,
        "user2_id": 2,
        "status": "ended",
        "winner_id": 1,
        "score": {
          "score_1": 10,
          "score_2": 5
        },
        "date": "2023-10-01T12:00:00Z"
      }
    ]
  }
  ```

---

### Match Invitation Routes

#### Create Match Invitation

- **Endpoint**: `POST /create-match-invitation-request`
- **Request Body**:
  ```json
  {
    "user_id1": 1,
    "user_id2": 2
  }
  ```
- **Response**:
  ```json
  {
    "message": "Match invitation request created"
  }
  ```

#### Respond to Match Invitation

- **Endpoint**: `PATCH /respond-to-match-invitation-request`
- **Request Body**:
  ```json
  {
    "request_id": 1,
    "is_accepted": true
  }
  ```
- **Response**:
  ```json
  {
    "message": "Invitation response recorded"
  }
  ```

---

## Logic Overview

### Tournament Management

- Tournaments can only be started when the maximum number of players is reached.
- Players can register or unregister from tournaments before they start.
- The tournament creator is automatically registered upon creation.

### Match Management

- Matches can be created as part of a tournament or as friendly matches.
- Tournament matches are grouped and follow a bracket system.

### Match Invitations

- Players can send match invitations to other players.
- Invitations can be accepted or rejected.

---

## Development

### Scripts

- **Start Development Server**: `npm run dev`
- **Build for Production**: `npm run build`
- **Start Production Server**: `npm start`

### Folder Structure

- `src/routes`: Contains API route handlers.
- `src/repositories`: Handles database interactions.
- `src/db`: Database initialization and schema definitions.
- `src/types`: TypeScript type definitions.

---

## License

This project is licensed under the MIT License.
