import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Story from "@/models/Story";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    const story = await Story.findOne({
      $or: [{ slug: id }, { _id: id }],
      status: "published",
    })
      .populate("author", "name image bio followersCount")
      .lean();

    if (!story) {
      return NextResponse.json(
        { error: "Story not found" },
        { status: 404 }
      );
    }

    await Story.updateOne({ _id: story._id }, { $inc: { views: 1 } });

    return NextResponse.json({ story });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch story";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
