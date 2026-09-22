"use client";

import { useEffect, useState } from "react";
import { Flame } from "lucide-react";
import { motion } from "framer-motion";

interface StreakData {
  currentStreak: number;
  longestStreak: number;
  totalStories: number;
  badges: string[];
}

const badgeConfig: Record<string, { icon: string; label: string; color: string }> = {
  first_story: { icon: "🎯", label: "First Story", color: "bg-green-100 text-green-700" },
  five_stories: { icon: "📝", label: "5 Stories", color: "bg-blue-100 text-blue-700" },
  ten_stories: { icon: "📚", label: "10 Stories", color: "bg-purple-100 text-purple-700" },
  streak_3: { icon: "🔥", label: "3-Day Streak", color: "bg-orange-100 text-orange-700" },
  streak_7: { icon: "⚡", label: "7-Day Streak", color: "bg-yellow-100 text-yellow-700" },
  streak_30: { icon: "👑", label: "30-Day Streak", color: "bg-red-100 text-red-700" },
  popular: { icon: "🌟", label: "Popular Writer", color: "bg-yellow-100 text-yellow-700" },
};

interface WriterStreakProps {
  userId: string;
}

export default function WriterStreak({ userId }: WriterStreakProps) {
  const [data, setData] = useState<StreakData | null>(null);

  useEffect(() => {
    fetch(`/api/users/${userId}/streak`)
      .then((r) => r.json())
      .then((d) => {
        if (d.currentStreak !== undefined) setData(d);
      })
      .catch(() => {});
  }, [userId]);

  if (!data) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-2xl p-6 border border-orange-100"
    >
      <div className="flex items-center gap-2 mb-4">
        <Flame className="text-orange-500" size={22} />
        <h3 className="font-bold text-gray-900">Writing Streak</h3>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <div className="text-3xl font-bold text-orange-500">
            {data.currentStreak}
          </div>
          <p className="text-xs text-gray-500 mt-1">Current Days</p>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-yellow-500">
            {data.longestStreak}
          </div>
          <p className="text-xs text-gray-500 mt-1">Best Streak</p>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-blue-500">
            {data.totalStories}
          </div>
          <p className="text-xs text-gray-500 mt-1">Total Stories</p>
        </div>
      </div>

      {data.badges.length > 0 && (
        <div>
          <p className="text-xs font-medium text-gray-500 mb-2">Badges Earned</p>
          <div className="flex flex-wrap gap-2">
            {data.badges.map((badge) => {
              const config = badgeConfig[badge];
              if (!config) return null;
              return (
                <span
                  key={badge}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${config.color}`}
                  title={config.label}
                >
                  {config.icon} {config.label}
                </span>
              );
            })}
          </div>
        </div>
      )}
    </motion.div>
  );
}
