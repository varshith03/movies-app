import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

// Setup test environment
process.env['NODE_ENV'] = 'test';
process.env['JWT_SECRET'] = 'test-jwt-secret-key-for-testing-purposes-only';
process.env['OMDB_API_KEY'] = 'test-api-key';
process.env['MONGODB_URI'] = 'mongodb://localhost:27017/test';

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  // Start in-memory MongoDB instance
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();

  // Connect to the in-memory database
  await mongoose.connect(mongoUri);
});

afterEach(async () => {
  // Clean up database after each test
  const collections = mongoose.connection.collections;

  for (const key in collections) {
    const collection = collections[key];
    if (collection) {
      await collection.deleteMany({});
    }
  }
});

afterAll(async () => {
  // Cleanup
  await mongoose.disconnect();
  await mongoServer.stop();
});

// Increase timeout for tests
jest.setTimeout(30000);
