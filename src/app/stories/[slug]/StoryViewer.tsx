"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Clock, Eye, ArrowLeft, Flag, BookOpen } from "lucide-react";
import LikeButton from "@/components/community/LikeButton";
import BookmarkButton from "@/components/community/BookmarkButton";
import FollowButton from "@/components/community/FollowButton";
import CommentSection from "@/components/community/CommentSection";
import ReportModal from "@/components/community/ReportModal";
import ShareButtons from "@/components/ShareButtons";
import StoryReactions from "@/components/StoryReactions";
import SocialProof from "@/components/SocialProof";
import MarkdownContent from "@/components/MarkdownContent";

interface StoryData {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  category: string;
  coverImage: string;
  images: string[];
  likesCount: number;
  commentsCount: number;
  views: number;
  author: {
    _id: string;
    name: string;
    image: string;
    bio: string;
    followersCount: number;
  };
  createdAt: string;
}

interface RelatedStory {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  category: string;
  coverImage?: string;
  author?: { _id: string; name: string };
}

function getReadingTime(text: string): number {
  const wordsPerMinute = 200;
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}

export default function StoryViewer({
  slug,
  initialStory,
  initialRelated,
}: {
  slug: string;
  initialStory?: StoryData | null;
  initialRelated?: RelatedStory[];
}) {
  const [story, setStory] = useState<StoryData | null>(initialStory || null);
  const [relatedStories, setRelatedStories] = useState<RelatedStory[]>(
    initialRelated || []
  );
  const [loading, setLoading] = useState(() => !initialStory);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [showReport, setShowReport] = useState(false);

  const fetchCurrentUser = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        setCurrentUserId(data.user.id);
      }
    } catch {
      // Not logged in
    }
  }, []);

  const fetchStory = useCallback(async () => {
    try {
      const res = await fetch(`/api/stories/${slug}`);
      if (res.ok) {
        const data = await res.json();
        setStory(data.story);

        if (
          data.story?.category &&
          (!initialRelated || initialRelated.length === 0)
        ) {
          const relRes = await fetch(
            `/api/stories?category=${data.story.category}&limit=4`
          );
          if (relRes.ok) {
            const relData = await relRes.json();
            setRelatedStories(
              (relData.stories || [])
                .filter((s: RelatedStory) => s.slug !== slug)
                .slice(0, 3)
            );
          }
        }
      }
    } catch {
      // API not connected yet
    } finally {
      setLoading(false);
    }
  }, [slug, initialRelated]);

  useEffect(() => {
    fetchStory();
    fetchCurrentUser();
  }, [slug, fetchStory, fetchCurrentUser]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-orange-50 py-8 px-4">
        <div className="max-w-3xl mx-auto animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-32 mb-8"></div>
          <div className="h-64 bg-gray-200 rounded-2xl mb-8"></div>
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Story not found
          </h1>
          <p className="text-gray-600">
            This story doesn&apos;t exist or has been removed.
          </p>
          <Link
            href="/stories"
            className="inline-flex items-center gap-2 mt-4 text-yellow-600 hover:text-yellow-700 font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Stories
          </Link>
        </div>
      </div>
    );
  }

  const isAuthor = currentUserId === story.author._id;
  const readingTime = getReadingTime(story.content);

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-orange-50 py-8 px-4">
      <article className="max-w-3xl mx-auto">
        {/* Back Link */}
        <Link
          href="/stories"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Stories
        </Link>

        {/* Social Proof */}
        <div className="mb-6">
          <SocialProof storyId={story._id} />
        </div>

        {/* Cover Image */}
        {story.coverImage && (
          <div className="rounded-2xl overflow-hidden mb-8 shadow-lg">
            <img
              src={story.coverImage}
              alt={story.title}
              className="w-full h-64 md:h-96 object-cover"
              fetchPriority="high"
            />
          </div>
        )}

        {/* Category */}
        <span className="inline-block px-4 py-1.5 bg-yellow-50 text-yellow-700 rounded-full text-sm font-medium mb-4">
          {story.category}
        </span>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight text-balance">
          {story.title}
        </h1>

        {/* Author + Meta + Share */}
        <div className="flex items-center justify-between flex-wrap gap-4 mb-8 pb-8 border-b border-gray-200">
          <Link
            href={`/profile/${story.author._id}`}
            className="flex items-center gap-3"
          >
            <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center text-lg font-bold text-black overflow-hidden">
              {story.author?.image ? (
                <img
                  src={story.author.image}
                  alt={story.author.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                story.author?.name?.charAt(0).toUpperCase() || "?"
              )}
            </div>
            <div>
              <p className="font-medium text-gray-900 hover:text-yellow-600">
                {story.author?.name || "Unknown"}
              </p>
              <p className="text-sm text-gray-500">
                {story.author?.followersCount || 0} followers
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {new Date(story.createdAt).toLocaleDateString("en-AU", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
            <span className="flex items-center gap-1">
              <BookOpen className="w-4 h-4" />
              {readingTime} min read
            </span>
            <span className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              {story.views} views
            </span>
          </div>
        </div>

        {/* Share Buttons */}
        <div className="flex items-center justify-between mb-8">
          <p className="text-sm font-medium text-gray-700">Share this story</p>
          <ShareButtons title={story.title} slug={story.slug} />
        </div>

        {/* Story Content */}
        <div className="mb-8">
          <MarkdownContent content={story.content} />
        </div>

        {/* Story Images */}
        {story.images && story.images.length > 0 && (
          <div className="grid grid-cols-2 gap-4 mb-8">
            {story.images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Story image ${index + 1}`}
                className="rounded-xl w-full h-48 object-cover"
              />
            ))}
          </div>
        )}

        {/* Related Stories - SEO internal links at end of article */}
        {relatedStories.length > 0 && (
          <section className="mt-16 pt-12 border-t border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              More in {story.category}
            </h2>
            <div className="grid sm:grid-cols-3 gap-6">
              {relatedStories.map((rel) => (
                <Link
                  key={rel._id}
                  href={`/stories/${rel.slug}`}
                  className="group"
                >
                  {rel.coverImage && (
                    <div className="rounded-xl overflow-hidden mb-3 aspect-[16/10]">
                      <img
                        src={rel.coverImage}
                        alt={rel.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                    </div>
                  )}
                  <span className="text-xs font-medium text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded-full">
                    {rel.category}
                  </span>
                  <h3 className="font-bold text-gray-900 mt-2 group-hover:text-yellow-600 transition line-clamp-2">
                    {rel.title}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    by {rel.author?.name}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Actions Bar */}
        <div className="flex items-center justify-between flex-wrap gap-4 py-6 border-t border-b border-gray-200 mb-8">
          <div className="flex items-center gap-3">
            <LikeButton
              storyId={story._id}
              initialCount={story.likesCount}
            />
            <BookmarkButton storyId={story._id} />
          </div>

          <div className="flex items-center gap-3">
            <ShareButtons title={story.title} slug={story.slug} />

            {!isAuthor && currentUserId && (
              <FollowButton
                userId={story.author._id}
                initialFollowerCount={story.author.followersCount}
                size="sm"
              />
            )}

            {!isAuthor && currentUserId && (
              <button
                onClick={() => setShowReport(true)}
                className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-red-500 transition ml-2"
              >
                <Flag size={15} />
                Report
              </button>
            )}
          </div>
        </div>

        {/* Reactions */}
        <div className="flex justify-center mb-8">
          <StoryReactions storyId={story._id} />
        </div>

        {/* Report Modal */}
        {showReport && (
          <ReportModal
            targetType="story"
            targetId={story._id}
            targetName={story.title}
            onClose={() => setShowReport(false)}
          />
        )}

        {/* Comments Section */}
        <CommentSection
          storyId={story._id}
          currentUserId={currentUserId || undefined}
        />
      </article>
    </div>
  );
}