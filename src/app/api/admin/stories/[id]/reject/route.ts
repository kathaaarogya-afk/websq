import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Story from "@/models/Story";

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
    );
    if (!story) {
      return NextResponse.json({ error: "Story not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Story rejected", story });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to reject story";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
