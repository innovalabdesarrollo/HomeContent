import { NextResponse } from "next/server";
import { getDb } from "@/lib/server/mongo";

export const runtime = "nodejs";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const filter: Record<string, unknown> = {};
    if (searchParams.get("active") === "true") filter.active = true;
    const designs = await (await getDb())
      .collection("designs")
      .find(filter)
      .sort({ createdAt: -1 })
      .toArray();
    return NextResponse.json(designs);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { title, description, imageUrl, category, active } = body || {};
    if (!title?.trim()) {
      return NextResponse.json({ error: "title es requerido" }, { status: 400 });
    }
    const doc = {
      title: String(title).trim(),
      description: description ? String(description).trim() : "",
      imageUrl: imageUrl ? String(imageUrl).trim() : "",
      category: category ? String(category).trim() : "celosias",
      active: active !== false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const result = await (await getDb()).collection("designs").insertOne(doc);
    return NextResponse.json({ ...doc, _id: result.insertedId }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Error" },
      { status: 500 }
    );
  }
}
