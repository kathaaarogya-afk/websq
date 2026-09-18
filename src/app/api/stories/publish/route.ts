import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Story from "@/models/Story";
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

export async function POST(req: NextRequest) {
  try {
    let userId = await getUserId();

    if (!userId) {
      const token = req.cookies.get("token")?.value;
      if (token) {
        const decoded = verifyToken(token);
        if (decoded) {
          userId = decoded.userId;
        }
      }
    }

    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
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
      author: userId,
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
