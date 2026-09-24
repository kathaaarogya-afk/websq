import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";

export const metadata = {
  title: "Terms of Service - WebSQ",
  description: "Terms of Service for WebSQ storytelling community.",
  alternates: {
    canonical: "/terms",
  },
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-orange-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-yellow-600 mb-8 transition">
          <ArrowLeft size={18} />
          Back to Home
        </Link>

        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-yellow-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FileText className="text-yellow-600" size={32} />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
          <p className="text-gray-500">Last updated: January 2025</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-8">
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">1. Acceptance of Terms</h2>
            <p className="text-gray-600 leading-relaxed">
              By accessing or using WebSQ (&quot;the Platform&quot;), you agree to be bound by these Terms of Service.
              If you do not agree, please do not use the Platform. We reserve the right to modify these terms at any time.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">2. Account Registration</h2>
            <p className="text-gray-600 leading-relaxed">
              You must provide accurate and complete information when creating an account. You are responsible for
              maintaining the confidentiality of your credentials and for all activity under your account. You must
              be at least 13 years old to use the Platform.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">3. User Content</h2>
            <p className="text-gray-600 leading-relaxed">
              You retain ownership of content you publish on WebSQ. By posting content, you grant us a non-exclusive,
              worldwide, royalty-free licence to display, distribute, and promote your content on the Platform. You
              represent that your content does not violate any third-party rights or applicable laws.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">4. Prohibited Conduct</h2>
            <p className="text-gray-600 leading-relaxed">
              You agree not to post content that violates our{" "}
              <Link href="/community-guidelines" className="text-yellow-600 hover:text-yellow-700 underline">
                Community Guidelines
              </Link>
              {" "}or our{" "}
              <Link href="/acceptable-use" className="text-yellow-600 hover:text-yellow-700 underline">
                Acceptable Use Policy
              </Link>
              . This includes hate speech, harassment, spam, impersonation, and any illegal activity.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">5. Intellectual Property</h2>
            <p className="text-gray-600 leading-relaxed">
              All Platform features, design, and code are the property of WebSQ and protected by copyright and
              trademark laws. You may not copy, modify, or distribute any part of the Platform without written
              permission. See our{" "}
              <Link href="/copyright" className="text-yellow-600 hover:text-yellow-700 underline">
                Copyright Policy
              </Link>{" "}
              for details.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">6. Termination</h2>
            <p className="text-gray-600 leading-relaxed">
              We reserve the right to suspend or terminate your account at our discretion, including for violations
              of these Terms or our Community Guidelines. You may delete your account at any time through your
              dashboard settings.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">7. Disclaimer of Warranties</h2>
            <p className="text-gray-600 leading-relaxed">
              The Platform is provided &quot;as is&quot; without warranties of any kind. We do not guarantee
              uninterrupted access, accuracy of content, or that the Platform will be error-free.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">8. Limitation of Liability</h2>
            <p className="text-gray-600 leading-relaxed">
              To the maximum extent permitted by law, WebSQ shall not be liable for any indirect, incidental,
              special, or consequential damages arising from your use of the Platform.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">9. Governing Law</h2>
            <p className="text-gray-600 leading-relaxed">
              These Terms are governed by the laws of Australia. Any disputes shall be resolved in the courts of
              Australia.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">10. Contact</h2>
            <p className="text-gray-600 leading-relaxed">
              Questions about these Terms? Contact us at{" "}
              <a href="mailto:hello@websq.com.au" className="text-yellow-600 hover:text-yellow-700 underline">
                hello@websq.com.au
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
