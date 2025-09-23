// Payment store for managing pending payments and cart items
export interface PaymentItem {
  eventId: string;
  addedDate: string;
  status: 'pending' | 'paid';
}

// Basit state management för payment items
class PaymentStore {
  private static instance: PaymentStore;
  private cartItems: PaymentItem[] = [];
  private listeners: (() => void)[] = [];

  static getInstance(): PaymentStore {
    if (!PaymentStore.instance) {
      PaymentStore.instance = new PaymentStore();
    }
    return PaymentStore.instance;
  }

  addToCart(eventId: string): void {
    const existingItem = this.cartItems.find(item => item.eventId === eventId);
    if (!existingItem) {
      this.cartItems.push({
        eventId,
        addedDate: new Date().toISOString(),
        status: 'pending'
      });
      this.notifyListeners();
    }
  }

  removeFromCart(eventId: string): void {
    this.cartItems = this.cartItems.filter(item => item.eventId !== eventId);
    this.notifyListeners();
  }

  getCartItems(): PaymentItem[] {
    return [...this.cartItems];
  }

  isInCart(eventId: string): boolean {
    return this.cartItems.some(item => item.eventId === eventId);
  }

  markAsPaid(eventIds: string[]): void {
    this.cartItems = this.cartItems.filter(item => !eventIds.includes(item.eventId));
    this.notifyListeners();
  }

  getCartCount(): number {
    return this.cartItems.length;
  }

  subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener());
  }
}

export const paymentStore = PaymentStore.getInstance();