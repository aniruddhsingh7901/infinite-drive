type PaymentDetails = {
  email: string;
  amount: number;
  cryptocurrency: string;
  bookId: string;
  token?: string;
};

type PaymentResponse = {
  success: boolean;
  orderId?: string;
  paymentAddress?: string;
  amount?: number;
  currency?: string;
  error?: string;
};

const API_URL = 'http://localhost:4000';

function getToken(): string | null {
  return typeof window !== 'undefined' ? localStorage.getItem('token') : null;
}

export async function initiatePayment(details: PaymentDetails): Promise<PaymentResponse> {
  try {
    const token = getToken();
    if (!token) {
      return {
        success: false,
        error: 'Authentication required'
      };
    }

    const response = await fetch(`${API_URL}/api/payments/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        bookId: details.bookId,
        currency: details.cryptocurrency,
        email: details.email,
        amount: details.amount
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Payment initialization failed');
    }

    return {
      success: true,
      orderId: data.orderId,
      paymentAddress: data.paymentAddress,
      amount: data.amount,
      currency: data.currency
    };
  } catch (error) {
    console.error('Payment error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Payment failed'
    };
  }
}

export async function checkPaymentStatus(orderId: string): Promise<boolean> {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${API_URL}/api/payments/check/${orderId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to check payment status');
    }

    const data = await response.json();
    return data.status === 'completed';
  } catch (error) {
    console.error('Status check error:', error);
    return false;
  }
}

export async function getPaymentMethods(): Promise<string[]> {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${API_URL}/api/payments/methods`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch payment methods');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching payment methods:', error);
    return [];
  }
}