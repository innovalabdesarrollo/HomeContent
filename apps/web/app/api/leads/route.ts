import { NextResponse } from "next/server";
import { getDb } from "@/lib/server/mongo";

export const runtime = "nodejs";

export async function GET() {
  try {
    const leads = await (await getDb())
      .collection("leads")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    return NextResponse.json(leads);
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
    const { name, email, phone, message, origin } = body || {};
    if (!name?.trim() || !email?.trim()) {
      return NextResponse.json(
        { error: "name y email son requeridos" },
        { status: 400 }
      );
    }
    const doc = {
      name: String(name).trim(),
      email: String(email).trim().toLowerCase(),
      phone: phone ? String(phone).trim() : "",
      message: message ? String(message).trim() : "",
      origin: origin ? String(origin).trim() : "contacto",
      status: "nuevo",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const result = await (await getDb()).collection("leads").insertOne(doc);
    return NextResponse.json({ ...doc, _id: result.insertedId }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Error" },
      { status: 500 }
    );
  }
}
