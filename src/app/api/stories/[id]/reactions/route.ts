import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";
import { connectDB } from "@/lib/mongodb";
import Reaction from "@/models/Reaction";

function getUserId(req: NextRequest): string | null {
  const token = req.cookies.get("token")?.value;
  if (!token) return null;
  const decoded = verifyToken(token);
  return decoded?.userId || null;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id: storyId } = await params;
    const userId = getUserId(req);

    const reactions = await Reaction.find({ story: storyId })
      .select("type user")
      .lean();

    const counts: Record<string, number> = {
      inspiring: 0,
      helpful: 0,
      love: 0,
      wow: 0,
    };

    let userReaction: string | null = null;

    for (const r of reactions) {
      const type = r.type as string;
      if (counts[type] !== undefined) counts[type]++;
      if (userId && r.user?.toString() === userId) {
        userReaction = type;
      }
    }

    return NextResponse.json({ counts, userReaction });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id: storyId } = await params;
    const userId = getUserId(req);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { type } = await req.json();

    if (!["inspiring", "helpful", "love", "wow"].includes(type)) {
      return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }

    const existing = await Reaction.findOne({
      user: userId,
      story: storyId,
    });

    if (existing) {
      if (existing.type === type) {
        await Reaction.deleteOne({ _id: existing._id });
        return NextResponse.json({ removed: true });
      } else {
        existing.type = type;
        await existing.save();
        return NextResponse.json({ updated: true });
      }
    }

    await Reaction.create({
      user: userId,
      story: storyId,
      type,
    });

    return NextResponse.json({ created: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
