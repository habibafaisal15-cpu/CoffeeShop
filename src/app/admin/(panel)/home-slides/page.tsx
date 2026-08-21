"use client";

import { useEffect, useState } from "react";
import { Check, ImageIcon } from "lucide-react";
import { CraftSlide, MenuCategory } from "@/lib/types";
import { PageHeader } from "@/components/admin/PageHeader";
import { AdminField, AdminCard } from "@/components/admin/AdminField";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { adminGet, adminMutate } from "@/lib/admin-fetch";

export default function AdminHomeSlidesPage() {
  const [slides, setSlides] = useState<CraftSlide[]>([]);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [savingId, setSavingId] = useState<string | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const loadData = () => {
    setLoading(true);
    setLoadError("");

    Promise.all([
      adminGet<CraftSlide[]>("/api/craft-slides/manage"),
      adminGet<MenuCategory[]>("/api/categories"),
    ])
      .then(([slideData, categoryData]) => {
        setSlides(Array.isArray(slideData) ? slideData : []);
        setCategories(
          (Array.isArray(categoryData) ? categoryData : []).filter(
            (c) => c.id !== "all" && c.id !== "popular"
          )
        );
      })
      .catch((e) => {
        setLoadError(
          e instanceof Error ? e.message : "Could not load home slides"
        );
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const updateSlide = (id: string, patch: Partial<CraftSlide>) => {
    setSlides((current) =>
      current.map((slide) => (slide.id === id ? { ...slide, ...patch } : slide))
    );
    setErrors((current) => {
      const next = { ...current };
      delete next[id];
      return next;
    });
  };

  const saveSlide = async (slide: CraftSlide) => {
    if (!slide.title.trim()) {
      setErrors((current) => ({
        ...current,
        [slide.id]: "Title is required",
      }));
      return;
    }
    if (!slide.image.trim()) {
      setErrors((current) => ({
        ...current,
        [slide.id]: "Image is required",
      }));
      return;
    }

    setSavingId(slide.id);
    setSavedId(null);
    setErrors((current) => {
      const next = { ...current };
      delete next[slide.id];
      return next;
    });

    try {
      const updated = await adminMutate<CraftSlide>(
        "/api/craft-slides/manage",
        "PUT",
        slide
      );
      setSlides((current) =>
        current.map((item) => (item.id === updated.id ? updated : item))
      );
      setSavedId(slide.id);
      window.setTimeout(() => {
        setSavedId((current) => (current === slide.id ? null : current));
      }, 2500);
    } catch (e) {
      setErrors((current) => ({
        ...current,
        [slide.id]:
          e instanceof Error ? e.message : "Could not save this slide",
      }));
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div>
      <PageHeader
        title="Home Slides"
        description="Change the 3 rotating images on the customer home screen — cakes, brewed coffees, and fluffy pancakes."
      />

      {loading ? (
        <p className="text-sm text-coffee-muted">Loading slides…</p>
      ) : loadError ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {loadError}
        </div>
      ) : (
        <div className="space-y-6">
          {slides.map((slide) => (
            <AdminCard key={slide.id}>
              <div className="mb-4 flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-coffee-muted">
                    Slide {slide.sortOrder}
                  </p>
                  <h3 className="font-serif text-xl text-coffee">{slide.badge}</h3>
                </div>
                {savedId === slide.id && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-sage/20 px-3 py-1 text-xs font-medium text-sage-deep">
                    <Check className="h-3.5 w-3.5" />
                    Saved
                  </span>
                )}
              </div>

              <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
                <div>
                  <p className="mb-2 flex items-center gap-2 text-sm font-medium text-coffee">
                    <ImageIcon className="h-4 w-4" />
                    Slide image
                  </p>
                  <ImageUpload
                    value={slide.image}
                    onChange={(image) => updateSlide(slide.id, { image })}
                    label=""
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <AdminField label="Badge label">
                    <input
                      value={slide.badge}
                      onChange={(e) =>
                        updateSlide(slide.id, { badge: e.target.value })
                      }
                      className="admin-input"
                      placeholder="SIGNATURE CAKES"
                    />
                  </AdminField>

                  <AdminField label="Eyebrow">
                    <input
                      value={slide.eyebrow}
                      onChange={(e) =>
                        updateSlide(slide.id, { eyebrow: e.target.value })
                      }
                      className="admin-input"
                      placeholder="BREWED COUNTER"
                    />
                  </AdminField>

                  <AdminField label="Title" className="sm:col-span-2">
                    <input
                      value={slide.title}
                      onChange={(e) =>
                        updateSlide(slide.id, { title: e.target.value })
                      }
                      className="admin-input"
                    />
                  </AdminField>

                  <AdminField label="Description" className="sm:col-span-2">
                    <textarea
                      value={slide.description}
                      onChange={(e) =>
                        updateSlide(slide.id, { description: e.target.value })
                      }
                      rows={3}
                      className="admin-input resize-y"
                    />
                  </AdminField>

                  <AdminField label="Button text">
                    <input
                      value={slide.cta}
                      onChange={(e) =>
                        updateSlide(slide.id, { cta: e.target.value })
                      }
                      className="admin-input"
                    />
                  </AdminField>

                  <AdminField label="Opens category">
                    <select
                      value={slide.category}
                      onChange={(e) =>
                        updateSlide(slide.id, { category: e.target.value })
                      }
                      className="admin-input"
                    >
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                  </AdminField>
                </div>
              </div>

              {errors[slide.id] && (
                <p className="mt-4 text-sm text-red-600">{errors[slide.id]}</p>
              )}

              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={() => saveSlide(slide)}
                  disabled={savingId === slide.id}
                  className="rounded-xl bg-sage-deep px-5 py-2.5 text-sm font-semibold text-cream transition hover:bg-sage disabled:opacity-60"
                >
                  {savingId === slide.id ? "Saving…" : "Save slide"}
                </button>
              </div>
            </AdminCard>
          ))}
        </div>
      )}
    </div>
  );
}
