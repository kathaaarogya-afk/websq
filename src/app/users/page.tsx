"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Users as UsersIcon, BookOpen, UserPlus, UserCheck, Search, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";

interface UserData {
  _id: string;
  name: string;
  image: string;
  bio: string;
  storyCount: number;
  followersCount: number;
  createdAt: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [followingIds, setFollowingIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [followLoading, setFollowLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/users");
      if (res.ok) {
        const data = await res.json();
        setUsers(data.writers || []);
        setFollowingIds(data.followingIds || []);
      }
    } catch {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async (userId: string) => {
    setFollowLoading(userId);
    try {
      const res = await fetch(`/api/users/${userId}/follow`, {
        method: "POST",
      });
      if (res.ok) {
        const data = await res.json();
        if (data.following) {
          setFollowingIds((prev) => [...prev, userId]);
          setUsers((prev) =>
            prev.map((u) =>
              u._id === userId
                ? { ...u, followersCount: data.followersCount }
                : u
            )
          );
          toast.success("Following!");
        } else {
          setFollowingIds((prev) => prev.filter((id) => id !== userId));
          setUsers((prev) =>
            prev.map((u) =>
              u._id === userId
                ? { ...u, followersCount: data.followersCount }
                : u
            )
          );
          toast.success("Unfollowed");
        }
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to follow");
      }
    } catch {
      toast.error("Failed to follow user");
    } finally {
      setFollowLoading(null);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.bio.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-orange-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-orange-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-yellow-600 mb-4 transition"
          >
            <ArrowLeft size={18} />
            Back to Home
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <UsersIcon className="text-yellow-500" size={32} />
                Community
              </h1>
              <p className="text-gray-500 mt-1">
                Discover writers and connect with the community
              </p>
            </div>

            {/* Search */}
            <div className="relative">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-80 pl-11 pr-4 py-3 rounded-2xl border border-gray-200 bg-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition"
              />
            </div>
          </div>
        </div>

        {/* Users Grid */}
        {filteredUsers.length === 0 ? (
          <div className="text-center py-16">
            <UsersIcon className="mx-auto text-gray-300 mb-4" size={64} />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No users found
            </h3>
            <p className="text-gray-500">
              {searchQuery
                ? "Try a different search term"
                : "Be the first to join the community!"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsers.map((user) => {
              const isFollowing = followingIds.includes(user._id);
              return (
                <div
                  key={user._id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 overflow-hidden group"
                >
                  {/* Cover / Avatar Section */}
                  <div className="relative h-24 bg-gradient-to-r from-yellow-400 to-orange-400">
                    <div className="absolute -bottom-10 left-6">
                      <Link href={`/profile/${user._id}`}>
                        {user.image ? (
                          <img
                            src={user.image}
                            alt={user.name}
                            className="w-20 h-20 rounded-2xl border-4 border-white object-cover shadow-md group-hover:scale-105 transition-transform"
                          />
                        ) : (
                          <div className="w-20 h-20 bg-white rounded-2xl border-4 border-white shadow-md flex items-center justify-center text-2xl font-bold text-yellow-500 group-hover:scale-105 transition-transform">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </Link>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="pt-13 p-6">
                    <Link href={`/profile/${user._id}`}>
                      <h3 className="text-lg font-bold text-gray-900 hover:text-yellow-600 transition truncate">
                        {user.name}
                      </h3>
                    </Link>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2 min-h-[40px]">
                      {user.bio || "No bio yet"}
                    </p>

                    {/* Stats */}
                    <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-1.5 text-gray-600">
                        <BookOpen size={16} className="text-yellow-500" />
                        <span className="text-sm font-semibold">
                          {user.storyCount}
                        </span>
                        <span className="text-sm text-gray-400">posts</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-gray-600">
                        <UsersIcon size={16} className="text-orange-500" />
                        <span className="text-sm font-semibold">
                          {user.followersCount}
                        </span>
                        <span className="text-sm text-gray-400">followers</span>
                      </div>
                    </div>

                    {/* Follow Button */}
                    <button
                      onClick={() => handleFollow(user._id)}
                      disabled={followLoading === user._id}
                      className={`w-full mt-4 py-2.5 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition ${
                        isFollowing
                          ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          : "bg-yellow-500 text-white hover:bg-yellow-600"
                      } disabled:opacity-50`}
                    >
                      {followLoading === user._id ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent"></div>
                      ) : isFollowing ? (
                        <>
                          <UserCheck size={16} />
                          Following
                        </>
                      ) : (
                        <>
                          <UserPlus size={16} />
                          Follow
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
