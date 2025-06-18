# AuthService – Technical Specification

**Edition v5 – 9 June 2025**
*(v1 → base, v2 → /auth/register, v3 → local schemas, v4 → UserService client & refined contracts → v5 Complete API reference + remove redundant sections)*

---

## 1 Overview

AuthService is a standalone **Fastify** microservice that provides:

* Email/Password authentication (password verification delegated to **UserService**)
* Google OAuth 2.0 login
* JWT access‑ & refresh‑token issuance/validation/rotation
* Optional TOTP‑based 2‑Factor Authentication for email/password logins
* SQLite persistence via **Prisma ORM**
* DTO contracts imported from **@KarenDanielyan/ft‑transcendence-api‑types**
* **Schema validation** via local **AJV** TypeScript schema objects (`src/schemas/*.schema.ts`)

---

## 2 Key Decisions

| Concern            | Decision                                      | Rationale                                          |
|--------------------|-----------------------------------------------|----------------------------------------------------|
| Data ownership     | No `password_hash` column                     | Single credential source in user-service           |
| External OAuth     | Google Sign‑in via **@fastify/oauth2**        | Familiar UX, minimal extra code                    |
| Contracts location | DTOs in **api‑types**, schemas local          | Keeps SRP; each service can swap AJV for Zod etc.  |
| ORM                | **Prisma Client + Prisma Migrate**            | Declarative schema, ergonomic API                  |
| DB                 | `auth.db` (SQLite)                            | Lightweight, container‑friendly                    |
| Internal comms     | REST/HTTP on Docker network                   | Aligns with global constraints                     |
| Internal auth      | Shared `X‑Cluster‑Token` header               | Simple and service‑agnostic. **Currently unsued**. |
| Rate‑limit & CSP   | **@fastify/rate-limit** + **@fastify/helmet** | Adequate for project scope                         |

---

## 3 Api Reference

### Table of Contents

