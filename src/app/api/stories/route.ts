import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Story from "@/models/Story";
import "@/models/User";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const sort = searchParams.get("sort") || "newest";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");

    const filter: Record<string, unknown> = { status: "published", adminStatus: "approved" };

    if (category && category !== "All") {
      filter.category = category;
    }

    if (search) {
      const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      filter.$or = [
        { title: { $regex: escaped, $options: "i" } },
        { excerpt: { $regex: escaped, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;

    let sortOption: Record<string, 1 | -1> = { createdAt: -1 };
    if (sort === "views") sortOption = { views: -1 };
    else if (sort === "likes") sortOption = { likesCount: -1 };
    else if (sort === "oldest") sortOption = { createdAt: 1 };

    const runQuery = () =>
      Promise.all([
        Story.find(filter)
          .populate("author", "name image")
          .sort(sortOption)
          .skip(skip)
          .limit(limit)
          .lean(),
        Story.countDocuments(filter),
      ]);

    let [stories, total]: [unknown[], number] = [ [], 0 ];
    try {
      [stories, total] = await runQuery();
    } catch (firstError) {
      console.error("[/api/stories] first DB attempt failed:", firstError);
      [stories, total] = await runQuery().catch((secondError) => {
        console.error("[/api/stories] retry DB attempt failed:", secondError);
        throw {
          name: "StoryFetchError",
          message:
            (secondError instanceof Error ? secondError.message : "Failed to fetch stories") +
            " (first attempt: " +
            (firstError instanceof Error ? firstError.message : "failed") +
            ")",
        };
      });
    }

    return NextResponse.json({
      stories,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch stories";
    console.error("[/api/stories] error:", error);
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
