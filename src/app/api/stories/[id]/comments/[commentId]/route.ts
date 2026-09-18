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

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; commentId: string }> }
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

    const { commentId } = await params;
    const { content } = await req.json();

    await connectDB();
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }
    if (comment.author.toString() !== userId) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    comment.content = content.trim();
    await comment.save();

    return NextResponse.json({ message: "Comment updated" });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update comment";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; commentId: string }> }
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

    const { commentId } = await params;
    await connectDB();

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }
    if (comment.author.toString() !== userId) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    await Comment.deleteMany({ parentComment: commentId });
    await Comment.deleteOne({ _id: commentId });
    await Story.findByIdAndUpdate(comment.story, { $inc: { commentsCount: -1 } });

    return NextResponse.json({ message: "Comment deleted" });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to delete comment";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
