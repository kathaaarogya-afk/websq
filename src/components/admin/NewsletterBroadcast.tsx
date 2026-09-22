"use client";

import { useEffect, useState } from "react";
import {
  Mail,
  Send,
  Users,
  Loader2,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import toast from "react-hot-toast";

interface PreviewStory {
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  category: string;
}

export default function NewsletterBroadcast() {
  const [subscribers, setSubscribers] = useState<number | null>(null);
  const [stories, setStories] = useState<PreviewStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetch("/api/admin/newsletter")
      .then((r) => r.json())
      .then((d) => {
        setSubscribers(d.subscribers ?? 0);
        setStories(d.stories || []);
      })
      .catch(() => toast.error("Failed to load newsletter data"))
      .finally(() => setLoading(false));
  }, []);

  const handleSend = async () => {
    if (!subscribers || subscribers === 0) {
      toast.error("No subscribers yet");
      return;
    }
    if (
      !window.confirm(
        `Send this newsletter to ${subscribers} subscriber(s)? This cannot be undone.`
      )
    ) {
      return;
    }
    setSending(true);
    try {
      const res = await fetch("/api/admin/newsletter", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        toast.success(`Newsletter sent to ${data.sent} subscriber(s)`);
      } else {
        toast.error(data.error || "Failed to send newsletter");
      }
    } catch {
      toast.error("Failed to send newsletter");
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-32 bg-white rounded-2xl border border-gray-100 animate-pulse"></div>
        <div className="h-64 bg-white rounded-2xl border border-gray-100 animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Newsletter</h2>

      {/* Send panel */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 bg-yellow-100 rounded-2xl flex items-center justify-center">
            <Mail className="w-7 h-7 text-yellow-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900">
              Send newsletter to subscribers
            </h3>
            <p className="text-sm text-gray-500 flex items-center gap-1.5">
              <Users className="w-4 h-4" />
              {subscribers} subscriber(s) will receive the latest{" "}
              {stories.length} stories by email.
            </p>
          </div>
          <button
            onClick={handleSend}
            disabled={sending || !subscribers || subscribers === 0}
            className="flex items-center gap-2 rounded-xl bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {sending ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Send size={16} />
            )}
            {sending ? "Sending..." : "Send Newsletter"}
          </button>
        </div>

        {subscribers === 0 && (
          <p className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 rounded-xl p-3">
            <AlertTriangle size={16} />
            No subscribers yet. Newsletter is sent whenever someone signs up on
            the site.
          </p>
        )}
      </div>

      {/* Preview */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-green-500" />
          This will be sent to subscribers
        </h3>

        {stories.length === 0 ? (
          <p className="text-sm text-gray-500">
            No approved stories to include. Publish and approve a story first.
          </p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stories.map((story) => (
              <div
                key={story.slug}
                className="rounded-xl border border-gray-200 overflow-hidden"
              >
                {story.coverImage && (
                  <img
                    src={story.coverImage}
                    alt={story.title}
                    className="w-full h-36 object-cover"
                  />
                )}
                <div className="p-4">
                  <span className="text-xs font-medium text-yellow-700 bg-yellow-50 px-2 py-0.5 rounded-full">
                    {story.category}
                  </span>
                  <h4 className="font-bold text-gray-900 mt-2">
                    {story.title}
                  </h4>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                    {story.excerpt}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}