import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";
import { connectDB } from "@/lib/mongodb";
import Story from "@/models/Story";

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { title, content, category, excerpt, coverImage } = await req.json();

    if (!title || !title.trim()) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }
    if (!content || !content.trim()) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }
    if (!category) {
      return NextResponse.json({ error: "Category is required" }, { status: 400 });
    }

    await connectDB();

    const now = new Date();
    const story = await Story.create({
      title: title.trim(),
      content: content.trim(),
      category,
      excerpt: excerpt || "",
      coverImage: coverImage || "",
      author: decoded.userId,
      status: "published",
      adminStatus: "approved",
      publishedAt: now,
      approvedAt: now,
    });

    return NextResponse.json({
      message: "Story published",
      story: { id: story._id, title: story.title, slug: story.slug },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to publish story";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
