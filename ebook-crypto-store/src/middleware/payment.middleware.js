// middleware/payment.middleware.js

const paymentAuth = async (req, res, next) => {
    try {
      // Basic validation for POST requests
      if (req.method === 'POST') {
        const { email, cryptocurrency, bookId } = req.body;
        
        if (!email || !cryptocurrency || !bookId) {
          return res.status(400).json({
            success: false,
            message: 'Missing required fields'
          });
        }
  
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          return res.status(400).json({
            success: false,
            message: 'Invalid email format'
          });
        }
      }
  
      // For GET requests, validate orderId parameter
      if (req.method === 'GET' && req.params.orderId) {
        if (!req.params.orderId.match(/^[a-zA-Z0-9-]+$/)) {
          return res.status(400).json({
            success: false,
            message: 'Invalid order ID format'
          });
        }
      }
  
      next();
    } catch (error) {
      next(error);
    }
  };
  
  module.exports = paymentAuth;