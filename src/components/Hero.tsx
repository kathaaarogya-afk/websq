"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, PenSquare, BookOpen, Users, Lightbulb } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  { icon: BookOpen, label: "Read Stories" },
  { icon: PenSquare, label: "Write Yours" },
  { icon: Users, label: "Join Community" },
  { icon: Lightbulb, label: "Get Inspired" },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#FFFDF6] via-white to-[#FFF6DA]">
      {/* Decorative blobs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-yellow-200/30 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-200/20 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-yellow-100 text-yellow-700 px-4 py-2 text-sm font-semibold mb-6">
              <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
              Stories &bull; Ideas &bull; Experiences
            </span>

            <h1 className="text-5xl lg:text-7xl font-extrabold leading-[1.1] text-gray-900">
              Every Voice
              <span className="block text-yellow-500">Has a Story</span>
            </h1>

            <p className="mt-6 text-lg lg:text-xl text-gray-600 leading-relaxed max-w-lg">
              Discover inspiring stories, life experiences, and ideas shared by
              people from every walk of life.
            </p>

            {/* Feature pills */}
            <div className="flex flex-wrap gap-3 mt-8">
              {features.map((f) => {
                const Icon = f.icon;
                return (
                  <span
                    key={f.label}
                    className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2 text-sm text-gray-700 shadow-sm"
                  >
                    <Icon size={16} className="text-yellow-500" />
                    {f.label}
                  </span>
                );
              })}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 mt-10">
              <Link
                href="/stories"
                className="inline-flex items-center gap-2 rounded-full bg-yellow-500 hover:bg-yellow-600 px-8 py-4 text-white font-semibold transition-all shadow-lg hover:shadow-xl hover:scale-105"
              >
                Explore Stories
                <ArrowRight size={20} />
              </Link>
              <Link
                href="/write"
                className="inline-flex items-center gap-2 rounded-full border-2 border-yellow-500 px-8 py-4 text-yellow-600 hover:bg-yellow-50 font-semibold transition-all"
              >
                <PenSquare size={20} />
                Share Your Story
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mt-14">
              {[
                { num: "1200+", label: "Stories" },
                { num: "350+", label: "Writers" },
                { num: "8", label: "Categories" },
              ].map((s) => (
                <div key={s.label}>
                  <h3 className="text-3xl font-bold text-yellow-500">{s.num}</h3>
                  <p className="text-gray-500 mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src="/hero.jpg"
                alt="People collaborating and sharing stories"
                width={700}
                height={600}
                priority
                className="w-full h-auto object-cover"
              />
              {/* Overlay card */}
              <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-sm rounded-2xl p-5 shadow-lg">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                    <PenSquare className="text-yellow-600" size={22} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Start Your Journey</p>
                    <p className="text-sm text-gray-500">Write your first story in minutes</p>
                  </div>
                  <Link
                    href="/register"
                    className="ml-auto bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-2 rounded-full text-sm font-medium transition"
                  >
                    Join Free
                  </Link>
                </div>
              </div>
            </div>

            {/* Floating accent */}
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-yellow-400 rounded-2xl rotate-12 opacity-60" />
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-blue-400 rounded-full opacity-40" />
          </motion.div>

        </div>
      </div>
    </section>
  );
}
