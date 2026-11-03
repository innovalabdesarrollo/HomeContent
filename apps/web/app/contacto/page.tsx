"use client";

import { FormEvent, useState } from "react";
import { api } from "@/lib/api";

export default function ContactoPage() {
  const [ok, setOk] = useState(false);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSending(true);
    setError("");
    setOk(false);
    const fd = new FormData(e.currentTarget);
    try {
      await api.createLead({
        name: String(fd.get("name") || ""),
        email: String(fd.get("email") || ""),
        phone: String(fd.get("phone") || ""),
        message: String(fd.get("message") || ""),
        origin: "contacto",
      });
      setOk(true);
      e.currentTarget.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al enviar");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-10">
      <h1 className="font-display text-3xl text-brand-900 sm:text-4xl">Contacto</h1>
      <p className="mt-2 text-brand-900/70">
        Déjanos tus datos. Un asesor te contactará. Sin envío de correo automático.
      </p>

      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <div>
          <label className="label" htmlFor="name">
            Nombre *
          </label>
          <input id="name" name="name" required className="input" />
        </div>
        <div>
          <label className="label" htmlFor="email">
            Email *
          </label>
          <input id="email" name="email" type="email" required className="input" />
        </div>
        <div>
          <label className="label" htmlFor="phone">
            Teléfono
          </label>
          <input id="phone" name="phone" type="tel" className="input" />
        </div>
        <div>
          <label className="label" htmlFor="message">
            Mensaje
          </label>
          <textarea id="message" name="message" rows={4} className="input" />
        </div>
        <button type="submit" className="btn-primary w-full sm:w-auto" disabled={sending}>
          {sending ? "Enviando…" : "Enviar"}
        </button>
      </form>

      {ok && (
        <p className="mt-4 rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-800">
          Recibido. Gracias por tu interés.
        </p>
      )}
      {error && (
        <p className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}
