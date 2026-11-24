import { track } from './track';

export type WaContextType =
  | { type: 'home' }
  | { type: 'top_bar' }
  | { type: 'product'; productName: string }
  | { type: 'cart'; summary: string }
  | { type: 'checkout'; summary: string }
  | { type: 'out_of_stock'; productName: string }
  | { type: 'forms'; formRole: 'distributor' | 'partner' | 'affiliate' | 'bulk' }
  | { type: 'calculator'; message: string }
  | { type: 'custom'; message: string }
  | { type: 'general' };

export const WA_PHONE = '919182968542';

export function getWaMessage(context: WaContextType): string {
  switch (context.type) {
    case 'home':
    case 'top_bar':
      return "Hi ColdEasy, I'd like to know more about your products.";
    case 'product':
      return `Hi ColdEasy, I'm interested in the ${context.productName}. Can you help?`;
    case 'cart':
    case 'checkout':
      return `Hi ColdEasy, I need help with my order: ${context.summary}.`;
    case 'out_of_stock':
      return `Hi ColdEasy, please tell me when ${context.productName} is back in stock.`;
    case 'forms':
      return `Hi ColdEasy, I'd like to talk about becoming a ${context.formRole}.`;
    case 'calculator':
    case 'custom':
      return context.message;
    case 'general':
    default:
      return "Hi ColdEasy, I'd like to know more about your products.";
  }
}

export function waLink(context: WaContextType = { type: 'general' }): string {
  const message = getWaMessage(context);
  return `https://wa.me/${WA_PHONE}?text=${encodeURIComponent(message)}`;
}

export function handleWaClick(context: WaContextType = { type: 'general' }) {
  track('whatsapp_click', { context: context.type });
}
