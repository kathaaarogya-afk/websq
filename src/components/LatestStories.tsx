"use client";

import Image from "next/image";
import Link from "next/link";
import { CalendarDays } from "lucide-react";

const stories = [
  {
    slug: "the-day-i-learned-to-let-go",
    title: "Finding Peace in Simple Moments",
    category: "Life",
    excerpt: "How slowing down taught me to appreciate the little things that make life beautiful.",
    date: "Aug 2026",
    image: "/categories/life.jpg",
  },
  {
    slug: "solo-travel-changed-who-i-am",
    title: "My Journey Across Southeast Asia",
    category: "Travel",
    excerpt: "Three months, five countries, and countless memories that changed my perspective.",
    date: "Aug 2026",
    image: "/categories/travel.jpg",
  },
  {
    slug: "how-ai-changed-my-daily-routine",
    title: "Building Tech That Matters",
    category: "Technology",
    excerpt: "From coding basics to creating solutions that impact real lives in my community.",
    date: "Jul 2026",
    image: "/categories/technology.jpg",
  },
  {
    slug: "how-walking-10000-steps-changed-my-health",
    title: "The Art of Healthy Living",
    category: "Health",
    excerpt: "Small daily habits that transformed my physical and mental well-being over time.",
    date: "Jul 2026",
    image: "/categories/health.jpg",
  },
  {
    slug: "cooking-with-grandma-recipes-and-memories",
    title: "Lessons From My Grandparents",
    category: "Family",
    excerpt: "Wisdom passed down through generations that still guides my decisions today.",
    date: "Jun 2026",
    image: "/categories/family.jpg",
  },
  {
    slug: "the-domino-effect-of-one-small-act",
    title: "Chasing Dreams Beyond Comfort",
    category: "Inspiration",
    excerpt: "Why stepping outside your comfort zone is the only way to truly grow.",
    date: "Jun 2026",
    image: "/categories/inspiration.jpg",
  },
];

export default function LatestStories() {
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
            <Link key={story.slug} href={`/stories/${story.slug}`}>
              <div className="bg-white rounded-3xl overflow-hidden shadow hover:shadow-xl transition group h-full">
                <div className="overflow-hidden">
                  <Image
                    src={story.image}
                    alt={story.title}
                    width={500}
                    height={300}
                    className="w-full h-56 object-cover group-hover:scale-110 transition duration-500"
                  />
                </div>

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
                    {story.date}
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
