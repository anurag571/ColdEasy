/**
 * Analytics events (docs/06 §8). No personal data, ever: no mobile numbers, names, emails,
 * addresses, pincodes or free text. `purchase` is sent from the server (Measurement Protocol),
 * never from the browser.
 */

type Item = { item_id: string; item_name: string; price?: number; quantity?: number };

export type TrackEvents = {
  view_item: { item_id: string; item_name: string; price?: number; currency: 'INR' };
  add_to_cart: { items: Item[]; value: number; currency: 'INR' };
  remove_from_cart: { items: Item[]; value: number; currency: 'INR' };
  view_cart: { items: Item[]; value: number; currency: 'INR' };
  begin_checkout: { items: Item[]; value: number; currency: 'INR' };
  add_shipping_info: { shipping_tier: 'serviceable' | 'not_serviceable' };
  add_payment_info: Record<string, never>;
  payment_failed: { order_no: string };
  sign_up: { method: 'mobile' };
  whatsapp_click: { context: string };
  share_product: { item_id: string; share_method: string };
  notify_me: { item_id: string };
  generate_lead: { form_type: string };
  faq_open: { question_id: string };
  pincode_check: { serviceable: boolean };
};

export type TrackEventName = keyof TrackEvents;

const PII_KEYS = /(^|_)(mobile|phone|email|name|address|pincode|pin|message|gstin|text)$/i;
const PII_VALUES = [
  /(?:\+?91[\s-]?)?[6-9]\d{4}[\s-]?\d{5}/, // Indian mobile
  /[^\s@]+@[^\s@]+\.[^\s@]+/, // email
  /\b[1-9]\d{5}\b/, // pincode-like six digits
];

/** Item names and ids are allowed; anything that looks personal is rejected. */
export function findPii(params: unknown, path = ''): string | null {
  if (params === null || params === undefined) return null;
  if (typeof params === 'string') {
    return PII_VALUES.some((re) => re.test(params)) ? path || '(value)' : null;
  }
  if (Array.isArray(params)) {
    for (let i = 0; i < params.length; i++) {
      const hit = findPii(params[i], `${path}[${i}]`);
      if (hit) return hit;
    }
    return null;
  }
  if (typeof params === 'object') {
    for (const [key, value] of Object.entries(params)) {
      const keyPath = path ? `${path}.${key}` : key;
      if (key !== 'item_name' && PII_KEYS.test(key)) return keyPath;
      if (key === 'item_id' || key === 'order_no' || key === 'question_id') continue;
      const hit = findPii(value, keyPath);
      if (hit) return hit;
    }
  }
  return null;
}

type Gtag = (command: 'event', name: string, params: object) => void;

export function track<E extends TrackEventName>(name: E, params: TrackEvents[E]): boolean {
  const pii = findPii(params);
  if (pii) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`[track] dropped "${name}": "${pii}" looks like personal data`);
    }
    return false;
  }
  if (typeof window === 'undefined') return false;
  const gtag = (window as unknown as { gtag?: Gtag }).gtag;
  if (typeof gtag !== 'function') return false;
  gtag('event', name, params);
  return true;
}
