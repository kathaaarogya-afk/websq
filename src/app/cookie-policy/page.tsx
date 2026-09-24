import Link from "next/link";
import { ArrowLeft, Cookie } from "lucide-react";

export const metadata = {
  title: "Cookie Policy - WebSQ",
  description: "Cookie Policy for WebSQ storytelling community.",
  alternates: {
    canonical: "/cookie-policy",
  },
};

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-orange-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-yellow-600 mb-8 transition">
          <ArrowLeft size={18} />
          Back to Home
        </Link>

        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-yellow-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Cookie className="text-yellow-600" size={32} />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Cookie Policy</h1>
          <p className="text-gray-500">Last updated: January 2025</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-8">
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">1. What Are Cookies</h2>
            <p className="text-gray-600 leading-relaxed">
              Cookies are small text files stored on your device when you visit a website. They help us
              recognise your device, remember your preferences, and improve your browsing experience.
              Cookies do not contain personally identifiable information.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">2. Cookies We Use</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-600">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 rounded-tl-lg">Cookie</th>
                    <th className="px-4 py-3">Purpose</th>
                    <th className="px-4 py-3 rounded-tr-lg">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="px-4 py-3 font-medium text-gray-900">token</td>
                    <td className="px-4 py-3">Authentication session</td>
                    <td className="px-4 py-3">7 days</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-4 py-3 font-medium text-gray-900">next-auth.session-token</td>
                    <td className="px-4 py-3">Google OAuth session</td>
                    <td className="px-4 py-3">30 days</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-4 py-3 font-medium text-gray-900">next-auth.csrf-token</td>
                    <td className="px-4 py-3">CSRF protection</td>
                    <td className="px-4 py-3">Session</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium text-gray-900">preferences</td>
                    <td className="px-4 py-3">UI preferences</td>
                    <td className="px-4 py-3">1 year</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">3. Third-Party Cookies</h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              Some cookies are placed by third-party services that appear on our pages:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li><strong>Google Analytics:</strong> Helps us understand how visitors interact with the Platform by collecting anonymous usage data.</li>
              <li><strong>Google OAuth:</strong> Enables secure sign-in with your Google account.</li>
              <li><strong>Vercel Analytics:</strong> Provides privacy-friendly analytics to measure site performance and usage.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">4. Managing Cookies</h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              You can control and manage cookies through your browser settings:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li><strong>Chrome:</strong> Settings &gt; Privacy and Security &gt; Cookies and other site data.</li>
              <li><strong>Firefox:</strong> Settings &gt; Privacy &amp; Security &gt; Cookies and Site Data.</li>
              <li><strong>Safari:</strong> Preferences &gt; Privacy &gt; Manage Website Data.</li>
              <li><strong>Edge:</strong> Settings &gt; Cookies and site permissions &gt; Cookies and site data.</li>
            </ul>
            <p className="text-gray-600 leading-relaxed mt-3">
              Please note that disabling cookies may affect the functionality of the Platform.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">5. Do Not Track</h2>
            <p className="text-gray-600 leading-relaxed">
              We respect Do Not Track (DNT) browser signals. When a DNT signal is detected, we limit
              our tracking to essential cookies required for the Platform to function properly.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">6. Updates to This Policy</h2>
            <p className="text-gray-600 leading-relaxed">
              We may update this Cookie Policy from time to time to reflect changes in our practices
              or applicable laws. Significant changes will be communicated via email or a notice on
              the Platform.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">7. Contact</h2>
            <p className="text-gray-600 leading-relaxed">
              Questions about our use of cookies? Contact us at{" "}
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
