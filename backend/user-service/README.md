# User-Service API Reference

## Table of Contents

1. [Health Check](#health-check)
2. [User Management](#user-management)

    * [List Users](#list-users)
    * [Get User by ID](#get-user-by-id)
    * [Get User by Username](#get-user-by-username)
    * [Update User](#update-user)
    * [Update User Password](#update-user-password)
    * [Update User Avatar](#update-user-avatar)
    * [Create User (Internal)](#create-user-internal)
    * [Delete User (Internal)](#delete-user-internal)
    * [Verify User Password (Internal)](#verify-user-password-internal)
3. [Friend Management](#friend-management)

    * [List Friends](#list-friends)
    * [Add Friend](#add-friend)
    * [Remove Friend](#remove-friend)
    * [Check Friendship](#check-friendship)

---

## Health Check

| Method | Path    | Description           | Internal | Request | Response (200)       |
| ------ | ------- | --------------------- | -------- | ------- | -------------------- |
| GET    | /health | Health check endpoint | No       | –       | `{ "status": "ok" }` |

---

## User Management

### List Users

| Method | Path   | Description                       | Internal | Request Params                           | Response (200)                                                                                      |
| ------ | ------ | --------------------------------- | -------- | ---------------------------------------- | --------------------------------------------------------------------------------------------------- |
| GET    | /users | List users with pagination/search | No       | `offset`, `limit`, `q` (query, optional) | `{ "total": 2, "users": [{ "userId": 1, "username": "foo" }, { "userId": 2, "username": "bar" }] }` |

---

### Get User by ID

| Method | Path        | Description      | Internal | Request Params | Response (200)                            | Response (404)                                       |
| ------ | ----------- | ---------------- | -------- | -------------- | ----------------------------------------- | ---------------------------------------------------- |
| GET    | /users/\:id | Get user details | No       | `id` (path)    | `{ "userId": 1, "username": "foo", ... }` | `{ "status": "error", "message": "User not found" }` |

---

### Get User by Username

| Method | Path                       | Description          | Internal | Request Params    | Response (200)                            | Response (404)                                       |
| ------ | -------------------------- | -------------------- | -------- | ----------------- | ----------------------------------------- | ---------------------------------------------------- |
| GET    | /users/username/\:username | Get user by username | No       | `username` (path) | `{ "userId": 1, "username": "foo", ... }` | `{ "status": "error", "message": "User not found" }` |

---

### Update User

| Method | Path        | Description              | Internal | Request Params | Request Body                            | Response (200)         | Response (404)                                                                 | Response (409)                                                                         |
| ------ | ----------- | ------------------------ | -------- | -------------- | --------------------------------------- | ---------------------- | ------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------- |
| PUT    | /users/\:id | Update username or email | No       | `id` (path)    | `{ "username": "...", "email": "..." }` | `{ "modified": true }` | `{ "status": "error", "code": "USER_NOT_FOUND", "message": "User not found" }` | `{ "status": "error", "code": "EMAIL_EXISTS", "message": "Email already registered" }` |

---

### Update User Password

| Method | Path                 | Description            | Internal | Request Params | Request Body                               | Response (200)         | Response (400/401/404)                                                                                                                                                                                                           |
| ------ | -------------------- | ---------------------- | -------- | -------------- | ------------------------------------------ | ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| PUT    | /users/\:id/password | Update user's password | No       | `id` (path)    | `{ "currentPwd": "...", "newPwd": "..." }` | `{ "modified": true }` | - `400`: `{ "status": "error", "message": "Google Authorized Users can't set a password." }`<br>- `401`: `{ "status": "error", "message": "Invalid password" }`<br>- `404`: `{ "status": "error", "message": "User not found" }` |

---

### Update User Avatar

| Method | Path               | Description                  | Internal | Request Params | Request Body        | Response (200)         | Response (400/404)                                                                                                            |
| ------ | ------------------ | ---------------------------- | -------- | -------------- | ------------------- | ---------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| PUT    | /users/\:id/avatar | Update avatar (PNG, 200x200) | No       | `id` (path)    | (binary image file) | `{ "modified": true }` | - `400`: `{ "status": "error", "message": "No file field" }`<br>- `404`: `{ "status": "error", "message": "User not found" }` |

---

### Create User (Internal)

| Method | Path            | Description       | Internal | Request Body                                                                                           | Response (201)                                   | Response (409/500)                                                                                                                    |
| ------ | --------------- | ----------------- | -------- | ------------------------------------------------------------------------------------------------------ | ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------- |
| POST   | /internal/users | Create a new user | Yes      | `{ "email": "...", "password": "...", "username": "...", "authProvider": "...", "providerSub": null }` | `{ "id": 1, "email": "...", "username": "..." }` | - `409`: `{ "status": "error", "code": "EMAIL_EXISTS", ... }`<br>- `500`: `{ "status": "error", "message": "Failed to create user" }` |

---

### Delete User (Internal)

| Method | Path                 | Description       | Internal | Request Params | Response (204) | Response (404)                                       |
| ------ | -------------------- | ----------------- | -------- | -------------- | -------------- | ---------------------------------------------------- |
| DELETE | /internal/users/\:id | Delete user by ID | Yes      | `id` (path)    | (no content)   | `{ "status": "error", "message": "User not found" }` |

---

### Verify User Password (Internal)

| Method | Path                            | Description                   | Internal | Request Body                            | Response (200)    | Response (400/404)                                                                                                                                             |
| ------ | ------------------------------- | ----------------------------- | -------- | --------------------------------------- | ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| POST   | /internal/users/verify-password | Verify user password by email | Yes      | `{ "email": "...", "password": "..." }` | `{ "userId": 1 }` | - `400`: `{ "status": "error", "message": "Google Authorized Users can't have a password." }`<br>- `404`: `{ "status": "error", "message": "User not found" }` |

---

## Friend Management

### List Friends

| Method | Path              | Description         | Internal | Request Params                                        | Response (200)                                                    | Response (404)                                       |
| ------ | ----------------- | ------------------- | -------- | ----------------------------------------------------- | ----------------------------------------------------------------- | ---------------------------------------------------- |
| GET    | /friends/\:userId | List user's friends | No       | `userId` (path), `offset`, `limit`, `q` (query, opt.) | `{ "total": 1, "friends": [{ "userId": 2, "username": "bar" }] }` | `{ "status": "error", "message": "User not found" }` |

---

### Add Friend

| Method | Path     | Description  | Internal | Request Body                     | Response (201)            | Response (404/409)                                                                                                                        |
| ------ | -------- | ------------ | -------- | -------------------------------- | ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| POST   | /friends | Add a friend | No       | `{ "userId": 1, "friendId": 2 }` | `{ "status": "success" }` | - `404`: `{ "status": "error", "message": "User or friend not found" }`<br>- `409`: `{ "status": "error", "message": "Already friends" }` |

---

### Remove Friend

| Method | Path     | Description     | Internal | Request Body                     | Response (204) | Response (404)                                                 |
| ------ | -------- | --------------- | -------- | -------------------------------- | -------------- | -------------------------------------------------------------- |
| DELETE | /friends | Remove a friend | No       | `{ "userId": 1, "friendId": 2 }` | (no content)   | `{ "status": "error", "message": "User or friend not found" }` |

---

### Check Friendship

| Method | Path                                    | Description                    | Internal | Request Params              | Response (200)       | Response (404)                                                 |
| ------ | --------------------------------------- | ------------------------------ | -------- | --------------------------- | -------------------- | -------------------------------------------------------------- |
| GET    | /users/\:userId/relationship/\:friendId | Check if two users are friends | No       | `userId`, `friendId` (path) | `{ "status": true }` | `{ "status": "error", "message": "User or Friend not found" }` |

---

## Error Envelope Format

For error responses, the following envelope is used unless otherwise specified:

```json
{
  "status": "error",
  "code": "ERROR_CODE",   // Optional, machine-readable code (e.g. "EMAIL_EXISTS")
  "message": "Description of error"
}
```

---

## Notes

* **Internal**: Routes marked as *Internal* are intended only for inter-service or admin use and should not be exposed to the frontend.
* **Parameters**:

    * `path`: /users/\:id means `id` is a URL segment parameter.
    * `query`: `?offset=0&limit=10&q=foo`
* **HTTP Statuses**: Standard usage (200, 201, 204, 400, 401, 404, 409, 500).
* **Avatar Upload**: Must be a PNG image, 200x200px.

---
