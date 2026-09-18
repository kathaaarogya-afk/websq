import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";
import { connectDB } from "@/lib/mongodb";
import Bookmark from "@/models/Bookmark";
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
    const bookmarks = await Bookmark.find({ user: decoded.userId })
      .populate({ path: "story", populate: { path: "author", select: "name image" } })
      .sort({ createdAt: -1 })
      .lean();

    const stories = bookmarks.map((b) => b.story).filter(Boolean);
    return NextResponse.json({ stories });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch bookmarks";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
