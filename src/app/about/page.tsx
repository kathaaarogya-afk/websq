import { PenSquare, Users, BookOpen, Globe } from "lucide-react";

export const metadata = {
  title: "About WebSQ - Our Mission & Story",
  description:
    "Learn about WebSQ, an Australian storytelling community where ordinary people share extraordinary experiences, memories, lessons, dreams, and inspiration.",
  openGraph: {
    title: "About WebSQ",
    description:
      "Learn about WebSQ, an Australian storytelling community where ordinary people share extraordinary experiences.",
    url: "https://www.websq.com.au/about",
  },
  alternates: {
    canonical: "/about",
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-orange-50">
      {/* Hero */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            About <span className="text-yellow-500">WebSQ</span>
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
            A storytelling community where ordinary people share extraordinary
            experiences, memories, lessons, dreams, and inspiration.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl shadow-lg p-10 md:p-14">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-4">
              WebSQ was created with a simple belief: every person has a story worth
              telling. Whether it is a lesson learned from failure, a moment of joy,
              a family tradition, or a life-changing adventure — your experience
              matters.
            </p>
            <p className="text-gray-600 text-lg leading-relaxed">
              We provide a space for authentic, unfiltered storytelling. No fancy
              credentials required. No perfect prose expected. Just real stories
              from real people, written from the heart.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            What We Stand For
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: PenSquare,
                title: "Authentic Voices",
                desc: "We celebrate real stories, not polished performances. Your honest words connect deeper than perfect grammar ever could.",
              },
              {
                icon: Users,
                title: "Community First",
                desc: "We believe in the power of shared experiences. When one person speaks, others heal, learn, and grow together.",
              },
              {
                icon: Globe,
                title: "Every Story Matters",
                desc: "No story is too small or too ordinary. The mundane moments of life are often the most relatable and meaningful.",
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="bg-[#FFF8E7] rounded-3xl p-8 text-center"
                >
                  <Icon className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {item.title}
                  </h3>
                  <p className="text-gray-600">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="bg-gradient-to-r from-[#1E3A5F] via-[#294C74] to-[#3B5F89] rounded-3xl p-10 md:p-14">
            <BookOpen className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Share Your Story?
            </h2>
            <p className="text-white/80 mb-8">
              Join our community and let your voice be heard.
            </p>
            <a
              href="/write"
              className="inline-block bg-yellow-500 hover:bg-yellow-600 text-white px-10 py-4 rounded-full font-bold text-lg transition"
            >
              Start Writing
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
