"use client";

import { useEffect, useState, useMemo } from "react";
import { Plus, Pencil, Trash2, X, Check, Search } from "lucide-react";
import { MenuCategory, Product } from "@/lib/types";
import { getCategoryLabel } from "@/lib/categories";
import { formatPKR } from "@/lib/store";
import { PageHeader } from "@/components/admin/PageHeader";
import { AdminField, AdminCard } from "@/components/admin/AdminField";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { adminGet } from "@/lib/admin-fetch";
import { resolveMediaUrl } from "@/lib/media-url";

const emptyProduct: Omit<Product, "id"> = {
  name: "",
  description: "",
  price: 0,
  category: "hot-drinks",
  image: "",
  available: true,
};

export default function AdminMenuPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [editing, setEditing] = useState<Product | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [form, setForm] = useState(emptyProduct);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const loadData = () => {
    setLoading(true);
    setLoadError("");

    Promise.all([
      adminGet<Product[]>("/api/products"),
      adminGet<MenuCategory[]>("/api/categories"),
    ])
      .then(([prods, cats]) => {
        setProducts(Array.isArray(prods) ? prods : []);
        setCategories(Array.isArray(cats) ? cats : []);
      })
      .catch((e) => {
        setLoadError(e instanceof Error ? e.message : "Could not load menu data");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const visibleCategories = categories.filter((c) => c.visible);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        !search ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase());
      const matchesCat =
        categoryFilter === "all" || p.category === categoryFilter;
      return matchesSearch && matchesCat;
    });
  }, [products, search, categoryFilter]);

  const openNew = () => {
    setForm({
      ...emptyProduct,
      category: visibleCategories[0]?.id ?? "hot-drinks",
    });
    setIsNew(true);
    setEditing(null);
    setError("");
  };

  const openEdit = (product: Product) => {
    setForm(product);
    setEditing(product);
    setIsNew(false);
    setError("");
  };

  const closeForm = () => {
    setEditing(null);
    setIsNew(false);
    setForm(emptyProduct);
    setError("");
  };

  const saveProduct = async () => {
    if (!form.name.trim()) {
      setError("Product name is required");
      return;
    }
    if (!form.price || form.price <= 0) {
      setError("Enter a valid price");
      return;
    }
    if (!form.image.trim()) {
      setError("Add a product image");
      return;
    }

    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/products/manage", {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(isNew ? form : { ...form, id: editing!.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      closeForm();
      loadData();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    await fetch(`/api/products/manage?id=${id}`, { method: "DELETE" });
    loadData();
  };

  const toggleAvailable = async (product: Product) => {
    await fetch("/api/products/manage", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...product, available: !product.available }),
    });
    loadData();
  };

  return (
    <div>
      <PageHeader
        title="Menu"
        description="Add products, set prices, and upload images"
        action={
          <button type="button" onClick={openNew} className="admin-btn-primary flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Product
          </button>
        }
      />

      {loadError && (
        <div className="admin-card mb-6 border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <p>{loadError}</p>
          <button
            type="button"
            onClick={loadData}
            className="admin-btn-secondary mt-3"
          >
            Retry
          </button>
        </div>
      )}

      {loading ? (
        <AdminCard className="p-8 text-center text-sm text-coffee-muted">
          Loading menu…
        </AdminCard>
      ) : null}

      {(isNew || editing) && (
        <AdminCard className="mb-6 p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-serif text-xl text-coffee">
              {isNew ? "New Product" : "Edit Product"}
            </h2>
            <button type="button" onClick={closeForm} className="text-coffee-muted hover:text-coffee">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <AdminField label="Name">
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="admin-input"
                placeholder="Cappuccino"
              />
            </AdminField>
            <AdminField label="Price (PKR)">
              <input
                type="number"
                min={0}
                value={form.price || ""}
                onChange={(e) =>
                  setForm({ ...form, price: Number(e.target.value) })
                }
                className="admin-input"
              />
            </AdminField>
            <AdminField label="Category">
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="admin-input"
              >
                {visibleCategories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </AdminField>
            <div className="lg:col-span-2">
              <ImageUpload
                value={form.image}
                onChange={(url) => setForm({ ...form, image: url })}
              />
            </div>
            <div className="lg:col-span-2">
              <AdminField label="Description">
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  className="admin-input"
                  rows={2}
                  placeholder="Short description for the menu card"
                />
              </AdminField>
            </div>
            <label className="flex items-center gap-2 text-sm text-coffee">
              <input
                type="checkbox"
                checked={form.popular ?? false}
                onChange={(e) => setForm({ ...form, popular: e.target.checked })}
                className="rounded"
              />
              Mark as Popular Pick
            </label>
            <label className="flex items-center gap-2 text-sm text-coffee">
              <input
                type="checkbox"
                checked={form.available}
                onChange={(e) => setForm({ ...form, available: e.target.checked })}
                className="rounded"
              />
              Available on kiosk
            </label>
          </div>

          {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={saveProduct}
              disabled={saving}
              className="admin-btn-primary flex items-center gap-2 disabled:opacity-50"
            >
              <Check className="h-4 w-4" />
              {saving ? "Saving…" : "Save Product"}
            </button>
            <button type="button" onClick={closeForm} className="admin-btn-secondary">
              Cancel
            </button>
          </div>
        </AdminCard>
      )}

      <div className="mb-4 flex flex-wrap gap-3">
        <div className="relative min-w-[200px] flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-coffee-muted" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products…"
            className="admin-input pl-9"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="admin-input w-auto min-w-[160px]"
        >
          <option value="all">All categories</option>
          {visibleCategories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      <AdminCard className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead>
              <tr className="border-b border-linen/40 bg-cream/50 text-left text-xs font-medium uppercase tracking-wider text-coffee-muted">
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-sm text-coffee-muted">
                    No products found
                  </td>
                </tr>
              ) : (
                filtered.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b border-linen/40 last:border-0 hover:bg-cream/30"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-12 overflow-hidden rounded-lg bg-cream">
                          {product.image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={resolveMediaUrl(product.image)}
                              alt={product.name}
                              className="h-full w-full object-cover"
                            />
                          ) : null}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-coffee">
                            {product.name}
                            {product.popular && (
                              <span className="ml-2 text-[10px] text-gold">★ Popular</span>
                            )}
                          </p>
                          <p className="line-clamp-1 max-w-xs text-xs text-coffee-muted">
                            {product.description}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-coffee-muted">
                      {getCategoryLabel(categories, product.category)}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-coffee">
                      {formatPKR(product.price)}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleAvailable(product)}
                        className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          product.available
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {product.available ? "Available" : "Hidden"}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button
                          onClick={() => openEdit(product)}
                          className="rounded-lg p-2 text-coffee-muted hover:bg-cream hover:text-coffee"
                          title="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => deleteProduct(product.id)}
                          className="rounded-lg p-2 text-coffee-muted hover:bg-red-50 hover:text-red-600"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </AdminCard>
    </div>
  );
}
