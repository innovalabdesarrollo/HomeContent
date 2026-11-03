import { Router } from "express";
import { ObjectId } from "mongodb";
import { getDb } from "../db.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const filter = {};
    if (req.query.active === "true") filter.active = true;
    const designs = await getDb()
      .collection("designs")
      .find(filter)
      .sort({ createdAt: -1 })
      .toArray();
    res.json(designs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "id inválido" });
    }
    const design = await getDb()
      .collection("designs")
      .findOne({ _id: new ObjectId(req.params.id) });
    if (!design) return res.status(404).json({ error: "no encontrado" });
    res.json(design);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { title, description, imageUrl, category, active } = req.body || {};
    if (!title?.trim()) {
      return res.status(400).json({ error: "title es requerido" });
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
    const result = await getDb().collection("designs").insertOne(doc);
    res.status(201).json({ ...doc, _id: result.insertedId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "id inválido" });
    }
    const { title, description, imageUrl, category, active } = req.body || {};
    if (!title?.trim()) {
      return res.status(400).json({ error: "title es requerido" });
    }
    const update = {
      title: String(title).trim(),
      description: description ? String(description).trim() : "",
      imageUrl: imageUrl ? String(imageUrl).trim() : "",
      category: category ? String(category).trim() : "celosias",
      active: active !== false,
      updatedAt: new Date(),
    };
    const result = await getDb()
      .collection("designs")
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
      .collection("designs")
      .deleteOne({ _id: new ObjectId(req.params.id) });
    if (!result.deletedCount) return res.status(404).json({ error: "no encontrado" });
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
