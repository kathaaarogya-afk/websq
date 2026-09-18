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

    await connectDB();

    const story = await Story.create({
      title: title.trim(),
      content: content || "",
      category: category || "Life",
      excerpt: excerpt || "",
      coverImage: coverImage || "",
      author: userId,
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
