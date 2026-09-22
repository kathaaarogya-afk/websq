import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";
import { connectDB } from "@/lib/mongodb";
import Story from "@/models/Story";
import Streak from "@/models/Streak";

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

    const { title, content, category, excerpt, coverImage, storyId } = await req.json();

    if (!title || !title.trim()) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }
    if (!content || !content.trim()) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }
    if (!category) {
      return NextResponse.json({ error: "Category is required" }, { status: 400 });
    }

    await connectDB();

    const now = new Date();

    if (storyId) {
      const existing = await Story.findOne({ _id: storyId, author: decoded.userId });
      if (!existing) {
        return NextResponse.json({ error: "Story not found" }, { status: 404 });
      }

      existing.title = title.trim();
      existing.content = content.trim();
      existing.category = category;
      existing.excerpt = excerpt || "";
      existing.coverImage = coverImage || "";
      existing.status = "published";
      existing.adminStatus = "approved";
      existing.publishedAt = existing.publishedAt || now;
      existing.approvedAt = now;
      await existing.save();

      return NextResponse.json({
        message: "Story updated",
        story: { id: existing._id, title: existing.title, slug: existing.slug },
      });
    }

    const story = await Story.create({
      title: title.trim(),
      content: content.trim(),
      category,
      excerpt: excerpt || "",
      coverImage: coverImage || "",
      author: decoded.userId,
      status: "published",
      adminStatus: "approved",
      publishedAt: now,
      approvedAt: now,
    });

    // Update streak
    try {
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      let streak = await Streak.findOne({ user: decoded.userId });

      if (!streak) {
        streak = await Streak.create({
          user: decoded.userId,
          lastPublishedDate: today,
          currentStreak: 1,
          longestStreak: 1,
          totalStories: 1,
          badges: ["first_story"],
        });
      } else {
        const lastDate = streak.lastPublishedDate
          ? new Date(streak.lastPublishedDate.getFullYear(), streak.lastPublishedDate.getMonth(), streak.lastPublishedDate.getDate())
          : null;
        const diffDays = lastDate
          ? Math.floor((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24))
          : 999;

        let newStreak = 1;
        if (diffDays === 1) {
          newStreak = streak.currentStreak + 1;
        } else if (diffDays === 0) {
          newStreak = streak.currentStreak;
        }

        const badges = [...(streak.badges || [])];
        const newTotal = streak.totalStories + 1;
        if (newTotal >= 5 && !badges.includes("five_stories")) badges.push("five_stories");
        if (newTotal >= 10 && !badges.includes("ten_stories")) badges.push("ten_stories");
        if (newStreak >= 3 && !badges.includes("streak_3")) badges.push("streak_3");
        if (newStreak >= 7 && !badges.includes("streak_7")) badges.push("streak_7");
        if (newStreak >= 30 && !badges.includes("streak_30")) badges.push("streak_30");

        streak.lastPublishedDate = today;
        streak.currentStreak = newStreak;
        streak.longestStreak = Math.max(streak.longestStreak, newStreak);
        streak.totalStories = newTotal;
        streak.badges = badges;
        await streak.save();
      }
    } catch {
      // streak tracking is non-critical
    }

    return NextResponse.json({
      message: "Story published",
      story: { id: story._id, title: story.title, slug: story.slug },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to publish story";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
