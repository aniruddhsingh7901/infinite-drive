'use client';

import { createContext, useContext, useState } from 'react';

export type CartItem = {
  id: string;
  title: string;
  price: number;
  quantity: number;
  format: 'PDF' | 'EPUB';  // Added format
}

type CartContextType = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;  // Added for header display
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = (item: Omit<CartItem, 'quantity'>) => {
    setItems(current => {
      const exists = current.find(i => 
        i.id === item.id && i.format === item.format
      );
      
      if (exists) {
        return current.map(i => 
          i.id === item.id && i.format === item.format
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      
      return [...current, { ...item, quantity: 1 }];
    });
  };

  const removeItem = (id: string) => {
    setItems(current => current.filter(item => item.id !== id));
  };

  const clearCart = () => setItems([]);

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity, 
    0
  );

  const itemCount = items.reduce(
    (count, item) => count + item.quantity, 
    0
  );

  return (
    <CartContext.Provider 
      value={{ 
        items, 
        addItem, 
        removeItem, 
        clearCart, 
        total,
        itemCount 
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}