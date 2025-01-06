// // // const { pool } = require('../config/database');

// // // class Book {
// // //     static async create(title, description, price, filePath) {
// // //         const query = `
// // //             INSERT INTO books (title, description, price, file_path) 
// // //             VALUES ($1, $2, $3, $4) 
// // //             RETURNING *
// // //         `;
// // //         const result = await pool.query(query, [title, description, price, filePath]);
// // //         return result.rows[0];
// // //     }

// // //     static async getAll() {
// // //         const query = 'SELECT id, title, description, price, created_at FROM books';
// // //         const result = await pool.query(query);
// // //         return result.rows;
// // //     }

// // //     static async getById(id) {
// // //         const query = 'SELECT * FROM books WHERE id = $1';
// // //         const result = await pool.query(query, [id]);
// // //         return result.rows[0];
// // //     }
// // // }

// // // module.exports = Book;

// // const { pool } = require('../config/database');

// // class Book {
// //     static async create(title, description, price, filePath) {
// //         const query = `
// //             INSERT INTO books (title, description, price, file_path) 
// //             VALUES ($1, $2, $3, $4) 
// //             RETURNING *
// //         `;
// //         const result = await pool.query(query, [title, description, price, filePath]);
// //         return result.rows[0];
// //     }

// //     static async getAll() {
// //         const query = 'SELECT id, title, description, price, file_path, created_at FROM books';
// //         const result = await pool.query(query);
// //         return result.rows;
// //     }

// //     static async getById(id) {
// //         // First try to find by numeric ID
// //         let query = 'SELECT * FROM books WHERE id = $1';
// //         let result = await pool.query(query, [parseInt(id)]);

// //         // If not found, try to find by file_path
// //         if (!result.rows[0]) {
// //             query = 'SELECT * FROM books WHERE file_path = $1';
// //             result = await pool.query(query, [id]);
// //         }

// //         return result.rows[0];
// //     }
// // }

// // module.exports = Book;

// // src/models/book.model.js
// const { pool } = require('../config/database');

// class Book {
//     static async getById(id) {
//         console.log('Attempting to find book with id:', id);
        
//         try {
//             // First try by file_path
//             let query = 'SELECT * FROM books WHERE file_path = $1';
//             console.log('Searching by file_path:', id);
//             let result = await pool.query(query, [id]);
//             console.log('File path search result:', result.rows);
            
//             if (result.rows[0]) {
//                 return result.rows[0];
//             }

//             // Then try by ID if numeric
//             if (!isNaN(id)) {
//                 query = 'SELECT * FROM books WHERE id = $1';
//                 console.log('Searching by id:', id);
//                 result = await pool.query(query, [parseInt(id)]);
//                 console.log('ID search result:', result.rows);
//                 return result.rows[0];
//             }

//             return null;
//         } catch (error) {
//             console.error('Error in getById:', error);
//             throw error;
//         }
//     }

//     static async create(title, description, price, filePath) {
//         const query = `
//             INSERT INTO books (title, description, price, file_path) 
//             VALUES ($1, $2, $3, $4) 
//             RETURNING *
//         `;
//         const result = await pool.query(query, [title, description, price, filePath]);
//         return result.rows[0];
//     }

//     static async getAll() {
//         const query = 'SELECT * FROM books';
//         const result = await pool.query(query);
//         return result.rows;
//     }
// }

// module.exports = Book;

const { pool } = require('../config/database');

class Book {
    static async create(title, description, price, filePath) {
        const query = `
            INSERT INTO books (title, description, price, file_path) 
            VALUES ($1, $2, $3, $4) 
            RETURNING *
        `;
        const result = await pool.query(query, [title, description, price, filePath]);
        return result.rows[0];
    }

    static async getAll() {
        const query = 'SELECT * FROM books ORDER BY created_at DESC';
        const result = await pool.query(query);
        return result.rows;
    }

    static async getById(id) {
        try {
            console.log('Attempting to find book with id:', id);
            
            // First try exact match
            let query = 'SELECT * FROM books WHERE file_path = $1';
            let result = await pool.query(query, [id]);
            console.log('Exact match result:', result.rows);

            if (result.rows[0]) {
                return result.rows[0];
            }

            // Try case-insensitive match
            query = 'SELECT * FROM books WHERE LOWER(file_path) = LOWER($1)';
            result = await pool.query(query, [id]);
            console.log('Case-insensitive match result:', result.rows);

            if (result.rows[0]) {
                return result.rows[0];
            }

            // Try pattern match
            query = 'SELECT * FROM books WHERE file_path ILIKE $1';
            result = await pool.query(query, [`%${id}%`]);
            console.log('Pattern match result:', result.rows);

            if (result.rows[0]) {
                return result.rows[0];
            }

            // If no match found and id is numeric, try by ID
            if (!isNaN(id)) {
                query = 'SELECT * FROM books WHERE id = $1';
                result = await pool.query(query, [parseInt(id)]);
                return result.rows[0];
            }

            return null;
        } catch (error) {
            console.error('Error in getById:', error);
            throw error;
        }
    }

    static async testBookLookup() {
        try {
            // Get all books
            const query = 'SELECT * FROM books';
            const result = await pool.query(query);
            console.log('All books in database:', result.rows);
            
            if (result.rows.length > 0) {
                // Try to find first book by its file_path
                const firstBook = result.rows[0];
                console.log('Attempting to find book:', firstBook.file_path);
                const foundBook = await this.getById(firstBook.file_path);
                console.log('Found book:', foundBook);
            }
        } catch (error) {
            console.error('Test lookup failed:', error);
        }
    }
}

module.exports = Book;