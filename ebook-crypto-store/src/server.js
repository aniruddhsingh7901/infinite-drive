// const { createTables } = require('./migrations/createTables');
// const express = require('express');
// const cors = require('cors');
// const helmet = require('helmet');
// const { connectDB } = require('./config/database');
// require('./utils/cleanup');

// const app = express();

// // Middleware
// app.use(helmet());
// app.use(cors({
//   origin: 'http://localhost:3000',
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization']
// }));
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Database connection
// connectDB();
// connectDB().then(async () => {
//     try {
//         await createTables();
//         console.log('Database tables initialized successfully');
//     } catch (error) {
//         console.error('Error initializing database tables:', error);
//     }
// });

// // Routes
// app.use('/api/auth', require('./routes/auth.routes'));
// app.use('/api/admin', require('./routes/admin.routes'));
// app.use('/api/books', require('./routes/book.routes'));
// app.use('/api/orders', require('./routes/order.routes'));
// app.use('/api/payments', require('./routes/payment.routes'));
// app.use('/api/downloads', require('./routes/download.routes'));

// // Error middleware
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(err.status || 500).json({
//     success: false,
//     message: err.message || 'Internal server error'
//   });
// });

// const PORT = process.env.PORT || 3001;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

const { createTables } = require('./migrations/createTables');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { connectDB } = require('./config/database');
require('./utils/cleanup');

const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize database and tables
let dbInitialized = false;
async function initializeDatabase() {
  if (dbInitialized) return;
  try {
    await connectDB();
    await createTables();
    dbInitialized = true;
    console.log('Database and tables initialized successfully');
  } catch (error) {
    console.error('Database initialization failed:', error);
    process.exit(1);
  }
}

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/admin', require('./routes/admin.routes'));
app.use('/api/books', require('./routes/book.routes'));
app.use('/api/orders', require('./routes/order.routes'));
app.use('/api/payments', require('./routes/payment.routes'));
app.use('/api/downloads', require('./routes/download.routes'));

// Error middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error'
  });
});

const PORT = process.env.PORT || 3001;

// Start server after database initialization
initializeDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(error => {
    console.error('Failed to start server:', error);
    process.exit(1);
  });