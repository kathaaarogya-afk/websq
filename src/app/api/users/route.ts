import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Story from "@/models/Story";

export async function GET() {
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

    return NextResponse.json({ writers });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch writers";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
