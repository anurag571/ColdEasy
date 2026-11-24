#!/usr/bin/env bash
# Runs migrations, seed and RLS policy tests against a throwaway plain Postgres.
# CI uses a postgres service container (DATABASE_URL set). Locally, if DATABASE_URL is unset,
# this starts a temporary cluster with the system's initdb/pg_ctl.
set -euo pipefail
cd "$(dirname "$0")/../.."

if [[ -z "${DATABASE_URL:-}" ]]; then
  PGBIN="${PGBIN:-$(ls -d /usr/lib/postgresql/*/bin 2>/dev/null | sort -V | tail -1)}"
  TMP="$(mktemp -d)"
  trap 'su postgres -c "$PGBIN/pg_ctl -D $TMP/data stop -m immediate" >/dev/null 2>&1 || true; rm -rf "$TMP"' EXIT
  chown -R postgres "$TMP" 2>/dev/null || true
  RUN="su postgres -c"
  [[ "$(id -u)" != 0 ]] && RUN="bash -c"
  $RUN "$PGBIN/initdb -D $TMP/data -U postgres -A trust >/dev/null"
  $RUN "$PGBIN/pg_ctl -D $TMP/data -o '-p 54329 -k $TMP -c listen_addresses=localhost' -w start >/dev/null"
  export DATABASE_URL="postgresql://postgres@localhost:54329/postgres"
fi

psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -q -f supabase/tests/supabase-shim.sql
for f in supabase/migrations/*.sql; do
  psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -q -f "$f" || { echo "Migration failed: $f"; exit 1; }
done
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -q -f supabase/seed.sql
echo "Migrations and seed applied."
npx vitest run --config vitest.db.config.ts
