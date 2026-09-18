"use client";

import Link from "next/link";
import { Clock, Eye, Heart, MessageSquare } from "lucide-react";
import LikeButton from "./LikeButton";
import BookmarkButton from "./BookmarkButton";

interface StoryCardProps {
  story: {
    _id: string;
    title: string;
    slug: string;
    excerpt: string;
    category: string;
    coverImage: string;
    likesCount: number;
    commentsCount: number;
    views: number;
    author: {
      _id: string;
      name: string;
      image: string;
    };
    createdAt: string;
  };
  showActions?: boolean;
  initialLiked?: boolean;
  initialBookmarked?: boolean;
}

export default function StoryCard({
  story,
  showActions = true,
  initialLiked = false,
  initialBookmarked = false,
}: StoryCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 hover:shadow-lg transition overflow-hidden">
      {/* Cover Image */}
      {story.coverImage && (
        <Link href={`/stories/${story.slug}`}>
          <div className="h-48 bg-gray-100 overflow-hidden">
            <img
              src={story.coverImage}
              alt={story.title}
              className="w-full h-full object-cover hover:scale-105 transition duration-300"
            />
          </div>
        </Link>
      )}

      <div className="p-5">
        {/* Category */}
        <span className="inline-block px-3 py-1 bg-yellow-50 text-yellow-700 rounded-full text-xs font-medium mb-3">
          {story.category}
        </span>

        {/* Title */}
        <Link href={`/stories/${story.slug}`}>
          <h3 className="text-xl font-bold text-gray-900 hover:text-yellow-600 transition line-clamp-2 mb-2">
            {story.title}
          </h3>
        </Link>

        {/* Excerpt */}
        {story.excerpt && (
          <p className="text-gray-600 text-sm line-clamp-2 mb-4">
            {story.excerpt}
          </p>
        )}

        {/* Author */}
        <Link
          href={`/profile/${story.author._id}`}
          className="flex items-center gap-2 mb-4"
        >
          <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-xs font-bold text-black">
            {story.author?.image ? (
              <img
                src={story.author.image}
                alt={story.author.name}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              story.author?.name?.charAt(0).toUpperCase() || "?"
            )}
          </div>
          <span className="text-sm font-medium text-gray-700 hover:text-yellow-600">
            {story.author?.name || "Unknown"}
          </span>
        </Link>

        {/* Stats & Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {new Date(story.createdAt).toLocaleDateString()}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              {story.views}
            </span>
            <span className="flex items-center gap-1">
              <Heart className="w-4 h-4" />
              {story.likesCount}
            </span>
            <span className="flex items-center gap-1">
              <MessageSquare className="w-4 h-4" />
              {story.commentsCount}
            </span>
          </div>

          {showActions && (
            <div className="flex items-center gap-2">
              <LikeButton
                storyId={story._id}
                initialLiked={initialLiked}
                initialCount={story.likesCount}
              />
              <BookmarkButton
                storyId={story._id}
                initialBookmarked={initialBookmarked}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
