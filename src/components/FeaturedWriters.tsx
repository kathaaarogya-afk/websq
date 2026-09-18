"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const writers = [
  {
    name: "Sarah Johnson",
    role: "Travel",
    stories: 120,
    image: "/writers/writer1.jpg",
  },
  {
    name: "David Wilson",
    role: "Technology",
    stories: 84,
    image: "/writers/writer2.jpg",
  },
  {
    name: "Emily Brown",
    role: "Education",
    stories: 67,
    image: "/writers/writer3.jpg",
  },
];

export default function FeaturedWriters() {
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
            Meet some amazing storytellers from our community.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-10">
          {writers.map((writer, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -8 }}
            >
              <Link href={`/stories?category=${writer.role}`}>
                <div className="bg-[#FFFDF8] rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition duration-300 group h-full">
                  <div className="overflow-hidden">
                    <Image
                      src={writer.image}
                      alt={writer.name}
                      width={400}
                      height={400}
                      className="w-full h-80 object-cover group-hover:scale-105 transition duration-500"
                    />
                  </div>

                  <div className="p-8">
                    <h3 className="text-2xl font-bold group-hover:text-yellow-600 transition">
                      {writer.name}
                    </h3>

                    <p className="text-yellow-500 mt-2">
                      {writer.role} Writer
                    </p>

                    <div className="mt-6 flex justify-between items-center">
                      <div>
                        <h4 className="text-3xl font-bold text-gray-900">
                          {writer.stories}
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
