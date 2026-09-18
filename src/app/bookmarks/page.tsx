"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Bookmark } from "lucide-react";
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

export default function BookmarksPage() {
  const router = useRouter();
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookmarks = useCallback(async () => {
    try {
      const res = await fetch("/api/users/me/bookmarks");
      if (res.ok) {
        const data = await res.json();
        setStories(data.stories || []);
      } else if (res.status === 401) {
        router.push("/login");
      }
    } catch {
      // API not connected yet
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchBookmarks();
  }, [fetchBookmarks]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-orange-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="h-8 bg-gray-200 rounded w-48 mb-8 animate-pulse"></div>
          <div className="grid md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
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
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-orange-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
          <Bookmark className="w-8 h-8 text-yellow-500" />
          My Bookmarks
        </h1>
        <p className="text-gray-600 mb-8">
          Stories you&apos;ve saved for later.
        </p>

        {stories.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 border border-gray-100 text-center">
            <Bookmark className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No bookmarks yet
            </h3>
            <p className="text-gray-500 mb-6">
              Save stories to read them later.
            </p>
            <Link
              href="/stories"
              className="inline-flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-full font-medium transition"
            >
              Browse Stories
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {stories.map((story) => (
              <StoryCard
                key={story._id}
                story={story}
                initialBookmarked={true}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
