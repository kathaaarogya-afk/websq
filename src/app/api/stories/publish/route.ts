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

    const { title, content, category, excerpt, coverImage, storyId } = await req.json();

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

    if (storyId) {
      const existing = await Story.findOne({ _id: storyId, author: decoded.userId });
      if (!existing) {
        return NextResponse.json({ error: "Story not found" }, { status: 404 });
      }

      existing.title = title.trim();
      existing.content = content.trim();
      existing.category = category;
      existing.excerpt = excerpt || "";
      existing.coverImage = coverImage || "";
      existing.status = "published";
      existing.adminStatus = "approved";
      existing.publishedAt = existing.publishedAt || now;
      existing.approvedAt = now;
      await existing.save();

      return NextResponse.json({
        message: "Story updated",
        story: { id: existing._id, title: existing.title, slug: existing.slug },
      });
    }

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
