import { Router } from "express";
import { ObjectId } from "mongodb";
import { getDb } from "../db.js";

const router = Router();
const STATUSES = ["nuevo", "contactado", "calificado", "descartado"];

router.get("/", async (_req, res) => {
  try {
    const leads = await getDb()
      .collection("leads")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    res.json(leads);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "id inválido" });
    }
    const lead = await getDb()
      .collection("leads")
      .findOne({ _id: new ObjectId(req.params.id) });
    if (!lead) return res.status(404).json({ error: "no encontrado" });
    res.json(lead);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { name, email, phone, message, origin } = req.body || {};
    if (!name?.trim() || !email?.trim()) {
      return res.status(400).json({ error: "name y email son requeridos" });
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
    const result = await getDb().collection("leads").insertOne(doc);
    res.status(201).json({ ...doc, _id: result.insertedId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "id inválido" });
    }
    const { status, notes } = req.body || {};
    const update = { updatedAt: new Date() };
    if (status !== undefined) {
      if (!STATUSES.includes(status)) {
        return res.status(400).json({ error: `status debe ser: ${STATUSES.join(", ")}` });
      }
      update.status = status;
    }
    if (notes !== undefined) update.notes = String(notes);

    const result = await getDb()
      .collection("leads")
      .findOneAndUpdate(
        { _id: new ObjectId(req.params.id) },
        { $set: update },
        { returnDocument: "after" }
      );

    if (!result) return res.status(404).json({ error: "no encontrado" });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "id inválido" });
    }
    const result = await getDb()
      .collection("leads")
      .deleteOne({ _id: new ObjectId(req.params.id) });
    if (!result.deletedCount) return res.status(404).json({ error: "no encontrado" });
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
