import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";
import { connectDB } from "@/lib/mongodb";
import Follow from "@/models/Follow";

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
    const follows = await Follow.find({ follower: decoded.userId })
      .populate("following", "name image bio storiesCount followersCount")
      .sort({ createdAt: -1 })
      .lean();

    const following = follows.map((f) => f.following).filter(Boolean);
    return NextResponse.json({ following });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch following";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
