#!/bin/bash
set -e

SERVER="root@77.42.36.142"
REMOTE_DIR="/var/www/aiupskill.live"

echo "=== Deploying aiupskill.live ==="

# 1. Sync files to server (exclude unnecessary files)
echo ">> Syncing files..."
rsync -avz --delete \
  --exclude='node_modules' \
  --exclude='.next' \
  --exclude='.env' \
  --exclude='.env.local' \
  --exclude='.git' \
  -e ssh \
  ./ ${SERVER}:${REMOTE_DIR}/

# 2. Install dependencies
echo ">> Installing dependencies..."
ssh ${SERVER} "cd ${REMOTE_DIR} && pnpm install --frozen-lockfile"

# 3. Generate Prisma client
echo ">> Generating Prisma client..."
ssh ${SERVER} "cd ${REMOTE_DIR} && pnpm exec prisma generate --schema=prisma/schema.prisma"

# 4. Push DB schema
echo ">> Pushing DB schema..."
ssh ${SERVER} "cd ${REMOTE_DIR} && pnpm exec prisma db push --schema=prisma/schema.prisma --accept-data-loss"

# 5. Build
echo ">> Building..."
ssh ${SERVER} "cd ${REMOTE_DIR} && pnpm build"

# 6. Start/Restart PM2
echo ">> Restarting PM2..."
ssh ${SERVER} "cd ${REMOTE_DIR} && pm2 startOrReload deployment/ecosystem.config.js --env production && pm2 save"

echo "=== Deploy complete! ==="
echo ">> Check: https://aiupskill.live"
echo ">> Logs: ssh ${SERVER} 'pm2 logs aiupskill --lines 50'"
