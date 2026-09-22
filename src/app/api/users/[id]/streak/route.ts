import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Streak from "@/models/Streak";
import Story from "@/models/Story";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id: userId } = await params;

    let streak = await Streak.findOne({ user: userId }).lean();

    if (!streak) {
      const totalStories = await Story.countDocuments({
        author: userId,
        status: "published",
        adminStatus: "approved",
      });

      streak = {
        currentStreak: 0,
        longestStreak: 0,
        totalStories,
        badges: totalStories >= 1 ? ["first_story"] : [],
      };
    }

    return NextResponse.json({
      currentStreak: streak.currentStreak,
      longestStreak: streak.longestStreak,
      totalStories: streak.totalStories,
      badges: streak.badges,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
