"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Users } from "lucide-react";

interface Writer {
  _id: string;
  name: string;
  image: string;
  bio: string;
  storyCount: number;
}

export default function WritersPage() {
  const [writers, setWriters] = useState<Writer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => setWriters(data.writers || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-orange-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Writers</h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Meet the talented storytellers who share their experiences on WebSQ.
          </p>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-3xl overflow-hidden animate-pulse">
                <div className="h-80 bg-gray-200" />
                <div className="p-8 space-y-3">
                  <div className="h-6 bg-gray-200 rounded w-1/2" />
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                </div>
              </div>
            ))}
          </div>
        ) : writers.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 border border-gray-100 text-center">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No writers yet</h3>
            <p className="text-gray-500">Be the first to share your story!</p>
            <Link
              href="/write"
              className="inline-block mt-6 bg-yellow-500 hover:bg-yellow-600 text-white px-8 py-3 rounded-full font-medium transition"
            >
              Start Writing
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {writers.map((writer) => (
              <Link key={writer._id} href={`/profile/${writer._id}`}>
                <div className="bg-[#FFFDF8] rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
                  <div className="h-80 bg-gray-200 overflow-hidden">
                    {writer.image ? (
                      <img
                        src={writer.image}
                        alt={writer.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-yellow-100 text-yellow-600 text-6xl font-bold">
                        {writer.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="p-8">
                    <h3 className="text-2xl font-bold text-gray-900">{writer.name}</h3>
                    <p className="text-gray-500 mt-2 line-clamp-2">
                      {writer.bio || "Storyteller on WebSQ"}
                    </p>
                    <div className="mt-4 text-yellow-600 font-semibold">
                      {writer.storyCount} {writer.storyCount === 1 ? "story" : "stories"}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
