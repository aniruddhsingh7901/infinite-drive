class OrderStore {
    private currentOrderId: string | null = null;

    setCurrentOrderId(orderId: string): void {
        this.currentOrderId = orderId;
    }

    getCurrentOrderId(): string | null {
        return this.currentOrderId;
    }
}

export const orderStore = new OrderStore();