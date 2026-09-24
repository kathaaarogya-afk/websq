"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  LayoutDashboard,
  FileCheck,
  Users,
  FolderTree,
  MessageSquare,
  BarChart3,
  LogOut,
  Shield,
  Mail,
  ClipboardCheck,
} from "lucide-react";

interface AdminSidebarProps {
  user: {
    name: string;
    email: string;
  };
  onLogout: () => void;
}

const navItems = [
  {
    icon: LayoutDashboard,
    label: "Overview",
    href: "/admin",
    tab: "overview",
  },
  {
    icon: FileCheck,
    label: "Approve Stories",
    href: "/admin?tab=stories",
    tab: "stories",
  },
  {
    icon: Users,
    label: "Manage Users",
    href: "/admin?tab=users",
    tab: "users",
  },
  {
    icon: FolderTree,
    label: "Categories",
    href: "/admin?tab=categories",
    tab: "categories",
  },
  {
    icon: MessageSquare,
    label: "Comments",
    href: "/admin?tab=comments",
    tab: "comments",
  },
  {
    icon: BarChart3,
    label: "Analytics",
    href: "/admin?tab=analytics",
    tab: "analytics",
  },
  {
    icon: Mail,
    label: "Newsletter",
    href: "/admin?tab=newsletter",
    tab: "newsletter",
  },
  {
    icon: ClipboardCheck,
    label: "Content Plan",
    href: "/admin?tab=content-plan",
    tab: "content-plan",
  },
];

export default function AdminSidebar({
  user,
  onLogout,
}: AdminSidebarProps) {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "overview";

  return (
    <aside className="w-full lg:w-72 bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sticky top-24 h-fit">
      {/* Admin Badge */}
      <div className="flex items-center gap-3 pb-6 border-b border-gray-100">
        <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
          <Shield className="w-7 h-7 text-white" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-gray-900 truncate">{user.name}</h3>
            <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">
              Admin
            </span>
          </div>
          <p className="text-sm text-gray-500 truncate">{user.email}</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="mt-6 space-y-2">
        {navItems.map((item) => {
          const isActive = activeTab === item.tab;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition ${
                isActive
                  ? "bg-yellow-50 text-yellow-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="mt-6 pt-6 border-t border-gray-100">
        <button
          onClick={onLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-red-600 hover:bg-red-50 transition w-full"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </aside>
  );
}
