"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X, Check, GripVertical } from "lucide-react";
import { MenuCategory } from "@/lib/types";
import { slugifyCategory } from "@/lib/categories";
import { PageHeader } from "@/components/admin/PageHeader";
import { AdminField, AdminCard } from "@/components/admin/AdminField";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { adminGet, adminMutate } from "@/lib/admin-fetch";
import { resolveMediaUrl } from "@/lib/media-url";

const emptyCategory: Omit<MenuCategory, "id"> & { id?: string } = {
  label: "",
  image: "https://img.icons8.com/3d-fluency/94/coffee-to-go.png",
  sortOrder: 0,
  visible: true,
  showInCarousel: true,
  showInNav: false,
};

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [editing, setEditing] = useState<MenuCategory | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [form, setForm] = useState(emptyCategory);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const loadCategories = () => {
    setLoading(true);
    setLoadError("");

    adminGet<MenuCategory[]>("/api/categories")
      .then((data) => setCategories(Array.isArray(data) ? data : []))
      .catch((e) => {
        setLoadError(
          e instanceof Error ? e.message : "Could not load categories"
        );
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const openNew = () => {
    setForm({ ...emptyCategory, sortOrder: categories.length + 1 });
    setIsNew(true);
    setEditing(null);
    setError("");
  };

  const openEdit = (cat: MenuCategory) => {
    setForm(cat);
    setEditing(cat);
    setIsNew(false);
    setError("");
  };

  const closeForm = () => {
    setEditing(null);
    setIsNew(false);
    setForm(emptyCategory);
    setError("");
  };

  const saveCategory = async () => {
    if (!form.label.trim()) {
      setError("Category name is required");
      return;
    }

    setSaving(true);
    setError("");
    try {
      const payload = isNew
        ? { ...form, id: slugifyCategory(form.label) }
        : { ...(form as MenuCategory), id: editing!.id };

      await adminMutate(
        "/api/categories/manage",
        isNew ? "POST" : "PUT",
        payload
      );
      closeForm();
      loadCategories();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const deleteCategory = async (id: string) => {
    if (id === "all" || id === "popular") {
      alert("All and Popular are system categories and cannot be deleted.");
      return;
    }
    if (!confirm("Delete this category? Products must be moved first.")) return;
    try {
      await adminMutate(
        `/api/categories/manage?id=${encodeURIComponent(id)}`,
        "DELETE"
      );
      loadCategories();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Delete failed");
    }
  };

  return (
    <div>
      <PageHeader
        title="Categories"
        description="Organize menu sections shown on the kiosk"
        action={
          <button onClick={openNew} className="admin-btn-primary flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Category
          </button>
        }
      />

      {loadError && (
        <div className="admin-card mb-6 border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <p>{loadError}</p>
          <button
            type="button"
            onClick={loadCategories}
            className="admin-btn-secondary mt-3"
          >
            Retry
          </button>
        </div>
      )}

      {(isNew || editing) && (
        <AdminCard className="mb-6 p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-serif text-xl text-coffee">
              {isNew ? "New Category" : "Edit Category"}
            </h2>
            <button onClick={closeForm} className="text-coffee-muted hover:text-coffee">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <AdminField label="Display Name">
              <input
                value={form.label}
                onChange={(e) => setForm({ ...form, label: e.target.value })}
                className="admin-input"
                placeholder="Hot Drinks"
              />
            </AdminField>
            <AdminField label="Sort Order">
              <input
                type="number"
                min={1}
                value={form.sortOrder}
                onChange={(e) =>
                  setForm({ ...form, sortOrder: Number(e.target.value) })
                }
                className="admin-input"
              />
            </AdminField>
            <div className="sm:col-span-2">
              <ImageUpload
                label="Category Icon"
                value={form.image}
                onChange={(url) => setForm({ ...form, image: url })}
              />
            </div>
            <label className="flex items-center gap-2 text-sm text-coffee">
              <input
                type="checkbox"
                checked={form.visible}
                onChange={(e) => setForm({ ...form, visible: e.target.checked })}
              />
              Visible on kiosk
            </label>
            <label className="flex items-center gap-2 text-sm text-coffee">
              <input
                type="checkbox"
                checked={form.showInCarousel}
                onChange={(e) =>
                  setForm({ ...form, showInCarousel: e.target.checked })
                }
              />
              Show in category carousel
            </label>
            <label className="flex items-center gap-2 text-sm text-coffee">
              <input
                type="checkbox"
                checked={form.showInNav}
                onChange={(e) =>
                  setForm({ ...form, showInNav: e.target.checked })
                }
              />
              Show in sidebar navigation
            </label>
          </div>

          {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

          <div className="mt-4 flex gap-2">
            <button
              onClick={saveCategory}
              disabled={saving}
              className="admin-btn-primary flex items-center gap-2 disabled:opacity-50"
            >
              <Check className="h-4 w-4" />
              {saving ? "Saving…" : "Save Category"}
            </button>
            <button onClick={closeForm} className="admin-btn-secondary">
              Cancel
            </button>
          </div>
        </AdminCard>
      )}

      {loading ? (
        <AdminCard className="p-8 text-center text-sm text-coffee-muted">
          Loading categories…
        </AdminCard>
      ) : (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {categories.map((cat) => (
          <AdminCard key={cat.id} className="p-4">
            <div className="mb-3 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="relative h-12 w-12 overflow-hidden rounded-xl bg-cream">
                  {cat.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={resolveMediaUrl(cat.image)}
                      alt={cat.label}
                      className="h-full w-full object-contain p-1"
                    />
                  ) : null}
                </div>
                <div>
                  <p className="font-medium text-coffee">{cat.label}</p>
                  <p className="text-xs text-coffee-muted">/{cat.id}</p>
                </div>
              </div>
              <GripVertical className="h-4 w-4 text-coffee-muted/40" />
            </div>

            <div className="mb-4 flex flex-wrap gap-1.5">
              {cat.visible && (
                <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-medium text-green-800">
                  Visible
                </span>
              )}
              {cat.showInCarousel && (
                <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-medium text-blue-800">
                  Carousel
                </span>
              )}
              {cat.showInNav && (
                <span className="rounded-full bg-purple-100 px-2 py-0.5 text-[10px] font-medium text-purple-800">
                  Nav
                </span>
              )}
              <span className="rounded-full bg-cream px-2 py-0.5 text-[10px] text-coffee-muted">
                Order #{cat.sortOrder}
              </span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => openEdit(cat)}
                className="admin-btn-secondary flex flex-1 items-center justify-center gap-1 py-2 text-xs"
              >
                <Pencil className="h-3.5 w-3.5" />
                Edit
              </button>
              <button
                onClick={() => deleteCategory(cat.id)}
                className="rounded-xl border border-red-200 px-3 py-2 text-xs text-red-600 hover:bg-red-50"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </AdminCard>
        ))}
      </div>
      )}
    </div>
  );
}
