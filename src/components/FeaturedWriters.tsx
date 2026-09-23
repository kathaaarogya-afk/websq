"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

interface Writer {
  _id: string;
  name: string;
  image: string;
  bio: string;
  storyCount: number;
  followersCount: number;
}

export default function FeaturedWriters() {
  const [writers, setWriters] = useState<Writer[]>([]);

  useEffect(() => {
    const fetchWriters = async () => {
      try {
        const res = await fetch("/api/users");
        if (res.ok) {
          const data = await res.json();
          setWriters((data.writers || []).slice(0, 3));
        }
      } catch {
        // silent
      }
    };
    fetchWriters();
  }, []);

  if (writers.length === 0) return null;

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-yellow-500 font-semibold uppercase tracking-widest">
            Community
          </span>
          <h2 className="mt-4 text-5xl font-bold">
            Featured Writers
          </h2>
          <p className="mt-5 text-lg text-gray-600">
            Meet our community sharing tech, AI and web knowledge.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-10">
          {writers.map((writer) => (
            <motion.div
              key={writer._id}
              whileHover={{ y: -8 }}
            >
              <Link href={`/profile/${writer._id}`}>
                <div className="bg-[#FFFDF8] rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition duration-300 group h-full">
                  <div className="overflow-hidden">
                    {writer.image ? (
                      <img
                        src={writer.image}
                        alt={writer.name}
                        className="w-full h-80 object-cover group-hover:scale-105 transition duration-500"
                      />
                    ) : (
                      <div className="w-full h-80 bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-6xl font-bold text-white">
                        {writer.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>

                  <div className="p-8">
                    <h3 className="text-2xl font-bold group-hover:text-yellow-600 transition">
                      {writer.name}
                    </h3>

                    <p className="text-yellow-500 mt-2">
                      {writer.bio || "Writer"}
                    </p>

                    <div className="mt-6 flex justify-between items-center">
                      <div>
                        <h4 className="text-3xl font-bold text-gray-900">
                          {writer.storyCount}
                        </h4>
                        <p className="text-gray-500">Stories</p>
                      </div>

                      <span className="bg-yellow-500 text-white px-6 py-3 rounded-full font-semibold transition group-hover:bg-yellow-600">
                        View Stories
                      </span>
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
