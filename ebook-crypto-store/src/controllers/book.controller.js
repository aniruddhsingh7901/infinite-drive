// const Book = require('../models/book.model');
// const path = require('path');

// exports.getAllBooks = async (req, res) => {
//     try {
//         const books = await Book.getAll();
//         res.json(books);
//     } catch (error) {
//         console.error('Error getting books:', error);
//         res.status(500).json({ message: 'Server error' });
//     }
// };

// exports.getBook = async (req, res) => {
//     try {
//         const book = await Book.getById(req.params.id);
//         if (!book) {
//             return res.status(404).json({ message: 'Book not found' });
//         }
//         res.json(book);
//     } catch (error) {
//         console.error('Error getting book:', error);
//         res.status(500).json({ message: 'Server error' });
//     }
// };

// exports.addBook = async (req, res) => {
//     try {
//         const { title, description, price } = req.body;
        
//         if (!req.file) {
//             return res.status(400).json({ message: 'Book file is required' });
//         }

//         const filePath = req.file.filename;
//         console.log('Uploading book:', { title, description, price, filePath });

//         const book = await Book.create(title, description, price, filePath);
//         res.status(201).json(book);
//     } catch (error) {
//         console.error('Error adding book:', error);
//         res.status(500).json({ message: 'Server error' });
//     }
// };

const Book = require('../models/book.model');
const path = require('path');

exports.getAllBooks = async (req, res) => {
    try {
        const books = await Book.getAll();
        console.log('All books:', books);
        res.json(books);
    } catch (error) {
        console.error('Error getting books:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getBook = async (req, res) => {
    try {
        console.log('Looking up book with ID:', req.params.id);
        const book = await Book.getById(req.params.id);
        console.log('Book lookup result:', book);
        
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.json(book);
    } catch (error) {
        console.error('Error getting book:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.addBook = async (req, res) => {
    try {
        const { title, description, price } = req.body;
        
        if (!req.file) {
            return res.status(400).json({ message: 'Book file is required' });
        }

        const filePath = req.file.filename;
        console.log('Uploading book:', { title, description, price, filePath });

        // Validate data
        if (!title || !price) {
            return res.status(400).json({ message: 'Title and price are required' });
        }

        if (isNaN(parseFloat(price))) {
            return res.status(400).json({ message: 'Price must be a valid number' });
        }

        const book = await Book.create(title, description, parseFloat(price), filePath);
        console.log('Book created:', book);
        res.status(201).json(book);
    } catch (error) {
        console.error('Error adding book:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};