// 'use client';

// import { useState, useEffect } from 'react';

// export default function AdminDashboard() {
//   const [stats, setStats] = useState({
//     totalSales: 0,
//     orders: 0,
//     activeUsers: 0
//   });

//   return (
//     <div>
//       <h1 className="text-2xl font-bold mb-8">Dashboard Overview</h1>
      
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//         <div className="bg-white rounded-lg shadow p-6">
//           <h3 className="text-gray-500 text-sm font-medium">Total Sales</h3>
//           <p className="text-3xl font-bold">${stats.totalSales}</p>
//         </div>
//         <div className="bg-white rounded-lg shadow p-6">
//           <h3 className="text-gray-500 text-sm font-medium">Orders</h3>
//           <p className="text-3xl font-bold">{stats.orders}</p>
//         </div>
//         <div className="bg-white rounded-lg shadow p-6">
//           <h3 className="text-gray-500 text-sm font-medium">Active Users</h3>
//           <p className="text-3xl font-bold">{stats.activeUsers}</p>
//         </div>
//       </div>

//       <div className="bg-white rounded-lg shadow p-6">
//         <h2 className="text-xl font-bold mb-4">Recent Orders</h2>
//         {/* Add order table here */}
//       </div>
//     </div>
//   );
// }

'use client';

import { useState } from 'react';

const stats = [
  { label: 'Total Sales', value: '$1,234', change: '+12%' },
  { label: 'Active Orders', value: '25', change: '+5%' },
  { label: 'New Customers', value: '156', change: '+18%' },
  { label: 'Conversion Rate', value: '3.2%', change: '+2%' }
];

export default function AdminDashboard() {
  const [period, setPeriod] = useState('7d');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard Overview</h1>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
        </select>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-lg shadow-sm">
            <div className="text-sm text-gray-500">{stat.label}</div>
            <div className="mt-2 flex items-baseline justify-between">
              <div className="text-2xl font-semibold">{stat.value}</div>
              <div className={`text-sm ${
                stat.change.startsWith('+') ? 'text-green-500' : 'text-red-500'
              }`}>
                {stat.change}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold">Recent Orders</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {/* Sample order data */}
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm">#12345</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">John Doe</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">Infinite Drive</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Completed
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">$49.99</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}