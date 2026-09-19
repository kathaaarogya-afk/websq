"use client";

import { useState } from "react";
import { UserPlus, UserMinus, Loader2 } from "lucide-react";

interface FollowButtonProps {
  userId: string;
  initialFollowing?: boolean;
  initialFollowerCount?: number;
  onFollowChange?: (following: boolean, count: number) => void;
  size?: "sm" | "md";
}

export default function FollowButton({
  userId,
  initialFollowing = false,
  initialFollowerCount = 0,
  onFollowChange,
  size = "md",
}: FollowButtonProps) {
  const [following, setFollowing] = useState(initialFollowing);
  const [, setFollowerCount] = useState(initialFollowerCount);
  const [loading, setLoading] = useState(false);

  const handleFollow = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/users/${userId}/follow`, {
        method: "POST",
      });

      if (res.ok) {
        const data = await res.json();
        setFollowing(data.following);
        setFollowerCount(data.followersCount);
        onFollowChange?.(data.following, data.followersCount);
      }
    } catch {
      // API not connected yet
    } finally {
      setLoading(false);
    }
  };

  const isSmall = size === "sm";

  return (
    <button
      onClick={handleFollow}
      disabled={loading}
      className={`inline-flex items-center gap-2 font-medium rounded-full transition disabled:opacity-50 ${
        isSmall ? "px-3 py-1.5 text-sm" : "px-5 py-2.5"
      } ${
        following
          ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
          : "bg-yellow-500 text-white hover:bg-yellow-600"
      }`}
    >
      {loading ? (
        <Loader2 className={`${isSmall ? "w-4 h-4" : "w-5 h-5"} animate-spin`} />
      ) : following ? (
        <UserMinus className={`${isSmall ? "w-4 h-4" : "w-5 h-5"}`} />
      ) : (
        <UserPlus className={`${isSmall ? "w-4 h-4" : "w-5 h-5"}`} />
      )}
      {loading ? "" : following ? "Unfollow" : "Follow"}
    </button>
  );
}
