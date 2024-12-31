import express from 'express';
import { adminController } from '../controllers/adminController';
import { auth } from '../middleware/auth';
import { body } from 'express-validator';

const router = express.Router();

// Validation schema (you can add this in a separate validation file)
const registerValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('role').optional().isIn(['admin', 'super_admin'])
];

const loginValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').exists()
];

// Public routes
router.post('/register', registerValidation, adminController.register);
router.post('/login', loginValidation, adminController.login);

// Protected routes
router.get('/profile', auth, adminController.getProfile);
router.get('/all', auth, adminController.getAllAdmins);

export default router;