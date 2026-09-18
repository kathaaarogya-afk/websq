import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
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

export async function GET(req: NextRequest) {
  try {
    let userId = await getUserId();

    if (!userId) {
      const token = req.cookies.get("token")?.value;
      if (token) {
        const decoded = verifyToken(token);
        if (decoded) {
          userId = decoded.userId;
        }
      }
    }

    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    await connectDB();

    const stories = await Story.find({ author: userId })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ stories });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch stories";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
