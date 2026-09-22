"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";
import {
  Mail,
  MapPin,
  Send,
  PenSquare,
  ArrowRight,
  Loader2,
  CheckCircle2,
} from "lucide-react";

import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaXTwitter,
} from "react-icons/fa6";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message);
        setSubscribed(true);
        setEmail("");
      } else {
        toast.error(data.error || "Something went wrong");
      }
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <footer className="relative mt-32 bg-[#FFF9EE] border-t border-yellow-200">

      {/* ================= CTA ================= */}

      <div className="max-w-7xl mx-auto px-6">

        <div className="-mt-24 mb-20">

         <div className="relative rounded-[40px] overflow-hidden shadow-2xl">
            
            {/* Background with pattern */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#1E3A5F] via-[#294C74] to-[#3B5F89]" />
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-8 left-8 w-32 h-32 border-2 border-white rounded-full" />
              <div className="absolute bottom-8 right-8 w-48 h-48 border-2 border-white rounded-full" />
              <div className="absolute top-1/2 left-1/3 w-20 h-20 border-2 border-yellow-400 rounded-full" />
            </div>

            <div className="relative grid lg:grid-cols-2 gap-10 items-center p-10 lg:p-16">

              <div>

                <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-white/90 text-sm font-medium mb-6">
                  <PenSquare size={14} />
                  Share Your Voice
                </span>

                <h2 className="text-4xl lg:text-5xl font-bold text-white leading-tight">
                  Ready to Tell
                  <br />
                  <span className="text-yellow-400">Your Story?</span>
                </h2>

                <p className="mt-6 text-white/80 text-lg leading-relaxed max-w-lg">
                  Every experience matters. Someone somewhere is waiting
                  to read the story only you can tell.
                </p>

                <div className="flex flex-wrap items-center gap-4 mt-8">
                  <Link
                    href="/write"
                    className="inline-flex items-center gap-2 rounded-full bg-yellow-500 hover:bg-yellow-400 px-8 py-4 text-white font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                  >
                    <PenSquare size={20} />
                    Start Writing
                    <ArrowRight size={18} />
                  </Link>
                  <Link
                    href="/register"
                    className="inline-flex items-center gap-2 rounded-full border-2 border-white/30 text-white hover:bg-white/10 px-8 py-4 font-medium transition-all"
                  >
                    Join Free
                  </Link>
                </div>

              </div>

              {/* Right side illustration */}
              <div className="hidden lg:flex justify-center">
                <div className="relative">
                  {/* Large quote mark */}
                  <div className="text-[200px] font-bold text-white/10 leading-none select-none">
                    &ldquo;
                  </div>
                  {/* Floating cards */}
                  <div className="absolute top-12 left-8 bg-white/10 backdrop-blur-sm rounded-2xl p-4 w-64 shadow-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-xs font-bold text-gray-900">S</div>
                      <span className="text-white text-sm font-medium">Sarah J.</span>
                    </div>
                    <p className="text-white/70 text-sm italic">&ldquo;Writing here changed how I see my own life.&rdquo;</p>
                  </div>
                  <div className="absolute bottom-8 right-0 bg-white/10 backdrop-blur-sm rounded-2xl p-4 w-56 shadow-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center text-xs font-bold text-white">D</div>
                      <span className="text-white text-sm font-medium">David W.</span>
                    </div>
                    <p className="text-white/70 text-sm italic">&ldquo;Real stories from real people.&rdquo;</p>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* ================= Footer Body ================= */}

      <div className="max-w-7xl mx-auto px-6 pb-20">

        <div className="grid lg:grid-cols-5 gap-14">

          {/* Brand */}

          <div className="lg:col-span-2">

            <div className="flex items-center gap-3">
              <Image
                src="/logo.svg"
                alt="WebSQ"
                width={40}
                height={40}
              />
              <h2 className="text-3xl font-black text-gray-900">
                WebSQ
              </h2>
            </div>

            <p className="mt-3 text-yellow-600 font-semibold text-lg">
              Every Story Matters.
              <br />
              Every Voice Belongs.
            </p>

            <p className="mt-8 text-gray-600 leading-8 max-w-md">
              A storytelling community where
              ordinary people share extraordinary
              experiences, memories, lessons,
              dreams and inspiration.
            </p>

            {/* Newsletter */}

            <div className="mt-10 rounded-3xl bg-white shadow-xl p-8">

              <h3 className="text-2xl font-bold">
                Join Our Newsletter
              </h3>

              <p className="mt-3 text-gray-500">
                Weekly inspiring stories directly
                to your inbox.
              </p>

              {subscribed ? (
                <div className="mt-8 flex items-center gap-3 text-green-600 font-medium">
                  <CheckCircle2 size={22} />
                  You&apos;re subscribed! Check your inbox.
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="mt-8 flex">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email..."
                    required
                    className="flex-1 rounded-l-full border border-yellow-300 px-6 py-4 outline-none focus:ring-2 focus:ring-yellow-400"
                  />

                  <button
                    type="submit"
                    disabled={loading}
                    className="rounded-r-full bg-yellow-500 hover:bg-yellow-600 px-6 text-white disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    {loading ? (
                      <Loader2 className="animate-spin" size={20} />
                    ) : (
                      <Send size={20} />
                    )}
                  </button>
                </form>
              )}

            </div>

          </div>

          {/* Explore */}

          <div>

            <h3 className="font-bold text-xl mb-6">
              Explore
            </h3>

            <ul className="space-y-4 text-gray-600">

              <li><Link href="/">Home</Link></li>

              <li><Link href="/stories">Stories</Link></li>

              <li><Link href="/categories">Discover</Link></li>

              <li><Link href="/daily">Daily ✨</Link></li>

              <li><Link href="/writers">Writers</Link></li>

              <li><Link href="/about">About</Link></li>

              <li><Link href="/contact">Contact</Link></li>

            </ul>

          </div>

          {/* Categories */}

          <div>

            <h3 className="font-bold text-xl mb-6">
              Categories
            </h3>

            <ul className="space-y-4 text-gray-600">

              <li><Link href="/stories?category=Life" className="hover:text-yellow-600 transition">Life</Link></li>

              <li><Link href="/stories?category=Family" className="hover:text-yellow-600 transition">Family</Link></li>

              <li><Link href="/stories?category=Career" className="hover:text-yellow-600 transition">Career</Link></li>

              <li><Link href="/stories?category=Education" className="hover:text-yellow-600 transition">Education</Link></li>

              <li><Link href="/stories?category=Technology" className="hover:text-yellow-600 transition">Technology</Link></li>

              <li><Link href="/stories?category=Travel" className="hover:text-yellow-600 transition">Travel</Link></li>

            </ul>

          </div>

       

          {/* Contact */}

          <div>

            <h3 className="font-bold text-xl mb-6">
              Contact
            </h3>

            <div className="flex flex-wrap items-center gap-6 text-gray-600">

              <div className="flex items-center gap-2">

                <Mail className="text-yellow-500" />

                hello@websq.com.au

              </div>

              <div className="flex items-center gap-2">

                <MapPin className="text-yellow-500" />

                Australia

              </div>

            </div>

            <div className="flex gap-4 mt-6">

              <a className="w-11 h-11 rounded-full bg-white shadow flex items-center justify-center hover:bg-yellow-500 hover:text-white transition">
                <FaFacebookF />
              </a>

              <a className="w-11 h-11 rounded-full bg-white shadow flex items-center justify-center hover:bg-yellow-500 hover:text-white transition">
                <FaInstagram />
              </a>

              <a className="w-11 h-11 rounded-full bg-white shadow flex items-center justify-center hover:bg-yellow-500 hover:text-white transition">
                <FaXTwitter />
              </a>

              <a className="w-11 h-11 rounded-full bg-white shadow flex items-center justify-center hover:bg-yellow-500 hover:text-white transition">
                <FaLinkedinIn />
              </a>

            </div>

          </div>

        </div>

      </div>
    {/* ================= Bottom ================= */}

