import { Category } from "../models/index.js";

export async function listCategories(_req, res, next) {
  try {
    const cats = await Category.findAll({ order: [["name", "ASC"]] });
    res.json(cats);
  } catch (e) { next(e); }
}

export async function createCategory(req, res, next) {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: "Name required" });
    const cat = await Category.create({ name });
    res.status(201).json(cat);
  } catch (e) { next(e); }
}

export async function deleteCategory(req, res, next) {
  try {
    const { id } = req.params;
    const deleted = await Category.destroy({ where: { id } });
    if (!deleted) return res.status(404).json({ message: "Not found" });
    res.json({ ok: true });
  } catch (e) { next(e); }
}
