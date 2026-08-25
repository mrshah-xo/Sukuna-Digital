import mongoose from 'mongoose';
import connectDB from '@/lib/mongodb';

/**
 * Connects Mongoose to the shared in-memory MongoDB instance that
 * globalSetup already started (its URI is in process.env.MONGODB_URI).
 * Reuses the app's own connectDB() so tests exercise the exact same
 * connection path/caching the real routes use — not a parallel one.
 */
export async function connectTestDb(): Promise<void> {
  await connectDB();
}

/** Deletes all documents from every collection between tests, without dropping the DB/connection. */
export async function clearTestDb(): Promise<void> {
  const { collections } = mongoose.connection;
  await Promise.all(Object.values(collections).map((collection) => collection.deleteMany({})));
}
