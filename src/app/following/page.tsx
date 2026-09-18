"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Users, UserPlus } from "lucide-react";
import FollowButton from "@/components/community/FollowButton";

interface FollowedUser {
  _id: string;
  name: string;
  image: string;
  bio: string;
  storiesCount: number;
  followersCount: number;
}

export default function FollowingPage() {
  const router = useRouter();
  const [following, setFollowing] = useState<FollowedUser[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFollowing = useCallback(async () => {
    try {
      const res = await fetch("/api/users/me/following");
      if (res.ok) {
        const data = await res.json();
        setFollowing(data.following || []);
      } else if (res.status === 401) {
        router.push("/login");
      }
    } catch {
      // API not connected yet
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchFollowing();
  }, [fetchFollowing]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-orange-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="h-8 bg-gray-200 rounded w-48 mb-8 animate-pulse"></div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 border border-gray-100 animate-pulse"
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                    <div className="h-3 bg-gray-200 rounded w-32"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-orange-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
          <Users className="w-8 h-8 text-yellow-500" />
          Following
        </h1>
        <p className="text-gray-600 mb-8">
          Writers you follow. Their stories appear in your feed.
        </p>

        {following.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 border border-gray-100 text-center">
            <UserPlus className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Not following anyone yet
            </h3>
            <p className="text-gray-500 mb-6">
              Follow writers to see their stories in your feed.
            </p>
            <Link
              href="/stories"
              className="inline-flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-full font-medium transition"
            >
              Discover Writers
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {following.map((user) => (
              <div
                key={user._id}
                className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition"
              >
                <div className="flex items-center gap-4 mb-4">
                  <Link href={`/profile/${user._id}`}>
                    <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center text-xl font-bold text-black overflow-hidden">
                      {user.image ? (
                        <img
                          src={user.image}
                          alt={user.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        user.name.charAt(0).toUpperCase()
                      )}
                    </div>
                  </Link>
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/profile/${user._id}`}
                      className="font-bold text-gray-900 hover:text-yellow-600 truncate block"
                    >
                      {user.name}
                    </Link>
                    <p className="text-sm text-gray-500 line-clamp-1">
                      {user.bio || "No bio"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span>{user.storiesCount} stories</span>
                  <span>{user.followersCount} followers</span>
                </div>

                <FollowButton
                  userId={user._id}
                  initialFollowing={true}
                  initialFollowerCount={user.followersCount}
                  size="sm"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
