import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    // Try NextAuth session first (Google login)
    const session = await auth();
    if (session?.user) {
      await connectDB();
      const user = await User.findOne({ email: session.user.email }).select("-password");
      if (user) {
        return NextResponse.json({
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            image: user.image,
            bio: user.bio,
            role: user.role,
          },
        });
      }
    }

    // Fallback to custom JWT token (email/password login)
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    await connectDB();
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        image: user.image,
        bio: user.bio,
        role: user.role,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Something went wrong";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
