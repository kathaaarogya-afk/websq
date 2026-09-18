"use client";

import { useState } from "react";
import { Heart } from "lucide-react";

interface LikeButtonProps {
  storyId: string;
  initialLiked?: boolean;
  initialCount?: number;
  onLikeChange?: (liked: boolean, count: number) => void;
}

export default function LikeButton({
  storyId,
  initialLiked = false,
  initialCount = 0,
  onLikeChange,
}: LikeButtonProps) {
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);

  const handleLike = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/stories/${storyId}/like`, {
        method: "POST",
      });

      if (res.ok) {
        const data = await res.json();
        setLiked(data.liked);
        setCount(data.likesCount);
        onLikeChange?.(data.liked, data.likesCount);
      }
    } catch {
      // API not connected yet
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLike}
      disabled={loading}
      className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition ${
        liked
          ? "bg-red-50 text-red-600 hover:bg-red-100"
          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
      } disabled:opacity-50`}
    >
      <Heart
        className={`w-5 h-5 transition ${liked ? "fill-current" : ""}`}
      />
      <span>{count}</span>
    </button>
  );
}
