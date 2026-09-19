import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Follow from "@/models/Follow";
import Notification from "@/models/Notification";

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
    if (decoded.userId === id) {
      return NextResponse.json({ error: "Cannot follow yourself" }, { status: 400 });
    }

    await connectDB();

    const existing = await Follow.findOne({ follower: decoded.userId, following: id });
    if (existing) {
      await Follow.deleteOne({ _id: existing._id });
      await User.findByIdAndUpdate(id, { $inc: { followersCount: -1 } });
      const user = await User.findById(id);
      return NextResponse.json({ following: false, followersCount: user?.followersCount || 0 });
    }

    await Follow.create({ follower: decoded.userId, following: id });
    await User.findByIdAndUpdate(id, { $inc: { followersCount: 1 } });

    const fromUser = await User.findById(decoded.userId).select("name").lean();
    if (fromUser) {
      await Notification.create({
        user: id,
        fromUser: decoded.userId,
        type: "follow",
        message: `${fromUser.name} started following you`,
        link: `/profile/${decoded.userId}`,
      });
    }

    const user = await User.findById(id);
    return NextResponse.json({ following: true, followersCount: user?.followersCount || 0 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to toggle follow";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
