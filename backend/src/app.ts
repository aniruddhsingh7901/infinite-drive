// import express from 'express';
// import bodyParser from 'body-parser';
// import fs from 'fs';
// import path from 'path';
// import cors from 'cors';
// import authRoutes from './routes/authRoutes';

// // import orderRoutes from './routes/orderRoutes';
// import paymentRoutes from './routes/paymentRoutes';
// import bookRoutes from './routes/bookRoutes';
// import downloadRoutes from './routes/downloadRoutes';
// import sequelize from './config/database';
// import './models'; // Import models to initialize them
// import bcrypt from 'bcrypt';
// import User from './models/userModel';
// // Assuming you have a Token model

// const app = express();

// app.use(cors({
//   origin: 'http://localhost:3000',
//   credentials: true
// }));

// app.use(cors());
// app.use(bodyParser.json());

// app.use('/auth', authRoutes);
// // app.use('/cart', cartRoutes);
// // app.use('/order', orderRoutes);
// app.use('/payment', paymentRoutes);
// app.use('/books', bookRoutes);
// app.use('/download', express.static(path.join(__dirname, 'uploads', 'ebooks')));

// // Register download routes
// app.use('/download', downloadRoutes);


// const createAdminUser = async () => {
//   try {
//     const email = 'admin@example.com';
//     const password = 'adminpassword';
//     const hashedPassword = await bcrypt.hash(password, 10);

//     const [user, created] = await User.findOrCreate({
//       where: { email },
//       defaults: { email, password: hashedPassword, role: 'admin' }
//     });

//     if (created) {
//       console.log('Admin user created successfully');
//     } else {
//       console.log('Admin user already exists');
//     }
//   } catch (error) {
//     console.error('Error creating admin user:', error);
//   }
// };

// const PORT = process.env.PORT || 5000;

// sequelize.authenticate()
//   .then(async () => {
//     console.log('Database connected...');
//     await createAdminUser(); // Create admin user when the server starts
//     app.listen(PORT, () => {
//       console.log(`Server is running on port ${PORT}`);
//     });
//   })
//   .catch((err: any) => {
//     console.error('Unable to connect to the database:', err);
//   });

import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import paymentRoutes from './routes/paymentRoutes';
import bookRoutes from './routes/bookRoutes';
import downloadRoutes from './routes/downloadRoutes';
import sequelize from './config/database';
import './models'; // Import models to initialize them
import bcrypt from 'bcrypt';
import User from './models/userModel';

const app = express();

// Middleware to log all requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// CORS configuration - Remove duplicate cors() call
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser configuration
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Routes
app.use('/auth', authRoutes);
app.use('/payment', paymentRoutes);
app.use('/books', bookRoutes);

// Static file serving for downloads
const uploadPath = path.join(__dirname, 'uploads', 'ebooks');
// Ensure uploads directory exists
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}
app.use('/download', express.static(uploadPath));

// Register download routes
app.use('/download', downloadRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date() });
});

// Admin user creation
const createAdminUser = async () => {
  try {
    const email = 'admin@example.com';
    const password = 'adminpassword';
    const hashedPassword = await bcrypt.hash(password, 10);

    const [user, created] = await User.findOrCreate({
      where: { email },
      defaults: { 
        email, 
        password: hashedPassword, 
        role: 'admin'
      }
    });

    if (created) {
      console.log('Admin user created successfully');
    } else {
      console.log('Admin user already exists');
    }
  } catch (error) {
    console.error('Error creating admin user:', error);
    // Don't throw the error, just log it
  }
};

// Server initialization
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('Database connection established successfully');

    // Create admin user
    await createAdminUser();

    // Start server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`CORS enabled for origin: http://localhost:3000`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1); // Exit if server fails to start
  }
};

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Start the server
startServer();

export default app;