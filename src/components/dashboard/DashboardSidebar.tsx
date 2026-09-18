"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  PenSquare,
  BookOpen,
  FileText,
  User,
  LogOut,
} from "lucide-react";

interface DashboardSidebarProps {
  user: {
    name: string;
    email: string;
  };
  onLogout: () => void;
}

const navItems = [
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    href: "/dashboard",
  },
  {
    icon: PenSquare,
    label: "Write New Story",
    href: "/write",
  },
  {
    icon: BookOpen,
    label: "Published",
    href: "/dashboard?tab=published",
  },
  {
    icon: FileText,
    label: "Drafts",
    href: "/dashboard?tab=drafts",
  },
  {
    icon: User,
    label: "Profile",
    href: "/dashboard?tab=profile",
  },
];

export default function DashboardSidebar({
  user,
  onLogout,
}: DashboardSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="w-full lg:w-72 bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sticky top-24 h-fit">
      {/* User Info */}
      <div className="flex items-center gap-4 pb-6 border-b border-gray-100">
        <div className="w-14 h-14 bg-yellow-400 rounded-full flex items-center justify-center text-xl font-bold text-black">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0">
          <h3 className="font-bold text-gray-900 truncate">{user.name}</h3>
          <p className="text-sm text-gray-500 truncate">{user.email}</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="mt-6 space-y-2">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname + "?tab=" === item.href;
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
