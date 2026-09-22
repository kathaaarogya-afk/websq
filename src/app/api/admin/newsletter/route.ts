import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Newsletter from "@/models/Newsletter";
import { loadNewsletterStories, sendNewsletter } from "@/lib/newsletter";

async function requireAdmin(
  req: NextRequest
): Promise<{ res: NextResponse } | { ok: true }> {
  const token = req.cookies.get("token")?.value;
  if (!token) {
    return {
      res: NextResponse.json({ error: "Not authenticated" }, { status: 401 }),
    };
  }
  const decoded = verifyToken(token);
  if (!decoded) {
    return {
      res: NextResponse.json({ error: "Invalid token" }, { status: 401 }),
    };
  }
  await connectDB();
  const user = await User.findById(decoded.userId).select("-password");
  if (!user || user.role !== "admin") {
    return {
      res: NextResponse.json({ error: "Access denied. Admin only." }, { status: 403 }),
    };
  }
  return { ok: true };
}

export async function GET(req: NextRequest) {
  try {
    const admin = await requireAdmin(req);
    if ("res" in admin) return admin.res;

    const [subscribers, stories] = await Promise.all([
      Newsletter.countDocuments(),
      loadNewsletterStories(),
    ]);

    return NextResponse.json({ subscribers, stories });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to load newsletter data";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await requireAdmin(req);
    if ("res" in admin) return admin.res;

    const result = await sendNewsletter();
    return NextResponse.json(result);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to send newsletter";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}