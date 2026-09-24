import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Story from "@/models/Story";

async function isAdmin(req: NextRequest): Promise<boolean> {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) return false;
    const decoded = verifyToken(token);
    if (!decoded) return false;
    await connectDB();
    const user = await User.findById(decoded.userId).select("role").lean();
    return user?.role === "admin";
  } catch {
    return false;
  }
}

export async function GET(req: NextRequest) {
  try {
    if (!(await isAdmin(req))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const stories = await Story.find({ status: "published" })
      .select(
        "_id title slug category views likesCount isUpgraded updatedAt createdAt"
      )
      .populate("author", "name")
      .sort({ updatedAt: -1 })
      .lean();

    return NextResponse.json({ stories });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch content plan";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    if (!(await isAdmin(req))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { storyId, upgraded } = await req.json();

    if (!storyId) {
      return NextResponse.json(
        { error: "storyId is required" },
        { status: 400 }
      );
    }

    await connectDB();
    await Story.updateOne(
      { _id: storyId },
      { $set: { isUpgraded: Boolean(upgraded) } }
    );

    return NextResponse.json({ ok: true });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to update story";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}