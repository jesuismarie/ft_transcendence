#!/usr/bin/env bash

JWT_SECRET=$(openssl rand -base64 32)
REFRESH_TOKEN_SALT=$(openssl rand -base64 32)
CLUSTER_TOKEN=$(openssl rand -hex 16)
cat > .env <<EOF
DATABASE_URL=file:./auth.db
JWT_SECRET=$JWT_SECRET
REFRESH_TOKEN_SALT=$REFRESH_TOKEN_SALT
CLUSTER_TOKEN=$CLUSTER_TOKEN

# Google OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/oauth/google/callback
EOF
echo ".env generated — fill in Google creds."
