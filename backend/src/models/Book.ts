import mongoose from 'mongoose';

export interface IBook extends mongoose.Document {
  title: string;
  description: string;
  price: number;
  formats: string[];
  coverImage: string;
  fileKeys: {
    PDF?: string;
    EPUB?: string;
  };
  isActive: boolean;
  createdAt: Date;
}

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
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

export const Book = mongoose.model<IBook>('Book', bookSchema);