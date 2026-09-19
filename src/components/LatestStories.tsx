"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CalendarDays } from "lucide-react";

interface Story {
  _id: string;
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  coverImage: string;
  createdAt: string;
}

export default function LatestStories() {
  const [stories, setStories] = useState<Story[]>([]);

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const res = await fetch("/api/stories?limit=6");
        if (res.ok) {
          const data = await res.json();
          setStories(data.stories || []);
        }
      } catch {
        // silent
      }
    };
    fetchLatest();
  }, []);

  if (stories.length === 0) return null;

  return (
    <section className="py-24 bg-[#FFFDF7]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold">
            Latest Stories
          </h2>
          <p className="text-gray-600 mt-4">
            Fresh ideas from our community.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stories.map((story) => (
            <Link key={story._id} href={`/stories/${story.slug}`}>
              <div className="bg-white rounded-3xl overflow-hidden shadow hover:shadow-xl transition group h-full">
                {story.coverImage && (
                  <div className="overflow-hidden">
                    <img
                      src={story.coverImage}
                      alt={story.title}
                      className="w-full h-56 object-cover group-hover:scale-110 transition duration-500"
                    />
                  </div>
                )}

                <div className="p-6">
                  <Link
                    href={`/stories?category=${story.category}`}
                    onClick={(e) => e.stopPropagation()}
                    className="text-yellow-600 font-semibold hover:text-yellow-700 transition"
                  >
                    {story.category}
                  </Link>

                  <h3 className="text-xl font-bold mt-3 text-gray-900 group-hover:text-yellow-600 transition">
                    {story.title}
                  </h3>

                  <p className="text-gray-500 mt-3 text-sm">
                    {story.excerpt}
                  </p>

                  <div className="flex items-center gap-2 mt-6 text-gray-400 text-sm">
                    <CalendarDays size={16} />
                    {new Date(story.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
