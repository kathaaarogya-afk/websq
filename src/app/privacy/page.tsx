import Link from "next/link";
import { ArrowLeft, Lock } from "lucide-react";

export const metadata = {
  title: "Privacy Policy - WebSQ",
  description: "Privacy Policy for WebSQ storytelling community.",
  alternates: {
    canonical: "/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-orange-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-yellow-600 mb-8 transition">
          <ArrowLeft size={18} />
          Back to Home
        </Link>

        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-yellow-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Lock className="text-yellow-600" size={32} />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-gray-500">Last updated: January 2025</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-8">
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">1. Information We Collect</h2>
            <p className="text-gray-600 leading-relaxed mb-3">We collect the following types of information:</p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li><strong>Account Information:</strong> Name, email address, profile image, and bio you provide during registration.</li>
              <li><strong>Content:</strong> Stories, comments, and other content you publish on the Platform.</li>
              <li><strong>Usage Data:</strong> Pages visited, time spent, interactions, and device/browser information.</li>
              <li><strong>Authentication Data:</strong> Login credentials (stored securely) and session tokens.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">2. How We Use Your Information</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li>To provide and maintain the Platform services.</li>
              <li>To personalise your experience and deliver relevant content.</li>
              <li>To communicate with you about your account, updates, and notifications.</li>
              <li>To moderate content and enforce our Community Guidelines.</li>
              <li>To improve the Platform through analytics and usage patterns.</li>
              <li>To detect and prevent fraud, abuse, or security issues.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">3. Information Sharing</h2>
            <p className="text-gray-600 leading-relaxed">
              We do not sell your personal information. We may share information only in these circumstances:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4 mt-3">
              <li>With your consent or at your direction.</li>
              <li>With service providers who assist in operating the Platform (hosting, analytics).</li>
              <li>When required by law or to protect the rights and safety of WebSQ and its users.</li>
              <li>In connection with a merger, acquisition, or sale of assets (with notice to you).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">4. Data Security</h2>
            <p className="text-gray-600 leading-relaxed">
              We implement industry-standard security measures to protect your data, including encrypted
              transmission (HTTPS), secure password hashing, and access controls. However, no method of
              electronic transmission is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">5. Data Retention</h2>
            <p className="text-gray-600 leading-relaxed">
              We retain your information for as long as your account is active or as needed to provide services.
              If you delete your account, we will remove your personal data within 30 days, except where we are
              legally required to retain it.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">6. Your Rights</h2>
            <p className="text-gray-600 leading-relaxed mb-3">You have the right to:</p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li>Access, update, or correct your personal information.</li>
              <li>Request deletion of your account and data.</li>
              <li>Opt out of non-essential communications.</li>
              <li>Export your data in a portable format.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">7. Cookies</h2>
            <p className="text-gray-600 leading-relaxed">
              We use cookies to maintain your session and remember your preferences. For full details, see our{" "}
              <Link href="/cookie-policy" className="text-yellow-600 hover:text-yellow-700 underline">
                Cookie Policy
              </Link>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">8. Children&apos;s Privacy</h2>
            <p className="text-gray-600 leading-relaxed">
              The Platform is not intended for children under 13. We do not knowingly collect data from children.
              If we become aware of such data, we will delete it promptly.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">9. Changes to This Policy</h2>
            <p className="text-gray-600 leading-relaxed">
              We may update this policy from time to time. Significant changes will be communicated via email or
              a notice on the Platform.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">10. Contact Us</h2>
            <p className="text-gray-600 leading-relaxed">
              Questions about privacy? Email us at{" "}
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
