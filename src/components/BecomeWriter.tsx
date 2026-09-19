"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PenSquare } from "lucide-react";

interface Writer {
  _id: string;
  name: string;
  image: string;
}

export default function BecomeWriter() {
  const [writers, setWriters] = useState<Writer[]>([]);

  useEffect(() => {
    const fetchWriters = async () => {
      try {
        const res = await fetch("/api/users");
        if (res.ok) {
          const data = await res.json();
          setWriters((data.writers || []).slice(0, 5));
        }
      } catch {
        // silent
      }
    };
    fetchWriters();
  }, []);

  return (
    <section className="py-24">
      <div className="max-w-6xl mx-auto px-6">
        <div className="bg-gradient-to-r from-[#FFFDF8] via-[#FFF7E6] to-[#FDECC8] rounded-[40px] p-16 text-center border border-yellow-200 shadow-2xl">

          {/* Previous Writers */}
          {writers.length > 0 && (
            <div className="flex items-center justify-center -space-x-4 mb-8">
              {writers.map((writer) => (
                <Link
                  key={writer._id}
                  href={`/profile/${writer._id}`}
                  title={writer.name}
                >
                  {writer.image ? (
                    <img
                      src={writer.image}
                      alt={writer.name}
                      className="w-14 h-14 rounded-full border-4 border-white object-cover hover:scale-110 transition z-10 relative"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-full border-4 border-white bg-yellow-400 flex items-center justify-center text-lg font-bold text-white hover:scale-110 transition z-10 relative">
                      {writer.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </Link>
              ))}
              <div className="w-14 h-14 rounded-full border-4 border-white bg-gray-200 flex items-center justify-center text-sm font-semibold text-gray-500 z-10 relative">
                +{writers.length > 5 ? writers.length - 5 : 0}
              </div>
            </div>
          )}

          <h2 className="text-5xl font-bold">
            Your Story Could Inspire Someone
          </h2>

          <p className="mt-6 text-xl max-w-3xl mx-auto">
            {writers.length > 0
              ? `Join ${writers.length}+ writers sharing their stories.`
              : "Every experience matters. Share your journey with the world."}
          </p>

          <Link
            href="/write"
            className="inline-flex mt-10 bg-white text-yellow-600 px-10 py-4 rounded-full font-bold items-center gap-3 hover:scale-105 transition"
          >
            <PenSquare />
            Start Writing
          </Link>
        </div>
      </div>
    </section>
  );
}
