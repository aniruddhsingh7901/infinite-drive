// 'use client';

// import Link from 'next/link';
// import { useCart } from '@/lib/cart/CartContext';

// export default function Header() {
//   const { items, itemCount, total } = useCart();

//   return (
//     <header className="bg-white shadow-sm sticky top-0 z-50">
//       <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
//         {/* <Link 
//           href="/" 
//           className="text-2xl font-bold flex items-center"
//         >
//           Infinite Drive
//         </Link> */}
//           <Link 
//           href="/" 
//           className="flex items-center"
//         >
//           <img 
//             src="./1000163336.png" 
//             alt="App Logo" 
//             className="h-20 w-20 object-contain" 
//           />
//         </Link>

//         <Link 
//           href="/cart" 
//           className="relative group"
//         >
//           <div className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
//             <svg 
//               className="w-5 h-5" 
//               fill="none" 
//               viewBox="0 0 24 24" 
//               stroke="currentColor"
//             >
//               <path 
//                 strokeLinecap="round" 
//                 strokeLinejoin="round" 
//                 strokeWidth={2} 
//                 d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" 
//               />
//             </svg>
//             Cart ({itemCount})
//           </div>

//           {/* Cart Preview Popup */}
//           {items.length > 0 && (
//             <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-xl invisible group-hover:visible transition-all opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0">
//               <div className="p-4">
//                 <div className="text-sm font-medium text-gray-900 mb-3">
//                   Cart Items ({itemCount})
//                 </div>
//                 <div className="space-y-3 max-h-60 overflow-auto">
//                   {items.map(item => (
//                     <div key={item.id} className="flex justify-between items-center text-sm">
//                       <div>
//                         <div className="font-medium">{item.title}</div>
//                         <div className="text-gray-500">
//                           {item.format} × {item.quantity}
//                         </div>
//                       </div>
//                       <div className="font-medium">
//                         ${(item.price * item.quantity).toFixed(2)}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//                 <div className="border-t mt-3 pt-3">
//                   <div className="flex justify-between font-medium">
//                     <span>Total:</span>
//                     <span>${total.toFixed(2)}</span>
//                   </div>
//                 </div>
//                 <Link 
//                   href="/cart"
//                   className="mt-3 block text-center bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
//                 >
//                   View Cart
//                 </Link>
//               </div>
//             </div>
//           )}
//         </Link>
//       </div>
//     </header>
//   );
// }

'use client';

import Link from 'next/link';
import { useCart } from '@/lib/cart/CartContext';

export default function Header() {
  const { items, itemCount, total } = useCart();

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link 
          href="/" 
          className="flex items-center"
        >
          <img 
            src="./1000163336.png" 
            alt="App Logo" 
            className="h-20 w-20 object-contain" 
          />
        </Link>

        <div className="relative group">
          <Link 
            href="/cart" 
            className="block"
          >
            <div className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
              <svg 
                className="w-5 h-5" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" 
                />
              </svg>
              Cart ({itemCount})
            </div>
          </Link>

          {/* Cart Preview Popup */}
          {items.length > 0 && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-xl invisible group-hover:visible transition-all opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0">
              <div className="p-4">
                <div className="text-sm font-medium text-gray-900 mb-3">
                  Cart Items ({itemCount})
                </div>
                <div className="space-y-3 max-h-60 overflow-auto">
                  {items.map(item => (
                    <div key={item.id} className="flex justify-between items-center text-sm">
                      <div>
                        <div className="font-medium">{item.title}</div>
                        <div className="text-gray-500">
                          {item.format} × {item.quantity}
                        </div>
                      </div>
                      <div className="font-medium">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t mt-3 pt-3">
                  <div className="flex justify-between font-medium">
                    <span>Total:</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
                <button 
                  onClick={() => window.location.href = '/cart'}
                  className="mt-3 block w-full text-center bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  View Cart
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}