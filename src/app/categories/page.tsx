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
  Bot,
  Code2,
  UserRound,
  SearchCheck,
  Megaphone,
} from "lucide-react";

const categories = [
  {
    name: "Technology",
    slug: "technology",
    description: "Guides, news and deep dives into everything tech.",
    image: "/categories/technology.jpg",
    icon: Laptop,
    color: "#14B8A6",
    bg: "from-teal-500/80 to-teal-600/80",
  },
  {
    name: "AI",
    slug: "ai",
    description: "Artificial intelligence explained in plain, practical language.",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=600&fit=crop",
    icon: Bot,
    color: "#8B5CF6",
    bg: "from-violet-500/80 to-purple-600/80",
  },
  {
    name: "Web Development",
    slug: "web-development",
    description: "Build websites with tutorials, code and best practices.",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=600&fit=crop",
    icon: Code2,
    color: "#3B82F6",
    bg: "from-blue-500/80 to-indigo-600/80",
  },
  {
    name: "SEO",
    slug: "seo",
    description: "Search engine optimisation — get found on Google, step by step.",
    image: "https://images.unsplash.com/photo-1562577309-4932fdd64cd1?w=800&h=600&fit=crop",
    icon: SearchCheck,
    color: "#10B981",
    bg: "from-emerald-500/80 to-green-600/80",
  },
  {
    name: "Digital Marketing",
    slug: "digital-marketing",
    description: "Practical marketing skills for the internet era.",
    image: "https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=800&h=600&fit=crop",
    icon: Megaphone,
    color: "#F97316",
    bg: "from-orange-500/80 to-amber-600/80",
  },
  {
    name: "Education",
    slug: "education",
    description: "Learning journeys, study tips and skill-building.",
    image: "/categories/education.jpg",
    icon: GraduationCap,
    color: "#F97316",
    bg: "from-orange-500/80 to-orange-600/80",
  },
  {
    name: "Life",
    slug: "life",
    description: "Everyday experiences and personal lessons.",
    image: "/categories/life.jpg",
    icon: Heart,
    color: "#EF4444",
    bg: "from-red-500/80 to-red-600/80",
  },
  {
    name: "Family",
    slug: "family",
    description: "Stories and lessons from family life.",
    image: "/categories/family.jpg",
    icon: Home,
    color: "#3B82F6",
    bg: "from-blue-500/80 to-blue-600/80",
  },
  {
    name: "Career",
    slug: "career",
    description: "Work, growth, resilience and professional know-how.",
    image: "/categories/career.jpg",
    icon: Briefcase,
    color: "#8B5CF6",
    bg: "from-violet-500/80 to-violet-600/80",
  },
  {
    name: "Travel",
    slug: "travel",
    description: "Destinations, adventures and travel wisdom.",
    image: "/categories/travel.jpg",
    icon: Plane,
    color: "#EAB308",
    bg: "from-yellow-500/80 to-yellow-600/80",
  },
  {
    name: "Health",
    slug: "health",
    description: "Physical and mental wellbeing, the practical way.",
    image: "/categories/health.jpg",
    icon: Stethoscope,
    color: "#22C55E",
    bg: "from-green-500/80 to-green-600/80",
  },
  {
    name: "Inspiration",
    slug: "inspiration",
    description: "Ideas and encouragement to keep going.",
    image: "/categories/inspiration.jpg",
    icon: Lightbulb,
    color: "#EC4899",
    bg: "from-pink-500/80 to-pink-600/80",
  },
  {
    name: "Personal",
    slug: "personal",
    description: "Personal reflections, honestly written.",
    image: "/categories/life.jpg",
    icon: UserRound,
    color: "#F59E0B",
    bg: "from-amber-500/80 to-orange-600/80",
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
            Find guides and stories that match your interests — from AI, web
            development, SEO and marketing to everyday experiences.
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
