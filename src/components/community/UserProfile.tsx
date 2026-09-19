"use client";

import { useState } from "react";
import Link from "next/link";
import { Calendar, BookOpen, Users, Heart, Flag } from "lucide-react";
import FollowButton from "./FollowButton";
import ReportModal from "./ReportModal";

interface UserProfileData {
  _id: string;
  name: string;
  email?: string;
  image: string;
  bio: string;
  followersCount: number;
  followingCount: number;
  storiesCount: number;
  createdAt: string;
}

interface UserProfileProps {
  user: UserProfileData;
  isOwnProfile?: boolean;
  isFollowing?: boolean;
}

export default function UserProfile({
  user,
  isOwnProfile = false,
  isFollowing = false,
}: UserProfileProps) {
  const [showReport, setShowReport] = useState(false);

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Cover */}
      <div className="h-32 bg-gradient-to-r from-yellow-400 to-orange-500"></div>

      {/* Profile Info */}
      <div className="px-6 pb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 -mt-12">
          {/* Avatar */}
          <div className="w-24 h-24 bg-white rounded-full border-4 border-white shadow-lg flex items-center justify-center text-3xl font-bold text-gray-900">
            {user.image ? (
              <img
                src={user.image}
                alt={user.name}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              user.name.charAt(0).toUpperCase()
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
            {user.bio && (
              <p className="text-gray-600 mt-1 line-clamp-2">{user.bio}</p>
            )}
          </div>

          <div className="flex items-center gap-3">
            {isOwnProfile ? (
              <Link
                href="/dashboard?tab=profile"
                className="px-4 py-2 rounded-full border border-gray-200 text-gray-700 hover:bg-gray-50 font-medium transition"
              >
                Edit Profile
              </Link>
            ) : (
              <>
                <FollowButton
                  userId={user._id}
                  initialFollowing={isFollowing}
                  initialFollowerCount={user.followersCount}
                />
                <button
                  onClick={() => setShowReport(true)}
                  className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-red-500 transition"
                >
                  <Flag size={15} />
                  Report
                </button>
              </>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap gap-6 mt-6 pt-6 border-t border-gray-100">
          <div className="flex items-center gap-2 text-gray-600">
            <BookOpen className="w-5 h-5 text-yellow-500" />
            <span className="font-semibold text-gray-900">
              {user.storiesCount}
            </span>
            <span>Stories</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Users className="w-5 h-5 text-yellow-500" />
            <span className="font-semibold text-gray-900">
              {user.followersCount}
            </span>
            <span>Followers</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Heart className="w-5 h-5 text-yellow-500" />
            <span className="font-semibold text-gray-900">
              {user.followingCount}
            </span>
            <span>Following</span>
          </div>
          <div className="flex items-center gap-2 text-gray-500">
            <Calendar className="w-4 h-4" />
            <span>
              Joined {new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
            </span>
          </div>
        </div>
      </div>

      {showReport && (
        <ReportModal
          targetType="user"
          targetId={user._id}
          targetName={user.name}
          onClose={() => setShowReport(false)}
        />
      )}
    </div>
  );
}
