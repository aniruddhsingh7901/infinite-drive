import { Request, Response } from 'express';
import { Book } from '../models/Book';

export const bookController = {
  addBook: async (req: Request, res: Response) => {
    try {
      const book = new Book(req.body);
      await book.save();
      res.status(201).json(book);
    } catch (error) {
      res.status(500).json({ error: 'Failed to add book' });
    }
  },

  getBooks: async (req: Request, res: Response) => {
    try {
      const books = await Book.find();
      res.json(books);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch books' });
    }
  },

  getBookById: async (req: Request, res: Response) => {
    try {
      const book = await Book.findById(req.params.id);
      if (!book) return res.status(404).json({ error: 'Book not found' });
      res.json(book);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch book' });
    }
  }
};