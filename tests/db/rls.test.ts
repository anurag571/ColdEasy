import { afterAll, describe, expect, it } from 'vitest';
import { as, asAdmin, asOwner, count, errorOf, makeAdmin, pool, tx } from './helpers';

afterAll(() => pool.end());

const BOX = '00000000-0000-4000-8000-000000000101';

async function publishBox(db: Parameters<Parameters<typeof tx>[0]>[0]) {
  await db.query(
    `update public.products set description = 'Synthetic test copy', status = 'published' where id = $1`,
    [BOX],
  );
}

describe('public (anon) access', () => {
  it('cannot read personal data, orders or internals', async () => {
    await tx(async (db) => {
      await as(db, 'anon');
      for (const t of [
        'contacts',
        'consents',
        'leads',
        'orders',
        'order_items',
        'payments',
        'webhook_events',
        'audit_log',
        'admin_users',
        'accounting_sync',
        'zoho_connection',
        'claims',
        'content_revisions',
        'stock_movements',
      ]) {
        expect(await errorOf(db, `select * from public.${t} limit 1`), t).toMatch(
          /permission denied/,
        );
      }
    });
  });

  it('cannot write anything, including leads', async () => {
    await tx(async (db) => {
      await as(db, 'anon');
      expect(
        await errorOf(db, `insert into public.leads (contact_id, type) values ($1, 'signup')`, [
          '00000000-0000-4000-8000-000000000201',
        ]),
      ).toMatch(/permission denied/);
      expect(await errorOf(db, `update public.products set name = 'x'`)).toMatch(
        /permission denied/,
      );
    });
  });

  it('sees only published products and their active variants', async () => {
    await tx(async (db) => {
      await as(db, 'anon');
      expect(await count(db, 'select 1 from public.products')).toBe(0);
      expect(await count(db, 'select 1 from public.product_variants')).toBe(0);
      await asOwner(db);
      await publishBox(db);
      await as(db, 'anon');
      expect(await count(db, 'select 1 from public.products')).toBe(1);
      expect(await count(db, 'select 1 from public.product_variants')).toBe(1);
    });
  });

  it('never sees a highlight whose claim is unapproved', async () => {
    await tx(async (db) => {
      await publishBox(db);
      await db.query(`insert into public.product_highlights (variant_id, value_text, label, claim_id)
                      select id, '0 kg', 'Capacity', 'C-10' from public.product_variants where sku = 'SEED-BOX'`);
      await as(db, 'anon');
      expect(await count(db, 'select 1 from public.product_highlights')).toBe(0);
      await asOwner(db);
      await db.query(
        `update public.claims set status = 'approved', evidence_ref = 'test', approved_by = $1, approved_at = now() where id = 'C-10'`,
        [await makeAdmin(db, 'owner')],
      );
      await as(db, 'anon');
      expect(await count(db, 'select 1 from public.product_highlights')).toBe(1);
    });
  });

  it('sees only live languages and active pincodes', async () => {
    await tx(async (db) => {
      await as(db, 'anon');
      const { rows } = await db.query('select code from public.locales');
      expect(rows.map((r) => r.code)).toEqual(['en']);
      expect(
        await count(db, `select 1 from public.serviceable_pincodes where pincode = '999999'`),
      ).toBe(0);
    });
  });
});

