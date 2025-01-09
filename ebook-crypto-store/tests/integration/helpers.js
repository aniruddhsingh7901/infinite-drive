const mockTransaction = {
    generateMockPayment: (orderId, address, amount) => {
      return {
        hash: '0x' + Math.random().toString(16).slice(2),
        from: '0x' + Math.random().toString(16).slice(2),
        to: address,
        value: amount,
        timestamp: Date.now(),
        confirmations: 12
      };
    }
  };
  
  module.exports = mockTransaction;