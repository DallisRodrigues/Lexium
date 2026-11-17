#!/usr/bin/env bash
# Restore a backup made by backup.sh:  bash scripts/restore.sh backups/2026-11-17
# Drops existing collections in the target database before restoring.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC="${1:?Usage: bash scripts/restore.sh backups/YYYY-MM-DD}"
[ -f "$ROOT/.env" ] && set -a && . "$ROOT/.env" && set +a
URI="${MONGODB_URI:-mongodb://127.0.0.1:27017/lexium}"
read -r -p "Restore $SRC into $URI? Existing data will be replaced. [y/N] " ok
[ "$ok" = "y" ] || { echo "Cancelled."; exit 1; }
mongorestore --uri="$URI" --gzip --drop --nsInclude='lexium.*' "$SRC/db"
[ -f "$SRC/uploads.tar.gz" ] && tar -xzf "$SRC/uploads.tar.gz" -C "$ROOT/server"
echo "Restored from $SRC"
