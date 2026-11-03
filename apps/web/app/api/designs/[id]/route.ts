import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/server/mongo";

export const runtime = "nodejs";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, ctx: Ctx) {
  try {
    const { id } = await ctx.params;
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "id inválido" }, { status: 400 });
    }
    const design = await (await getDb())
      .collection("designs")
      .findOne({ _id: new ObjectId(id) });
    if (!design) return NextResponse.json({ error: "no encontrado" }, { status: 404 });
    return NextResponse.json(design);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Error" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request, ctx: Ctx) {
  try {
    const { id } = await ctx.params;
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "id inválido" }, { status: 400 });
    }
    const body = await req.json().catch(() => ({}));
    const { title, description, imageUrl, category, active } = body || {};
    if (!title?.trim()) {
      return NextResponse.json({ error: "title es requerido" }, { status: 400 });
    }
    const update = {
      title: String(title).trim(),
      description: description ? String(description).trim() : "",
      imageUrl: imageUrl ? String(imageUrl).trim() : "",
      category: category ? String(category).trim() : "celosias",
      active: active !== false,
      updatedAt: new Date(),
    };
    const result = await (await getDb())
      .collection("designs")
      .findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: update },
        { returnDocument: "after" }
      );
    if (!result) return NextResponse.json({ error: "no encontrado" }, { status: 404 });
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(_req: Request, ctx: Ctx) {
  try {
    const { id } = await ctx.params;
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "id inválido" }, { status: 400 });
    }
    const result = await (await getDb())
      .collection("designs")
      .deleteOne({ _id: new ObjectId(id) });
    if (!result.deletedCount) {
      return NextResponse.json({ error: "no encontrado" }, { status: 404 });
    }
    return new NextResponse(null, { status: 204 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Error" },
      { status: 500 }
    );
  }
}
