import { site } from './config/site';
import type { MessageKey, Translate } from './i18n/dictionary';

/** WhatsApp contexts and their prefilled messages (docs/06 §6). */
export const WA_CONTEXTS = {
  top_bar: 'whatsapp.default',
  footer: 'whatsapp.default',
  header: 'whatsapp.default',
  not_found: 'whatsapp.default',
  product: 'whatsapp.product',
  sold_out: 'whatsapp.sold_out',
  pincode_blocked: 'whatsapp.pincode_blocked',
  checkout_help: 'whatsapp.checkout_help',
  payment_failed: 'whatsapp.payment_failed',
} as const satisfies Record<string, MessageKey>;

export type WaContext = keyof typeof WA_CONTEXTS;

/** https://wa.me/919182968542?text=... The number comes from site config (11:B-07). */
export function waLink(
  t: Translate,
  context: WaContext,
  vars?: { product?: string; pincode?: string; orderNo?: string },
): string {
  const number = site.whatsappE164.replace(/^\+/, '');
  const text = t(WA_CONTEXTS[context], vars);
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}
