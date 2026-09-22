import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Newsletter from "@/models/Newsletter";
import Story from "@/models/Story";
import { transporter } from "@/mailer";

const SITE_URL = process.env.AUTH_URL || "https://www.websq.com.au";

interface NewsletterStory {
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  category: string;
}

function newsletterHtml(stories: NewsletterStory[]) {
  const cards = stories
    .map(
      (s) => `
      <a href="${SITE_URL}/stories/${s.slug}" style="display:block;text-decoration:none;margin:0 0 20px;border:1px solid #fde68a;border-radius:14px;overflow:hidden;background:#ffffff;">
        ${
          s.coverImage
            ? `<img src="${s.coverImage}" alt="${s.title}" style="width:100%;height:auto;display:block;" />`
            : ""
        }
        <div style="padding:18px;">
          <span style="display:inline-block;background:#fffbeb;color:#b45309;font-size:12px;font-weight:600;padding:3px 10px;border-radius:999px;margin-bottom:8px;">${s.category}</span>
          <h2 style="margin:0 0 6px;font-size:19px;color:#111827;">${s.title}</h2>
          <p style="margin:0;color:#6b7280;font-size:14px;line-height:1.5;">${s.excerpt}</p>
        </div>
      </a>`
    )
    .join("");

  return `
  <div style="font-family:Arial,Helvetica,sans-serif;background:#FFF9EE;padding:32px;">
    <div style="max-width:600px;margin:auto;background:#ffffff;border-radius:16px;padding:32px;border:1px solid #fde68a;">
      <h1 style="margin:0 0 8px;font-size:26px;color:#111827;">Your favourite stories this week 📖</h1>
      <p style="color:#4b5563;font-size:15px;line-height:1.6;">Here are the latest stories from the <strong>WebSQ</strong> community.</p>
      <hr style="border:none;border-top:1px solid #fde68a;margin:24px 0;" />
      ${cards}
      <hr style="border:none;border-top:1px solid #fde68a;margin:24px 0;" />
      <p style="color:#9ca3af;font-size:12px;margin:0;">No spam, ever. Unsubscribe anytime by replying to this email.</p>
      <p style="color:#9ca3af;font-size:12px;margin:8px 0 0;">WebSQ — Every Story Matters. Every Voice Belongs.</p>
    </div>
  </div>`;
}

async function requireAdmin(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) {
    return {
      ok: false,
      res: NextResponse.json({ error: "Not authenticated" }, { status: 401 }),
    };
  }
  const decoded = verifyToken(token);
  if (!decoded) {
    return {
      ok: false,
      res: NextResponse.json({ error: "Invalid token" }, { status: 401 }),
    };
  }
  await connectDB();
  const user = await User.findById(decoded.userId).select("-password");
  if (!user || user.role !== "admin") {
    return {
      ok: false,
      res: NextResponse.json({ error: "Access denied. Admin only." }, { status: 403 }),
    };
  }
  return { ok: true, res: null };
}

export async function GET(req: NextRequest) {
  try {
    const admin = await requireAdmin(req);
    if (!admin.ok) return admin.res;

    const [subscribers, stories] = await Promise.all([
      Newsletter.countDocuments(),
      Story.find({ status: "published", adminStatus: "approved" })
        .sort({ publishedAt: -1 })
        .limit(6)
        .lean(),
    ]);

    return NextResponse.json({
      subscribers,
      stories: stories.map((s) => ({
        title: s.title,
        slug: s.slug,
        excerpt: (s.excerpt || "").slice(0, 140),
        coverImage: s.coverImage,
        category: s.category,
      })),
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to load newsletter data";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await requireAdmin(req);
    if (!admin.ok) return admin.res;

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      return NextResponse.json(
        { error: "Email is not configured. Set EMAIL_USER and EMAIL_PASS in .env.local." },
        { status: 500 }
      );
    }

    await connectDB();

    const subscribers = await Newsletter.find().select("email").lean();
    if (subscribers.length === 0) {
      return NextResponse.json({ error: "No subscribers yet" }, { status: 400 });
    }

    const stories = await Story.find({ status: "published", adminStatus: "approved" })
      .sort({ publishedAt: -1 })
      .limit(6)
      .lean();

    const html = newsletterHtml(
      stories.map((s) => ({
        title: s.title,
        slug: s.slug,
        excerpt: (s.excerpt || "").slice(0, 140),
        coverImage: s.coverImage,
        category: s.category,
      }))
    );

    const subject = `Your weekly stories from WebSQ`;

    let sent = 0;
    let failed = 0;
    const concurrency = 10;
    for (let i = 0; i < subscribers.length; i += concurrency) {
      const batch = subscribers.slice(i, i + concurrency);
      const results = await Promise.allSettled(
        batch.map((sub) =>
          transporter.sendMail({
            from: `"WebSQ" <${process.env.EMAIL_USER}>`,
            to: sub.email,
            subject,
            html,
          })
        )
      );
      for (const r of results) {
        if (r.status === "fulfilled") sent += 1;
        else failed += 1;
      }
    }

    return NextResponse.json({ sent, failed, total: subscribers.length });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to send newsletter";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}