"use client";

import {
  TrendingUp,
  FileText,
  Users,
  MessageSquare,
  Eye,
  FolderTree,
  Clock,
} from "lucide-react";

interface AnalyticsData {
  totalStories: number;
  publishedStories: number;
  pendingStories: number;
  totalUsers: number;
  totalComments: number;
  totalViews: number;
  topCategories: { name: string; count: number }[];
  recentActivity: { type: string; message: string; date: string }[];
}

interface AnalyticsProps {
  data: AnalyticsData;
  loading: boolean;
}

export default function Analytics({ data, loading }: AnalyticsProps) {
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
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

  const stats = [
    {
      label: "Total Stories",
      value: data.totalStories,
      icon: FileText,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      label: "Published",
      value: data.publishedStories,
      icon: TrendingUp,
      color: "text-green-600",
      bg: "bg-green-100",
    },
    {
      label: "Total Users",
      value: data.totalUsers,
      icon: Users,
      color: "text-purple-600",
      bg: "bg-purple-100",
    },
    {
      label: "Total Views",
      value: data.totalViews,
      icon: Eye,
      color: "text-orange-600",
      bg: "bg-orange-100",
    },
  ];

  const maxCategoryCount = Math.max(
    ...data.topCategories.map((c) => c.count),
    1
  );

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Analytics</h2>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-2xl p-6 border border-gray-100"
          >
            <div className="flex items-center gap-3 mb-3">
              <div
                className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center`}
              >
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <span className="text-sm text-gray-500">{stat.label}</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top Categories */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <FolderTree className="w-5 h-5 text-yellow-500" />
            Popular Categories
          </h3>
          {data.topCategories.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No data yet</p>
          ) : (
            <div className="space-y-4">
              {data.topCategories.map((category) => (
                <div key={category.name}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">
                      {category.name}
                    </span>
                    <span className="text-sm text-gray-500">
                      {category.count} stories
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-500 rounded-full"
                      style={{
                        width: `${(category.count / maxCategoryCount) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-yellow-500" />
            Recent Activity
          </h3>
          {data.recentActivity.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No activity yet</p>
          ) : (
            <div className="space-y-4">
              {data.recentActivity.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 pb-4 border-b border-gray-50 last:border-0"
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      activity.type === "story"
                        ? "bg-blue-100"
                        : activity.type === "user"
                        ? "bg-purple-100"
                        : "bg-orange-100"
                    }`}
                  >
                    {activity.type === "story" ? (
                      <FileText className="w-4 h-4 text-blue-600" />
                    ) : activity.type === "user" ? (
                      <Users className="w-4 h-4 text-purple-600" />
                    ) : (
                      <MessageSquare className="w-4 h-4 text-orange-600" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm text-gray-700">{activity.message}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(activity.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
