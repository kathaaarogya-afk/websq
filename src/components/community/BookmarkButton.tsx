"use client";

import { useState } from "react";
import { Bookmark } from "lucide-react";

interface BookmarkButtonProps {
  storyId: string;
  initialBookmarked?: boolean;
  onBookmarkChange?: (bookmarked: boolean) => void;
}

export default function BookmarkButton({
  storyId,
  initialBookmarked = false,
  onBookmarkChange,
}: BookmarkButtonProps) {
  const [bookmarked, setBookmarked] = useState(initialBookmarked);
  const [loading, setLoading] = useState(false);

  const handleBookmark = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/stories/${storyId}/bookmark`, {
        method: "POST",
      });

      if (res.ok) {
        const data = await res.json();
        setBookmarked(data.bookmarked);
        onBookmarkChange?.(data.bookmarked);
      }
    } catch {
      // API not connected yet
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleBookmark}
      disabled={loading}
      className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition ${
        bookmarked
          ? "bg-yellow-50 text-yellow-600 hover:bg-yellow-100"
          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
      } disabled:opacity-50`}
    >
      <Bookmark
        className={`w-5 h-5 transition ${bookmarked ? "fill-current" : ""}`}
      />
      <span>{bookmarked ? "Saved" : "Save"}</span>
    </button>
  );
}
