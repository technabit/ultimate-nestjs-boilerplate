set -e

cd "$(dirname "$(realpath "$0")")" || exit
cd ..

# Ensure clean checkout and get latest
git reset --hard HEAD
git pull origin main

# Recreate containers with fresh build using compose (both API and Worker)
node ./bin/compose.mjs prod down || true
node ./bin/compose.mjs prod up --build --force-recreate

# Cleanup dangling resources
docker volume prune -f || true
docker image prune -f || true
