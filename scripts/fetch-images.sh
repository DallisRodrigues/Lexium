#!/usr/bin/env bash
# Downloads stock images for every slot in scripts/image-slots.json using the official
# Unsplash API (UNSPLASH_ACCESS_KEY) or Pexels API (PEXELS_API_KEY) and records credits.
# Without keys: create free keys (https://unsplash.com/developers, https://www.pexels.com/api/)
# and add them to .env — or download images manually into client/public/images/raw/<file>.jpg
# and add their credits to client/src/content/image-credits.json.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
[ -f "$ROOT/.env" ] && set -a && . "$ROOT/.env" && set +a
RAW="$ROOT/client/public/images/raw"; CREDITS="$ROOT/client/src/content/image-credits.json"
mkdir -p "$RAW"; [ -s "$CREDITS" ] || echo '[]' > "$CREDITS"
UA="lexium-site-build/1.0"
EXCLUDE='logo|brand|handshake|pill|tablet blister|capsule|drug|pharma'

if [ -z "${UNSPLASH_ACCESS_KEY:-}" ] && [ -z "${PEXELS_API_KEY:-}" ]; then
  echo "No UNSPLASH_ACCESS_KEY or PEXELS_API_KEY in .env."
  echo "Create a free key at https://unsplash.com/developers or https://www.pexels.com/api/, add it to .env, then run: npm run images"
  echo "Or place images manually in $RAW/<file>.jpg (names listed in scripts/image-slots.json)."
  exit 0
fi

add_credit() { # file source photographer pageUrl license
  local tmp; tmp=$(mktemp)
  jq --arg f "$1" --arg s "$2" --arg p "$3" --arg u "$4" --arg l "$5" --arg d "$(date -I)" \
    'map(select(.file != $f)) + [{file:$f, source:$s, photographer:$p, pageUrl:$u, license:$l, downloadedAt:$d}]' "$CREDITS" > "$tmp" && mv "$tmp" "$CREDITS"
}

jq -c '.[]' "$ROOT/scripts/image-slots.json" | while read -r slot; do
  file=$(jq -r .file <<<"$slot"); query=$(jq -r .query <<<"$slot")
  if [ -f "$RAW/$file.jpg" ]; then echo "✓ $file (exists)"; continue; fi
  q=$(jq -rn --arg q "$query" '$q|@uri')
  if [ -n "${UNSPLASH_ACCESS_KEY:-}" ]; then
    res=$(curl -fsS -A "$UA" -H "Authorization: Client-ID $UNSPLASH_ACCESS_KEY" \
      "https://api.unsplash.com/search/photos?query=$q&orientation=landscape&per_page=10&content_filter=high")
    pick=$(jq -c --arg ex "$EXCLUDE" '[.results[] | select(((.alt_description // "") + " " + (.description // "")) | test($ex; "i") | not)][0] // empty' <<<"$res")
    [ -z "$pick" ] && { echo "✗ $file: no result"; continue; }
    url=$(jq -r '.urls.raw' <<<"$pick")"&w=2400&q=85&fm=jpg"
    curl -fsS -A "$UA" -o "$RAW/$file.jpg" "$url"
    # Unsplash API guidelines: trigger the download endpoint
    curl -fsS -A "$UA" -H "Authorization: Client-ID $UNSPLASH_ACCESS_KEY" "$(jq -r '.links.download_location' <<<"$pick")" >/dev/null || true
    add_credit "$file" "Unsplash" "$(jq -r '.user.name' <<<"$pick")" "$(jq -r '.links.html' <<<"$pick")" "Unsplash License"
  else
    res=$(curl -fsS -A "$UA" -H "Authorization: $PEXELS_API_KEY" "https://api.pexels.com/v1/search?query=$q&orientation=landscape&per_page=10")
    pick=$(jq -c --arg ex "$EXCLUDE" '[.photos[] | select((.alt // "") | test($ex; "i") | not)][0] // empty' <<<"$res")
    [ -z "$pick" ] && { echo "✗ $file: no result"; continue; }
    curl -fsS -A "$UA" -o "$RAW/$file.jpg" "$(jq -r '.src.original' <<<"$pick")"
    add_credit "$file" "Pexels" "$(jq -r '.photographer' <<<"$pick")" "$(jq -r '.url' <<<"$pick")" "Pexels License"
  fi
  echo "↓ $file"
  sleep 1
done
echo "Done. Review every image against the selection criteria (no logos, no handshakes, no orange tint, no pills), then run: node scripts/optimise-images.mjs"
