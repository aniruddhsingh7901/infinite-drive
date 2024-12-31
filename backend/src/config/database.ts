import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    
    if (!uri) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    console.log('Attempting to connect to MongoDB...');
    
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    });

    const db = mongoose.connection;

    db.on('error', (error) => {
      console.error('MongoDB connection error:', error);
    });

    db.once('open', () => {
      console.log('Successfully connected to MongoDB!');
    });

  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};