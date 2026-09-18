import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";

interface TestResult {
  mongoUri: string;
  status?: string;
  host?: string;
  database?: string;
  readyState?: number;
  collections?: string[];
  error?: string;
  errorName?: string;
  suggestion?: string;
}

export async function GET() {
  const results: TestResult = {
    mongoUri: process.env.MONGODB_URI ? "Set" : "Missing",
  };

  try {
    if (!process.env.MONGODB_URI) {
      return NextResponse.json(
        { ...results, error: "MONGODB_URI not set" },
        { status: 500 }
      );
    }

    await connectDB();
    const conn = mongoose.connection;
    results.status = "Connected";
    results.host = conn.host;
    results.database = conn.name;
    results.readyState = conn.readyState;

    if (conn.db) {
      const collections = await conn.db.listCollections().toArray();
      results.collections = collections.map((c) => c.name);
    } else {
      results.collections = [];
    }

    return NextResponse.json(results);
  } catch (error: unknown) {
    results.status = "Failed";
    if (error instanceof Error) {
      results.error = error.message;
      results.errorName = error.name;

      if (error.message.includes("ECONNREFUSED")) {
        results.suggestion = "Check if MongoDB Atlas IP whitelist includes your IP";
      } else if (error.message.includes("Authentication failed")) {
        results.suggestion = "Check username and password";
      } else if (error.message.includes("DNS")) {
        results.suggestion = "Check the cluster URL";
      }
    } else {
      results.error = "Unknown error occurred";
    }

    return NextResponse.json(results, { status: 500 });
  }
}
