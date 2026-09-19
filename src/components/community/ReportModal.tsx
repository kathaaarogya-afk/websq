"use client";

import { useState } from "react";
import { X, Flag } from "lucide-react";
import toast from "react-hot-toast";

interface ReportModalProps {
  targetType: "story" | "user" | "image";
  targetId: string;
  targetName?: string;
  onClose: () => void;
}

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

export default function ReportModal({
  targetType,
  targetId,
  targetName,
  onClose,
}: ReportModalProps) {
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!reason) {
      toast.error("Please select a reason");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetType, targetId, reason, details }),
      });

      if (res.ok) {
        toast.success("Report submitted. Thank you for helping keep our community safe.");
        onClose();
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Flag className="text-red-500" size={20} />
            <h2 className="text-lg font-bold text-gray-900">
              Report{" "}
              {targetType === "story"
                ? "Story"
                : targetType === "user"
                ? "User"
                : "Image"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          {targetName && (
            <p className="text-sm text-gray-500 mb-4">
              Reporting: <span className="font-medium text-gray-700">{targetName}</span>
            </p>
          )}

          <label className="block text-sm font-medium text-gray-700 mb-2">
            Reason <span className="text-red-500">*</span>
          </label>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none mb-4 text-sm"
          >
            <option value="">Select a reason...</option>
            {reasons.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>

          <label className="block text-sm font-medium text-gray-700 mb-2">
            Additional Details (optional)
          </label>
          <textarea
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            rows={3}
            maxLength={1000}
            placeholder="Provide any additional context..."
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none resize-none text-sm"
          />
          <p className="text-xs text-gray-400 mt-1 text-right">
            {details.length}/1000
          </p>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-gray-600 hover:bg-gray-100 font-medium text-sm transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting || !reason}
            className="px-5 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-medium text-sm transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {submitting ? (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
            ) : (
              <Flag size={14} />
            )}
            Submit Report
          </button>
        </div>
      </div>
    </div>
  );
}
