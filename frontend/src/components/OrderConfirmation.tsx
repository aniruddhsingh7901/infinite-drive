'use client';

interface OrderDetails {
  orderId: string;
  email: string;
  amount: number;
  currency: string;
}

export default function OrderConfirmation({ 
  order 
}: { 
  order: OrderDetails 
}) {
  return (
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Order Confirmation</h2>
        <p className="text-gray-600">Your order has been received</p>
      </div>

      <div className="space-y-6">
        <div className="border-b pb-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-600">Order ID</div>
              <div className="font-medium">{order.orderId}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Email</div>
              <div className="font-medium">{order.email}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Amount</div>
              <div className="font-medium">
                {order.amount} {order.currency}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Status</div>
              <div className="text-green-600 font-medium">Processing</div>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-blue-500 mt-1 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <div className="text-sm text-blue-900">
              <p className="font-medium mb-1">Important Information</p>
              <ul className="list-disc list-inside space-y-1 text-blue-800">
                <li>Download link will be sent to your email</li>
                <li>Link expires in 24 hours</li>
                <li>Maximum 3 download attempts</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}