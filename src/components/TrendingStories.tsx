"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Eye, Heart, MessageCircle, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

interface TrendingStory {
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
}

export default function TrendingStories() {
  const [stories, setStories] = useState<TrendingStory[]>([]);

  useEffect(() => {
    fetch("/api/stories?sort=views&limit=5")
      .then((r) => r.json())
      .then((data) => {
        if (data.stories) setStories(data.stories.slice(0, 5));
      })
      .catch(() => {});
  }, []);

  if (stories.length === 0) return null;

  return (
    <section className="py-20 bg-gradient-to-b from-white to-yellow-50/50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center">
            <TrendingUp className="text-orange-500" size={24} />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Trending Now</h2>
            <p className="text-gray-500">Most read stories this week</p>
          </div>
        </div>

        <div className="space-y-4">
          {stories.map((story, index) => (
            <motion.div
              key={story._id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                href={`/stories/${story.slug}`}
                className="group flex items-center gap-6 p-4 bg-white rounded-2xl border border-gray-100 hover:border-yellow-200 hover:shadow-lg transition-all"
              >
                <span className="text-4xl font-black text-yellow-200 group-hover:text-yellow-400 transition w-12 text-center shrink-0">
                  {String(index + 1).padStart(2, "0")}
                </span>

                {story.coverImage && (
                  <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 hidden sm:block">
                    <img
                      src={story.coverImage}
                      alt={story.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                    />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <span className="text-xs font-medium text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded-full">
                    {story.category}
                  </span>
                  <h3 className="text-lg font-bold text-gray-900 mt-1 group-hover:text-yellow-600 transition truncate">
                    {story.title}
                  </h3>
                  <p className="text-sm text-gray-500 mt-0.5 truncate">
                    by {story.author?.name}
                  </p>
                </div>

                <div className="hidden md:flex items-center gap-5 text-sm text-gray-400 shrink-0">
                  <span className="flex items-center gap-1">
                    <Eye size={14} /> {story.views}
                  </span>
                  <span className="flex items-center gap-1">
                    <Heart size={14} /> {story.likesCount}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle size={14} /> {story.commentsCount}
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/stories"
            className="inline-flex items-center gap-2 text-yellow-600 hover:text-yellow-700 font-semibold"
          >
            View all stories →
          </Link>
        </div>
      </div>
    </section>
  );
}
