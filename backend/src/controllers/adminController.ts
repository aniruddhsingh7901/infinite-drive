import { Request, Response } from 'express';
import { Admin } from '../models/Admin';
import jwt from 'jsonwebtoken';

export const adminController = {
  register: async (req: Request, res: Response) => {
    try {
      const { email, password, role } = req.body;

      // Check if admin already exists
      const existingAdmin = await Admin.findOne({ email });
      if (existingAdmin) {
        return res.status(400).json({ error: 'Admin already exists' });
      }

      // Create new admin (password hashing handled by schema pre-save)
      const admin = new Admin({
        email,
        password,
        role: role || 'admin'
      });

      await admin.save();

      // Create token
      const token = jwt.sign(
        { id: admin._id, role: admin.role },
        process.env.JWT_SECRET!,
        { expiresIn: '1d' }
      );

      res.status(201).json({ 
        message: 'Admin registered successfully',
        token 
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ error: 'Registration failed' });
    }
  },

  login: async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      // Find admin
      const admin = await Admin.findOne({ email });
      if (!admin) {
        return res.status(400).json({ error: 'Invalid credentials' });
      }

      // Check password using schema method
    const isMatch = await admin.comparePassword(password);
      if (!isMatch) {
        return res.status(400).json({ error: 'Invalid credentials' });
      }

      // Create token
      const token = jwt.sign(
        { id: admin._id, role: admin.role },
        process.env.JWT_SECRET!,
        { expiresIn: '1d' }
      );

      res.json({ 
        message: 'Login successful',
        token,
        role: admin.role
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Login failed' });
    }
  },

  getProfile: async (req: Request, res: Response) => {
    try {
      const admin = await Admin.findById(req.user?.id).select('-password');
      if (!admin) {
        return res.status(404).json({ error: 'Admin not found' });
      }
      res.json(admin);
    } catch (error) {
      console.error('Profile fetch error:', error);
      res.status(500).json({ error: 'Failed to fetch profile' });
    }
  },

  getAllAdmins: async (req: Request, res: Response) => {
    try {
      // Only super_admin can view all admins
      if (req.user?.role !== 'super_admin') {
        return res.status(403).json({ error: 'Not authorized' });
      }

      const admins = await Admin.find().select('-password');
      res.json(admins);
    } catch (error) {
      console.error('Fetch admins error:', error);
      res.status(500).json({ error: 'Failed to fetch admins' });
    }
  }
};