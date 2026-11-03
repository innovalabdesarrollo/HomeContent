/**
 * Vacío = mismo origen (Vercel / next start con Route Handlers).
 * Local dual: NEXT_PUBLIC_API_URL=http://localhost:3007
 */
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

export type Lead = {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  message?: string;
  origin?: string;
  status: "nuevo" | "contactado" | "calificado" | "descartado";
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

export type Design = {
  _id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  category?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
    cache: "no-store",
  });
  if (res.status === 204) return undefined as T;
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Error ${res.status}`);
  return data as T;
}

export const api = {
  createLead: (body: Partial<Lead>) =>
    request<Lead>("/api/leads", { method: "POST", body: JSON.stringify(body) }),
  listLeads: () => request<Lead[]>("/api/leads"),
  updateLead: (id: string, body: Partial<Lead>) =>
    request<Lead>(`/api/leads/${id}`, { method: "PATCH", body: JSON.stringify(body) }),
  deleteLead: (id: string) =>
    request<void>(`/api/leads/${id}`, { method: "DELETE" }),
  listDesigns: (activeOnly = false) =>
    request<Design[]>(`/api/designs${activeOnly ? "?active=true" : ""}`),
  createDesign: (body: Partial<Design>) =>
    request<Design>("/api/designs", { method: "POST", body: JSON.stringify(body) }),
  updateDesign: (id: string, body: Partial<Design>) =>
    request<Design>(`/api/designs/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  deleteDesign: (id: string) =>
    request<void>(`/api/designs/${id}`, { method: "DELETE" }),
  uploadImage: (imageBase64: string) =>
    request<{ url: string; provider: string }>("/api/uploads", {
      method: "POST",
      body: JSON.stringify({ imageBase64 }),
    }),
};
