"use client";

import { Suspense, useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Search, Filter } from "lucide-react";
import StoryCard from "@/components/community/StoryCard";

interface Story {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  coverImage: string;
  likesCount: number;
  commentsCount: number;
  views: number;
  author: { _id: string; name: string; image: string };
  createdAt: string;
}

const categories = [
  "All",
  "Life",
  "Family",
  "Career",
  "Education",
  "Technology",
  "Travel",
  "Health",
  "Inspiration",
];

function StoriesContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "All";
  const initialSearch = searchParams.get("search") || "";

  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState(initialCategory);

  useEffect(() => {
    setSearch(searchParams.get("search") || "");
    setCategory(searchParams.get("category") || "All");
  }, [searchParams]);

  const fetchStories = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (category !== "All") params.set("category", category);
      if (search) params.set("search", search);

      const res = await fetch(`/api/stories?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setStories(data.stories || []);
      }
    } catch {
      // API not connected yet
    } finally {
      setLoading(false);
    }
  }, [category, search]);

  useEffect(() => {
    fetchStories();
  }, [fetchStories]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchStories();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-orange-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {category !== "All" ? `${category} Stories` : "Stories"}
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            {category !== "All"
              ? `Explore stories in the ${category} category.`
              : "Discover inspiring stories from our community of writers."}
          </p>
        </div>

        {/* Search & Filters */}
        <div className="mb-8 space-y-4">
          <form onSubmit={handleSearch} className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search stories..."
                className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-200 focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-full font-medium transition"
            >
              Search
            </button>
          </form>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                  category === cat
                    ? "bg-yellow-500 text-white"
                    : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Stories Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse"
              >
                <div className="h-48 bg-gray-200"></div>
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : stories.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 border border-gray-100 text-center">
            <Filter className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No stories found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search or filters.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stories.map((story) => (
              <StoryCard key={story._id} story={story} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function StoriesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-orange-50 py-8 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse"
                >
                  <div className="h-48 bg-gray-200"></div>
                  <div className="p-5 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                    <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      }
    >
      <StoriesContent />
    </Suspense>
  );
}
