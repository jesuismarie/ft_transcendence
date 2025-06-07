# Game Service API

Game Service предоставляет API для управления турнирами и матчами. Ниже описаны основные ручки, их контракты, примеры запросов и ответов.

---

## 1. Create Tournament

### **POST** `/create-tournament`

Создает новый турнир.

### Request Body

```json
{
  "name": "string",
  "max_players_count": 4,
  "created_by": "number"
}
```

### Response

- **201 Created**

```json
{
  "message": "Tournament created successfully",
  "tournament_id": 1,
  "name": "Tournament Name"
}
```

- **400 Bad Request**

```json
{ "message": "Tournament name is required" }
```

```json
{ "message": "max_players_count must be one of the following: 2, 4, 8, 16" }
```

```json
{
  "message": "Creator is already registered in another active tournament and cannot create a new one."
}
```

```json
{
  "message": "A tournament created by this user already exists in 'created' or 'in_progress' status."
}
```

- **500 Internal Server Error**

```json
{ "message": "Error creating tournament" }
```

---

## 2. Delete Tournament

### **DELETE** `/delete-tournament`

Удаляет турнир.

### Request Body

```json
{
  "tournament_id": 1,
  "created_by": 1
}
```

### Response

- **200 OK**

```json
{ "message": "Tournament deleted successfully" }
```

- **400 Bad Request**

```json
{ "message": "Invalid tournament_id" }
```

```json
{ "message": "Only tournaments with status 'created' can be deleted" }
```

```json
{ "message": "Only the tournament creator can delete the tournament" }
```

- **404 Not Found**

```json
{ "message": "Tournament not found" }
```

---

## 3. Get Tournament Participants

### **GET** `/get-tournament-participants`

Возвращает участников турнира.

### Query Parameters

```json
{ "id": 1 }
```

### Response

- **200 OK**

```json
{
  "maxPlayersCount": 4,
  "currentPlayersCount": 2,
  "participants": ["player1", "player2"]
}
```

- **400 Bad Request**

```json
{ "message": "Invalid tournament ID" }
```

- **404 Not Found**

```json
{ "message": "Tournament not found" }
```

- **500 Internal Server Error**

```json
{ "message": "Failed to fetch participants" }
```

---

## 4. Get Tournaments Info

### **GET** `/get-tournaments-info`

Возвращает информацию о турнирах.

### Query Parameters

```json
{ "limit": 10, "offset": 0 }
```

### Response

- **200 OK**

```json
{
  "totalCount": 2,
  "tournaments": [
    {
      "id": 1,
      "name": "Tournament 1",
      "created_by": 1,
      "max_players_count": 4,
      "current_players_count": 2,
      "status": "created",
      "participants": [1, 2],
      "winner": null
    }
  ]
}
```

- **500 Internal Server Error**

```json
{ "message": "Failed to fetch tournaments info" }
```

---

## 5. Register to Tournament

### **POST** `/register-to-tournament`

Регистрирует игрока в турнире.

### Request Body

```json
{
  "user_id": 1,
  "tournament_id": 1
}
```

### Response

- **201 Created**

```json
{ "message": "User registered to tournament" }
```

- **400 Bad Request**

```json
{ "message": "Invalid user_id or tournament_id" }
```

```json
{ "message": "User is already registered in another active tournament" }
```

- **500 Internal Server Error**

```json
{ "message": "Registration failed" }
```

---

## 6. Start Tournament

### **POST** `/start-tournament`

Запускает турнир.

### Request Body

```json
{
  "tournament_id": 1,
  "created_by": 1
}
```

### Response

- **200 OK**

```json
{
  "match_id": 1,
  "player_1": 1,
  "player_2": 2,
  "participants": [1, 2],
  "status": "in_progress"
}
```

- **400 Bad Request**

```json
{ "message": "Invalid tournament_id" }
```

```json
{ "message": "Tournament already started" }
```

```json
{ "message": "Tournament is not full yet" }
```

- **403 Forbidden**

```json
{ "message": "Only the tournament creator can start the tournament" }
```

- **404 Not Found**

```json
{ "message": "Tournament not found" }
```

- **500 Internal Server Error**

```json
{ "message": "Failed to start tournament" }
```

---

## 7. Tournament Next Step

### **POST** `/tournament-next-step`

Переходит к следующему этапу турнира.

### Request Body

```json
{ "id": 1 }
```

### Response

- **200 OK**

```json
{
  "match_id": 2,
  "player_1": "player3",
  "player_2": "player4",
  "participants": ["player1", "player2", "player3", "player4"],
  "status": "in_progress"
}
```

- **400 Bad Request**

```json
{ "message": "Invalid tournament_id" }
```

```json
{ "message": "Match already in progress" }
```

```json
{ "message": "Not all matches in the current level are finished" }
```

- **404 Not Found**

```json
{ "message": "Tournament not found" }
```

- **500 Internal Server Error**

```json
{ "message": "Failed to proceed to the next step" }
```

---

## 8. Unregister from Tournament

### **POST** `/unregister-from-tournament`

Удаляет игрока из турнира.

### Request Body

```json
{
  "user_id": 1,
  "tournament_id": 1
}
```

### Response

- **200 OK**

```json
{ "message": "User unregistered from tournament" }
```

- **400 Bad Request**

```json
{ "message": "Invalid user_id or tournament_id" }
```

```json
{ "message": "Cannot unregister from a tournament that has already started" }
```

```json
{ "message": "User is not registered in the tournament" }
```

- **500 Internal Server Error**

```json
{ "message": "Unregistration failed" }
```

---

## 9. Get Match History by User

### **GET** `/get-match-history-by-user`

Возвращает историю матчей игрока.

### Query Parameters

```json
{ "user_id": 1, "limit": 10, "offset": 0 }
```

### Response

- **200 OK**

```json
{
  "totalCount": 2,
  "matches": [
    {
      "id": 1,
      "opponent": 2,
      "status": "ended",
      "is_won": true,
      "score": { "user": 3, "opponent": 2 },
      "date": "2023-10-01T12:00:00Z"
    }
  ]
}
```

- **400 Bad Request**

```json
{ "message": "Invalid input parameters" }
```

- **500 Internal Server Error**

```json
{ "message": "Failed to fetch match history" }
```

---

## 10. Save Match Result

### **POST** `/save-match-result`

Сохраняет результат матча.

### Request Body

```json
{
  "match_id": 1,
  "winner": 1,
  "score": { "score_1": 3, "score_2": 2 }
}
```

### Response

- **200 OK**

```json
{ "message": "Match result saved successfully" }
```

- **400 Bad Request**

```json
{ "message": "Invalid input parameters" }
```

```json
{ "message": "Match is not in progress" }
```

```json
{ "message": "Invalid winner" }
```

- **404 Not Found**

```json
{ "message": "Match not found" }
```

- **500 Internal Server Error**

```json
{ "message": "Failed to save match result" }
```

---
