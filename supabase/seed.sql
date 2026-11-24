-- Synthetic seed for local and staging (B1-07, docs/05 §2: never real customer data).
-- Prices are 100 paise (₹1) on purpose: obviously not real, so nobody mistakes them for a price list.
-- Every product stays in draft until ColdEasy supplies approved content (docs/11 A7).

update app.instance set environment = 'local';

-- Claims register (docs/08 §D). All unverified.
insert into public.claims (id, text) values
  ('C-01', 'ColdEasy Box rating 4.9 / 4.85 / 4.95 (66 reviews)'),
  ('C-02', 'AutoBox 3 Box rating 4.87 / 4.85; Solar AutoBox 4.88 (28)'),
  ('C-03', 'AutoBox 2 Box rating 4.85'),
  ('C-04', 'Prices and strikethrough MRPs (two different sets in the brief)'),
  ('C-05', 'Temperature drop "10–15°C" (FAQ, SEEC) vs "Cooling Delta 12°C" (product highlights)'),
  ('C-06', 'Tomatoes fresh for 8–10 days; spinach 2–3 days'),
  ('C-07', 'Shelf life up to 2×'),
  ('C-08', '3.5× faster cooling'),
  ('C-09', 'Relative humidity 90%'),
  ('C-10', 'Capacity 25 kg; 47 litres; dimensions and weights in the accordions'),
  ('C-11', '80% lower weight loss'),
  ('C-12', '"Cooling without electricity, motor or fan"'),
  ('C-13', 'AutoBox "ensuring consistent performance without electricity" (AC Grid description)'),
  ('C-14', 'Constant airflow prevents pest and fungal infestation'),
  ('C-15', 'Fridge: ethylene accumulates and accelerates ripening; ColdEasy lets ethylene escape'),
  ('C-16', 'Well suited for transportation (FAQ answer is cut off mid-sentence in the brief)'),
  ('C-17', 'EMI options available at checkout'),
  ('C-18', 'Food safe material'),
  ('C-19', '900+ units deployed'),
  ('C-20', '400+ households'),
  ('C-21', '900+ tonnes of food waste avoided'),
  ('C-22', '₹480 lakh income protected or generated'),
  ('C-23', '"Our patented, refrigerant-free technology"'),
  ('C-24', '"Proprietary" SEEC technology'),
  ('C-25', '1.3 billion tonnes of food lost or wasted each year'),
  ('C-26', 'Majority of loss occurs in the first 24 to 48 hours after harvest'),
  ('C-27', 'Marketability ~13% at Day 8 (ambient tomato)'),
  ('C-28', 'Media coverage: Times of India, The Better India, The Plate (Instagram), Ahmedabad Mirror, Network 18'),
  ('C-29', 'Customer stories: Gunja Devi, Sobha Devi, Lathabhai Jadhav, Vannama and Lakshmi'),
  ('C-30', 'Women''s drudgery reduced (Agency and Equity pillar)'),
  ('C-31', 'Journey timeline dates (2019–20 to today)')
on conflict (id) do nothing;

-- Products (names from the brief; everything else is a placeholder)
insert into public.products (id, slug, name, range_group, sort_order, description) values
  ('00000000-0000-4000-8000-000000000101', 'coldeasy-box',            'ColdEasy Box',            'main',  1, '[TBC: approved description, 11:PR-01]'),
  ('00000000-0000-4000-8000-000000000102', 'coldeasy-autobox-3',      'ColdEasy AutoBox 3 Box',  'main',  2, '[TBC: approved description, 11:PR-02]'),
  ('00000000-0000-4000-8000-000000000103', 'coldeasy-autobox-2',      'ColdEasy AutoBox 2 Box',  'main',  3, '[TBC: approved description]'),
  ('00000000-0000-4000-8000-000000000104', 'coldeasy-onion-keeper',   'ColdEasy Onion Keeper',   'other', 4, '[TBC: approved description, 11:PR-06]'),
  ('00000000-0000-4000-8000-000000000105', 'coldeasy-mushroom-maker', 'ColdEasy Mushroom Maker', 'other', 5, '[TBC: approved description]'),
  ('00000000-0000-4000-8000-000000000106', 'coldeasy-breezy',         'ColdEasy Breezy',         'other', 6, '[TBC: approved description]')
