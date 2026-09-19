import { NextResponse } from "next/server";

export async function GET() {
  try {
    const envCheck = {
      MONGODB_URI: !!process.env.MONGODB_URI,
      JWT_SECRET: !!process.env.JWT_SECRET,
      AUTH_SECRET: !!process.env.AUTH_SECRET,
      AUTH_URL: process.env.AUTH_URL || null,
      GOOGLE_CLIENT_ID: !!process.env.GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET: !!process.env.GOOGLE_CLIENT_SECRET,
      NODE_ENV: process.env.NODE_ENV,
    };

    let mongoStatus = "not tested";
    try {
      const mongoose = await import("mongoose");
      const MONGODB_URI = process.env.MONGODB_URI;
      if (MONGODB_URI) {
        await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
        mongoStatus = "connected";
        await mongoose.disconnect();
      } else {
        mongoStatus = "MONGODB_URI not set";
      }
    } catch (e: unknown) {
      mongoStatus = e instanceof Error ? e.message : "unknown error";
    }

    return NextResponse.json({ envCheck, mongoStatus });
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "unknown" }, { status: 500 });
  }
}
