import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Story from "@/models/Story";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    await connectDB();
    const stories = await Story.find({ author: decoded.userId })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ stories });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch stories";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
