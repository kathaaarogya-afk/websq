"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Menu, X, Search, Bell, ChevronDown } from "lucide-react";
import toast from "react-hot-toast";

interface UserData {
  id: string;
  name: string;
  email: string;
  image: string;
}

export default function Header() {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);

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
  }, []);

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

  const publicNavItems = [
    { name: "Home", href: "/" },
    { name: "Stories", href: "/stories" },
    { name: "Categories", href: "/categories" },
    { name: "Write", href: "/write" },
  ];

  const authNavItems = [
    { name: "Home", href: "/" },
    { name: "Stories", href: "/stories" },
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
                <button className="w-10 h-10 rounded-full hover:bg-yellow-100 flex items-center justify-center transition relative">
                  <Bell size={20} />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                <div className="relative">
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
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