on conflict (id) do nothing;

insert into public.product_variants (product_id, sku, variant_key, variant_label, mrp_paise, price_paise, is_default, status_override) values
  ('00000000-0000-4000-8000-000000000101', 'SEED-BOX',        'default', null,      100, 100, true,  'coming_soon'),
  ('00000000-0000-4000-8000-000000000102', 'SEED-AB3-SOLAR',  'solar',   'Solar',   100, 100, true,  'coming_soon'),
  ('00000000-0000-4000-8000-000000000102', 'SEED-AB3-ACGRID', 'ac-grid', 'AC Grid', 100, 100, false, 'coming_soon'),
  ('00000000-0000-4000-8000-000000000103', 'SEED-AB2',        'default', null,      100, 100, true,  'coming_soon'),
  ('00000000-0000-4000-8000-000000000104', 'SEED-ONION',      'default', null,      100, 100, true,  'enquire_only'),
  ('00000000-0000-4000-8000-000000000105', 'SEED-MUSHROOM',   'default', null,      100, 100, true,  'enquire_only'),
  ('00000000-0000-4000-8000-000000000106', 'SEED-BREEZY',     'default', null,      100, 100, true,  'coming_soon')
on conflict (sku) do nothing;

-- Serviceable pincodes: format examples only. Real coverage, days and costs are 11:F- rows / T-025.
insert into public.serviceable_pincodes (pincode, city, state, active) values
  ('110001', 'Synthetic City A', 'Synthetic State', true),
  ('560001', 'Synthetic City B', 'Synthetic State', true),
  ('999999', 'Synthetic Inactive', 'Synthetic State', false)
on conflict (pincode) do nothing;

-- Synthetic people (+91 99999 0000x is a reserved-looking test range; never a real customer)
insert into public.contacts (id, mobile_e164, name, persona, pincode) values
  ('00000000-0000-4000-8000-000000000201', '+919999900001', 'Test Buyer 01',   'farmer',   '110001'),
  ('00000000-0000-4000-8000-000000000202', '+919999900002', 'Test Vendor 02',  'vendor',   '560001'),
  ('00000000-0000-4000-8000-000000000203', '+919999900003', 'Test Business 03','business', null)
on conflict (id) do nothing;

-- Contact 02 said yes, then withdrew a day later: marketing must no longer see them.
insert into public.consents (contact_id, purpose, granted, notice_version, source_page, captured_at) values
  ('00000000-0000-4000-8000-000000000201', 'marketing_whatsapp_sms', true,  'seed-v0', '/',        now() - interval '2 days'),
  ('00000000-0000-4000-8000-000000000202', 'marketing_whatsapp_sms', true,  'seed-v0', '/',        now() - interval '2 days'),
  ('00000000-0000-4000-8000-000000000202', 'marketing_whatsapp_sms', false, 'seed-v0', '/',        now() - interval '1 day'),
  ('00000000-0000-4000-8000-000000000203', 'lead_followup',          true,  'seed-v0', '/contact', now() - interval '2 days');

insert into public.leads (contact_id, type, message, source_page) values
  ('00000000-0000-4000-8000-000000000201', 'signup',          null,                             '/'),
  ('00000000-0000-4000-8000-000000000202', 'product_enquiry', 'Synthetic enquiry for testing.', '/products/coldeasy-box'),
  ('00000000-0000-4000-8000-000000000203', 'bulk',            'Synthetic bulk enquiry.',        '/contact');

insert into public.orders (id, order_no, public_token, contact_id, ship_name, ship_line1, ship_city, ship_state, ship_pincode, subtotal_paise, shipping_paise, total_paise) values
  ('00000000-0000-4000-8000-000000000301', 'CE-2026-000001', 'seed-token-not-secret-00000000000001',
   '00000000-0000-4000-8000-000000000201', 'Test Buyer 01', '1 Synthetic Road', 'Synthetic City A', 'Synthetic State', '110001', 100, 0, 100)
on conflict (id) do nothing;
insert into public.order_items (order_id, variant_id, sku, name, unit_price_paise, qty, line_total_paise)
select '00000000-0000-4000-8000-000000000301', v.id, v.sku, 'ColdEasy Box', 100, 1, 100
from public.product_variants v where v.sku = 'SEED-BOX'
on conflict do nothing;
