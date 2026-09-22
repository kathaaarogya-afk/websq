"use client";

import { useState, useEffect, useCallback } from "react";

interface Reaction {
  type: string;
  label: string;
  emoji: string;
}

const reactions: Reaction[] = [
  { type: "inspiring", label: "Inspiring", emoji: "✨" },
  { type: "helpful", label: "Helpful", emoji: "👍" },
  { type: "love", label: "Love", emoji: "❤️" },
  { type: "wow", label: "Wow", emoji: "😮" },
];

interface StoryReactionsProps {
  storyId: string;
}

export default function StoryReactions({ storyId }: StoryReactionsProps) {
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [userReaction, setUserReaction] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  const fetchReactions = useCallback(async () => {
    try {
      const res = await fetch(`/api/stories/${storyId}/reactions`);
      if (res.ok) {
        const data = await res.json();
        setCounts(data.counts || {});
        setUserReaction(data.userReaction || null);
      }
    } catch {
      // fallback
    } finally {
      setLoaded(true);
    }
  }, [storyId]);

  useEffect(() => {
    fetchReactions();
  }, [fetchReactions]);

  const handleReaction = async (type: string) => {
    const wasActive = userReaction === type;

    // Optimistic update
    if (wasActive) {
      setCounts((prev) => ({
        ...prev,
        [type]: Math.max(0, (prev[type] || 1) - 1),
      }));
      setUserReaction(null);
    } else {
      setCounts((prev) => ({
        ...prev,
        [type]: (prev[type] || 0) + 1,
        ...(userReaction ? { [userReaction]: Math.max(0, (prev[userReaction] || 1) - 1) } : {}),
      }));
      setUserReaction(type);
    }

    try {
      await fetch(`/api/stories/${storyId}/reactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type }),
      });
    } catch {
      fetchReactions();
    }
  };

  if (!loaded) return null;

  const totalReactions = Object.values(counts).reduce((a, b) => a + b, 0);

  return (
    <div className="flex flex-col items-center gap-3">
      {totalReactions > 0 && (
        <p className="text-sm text-gray-500">
          {totalReactions} {totalReactions === 1 ? "reaction" : "reactions"}
        </p>
      )}

      <div className="flex items-center gap-2">
        {reactions.map((r) => {
          const isActive = userReaction === r.type;
          const count = counts[r.type] || 0;

          return (
            <button
              key={r.type}
              onClick={() => handleReaction(r.type)}
              className={`group flex items-center gap-1.5 px-3 py-2 rounded-full border transition-all text-sm ${
                isActive
                  ? "bg-yellow-50 border-yellow-300 text-yellow-700 shadow-sm"
                  : "bg-white border-gray-200 text-gray-600 hover:border-yellow-200 hover:bg-yellow-50"
              }`}
              title={r.label}
            >
              <span className="text-base">{r.emoji}</span>
              {count > 0 && (
                <span className="font-medium">{count}</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
