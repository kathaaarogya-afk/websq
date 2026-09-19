import { ArrowLeft, ShieldCheck } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Acceptable Use Policy | WebSQ",
  description:
    "Learn about the acceptable and prohibited uses of the WebSQ storytelling platform.",
};

export default function AcceptableUsePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-white">
      <div className="max-w-3xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-yellow-600 hover:text-yellow-700 mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-yellow-100 p-8 sm:p-12">
          <div className="flex items-center gap-3 mb-6">
            <ShieldCheck className="w-8 h-8 text-yellow-500" />
            <h1 className="text-3xl font-bold text-gray-900">
              Acceptable Use Policy
            </h1>
          </div>

          <p className="text-sm text-gray-500 mb-8">Last updated: January 2025</p>

          <div className="prose prose-yellow max-w-none space-y-8">
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Overview</h2>
              <p className="text-gray-600 leading-relaxed">
                This policy outlines the acceptable and prohibited uses of the WebSQ
                Platform. By using our services, you agree to comply with these
                guidelines. We reserve the right to modify this policy at any time, and
                continued use of the platform constitutes acceptance of any changes.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                Acceptable Uses
              </h2>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-yellow-500 mt-1">•</span>
                  Share personal stories and experiences
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-500 mt-1">•</span>
                  Comment respectfully on others&apos; stories
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-500 mt-1">•</span>
                  Follow writers you enjoy
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-500 mt-1">•</span>
                  Report content that violates guidelines
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-500 mt-1">•</span>
                  Use the platform for personal and non-commercial storytelling
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                Prohibited Uses
              </h2>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  Posting content that violates Community Guidelines
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  Using automated tools or bots to scrape content
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  Attempting to access other users&apos; accounts
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  Circumventing content moderation or blocking
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  Using the platform for commercial spam or advertising without
                  permission
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  Collecting user data without consent
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  Interfering with platform operations or security
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                Content Standards
              </h2>
              <p className="text-gray-600 leading-relaxed mb-3">
                All content posted on WebSQ must meet the following standards:
              </p>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-yellow-500 mt-1">•</span>
                  Content must be original or properly attributed
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-500 mt-1">•</span>
                  No misleading or deceptive content
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-500 mt-1">•</span>
                  No content that promotes illegal activities
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Enforcement</h2>
              <p className="text-gray-600 leading-relaxed">
                Violations of this policy may result in content removal, account
                suspension, or permanent ban depending on severity. Repeat violations
                or serious infractions may result in immediate permanent action without
                prior warning.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                Reporting Violations
              </h2>
              <p className="text-gray-600 leading-relaxed mb-3">
                If you encounter content or behaviour that violates this policy, please
                report it immediately:
              </p>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-yellow-500 mt-1">•</span>
                  <Link
                    href="/report-content"
                    className="text-yellow-600 hover:text-yellow-700 underline"
                  >
                    Report a Violation
                  </Link>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-500 mt-1">•</span>
                  <Link
                    href="/community-guidelines"
                    className="text-yellow-600 hover:text-yellow-700 underline"
                  >
                    View Community Guidelines
                  </Link>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Contact</h2>
              <p className="text-gray-600 leading-relaxed">
                If you have questions about this policy, contact us at{" "}
                <a
                  href="mailto:hello@websq.com.au"
                  className="text-yellow-600 hover:text-yellow-700 underline"
                >
                  hello@websq.com.au
                </a>
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
