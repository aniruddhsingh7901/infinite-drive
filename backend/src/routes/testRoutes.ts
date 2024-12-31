import express from 'express';
import mongoose from 'mongoose';
const router = express.Router();

// Basic GET test
router.get('/test', (req, res) => {
  res.json({ 
    message: 'GET test successful',
    timestamp: new Date().toISOString()
  });
});

// Basic POST test
router.post('/test', (req, res) => {
  res.json({ 
    message: 'POST test successful',
    receivedData: req.body,
    timestamp: new Date().toISOString()
  });
});

// Database connection test
router.get('/db-test', async (req, res) => {
  try {
    if (!mongoose.connection.db) {
      throw new Error('Database connection not established');
    }
    const result = await mongoose.connection.db.admin().ping();
    res.json({ 
      dbConnection: 'successful',
      ping: result,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    res.status(500).json({ 
      dbConnection: 'failed',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

export default router;