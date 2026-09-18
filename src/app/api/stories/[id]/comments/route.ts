import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Comment from "@/models/Comment";
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

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();

    const comments = await Comment.find({ story: id, status: "visible", parentComment: null })
      .populate("author", "name image")
      .sort({ createdAt: -1 })
      .lean();

    const commentIds = comments.map((c) => c._id);
    const replies = await Comment.find({ story: id, parentComment: { $in: commentIds } })
      .populate("author", "name image")
      .sort({ createdAt: 1 })
      .lean();

    const commentsWithReplies = comments.map((c) => ({
      ...c,
      replies: replies.filter((r) => r.parentComment?.toString() === c._id.toString()),
    }));

    return NextResponse.json({ comments: commentsWithReplies });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch comments";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    let userId = await getUserId();
    if (!userId) {
      const token = req.cookies.get("token")?.value;
      if (token) {
        const decoded = verifyToken(token);
        if (decoded) userId = decoded.userId;
      }
    }
    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { id } = await params;
    const { content, parentComment } = await req.json();

    if (!content || !content.trim()) {
      return NextResponse.json({ error: "Comment content is required" }, { status: 400 });
    }

    await connectDB();

    const comment = await Comment.create({
      content: content.trim(),
      author: userId,
      story: id,
      parentComment: parentComment || null,
    });

    await Story.findByIdAndUpdate(id, { $inc: { commentsCount: 1 } });

    const populated = await Comment.findById(comment._id).populate("author", "name image").lean();
    return NextResponse.json({ comment: populated });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to create comment";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
