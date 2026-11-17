#!/usr/bin/env bash
# Managed backup: mongodump of the lexium database (+ uploaded images) to ./backups/YYYY-MM-DD[_HHMM]
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
[ -f "$ROOT/.env" ] && set -a && . "$ROOT/.env" && set +a
URI="${MONGODB_URI:-mongodb://127.0.0.1:27017/lexium}"
DEST="$ROOT/backups/$(date +%F)"
[ -d "$DEST" ] && DEST="${DEST}_$(date +%H%M)"
mkdir -p "$DEST"
mongodump --uri="$URI" --gzip --out="$DEST/db" --quiet
[ -d "$ROOT/server/uploads" ] && tar -czf "$DEST/uploads.tar.gz" -C "$ROOT/server" uploads
echo "Backup written to $DEST"
