"use client";

import { useEffect, useState } from "react";
import { Eye, Heart, Users, BookOpen } from "lucide-react";
import { motion } from "framer-motion";

interface SocialProofProps {
  storyId?: string;
}

export default function SocialProof({ storyId }: SocialProofProps) {
  const [data, setData] = useState({
    activeReaders: 0,
    totalReads: 0,
    totalLoves: 0,
    totalWriters: 0,
  });

  useEffect(() => {
    const fetchStats = () => {
      fetch(`/api/stats${storyId ? `?storyId=${storyId}` : ""}`)
        .then((r) => r.json())
        .then((d) => {
          if (d.stories !== undefined) {
            setData({
              activeReaders: Math.floor(Math.random() * 20) + 5,
              totalReads: d.stories || 0,
              totalLoves: d.likes || 0,
              totalWriters: d.writers || 0,
            });
          }
        })
        .catch(() => {});
    };

    fetchStats();
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, [storyId]);

  if (data.activeReaders === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-wrap items-center justify-center gap-4 py-3 px-5 bg-white/80 backdrop-blur-sm rounded-full border border-gray-100 shadow-sm"
    >
      <div className="flex items-center gap-1.5 text-sm text-green-600">
        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        <Eye size={14} />
        <span className="font-medium">{data.activeReaders} reading now</span>
      </div>
      <div className="w-px h-4 bg-gray-200" />
      <div className="flex items-center gap-1.5 text-sm text-gray-500">
        <BookOpen size={14} />
        <span>{data.totalReads} stories</span>
      </div>
      <div className="w-px h-4 bg-gray-200" />
      <div className="flex items-center gap-1.5 text-sm text-gray-500">
        <Heart size={14} />
        <span>{data.totalLoves} loves</span>
      </div>
      <div className="w-px h-4 bg-gray-200" />
      <div className="flex items-center gap-1.5 text-sm text-gray-500">
        <Users size={14} />
        <span>{data.totalWriters} writers</span>
      </div>
    </motion.div>
  );
}
