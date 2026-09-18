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

export async function GET(req: NextRequest) {
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

    await connectDB();
    const follows = await Follow.find({ follower: userId })
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
