import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";
import { connectDB } from "@/lib/mongodb";
import Like from "@/models/Like";
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

    const existing = await Like.findOne({ user: decoded.userId, story: id });
    if (existing) {
      await Like.deleteOne({ _id: existing._id });
      await Story.findByIdAndUpdate(id, { $inc: { likesCount: -1 } });
      const story = await Story.findById(id);
      return NextResponse.json({ liked: false, likesCount: story?.likesCount || 0 });
    }

    await Like.create({ user: decoded.userId, story: id });
    await Story.findByIdAndUpdate(id, { $inc: { likesCount: 1 } });
    const story = await Story.findById(id);
    return NextResponse.json({ liked: true, likesCount: story?.likesCount || 0 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to toggle like";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
