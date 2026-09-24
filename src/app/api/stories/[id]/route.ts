import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { verifyToken } from "@/lib/jwt";
import Story from "@/models/Story";
import "@/models/User";
import mongoose from "mongoose";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    const isObjectId = mongoose.Types.ObjectId.isValid(id);

    let query: Record<string, unknown>;
    if (isObjectId) {
      query = { $or: [{ slug: id }, { _id: id }] };
    } else {
      query = { slug: id };
    }

    const story = await Story.findOne(query)
      .populate("author", "name image bio followersCount")
      .lean();

    if (!story) {
      return NextResponse.json(
        { error: "Story not found" },
        { status: 404 }
      );
    }

    const token = req.cookies.get("token")?.value;
    const isOwner = token
      ? (() => {
          const decoded = verifyToken(token);
          return decoded && String(story.author._id) === decoded.userId;
        })()
      : false;

    if (!isOwner && story.status !== "published") {
      return NextResponse.json(
        { error: "Story not found" },
        { status: 404 }
      );
    }

    if (!isOwner) {
      await Story.updateOne({ _id: story._id }, { $inc: { views: 1 } });
    }

    return NextResponse.json({ story });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch story";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
