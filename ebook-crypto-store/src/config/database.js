// const { Pool } = require('pg');
// const path = require('path');
// require('dotenv').config({ path: path.join(__dirname, '../../.env') });

// const config = {
//     host: process.env.DB_HOST,
//     port: process.env.DB_PORT,
//     database: process.env.DB_NAME,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD
// };

// // Create the pool instance
// const pool = new Pool(config);

// const connectDB = async () => {
//     try {
//         const client = await pool.connect();
//         console.log('Database connected successfully');
        
//         // Create tables if they don't exist
//         await initializeTables();
//         console.log('Tables initialized successfully');
        
//         client.release();
//     } catch (error) {
//         console.error('Database connection failed:', error.message);
//         console.error('Connection details:', {
//             host: process.env.DB_HOST,
//             port: process.env.DB_PORT,
//             database: process.env.DB_NAME,
//             user: process.env.DB_USER
//         });
//         process.exit(1);
//     }
// };

// const initializeTables = async () => {
//     try {
//         // Create tables with role column
//         const createTablesQuery = `
//             CREATE TABLE IF NOT EXISTS users (
//                 id SERIAL PRIMARY KEY,
//                 email VARCHAR(255) UNIQUE NOT NULL,
//                 password VARCHAR(255) NOT NULL,
//                 role VARCHAR(10) DEFAULT 'user',
//                 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//             );

//             CREATE TABLE IF NOT EXISTS books (
//                 id SERIAL PRIMARY KEY,
//                 title VARCHAR(255) NOT NULL,
//                 description TEXT,
//                 price DECIMAL(10,2) NOT NULL,
//                 file_path VARCHAR(255) NOT NULL,
//                 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//             );

//             CREATE TABLE IF NOT EXISTS orders (
//                 id SERIAL PRIMARY KEY,
//                 user_id INTEGER REFERENCES users(id),
//                 book_id INTEGER REFERENCES books(id),
//                 amount DECIMAL(10,2) NOT NULL,
//                 status VARCHAR(50) DEFAULT 'pending',
//                 payment_address VARCHAR(255),
//                 payment_currency VARCHAR(10),
//                 email VARCHAR(255),
//                 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//             );

//             CREATE TABLE IF NOT EXISTS downloads (
//                 id SERIAL PRIMARY KEY,
//                 order_id INTEGER REFERENCES orders(id),
//                 download_token VARCHAR(255),
//                 expires_at TIMESTAMP,
//                 is_used BOOLEAN DEFAULT false,
//                 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//             );
//         `;

//         await pool.query(createTablesQuery);
//         console.log('Tables created successfully');
//     } catch (error) {
//         console.error('Error initializing tables:', error);
//         throw error;
//     }
// };


// // Helper function to check if database connection is alive
// const checkConnection = async () => {
//     try {
//         const client = await pool.connect();
//         client.release();
//         return true;
//     } catch (error) {
//         return false;
//     }
// };

// module.exports = {
//     pool,
//     connectDB,
//     checkConnection
// };

const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const config = {
   host: process.env.DB_HOST,
   port: process.env.DB_PORT,
   database: process.env.DB_NAME,
   user: process.env.DB_USER,
   password: process.env.DB_PASSWORD
};

const pool = new Pool(config);

const connectDB = async () => {
   try {
       const client = await pool.connect();
       console.log('Database connected successfully');
       await initializeTables();
       console.log('Tables initialized successfully');
       client.release();
   } catch (error) {
       console.error('Database connection failed:', error.message);
       console.error('Connection details:', {
           host: process.env.DB_HOST,
           port: process.env.DB_PORT,
           database: process.env.DB_NAME,
           user: process.env.DB_USER
       });
       process.exit(1);
   }
};

const initializeTables = async () => {
   try {
       const createTablesQuery = `
           CREATE TABLE IF NOT EXISTS users (
               id SERIAL PRIMARY KEY,
               email VARCHAR(255) UNIQUE NOT NULL,
               password VARCHAR(255) NOT NULL,
               role VARCHAR(10) DEFAULT 'user',
               created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
           );

           CREATE TABLE IF NOT EXISTS books (
               id SERIAL PRIMARY KEY,
               title VARCHAR(255) NOT NULL,
               description TEXT,
               price DECIMAL(10,2) NOT NULL,
               file_path VARCHAR(255) NOT NULL,
               created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
           );

           CREATE TABLE IF NOT EXISTS orders (
               id SERIAL PRIMARY KEY,
               user_id INTEGER REFERENCES users(id),
               book_id INTEGER REFERENCES books(id),
               amount DECIMAL(10,2) NOT NULL,
               status VARCHAR(50) DEFAULT 'pending',
               payment_address VARCHAR(255),
               payment_currency VARCHAR(10) DEFAULT 'TON',
               email VARCHAR(255),
               tx_hash VARCHAR(255),
               paid_amount DECIMAL(18,8),
               created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
               updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
           );

           CREATE TABLE IF NOT EXISTS downloads (
               id SERIAL PRIMARY KEY,
               order_id INTEGER REFERENCES orders(id),
               download_token VARCHAR(255),
               expires_at TIMESTAMP,
               is_used BOOLEAN DEFAULT false,
               created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
           );

           CREATE OR REPLACE FUNCTION update_updated_at_column()
           RETURNS TRIGGER AS $$
           BEGIN
               NEW.updated_at = CURRENT_TIMESTAMP;
               RETURN NEW;
           END;
           $$ language 'plpgsql';

           DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
           
           CREATE TRIGGER update_orders_updated_at
               BEFORE UPDATE ON orders
               FOR EACH ROW
               EXECUTE FUNCTION update_updated_at_column();
       `;

       await pool.query(createTablesQuery);
       console.log('Tables created successfully');
   } catch (error) {
       console.error('Error initializing tables:', error);
       throw error;
   }
};

const checkConnection = async () => {
   try {
       const client = await pool.connect();
       client.release();
       return true;
   } catch (error) {
       return false;
   }
};

module.exports = {
   pool,
   connectDB,
   checkConnection
};