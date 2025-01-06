const { pool } = require('../config/database');
const bcrypt = require('bcrypt');

class User {
    static async create(email, password, role = 'user') {
        const hashedPassword = await bcrypt.hash(password, 10);
        const query = `
            INSERT INTO users (email, password, role) 
            VALUES ($1, $2, $3) 
            RETURNING id, email, role
        `;
        const result = await pool.query(query, [email, hashedPassword, role]);
        return result.rows[0];
    }

    static async findByEmail(email) {
        const query = 'SELECT * FROM users WHERE email = $1';
        const result = await pool.query(query, [email]);
        return result.rows[0];
    }

    static async validatePassword(password, hashedPassword) {
        return await bcrypt.compare(password, hashedPassword);
    }
}

module.exports = User;