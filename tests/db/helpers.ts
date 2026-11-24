import { randomUUID } from 'node:crypto';
import pg from 'pg';

export const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL, max: 2 });

export type Db = pg.PoolClient;
type Role = 'anon' | 'authenticated' | 'service_role';
export type AdminRole = 'owner' | 'operations' | 'marketing' | 'support' | 'reviewer' | 'developer';

/**
 * Runs fn inside a transaction that is always rolled back, so tests never leak state.
 * `setup` runs first as the migration owner (postgres); fn runs as the API role given.
 */
export async function tx<T>(fn: (db: Db) => Promise<T>): Promise<T> {
  const db = await pool.connect();
  try {
    await db.query('begin');
    return await fn(db);
  } finally {
    await db.query('rollback').catch(() => {});
    db.release();
  }
}

export async function as(db: Db, role: Role, claims: Record<string, unknown> = {}) {
  await db.query(`select set_config('request.jwt.claims', $1, true)`, [
    JSON.stringify({ role, ...claims }),
  ]);
  await db.query(`set local role ${role}`);
}

export async function asOwner(db: Db) {
  await db.query('reset role');
  await db.query(`select set_config('request.jwt.claims', '', true)`);
}

/** Creates an auth user plus admin_users row (as postgres) and returns its id. */
export async function makeAdmin(db: Db, role: AdminRole, locales: string[] = []): Promise<string> {
  const id = randomUUID();
  await db.query('insert into auth.users (id, email) values ($1, $2)', [
    id,
    `${role}-${id.slice(0, 8)}@example.test`,
  ]);
  await db.query(
    'insert into public.admin_users (id, full_name, role, locales) values ($1, $2, $3, $4)',
    [id, `Test ${role}`, role, locales],
  );
  return id;
}

export async function asAdmin(db: Db, id: string, { mfa = true } = {}) {
  await as(db, 'authenticated', { sub: id, aal: mfa ? 'aal2' : 'aal1' });
}

/** Resolves to the Postgres error message, or null if the query succeeded. */
export async function errorOf(db: Db, sql: string, params: unknown[] = []): Promise<string | null> {
  await db.query('savepoint t');
  try {
    await db.query(sql, params);
    await db.query('release savepoint t');
    return null;
  } catch (e) {
    await db.query('rollback to savepoint t');
    return (e as Error).message;
  }
}

export async function count(db: Db, sql: string, params: unknown[] = []): Promise<number> {
  const r = await db.query(sql, params);
  return r.rowCount ?? 0;
}
