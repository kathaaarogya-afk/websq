"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Menu, X, Search, Bell, ChevronDown, Check, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

interface UserData {
  id: string;
  name: string;
  email: string;
  image: string;
}

interface NotificationData {
  _id: string;
  fromUser?: { name: string; image?: string } | null;
  type: string;
  message: string;
  link?: string;
  read: boolean;
  createdAt: string;
}

const notifIcons: Record<string, string> = {
  follow: "👤",
  like: "❤️",
  comment: "💬",
  comment_reply: "↩️",
  story_approved: "✅",
  story_rejected: "❌",
};

export default function Header() {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifPanel, setShowNotifPanel] = useState(false);
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const notifRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      }
    };
    fetchUser();
  }, [pathname]);

  useEffect(() => {
    if (!user) return;
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifPanel(false);
      }
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch {}
  };

  const markAllRead = async () => {
    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "read_all" }),
      });
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch {}
  };

  const markOneRead = async (id: string) => {
    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "read_one", notificationId: id }),
      });
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch {}
  };

  const clearAll = async () => {
    try {
      await fetch("/api/notifications", { method: "DELETE" });
      setNotifications([]);
      setUnreadCount(0);
    } catch {}
  };

  const handleNotifClick = (notif: NotificationData) => {
    if (!notif.read) markOneRead(notif._id);
    if (notif.link) {
      setShowNotifPanel(false);
      router.push(notif.link);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      toast.success("Logged out successfully");
      router.push("/");
    } catch {
      toast.error("Logout failed");
    }
  };

  const timeAgo = (date: string) => {
    const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return "just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return new Date(date).toLocaleDateString("en-AU", { day: "numeric", month: "short" });
  };

  const publicNavItems = [
    { name: "Home", href: "/" },
    { name: "Stories", href: "/stories" },
    { name: "Discover", href: "/categories" },
    { name: "Daily ✨", href: "/daily" },
    { name: "Writers", href: "/writers" },
    { name: "Write", href: "/write" },
  ];

  const authNavItems = [
    { name: "Home", href: "/" },
    { name: "Stories", href: "/stories" },
    { name: "Discover", href: "/categories" },
    { name: "Daily ✨", href: "/daily" },
    { name: "Writers", href: "/writers" },
    { name: "Write", href: "/write" },
  ];

  const navItems = user ? authNavItems : publicNavItems;

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white shadow-md" : "bg-white/90 backdrop-blur-md"
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logo.svg"
              alt="WebSQ"
              width={48}
              height={48}
              priority
            />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">WebSQ</h2>
              <p className="text-sm text-yellow-600 font-medium">
                Every Story Matters. Every Voice Belongs.
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-yellow-500 font-medium transition"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right Side */}
          <div className="hidden lg:flex items-center gap-4">
            <button className="w-10 h-10 rounded-full hover:bg-yellow-100 flex items-center justify-center transition">
              <Search size={20} />
            </button>

            {user ? (
              <>
                {/* Notification Bell */}
                <div className="relative" ref={notifRef}>
                  <button
                    onClick={() => {
                      setShowNotifPanel(!showNotifPanel);
                      setShowDropdown(false);
                    }}
                    className="w-10 h-10 rounded-full hover:bg-yellow-100 flex items-center justify-center transition relative"
                  >
                    <Bell size={20} />
                    {unreadCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 animate-pulse">
                        {unreadCount > 99 ? "99+" : unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Notification Panel */}
                  {showNotifPanel && (
                    <div className="absolute right-0 mt-2 w-[380px] bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
                      {/* Panel Header */}
                      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-gray-900">Notifications</h3>
                          {unreadCount > 0 && (
                            <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-0.5 rounded-full">
                              {unreadCount}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          {unreadCount > 0 && (
                            <button
                              onClick={markAllRead}
                              className="text-xs text-yellow-600 hover:text-yellow-700 font-medium px-2 py-1 rounded-lg hover:bg-yellow-50 transition"
                            >
                              <Check size={14} className="inline mr-1" />
                              Mark all read
                            </button>
                          )}
                          {notifications.length > 0 && (
                            <button
                              onClick={clearAll}
                              className="text-xs text-gray-400 hover:text-red-500 font-medium px-2 py-1 rounded-lg hover:bg-red-50 transition"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Notifications List */}
                      <div className="max-h-[420px] overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="py-12 text-center">
                            <Bell className="mx-auto text-gray-300 mb-3" size={36} />
                            <p className="text-gray-400 text-sm">No notifications yet</p>
                          </div>
                        ) : (
                          notifications.map((notif) => (
                            <button
                              key={notif._id}
                              onClick={() => handleNotifClick(notif)}
                              className={`w-full flex items-start gap-3 px-5 py-3.5 text-left hover:bg-gray-50 transition border-b border-gray-50 last:border-0 ${
                                !notif.read ? "bg-yellow-50/50" : ""
                              }`}
                            >
                              {/* Avatar / Icon */}
                              {notif.fromUser ? (
                                notif.fromUser.image ? (
                                  <img
                                    src={notif.fromUser.image}
                                    alt=""
                                    className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                                  />
                                ) : (
                                  <div className="w-10 h-10 bg-yellow-200 rounded-full flex items-center justify-center text-sm font-bold text-yellow-700 flex-shrink-0">
                                    {notif.fromUser.name.charAt(0).toUpperCase()}
                                  </div>
                                )
                              ) : (
                                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-lg flex-shrink-0">
                                  {notifIcons[notif.type] || "🔔"}
                                </div>
                              )}

                              {/* Content */}
                              <div className="flex-1 min-w-0">
                                <p className={`text-sm leading-snug ${!notif.read ? "font-medium text-gray-900" : "text-gray-600"}`}>
                                  {notif.message}
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                  {timeAgo(notif.createdAt)}
                                </p>
                              </div>

                              {/* Unread Dot */}
                              {!notif.read && (
                                <div className="w-2.5 h-2.5 bg-yellow-400 rounded-full flex-shrink-0 mt-1.5"></div>
                              )}
                            </button>
                          ))
                        )}
                      </div>

                      {/* Panel Footer */}
                      {notifications.length > 0 && (
                        <div className="px-5 py-3 border-t border-gray-100 bg-gray-50/50">
                          <Link
                            href="/dashboard"
                            onClick={() => setShowNotifPanel(false)}
                            className="text-xs text-center block text-yellow-600 hover:text-yellow-700 font-medium"
                          >
                            View all activity
                          </Link>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* User Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => {
                      setShowDropdown(!showDropdown);
                      setShowNotifPanel(false);
                    }}
                    className="flex items-center gap-2 hover:bg-yellow-50 px-3 py-2 rounded-full transition"
                  >
                    {user.image ? (
                      <img
                        src={user.image}
                        alt={user.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-sm font-bold text-black">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <ChevronDown size={16} className="text-gray-600" />
                  </button>

                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                      <div className="px-4 py-2 border-b">
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                      <Link
                        href="/dashboard"
                        className="block px-4 py-2 text-gray-700 hover:bg-yellow-50"
                        onClick={() => setShowDropdown(false)}
                      >
                        Dashboard
                      </Link>
                      <Link
                        href="/dashboard?tab=published"
                        className="block px-4 py-2 text-gray-700 hover:bg-yellow-50"
                        onClick={() => setShowDropdown(false)}
                      >
                        My Stories
                      </Link>
                      <Link
                        href="/bookmarks"
                        className="block px-4 py-2 text-gray-700 hover:bg-yellow-50"
                        onClick={() => setShowDropdown(false)}
                      >
                        Bookmarks
                      </Link>
                      <Link
                        href="/following"
                        className="block px-4 py-2 text-gray-700 hover:bg-yellow-50"
                        onClick={() => setShowDropdown(false)}
                      >
                        Following
                      </Link>
                      <Link
                        href="/users"
                        className="block px-4 py-2 text-gray-700 hover:bg-yellow-50"
                        onClick={() => setShowDropdown(false)}
                      >
                        Users
                      </Link>
                      <hr className="my-1" />
                      <button
                        onClick={() => {
                          setShowDropdown(false);
                          handleLogout();
                        }}
                        className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="border border-yellow-500 text-yellow-600 hover:bg-yellow-50 px-5 py-2.5 rounded-full font-medium transition"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-2.5 rounded-full font-medium transition"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden"
          >
            {mobileOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t bg-white">
          <nav className="flex flex-col px-6 py-6 space-y-5">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="text-gray-700 hover:text-yellow-500 font-medium"
              >
                {item.name}
              </Link>
            ))}

            {user ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="text-gray-700 hover:text-yellow-500 font-medium"
                >
                  Dashboard
                </Link>
                <Link
                  href="/users"
                  onClick={() => setMobileOpen(false)}
                  className="text-gray-700 hover:text-yellow-500 font-medium"
                >
                  Users
                </Link>
                <Link
                  href="/bookmarks"
                  onClick={() => setMobileOpen(false)}
                  className="text-gray-700 hover:text-yellow-500 font-medium"
                >
                  Bookmarks
                </Link>
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    handleLogout();
                  }}
                  className="text-left text-red-600 font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="border border-yellow-500 text-yellow-600 text-center py-3 rounded-full"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileOpen(false)}
                  className="bg-yellow-500 text-white text-center py-3 rounded-full"
                >
                  Register
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
