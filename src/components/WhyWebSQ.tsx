"use client";

import { PenSquare, BookOpen, Users, Heart, Globe, Shield } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: PenSquare,
    title: "Share Your Story",
    description:
      "Write about your life, memories, achievements or experiences. Every story has the power to inspire someone.",
    color: "bg-yellow-100 text-yellow-600",
  },
  {
    icon: BookOpen,
    title: "Read & Discover",
    description:
      "Explore stories from people around the world and learn through their experiences.",
    color: "bg-blue-100 text-blue-600",
  },
  {
    icon: Users,
    title: "Build Community",
    description:
      "Connect people through ideas, emotions and authentic storytelling.",
    color: "bg-green-100 text-green-600",
  },
  {
    icon: Heart,
    title: "Inspire Others",
    description:
      "Your journey could be exactly what someone else needs to hear today.",
    color: "bg-pink-100 text-pink-600",
  },
  {
    icon: Globe,
    title: "Global Reach",
    description:
      "Stories transcend borders. Reach readers across Australia and beyond.",
    color: "bg-purple-100 text-purple-600",
  },
  {
    icon: Shield,
    title: "Safe Space",
    description:
      "A moderated community where respect and authenticity come first.",
    color: "bg-orange-100 text-orange-600",
  },
];

export default function WhyWebSQ() {
  return (
    <section className="py-24 bg-[#FFFDF8]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-yellow-500 font-semibold uppercase tracking-widest text-sm">
            Why Choose Us
          </span>
          <h2 className="mt-4 text-4xl md:text-5xl font-bold text-gray-900">
            Why <span className="text-yellow-500">WebSQ</span>?
          </h2>
          <p className="mt-5 text-lg text-gray-600 max-w-3xl mx-auto text-balance">
            We believe every person has a unique journey worth sharing.
            Whether you&apos;re a student, parent, traveller or professional,
            your experiences can inspire others.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="bg-white rounded-3xl shadow-lg p-8 border border-yellow-100/50 hover:shadow-xl transition-shadow"
              >
                <div
                  className={`w-14 h-14 rounded-2xl ${item.color} flex items-center justify-center`}
                >
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="mt-6 text-xl font-bold text-gray-900">
                  {item.title}
                </h3>
                <p className="mt-3 text-gray-600 leading-relaxed">
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
