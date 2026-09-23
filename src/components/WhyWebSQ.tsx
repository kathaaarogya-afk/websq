"use client";

import { PenSquare, BookOpen, Bot, Code2, Globe, Shield } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: PenSquare,
    title: "Write & Share",
    description:
      "Publish practical guides, tutorials and breakdowns on web technology, AI and the digital skills shaping tomorrow.",
    color: "bg-yellow-100 text-yellow-600",
  },
  {
    icon: BookOpen,
    title: "Learn Something New",
    description:
      "Hands-on reads on building websites, using AI tools and levelling up — written in plain, everyday language.",
    color: "bg-blue-100 text-blue-600",
  },
  {
    icon: Bot,
    title: "AI Explained",
    description:
      "Clear, beginner-friendly explanations of artificial intelligence. No buzzwords, no jargon — just how it actually works.",
    color: "bg-violet-100 text-violet-600",
  },
  {
    icon: Code2,
    title: "Get Hands-On",
    description:
      "Copy-ready code snippets and step-by-step walkthroughs you can apply to a real project the same day.",
    color: "bg-teal-100 text-teal-600",
  },
  {
    icon: Globe,
    title: "Global Reach",
    description:
      "Technology connects people across borders. Reach readers across Australia and beyond with your knowledge.",
    color: "bg-purple-100 text-purple-600",
  },
  {
    icon: Shield,
    title: "Safe Space",
    description:
      "A moderated community where accuracy, respect and helpfulness come first.",
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
            WebSQ is where everyday people learn, build, and share the
            technology, AI and digital skills shaping our world — from web
            development and search optimisation to online marketing. Whether
            you are a student, developer, marketer, hobbyist or professional —
            your knowledge can help someone else grow.
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
