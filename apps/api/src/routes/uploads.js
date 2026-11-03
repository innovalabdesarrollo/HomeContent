import { Router } from "express";
import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const router = Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const UPLOADS_DIR = path.resolve(__dirname, "../../uploads");

const MAX_BYTES = 4 * 1024 * 1024; // 4 MB
const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

function parseDataUrl(dataUrl) {
  const m = String(dataUrl || "").match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
  if (!m) return null;
  return { mime: m[1], buffer: Buffer.from(m[2], "base64") };
}

function extFor(mime) {
  if (mime === "image/png") return "png";
  if (mime === "image/webp") return "webp";
  if (mime === "image/gif") return "gif";
  return "jpg";
}

function cloudinaryConfigured() {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
  );
}

async function uploadCloudinary(buffer, mime) {
  const cloud = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  const timestamp = Math.floor(Date.now() / 1000);
  const folder = process.env.CLOUDINARY_FOLDER || "homecontent";
  const toSign = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
  const signature = crypto.createHash("sha1").update(toSign).digest("hex");

  const form = new FormData();
  form.append("file", new Blob([buffer], { type: mime }));
  form.append("api_key", apiKey);
  form.append("timestamp", String(timestamp));
  form.append("signature", signature);
  form.append("folder", folder);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloud}/image/upload`, {
    method: "POST",
    body: form,
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error?.message || "Error Cloudinary");
  }
  return { url: data.secure_url, provider: "cloudinary" };
}

async function uploadLocal(buffer, mime) {
  await fs.mkdir(UPLOADS_DIR, { recursive: true });
  const name = `${Date.now()}-${crypto.randomBytes(4).toString("hex")}.${extFor(mime)}`;
  await fs.writeFile(path.join(UPLOADS_DIR, name), buffer);
  const base = process.env.PUBLIC_API_URL || `http://localhost:${process.env.PORT || 3007}`;
  return { url: `${base}/uploads/${name}`, provider: "local" };
}

router.get("/status", (_req, res) => {
  res.json({
    cloudinary: cloudinaryConfigured(),
    localFallback: true,
    maxBytes: MAX_BYTES,
    allowed: [...ALLOWED],
  });
});

router.post("/", async (req, res) => {
  try {
    const parsed = parseDataUrl(req.body?.imageBase64);
    if (!parsed) {
      return res.status(400).json({
        error: "Envía imageBase64 como data URL (image/jpeg|png|webp|gif)",
      });
    }
    if (!ALLOWED.has(parsed.mime)) {
      return res.status(400).json({ error: `Tipo no permitido: ${parsed.mime}` });
    }
    if (parsed.buffer.length > MAX_BYTES) {
      return res.status(400).json({ error: "Imagen máximo 4 MB" });
    }

    const result = cloudinaryConfigured()
      ? await uploadCloudinary(parsed.buffer, parsed.mime)
      : await uploadLocal(parsed.buffer, parsed.mime);

    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
