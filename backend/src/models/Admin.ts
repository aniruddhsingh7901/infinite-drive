import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

interface IAdmin extends mongoose.Document {
  email: string;
  password: string;
  role: 'admin' | 'super_admin';
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const adminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'super_admin'], default: 'admin' }
});

adminSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

adminSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export const Admin = mongoose.model<IAdmin>('Admin', adminSchema);