// 'use client';

// import { createContext, useContext, useState, ReactNode } from 'react';

// export interface CartItem {
//   id: string;
//   title: string;
//   price: number;
//   format: 'PDF' | 'EPUB';
// }

// export interface CartContextProps {
//   items: CartItem[];
//   addItem: (item: CartItem) => void;
//   removeItem: (id: string) => void;
//   clearCart: () => void;
//   total: number;
// }

// const CartContext = createContext<CartContextProps | undefined>(undefined);

// export function CartProvider({ children }: { children: ReactNode }) {
//   const [items, setItems] = useState<CartItem[]>([]);

//   const addItem = (item: CartItem) => {
//     setItems(current => [...current, item]);
//   };

//   const removeItem = (id: string) => {
//     setItems(current => current.filter(item => item.id !== id));
//   };

//   const clearCart = () => setItems([]);

//   const total = items.reduce((sum, item) => sum + item.price, 0);

//   return (
//     <CartContext.Provider value={{ items, addItem, removeItem, clearCart, total }}>
//       {children}
//     </CartContext.Provider>
//   );
// }

// export function useCart(): CartContextProps {
//   const context = useContext(CartContext);
//   if (context === undefined) {
//     throw new Error('useCart must be used within a CartProvider');
//   }
//   return context;
// }

'use client';

import { createContext, useContext, useState } from 'react';

export interface CartItem {
  id: string;
  title: string;
  price: number;
  quantity: number;  // Added this
  format: 'PDF' | 'EPUB';  // Added this
}

type CartContextType = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = (item: Omit<CartItem, 'quantity'>) => {
    setItems(current => {
      const exists = current.find(i => i.id === item.id);
      if (exists) {
        return current.map(i => 
          i.id === item.id 
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

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = items.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider value={{ 
      items, 
      addItem, 
      removeItem, 
      clearCart, 
      total,
      itemCount 
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}