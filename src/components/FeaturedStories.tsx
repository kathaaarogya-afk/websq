"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { motion } from "framer-motion";

interface Story {
  _id: string;
  slug: string;
  title: string;
  category: string;
  coverImage: string;
  excerpt: string;
  author: { _id: string; name: string };
  createdAt: string;
}

export default function FeaturedStories() {
  const [stories, setStories] = useState<Story[]>([]);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await fetch("/api/stories?limit=3");
        if (res.ok) {
          const data = await res.json();
          setStories(data.stories || []);
        }
      } catch {
        // silent
      }
    };
    fetchFeatured();
  }, []);

  if (stories.length === 0) return null;

  return (
    <section className="py-24 bg-[#FFFDF7]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-yellow-600 font-semibold uppercase tracking-widest">
            Featured
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mt-3">
            Featured Articles
          </h2>
          <p className="text-gray-600 mt-5 max-w-2xl mx-auto">
            Hand-picked guides and stories on web technology, AI and everyday
            life — written to teach, save time and inspire.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stories.map((story, index) => (
            <motion.div
              key={story._id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
            >
              <Link href={`/stories/${story.slug}`}>
                <div className="bg-white rounded-3xl shadow-md overflow-hidden hover:shadow-2xl transition duration-300 group h-full">
                  {story.coverImage && (
                    <div className="overflow-hidden">
                      <img
                        src={story.coverImage}
                        alt={story.title}
                        className="w-full h-64 object-cover group-hover:scale-110 transition duration-500"
                      />
                    </div>
                  )}

                  <div className="p-7">
                    <Link
                      href={`/stories?category=${story.category}`}
                      onClick={(e) => e.stopPropagation()}
                      className="inline-block bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-medium hover:bg-yellow-200 transition"
                    >
                      {story.category}
                    </Link>

                    <h3 className="text-2xl font-bold mt-5 text-gray-900 group-hover:text-yellow-600 transition">
                      {story.title}
                    </h3>

                    <p className="text-gray-500 mt-3">
                      By {story.author?.name || "Unknown"}
                    </p>

                    <div className="flex items-center gap-2 text-gray-500 mt-4">
                      <Clock size={18} />
                      <span>{new Date(story.createdAt).toLocaleDateString()}</span>
                    </div>

                    <div className="inline-flex items-center gap-2 mt-7 text-yellow-600 font-semibold group-hover:gap-3 transition-all">
                      Read Story
                      <ArrowRight size={18} />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
