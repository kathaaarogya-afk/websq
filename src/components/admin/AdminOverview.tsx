"use client";

import {
  FileText,
  Clock,
  CheckCircle,
  Users,
  MessageSquare,
  Eye,
  TrendingUp,
} from "lucide-react";

interface AdminStats {
  totalStories: number;
  pendingStories: number;
  publishedStories: number;
  rejectedStories: number;
  totalUsers: number;
  totalComments: number;
}

interface AdminOverviewProps {
  stats: AdminStats;
  loading: boolean;
}

export default function AdminOverview({ stats, loading }: AdminOverviewProps) {
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-6 border border-gray-100 animate-pulse"
            >
              <div className="h-4 bg-gray-200 rounded w-20 mb-3"></div>
              <div className="h-8 bg-gray-200 rounded w-16"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const statCards = [
    {
      label: "Total Stories",
      value: stats.totalStories,
      icon: FileText,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      label: "Pending Approval",
      value: stats.pendingStories,
      icon: Clock,
      color: "text-yellow-600",
      bg: "bg-yellow-100",
    },
    {
      label: "Published",
      value: stats.publishedStories,
      icon: CheckCircle,
      color: "text-green-600",
      bg: "bg-green-100",
    },
    {
      label: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      color: "text-purple-600",
      bg: "bg-purple-100",
    },
    {
      label: "Total Comments",
      value: stats.totalComments,
      icon: MessageSquare,
      color: "text-orange-600",
      bg: "bg-orange-100",
    },
    {
      label: "Rejected Stories",
      value: stats.rejectedStories,
      icon: Eye,
      color: "text-red-600",
      bg: "bg-red-100",
    },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Admin Overview</h2>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition"
          >
            <div className="flex items-center gap-3 mb-3">
              <div
                className={`w-10 h-10 ${card.bg} rounded-xl flex items-center justify-center`}
              >
                <card.icon className={`w-5 h-5 ${card.color}`} />
              </div>
              <span className="text-sm text-gray-500">{card.label}</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-yellow-500" />
          Quick Actions
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          <a
            href="/admin?tab=stories"
            className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-yellow-300 hover:bg-yellow-50 transition"
          >
            <Clock className="w-5 h-5 text-yellow-600" />
            <div>
              <p className="font-medium text-gray-900">Review Pending</p>
              <p className="text-sm text-gray-500">
                {stats.pendingStories} stories waiting
              </p>
            </div>
          </a>
          <a
            href="/admin?tab=users"
            className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-yellow-300 hover:bg-yellow-50 transition"
          >
            <Users className="w-5 h-5 text-purple-600" />
            <div>
              <p className="font-medium text-gray-900">Manage Users</p>
              <p className="text-sm text-gray-500">
                {stats.totalUsers} registered
              </p>
            </div>
          </a>
          <a
            href="/admin?tab=categories"
            className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-yellow-300 hover:bg-yellow-50 transition"
          >
            <FileText className="w-5 h-5 text-blue-600" />
            <div>
              <p className="font-medium text-gray-900">Categories</p>
              <p className="text-sm text-gray-500">Manage categories</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
