import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";
import { connectDB } from "@/lib/mongodb";
import Bookmark from "@/models/Bookmark";
import Story from "@/models/Story";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { id } = await params;
    await connectDB();

    const existing = await Bookmark.findOne({ user: decoded.userId, story: id });
    if (existing) {
      await Bookmark.deleteOne({ _id: existing._id });
      await Story.findByIdAndUpdate(id, { $inc: { bookmarksCount: -1 } });
      return NextResponse.json({ bookmarked: false });
    }

    await Bookmark.create({ user: decoded.userId, story: id });
    await Story.findByIdAndUpdate(id, { $inc: { bookmarksCount: 1 } });
    return NextResponse.json({ bookmarked: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to toggle bookmark";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
