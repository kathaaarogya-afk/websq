"use client";

import { useState } from "react";
import {
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  AlertCircle,
} from "lucide-react";

interface Story {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  coverImage: string;
  status: "draft" | "published";
  adminStatus: "pending" | "approved" | "rejected";
  rejectionReason?: string;
  views: number;
  author: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
}

interface ApproveStoriesProps {
  stories: Story[];
  loading: boolean;
  onApprove: (id: string) => Promise<void>;
  onReject: (id: string, reason: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export default function ApproveStories({
  stories,
  loading,
  onApprove,
  onReject,
  onDelete,
}: ApproveStoriesProps) {
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const filteredStories =
    filter === "all" ? stories : stories.filter((s) => s.adminStatus === filter);

  const handleReject = async () => {
    if (!selectedStory || !rejectReason.trim()) return;
    setActionLoading(true);
    await onReject(selectedStory._id, rejectReason);
    setActionLoading(false);
    setShowRejectModal(false);
    setSelectedStory(null);
    setRejectReason("");
  };

  const handleApprove = async (id: string) => {
    setActionLoading(true);
    await onApprove(id);
    setActionLoading(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
            <Clock className="w-3 h-3" />
            Pending
          </span>
        );
      case "approved":
        return (
          <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
            <CheckCircle className="w-3 h-3" />
            Approved
          </span>
        );
      case "rejected":
        return (
          <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
            <XCircle className="w-3 h-3" />
            Rejected
          </span>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white rounded-2xl p-6 border border-gray-100 animate-pulse"
          >
            <div className="flex gap-4">
              <div className="w-32 h-24 bg-gray-200 rounded-xl"></div>
              <div className="flex-1 space-y-3">
                <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Approve Stories</h2>
        <div className="flex gap-2">
          {(["all", "pending", "approved", "rejected"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                filter === f
                  ? "bg-yellow-500 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {filteredStories.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 border border-gray-100 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            All caught up!
          </h3>
          <p className="text-gray-500">No {filter !== "all" ? filter : ""} stories to review.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredStories.map((story) => (
            <div
              key={story._id}
              className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition"
            >
              <div className="flex gap-4">
                {/* Cover Image */}
                <div className="w-32 h-24 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                  {story.coverImage ? (
                    <img
                      src={story.coverImage}
                      alt={story.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-yellow-50">
                      <span className="text-2xl">📝</span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-gray-900 truncate">
                          {story.title}
                        </h3>
                        {getStatusBadge(story.adminStatus)}
                      </div>
                      <p className="text-sm text-gray-500 line-clamp-1">
                        {story.excerpt || "No excerpt"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                    <span>By {story.author?.name || "Unknown"}</span>
                    <span className="bg-yellow-50 text-yellow-700 px-2 py-0.5 rounded-full text-xs">
                      {story.category}
                    </span>
                    <span>{new Date(story.createdAt).toLocaleDateString()}</span>
                  </div>

                  {/* Rejection Reason */}
                  {story.adminStatus === "rejected" && story.rejectionReason && (
                    <div className="mt-3 p-3 bg-red-50 rounded-xl flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-red-500 mt-0.5" />
                      <p className="text-sm text-red-700">{story.rejectionReason}</p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-2 mt-4">
                    <button
                      onClick={() => setSelectedStory(story)}
                      className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </button>
                    {story.adminStatus === "pending" && (
                      <>
                        <button
                          onClick={() => handleApprove(story._id)}
                          disabled={actionLoading}
                          className="flex items-center gap-1.5 text-sm text-green-600 hover:text-green-700 px-3 py-1.5 rounded-lg hover:bg-green-50 transition disabled:opacity-50"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Approve
                        </button>
                        <button
                          onClick={() => {
                            setSelectedStory(story);
                            setShowRejectModal(true);
                          }}
                          disabled={actionLoading}
                          className="flex items-center gap-1.5 text-sm text-red-600 hover:text-red-700 px-3 py-1.5 rounded-lg hover:bg-red-50 transition disabled:opacity-50"
                        >
                          <XCircle className="w-4 h-4" />
                          Reject
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => {
                        if (confirm("Are you sure you want to delete this story?")) {
                          onDelete(story._id);
                        }
                      }}
                      className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-50 transition ml-auto"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Story Preview Modal */}
      {selectedStory && !showRejectModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">
                {selectedStory.title}
              </h3>
              <button
                onClick={() => setSelectedStory(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-500 mb-4">
              <span>By {selectedStory.author?.name}</span>
              <span className="bg-yellow-50 text-yellow-700 px-2 py-0.5 rounded-full text-xs">
                {selectedStory.category}
              </span>
              {getStatusBadge(selectedStory.adminStatus)}
            </div>
            {selectedStory.coverImage && (
              <img
                src={selectedStory.coverImage}
                alt={selectedStory.title}
                className="w-full h-48 object-cover rounded-xl mb-4"
              />
            )}
            <div className="prose max-w-none">
              <p className="whitespace-pre-wrap text-gray-700">
                {selectedStory.excerpt || "No excerpt available."}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && selectedStory && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Reject Story
            </h3>
            <p className="text-gray-600 mb-4">
              Please provide a reason for rejecting &quot;{selectedStory.title}&quot;:
            </p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Reason for rejection..."
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none resize-none mb-4"
            />
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setSelectedStory(null);
                  setRejectReason("");
                }}
                className="px-4 py-2 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={!rejectReason.trim() || actionLoading}
                className="px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white font-medium transition disabled:opacity-50"
              >
                {actionLoading ? "Rejecting..." : "Reject Story"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
