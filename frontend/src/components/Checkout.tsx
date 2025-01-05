import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface PaymentResponse {
  orderId: string;
  paymentAddress: string;
  amount: number;
}

const Checkout = () => {
  const [email, setEmail] = useState('');
  const [selectedCrypto, setSelectedCrypto] = useState('');
  const navigate = useNavigate();

  const cryptos = ['Bitcoin', 'Litecoin', 'Tron', 'Solana', 'Tether', 'Dogecoin', 'Monero'];

  const handlePurchase = async () => {
    // Backend API request to create a payment
    const response = await axios.post<PaymentResponse>('/api/create-payment', { email, crypto: selectedCrypto });
    const { orderId, paymentAddress, amount } = response.data;

    // Redirect to Payment Confirmation page
    navigate('/payment-confirmation', { state: { orderId, paymentAddress, amount, crypto: selectedCrypto } });
  };

  return (
    <div>
      <h1>Checkout</h1>
      <input
        type="email"
        placeholder="your@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <div>
        {cryptos.map((crypto) => (
          <button key={crypto} onClick={() => setSelectedCrypto(crypto)}>
            {crypto}
          </button>
        ))}
      </div>
      <button onClick={handlePurchase}>Complete Purchase</button>
    </div>
  );
};

export default Checkout;
