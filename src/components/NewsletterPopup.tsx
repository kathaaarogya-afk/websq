"use client";

import { useState, useEffect, useCallback } from "react";
import { X, Mail, CheckCircle2, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function NewsletterPopup() {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [dismissed, setDismissed] = useState(false);

  const handleExit = useCallback(
    (e: MouseEvent) => {
      if (dismissed) return;
      if (e.clientY < 10 && !show) {
        setShow(true);
      }
    },
    [dismissed, show]
  );

  useEffect(() => {
    // Check if already subscribed or dismissed this session
    if (typeof window !== "undefined") {
      const subscribed = sessionStorage.getItem("newsletter_subscribed");
      const dismissCount = localStorage.getItem("newsletter_dismissed");
      if (subscribed === "true" || (dismissCount && parseInt(dismissCount) >= 3)) {
        setDismissed(true);
        return;
      }
    }

    // Also show after 45 seconds on page
    const timer = setTimeout(() => {
      if (!dismissed) setShow(true);
    }, 45000);

    document.addEventListener("mouseleave", handleExit);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("mouseleave", handleExit);
    };
  }, [dismissed, handleExit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setStatus("success");
        sessionStorage.setItem("newsletter_subscribed", "true");
        setTimeout(() => setShow(false), 3000);
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  const handleDismiss = () => {
    setShow(false);
    setDismissed(true);
    const count = parseInt(localStorage.getItem("newsletter_dismissed") || "0");
    localStorage.setItem("newsletter_dismissed", String(count + 1));
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) handleDismiss();
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 overflow-hidden"
          >
            {/* Decorative */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-100 rounded-full -translate-y-1/2 translate-x-1/2 opacity-60" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-orange-100 rounded-full translate-y-1/2 -translate-x-1/2 opacity-60" />

            <button
              onClick={handleDismiss}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
            >
              <X size={20} />
            </button>

            <div className="relative">
              <div className="w-14 h-14 bg-yellow-100 rounded-2xl flex items-center justify-center mb-5">
                <Mail className="text-yellow-600" size={24} />
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Never Miss a Story
              </h3>
              <p className="text-gray-600 mb-6">
                Get the best stories delivered to your inbox every week. Join 500+
                readers who start their week with inspiration.
              </p>

              {status === "success" ? (
                <div className="flex items-center gap-3 text-green-600 font-medium py-3">
                  <CheckCircle2 size={20} />
                  You&apos;re subscribed! Check your inbox.
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="flex-1 rounded-xl border border-gray-200 px-4 py-3 outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm"
                  />
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="rounded-xl bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 font-medium text-sm disabled:opacity-50 transition-all flex items-center gap-2"
                  >
                    {status === "loading" ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      "Subscribe"
                    )}
                  </button>
                </form>
              )}

              <p className="text-xs text-gray-400 mt-4">
                No spam. Unsubscribe anytime. We respect your inbox.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
