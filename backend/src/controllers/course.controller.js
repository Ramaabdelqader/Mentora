import { Course, Category, User, Lesson } from "../models/index.js";

const ALLOWED_UPDATE_FIELDS = ["title", "description", "price", "level", "duration", "thumbnail", "CategoryId"];

export async function listCourses(req, res, next) {
  try {
    const courses = await Course.findAll({
      include: [
        { model: Category, attributes: ["id", "name"] },
        { model: User, as: "instructor", attributes: ["id", "name", "email"] }
      ],
      order: [["createdAt", "DESC"]],
    });
    res.json(courses);
  } catch (e) { next(e); }
}

export async function getCourse(req, res, next) {
  try {
    const { id } = req.params;
    const cid = Number(id);
    if (isNaN(cid)) return res.status(400).json({ message: "Invalid course id" });

    const course = await Course.findByPk(cid, {
      include: [
        { model: Category, attributes: ["id", "name"] },
        { model: User, as: "instructor", attributes: ["id", "name", "email"] },
        { model: Lesson, separate: true, order: [["order", "ASC"]] },
      ],
    });
    if (!course) return res.status(404).json({ message: "Not found" });
    res.json(course);
  } catch (e) { next(e); }
}

export async function createCourse(req, res, next) {
  try {
    const { title, description, price = 0, level = "Beginner", duration = "0h", thumbnail = "", categoryId } = req.body;
    if (!title || !description || !categoryId) {
      return res.status(400).json({ message: "Missing fields" });
    }
    const cat = await Category.findByPk(categoryId);
    if (!cat) return res.status(404).json({ message: "Category not found" });

    const course = await Course.create({
      title,
      description,
      price,
      level,
      duration,
      thumbnail,
      CategoryId: cat.id,
      instructorId: req.user.id,
    });
    res.status(201).json(course);
  } catch (e) {
    next(e);
  }
}

export async function updateCourse(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid id" });

    const found = await Course.findByPk(id);
    if (!found) return res.status(404).json({ message: "Not found" });

    // Authorization: if instructor role, must own this course
    if (req.user.role === "instructor" && found.instructorId !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const updates = {};
    for (const f of ALLOWED_UPDATE_FIELDS) {
      if (req.body[f] !== undefined) {
        updates[f] = req.body[f];
      }
    }
    await found.update(updates);
    res.json(found);
  } catch (e) { next(e); }
}

export async function deleteCourse(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid id" });

    const found = await Course.findByPk(id);
    if (!found) return res.status(404).json({ message: "Not found" });

    if (req.user.role === "instructor" && found.instructorId !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const deleted = await Course.destroy({ where: { id } });
    if (!deleted) return res.status(404).json({ message: "Not found" });
    res.json({ ok: true });
  } catch (e) { next(e); }
}
