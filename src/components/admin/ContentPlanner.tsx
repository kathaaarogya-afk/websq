"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { ClipboardCheck, Search, Eye, Check } from "lucide-react";

interface PlanStory {
  _id: string;
  title: string;
  slug: string;
  category: string;
  views: number;
  likesCount: number;
  isUpgraded: boolean;
  updatedAt: string;
  author?: { name?: string };
}

type StatusFilter = "all" | "upgraded" | "pending";
type SortFilter = "views" | "updated" | "title";

export default function ContentPlanner() {
  const [stories, setStories] = useState<PlanStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [sort, setSort] = useState<SortFilter>("updated");
  const [toggling, setToggling] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch("/api/admin/content-plan");
        if (!res.ok) throw new Error("failed");
        const data = await res.json();
        if (active) setStories(data.stories || []);
      } catch {
        if (active) setError(true);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(stories.map((s) => s.category)))],
    [stories]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return stories
      .filter((s) => (category === "All" ? true : s.category === category))
      .filter((s) =>
        status === "all"
          ? true
          : status === "upgraded"
            ? s.isUpgraded
            : !s.isUpgraded
      )
      .filter((s) =>
        q ? s.title.toLowerCase().includes(q) || s.slug.includes(q) : true
      )
      .sort((a, b) => {
        if (sort === "views") return b.views - a.views;
        if (sort === "title") return a.title.localeCompare(b.title);
        return (
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
      });
  }, [stories, search, category, status, sort]);

  const upgradedCount = stories.filter((s) => s.isUpgraded).length;
  const progress =
    stories.length > 0 ? Math.round((upgradedCount / stories.length) * 100) : 0;

  const handleToggle = async (story: PlanStory) => {
    setToggling(story._id);
    try {
      const res = await fetch("/api/admin/content-plan", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storyId: story._id,
          upgraded: !story.isUpgraded,
        }),
      });
      if (res.ok) {
        setStories((prev) =>
          prev.map((s) =>
            s._id === story._id
              ? { ...s, isUpgraded: !story.isUpgraded }
              : s
          )
        );
        toast.success(story.isUpgraded ? "Marked as pending" : "Marked as upgraded");
      } else {
        toast.error("Failed to update");
      }
    } catch {
      toast.error("Failed to update");
    } finally {
      setToggling(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-10 text-center">
        <p className="text-gray-500">Could not load the content plan.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress card */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-yellow-100 text-yellow-700 rounded-xl flex items-center justify-center">
              <ClipboardCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Article Upgrade Plan
              </h2>
              <p className="text-sm text-gray-500">
                {upgradedCount} of {stories.length} upgraded ({progress}%) — target 2–3 per day
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-gray-600">
              {stories.length - upgradedCount} remaining
            </span>
          </div>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-yellow-400 to-orange-500 h-3 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search articles..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-300"
          />
        </div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-3 py-2 rounded-xl border border-gray-200 text-sm bg-white"
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as StatusFilter)}
          className="px-3 py-2 rounded-xl border border-gray-200 text-sm bg-white"
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="upgraded">Upgraded</option>
        </select>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortFilter)}
          className="px-3 py-2 rounded-xl border border-gray-200 text-sm bg-white"
        >
          <option value="updated">Recently updated</option>
          <option value="views">Most viewed</option>
          <option value="title">Title A–Z</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b border-gray-100">
                <th className="px-4 py-3 font-medium">Article</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Author</th>
                <th className="px-4 py-3 font-medium text-right">
                  <span className="inline-flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5" /> Views
                  </span>
                </th>
                <th className="px-4 py-3 font-medium text-right">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr
                  key={s._id}
                  className="border-b border-gray-50 hover:bg-yellow-50/40"
                >
                  <td className="px-4 py-3 max-w-[280px]">
                    <Link
                      href={`/stories/${s.slug}`}
                      target="_blank"
                      className="font-medium text-gray-900 hover:text-yellow-600 line-clamp-1"
                    >
                      {s.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 bg-yellow-50 text-yellow-700 text-xs font-medium rounded-full">
                      {s.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {s.author?.name || "—"}
                  </td>
                  <td className="px-4 py-3 text-right text-gray-600">
                    {s.views}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleToggle(s)}
                      disabled={toggling === s._id}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition disabled:opacity-50 ${
                        s.isUpgraded
                          ? "bg-green-100 text-green-700 hover:bg-green-200"
                          : "bg-gray-100 text-gray-600 hover:bg-yellow-100 hover:text-yellow-700"
                      }`}
                    >
                      {s.isUpgraded ? (
                        <>
                          <Check className="w-3.5 h-3.5" /> Upgraded
                        </>
                      ) : (
                        "Upgrade now"
                      )}
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-10 text-center text-gray-400"
                  >
                    No articles match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}