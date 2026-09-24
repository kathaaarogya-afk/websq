import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Story from "@/models/Story";
import "@/models/User";

export async function GET() {
  try {
    await connectDB();
    const stories = await Story.find()
      .populate("author", "name email")
      .sort({ createdAt: -1 })
      .lean();
    return NextResponse.json({ stories });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch stories";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
