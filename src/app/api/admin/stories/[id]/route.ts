import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Story from "@/models/Story";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();
    const story = await Story.findByIdAndDelete(id);
    if (!story) {
      return NextResponse.json({ error: "Story not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Story deleted" });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to delete story";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
