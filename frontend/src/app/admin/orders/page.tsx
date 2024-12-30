// 'use client';

// import { useState, useEffect } from 'react';

// interface Order {
//   id: string;
//   email: string;
//   amount: number;
//   status: string;
//   createdAt: string;
// }

// export default function OrdersPage() {
//   const [orders, setOrders] = useState<Order[]>([]);

//   useEffect(() => {
//     // This would fetch orders from your API
//     const fetchOrders = async () => {
//       // Dummy data for now
//       setOrders([
//         {
//           id: '1',
//           email: 'customer@example.com',
//           amount: 49.99,
//           status: 'completed',
//           createdAt: new Date().toISOString()
//         }
//       ]);
//     };

//     fetchOrders();
//   }, []);

//   return (
//     <div className="space-y-6">
//       <h1 className="text-2xl font-bold">Orders</h1>
//       <div className="bg-white shadow-md rounded-lg overflow-hidden">
//         <table className="min-w-full">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {orders.map(order => (
//               <tr key={order.id}>
//                 <td className="px-6 py-4 whitespace-nowrap">{order.id}</td>
//                 <td className="px-6 py-4 whitespace-nowrap">{order.email}</td>
//                 <td className="px-6 py-4 whitespace-nowrap">${order.amount}</td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                     order.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
//                   }`}>
//                     {order.status}
//                   </span>
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   {new Date(order.createdAt).toLocaleDateString()}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

'use client';

import { useState } from 'react';

interface Order {
  id: string;
  customerEmail: string;
  bookTitle: string;
  format: 'PDF' | 'EPUB';
  amount: number;
  paymentMethod: string;
  status: 'pending' | 'completed' | 'failed';
  date: string;
}

export default function OrdersManagement() {
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 'ORD-001',
      customerEmail: 'customer@example.com',
      bookTitle: 'Infinite Drive',
      format: 'PDF',
      amount: 49.99,
      paymentMethod: 'BTC',
      status: 'completed',
      date: new Date().toISOString()
    }
  ]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Orders</h1>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Book
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Format
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Payment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {order.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {order.customerEmail}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {order.bookTitle}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {order.format}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    ${order.amount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {order.paymentMethod}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                      ${order.status === 'completed' ? 'bg-green-100 text-green-800' : 
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {new Date(order.date).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}