import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Comment from "@/models/Comment";
import "@/models/User";
import "@/models/Story";

export async function GET() {
  try {
    await connectDB();
    const comments = await Comment.find()
      .populate("author", "name email")
      .populate("story", "title")
      .sort({ createdAt: -1 })
      .lean();
    return NextResponse.json({ comments });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch comments";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
