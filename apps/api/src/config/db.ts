import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const mongoUri = process.env.DATABASE_URL;
    if (!mongoUri) {
      throw new Error('DATABASE_URL is not defined in the environment variables');
    }
    
    await mongoose.connect(mongoUri);
    console.log('✅ MongoDB Connected successfully with Mongoose');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error);
    process.exit(1);
  }
};
