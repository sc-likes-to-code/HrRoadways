import {} from 'dotenv/config';

const connectDB = async () => {
  try {
    // For this application, we're using JSON file storage instead of MongoDB
    // So we'll just log a message instead of connecting to MongoDB
    console.log('✅ Using file-based storage instead of MongoDB');
    return { connection: { host: 'file-system' } };
  } catch (error) {
    console.error("❌ Database setup error", error);
    process.exit(1);
  }
};

export default connectDB;