import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Story from "@/models/Story";
import Follow from "@/models/Follow";
import { verifyToken } from "@/lib/jwt";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();

    const user = await User.findById(id)
      .select("name image bio storiesCount followersCount followingCount createdAt")
      .lean();

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const stories = await Story.find({ author: id, status: "published", adminStatus: "approved" })
      .populate("author", "name image")
      .sort({ createdAt: -1 })
      .lean();

    let isFollowing = false;
    const token = req.cookies.get("token")?.value;
    if (token) {
      const decoded = verifyToken(token);
      if (decoded && decoded.userId !== id) {
        const follow = await Follow.findOne({ follower: decoded.userId, following: id });
        isFollowing = !!follow;
      }
    }

    return NextResponse.json({ user, stories, isFollowing });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch profile";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
