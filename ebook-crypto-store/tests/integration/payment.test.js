const request = require('supertest');
const app = require('../../src/server');
const { pool } = require('../../src/config/database');
const Order = require('../../src/models/orderModel');

describe('Payment Integration Tests', () => {
  const testPayment = {
    email: 'test@example.com',
    amount: 10.00,
    currency: 'USDT',
    bookId: '123e4567-e89b-12d3-a456-426614174000'
  };

  let orderId;
  let orderReference;
  let paymentAddress;

  // Clean up the test database before all tests
  beforeAll(async () => {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        order_reference VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(255) NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        payment_currency VARCHAR(10) NOT NULL,
        payment_address VARCHAR(255) NOT NULL,
        status VARCHAR(20) DEFAULT 'pending',
        tx_hash VARCHAR(255),
        paid_amount DECIMAL(10,2),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        completed_at TIMESTAMP
      )
    `);
  });

  // Clean up after all tests
  afterAll(async () => {
    await pool.query('DELETE FROM orders WHERE email = $1', [testPayment.email]);
    await pool.end();
  });

  describe('Payment Creation', () => {
    it('should create a new payment', async () => {
      const response = await request(app)
        .post('/api/payment/create')
        .send(testPayment)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.orderId).toBeDefined();
      expect(response.body.paymentAddress).toBeDefined();

      orderId = response.body.orderId;
      orderReference = response.body.orderReference;
      paymentAddress = response.body.paymentAddress;
      
      // Verify the order was created in the database
      const dbOrder = await Order.findById(orderId);
      expect(dbOrder).toBeDefined();
      expect(dbOrder.email).toBe(testPayment.email);
      expect(parseFloat(dbOrder.amount)).toBe(testPayment.amount);
      expect(dbOrder.payment_currency).toBe(testPayment.currency);
    });

    it('should fail with invalid input', async () => {
      const invalidPayment = { ...testPayment, email: 'invalid' };
      
      const response = await request(app)
        .post('/api/payment/create')
        .send(invalidPayment)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
    });
  });

  describe('Payment Status Check', () => {
    it('should verify payment status', async () => {
      const response = await request(app)
        .get(`/api/payment/check/${orderId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(['pending', 'completed']).toContain(response.body.status);
      
      // Verify status in database
      const dbOrder = await Order.findById(orderId);
      expect(['pending', 'completed']).toContain(dbOrder.status);
    });

    it('should handle non-existent order', async () => {
      const response = await request(app)
        .get('/api/payment/check/999999')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
    });
  });

  describe('Order Updates', () => {
    it('should update order status', async () => {
      const updateData = {
        status: 'completed',
        txHash: '0x1234567890abcdef',
        paidAmount: 10.00
      };

      const updatedOrder = await Order.updateStatus(orderId, updateData);
      expect(updatedOrder.status).toBe('completed');
      expect(updatedOrder.tx_hash).toBe(updateData.txHash);
      expect(parseFloat(updatedOrder.paid_amount)).toBe(updateData.paidAmount);
    });
  });

  describe('Order Retrieval', () => {
    it('should get orders by email', async () => {
      const orders = await Order.getByEmail(testPayment.email);
      expect(Array.isArray(orders)).toBe(true);
      expect(orders.length).toBeGreaterThan(0);
      expect(orders[0].email).toBe(testPayment.email);
    });
  });
});