1. [Health Check](#health-check)
2. [Authentication](#authentication)

* [Register](#register)
* [Login](#login)
* [Login with 2FA](#login-with-2fa)
* [Complete 2FA Login](#complete-2fa-login)
* [Refresh Tokens](#refresh-tokens)
* [Logout](#logout)
3. [Two-Factor Authentication](#two-factor-authentication)
* [Enable 2FA](#enable-2fa)
* [Verify 2FA OTP](#verify-2fa-otp)
4. [OAuth](#oauth)
* [Google OAuth2](#google-oauth2)
* [Google OAuth2 Callback](#google-oauth2-callback)
* [Google OAuth2 Claim](#google-oauth2-claim)
5. [Internal Endpoints](#internal-endpoints)
* [Verify JWT Token](#verify-jwt-token-internal)
* [Revoke Refresh Token](#revoke-refresh-token-internal)

---

### Health Check

| Method | Path    | Description           | Internal | Request | Response (200)       |
| ------ | ------- | --------------------- | -------- | ------- | -------------------- |
| GET    | /health | Health check endpoint | No       | –       | `{ "status": "ok" }` |

---

### Authentication

#### Register

**Registration Flow:**
```mermaid
sequenceDiagram
    autonumber
    participant SPA
    participant AS  as AuthService
    participant US  as UserService

    SPA->>AS: POST /auth/register (username, email, pw)
    AS->>US:  POST /internal/users/validate-unique
    US-->>AS: 409 conflict (field)
    AS-->>SPA: ApiError (USERNAME_EXISTS / EMAIL_EXISTS)
    Note over AS: or continue if ok
    AS->>US: POST /internal/users/create
    US-->>AS: 201 { userId }
    AS->>AS: issueTokenPair()
    AS-->>SPA: 200 { accessToken, refreshToken, userId }
```

| Method | Path           | Description       | Internal | Request Body                                               | Response (200)                                                 | Response (409)                                                                      |
| ------ | -------------- | ----------------- | -------- | ---------------------------------------------------------- | -------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| POST   | /auth/register | Register new user | No       | `{ "email": "...", "username": "...", "password": "..." }` | `{ "accessToken": "jwt", "refreshToken": "jwt", "userId": 1 }` | `{ "status": "error", "code": "EMAIL_EXISTS", "message": "E‑mail already in use" }` |

---

#### Login

Login is always a two-step process:
1. **Initial login**: with email/password, which may require 2FA.
2. **Check 2FA**: if required, the user must complete 2FA with a one-time password (OTP) sent to their authenticator app.
2. **Complete login**: In both cases, a login ticket is issued to prevent replay attacks. In case of 2FA, the ticket is used to verify the OTP. Otherwise, the ticket is claimed via `/auth/login/claim`.
3. **Refresh tokens**: are issued alongside access tokens for session management.

**Login Flow:**
```mermaid
sequenceDiagram
  autonumber
  participant FE as SPA
  participant AS as AuthService
  participant US as UserService
  participant DB as Auth DB

  FE->>AS: POST /auth/login {email,password}
  AS->>US: POST /internal/users/verify-password
  US-->>AS: 200 { userId, has2fa:true }
  AS->>DB: INSERT LoginTicket (uuid, userId, 5-min ttl)
  AS-->>FE: 200 { requires2fa: true || false, loginTicket }

  alt requires2fa: true
    FE->>AS: POST /auth/login/2fa {loginTicket, otp}
    AS->>DB: SELECT LoginTicket (check ttl & unused)
    alt Valid login ticket
      AS->>DB: UPDATE LoginTicket.used = true
      AS->>AS: speakeasy.totp.verify(otp, secret)
      AS->>DB: INSERT RefreshToken (hashed)
      AS-->>FE: 200 { accessToken, refreshToken, userId }
    else Invalid login ticket
      AS-->>FE: APIError (TICKET_INVALID, 'Login ticket expired or invalid')
    end
  else requires2fa: false
    FE->>AS: POST /auth/login/claim {loginTicket}
    AS->>DB: SELECT LoginTicket (check ttl & unused)
    alt Valid login ticket
      AS->>DB: UPDATE LoginTicket.used = true
      AS->>DB: INSERT RefreshToken (hashed)
      AS-->>FE: 200 { accessToken, refreshToken, userId }
    else Invalid login ticket
      AS-->>FE: APIError (TICKET_INVALID, 'Login ticket expired or invalid')
    end
  end
```
#### Begin Login

| Method | Path        | Description               | Internal | Request Body                            | Response (200)                                     | Response (401)                                                                                   |
|--------|-------------|---------------------------|----------|-----------------------------------------|----------------------------------------------------|--------------------------------------------------------------------------------------------------|
| POST   | /auth/login | Login with email/password | No       | `{ "email": "...", "password": "..." }` | `{ "requires2fa": "bool", "loginTicket": "uuid" }` | `{ "status": "error", "code": "INVALID_CREDENTIALS", "message": "Email or password incorrect" }` |

---

#### Complete 2FA Login

| Method | Path            | Description                      | Internal | Request Body                                 | Response (200)                                                 | Response (401)                                                                                  |
|--------|-----------------|----------------------------------|----------|----------------------------------------------|----------------------------------------------------------------|-------------------------------------------------------------------------------------------------|
| POST   | /auth/login/2fa | Complete login with OTP & ticket | No       | `{ "loginTicket": "uuid", "otp": "123456" }` | `{ "accessToken": "jwt", "refreshToken": "jwt", "userId": 1 }` | `{ "status": "error", "code": "TICKET_INVALID", "message": "Login ticket invalid or expired" }` |

#### Claim Login Ticket

| Method | Path              | Description                        | Internal | Request Body                | Response (200)                                                 | Response (401)                                                                                        | Response (501)                                                                       |
|--------|-------------------|------------------------------------|----------|-----------------------------|----------------------------------------------------------------|-------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------|
| POST   | /auth/login/claim | Claim tokens using a login ticket. | No       | `{ "loginTicket": "uuid" }` | `{ "accessToken": "jwt", "refreshToken": "jwt", "userId": 1 }` | `{ "status": "error", "code": "INVALID_LOGIN_TICKET", "message": "Login ticket invalid or expired" }` | `{ "status": "error", "code": "CLAIM_FAILED", "message": "Failed to claim tokens" }` |

---

#### Rotate Tokens

| Method | Path          | Description                   | Internal | Request Body                | Response (200)                                                 | Response (401)                                                                                    |
|--------|---------------|-------------------------------|----------|-----------------------------|----------------------------------------------------------------|---------------------------------------------------------------------------------------------------|
| POST   | /auth/refresh | Refresh access/refresh tokens | No       | `{ "refreshToken": "jwt" }` | `{ "accessToken": "jwt", "refreshToken": "jwt", "userId": 1 }` | `{ "status": "error", "code": "INVALID_REFRESH", "message": "Refresh token invalid or expired" }` |

---

#### Logout

**Logout Flow:**
```mermaid
sequenceDiagram
    autonumber
    participant FE as SPA
    participant AS as AuthService
    participant DB as Auth DB

    FE->>AS: POST /auth/logout { refreshToken }
    AS->>DB: UPDATE RefreshToken SET revoked=true WHERE tokenHash = HMAC(refreshToken)
    DB-->>AS: 1 row changed
    AS-->>FE: 200 { revoked:true }
```

| Method | Path         | Description             | Internal | Request Body                | Response (200)        | Response (404)                                                                                              |
|--------|--------------|-------------------------|----------|-----------------------------|-----------------------|-------------------------------------------------------------------------------------------------------------|
| POST   | /auth/logout | Logout and revoke token | No       | `{ "refreshToken": "jwt" }` | `{ "revoked": true }` | `{ "status": "error", "code": "TOKEN_NOT_FOUND", "message": "Refresh token not found or already revoked" }` |

---

### Enable Two-Factor Authentication (2FA)

**Enable 2FA Flow:**
```mermaid
sequenceDiagram
    autonumber
    participant FE as SPA
    participant AS as AuthService
    participant DB as Auth DB

    activate FE
    FE->>AS: POST /auth/2fa/enable  (JWT auth header)
    AS->>AS: speakeasy.generateSecret()
    AS->>DB: INSERT TotpSecret { userId, secret, verified:false }
    AS-->>FE: 200 { otpauthUrl, qrSvg }

    FE->>AS: POST /auth/2fa/verify { otp } (JWT)
    AS->>DB: SELECT TotpSecret
    AS->>AS: speakeasy.totp.verify()
    AS->>DB: UPDATE TotpSecret SET verified=true
    AS-->>FE: 200 { verified:true }
```

#### Enable 2FA

| Method | Path             | Description         | Internal | Request Headers                 | Response (200)                                                 |
|--------|------------------|---------------------|----------|---------------------------------|----------------------------------------------------------------|
| POST   | /auth/2fa/enable | Enable 2FA for user | No       | `Authorization: Bearer <token>` | `{ "otpauthUrl": "otpauth://...", "qrSvg": "<svg>...</svg>" }` |

---

#### Verify 2FA OTP

| Method | Path             | Description         | Internal | Request Headers                 | Request Body          | Response (200)         | Response (400)                                                                   | Response (401)                                                           |
|--------|------------------|---------------------|----------|---------------------------------|-----------------------|------------------------|----------------------------------------------------------------------------------|--------------------------------------------------------------------------|
| POST   | /auth/2fa/verify | Verify 2FA for user | No       | `Authorization: Bearer <token>` | `{ "otp": "123456" }` | `{ "verified": true }` | `{ "status": "error", "code": "2FA_NOT_ENABLED", "message": "2FA not enabled" }` | `{ "status": "error", "code": "OTP_INVALID", "message": "Invalid OTP" }` |

---

### OAuth

**Google OAuth2 Flow:**
```mermaid
sequenceDiagram
    participant SPA 	as	SPA Browser
    participant Auth	as	Auth-Service
    participant Google	as	Google OAuth
    participant DB		as	Database

    Note over SPA: User clicks **“Sign in with Google”**
    SPA ->> SPA: window.location.href = /auth/oauth/google

    SPA ->> Google: GET https://accounts.google.com/o/oauth2/v2/auth …
    Google -->> SPA: Consent screen
    SPA ->> Google: User approves scopes
    Google -->> Auth: GET /auth/oauth/google/callback?code&state

    Auth ->> DB: INSERT LoginTicket {id, userId, ttl ≈ 90 s, status=fresh}
    DB -->> Auth: ticketId
    Auth -->> SPA: 302 → SPA_ROOT/oauth/complete<hash-symbol>ticket=ticketId

    SPA ->> SPA: Extract `ticket`
    SPA ->> Auth: POST /auth/login/claim {ticket}
    Auth ->> DB: get & set status=used (one-time)
    DB -->> Auth: userId (if valid & fresh)
    Auth ->> Auth: issue {access JWT, refresh JWT}
    Auth -->> SPA: JSON {access, refresh}
```
#### Google OAuth2
| Method | Path               | Description         | Internal | Request Headers | Response (200)                            | Response (500)                                                                         |
|--------|--------------------|---------------------|----------|-----------------|-------------------------------------------|----------------------------------------------------------------------------------------|
| GET    | /auth/oauth/google | Start Google OAuth2 | No       | –               | 302 Redirect to Google OAuth consent page | `{ "status": "error", "code": "OAUTH_FAILED", "message": "Google OAuthTypes failed" }` |

#### Google OAuth2 Callback
| Method | Path                        | Description                                                                                                      | Internal | Request Headers | Response (302)                        | Response (500)                                                                         |
|--------|-----------------------------|------------------------------------------------------------------------------------------------------------------|----------|-----------------|---------------------------------------|----------------------------------------------------------------------------------------|
| GET    | /auth/oauth/google/callback | Google OAuth2 callback. Handles Google login, creates user if needed, issues login ticket, and redirects to SPA. | No       | –               | 302 Redirect to SPA with login ticket | `{ "status": "error", "code": "OAUTH_FAILED", "message": "Google OAuthTypes failed" }` |

---
### Internal Endpoints

#### Verify JWT Token (Internal)

| Method | Path                    | Description      | Internal | Request Headers (unused)   | Request Body         | Response (200)                       | Response (401)                                                                          | Response (403)                                                                      | Response (404)                                                                 |
|--------|-------------------------|------------------|----------|----------------------------|----------------------|--------------------------------------|-----------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------|--------------------------------------------------------------------------------|
| POST   | /internal/tokens/verify | Verify JWT token | Yes      | `X-Cluster-Token: <token>` | `{ "token": "jwt" }` | `{ "userId": 1, "username": "foo" }` | `{ "status": "error", "code": "INVALID_TOKEN", "message": "Token invalid or expired" }` | `{ "status": "error", "code": "FORBIDDEN", "message": "Internal route forbidden" }` | `{ "status": "error", "code": "USER_NOT_FOUND", "message": "User not found" }` |

---

#### Revoke Refresh Token (Internal)

| Method | Path                    | Description                  | Internal | Request Headers (unused)   | Request Body                           | Response (200)        | Response (404)                                                                           |
|--------|-------------------------|------------------------------|----------|----------------------------|----------------------------------------|-----------------------|------------------------------------------------------------------------------------------|
| POST   | /internal/tokens/revoke | Revoke a refresh token by ID | Yes      | `X-Cluster-Token: <token>` | `{ "tokenId": "refresh-token-db-id" }` | `{ "revoked": true }` | `{ "status": "error", "code": "TOKEN_NOT_FOUND", "message": "Refresh token not found" }` |

---

### Error Envelope Format

For error responses, the following envelope is used unless otherwise specified:

```json
{
	"status": "error",
	"code": "ERROR_CODE",   // Optional, machine-readable code (e.g. "EMAIL_EXISTS")
	"message": "Description of error"
}
```

---

### Notes

* **Internal**: Internal endpoints are for service-to-service use only (require `X-Cluster-Token` header).
* **Authorization**: Some endpoints require `Authorization: Bearer <token>`.
* **HTTP Status Codes**: Standard usage (200, 400, 401, 403, 404, 409, 500).

---

## 4 Shared Types & Validation

* **DTO definitions** live in `@KarenDanielyan/ft-transcendence-api-types` and are imported with:

  ```ts
  import { Auth } from '@KarenDanielyan/ft-transcendence-api-types';
  ```
* **Runtime validation** uses one AJV instance registered by `plugins/validation.ts`.

  ```ts
  app.setValidatorCompiler(({ schema }) => ajv.compile(schema));
  ```

The plugin loads every `*Schema.ts` file under `src/schemas` and registers its `default` export (`$id` must be unique).
* **Strict mode** – `additionalProperties: false`, coercion off, built‑in `format` keywords via `ajv-formats`.
* **Error handler** – any thrown `ApiError` passes through the global handler which serialises `{ status:'error', code, message }`.

---

## 5 Database Schema (Prisma)

```prisma
// prisma/schema.prisma

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model RefreshToken {
  id            String   @id @default(cuid())
  userId        Int
  tokenHash     String
  expiresAt     DateTime
  createdAt     DateTime @default(now())
  rotatedAt     DateTime?
  revoked       Boolean  @default(false)
  revokedReason String?
}

model TotpSecret {
  id        String   @id @default(cuid())
  userId    Int      @unique
  secret    String   // base32
  verified  Boolean  @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model OAuthAccount {
  id             String   @id @default(cuid())
  provider       String
  providerUserId String
  email          String
  userId         Int
  createdAt      DateTime @default(now())

  @@unique([provider, providerUserId])
}

model LoginTicket {
  id        String   @id                // UUID v4
  userId    Int
  expiresAt DateTime
  used      Boolean  @default(false)
  createdAt DateTime @default(now())

  @@index([userId])
  @@index([expiresAt])
}
```
---

## 6 Environment Variables

| Var                         | Purpose                      | Example                                       |
|-----------------------------|------------------------------|-----------------------------------------------|
| `DATABASE_URL`              | SQLite file path             | `file:./auth.db`                              |
| `JWT_SECRET`                | HMAC key for access tokens   | *32‑byte base64*                              |
| `REFRESH_TOKEN_SALT`        | HMAC salt for refresh tokens | *32‑byte base64*                              |
| `CLUSTER_TOKEN`             | Internal service auth        | `d4c3…`                                       |
| `GOOGLE_CLIENT_ID`/`SECRET` | OAuth creds                  | *from GCP console*                            |
| `GOOGLE_CALLBACK_URL`       | OAuth redirect URL           | `http://localhost:3000/auth/oauth/google/callback` |
| `SPA_OAUTH_ROUTE`         | SPA OAuth complete route     | `http://localhost/oauth/complete`             |

---

## 7 Changelog

| Date        | Version | Notes                                                                                                      |
|-------------|---------|------------------------------------------------------------------------------------------------------------|
| 9 June 2025 | v5      | Remove redundant sections, complete API reference, update 2FA flow.                                        |
| 28 May 2025 | v5      | Complete API reference                                                                                     |
| 25 May 2025 | v4      | Register refactor, `username` uniqueness, login‑ticket model, UserService contracts, spec styling fixes.   |
| 24 May 2025 | v3      | Local schemas moved to `src/schemas`, AJV auto‑loader.                                                     |
| 23 May 2025 | v2      | Added `/auth/register` endpoint contracts.                                                                 |
| 22 May 2025 | v1      | Initial AuthService spec (login, refresh, OAuth, 2FA).                                                     |
