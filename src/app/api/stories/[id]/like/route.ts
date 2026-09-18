import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Like from "@/models/Like";
import Story from "@/models/Story";
import User from "@/models/User";
import { verifyToken } from "@/lib/jwt";
import { auth } from "@/lib/auth";

async function getUserId(): Promise<string | null> {
  const session = await auth();
  if (session?.user?.email) {
    await connectDB();
    const user = await User.findOne({ email: session.user.email }).select("_id");
    return user?._id?.toString() || null;
  }
  return null;
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    let userId = await getUserId();
    if (!userId) {
      const token = req.cookies.get("token")?.value;
      if (token) {
        const decoded = verifyToken(token);
        if (decoded) userId = decoded.userId;
      }
    }
    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { id } = await params;
    await connectDB();

    const existing = await Like.findOne({ user: userId, story: id });
    if (existing) {
      await Like.deleteOne({ _id: existing._id });
      await Story.findByIdAndUpdate(id, { $inc: { likesCount: -1 } });
      const story = await Story.findById(id);
      return NextResponse.json({ liked: false, likesCount: story?.likesCount || 0 });
    }

    await Like.create({ user: userId, story: id });
    await Story.findByIdAndUpdate(id, { $inc: { likesCount: 1 } });
    const story = await Story.findById(id);
    return NextResponse.json({ liked: true, likesCount: story?.likesCount || 0 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to toggle like";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
