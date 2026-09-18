"use client";

import Link from "next/link";
import { Edit, Eye, Clock, Trash2 } from "lucide-react";

interface Story {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  coverImage: string;
  status: "draft" | "published";
  createdAt: string;
  publishedAt?: string;
}

interface MyStoriesProps {
  stories: Story[];
  loading: boolean;
  onDelete: (id: string) => void;
}

export default function MyStories({ stories, loading, onDelete }: MyStoriesProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 animate-pulse">
            <div className="flex gap-4">
              <div className="w-32 h-24 bg-gray-200 rounded-xl"></div>
              <div className="flex-1 space-y-3">
                <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (stories.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-12 border border-gray-100 text-center">
        <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Edit className="w-10 h-10 text-yellow-500" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">No stories yet</h3>
        <p className="text-gray-500 mb-6">
          Start writing your first story and share it with the world.
        </p>
        <Link
          href="/write"
          className="inline-flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-full font-medium transition"
        >
          Write Your First Story
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {stories.map((story) => (
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
                  <h3 className="font-bold text-gray-900 truncate">
                    {story.title}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-1">
                    {story.excerpt || "No excerpt"}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
                    story.status === "published"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {story.status === "published" ? "Published" : "Draft"}
                </span>
              </div>

              <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {new Date(story.createdAt).toLocaleDateString()}
                </span>
                <span className="bg-yellow-50 text-yellow-700 px-2 py-0.5 rounded-full text-xs">
                  {story.category}
                </span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 mt-4">
                <Link
                  href={`/write?edit=${story._id}`}
                  className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-yellow-600 px-3 py-1.5 rounded-lg hover:bg-yellow-50 transition"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </Link>
                {story.status === "published" && (
                  <Link
                    href={`/stories/${story.slug}`}
                    className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition"
                  >
                    <Eye className="w-4 h-4" />
                    View
                  </Link>
                )}
                <button
                  onClick={() => onDelete(story._id)}
                  className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-50 transition ml-auto"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
