import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";
import { connectDB } from "@/lib/mongodb";
import Report from "@/models/Report";

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { targetType, targetId, reason, details } = await req.json();

    if (!targetType || !targetId || !reason) {
      return NextResponse.json(
        { error: "targetType, targetId, and reason are required" },
        { status: 400 }
      );
    }

    if (!["story", "user", "image"].includes(targetType)) {
      return NextResponse.json(
        { error: "Invalid targetType" },
        { status: 400 }
      );
    }

    await connectDB();

    const existing = await Report.findOne({
      reporter: decoded.userId,
      targetType,
      targetId,
    });

    if (existing) {
      return NextResponse.json(
        { error: "You have already reported this" },
        { status: 409 }
      );
    }

    await Report.create({
      reporter: decoded.userId,
      targetType,
      targetId,
      reason,
      details: details || "",
    });

    return NextResponse.json({ message: "Report submitted. Thank you for helping keep our community safe." });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to submit report";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
