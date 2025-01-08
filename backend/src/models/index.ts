import sequelize from '../config/database';
import User from './userModel';
import Book from './Book';
import Cart from './cartModel';
import Order from './orderModel';
import DownloadToken from './tokenModel';

// Initialize models
const initializeModels = async () => {
    try {
        await sequelize.sync();
        console.log('Database synchronized');
    } catch (error) {
        console.error('Error synchronizing database:', error);
    }
};

initializeModels();

export { User, Book, Cart, Order, DownloadToken };