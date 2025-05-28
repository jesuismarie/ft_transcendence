# Step 1: Install dependencies ----------------------------------------------------------------------------------------
FROM node:20-alpine AS dependencies
WORKDIR /app

COPY package.json package-lock.json ./

# Copy workspace package.json files
COPY backend/authservice/package.json ./backend/authservice/package.json
COPY packages/api-types/package.json ./packages/api-types/package.json

# Install dependencies
RUN npm ci --omit=dev

# Step 2: Build the api-types package ---------------------------------------------------------------------------------
FROM node:20-alpine AS api-types-build
WORKDIR /app

# Reuse the dependencies layer
COPY --from=dependencies /app/node_modules ./node_modules
COPY package.json ./
COPY packages/api-types ./packages/api-types

# Compile the api-types to dist
RUN npm run --workspace=packages/api-types build

## Step 3: Build the authservice --------------------------------------------------------------------------------------
FROM node:20-alpine AS authservice-build
WORKDIR /app

# Bring in runtime dependencies
COPY --from=dependencies /app/node_modules ./node_modules

# Copy workspace package.json files
COPY backend/authservice/package.json ./backend/authservice/package.json
COPY package.json ./

# Copy the api-types build output
COPY --from=api-types-build /app/packages/api-types/dist ./packages/api-types/dist

# Copy the authservice source code
COPY backend/authservice/src ./backend/authservice/src
COPY backend/authservice/tsconfig.json ./backend/authservice/tsconfig.json

# Prisma setup
COPY backend/authservice/prisma ./backend/authservice/prisma
COPY backend/authservice/.env ./backend/authservice/.env

# Generate Prisma client & apply migrations
RUN npm run --workspace=backend/authservice generate
RUN npm run --workspace=backend/authservice migrate:deploy

# Build the authservice
RUN npm run --workspace=backend/authservice build

## Step 4: Create the final image -------------------------------------------------------------------------------------
FROM node:20-alpine
WORKDIR /app

# Copy runtime dependencies
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=authservice-build /app/node_modules/.prisma ./node_modules/.prisma

# Copy compiled code + Prisma client + migrations
COPY --from=authservice-build /app/backend/authservice/dist ./backend/authservice/dist
COPY --from=authservice-build /app/backend/authservice/prisma ./backend/authservice/prisma
COPY --from=authservice-build /app/packages/api-types/dist ./packages/api-types/dist

# Copy the environment variables
COPY --from=authservice-build /app/backend/authservice/.env /app/.env

ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "backend/authservice/dist/app.js"]