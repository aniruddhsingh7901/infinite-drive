const crypto = require('crypto');
const { pool } = require('../config/database');

class DownloadService {
    async generateDownloadToken(orderId) {
        try {
            const token = crypto.randomBytes(32).toString('hex');
            const expiresAt = new Date();
            expiresAt.setHours(expiresAt.getHours() + 24); // 24 hour expiry

            const query = `
                INSERT INTO downloads (order_id, download_token, expires_at)
                VALUES ($1, $2, $3)
                RETURNING download_token
            `;
            
            const result = await pool.query(query, [orderId, token, expiresAt]);
            return result.rows[0].download_token;
        } catch (error) {
            console.error('Error generating download token:', error);
            throw error;
        }
    }

    async validateDownloadToken(token) {
        try {
            const query = `
                SELECT d.*, o.book_id, b.file_path 
                FROM downloads d
                JOIN orders o ON d.order_id = o.id
                JOIN books b ON o.book_id = b.id
                WHERE d.download_token = $1 
                AND d.expires_at > NOW()
                AND d.is_used = false
            `;
            
            const result = await pool.query(query, [token]);
            return result.rows[0];
        } catch (error) {
            console.error('Error validating download token:', error);
            throw error;
        }
    }

    async markTokenAsUsed(token) {
        try {
            const query = `
                UPDATE downloads 
                SET is_used = true 
                WHERE download_token = $1
                RETURNING *
            `;
            const result = await pool.query(query, [token]);
            return result.rows[0];
        } catch (error) {
            console.error('Error marking token as used:', error);
            throw error;
        }
    }

    async getDownloadInfo(token) {
        try {
            const query = `
                SELECT d.*, o.book_id, b.file_path, b.title 
                FROM downloads d
                JOIN orders o ON d.order_id = o.id
                JOIN books b ON o.book_id = b.id
                WHERE d.download_token = $1
            `;
            
            const result = await pool.query(query, [token]);
            return result.rows[0];
        } catch (error) {
            console.error('Error getting download info:', error);
            throw error;
        }
    }

    async isTokenValid(token) {
        try {
            const download = await this.validateDownloadToken(token);
            return !!download;
        } catch (error) {
            console.error('Error checking token validity:', error);
            return false;
        }
    }
}

module.exports = new DownloadService();