import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Story from "@/models/Story";
import Follow from "@/models/Follow";
import { verifyToken } from "@/lib/jwt";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const users = await User.find({ role: "user", active: true })
      .select("name image bio storiesCount followersCount createdAt")
      .sort({ storiesCount: -1 })
      .lean();

    const writers = await Promise.all(
      users.map(async (user) => {
        const storyCount = await Story.countDocuments({
          author: user._id,
          status: "published",
          adminStatus: "approved",
        });
        return { ...user, storyCount };
      })
    );

    let followingIds: string[] = [];
    const token = req.cookies.get("token")?.value;
    if (token) {
      const decoded = verifyToken(token);
      if (decoded) {
        const follows = await Follow.find({ follower: decoded.userId })
          .select("following")
          .lean();
        followingIds = follows.map((f) => f.following.toString());
      }
    }

    return NextResponse.json({ writers, followingIds });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch writers";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
