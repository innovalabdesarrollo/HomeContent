import { NextResponse } from "next/server";
import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";

export const runtime = "nodejs";

const MAX_BYTES = 4 * 1024 * 1024;
const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

function parseDataUrl(dataUrl: string) {
  const m = String(dataUrl || "").match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
  if (!m) return null;
  return { mime: m[1], buffer: Buffer.from(m[2], "base64") };
}

function extFor(mime: string) {
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

async function uploadCloudinary(buffer: Buffer, mime: string) {
  const cloud = process.env.CLOUDINARY_CLOUD_NAME!;
  const apiKey = process.env.CLOUDINARY_API_KEY!;
  const apiSecret = process.env.CLOUDINARY_API_SECRET!;
  const timestamp = Math.floor(Date.now() / 1000);
  const folder = process.env.CLOUDINARY_FOLDER || "homecontent";
  const toSign = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
  const signature = crypto.createHash("sha1").update(toSign).digest("hex");

  const form = new FormData();
  form.append("file", new Blob([new Uint8Array(buffer)], { type: mime }));
  form.append("api_key", apiKey);
  form.append("timestamp", String(timestamp));
  form.append("signature", signature);
  form.append("folder", folder);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloud}/image/upload`, {
    method: "POST",
    body: form,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || "Error Cloudinary");
  return { url: data.secure_url as string, provider: "cloudinary" };
}

async function uploadLocal(buffer: Buffer, mime: string) {
  // En Vercel el FS es efímero: solo útil en local.
  if (process.env.VERCEL) {
    throw new Error(
      "En Vercel configura CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY y CLOUDINARY_API_SECRET"
    );
  }
  const dir = path.resolve(process.cwd(), "../api/uploads");
  await fs.mkdir(dir, { recursive: true });
  const name = `${Date.now()}-${crypto.randomBytes(4).toString("hex")}.${extFor(mime)}`;
  await fs.writeFile(path.join(dir, name), buffer);
  const base = process.env.PUBLIC_API_URL || "http://localhost:3007";
  return { url: `${base}/uploads/${name}`, provider: "local" };
}

export async function GET() {
  return NextResponse.json({
    cloudinary: cloudinaryConfigured(),
    localFallback: !process.env.VERCEL,
    maxBytes: MAX_BYTES,
    allowed: [...ALLOWED],
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const parsed = parseDataUrl(body?.imageBase64);
    if (!parsed) {
      return NextResponse.json(
        { error: "Envía imageBase64 como data URL (image/jpeg|png|webp|gif)" },
        { status: 400 }
      );
    }
    if (!ALLOWED.has(parsed.mime)) {
      return NextResponse.json(
        { error: `Tipo no permitido: ${parsed.mime}` },
        { status: 400 }
      );
    }
    if (parsed.buffer.length > MAX_BYTES) {
      return NextResponse.json({ error: "Imagen máximo 4 MB" }, { status: 400 });
    }

    const result = cloudinaryConfigured()
      ? await uploadCloudinary(parsed.buffer, parsed.mime)
      : await uploadLocal(parsed.buffer, parsed.mime);

    return NextResponse.json(result, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Error" },
      { status: 500 }
    );
  }
}
