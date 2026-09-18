"use client";

import { useState } from "react";
import { Save, Send, ArrowLeft } from "lucide-react";
import ImageUploader from "./ImageUploader";

const categories = [
  "Life",
  "Family",
  "Career",
  "Education",
  "Technology",
  "Travel",
  "Health",
  "Inspiration",
];

interface StoryFormData {
  title: string;
  content: string;
  category: string;
  excerpt: string;
  coverImage: string;
}

interface StoryFormProps {
  initialData?: Partial<StoryFormData>;
  onSaveDraft: (data: StoryFormData) => Promise<void>;
  onPublish: (data: StoryFormData) => Promise<void>;
  loading?: boolean;
}

export default function StoryForm({
  initialData,
  onSaveDraft,
  onPublish,
  loading = false,
}: StoryFormProps) {
  const [form, setForm] = useState<StoryFormData>({
    title: initialData?.title || "",
    content: initialData?.content || "",
    category: initialData?.category || "",
    excerpt: initialData?.excerpt || "",
    coverImage: initialData?.coverImage || "",
  });

  const [saving, setSaving] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSaveDraft = async () => {
    if (!form.title.trim()) {
      return;
    }
    setSaving(true);
    try {
      await onSaveDraft(form);
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!form.title.trim() || !form.content.trim() || !form.category) {
      return;
    }
    setSaving(true);
    try {
      await onPublish(form);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <a
          href="/dashboard"
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </a>
        <div className="flex items-center gap-3">
          <button
            onClick={handleSaveDraft}
            disabled={saving || loading || !form.title.trim()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-gray-200 text-gray-700 hover:bg-gray-50 font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" />
            {saving ? "Saving..." : "Save Draft"}
          </button>
          <button
            onClick={handlePublish}
            disabled={
              saving || loading || !form.title.trim() || !form.content.trim() || !form.category
            }
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-yellow-500 hover:bg-yellow-600 text-white font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
            {saving ? "Publishing..." : "Publish"}
          </button>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8">
        {/* Title */}
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Your story title..."
          className="w-full text-3xl font-bold text-gray-900 placeholder-gray-300 border-0 outline-none mb-6"
        />

        {/* Cover Image */}
        <ImageUploader
          value={form.coverImage}
          onChange={(url) => setForm({ ...form, coverImage: url })}
          label="Cover Image"
          className="mb-6"
        />

        {/* Category & Excerpt Row */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none appearance-none bg-white"
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Excerpt
            </label>
            <input
              type="text"
              name="excerpt"
              value={form.excerpt}
              onChange={handleChange}
              placeholder="Brief summary of your story..."
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none"
            />
          </div>
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Story Content *
          </label>
          <textarea
            name="content"
            value={form.content}
            onChange={handleChange}
            placeholder="Start writing your story here..."
            rows={20}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none resize-none leading-relaxed"
          />
        </div>
      </div>
    </div>
  );
}
