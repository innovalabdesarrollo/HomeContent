"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { api, type Design } from "@/lib/api";

const empty = {
  title: "",
  description: "",
  imageUrl: "",
  category: "celosias",
  active: true,
};

export default function AdminPage() {
  const [designs, setDesigns] = useState<Design[]>([]);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setDesigns(await api.listDesigns(false));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function startEdit(d: Design) {
    setEditId(d._id);
    setForm({
      title: d.title,
      description: d.description || "",
      imageUrl: d.imageUrl || "",
      category: d.category || "celosias",
      active: d.active,
    });
  }

  function resetForm() {
    setEditId(null);
    setForm(empty);
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    try {
      if (editId) {
        await api.updateDesign(editId, form);
      } else {
        await api.createDesign(form);
      }
      resetForm();
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    }
  }

  async function remove(id: string) {
    if (!confirm("¿Eliminar diseño?")) return;
    try {
      await api.deleteDesign(id);
      if (editId === id) resetForm();
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    }
  }

  async function onPickImage(file: File | null) {
    if (!file) return;
    setError("");
    setUploading(true);
    try {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = () => reject(new Error("No se pudo leer el archivo"));
        reader.readAsDataURL(file);
      });
      const { url } = await api.uploadImage(dataUrl);
      setForm((prev) => ({ ...prev, imageUrl: url }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al subir imagen");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="font-display text-3xl text-brand-900 sm:text-4xl">
        Administración de diseños
      </h1>
      <p className="mt-2 text-brand-900/70">
        CRUD de diseños mostrados en Celosías. Sin auth en este MVP.
      </p>

      {error && (
        <p className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <form onSubmit={onSubmit} className="space-y-3 rounded-lg border border-brand-900/10 bg-white/70 p-4">
          <h2 className="font-display text-xl">
            {editId ? "Editar diseño" : "Nuevo diseño"}
          </h2>
          <div>
            <label className="label">Título *</label>
            <input
              className="input"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>
          <div>
            <label className="label">Descripción</label>
            <textarea
              className="input"
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
          <div>
            <label className="label">Imagen</label>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="input"
              disabled={uploading}
              onChange={(e) => onPickImage(e.target.files?.[0] || null)}
            />
            <p className="mt-1 text-xs text-brand-900/55">
              {uploading
                ? "Subiendo…"
                : "Sube un archivo o pega una URL. Cloudinary opcional en .env."}
            </p>
            <input
              className="input mt-2"
              placeholder="URL de imagen"
              value={form.imageUrl}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
            />
            {form.imageUrl && (
              <div
                className="mt-2 aspect-[4/3] max-w-xs rounded-md bg-brand-100 bg-cover bg-center"
                style={{ backgroundImage: `url(${form.imageUrl})` }}
              />
            )}
          </div>
          <div>
            <label className="label">Categoría</label>
            <input
              className="input"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(e) => setForm({ ...form, active: e.target.checked })}
            />
            Activo (visible en celosías)
          </label>
          <div className="flex flex-wrap gap-2">
            <button type="submit" className="btn-primary">
              {editId ? "Guardar" : "Crear"}
            </button>
            {editId && (
              <button type="button" className="btn-ghost" onClick={resetForm}>
                Cancelar
              </button>
            )}
          </div>
        </form>

        <div className="space-y-3">
          {loading && <p className="text-sm text-brand-900/60">Cargando…</p>}
          {!loading && designs.length === 0 && (
            <p className="text-sm text-brand-900/60">Sin diseños aún.</p>
          )}
          {designs.map((d) => (
            <article
              key={d._id}
              className="flex flex-wrap items-start justify-between gap-3 rounded-lg border border-brand-900/10 bg-white/70 p-4"
            >
              <div>
                <h3 className="font-medium text-brand-900">{d.title}</h3>
                <p className="text-xs text-brand-900/60">
                  {d.category} · {d.active ? "activo" : "inactivo"}
                </p>
                {d.description && (
                  <p className="mt-1 text-sm text-brand-900/70">{d.description}</p>
                )}
              </div>
              <div className="flex gap-2">
                <button type="button" className="btn-ghost px-3 py-1.5" onClick={() => startEdit(d)}>
                  Editar
                </button>
                <button
                  type="button"
                  className="btn-ghost px-3 py-1.5 text-red-700"
                  onClick={() => remove(d._id)}
                >
                  Borrar
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
