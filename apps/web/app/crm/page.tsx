"use client";

import { useCallback, useEffect, useState } from "react";
import { api, type Lead } from "@/lib/api";

const STATUSES: Lead["status"][] = ["nuevo", "contactado", "calificado", "descartado"];

export default function CrmPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selected, setSelected] = useState<Lead | null>(null);
  const [notes, setNotes] = useState("");
  const [filter, setFilter] = useState<string>("todos");
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await api.listLeads();
      setLeads(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const q = query.trim().toLowerCase();
  const visible = leads.filter((l) => {
    if (filter !== "todos" && l.status !== filter) return false;
    if (!q) return true;
    return (
      l.name.toLowerCase().includes(q) ||
      l.email.toLowerCase().includes(q) ||
      (l.phone || "").toLowerCase().includes(q)
    );
  });

  async function changeStatus(id: string, status: Lead["status"]) {
    try {
      const updated = await api.updateLead(id, { status });
      setLeads((prev) => prev.map((l) => (l._id === id ? updated : l)));
      if (selected?._id === id) setSelected(updated);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error");
    }
  }

  async function saveNotes() {
    if (!selected) return;
    try {
      const updated = await api.updateLead(selected._id, { notes });
      setLeads((prev) => prev.map((l) => (l._id === selected._id ? updated : l)));
      setSelected(updated);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error");
    }
  }

  async function remove(id: string) {
    if (!confirm("¿Eliminar este lead?")) return;
    try {
      await api.deleteLead(id);
      setLeads((prev) => prev.filter((l) => l._id !== id));
      if (selected?._id === id) setSelected(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error");
    }
  }

  function exportCsv() {
    if (visible.length === 0) {
      setError("No hay leads visibles para exportar.");
      return;
    }
    const headers = [
      "nombre",
      "email",
      "telefono",
      "estado",
      "origen",
      "mensaje",
      "notas",
      "creado",
    ];
    const esc = (v: string) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const rows = visible.map((l) =>
      [
        l.name,
        l.email,
        l.phone || "",
        l.status,
        l.origin || "",
        l.message || "",
        l.notes || "",
        l.createdAt ? new Date(l.createdAt).toISOString() : "",
      ]
        .map(esc)
        .join(",")
    );
    const csv = ["\uFEFF" + headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const stamp = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = `leads-arga-${stamp}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-brand-900 sm:text-4xl">
            Panel de clientes potenciales
          </h1>
          <p className="mt-2 text-brand-900/70">
            Gestiona leads captados desde contacto. Sin login en este MVP.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="btn-ghost" onClick={load}>
            Actualizar
          </button>
          <button
            type="button"
            className="btn-primary"
            onClick={exportCsv}
            disabled={visible.length === 0}
          >
            Exportar CSV
          </button>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {["todos", ...STATUSES].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setFilter(s)}
              className={`rounded-md px-3 py-1.5 text-sm capitalize ${
                filter === s ? "bg-brand-700 text-white" : "bg-white/70 text-brand-900"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        <input
          type="search"
          className="input max-w-md"
          placeholder="Buscar por nombre, email o teléfono…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Buscar leads"
        />
      </div>

      {error && (
        <p className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}
      {loading && <p className="mt-6 text-sm text-brand-900/60">Cargando…</p>}

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="overflow-x-auto rounded-lg border border-brand-900/10 bg-white/70">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-brand-900/10 text-brand-900/60">
              <tr>
                <th className="px-3 py-2 font-medium">Nombre</th>
                <th className="px-3 py-2 font-medium">Email</th>
                <th className="px-3 py-2 font-medium">Estado</th>
                <th className="px-3 py-2 font-medium">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((l) => (
                <tr
                  key={l._id}
                  onClick={() => {
                    setSelected(l);
                    setNotes(l.notes || "");
                  }}
                  className={`cursor-pointer border-b border-brand-900/5 hover:bg-brand-50 ${
                    selected?._id === l._id ? "bg-brand-50" : ""
                  }`}
                >
                  <td className="px-3 py-2 font-medium">{l.name}</td>
                  <td className="px-3 py-2">{l.email}</td>
                  <td className="px-3 py-2 capitalize">{l.status}</td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    {new Date(l.createdAt).toLocaleDateString("es-MX")}
                  </td>
                </tr>
              ))}
              {!loading && visible.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-3 py-6 text-brand-900/60">
                    Sin leads con este filtro/búsqueda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <aside className="rounded-lg border border-brand-900/10 bg-white/70 p-4">
          {!selected ? (
            <p className="text-sm text-brand-900/60">Selecciona un lead para ver detalle.</p>
          ) : (
            <div className="space-y-3">
              <h2 className="font-display text-xl">{selected.name}</h2>
              <p className="text-sm">{selected.email}</p>
              {selected.phone && <p className="text-sm">Tel: {selected.phone}</p>}
              {selected.message && (
                <p className="rounded-md bg-brand-50 p-2 text-sm text-brand-900/80">
                  {selected.message}
                </p>
              )}
              <div>
                <label className="label">Estado</label>
                <select
                  className="input"
                  value={selected.status}
                  onChange={(e) =>
                    changeStatus(selected._id, e.target.value as Lead["status"])
                  }
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Notas</label>
                <textarea
                  className="input"
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
                <button type="button" className="btn-primary mt-2" onClick={saveNotes}>
                  Guardar notas
                </button>
              </div>
              <button
                type="button"
                className="btn-ghost text-red-700"
                onClick={() => remove(selected._id)}
              >
                Eliminar
              </button>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