<div className="border-t border-yellow-200 bg-[#FFF7E6]">

  <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col items-center gap-4">

    <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-gray-400">
      <Link href="/community-guidelines" className="hover:text-yellow-600 transition">Community Guidelines</Link>
      <span>&middot;</span>
      <Link href="/terms" className="hover:text-yellow-600 transition">Terms</Link>
      <span>&middot;</span>
      <Link href="/privacy" className="hover:text-yellow-600 transition">Privacy</Link>
      <span>&middot;</span>
      <Link href="/cookie-policy" className="hover:text-yellow-600 transition">Cookies</Link>
      <span>&middot;</span>
      <Link href="/copyright" className="hover:text-yellow-600 transition">Copyright</Link>
      <span>&middot;</span>
      <Link href="/acceptable-use" className="hover:text-yellow-600 transition">Acceptable Use</Link>
      <span>&middot;</span>
      <Link href="/report-content" className="hover:text-yellow-600 transition">Report</Link>
    </div>

    <div className="flex flex-col lg:flex-row items-center justify-between w-full gap-3">

    <p className="text-gray-500 text-sm">

      &copy; {new Date().getFullYear()} WebSQ.
      All Rights Reserved.

    </p>

    <p className="font-semibold text-yellow-700 text-sm text-center">

      Made with &#10084;&#65039; for storytellers around the world.

    </p>

  </div>

  </div>

</div>


    </footer>
  );
}