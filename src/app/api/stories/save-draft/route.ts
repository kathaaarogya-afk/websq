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

    await connectDB();

    if (storyId) {
      const existing = await Story.findOne({ _id: storyId, author: decoded.userId });
      if (!existing) {
        return NextResponse.json({ error: "Story not found" }, { status: 404 });
      }

      existing.title = title.trim();
      existing.content = content || "";
      existing.category = category || "Life";
      existing.excerpt = excerpt || "";
      existing.coverImage = coverImage || "";
      existing.status = "draft";
      await existing.save();

      return NextResponse.json({
        message: "Draft updated",
        story: { id: existing._id, title: existing.title },
      });
    }

    const story = await Story.create({
      title: title.trim(),
      content: content || "",
      category: category || "Life",
      excerpt: excerpt || "",
      coverImage: coverImage || "",
      author: decoded.userId,
      status: "draft",
      adminStatus: "pending",
    });

    return NextResponse.json({
      message: "Draft saved",
      story: { id: story._id, title: story.title },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to save draft";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
