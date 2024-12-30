import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  formats: [{
    type: String,
    enum: ['PDF', 'EPUB'],
    required: true
  }],
  coverImage: { type: String, required: true },
  fileKeys: {
    PDF: String,
    EPUB: String
  },
  createdAt: { type: Date, default: Date.now }
});

export const Book = mongoose.model('Book', bookSchema);