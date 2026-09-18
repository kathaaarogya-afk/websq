"use client";

import { PenSquare, BookOpen, Users } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: PenSquare,
    title: "Share Your Story",
    description:
      "Write about your life, memories, achievements or experiences. Every story has the power to inspire someone.",
  },
  {
    icon: BookOpen,
    title: "Read & Discover",
    description:
      "Explore stories from people around the world and learn through their experiences.",
  },
  {
    icon: Users,
    title: "Build Community",
    description:
      "Connect people through ideas, emotions and authentic storytelling.",
  },
];

export default function WhyWebSQ() {
  return (
    <section className="py-24 bg-[#FFFDF8]">
      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-16">
          <span className="text-yellow-500 font-semibold uppercase tracking-widest">
            Why Choose Us
          </span>

          <h2 className="mt-4 text-5xl font-bold text-gray-900">
            Why WebSQ?
          </h2>

          <p className="mt-5 text-lg text-gray-600 max-w-3xl mx-auto">
            We believe every person has a unique journey worth sharing.
            Whether you're a student, parent, traveller or professional,
            your experiences can inspire others.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">

          {features.map((item, index) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={index}
                whileHover={{ y: -10 }}
                className="bg-white rounded-3xl shadow-lg p-10 text-center border border-yellow-100"
              >
                <div className="w-20 h-20 rounded-full bg-yellow-100 flex items-center justify-center mx-auto">

                  <Icon className="w-10 h-10 text-yellow-500" />

                </div>

                <h3 className="mt-8 text-2xl font-bold">
                  {item.title}
                </h3>

                <p className="mt-4 text-gray-600 leading-8">
                  {item.description}
                </p>
              </motion.div>
            );
          })}

        </div>

      </div>
    </section>
  );
}
