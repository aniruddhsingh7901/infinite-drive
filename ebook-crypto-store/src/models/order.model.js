// const { pool } = require('../config/database');

// class Order {
//     static async create(userId, bookId, amount, email) {
//         const query = `
//             INSERT INTO orders (
//                 user_id, book_id, amount, email, 
//                 status, payment_currency, payment_address
//             ) 
//             VALUES ($1, $2, $3, $4, 'pending', $5, $6) 
//             RETURNING *
//         `;
//         const result = await pool.query(query, [
//             userId, bookId, amount, email, 
//             'TON', process.env.TON_ADDRESS
//         ]);
//         return result.rows[0];
//     }

//     static async getById(id) {
//         const query = `
//             SELECT o.*, b.title as book_title, b.file_path,
//                    o.payment_currency, o.payment_address, 
//                    o.tx_hash, o.paid_amount
//             FROM orders o 
//             JOIN books b ON o.book_id = b.id 
//             WHERE o.id = $1
//         `;
//         const result = await pool.query(query, [id]);
//         return result.rows[0];
//     }

//     static async updateStatus(orderId, status, txHash = null, paidAmount = null) {
//         const query = `
//             UPDATE orders 
//             SET status = $1,
//                 tx_hash = COALESCE($3, tx_hash),
//                 paid_amount = COALESCE($4, paid_amount),
//                 updated_at = CURRENT_TIMESTAMP
//             WHERE id = $2 
//             RETURNING *
//         `;
//         const result = await pool.query(query, [status, orderId, txHash, paidAmount]);
//         return result.rows[0];
//     }
// }

// module.exports = Order;

// const { pool } = require('../config/database');

// class Order {
//     static async create({ email, bookId, amount, currency, paymentAddress }) {
//         const query = `
//             INSERT INTO orders (
//                 book_id, amount, email, 
//                 status, payment_currency, payment_address
//             ) 
//             VALUES ($1, $2, $3, $4, $5, $6) 
//             RETURNING *
//         `;
//         try {
//             const result = await pool.query(query, [
//                 bookId,
//                 amount,
//                 email,
//                 'pending',
//                 currency,
//                 paymentAddress
//             ]);
//             return result.rows[0];
//         } catch (error) {
//             console.error('Order creation error:', error);
//             throw error;
//         }
//     }

//     static async findById(id) {
//         const query = `
//             SELECT o.*, b.title as book_title, b.file_path
//             FROM orders o 
//             LEFT JOIN books b ON o.book_id = b.id 
//             WHERE o.id = $1
//         `;
//         const result = await pool.query(query, [id]);
//         return result.rows[0];
//     }

//     static async updateStatus(orderId, { status, txHash, paidAmount }) {
//         const query = `
//             UPDATE orders 
//             SET status = $1,
//                 tx_hash = COALESCE($2, tx_hash),
//                 paid_amount = COALESCE($3, paid_amount),
//                 updated_at = CURRENT_TIMESTAMP
//             WHERE id = $4 
//             RETURNING *
//         `;
//         const result = await pool.query(query, [status, txHash, paidAmount, orderId]);
//         return result.rows[0];
//     }

//     // Alias for backward compatibility
//     static async getById(id) {
//         return this.findById(id);
//     }
// }

// module.exports = Order;

const { pool } = require('../config/database');

class Order {
    static async create({ email, amount, currency, paymentAddress }) {
        const query = `
            INSERT INTO orders (
                order_reference, email, amount, 
                payment_currency, payment_address, 
                status, created_at
            ) 
            VALUES ($1, $2, $3, $4, $5, 'pending', CURRENT_TIMESTAMP) 
            RETURNING *
        `;

        const orderReference = `ORDER${Date.now()}`;
        
        try {
            const result = await pool.query(query, [
                orderReference,
                email,
                amount,
                currency,
                paymentAddress
            ]);
            return result.rows[0];
        } catch (error) {
            console.error('Order creation error:', error);
            throw error;
        }
    }

    static async findById(id) {
        try {
            const result = await pool.query(
                'SELECT * FROM orders WHERE id = $1',
                [String(id)] // Cast id to string
            );
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }

    static async updateStatus(orderId, { status, txHash, paidAmount }) {
        const query = `
            UPDATE orders 
            SET 
                status = $1,
                tx_hash = COALESCE($2, tx_hash),
                paid_amount = COALESCE($3, paid_amount),
                completed_at = CASE 
                    WHEN $1 = 'completed' THEN CURRENT_TIMESTAMP 
                    ELSE completed_at 
                END,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $4 OR order_reference = $4
            RETURNING *
        `;

        try {
            const result = await pool.query(query, [
                status,
                txHash,
                paidAmount,
                orderId
            ]);
            return result.rows[0];
        } catch (error) {
            console.error('Order status update error:', error);
            throw error;
        }
    }

    static async getByEmail(email) {
        const query = `
            SELECT * FROM orders 
            WHERE email = $1 
            ORDER BY created_at DESC
        `;
        
        try {
            const result = await pool.query(query, [email]);
            return result.rows;
        } catch (error) {
            console.error('Orders lookup error:', error);
            throw error;
        }
    }
}

module.exports = Order;