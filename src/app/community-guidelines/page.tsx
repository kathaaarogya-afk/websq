import Link from "next/link";
import {
  Shield,
  AlertTriangle,
  Ban,
  Heart,
  ArrowLeft,
} from "lucide-react";

export const metadata = {
  title: "Community Guidelines - Our Standards for Sharing",
  description:
    "Read the WebSQ community guidelines. Learn what content is allowed, what is banned, and how to keep our storytelling community safe and welcoming.",
  openGraph: {
    title: "Community Guidelines | WebSQ",
    description: "Our standards for safe and respectful storytelling.",
  },
  alternates: {
    canonical: "/community-guidelines",
  },
};

const banned = [
  {
    title: "Hate Speech",
    desc: "Content that attacks, demeans, or incites violence against individuals or groups based on race, ethnicity, religion, gender, sexual orientation, disability, or other protected characteristics.",
  },
  {
    title: "Threats & Violence",
    desc: "Any content that threatens, glorifies, or encourages violence or physical harm against any individual or group.",
  },
  {
    title: "Harassment & Bullying",
    desc: "Repeated unwanted contact, intimidation, stalking, or targeted abuse directed at specific individuals.",
  },
  {
    title: "Sexual Exploitation",
    desc: "Content that depicts, promotes, or facilitates sexual exploitation or abuse of any kind.",
  },
  {
    title: "Child Exploitation",
    desc: "Any content that exploits, endangers, or sexualises minors. This is strictly prohibited and will be reported to authorities.",
  },
  {
    title: "Non-Consensual Intimate Images",
    desc: "Sharing intimate or sexual images of any person without their explicit consent.",
  },
  {
    title: "Defamation",
    desc: "False statements presented as fact that damage the reputation of an individual or organisation.",
  },
  {
    title: "Copyright Infringement",
    desc: "Publishing content that you do not own or have rights to, including text, images, or media created by others without proper attribution or permission.",
  },
  {
    title: "Spam & Scams",
    desc: "Repetitive, deceptive, or misleading content designed to manipulate, defraud, or drive traffic to malicious sites.",
  },
  {
    title: "Dangerous Instructions",
    desc: "Content that provides instructions for self-harm, illegal activities, or actions that could cause serious physical harm.",
  },
  {
    title: "Doxxing & Personal Information",
    desc: "Sharing private or personal information about someone (address, phone number, workplace) without their consent.",
  },
  {
    title: "Impersonation",
    desc: "Pretending to be another person, creator, or organisation in a misleading or deceptive way.",
  },
];

export default function CommunityGuidelinesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-orange-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-yellow-600 mb-8 transition"
        >
          <ArrowLeft size={18} />
          Back to Home
        </Link>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-yellow-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Shield className="text-yellow-600" size={32} />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Community Guidelines
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            WebSQ is a space for authentic storytelling and respectful connection.
            These guidelines help keep our community safe, welcoming, and trustworthy.
          </p>
        </div>

        {/* Our Mission */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Heart className="text-yellow-600" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Our Mission
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Every story matters. Every voice belongs. We believe in the power of
                real experiences shared by real people. Our platform exists to uplift,
                inspire, and connect — never to harm. By participating, you agree to
                contribute to a community built on respect, honesty, and empathy.
              </p>
            </div>
          </div>
        </div>

        {/* What We Don't Allow */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
              <Ban className="text-red-600" size={20} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              What We Don&apos;t Allow
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {banned.map((item) => (
              <div
                key={item.title}
                className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition"
              >
                <h3 className="font-bold text-gray-900 mb-1.5 flex items-center gap-2">
                  <AlertTriangle size={16} className="text-red-500 flex-shrink-0" />
                  {item.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Consequences */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Enforcement & Consequences
          </h2>
          <div className="space-y-3 text-gray-600">
            <p>
              <strong>1. Warning</strong> — First-time minor violations may result in a
              warning and content removal.
            </p>
            <p>
              <strong>2. Content Removal</strong> — Content that violates these guidelines
              will be removed without notice.
            </p>
            <p>
              <strong>3. Temporary Suspension</strong> — Repeated or serious violations may
              result in temporary account suspension.
            </p>
            <p>
              <strong>4. Permanent Ban</strong> — Severe violations (child exploitation,
              threats, harassment) result in immediate and permanent account termination.
            </p>
            <p>
              <strong>5. Legal Action</strong> — Where required by law, we may report
              violations to law enforcement authorities.
            </p>
          </div>
        </div>

        {/* Reporting */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            How to Report
          </h2>
          <div className="space-y-3 text-gray-600">
            <p>
              If you encounter content that violates these guidelines, you can:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>
                <strong>Report a Story</strong> — Click the 🚩 Report button on any
                story page.
              </li>
              <li>
                <strong>Report a User</strong> — Click the Report button on any
                user&apos;s profile page.
              </li>
              <li>
                <strong>Report an Image</strong> — When reporting a story, select
                &quot;Inappropriate Image&quot; as the reason and provide details.
              </li>
            </ul>
            <p>
              All reports are reviewed by our moderation team within 24 hours. Your
              identity is kept confidential. We do not tolerate retaliatory reports.
            </p>
          </div>
        </div>

        {/* Contact */}
        <div className="text-center">
          <p className="text-gray-500 mb-4">
            Questions about these guidelines?
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-full font-medium transition"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}
