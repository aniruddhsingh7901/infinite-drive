const { pool } = require('../config/database');

async function createTables() {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // First drop the foreign key constraints
        await client.query(`
            ALTER TABLE IF EXISTS downloads 
            DROP CONSTRAINT IF EXISTS downloads_order_id_fkey;
        `);

        // Add order_reference column to orders
        await client.query(`
            ALTER TABLE orders 
            ADD COLUMN IF NOT EXISTS order_reference VARCHAR(255);
        `);

        // Update orders table to use SERIAL id but keep string reference
        await client.query(`
            ALTER TABLE orders 
            ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP,
            ALTER COLUMN status SET DEFAULT 'pending';
        `);

        // Update existing records
        await client.query(`
            UPDATE orders 
            SET order_reference = 'ORDER' || id 
            WHERE order_reference IS NULL;
        `);

        // Recreate the foreign key with the numeric ID
        await client.query(`
            ALTER TABLE downloads 
            ADD CONSTRAINT downloads_order_id_fkey 
            FOREIGN KEY (order_id) 
            REFERENCES orders(id);
        `);

        await client.query('COMMIT');
        console.log('Database tables updated successfully');
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error updating database tables:', error);
        throw error;
    } finally {
        client.release();
    }
}

module.exports = { createTables };