import { NextResponse } from "next/server";

export async function GET() {
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
    const { connectDB } = await import("@/lib/mongodb");
    await connectDB();
    mongoStatus = "connected";
  } catch (e: unknown) {
    mongoStatus = e instanceof Error ? e.message : "unknown error";
  }

  return NextResponse.json({ envCheck, mongoStatus });
}
