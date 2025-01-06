const User = require('../models/user.model');
const Book = require('../models/book.model');
const Order = require('../models/order.model');

// User management
exports.getAllUsers = async (req, res) => {
    try {
        const query = 'SELECT id, email, role, created_at FROM users';
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Book management
exports.addBook = async (req, res) => {
    try {
        const { title, description, price } = req.body;
        if (!req.file) {
            return res.status(400).json({ message: 'Book file is required' });
        }
        const filePath = req.file.filename;
        const book = await Book.create(title, description, price, filePath);
        res.status(201).json(book);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateBook = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, price } = req.body;
        const book = await Book.update(id, { title, description, price });
        res.json(book);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.deleteBook = async (req, res) => {
    try {
        const { id } = req.params;
        await Book.delete(id);
        res.json({ message: 'Book deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Order management
exports.getAllOrders = async (req, res) => {
    try {
        const query = `
            SELECT o.*, u.email as user_email, b.title as book_title
            FROM orders o
            JOIN users u ON o.user_id = u.id
            JOIN books b ON o.book_id = b.id
        `;
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};