describe('admin access needs MFA and a permission', () => {
  it('blocks an admin without MFA', async () => {
    await tx(async (db) => {
      const ops = await makeAdmin(db, 'operations');
      await asAdmin(db, ops, { mfa: false });
      expect(await count(db, 'select 1 from public.leads')).toBe(0);
      await asOwner(db);
      await asAdmin(db, ops);
      expect(await count(db, 'select 1 from public.leads')).toBe(3);
    });
  });

  it('blocks a signed-in user who is not an admin', async () => {
    await tx(async (db) => {
      await as(db, 'authenticated', { sub: '00000000-0000-4000-8000-00000000dead', aal: 'aal2' });
      expect(await count(db, 'select 1 from public.leads')).toBe(0);
      expect(await count(db, 'select 1 from public.orders')).toBe(0);
    });
  });

  it('shows marketing and support only the leads they own', async () => {
    await tx(async (db) => {
      const mkt = await makeAdmin(db, 'marketing');
      await db.query(`update public.leads set owner_id = $1 where type = 'bulk'`, [mkt]);
      await asAdmin(db, mkt);
      const { rows } = await db.query('select type from public.leads');
      expect(rows.map((r) => r.type)).toEqual(['bulk']);
      expect(await count(db, 'select 1 from public.orders')).toBe(0);
    });
  });

  it('shows marketing only contacts whose latest marketing consent is a yes', async () => {
    await tx(async (db) => {
      const mkt = await makeAdmin(db, 'marketing');
      await asAdmin(db, mkt);
      const { rows } = await db.query('select name from public.contacts order by name');
      expect(rows.map((r) => r.name)).toEqual(['Test Buyer 01']);
    });
  });

  it('turns off the developer role in production', async () => {
    await tx(async (db) => {
      const dev = await makeAdmin(db, 'developer');
      await asAdmin(db, dev);
      expect(await count(db, 'select 1 from public.leads')).toBe(3);
      await asOwner(db);
      await db.query(`update app.instance set environment = 'production'`);
      await asAdmin(db, dev);
      expect(await count(db, 'select 1 from public.leads')).toBe(0);
    });
  });

  it('scopes reviewers to their own language', async () => {
    await tx(async (db) => {
      await db.query(
        `insert into public.translation_keys (key, namespace, source_en) values ('home.hero.title', 'home', 'Effortless cooling')`,
      );
      const rev = await makeAdmin(db, 'reviewer', ['hi']);
      await asAdmin(db, rev);
      expect(
        await errorOf(
          db,
          `insert into public.translations (key, locale, value, status, source_hash) values ('home.hero.title','hi','x','in_review','h')`,
        ),
      ).toBeNull();
      expect(
        await errorOf(
          db,
          `insert into public.translations (key, locale, value, status, source_hash) values ('home.hero.title','ta','x','in_review','h')`,
        ),
      ).toMatch(/row-level security/);
      expect(await count(db, 'select 1 from public.leads')).toBe(0);
    });
  });
});

describe('price, stock and publishing rules', () => {
  it('lets operations move price within ±10% only; owner can go further; marketing cannot', async () => {
    await tx(async (db) => {
      await db.query(
        `update public.product_variants set mrp_paise = 100000, price_paise = 100000 where sku = 'SEED-BOX'`,
      );
      const ops = await makeAdmin(db, 'operations');
      const owner = await makeAdmin(db, 'owner');
      const mkt = await makeAdmin(db, 'marketing');
      const set = (p: number) =>
        `update public.product_variants set price_paise = ${p} where sku = 'SEED-BOX'`;
      await asAdmin(db, mkt);
      expect(await errorOf(db, set(95000))).toMatch(/catalogue.edit_price/);
      await asOwner(db);
      await asAdmin(db, ops);
      expect(await errorOf(db, set(95000))).toBeNull();
      expect(await errorOf(db, set(70000))).toMatch(/owner approval/);
      await asOwner(db);
      await asAdmin(db, owner);
      expect(await errorOf(db, set(70000))).toBeNull();
    });
  });

  it('changes stock only through adjust_stock(), which writes the ledger', async () => {
    await tx(async (db) => {
      const ops = await makeAdmin(db, 'operations');
      const mkt = await makeAdmin(db, 'marketing');
      await asAdmin(db, ops);
      expect(
        await errorOf(
          db,
          `update public.product_variants set stock_qty = 5 where sku = 'SEED-BOX'`,
        ),
      ).toMatch(/adjust_stock/);
      const { rows } = await db.query(
        `select public.adjust_stock(id, 5, 'received', 'test') as qty from public.product_variants where sku = 'SEED-BOX'`,
      );
      expect(rows[0].qty).toBe(5);
      expect(
        await count(db, `select 1 from public.stock_movements where reason = 'received'`),
      ).toBe(1);
      expect(
        await errorOf(
          db,
          `select public.adjust_stock(id, -1, 'sale') from public.product_variants where sku = 'SEED-BOX'`,
        ),
      ).toMatch(/webhook only/);
      await asOwner(db);
      await asAdmin(db, mkt);
      expect(
        await errorOf(
          db,
          `select public.adjust_stock(id, 1, 'received') from public.product_variants where sku = 'SEED-BOX'`,
        ),
      ).toMatch(/catalogue.edit_stock/);
    });
  });

  it('blocks publishing while a field holds [TBC]', async () => {
    await tx(async (db) => {
      expect(
        await errorOf(db, `update public.products set status = 'published' where id = $1`, [BOX]),
      ).toMatch(/placeholder/);
    });
  });

  it('lets only the owner publish, and freezes live rows for everyone else', async () => {
    await tx(async (db) => {
      await db.query(`update public.products set description = 'Clean copy' where id = $1`, [BOX]);
      const mkt = await makeAdmin(db, 'marketing');
      const owner = await makeAdmin(db, 'owner');
      await asAdmin(db, mkt);
      expect(
        await errorOf(db, `update public.products set status = 'published' where id = $1`, [BOX]),
      ).toMatch(/Only the owner/);
      await asOwner(db);
      await asAdmin(db, owner);
      expect(
        await errorOf(db, `update public.products set status = 'published' where id = $1`, [BOX]),
      ).toBeNull();
      await asOwner(db);
      await asAdmin(db, mkt);
      expect(
        await errorOf(db, `update public.products set name = 'Edited live' where id = $1`, [BOX]),
      ).toMatch(/Only the owner/);
    });
  });

  it('refuses an AI-generated main product image', async () => {
    await tx(async (db) => {
      expect(
        await errorOf(
          db,
          `insert into public.product_media (product_id, kind, storage_path, alt_text, provenance, sort_order)
                           values ($1, 'image', 'x.jpg', 'Box', 'ai_generated', 0)`,
          [BOX],
        ),
      ).toMatch(/check constraint/);
    });
  });

  it('refuses to publish a partner without a permission record', async () => {
    await tx(async (db) => {
      expect(
        await errorOf(
          db,
          `insert into public.partners (name, category, status) values ('Synthetic Org', 'csr', 'published')`,
        ),
      ).toMatch(/check constraint/);
    });
  });

  it('needs a change note to switch a flag on in production', async () => {
    await tx(async (db) => {
      await db.query(`update app.instance set environment = 'production'`);
      expect(
        await errorOf(db, `update public.feature_flags set enabled = true where key = 'dark_home'`),
      ).toMatch(/change_note_ref/);
      expect(
        await errorOf(
          db,
          `update public.feature_flags set enabled = true, change_note_ref = 'CN-01' where key = 'dark_home'`,
        ),
      ).toBeNull();
    });
  });
});

