// import express from 'express';
// import bodyParser from 'body-parser';
// import fs from 'fs';
// import path from 'path';
// import cors from 'cors';
// import authRoutes from './routes/authRoutes';
// import { createServer } from 'http';
// import WebSocketService from './services/websocketService';
// import BlockCypherWebSocketService from './services/blockCypherService';

// // import orderRoutes from './routes/orderRoutes';
// import paymentRoutes from './routes/paymentRoutes';
// import bookRoutes from './routes/bookRoutes';
// import downloadRoutes from './routes/downloadRoutes';
// import webhookRoutes from './routes/blockCypher';
// import sequelize from './config/database';
// import './models'; // Import models to initialize them
// import bcrypt from 'bcrypt';
// import User from './models/userModel';
// import orderRoutes from './routes/orderRoutes';
// // Assuming you have a Token model

// const app = express();
// app.use(cors());
// app.use(bodyParser.json());





// const server = createServer(app);
// const webSocketService = new WebSocketService(server);
// const blockCypherWebSocketService = new BlockCypherWebSocketService(webSocketService);

// app.use('/auth', authRoutes);
// app.use('/payment', paymentRoutes);
// app.use('/webhooks', webhookRoutes);
// // app.use('/books', bookRoutes);
// app.use('/api/books', bookRoutes);
// app.use('/orders', orderRoutes)
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
//     await sequelize.sync(); 
//     await createAdminUser(); // Create admin user when the server starts
//     server.listen(PORT, () => {
//       console.log(`Server is running on port ${PORT}`);
//     });
//   })
//   .catch((err: any) => {
//     console.error('Unable to connect to the database:', err);
//   });

// export { webSocketService }; 

import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';
import cors from 'cors';
import { createServer } from 'http';
import WebSocketService from './services/websocketService';
import BlockCypherWebSocketService from './services/blockCypherService';
import authRoutes from './routes/authRoutes';
import paymentRoutes from './routes/paymentRoutes';
import bookRoutes from './routes/bookRoutes';
import downloadRoutes from './routes/downloadRoutes';
import webhookRoutes from './routes/blockCypher';
import orderRoutes from './routes/orderRoutes';
import sequelize from './config/database';
import './models';
import bcrypt from 'bcrypt';
import User from './models/userModel';

const app = express();

// CORS configuration
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// Server setup
const server = createServer(app);
const webSocketService = new WebSocketService(server);
const blockCypherWebSocketService = new BlockCypherWebSocketService(webSocketService);

// Routes
app.use('/auth', authRoutes);
app.use('/payment', paymentRoutes);
app.use('/webhooks', webhookRoutes);
app.use('/api/books', bookRoutes);
app.use('/orders', orderRoutes);
app.use('/download', downloadRoutes);

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error'
  });
});

// Admin user creation
const createAdminUser = async () => {
  try {
    const [user, created] = await User.findOrCreate({
      where: { email: 'admin@example.com' },
      defaults: {
        email: 'admin@example.com',
        password: await bcrypt.hash('adminpassword', 10),
        role: 'admin'
      }
    });
    console.log(created ? 'Admin user created' : 'Admin user exists');
  } catch (error) {
    console.error('Admin user creation error:', error);
  }
};

// Server startup
const PORT = process.env.PORT || 5000;
sequelize.authenticate()
  .then(async () => {
    await sequelize.sync();
    await createAdminUser();
    server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error('Database connection error:', err));

export { webSocketService };