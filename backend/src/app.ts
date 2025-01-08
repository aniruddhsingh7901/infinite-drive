import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';
import cors from 'cors';
import authRoutes from './routes/authRoutes';

// import orderRoutes from './routes/orderRoutes';
import paymentRoutes from './routes/paymentRoutes';
import bookRoutes from './routes/bookRoutes';
import downloadRoutes from './routes/downloadRoutes';
import sequelize from './config/database';
import './models'; // Import models to initialize them
import bcrypt from 'bcrypt';
import User from './models/userModel';
// Assuming you have a Token model

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/auth', authRoutes);
// app.use('/cart', cartRoutes);
// app.use('/order', orderRoutes);
app.use('/payment', paymentRoutes);
app.use('/books', bookRoutes);
app.use('/download', express.static(path.join(__dirname, 'uploads', 'ebooks')));

// Register download routes
app.use('/download', downloadRoutes);


const createAdminUser = async () => {
  try {
    const email = 'admin@example.com';
    const password = 'adminpassword';
    const hashedPassword = await bcrypt.hash(password, 10);

    const [user, created] = await User.findOrCreate({
      where: { email },
      defaults: { email, password: hashedPassword, role: 'admin' }
    });

    if (created) {
      console.log('Admin user created successfully');
    } else {
      console.log('Admin user already exists');
    }
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
};

const PORT = process.env.PORT || 5000;

sequelize.authenticate()
  .then(async () => {
    console.log('Database connected...');
    await createAdminUser(); // Create admin user when the server starts
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err: any) => {
    console.error('Unable to connect to the database:', err);
  });

