"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2, FolderTree, X } from "lucide-react";

interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
  storyCount: number;
  createdAt: string;
}

interface ManageCategoriesProps {
  categories: Category[];
  loading: boolean;
  onCreate: (data: { name: string; description: string; color: string }) => Promise<void>;
  onUpdate: (id: string, data: { name: string; description: string; color: string }) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

const colorOptions = [
  { name: "Yellow", value: "#EAB308" },
  { name: "Blue", value: "#3B82F6" },
  { name: "Green", value: "#22C55E" },
  { name: "Purple", value: "#A855F7" },
  { name: "Orange", value: "#F97316" },
  { name: "Red", value: "#EF4444" },
  { name: "Teal", value: "#14B8A6" },
  { name: "Pink", value: "#EC4899" },
];

export default function ManageCategories({
  categories,
  loading,
  onCreate,
  onUpdate,
  onDelete,
}: ManageCategoriesProps) {
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [form, setForm] = useState({ name: "", description: "", color: "#EAB308" });
  const [actionLoading, setActionLoading] = useState(false);

  const handleOpenCreate = () => {
    setEditingCategory(null);
    setForm({ name: "", description: "", color: "#EAB308" });
    setShowModal(true);
  };

  const handleOpenEdit = (category: Category) => {
    setEditingCategory(category);
    setForm({
      name: category.name,
      description: category.description,
      color: category.color,
    });
    setShowModal(true);
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) return;
    setActionLoading(true);

    if (editingCategory) {
      await onUpdate(editingCategory._id, form);
    } else {
      await onCreate(form);
    }

    setActionLoading(false);
    setShowModal(false);
    setEditingCategory(null);
    setForm({ name: "", description: "", color: "#EAB308" });
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white rounded-2xl p-6 border border-gray-100 animate-pulse"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-32"></div>
                <div className="h-3 bg-gray-200 rounded w-48"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Categories</h2>
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2.5 rounded-full font-medium transition"
        >
          <Plus className="w-4 h-4" />
          Add Category
        </button>
      </div>

      {categories.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 border border-gray-100 text-center">
          <FolderTree className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            No categories yet
          </h3>
          <p className="text-gray-500 mb-6">
            Create your first category to organize stories.
          </p>
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-full font-medium transition"
          >
            <Plus className="w-4 h-4" />
            Create Category
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {categories.map((category) => (
            <div
              key={category._id}
              className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: category.color + "20" }}
                  >
                    <FolderTree
                      className="w-6 h-6"
                      style={{ color: category.color }}
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{category.name}</h3>
                    <p className="text-sm text-gray-500">
                      {category.storyCount} stories
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(category)}
                    className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 hover:text-yellow-600 transition"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (
                        confirm(
                          `Delete "${category.name}"? Stories in this category will not be deleted.`
                        )
                      ) {
                        onDelete(category._id);
                      }
                    }}
                    className="p-2 rounded-lg hover:bg-red-50 text-gray-600 hover:text-red-600 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              {category.description && (
                <p className="mt-3 text-sm text-gray-600 line-clamp-2">
                  {category.description}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                {editingCategory ? "Edit Category" : "New Category"}
              </h3>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingCategory(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Category name"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  placeholder="Brief description..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Color
                </label>
                <div className="flex gap-2 flex-wrap">
                  {colorOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setForm({ ...form, color: option.value })}
                      className={`w-10 h-10 rounded-full transition ${
                        form.color === option.value
                          ? "ring-2 ring-offset-2 ring-gray-400"
                          : "hover:scale-110"
                      }`}
                      style={{ backgroundColor: option.value }}
                      title={option.name}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 justify-end mt-6">
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingCategory(null);
                }}
                className="px-4 py-2 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={!form.name.trim() || actionLoading}
                className="px-4 py-2 rounded-xl bg-yellow-500 hover:bg-yellow-600 text-white font-medium transition disabled:opacity-50"
              >
                {actionLoading
                  ? "Saving..."
                  : editingCategory
                  ? "Update"
                  : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
