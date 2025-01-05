// src/context/PaymentContext.tsx
import { createContext, useContext, useState } from 'react';
import { PaymentDetails, PaymentStatus } from '@/types/payment';

interface PaymentContextType {
  paymentDetails: PaymentDetails | null;
  setPaymentDetails: (details: PaymentDetails | null) => void;
  paymentStatus: PaymentStatus | null;
  setPaymentStatus: (status: PaymentStatus | null) => void;
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

export function PaymentProvider({ children }: { children: React.ReactNode }) {
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(null);

  return (
    <PaymentContext.Provider value={{
      paymentDetails,
      setPaymentDetails,
      paymentStatus,
      setPaymentStatus
    }}>
      {children}
    </PaymentContext.Provider>
  );
}

export function usePayment() {
  const context = useContext(PaymentContext);
  if (context === undefined) {
    throw new Error('usePayment must be used within a PaymentProvider');
  }
  return context;
}