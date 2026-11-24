export interface TrackItem {
  item_id: string;
  item_name: string;
  price: number;
  quantity?: number;
}

export interface TrackParams {
  item_id?: string;
  item_name?: string;
  items?: TrackItem[];
  value?: number;
  currency?: string;
  context?: string;
  form_type?: 'contact' | 'bulk' | 'distributor' | 'partner' | 'affiliate';
  serviceable?: boolean;
  pincode?: string;
  faq_question?: string;
  [key: string]: unknown;
}

export type TrackEventName =
  | 'view_item'
  | 'add_to_cart'
  | 'remove_from_cart'
  | 'view_cart'
  | 'begin_checkout'
  | 'add_shipping_info'
  | 'add_payment_info'
  | 'purchase'
  | 'payment_failed'
  | 'sign_up'
  | 'whatsapp_click'
  | 'share_product'
  | 'notify_me'
  | 'generate_lead'
  | 'faq_open'
  | 'pincode_check'
  | 'calculator_used'
  | 'calculator_cta'
  | 'video_start'
  | 'video_complete'
  | 'video_step_click';

export interface RecordedEvent {
  id: string;
  name: TrackEventName;
  params?: TrackParams;
  timestamp: string;
}

declare global {
  interface Window {
    dataLayer?: unknown[];
    __ce_events?: RecordedEvent[];
    __ce_event_listeners?: ((events: RecordedEvent[]) => void)[];
  }
}

export function track(eventName: TrackEventName, params?: TrackParams) {
  if (typeof window === 'undefined') return;

  // Initialize dataLayer if missing
  window.dataLayer = window.dataLayer || [];
  const eventPayload = {
    event: eventName,
    ...params,
    timestamp: new Date().toISOString(),
  };
  window.dataLayer.push(eventPayload);

  // Console logging for verification
  console.log(`[Event Tracked: ${eventName}]`, params || {});

  // Store for ?debug=1 panel (last 20 events)
  window.__ce_events = window.__ce_events || [];
  const recorded: RecordedEvent = {
    id: `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    name: eventName,
    params,
    timestamp: new Date().toLocaleTimeString('en-IN', { hour12: false }),
  };

  window.__ce_events.unshift(recorded);
  if (window.__ce_events.length > 20) {
    window.__ce_events = window.__ce_events.slice(0, 20);
  }

  // Notify debug listeners
  if (window.__ce_event_listeners) {
    window.__ce_event_listeners.forEach((fn) => fn(window.__ce_events || []));
  }
}
