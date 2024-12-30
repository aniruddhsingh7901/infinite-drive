import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  bookId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Book', 
    required: true 
  },
  customerEmail: { type: String, required: true },
  format: {
    type: String,
    enum: ['PDF', 'EPUB'],
    required: true
  },
  amount: { type: Number, required: true },
  paymentChargeId: String,
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  downloadLink: String,
  downloadExpiry: Date,
  downloads: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

export const Order = mongoose.model('Order', orderSchema);