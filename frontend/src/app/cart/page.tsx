'use client';

import { useCart } from '@/lib/cart/CartContext';
import Link from 'next/link';
import Button from '@/components/Button';

export default function CartPage() {
  const { items, removeItem, total } = useCart();

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      
      {items.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg shadow">
          <svg 
            className="w-20 h-20 mx-auto mb-6 text-gray-400"
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={1.5} 
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" 
            />
          </svg>
          <p className="text-xl text-gray-600 mb-8">Your cart is empty</p>
          <Link href="/">
            <Button className="px-8 py-3 text-lg">
              Continue Shopping
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Cart Items */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b bg-gray-50">
              <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-500">
                <div className="col-span-6">Product</div>
                <div className="col-span-2 text-center">Format</div>
                <div className="col-span-2 text-center">Price</div>
                <div className="col-span-2 text-right">Action</div>
              </div>
            </div>
            
            <div className="divide-y">
              {items.map((item) => (
                <div key={item.id} className="px-6 py-4">
                  <div className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-6">
                      <h3 className="font-semibold text-lg">{item.title}</h3>
                      <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                    </div>
                    <div className="col-span-2 text-center">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        {item.format}
                      </span>
                    </div>
                    <div className="col-span-2 text-center font-medium">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                    <div className="col-span-2 text-right">
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <span className="sr-only">Remove item</span>
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cart Summary */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-lg">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">${total.toFixed(2)}</span>
              </div>
              <div className="border-t pt-4 flex justify-between items-center">
                <span className="text-xl font-semibold">Total</span>
                <span className="text-2xl font-bold text-blue-600">
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <Link href="/checkout">
                <Button className="w-full py-4 text-lg">
                  Proceed to Checkout
                </Button>
              </Link>
              <Link href="/">
                <button className="w-full text-gray-600 hover:text-gray-800 transition-colors">
                  Continue Shopping
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}