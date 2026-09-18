"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Heart,
  GraduationCap,
  Plane,
  Laptop,
  Briefcase,
  Stethoscope,
  Lightbulb,
  Home,
} from "lucide-react";

const categories = [
  {
    name: "Life",
    slug: "life",
    description: "Stories about everyday moments, lessons learned, and the beauty of living.",
    image: "/categories/life.jpg",
    icon: Heart,
    color: "#EF4444",
    bg: "from-red-500/80 to-red-600/80",
  },
  {
    name: "Family",
    slug: "family",
    description: "Heartwarming tales of family bonds, traditions, and togetherness.",
    image: "/categories/family.jpg",
    icon: Home,
    color: "#3B82F6",
    bg: "from-blue-500/80 to-blue-600/80",
  },
  {
    name: "Career",
    slug: "career",
    description: "Journeys of professional growth, ambition, and finding your calling.",
    image: "/categories/career.jpg",
    icon: Briefcase,
    color: "#8B5CF6",
    bg: "from-violet-500/80 to-violet-600/80",
  },
  {
    name: "Education",
    slug: "education",
    description: "Insights on learning, teaching, and the pursuit of knowledge.",
    image: "/categories/education.jpg",
    icon: GraduationCap,
    color: "#F97316",
    bg: "from-orange-500/80 to-orange-600/80",
  },
  {
    name: "Technology",
    slug: "technology",
    description: "Exploring the digital world, innovations, and tech-driven change.",
    image: "/categories/technology.jpg",
    icon: Laptop,
    color: "#14B8A6",
    bg: "from-teal-500/80 to-teal-600/80",
  },
  {
    name: "Travel",
    slug: "travel",
    description: "Adventures from around the world and the joy of exploration.",
    image: "/categories/travel.jpg",
    icon: Plane,
    color: "#EAB308",
    bg: "from-yellow-500/80 to-yellow-600/80",
  },
  {
    name: "Health",
    slug: "health",
    description: "Stories of wellness, self-care, and living a balanced life.",
    image: "/categories/health.jpg",
    icon: Stethoscope,
    color: "#22C55E",
    bg: "from-green-500/80 to-green-600/80",
  },
  {
    name: "Inspiration",
    slug: "inspiration",
    description: "Motivating stories that uplift and spark positivity.",
    image: "/categories/inspiration.jpg",
    icon: Lightbulb,
    color: "#EC4899",
    bg: "from-pink-500/80 to-pink-600/80",
  },
];

export default function CategoriesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-orange-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-16">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-bold text-gray-900 mb-4"
          >
            Explore Categories
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-600 text-lg max-w-2xl mx-auto"
          >
            Find stories that match your interests. Dive into the topics you love most.
          </motion.p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, index) => {
            const Icon = cat.icon;
            return (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
              >
                <Link href={`/stories?category=${cat.name}`}>
                  <div className="group relative rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer h-80">
                    {/* Background Image */}
                    <Image
                      src={cat.image}
                      alt={cat.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />

                    {/* Gradient Overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-t ${cat.bg} opacity-70 group-hover:opacity-80 transition-opacity`} />

                    {/* Content */}
                    <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                      <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-1 w-fit mb-3">
                        <Icon className="w-8 h-8" />
                      </div>
                      <h3 className="text-2xl font-bold mb-1">{cat.name}</h3>
                      <p className="text-white/80 text-sm line-clamp-2">{cat.description}</p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
