import Link from "next/link";
import { ArrowLeft, Copyright } from "lucide-react";

export const metadata = {
  title: "Copyright Policy - WebSQ",
  description: "Copyright Policy for WebSQ storytelling community.",
};

export default function CopyrightPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-orange-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-yellow-600 mb-8 transition">
          <ArrowLeft size={18} />
          Back to Home
        </Link>

        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-yellow-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Copyright className="text-yellow-600" size={32} />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Copyright Policy</h1>
          <p className="text-gray-500">Last updated: January 2025</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-8">
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Your Content</h2>
            <p className="text-gray-600 leading-relaxed">
              You retain full copyright ownership of all stories, comments, images, and other content you
              publish on WebSQ. We do not claim ownership over your creative work.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">License You Grant to WebSQ</h2>
            <p className="text-gray-600 leading-relaxed">
              By publishing content on WebSQ, you grant us a non-exclusive, worldwide, royalty-free, sublicensable
              licence to use, display, reproduce, and distribute your content solely for the purpose of operating
              and promoting the Platform. This includes displaying your stories in feeds, search results, and
              promotional materials.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Removing Your Content</h2>
            <p className="text-gray-600 leading-relaxed">
              You may delete your stories at any time from your dashboard. Once deleted, we will remove your
              content from public view within 48 hours. However, cached versions may persist temporarily in
              search engines and CDNs outside our control.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Reporting Copyright Infringement</h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              If you believe your copyrighted work has been used on WebSQ without authorisation, you may
              submit a report through our{" "}
              <Link href="/report-content" className="text-yellow-600 hover:text-yellow-700 underline">
                Report Content
              </Link>{" "}
              page or email us directly at{" "}
              <a href="mailto:hello@websq.com.au" className="text-yellow-600 hover:text-yellow-700 underline">
                hello@websq.com.au
              </a>.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Please include: (1) identification of the copyrighted work, (2) the URL of the infringing content,
              (3) your contact information, and (4) a statement of good-faith belief.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Counter-Notification</h2>
            <p className="text-gray-600 leading-relaxed">
              If your content was removed due to a copyright claim and you believe it was a mistake, you may
              submit a counter-notification. We will review it and may restore the content if appropriate.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Repeat Infringers</h2>
            <p className="text-gray-600 leading-relaxed">
              We reserve the right to terminate accounts of users who repeatedly infringe copyrights.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Platform Copyright</h2>
            <p className="text-gray-600 leading-relaxed">
              The WebSQ platform, including its design, code, logo, and branding, is copyrighted by WebSQ.
              You may not reproduce, modify, or distribute any part of the Platform without written permission.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
