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
  { name: "Technology", icon: Laptop, image: "/categories/technology.jpg", bg: "from-teal-500/80 to-teal-600/80" },
  { name: "AI", icon: Bot, image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=600&fit=crop", bg: "from-violet-500/80 to-purple-600/80" },
  { name: "Web Development", icon: Code2, image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=600&fit=crop", bg: "from-blue-500/80 to-indigo-600/80" },
  { name: "SEO", icon: SearchCheck, image: "https://images.unsplash.com/photo-1562577309-4932fdd64cd1?w=800&h=600&fit=crop", bg: "from-emerald-500/80 to-green-600/80" },
  { name: "Digital Marketing", icon: Megaphone, image: "https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=800&h=600&fit=crop", bg: "from-orange-500/80 to-amber-600/80" },
  { name: "Education", icon: GraduationCap, image: "/categories/education.jpg", bg: "from-orange-500/80 to-orange-600/80" },
  { name: "Life", icon: Heart, image: "/categories/life.jpg", bg: "from-red-500/80 to-red-600/80" },
  { name: "Travel", icon: Plane, image: "/categories/travel.jpg", bg: "from-yellow-500/80 to-yellow-600/80" },
  { name: "Career", icon: Briefcase, image: "/categories/career.jpg", bg: "from-violet-500/80 to-violet-600/80" },
  { name: "Family", icon: Home, image: "/categories/family.jpg", bg: "from-blue-500/80 to-blue-600/80" },
  { name: "Health", icon: Stethoscope, image: "/categories/health.jpg", bg: "from-green-500/80 to-green-600/80" },
  { name: "Inspiration", icon: Lightbulb, image: "/categories/inspiration.jpg", bg: "from-pink-500/80 to-pink-600/80" },
  { name: "Personal", icon: UserRound, image: "/categories/life.jpg", bg: "from-amber-500/80 to-orange-600/80" },
];

export default function Categories() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold">
            Browse Categories
          </h2>
          <p className="text-gray-600 mt-4">
            Explore stories, guides and tutorials by topic.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((cat, index) => {
            const Icon = cat.icon;
            return (
              <Link key={cat.name} href={`/stories?category=${cat.name}`}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.06 }}
                  whileHover={{ y: -10 }}
                  className="group relative rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer h-56"
                >
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${cat.bg} opacity-70 group-hover:opacity-80 transition-opacity`} />
                  <div className="absolute inset-0 flex flex-col items-center justify-end p-6 text-white">
                    <Icon className="w-10 h-10 mb-2" />
                    <h3 className="text-xl font-bold">{cat.name}</h3>
                  </div>
                </motion.div>
              </Link>
            );
          })}
        </div>

      </div>
    </section>
  );
}
