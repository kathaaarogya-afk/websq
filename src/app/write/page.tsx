"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import StoryForm from "@/components/writer/StoryForm";

interface StoryFormData {
  title: string;
  content: string;
  category: string;
  excerpt: string;
  coverImage: string;
}

export default function WritePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (!res.ok) {
          router.push("/login");
          return;
        }
      } catch {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleSaveDraft = async (data: StoryFormData) => {
    setSaving(true);
    try {
      const res = await fetch("/api/stories/save-draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        toast.success("Draft saved successfully!");
      } else {
        const error = await res.json();
        toast.error(error.error || "Failed to save draft");
      }
    } catch {
      toast.error("Failed to save draft");
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async (data: StoryFormData) => {
    setSaving(true);
    try {
      const res = await fetch("/api/stories/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        toast.success("Story published successfully!");
        router.push("/dashboard?tab=published");
      } else {
        const error = await res.json();
        toast.error(error.error || "Failed to publish story");
      }
    } catch {
      toast.error("Failed to publish story");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-orange-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <StoryForm
          onSaveDraft={handleSaveDraft}
          onPublish={handlePublish}
          loading={saving}
        />
      </div>
    </div>
  );
}
