import mongoose from 'mongoose';
import { config } from './src/config/env.js';

async function setupDatabase() {
  console.log('🚀 Setting up MovieFlix database...');

  try {
    // Connect to MongoDB
    await mongoose.connect(config.MONGODB_URI, {
      dbName: config.DB_NAME,
    });

    console.log('✅ Connected to MongoDB');

    const db = mongoose.connection.db;

    // Create Movies collection with indexes
    console.log('\n📽️  Setting up Movies collection...');

    const moviesCollection = db.collection('movies');

    // Create indexes for movies collection
    await moviesCollection.createIndex({ id: 1 }, { unique: true });
    console.log('   ✅ Created unique index on movie ID');

    await moviesCollection.createIndex({ title: 'text', plot: 'text' });
    console.log('   ✅ Created text search index on title and plot');

    await moviesCollection.createIndex({ genre: 1, rating: -1 });
    console.log('   ✅ Created compound index on genre and rating');

    await moviesCollection.createIndex({ year: -1, rating: -1 });
    console.log('   ✅ Created compound index on year and rating');

    await moviesCollection.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
    console.log('   ✅ Created TTL index for automatic cache expiration');

    // Create Users collection with indexes
    console.log('\n👥 Setting up Users collection...');

    const usersCollection = db.collection('users');

    await usersCollection.createIndex({ email: 1 }, { unique: true });
    console.log('   ✅ Created unique index on user email');

    // Display collection stats
    console.log('\n📊 Database Statistics:');

    const movieStats = await moviesCollection.stats().catch(() => ({ count: 0 }));
    console.log(`   Movies: ${movieStats.count || 0} documents`);

    const userStats = await usersCollection.stats().catch(() => ({ count: 0 }));
    console.log(`   Users: ${userStats.count || 0} documents`);

    console.log('\n🎉 Database setup completed successfully!');
    console.log('\n📋 Created Collections:');
    console.log('   - movies (with optimized indexes for search, filtering, and caching)');
    console.log('   - users (with unique email constraint)');

    console.log('\n🔍 Indexes Created:');
    console.log('   Movies:');
    console.log('     • Unique index on id (movie identification)');
    console.log('     • Text search index on title and plot (full-text search)');
    console.log('     • Compound index on genre + rating (filtered sorting)');
    console.log('     • Compound index on year + rating (temporal sorting)');
    console.log('     • TTL index on expiresAt (automatic cache cleanup)');
    console.log('   Users:');
    console.log('     • Unique index on email (prevent duplicate accounts)');
  } catch (error) {
    console.error('\n❌ Database setup failed:', error.message);

    if (error.code === 11000) {
      console.error('   This appears to be a duplicate key error. The indexes may already exist.');
    }
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Database connection closed');
    process.exit(0);
  }
}

// Run the setup
setupDatabase();
