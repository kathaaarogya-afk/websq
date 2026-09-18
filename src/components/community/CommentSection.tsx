"use client";

import { useState, useEffect } from "react";
import { MessageSquare, Reply, Edit2, Trash2, Send, ChevronDown, ChevronUp } from "lucide-react";

interface CommentData {
  _id: string;
  content: string;
  author: {
    _id: string;
    name: string;
    image: string;
  };
  parentComment?: string;
  status: "visible" | "hidden";
  likesCount: number;
  createdAt: string;
  replies?: CommentData[];
}

interface CommentSectionProps {
  storyId: string;
  currentUserId?: string;
}

export default function CommentSection({
  storyId,
  currentUserId,
}: CommentSectionProps) {
  const [comments, setComments] = useState<CommentData[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [expandedReplies, setExpandedReplies] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchComments();
  }, [storyId]);

  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/stories/${storyId}/comments`);
      if (res.ok) {
        const data = await res.json();
        setComments(data.comments || []);
      }
    } catch {
      // API not connected yet
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;
    setSubmitting(true);

    try {
      const res = await fetch(`/api/stories/${storyId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newComment }),
      });

      if (res.ok) {
        const data = await res.json();
        setComments([data.comment, ...comments]);
        setNewComment("");
      }
    } catch {
      // API not connected yet
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitReply = async (parentId: string) => {
    if (!replyContent.trim()) return;
    setSubmitting(true);

    try {
      const res = await fetch(`/api/stories/${storyId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: replyContent, parentComment: parentId }),
      });

      if (res.ok) {
        const data = await res.json();
        setComments(
          comments.map((c) =>
            c._id === parentId
              ? { ...c, replies: [...(c.replies || []), data.comment] }
              : c
          )
        );
        setReplyContent("");
        setReplyTo(null);
        setExpandedReplies(new Set([...expandedReplies, parentId]));
      }
    } catch {
      // API not connected yet
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditComment = async (commentId: string) => {
    if (!editContent.trim()) return;
    setSubmitting(true);

    try {
      const res = await fetch(`/api/stories/${storyId}/comments/${commentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: editContent }),
      });

      if (res.ok) {
        setComments(
          comments.map((c) =>
            c._id === commentId ? { ...c, content: editContent } : c
          )
        );
        setEditingId(null);
        setEditContent("");
      }
    } catch {
      // API not connected yet
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm("Delete this comment?")) return;

    try {
      const res = await fetch(`/api/stories/${storyId}/comments/${commentId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setComments(comments.filter((c) => c._id !== commentId));
      }
    } catch {
      // API not connected yet
    }
  };

  const toggleReplies = (commentId: string) => {
    const newExpanded = new Set(expandedReplies);
    if (newExpanded.has(commentId)) {
      newExpanded.delete(commentId);
    } else {
      newExpanded.add(commentId);
    }
    setExpandedReplies(newExpanded);
  };

  const formatDate = (date: string) => {
    const d = new Date(date);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return d.toLocaleDateString();
  };

  const renderComment = (comment: CommentData, isReply = false) => (
    <div
      key={comment._id}
      className={`${isReply ? "ml-12 mt-4" : "py-4"} ${
        !isReply ? "border-b border-gray-100 last:border-0" : ""
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center text-sm font-bold text-black flex-shrink-0">
          {comment.author?.name?.charAt(0).toUpperCase() || "?"}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-gray-900">
              {comment.author?.name || "Unknown"}
            </span>
            <span className="text-sm text-gray-400">
              {formatDate(comment.createdAt)}
            </span>
          </div>

          {editingId === comment._id ? (
            <div className="mt-2">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none resize-none text-sm"
              />
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => handleEditComment(comment._id)}
                  disabled={submitting}
                  className="px-3 py-1 bg-yellow-500 text-white rounded-lg text-sm font-medium disabled:opacity-50"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setEditingId(null);
                    setEditContent("");
                  }}
                  className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <p className="text-gray-700 whitespace-pre-wrap">{comment.content}</p>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3 mt-2">
            {!isReply && comment.replies && comment.replies.length > 0 && (
              <button
                onClick={() => toggleReplies(comment._id)}
                className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
              >
                {expandedReplies.has(comment._id) ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
                {comment.replies.length}{" "}
                {comment.replies.length === 1 ? "reply" : "replies"}
              </button>
            )}

            {currentUserId && (
              <>
                <button
                  onClick={() => {
                    setReplyTo(comment._id);
                    setReplyContent("");
                  }}
                  className="flex items-center gap-1 text-sm text-gray-500 hover:text-yellow-600"
                >
                  <Reply className="w-4 h-4" />
                  Reply
                </button>

                {currentUserId === comment.author?._id && (
                  <>
                    <button
                      onClick={() => {
                        setEditingId(comment._id);
                        setEditContent(comment.content);
                      }}
                      className="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteComment(comment._id)}
                      className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </>
                )}
              </>
            )}
          </div>

          {/* Reply Input */}
          {replyTo === comment._id && (
            <div className="mt-3 flex gap-2">
              <input
                type="text"
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Write a reply..."
                className="flex-1 px-3 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none text-sm"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmitReply(comment._id);
                  }
                }}
              />
              <button
                onClick={() => handleSubmitReply(comment._id)}
                disabled={!replyContent.trim() || submitting}
                className="px-3 py-2 bg-yellow-500 text-white rounded-xl disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Replies */}
      {!isReply &&
        expandedReplies.has(comment._id) &&
        comment.replies?.map((reply) => renderComment(reply, true))}
    </div>
  );

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-3 animate-pulse">
            <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-24"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
        <MessageSquare className="w-5 h-5 text-yellow-500" />
        Comments ({comments.length})
      </h3>

      {/* New Comment Input */}
      {currentUserId ? (
        <div className="mb-6">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Share your thoughts..."
            rows={3}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none resize-none"
          />
          <div className="flex justify-end mt-2">
            <button
              onClick={handleSubmitComment}
              disabled={!newComment.trim() || submitting}
              className="flex items-center gap-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-full font-medium transition disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              {submitting ? "Posting..." : "Post Comment"}
            </button>
          </div>
        </div>
      ) : (
        <div className="mb-6 p-4 bg-gray-50 rounded-xl text-center text-gray-600">
          <a href="/login" className="text-yellow-600 font-medium hover:underline">
            Login
          </a>{" "}
          to join the conversation.
        </div>
      )}

      {/* Comments List */}
      {comments.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No comments yet. Be the first to share your thoughts!</p>
        </div>
      ) : (
        <div>{comments.map((comment) => renderComment(comment))}</div>
      )}
    </div>
  );
}
