import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Story from "@/models/Story";
import Notification from "@/models/Notification";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { reason } = await req.json();
    await connectDB();
    const story = await Story.findByIdAndUpdate(
      id,
      { adminStatus: "rejected", rejectionReason: reason || "" },
      { new: true }
    ).select("author title").lean();

    if (!story) {
      return NextResponse.json({ error: "Story not found" }, { status: 404 });
    }

    if (story.author) {
      const msg = reason
        ? `Your story "${story.title}" was not approved. Reason: ${reason}`
        : `Your story "${story.title}" was not approved. Please review and resubmit.`;

      await Notification.create({
        user: story.author,
        type: "story_rejected",
        message: msg,
        link: "/dashboard?tab=drafts",
      });
    }

    return NextResponse.json({ message: "Story rejected", story });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to reject story";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
