import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Story from "@/models/Story";
import User from "@/models/User";
import Category from "@/models/Category";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectDB();

    const [storiesCount, writersCount, categoriesCount] = await Promise.all([
      Story.countDocuments({ status: "published", adminStatus: "approved" }),
      User.countDocuments({ role: "user", active: true }),
      Category.countDocuments(),
    ]);

    return NextResponse.json({
      stories: storiesCount,
      writers: writersCount,
      categories: categoriesCount,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch stats";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
