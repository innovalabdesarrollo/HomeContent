import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/server/mongo";

export const runtime = "nodejs";

const STATUSES = ["nuevo", "contactado", "calificado", "descartado"];

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, ctx: Ctx) {
  try {
    const { id } = await ctx.params;
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "id inválido" }, { status: 400 });
    }
    const lead = await (await getDb())
      .collection("leads")
      .findOne({ _id: new ObjectId(id) });
    if (!lead) return NextResponse.json({ error: "no encontrado" }, { status: 404 });
    return NextResponse.json(lead);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Error" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request, ctx: Ctx) {
  try {
    const { id } = await ctx.params;
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "id inválido" }, { status: 400 });
    }
    const body = await req.json().catch(() => ({}));
    const { status, notes } = body || {};
    const update: Record<string, unknown> = { updatedAt: new Date() };
    if (status !== undefined) {
      if (!STATUSES.includes(status)) {
        return NextResponse.json(
          { error: `status debe ser: ${STATUSES.join(", ")}` },
          { status: 400 }
        );
      }
      update.status = status;
    }
    if (notes !== undefined) update.notes = String(notes);

    const result = await (await getDb())
      .collection("leads")
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
      .collection("leads")
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
