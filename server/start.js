const mongoose = require('mongoose');
require('dotenv').config();

async function checkDatabaseConnection() {
  try {
    console.log('🔍 Checking MongoDB connection...');
    console.log(`📡 Connection string: ${process.env.MONGO_URI}`);
    
    // Try to connect with a short timeout
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 3000,
      socketTimeoutMS: 5000,
    });
    
    console.log('✅ MongoDB connection successful!');
    await mongoose.connection.close();
    
    // Start the server
    console.log('🚀 Starting NeuraNotes server...');
    require('./index.js');
    
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    console.log('\n🔧 Troubleshooting steps:');
    console.log('1. Make sure MongoDB is running:');
    console.log('   - Windows: Start MongoDB service or run mongod');
    console.log('   - macOS: brew services start mongodb-community');
    console.log('   - Linux: sudo systemctl start mongod');
    console.log('2. Check your .env file has correct MONGO_URI');
    console.log('3. Try: mongodb://127.0.0.1:27017/neura_notes');
    console.log('4. Or use MongoDB Atlas (cloud) for easier setup');
    console.log('\n💡 For MongoDB Atlas:');
    console.log('   - Visit: https://cloud.mongodb.com');
    console.log('   - Create free cluster');
    console.log('   - Get connection string');
    console.log('   - Update .env file');
    
    process.exit(1);
  }
}

// Run the check
checkDatabaseConnection();

