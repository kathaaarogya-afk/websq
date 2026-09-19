"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import StoryForm from "@/components/writer/StoryForm";
import { Suspense } from "react";

interface StoryFormData {
  title: string;
  content: string;
  category: string;
  excerpt: string;
  coverImage: string;
}

function WritePageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [initialData, setInitialData] = useState<Partial<StoryFormData> | undefined>(undefined);

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

  const fetchStory = useCallback(async () => {
    if (!editId) return;
    try {
      const res = await fetch(`/api/stories/${editId}`, { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setInitialData({
          title: data.story.title,
          content: data.story.content,
          category: data.story.category,
          excerpt: data.story.excerpt,
          coverImage: data.story.coverImage,
        });
      } else {
        toast.error("Story not found");
        router.push("/dashboard");
      }
    } catch {
      toast.error("Failed to load story");
      router.push("/dashboard");
    }
  }, [editId, router]);

  useEffect(() => {
    if (!loading) {
      fetchStory();
    }
  }, [loading, fetchStory]);

  const handleSaveDraft = async (data: StoryFormData) => {
    setSaving(true);
    try {
      const body: Record<string, unknown> = { ...data };
      if (editId) body.storyId = editId;

      const res = await fetch("/api/stories/save-draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
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
      const body: Record<string, unknown> = { ...data };
      if (editId) body.storyId = editId;

      const res = await fetch("/api/stories/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        toast.success(editId ? "Story updated successfully!" : "Story published successfully!");
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
          initialData={initialData}
          onSaveDraft={handleSaveDraft}
          onPublish={handlePublish}
          loading={saving}
        />
      </div>
    </div>
  );
}

export default function WritePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div></div>}>
      <WritePageInner />
    </Suspense>
  );
}
