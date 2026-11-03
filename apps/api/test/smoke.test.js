/**
 * Smoke estratégico: health, leads, designs, upload.
 * Usa Mongo real (.env) y puerto efímero (no toca 3007).
 */
import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import { ObjectId } from "mongodb";
import { connectDb, getDb, closeDb } from "../src/db.js";
import { createApp } from "../src/app.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

const PNG_1X1 =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";

let baseUrl = "";
let server;
const createdLeadIds = [];
const createdDesignIds = [];

async function api(pathname, init) {
  const res = await fetch(`${baseUrl}${pathname}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  });
  const text = await res.text();
  let body = null;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = text;
  }
  return { res, body };
}

before(async () => {
  assert.ok(process.env.MONGODB_URI, "MONGODB_URI requerida en .env");
  await connectDb(process.env.MONGODB_URI);
  const app = createApp();
  await new Promise((resolve) => {
    server = app.listen(0, "127.0.0.1", resolve);
  });
  const { port } = server.address();
  baseUrl = `http://127.0.0.1:${port}`;
});

after(async () => {
  const db = getDb();
  if (createdLeadIds.length) {
    await db.collection("leads").deleteMany({
      _id: { $in: createdLeadIds.map((id) => new ObjectId(id)) },
    });
  }
  if (createdDesignIds.length) {
    await db.collection("designs").deleteMany({
      _id: { $in: createdDesignIds.map((id) => new ObjectId(id)) },
    });
  }
  await new Promise((resolve) => server.close(resolve));
  await closeDb();
});

describe("health", () => {
  it("responde ok", async () => {
    const { res, body } = await api("/api/health");
    assert.equal(res.status, 200);
    assert.equal(body.ok, true);
  });
});

describe("leads", () => {
  it("rechaza lead sin name/email", async () => {
    const { res, body } = await api("/api/leads", {
      method: "POST",
      body: JSON.stringify({ name: "" }),
    });
    assert.equal(res.status, 400);
    assert.match(body.error, /requeridos/i);
  });

  it("crea, lista y actualiza estado", async () => {
    const { res: createRes, body: lead } = await api("/api/leads", {
      method: "POST",
      body: JSON.stringify({
        name: "Test Smoke",
        email: "smoke@test.local",
        phone: "555",
        message: "prueba unitaria",
        origin: "test-smoke",
      }),
    });
    assert.equal(createRes.status, 201);
    assert.ok(lead._id);
    assert.equal(lead.status, "nuevo");
    assert.equal(lead.email, "smoke@test.local");
    createdLeadIds.push(lead._id);

    const { res: listRes, body: list } = await api("/api/leads");
    assert.equal(listRes.status, 200);
    assert.ok(list.some((l) => l._id === lead._id));

    const { res: patchRes, body: updated } = await api(`/api/leads/${lead._id}`, {
      method: "PATCH",
      body: JSON.stringify({ status: "contactado", notes: "ok" }),
    });
    assert.equal(patchRes.status, 200);
    assert.equal(updated.status, "contactado");
    assert.equal(updated.notes, "ok");
  });
});

describe("designs", () => {
  it("crea diseño activo y aparece en listado filtrado", async () => {
    const { res: createRes, body: design } = await api("/api/designs", {
      method: "POST",
      body: JSON.stringify({
        title: "Diseño Smoke",
        description: "test",
        category: "celosias",
        active: true,
      }),
    });
    assert.equal(createRes.status, 201);
    assert.ok(design._id);
    createdDesignIds.push(design._id);

    const { res, body } = await api("/api/designs?active=true");
    assert.equal(res.status, 200);
    assert.ok(body.some((d) => d._id === design._id));
  });

  it("rechaza diseño sin título", async () => {
    const { res } = await api("/api/designs", {
      method: "POST",
      body: JSON.stringify({ description: "x" }),
    });
    assert.equal(res.status, 400);
  });
});

describe("uploads", () => {
  it("sube png 1x1 y devuelve url", async () => {
    const { res, body } = await api("/api/uploads", {
      method: "POST",
      body: JSON.stringify({ imageBase64: PNG_1X1 }),
    });
    assert.equal(res.status, 201);
    assert.ok(body.url);
    assert.ok(["local", "cloudinary"].includes(body.provider));
  });

  it("rechaza data URL inválida", async () => {
    const { res } = await api("/api/uploads", {
      method: "POST",
      body: JSON.stringify({ imageBase64: "no-es-imagen" }),
    });
    assert.equal(res.status, 400);
  });
});
