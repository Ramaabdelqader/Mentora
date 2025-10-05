import { Course, Category, User, Lesson } from "../models/index.js";

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
    const course = await Course.findByPk(id, {
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
    if (!title || !description || !categoryId) return res.status(400).json({ message: "Missing fields" });
    const course = await Course.create({
      title, description, price, level, duration, thumbnail,
      CategoryId: categoryId, instructorId: req.user.id,
    });
    res.status(201).json(course);
  } catch (e) { next(e); }
}

export async function updateCourse(req, res, next) {
  try {
    const { id } = req.params;
    const found = await Course.findByPk(id);
    if (!found) return res.status(404).json({ message: "Not found" });
    await found.update(req.body);
    res.json(found);
  } catch (e) { next(e); }
}

export async function deleteCourse(req, res, next) {
  try {
    const { id } = req.params;
    const deleted = await Course.destroy({ where: { id } });
    if (!deleted) return res.status(404).json({ message: "Not found" });
    res.json({ ok: true });
  } catch (e) { next(e); }
}
