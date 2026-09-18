import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { signToken } from "@/lib/jwt";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.redirect(new URL("/login?error=session", req.url));
    }

    await connectDB();
    let user = await User.findOne({ email: session.user.email });
    if (!user) {
      user = await User.create({
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
        bio: "",
        role: "user",
        active: true,
      });
    }

    const token = signToken({
      userId: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
    });

    const redirectUrl = req.nextUrl.searchParams.get("redirect") || "/dashboard";
    const response = NextResponse.redirect(new URL(redirectUrl, req.url));

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (error: unknown) {
    console.error("Auth sync error:", error);
    return NextResponse.redirect(new URL("/login?error=sync_failed", req.url));
  }
}
