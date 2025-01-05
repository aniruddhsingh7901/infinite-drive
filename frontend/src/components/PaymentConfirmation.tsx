import React from 'react';
import { useLocation } from 'react-router-dom';
import QRCode from 'react-qr-code';

interface PaymentFlowProps {
 bookId: string;
 email: string;
}


const PaymentConfirmation = () => {
  const location = useLocation();
  const { orderId, paymentAddress, amount, crypto } = location.state;

  return (
    <div>
      <h1>Payment Confirmation</h1>
      <p>Order ID: {orderId}</p>
      <p>{crypto} Address: {paymentAddress}</p>
      <QRCode value={paymentAddress} size={256} />
      <p>Amount: {amount}</p>
      <p>Awaiting Payment...</p>
    </div>
  );
};

export default PaymentConfirmation;
