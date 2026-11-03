"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api, type Design } from "@/lib/api";

export default function CelosiasPage() {
  const [designs, setDesigns] = useState<Design[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .listDesigns(true)
      .then(setDesigns)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="font-display text-3xl text-brand-900 sm:text-4xl">Celosías</h1>
      <p className="mt-2 max-w-2xl text-brand-900/70">
        Diseños destacados de celosías ARGA. Explora opciones y contáctanos para tu proyecto.
      </p>

      {loading && <p className="mt-8 text-sm text-brand-900/60">Cargando diseños…</p>}
      {error && (
        <p className="mt-8 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}. Verifica que la API esté en el puerto 3007.
        </p>
      )}

      {!loading && !error && designs.length === 0 && (
        <p className="mt-8 text-brand-900/70">
          Aún no hay diseños publicados. Agrégalos en{" "}
          <Link href="/admin" className="underline">
            Admin
          </Link>
          .
        </p>
      )}

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {designs.map((d) => (
          <article key={d._id} className="overflow-hidden rounded-lg border border-brand-900/10 bg-white/70">
            <div
              className="aspect-[4/3] bg-brand-100 bg-cover bg-center"
              style={{
                backgroundImage: d.imageUrl
                  ? `url(${d.imageUrl})`
                  : "linear-gradient(135deg,#3d5a4c,#c4a35a)",
              }}
            />
            <div className="p-4">
              <p className="text-xs uppercase tracking-wide text-accent-500">
                {d.category || "celosias"}
              </p>
              <h2 className="mt-1 font-display text-xl text-brand-900">{d.title}</h2>
              {d.description && (
                <p className="mt-2 text-sm text-brand-900/70">{d.description}</p>
              )}
            </div>
          </article>
        ))}
      </div>

      <div className="mt-10">
        <Link href="/contacto" className="btn-primary">
          Quiero este tipo de celosía
        </Link>
      </div>
    </div>
  );
}
