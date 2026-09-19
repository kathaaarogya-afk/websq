"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Flag, Shield, Send, Loader2, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";

const reportTypes = [
  "Report a Story",
  "Report a User",
  "Report an Image",
];

const reasons = [
  "Hate speech",
  "Threats or violence",
  "Harassment or bullying",
  "Sexual exploitation",
  "Child exploitation",
  "Non-consensual intimate images",
  "Defamation",
  "Copyright infringement",
  "Spam or scams",
  "Dangerous instructions",
  "Doxxing or personal information",
  "Impersonation",
  "Inappropriate image",
  "Other",
];

export default function ReportContentPage() {
  const [reportType, setReportType] = useState("");
  const [reason, setReason] = useState("");
  const [url, setUrl] = useState("");
  const [details, setDetails] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportType || !reason) {
      toast.error("Please fill in all required fields");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetType: reportType.includes("Story") ? "story" : reportType.includes("User") ? "user" : "image",
          targetId: url || "external",
          reason,
          details: `Report type: ${reportType}\nURL: ${url}\nEmail: ${email}\nDetails: ${details}`,
        }),
      });
      if (res.ok) {
        setSubmitted(true);
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to submit report");
      }
    } catch {
      toast.error("Failed to submit report");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-orange-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-yellow-600 mb-8 transition">
          <ArrowLeft size={18} />
          Back to Home
        </Link>

        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Flag className="text-red-500" size={32} />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Report Content</h1>
          <p className="text-gray-600 max-w-xl mx-auto">
            Help us keep WebSQ safe. All reports are reviewed within 24 hours and handled confidentially.
          </p>
        </div>

        {submitted ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 text-center">
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Report Submitted</h2>
            <p className="text-gray-600 mb-6">
              Thank you for helping keep our community safe. Our moderation team will review your report
              within 24 hours.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-full font-medium transition"
            >
              Back to Home
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-100">
              <Shield className="text-yellow-500" size={22} />
              <div>
                <h2 className="font-bold text-gray-900">Submit a Report</h2>
                <p className="text-sm text-gray-500">Fields marked with * are required</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What are you reporting? <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-wrap gap-3">
                  {reportTypes.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setReportType(type)}
                      className={`px-4 py-2.5 rounded-xl border text-sm font-medium transition ${
                        reportType === type
                          ? "border-red-500 bg-red-50 text-red-700"
                          : "border-gray-200 text-gray-600 hover:border-gray-300"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason <span className="text-red-500">*</span>
                </label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none text-sm"
                >
                  <option value="">Select a reason...</option>
                  {reasons.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL of the content (if applicable)
                </label>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://www.websq.com.au/stories/..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Details
                </label>
                <textarea
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  rows={4}
                  placeholder="Provide any additional context that may help our review..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none resize-none text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your email (optional, for follow-up)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none text-sm"
                />
              </div>

              <p className="text-xs text-gray-400">
                By submitting this report, you agree to our{" "}
                <Link href="/community-guidelines" className="text-yellow-600 hover:text-yellow-700 underline">
                  Community Guidelines
                </Link>
                {" "}and confirm this report is made in good faith.
              </p>

              <button
                type="submit"
                disabled={submitting || !reportType || !reason}
                className="w-full py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-medium transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <Send size={18} />
                )}
                Submit Report
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
