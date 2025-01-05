import { useState, useEffect } from 'react';
import QRCode from 'react-qr-code';
import { useCart } from '@/lib/cart/CartContext';
import PaymentMonitor from './PaymentMonitor';
import { CryptoPayment } from '@/services/crypto-payment';

interface PaymentProcessorProps {
  email: string;
  cryptocurrency: string;
  onSuccess: () => void;
  onFailure: (error: string) => void;
}

export default function PaymentProcessor(props: PaymentProcessorProps) {
  const [payment, setPayment] = useState<CryptoPayment | null>(null);
  const [error, setError] = useState<string>('');
  const { total } = useCart();

  useEffect(() => {
    initializePayment();
  }, []);

  const initializePayment = async () => {
    try {
      const response = await fetch('/api/payments/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: props.email,
          amount: total,
          cryptocurrency: props.cryptocurrency
        })
      });

      const data = await response.json();
      if (response.ok) {
        setPayment({
          orderId: data.orderId,
          amount: data.amount,
          currency: data.currency,
          address: data.paymentAddress,
          status: 'pending',
          timeoutAt: Date.now() + 30 * 60 * 1000 // 30 minutes
        });
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to initialize payment');
      props.onFailure('Payment initialization failed');
    }
  };

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-lg text-red-600">
        {error}
      </div>
    );
  }

  if (!payment) {
    return (
      <div className="p-4 text-center">
        Initializing payment...
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto">
      <div className="mb-6">
        <QRCode 
          value={payment.address}
          size={256}
          className="mx-auto"
        />
      </div>
      
      <PaymentMonitor
        payment={payment}
        onSuccess={props.onSuccess}
        onFailure={() => props.onFailure('Payment failed or timed out')}
      />
    </div>
  );
}