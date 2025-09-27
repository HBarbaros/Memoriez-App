import { atom } from 'jotai';

export interface PaymentItem {
  eventId: string;
  addedDate: string;
  status: 'pending' | 'paid';
}

export const cartItemsAtom = atom<PaymentItem[]>([]);

export const cartCountAtom = atom((get) => {
  const items = get(cartItemsAtom);
  return items.length;
});

export const isInCartAtom = (eventId: string) => atom((get) => {
  const items = get(cartItemsAtom);
  return items.some(item => item.eventId === eventId);
});

export const addToCartAtom = atom(
  null,
  (get, set, eventId: string) => {
    const items = get(cartItemsAtom);
    const existingItem = items.find(item => item.eventId === eventId);
    
    if (!existingItem) {
      const newItem: PaymentItem = {
        eventId,
        addedDate: new Date().toISOString(),
        status: 'pending'
      };
      set(cartItemsAtom, [...items, newItem]);
    }
  }
);

export const removeFromCartAtom = atom(
  null,
  (get, set, eventId: string) => {
    const items = get(cartItemsAtom);
    const filteredItems = items.filter(item => item.eventId !== eventId);
    set(cartItemsAtom, filteredItems);
  }
);

export const markAsPaidAtom = atom(
  null,
  (get, set, eventIds: string[]) => {
    const items = get(cartItemsAtom);
    const filteredItems = items.filter(item => !eventIds.includes(item.eventId));
    set(cartItemsAtom, filteredItems);
  }
);

export const getCartItemsAtom = atom((get) => {
  return [...get(cartItemsAtom)];
});