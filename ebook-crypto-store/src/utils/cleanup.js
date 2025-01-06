const { pool } = require('../config/database');

async function cleanupExpiredDownloads() {
    const query = `
        DELETE FROM downloads 
        WHERE expires_at < NOW() 
        OR is_used = true
    `;
    
    try {
        await pool.query(query);
        console.log('Cleaned up expired downloads');
    } catch (error) {
        console.error('Cleanup error:', error);
    }
}

// Run cleanup every 24 hours
setInterval(cleanupExpiredDownloads, 24 * 60 * 60 * 1000);

module.exports = cleanupExpiredDownloads;