import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Follow from "@/models/Follow";
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
    if (userId === id) {
      return NextResponse.json({ error: "Cannot follow yourself" }, { status: 400 });
    }

    await connectDB();

    const existing = await Follow.findOne({ follower: userId, following: id });
    if (existing) {
      await Follow.deleteOne({ _id: existing._id });
      await User.findByIdAndUpdate(id, { $inc: { followersCount: -1 } });
      return NextResponse.json({ following: false, followersCount: (await User.findById(id))?.followersCount || 0 });
    }

    await Follow.create({ follower: userId, following: id });
    await User.findByIdAndUpdate(id, { $inc: { followersCount: 1 } });
    return NextResponse.json({ following: true, followersCount: (await User.findById(id))?.followersCount || 0 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to toggle follow";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
