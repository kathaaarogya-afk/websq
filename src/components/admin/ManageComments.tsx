"use client";

import { useState } from "react";
import {
  Eye,
  EyeOff,
  Trash2,
  MessageSquare,
  User,
  BookOpen,
  Search,
} from "lucide-react";

interface Comment {
  _id: string;
  content: string;
  status: "visible" | "hidden";
  author: {
    _id: string;
    name: string;
    email: string;
  };
  story: {
    _id: string;
    title: string;
  };
  createdAt: string;
}

interface ManageCommentsProps {
  comments: Comment[];
  loading: boolean;
  onToggleStatus: (id: string, status: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export default function ManageComments({
  comments,
  loading,
  onToggleStatus,
  onDelete,
}: ManageCommentsProps) {
  const [filter, setFilter] = useState<"all" | "visible" | "hidden">("all");
  const [search, setSearch] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const filteredComments = comments.filter((comment) => {
    const matchesFilter =
      filter === "all" || comment.status === filter;
    const matchesSearch =
      comment.content.toLowerCase().includes(search.toLowerCase()) ||
      comment.author?.name?.toLowerCase().includes(search.toLowerCase()) ||
      comment.story?.title?.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    setActionLoading(id);
    const newStatus = currentStatus === "visible" ? "hidden" : "visible";
    await onToggleStatus(id, newStatus);
    setActionLoading(null);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white rounded-2xl p-6 border border-gray-100 animate-pulse"
          >
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Comments</h2>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search comments..."
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none"
          />
        </div>
        <div className="flex gap-2">
          {(["all", "visible", "hidden"] as const).map((f) => (
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

      {/* Comments List */}
      {filteredComments.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 border border-gray-100 text-center">
          <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            No comments found
          </h3>
          <p className="text-gray-500">
            {search ? "Try a different search term." : "No comments yet."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredComments.map((comment) => (
            <div
              key={comment._id}
              className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  {/* Comment Content */}
                  <p className="text-gray-800 whitespace-pre-wrap">
                    {comment.content}
                  </p>

                  {/* Meta Info */}
                  <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {comment.author?.name || "Unknown"}
                    </span>
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4" />
                      {comment.story?.title || "Deleted story"}
                    </span>
                    <span>
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        comment.status === "visible"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {comment.status === "visible" ? "Visible" : "Hidden"}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() =>
                      handleToggleStatus(comment._id, comment.status)
                    }
                    disabled={actionLoading === comment._id}
                    title={
                      comment.status === "visible"
                        ? "Hide Comment"
                        : "Show Comment"
                    }
                    className="p-2 rounded-lg hover:bg-yellow-50 text-gray-600 hover:text-yellow-600 transition disabled:opacity-50"
                  >
                    {comment.status === "visible" ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={() => {
                      if (confirm("Delete this comment permanently?")) {
                        onDelete(comment._id);
                      }
                    }}
                    disabled={actionLoading === comment._id}
                    title="Delete Comment"
                    className="p-2 rounded-lg hover:bg-red-50 text-gray-600 hover:text-red-600 transition disabled:opacity-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
