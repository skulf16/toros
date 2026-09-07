#!/bin/sh
# Startet die Website im Produktionsmodus auf http://localhost:3300
# Aufruf:  sh scripts/produktion.sh          (baut neu und startet)
#          SKIP_BUILD=1 sh scripts/produktion.sh   (startet den letzten Build)
set -e
cd "$(dirname "$0")/.."

if [ "$SKIP_BUILD" != "1" ]; then
  echo "→ Baue Produktions-Version …"
  npm run build
fi

# Standalone-Server braucht public/ und die statischen Assets neben sich
rm -rf .next/standalone/public .next/standalone/.next/static
cp -R public .next/standalone/public
mkdir -p .next/standalone/.next
cp -R .next/static .next/standalone/.next/static

echo "→ Starte Server auf http://localhost:${PORT:-3300}"
PORT="${PORT:-3300}" HOSTNAME=127.0.0.1 exec node .next/standalone/server.js
