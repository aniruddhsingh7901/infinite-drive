import 'dotenv/config';
import cloudinary from './config/cloudinary';
import path from 'path';

async function testCloudinary() {
  try {
    const testImagePath = path.join(__dirname, '../test.jpg'); // Use an actual image path
    const test = await cloudinary.uploader.upload(testImagePath);
    console.log('Success:', test);
  } catch (error) {
    console.error('Failed:', error);
  }
}

testCloudinary();