import mongoose from 'mongoose';
import { config } from './src/config/env.js';

async function testDatabaseConnection() {
  console.log('🔗 Testing MongoDB connection...');
  console.log(`📍 Connection URI: ${config.MONGODB_URI}`);
  console.log(`🗄️  Database Name: ${config.DB_NAME}`);

  try {
    // Connect to MongoDB
    await mongoose.connect(config.MONGODB_URI, {
      dbName: config.DB_NAME,
    });

    console.log('✅ Successfully connected to MongoDB!');

    // Get database and collections info
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();

    console.log('\n📋 Available collections:');
    collections.forEach(collection => {
      console.log(`   - ${collection.name}`);
    });

    // Check if movies and users collections exist
    const collectionNames = collections.map(c => c.name);
    const requiredCollections = ['movies', 'users'];

    console.log('\n🔍 Checking required collections:');
    requiredCollections.forEach(collectionName => {
      if (collectionNames.includes(collectionName)) {
        console.log(`   ✅ ${collectionName} collection exists`);
      } else {
        console.log(
          `   ⚠️  ${collectionName} collection not found (will be created automatically)`
        );
      }
    });

    // Test basic operations
    console.log('\n🧪 Testing basic database operations...');

    // Create a test document
    const TestSchema = new mongoose.Schema({
      name: String,
      createdAt: { type: Date, default: Date.now },
    });
    const TestModel = mongoose.model('Test', TestSchema);

    const testDoc = await TestModel.create({ name: 'Connection Test' });
    console.log('   ✅ Write operation successful');

    const foundDoc = await TestModel.findById(testDoc._id);
    console.log('   ✅ Read operation successful');

    await TestModel.deleteOne({ _id: testDoc._id });
    console.log('   ✅ Delete operation successful');

    console.log('\n🎉 Database connection test completed successfully!');
    console.log('\n📝 Your MongoDB setup is ready for the MovieFlix API');
  } catch (error) {
    console.error('\n❌ Database connection failed:');
    console.error(`   Error: ${error.message}`);
    console.error('\n🔧 Troubleshooting tips:');
    console.error(
      '   1. Make sure MongoDB is running: brew services start mongodb/brew/mongodb-community'
    );
    console.error('   2. Check if the database exists: mongosh');
    console.error('   3. Verify the connection URI in your .env file');
    console.error('   4. Ensure no firewall is blocking port 27017');
  } finally {
    // Close the connection
    await mongoose.disconnect();
    console.log('\n🔌 Database connection closed');
    process.exit(0);
  }
}

// Run the test
testDatabaseConnection();
