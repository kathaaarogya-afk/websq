"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import UserProfile from "@/components/community/UserProfile";
import StoryCard from "@/components/community/StoryCard";

interface UserData {
  _id: string;
  name: string;
  image: string;
  bio: string;
  followersCount: number;
  followingCount: number;
  storiesCount: number;
  createdAt: string;
}

interface Story {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  coverImage: string;
  likesCount: number;
  commentsCount: number;
  views: number;
  author: { _id: string; name: string; image: string };
  createdAt: string;
}

export default function ProfilePage() {
  const params = useParams();
  const userId = params.id as string;

  const [user, setUser] = useState<UserData | null>(null);
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);

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

  const fetchProfile = useCallback(async () => {
    try {
      const res = await fetch(`/api/users/${userId}`);
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setStories(data.stories || []);

        // Check if following
        if (data.isFollowing !== undefined) {
          setIsFollowing(data.isFollowing);
        }
      }
    } catch {
      // API not connected yet
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchProfile();
    fetchCurrentUser();
  }, [userId, fetchProfile, fetchCurrentUser]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-orange-50 py-8 px-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden animate-pulse">
            <div className="h-32 bg-gray-200"></div>
            <div className="px-6 pb-6">
              <div className="flex items-end gap-4 -mt-12">
                <div className="w-24 h-24 bg-gray-200 rounded-full border-4 border-white"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-6 bg-gray-200 rounded w-32"></div>
                  <div className="h-4 bg-gray-200 rounded w-48"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">User not found</h1>
          <p className="text-gray-600">This profile doesn&apos;t exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-orange-50 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <UserProfile
          user={user}
          isOwnProfile={currentUserId === userId}
          isFollowing={isFollowing}
        />

        {/* User's Stories */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Published Stories ({stories.length})
          </h2>
          {stories.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 border border-gray-100 text-center">
              <p className="text-gray-500">No published stories yet.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {stories.map((story) => (
                <StoryCard
                  key={story._id}
                  story={story}
                  showActions={!!currentUserId && currentUserId !== userId}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
