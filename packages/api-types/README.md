# API Types Package

Shared TypeScript interfaces for ft\_transcendence microservices and the frontend.

---

## Getting Started

This package provides a single source of truth for all REST payloads via TypeScript declarations.

**Prerequisites**

* Node.js >= 14
* npm >= 7 (for workspaces support)
* A monorepo root with `packages/api-types` folder

**Clone and Install**

```bash
# From your monorepo root
git clone <your-repo-url> .
npm install
```

**Build the types package**

```bash
cd packages/api-types
npm run build
```

This emits `.d.ts` files into `packages/api-types/dist` for consumption by your services and front end.

---

## How to install in your microservice

A separate developer can consume this package in any service (e.g. AuthService, UserService, GameService) or the React SPA.

### 1. Ensure workspace linking (preferred)

If your repo uses npm workspaces, the package is already linked at install time. In your service’s `package.json` add:

```json
{
  "dependencies": {
    "@ft-transcendence/api-types": "*"
  }
}
```

Then:

```bash
# From monorepo root
npm install
```

Imports will resolve automatically:

```ts
import { Auth, User, Game } from '@ft-transcendence/api-types';
```

### 2. Without workspaces (path install)

If you can’t use workspaces, install via a relative path:

```bash
cd services/auth-service
npm install ../../packages/api-types
```

Then import as above.

### 3. Configure TS path mapping

In your service’s `tsconfig.json`, you can add for IDE support:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@ft-transcendence/api-types": ["../api-types/src"]
    }
  }
}
```

---

## How to contribute / add more types

Extend the package by adding new interfaces or JSON schemas. Below is a step-by-step guide using the **AuthService** and **GameService** as examples.

### 1. Create or update your domain file

By default, the types package uses flat files:

```
packages/api-types/src/
  ├── auth-types.ts
  ├── user-types.ts
  └── game-types.ts
```

#### Example: Add `ResetPasswordRequest` to **auth-types.ts**

```ts
// packages/api-types/src/auth-types.ts

/**
 * Payload to request a password reset email.
 */
export interface ResetPasswordRequest {
  /** User's registered email address */
  email: string;
}
```

#### Example: Add `JoinGameRequest` to **game-types.ts**

```ts
// packages/api-types/src/game-types.ts

/**
 * Payload to join an existing game lobby.
 */
export interface JoinGameRequest {
  /** ID of the game to join */
  gameId: number;
  /** Optional player display name */
  displayName?: string;
}
```

### 2. (Optional) Add or update AJV JSON schema

If you’re sharing schemas, place them alongside your TS files:

```
packages/api-types/src/schemas/
  ├── auth.resetPassword.schema.json
  └── game.joinGame.schema.json
```

Import and re-export in `auth-types.ts` or `game-types.ts`:

```ts
// in auth-types.ts
export { default as ResetPasswordSchema } from './schemas/auth.resetPassword.schema.json';
```

### 3. Update the barrel exports

Ensure all new types are accessible from the package root. In `packages/api-types/src/index.ts`:

```ts
export * as Auth from './auth-types';
export * as User from './user-types';
export * as Game from './game-types';
```

### 4. Build and verify

```bash
cd packages/api-types
npm run build
# In each service:
npm run tsc --noEmit
```

Fix any TS errors, then submit a pull request with your new types.

---

## Tips & Best Practices

* **Naming**: Use `<Action>Request` / `<Action>Response` conventions.
* **Documentation**: Add JSDoc comments for each interface and field.
* **Optional fields**: Mark with `?` for clarity.
* **Synchronization**: Keep JSON schemas and TS types aligned.
* **CI**: Incorporate `tsc --noEmit` in your pipeline to catch drift.

---
