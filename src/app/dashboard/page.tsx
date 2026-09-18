"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import MyStories from "@/components/writer/MyStories";

interface UserData {
  id: string;
  name: string;
  email: string;
  image: string;
  bio: string;
  role: string;
}

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

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
        </div>
      }
    >
      <DashboardPageContent />
    </Suspense>
  );
}

function DashboardPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "overview";

  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [stories, setStories] = useState<Story[]>([]);
  const [storiesLoading, setStoriesLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (!res.ok) {
          router.push("/login");
          return;
        }
        const data = await res.json();
        setUser(data.user);
      } catch {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  useEffect(() => {
    if (user) {
      fetchStories();
    }
  }, [user]);

  const fetchStories = async () => {
    try {
      setStoriesLoading(true);
      const res = await fetch("/api/stories/my-stories");
      if (res.ok) {
        const data = await res.json();
        setStories(data.stories || []);
      }
    } catch {
      // Stories not connected yet
      setStories([]);
    } finally {
      setStoriesLoading(false);
    }
  };

  const handleProfileSave = async () => {
    try {
      const nameInput = document.querySelector<HTMLInputElement>("#profile-name");
      const bioInput = document.querySelector<HTMLTextAreaElement>("#profile-bio");
      const res = await fetch("/api/users/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: nameInput?.value, bio: bioInput?.value }),
      });
      if (res.ok) {
        const data = await res.json();
        setUser({ ...user!, name: data.user.name, bio: data.user.bio });
        toast.success("Profile updated");
      } else {
        toast.error("Failed to update profile");
      }
    } catch {
      toast.error("Failed to update profile");
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      toast.success("Logged out successfully");
      router.push("/");
    } catch {
      toast.error("Logout failed");
    }
  };

  const handleDeleteStory = async (id: string) => {
    if (!confirm("Are you sure you want to delete this story?")) return;

    try {
      const res = await fetch(`/api/admin/stories/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Story deleted");
        setStories(stories.filter((s) => s._id !== id));
      } else {
        toast.error("Failed to delete story");
      }
    } catch {
      toast.error("Failed to delete story");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

  if (!user) return null;

  const publishedStories = stories.filter((s) => s.status === "published");
  const draftStories = stories.filter((s) => s.status === "draft");

  const getTabContent = () => {
    switch (activeTab) {
      case "published":
        return (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Published Stories
            </h2>
            <MyStories
              stories={publishedStories}
              loading={storiesLoading}
              onDelete={handleDeleteStory}
            />
          </div>
        );
      case "drafts":
        return (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Draft Stories
            </h2>
            <MyStories
              stories={draftStories}
              loading={storiesLoading}
              onDelete={handleDeleteStory}
            />
          </div>
        );
      case "profile":
        return (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Profile Settings
            </h2>
            <div className="bg-white rounded-2xl p-8 border border-gray-100">
              <div className="flex items-center gap-6 mb-8">
                <div className="w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center text-3xl font-bold text-black">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {user.name}
                  </h3>
                  <p className="text-gray-500">{user.email}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="profile-name"
                    defaultValue={user.name}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bio
                  </label>
                  <textarea
                    id="profile-bio"
                    defaultValue={user.bio}
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none resize-none"
                    placeholder="Tell us about yourself..."
                  />
                </div>
                <button
                  onClick={handleProfileSave}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-full font-medium transition"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div>
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-2xl p-6 border border-gray-100">
                <p className="text-sm text-gray-500">Total Stories</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {stories.length}
                </p>
              </div>
              <div className="bg-white rounded-2xl p-6 border border-gray-100">
                <p className="text-sm text-gray-500">Published</p>
                <p className="text-3xl font-bold text-green-600 mt-1">
                  {publishedStories.length}
                </p>
              </div>
              <div className="bg-white rounded-2xl p-6 border border-gray-100">
                <p className="text-sm text-gray-500">Drafts</p>
                <p className="text-3xl font-bold text-gray-500 mt-1">
                  {draftStories.length}
                </p>
              </div>
              <div className="bg-white rounded-2xl p-6 border border-gray-100">
                <p className="text-sm text-gray-500">Categories</p>
                <p className="text-3xl font-bold text-yellow-600 mt-1">
                  {new Set(stories.map((s) => s.category)).size}
                </p>
              </div>
            </div>

            {/* Recent Stories */}
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Recent Stories
            </h2>
            <MyStories
              stories={stories.slice(0, 5)}
              loading={storiesLoading}
              onDelete={handleDeleteStory}
            />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-orange-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <DashboardSidebar user={user} onLogout={handleLogout} />

          {/* Main Content */}
          <main className="flex-1 min-w-0">{getTabContent()}</main>
        </div>
      </div>
    </div>
  );
}
