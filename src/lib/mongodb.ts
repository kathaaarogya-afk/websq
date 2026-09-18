import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

const MONGODB_URI_DEFINED: string = MONGODB_URI;

let cached = (global as Record<string, unknown>).mongoose as {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
} | undefined;

if (!cached) {
  cached = ((global as Record<string, unknown>).mongoose = {
    conn: null,
    promise: null,
  }) as {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
}

export async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI_DEFINED).catch((err) => {
      cached.promise = null;
      throw err;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}