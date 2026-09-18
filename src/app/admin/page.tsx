"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminOverview from "@/components/admin/AdminOverview";
import ApproveStories from "@/components/admin/ApproveStories";
import ManageUsers from "@/components/admin/ManageUsers";
import ManageCategories from "@/components/admin/ManageCategories";
import ManageComments from "@/components/admin/ManageComments";
import Analytics from "@/components/admin/Analytics";

interface UserData {
  id: string;
  name: string;
  email: string;
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
  adminStatus: "pending" | "approved" | "rejected";
  rejectionReason?: string;
  views: number;
  author: { _id: string; name: string; email: string };
  createdAt: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  active: boolean;
  createdAt: string;
}

interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
  storyCount: number;
  createdAt: string;
}

interface Comment {
  _id: string;
  content: string;
  status: "visible" | "hidden";
  author: { _id: string; name: string; email: string };
  story: { _id: string; title: string };
  createdAt: string;
}

export default function AdminPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "overview";

  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  const [stories, setStories] = useState<Story[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (!res.ok) {
          router.push("/login");
          return;
        }
        const data = await res.json();
        if (data.user.role !== "admin") {
          toast.error("Access denied. Admin only.");
          router.push("/dashboard");
          return;
        }
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
      fetchAllData();
    }
  }, [user]);

  const fetchAllData = async () => {
    setDataLoading(true);
    try {
      const [storiesRes, usersRes, categoriesRes, commentsRes] =
        await Promise.all([
          fetch("/api/admin/stories"),
          fetch("/api/admin/users"),
          fetch("/api/admin/categories"),
          fetch("/api/admin/comments"),
        ]);

      if (storiesRes.ok) {
        const data = await storiesRes.json();
        setStories(data.stories || []);
      }
      if (usersRes.ok) {
        const data = await usersRes.json();
        setUsers(data.users || []);
      }
      if (categoriesRes.ok) {
        const data = await categoriesRes.json();
        setCategories(data.categories || []);
      }
      if (commentsRes.ok) {
        const data = await commentsRes.json();
        setComments(data.comments || []);
      }
    } catch {
      // API routes not connected yet
    } finally {
      setDataLoading(false);
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

  // Story actions
  const handleApproveStory = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/stories/${id}/approve`, {
        method: "PUT",
      });
      if (res.ok) {
        toast.success("Story approved");
        setStories(
          stories.map((s) =>
            s._id === id ? { ...s, adminStatus: "approved" } : s
          )
        );
      } else {
        toast.error("Failed to approve story");
      }
    } catch {
      toast.error("Failed to approve story");
    }
  };

  const handleRejectStory = async (id: string, reason: string) => {
    try {
      const res = await fetch(`/api/admin/stories/${id}/reject`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason }),
      });
      if (res.ok) {
        toast.success("Story rejected");
        setStories(
          stories.map((s) =>
            s._id === id
              ? { ...s, adminStatus: "rejected", rejectionReason: reason }
              : s
          )
        );
      } else {
        toast.error("Failed to reject story");
      }
    } catch {
      toast.error("Failed to reject story");
    }
  };

  const handleDeleteStory = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/stories/${id}`, {
        method: "DELETE",
      });
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

  // User actions
  const handleToggleUserRole = async (id: string, newRole: string) => {
    try {
      const res = await fetch(`/api/admin/users/${id}/role`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
      if (res.ok) {
        toast.success("User role updated");
        setUsers(
          users.map((u) => (u._id === id ? { ...u, role: newRole } : u))
        );
      } else {
        toast.error("Failed to update user role");
      }
    } catch {
      toast.error("Failed to update user role");
    }
  };

  const handleToggleUserActive = async (id: string, active: boolean) => {
    try {
      const res = await fetch(`/api/admin/users/${id}/active`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active }),
      });
      if (res.ok) {
        toast.success(active ? "User activated" : "User deactivated");
        setUsers(
          users.map((u) => (u._id === id ? { ...u, active } : u))
        );
      } else {
        toast.error("Failed to update user");
      }
    } catch {
      toast.error("Failed to update user");
    }
  };

  const handleDeleteUser = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("User deleted");
        setUsers(users.filter((u) => u._id !== id));
      } else {
        toast.error("Failed to delete user");
      }
    } catch {
      toast.error("Failed to delete user");
    }
  };

  // Category actions
  const handleCreateCategory = async (data: {
    name: string;
    description: string;
    color: string;
  }) => {
    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const result = await res.json();
        toast.success("Category created");
        setCategories([...categories, result.category]);
      } else {
        toast.error("Failed to create category");
      }
    } catch {
      toast.error("Failed to create category");
    }
  };

  const handleUpdateCategory = async (
    id: string,
    data: { name: string; description: string; color: string }
  ) => {
    try {
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        toast.success("Category updated");
        setCategories(
          categories.map((c) => (c._id === id ? { ...c, ...data } : c))
        );
      } else {
        toast.error("Failed to update category");
      }
    } catch {
      toast.error("Failed to update category");
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("Category deleted");
        setCategories(categories.filter((c) => c._id !== id));
      } else {
        toast.error("Failed to delete category");
      }
    } catch {
      toast.error("Failed to delete category");
    }
  };

  // Comment actions
  const handleToggleCommentStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/admin/comments/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        toast.success(status === "visible" ? "Comment visible" : "Comment hidden");
        setComments(
          comments.map((c) =>
            c._id === id ? { ...c, status: status as "visible" | "hidden" } : c
          )
        );
      } else {
        toast.error("Failed to update comment");
      }
    } catch {
      toast.error("Failed to update comment");
    }
  };

  const handleDeleteComment = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/comments/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("Comment deleted");
        setComments(comments.filter((c) => c._id !== id));
      } else {
        toast.error("Failed to delete comment");
      }
    } catch {
      toast.error("Failed to delete comment");
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

  const pendingStories = stories.filter((s) => s.adminStatus === "pending");
  const publishedStories = stories.filter((s) => s.adminStatus === "approved");
  const rejectedStories = stories.filter((s) => s.adminStatus === "rejected");

  const getTabContent = () => {
    switch (activeTab) {
      case "stories":
        return (
          <ApproveStories
            stories={stories}
            loading={dataLoading}
            onApprove={handleApproveStory}
            onReject={handleRejectStory}
            onDelete={handleDeleteStory}
          />
        );
      case "users":
        return (
          <ManageUsers
            users={users}
            loading={dataLoading}
            onToggleRole={handleToggleUserRole}
            onToggleActive={handleToggleUserActive}
            onDelete={handleDeleteUser}
          />
        );
      case "categories":
        return (
          <ManageCategories
            categories={categories}
            loading={dataLoading}
            onCreate={handleCreateCategory}
            onUpdate={handleUpdateCategory}
            onDelete={handleDeleteCategory}
          />
        );
      case "comments":
        return (
          <ManageComments
            comments={comments}
            loading={dataLoading}
            onToggleStatus={handleToggleCommentStatus}
            onDelete={handleDeleteComment}
          />
        );
      case "analytics":
        return (
          <Analytics
            data={{
              totalStories: stories.length,
              publishedStories: publishedStories.length,
              pendingStories: pendingStories.length,
              totalUsers: users.length,
              totalComments: comments.length,
              totalViews: stories.reduce((sum, s) => sum + (s.views || 0), 0),
              topCategories: Object.entries(
                stories.reduce((acc, s) => {
                  acc[s.category] = (acc[s.category] || 0) + 1;
                  return acc;
                }, {} as Record<string, number>)
              )
                .map(([name, count]) => ({ name, count }))
                .sort((a, b) => b.count - a.count)
                .slice(0, 5),
              recentActivity: [
                ...stories.slice(0, 3).map((s) => ({
                  type: "story" as const,
                  message: `New story "${s.title}" submitted`,
                  date: s.createdAt,
                })),
                ...users.slice(0, 3).map((u) => ({
                  type: "user" as const,
                  message: `${u.name} joined`,
                  date: u.createdAt,
                })),
              ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5),
            }}
            loading={dataLoading}
          />
        );
      default:
        return (
          <AdminOverview
            stats={{
              totalStories: stories.length,
              pendingStories: pendingStories.length,
              publishedStories: publishedStories.length,
              rejectedStories: rejectedStories.length,
              totalUsers: users.length,
              totalComments: comments.length,
            }}
            loading={dataLoading}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-orange-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <AdminSidebar user={user} onLogout={handleLogout} />

          {/* Main Content */}
          <main className="flex-1 min-w-0">{getTabContent()}</main>
        </div>
      </div>
    </div>
  );
}
