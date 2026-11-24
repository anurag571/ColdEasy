import { afterAll, describe, expect, it } from 'vitest';
import { pool, tx } from './helpers';

afterAll(() => pool.end());

/** Tables the public (anon) may SELECT. Anything else anon can touch is a bug. */
const ANON_SELECT = new Set([
  'products',
  'product_variants',
  'product_media',
  'product_specs',
  'product_highlights',
  'product_ratings',
  'media_assets',
  'customer_stories',
  'media_features',
  'faqs',
  'partner_categories',
  'partners',
  'milestones',
  'milestone_partners',
  'banners',
  'feature_flags',
  'site_settings',
  'serviceable_pincodes',
  'locales',
  'translation_keys',
  'translations',
  'content_translations',
]);

describe('schema safety nets', () => {
  it('has RLS enabled on every public table', async () => {
    await tx(async (db) => {
      const { rows } = await db.query(
        `select c.relname from pg_class c join pg_namespace n on n.oid = c.relnamespace
         where n.nspname = 'public' and c.relkind = 'r' and not c.relrowsecurity`,
      );
      expect(rows.map((r) => r.relname)).toEqual([]);
    });
  });

  it('gives anon SELECT only, and only on the public allow-list', async () => {
    await tx(async (db) => {
      const { rows } = await db.query(
        `select table_name, privilege_type from information_schema.role_table_grants
         where grantee = 'anon' and table_schema = 'public'`,
      );
      const bad = rows.filter(
        (r) => r.privilege_type !== 'SELECT' || !ANON_SELECT.has(r.table_name),
      );
      expect(bad).toEqual([]);
    });
  });

  it('never lets anon or authenticated DELETE or TRUNCATE', async () => {
    await tx(async (db) => {
      const { rows } = await db.query(
        `select grantee, table_name, privilege_type from information_schema.role_table_grants
         where grantee in ('anon','authenticated') and table_schema = 'public'
           and privilege_type in ('DELETE','TRUNCATE','REFERENCES','TRIGGER')`,
      );
      expect(rows).toEqual([]);
    });
  });

  it('stores money as integers only', async () => {
    await tx(async (db) => {
      const { rows } = await db.query(
        `select table_name, column_name, data_type from information_schema.columns
         where table_schema = 'public' and column_name like '%paise%' and data_type <> 'integer'`,
      );
      expect(rows).toEqual([]);
    });
  });

  it('seeds all 31 claims as unverified', async () => {
    await tx(async (db) => {
      const { rows } = await db.query(
        `select status, count(*)::int n from public.claims group by status`,
      );
      expect(rows).toEqual([{ status: 'unverified', n: 31 }]);
    });
  });
});
