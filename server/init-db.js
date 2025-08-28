const mongoose = require('mongoose');
require('dotenv').config();

// Database initialization script
async function initializeDatabase() {
  try {
    console.log('🚀 Initializing NeuraNotes database...');
    
    // Connect to MongoDB (simplified, initial-style config)
    await mongoose.connect(process.env.MONGO_URI);
    
    console.log('✅ Connected to MongoDB');
    
    // Get database instance
    const db = mongoose.connection.db;
    
    // List all collections
    const collections = await db.listCollections().toArray();
    console.log('📊 Existing collections:', collections.map(c => c.name));
    
    // Ensure indexes are created
    const User = require('./models/User');
    const Note = require('./models/Note');
    
    // Create indexes
    await User.createIndexes();
    await Note.createIndexes();
    
    console.log('✅ Database indexes created/verified');
    
    // Check if we have any data
    const userCount = await User.countDocuments();
    const noteCount = await Note.countDocuments();
    
    console.log(`📈 Database stats:`);
    console.log(`   👥 Users: ${userCount}`);
    console.log(`   📝 Notes: ${noteCount}`);
    
    if (userCount === 0) {
      console.log('💡 Database is empty - ready for first user registration');
    }
    
    console.log('🎉 Database initialization completed successfully!');
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

// Run if called directly
if (require.main === module) {
  initializeDatabase();
}

module.exports = initializeDatabase;