describe('orders', () => {
  const ORDER = '00000000-0000-4000-8000-000000000301';
  it('never lets an admin mark an order paid, and enforces the allowed moves', async () => {
    await tx(async (db) => {
      const ops = await makeAdmin(db, 'operations');
      await asAdmin(db, ops);
      expect(
        await errorOf(db, `update public.orders set status = 'paid' where id = $1`, [ORDER]),
      ).toMatch(/cannot move/);
      await asOwner(db);
      await db.query(`update public.orders set status = 'paid' where id = $1`, [ORDER]); // the webhook (system)
      await asAdmin(db, ops);
      expect(
        await errorOf(db, `update public.orders set status = 'packed' where id = $1`, [ORDER]),
      ).toBeNull();
      expect(
        await errorOf(db, `update public.orders set status = 'delivered' where id = $1`, [ORDER]),
      ).toMatch(/cannot move/);
      expect(
        await errorOf(db, `update public.orders set status = 'dispatched' where id = $1`, [ORDER]),
      ).toMatch(/check constraint/);
      expect(
        await count(
          db,
          `select 1 from public.order_events where order_id = $1 and kind = 'status_change'`,
          [ORDER],
        ),
      ).toBe(2);
    });
  });
});

describe('audit log', () => {
  it('records admin changes and cannot be edited or deleted by anyone', async () => {
    await tx(async (db) => {
      const owner = await makeAdmin(db, 'owner');
      await asAdmin(db, owner);
      await db.query(
        `update public.product_variants set price_paise = price_paise where sku = 'SEED-BOX'`,
      );
      const { rows } = await db.query(
        `select actor_id, actor_role from public.audit_log where table_name = 'product_variants' order by id desc limit 1`,
      );
      expect(rows[0]).toEqual({ actor_id: owner, actor_role: 'owner' });
      expect(await errorOf(db, `delete from public.audit_log`)).toMatch(/permission denied/);
      expect(await errorOf(db, `update public.audit_log set reason = 'x'`)).toMatch(
        /permission denied/,
      );
      await asOwner(db);
      expect(await errorOf(db, `delete from public.audit_log`)).toMatch(/append-only/);
    });
  });
});

describe('translations', () => {
  it('marks translations stale when the English source changes', async () => {
    await tx(async (db) => {
      await db.query(
        `insert into public.translation_keys (key, namespace, source_en) values ('footer.tagline', 'footer', 'A')`,
      );
      await db.query(
        `insert into public.translations (key, locale, value, status, source_hash) values ('footer.tagline','hi','x','approved','h')`,
      );
      await db.query(
        `update public.translation_keys set source_en = 'B' where key = 'footer.tagline'`,
      );
      const { rows } = await db.query(
        `select status from public.translations where key = 'footer.tagline'`,
      );
      expect(rows[0].status).toBe('stale');
    });
  });
});
