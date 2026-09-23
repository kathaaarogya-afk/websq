import { PenSquare, Users, BookOpen, Globe, Bot, Code2 } from "lucide-react";

export const metadata = {
  title: "About WebSQ - Learn, Build & Share Tech & AI",
  description:
    "Learn about WebSQ, an Australian community where everyday people share practical knowledge about website technology, artificial intelligence, SEO and digital marketing.",
  openGraph: {
    title: "About WebSQ",
    description:
      "Learn about WebSQ, an Australian community for tech, AI and web knowledge sharing.",
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
            A community where everyday people learn, build, and share
            practical knowledge about website technology, artificial
            intelligence, SEO, digital marketing and the digital world.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl shadow-lg p-10 md:p-14">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-4">
              WebSQ was created with a simple belief: knowledge is best when it
              is shared. Whether it is a tutorial on building a website, a
              plain-English guide to artificial intelligence, an SEO tip that
              got your page ranked, or a lesson learned the hard way — what you
              know matters.
            </p>
            <p className="text-gray-600 text-lg leading-relaxed">
              We provide a space for authentic, hands-on writing. No fancy
              credentials required. No perfect prose expected. Just clear,
              honest explanations from real people who took the time to help
              others grow.
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
                icon: Bot,
                title: "AI Made Simple",
                desc: "We break artificial intelligence down into plain language, so anyone can understand and use modern AI tools with confidence.",
              },
              {
                icon: Code2,
                title: "Practical Know-How",
                desc: "We focus on guides you can actually use — real steps, real code, real results — not abstract theory.",
              },
              {
                icon: Globe,
                title: "Knowledge for Everyone",
                desc: "No question is too basic and no skill is too small. The everyday insights of one person can help countless others.",
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
              Ready to Share What You Know?
            </h2>
            <p className="text-white/80 mb-8">
              Join our community and teach others the tech and AI skills they
              need.
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
