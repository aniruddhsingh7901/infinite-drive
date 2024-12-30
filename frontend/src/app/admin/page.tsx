'use client';

import { useState, useEffect } from 'react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalSales: 0,
    orders: 0,
    activeUsers: 0
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium">Total Sales</h3>
          <p className="text-3xl font-bold">${stats.totalSales}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium">Orders</h3>
          <p className="text-3xl font-bold">{stats.orders}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium">Active Users</h3>
          <p className="text-3xl font-bold">{stats.activeUsers}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Recent Orders</h2>
        {/* Add order table here */}
      </div>
    </div>
  );
}