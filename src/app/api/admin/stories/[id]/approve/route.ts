import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Story from "@/models/Story";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();
    const story = await Story.findByIdAndUpdate(
      id,
      { adminStatus: "approved", approvedAt: new Date() },
      { new: true }
    );
    if (!story) {
      return NextResponse.json({ error: "Story not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Story approved", story });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to approve story";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
