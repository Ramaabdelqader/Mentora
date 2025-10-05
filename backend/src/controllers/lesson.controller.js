import { Lesson, Course } from "../models/index.js";

export async function listLessons(req, res, next) {
  try {
    const { courseId } = req.query;
    const where = courseId ? { CourseId: courseId } : {};
    const lessons = await Lesson.findAll({ where, order: [["order", "ASC"]] });
    res.json(lessons);
  } catch (e) { next(e); }
}

export async function createLesson(req, res, next) {
  try {
    const { title, content = "", videoUrl = "", order = 0, courseId } = req.body;
    if (!title || !courseId) return res.status(400).json({ message: "Missing fields" });
    const exists = await Course.findByPk(courseId);
    if (!exists) return res.status(404).json({ message: "Course not found" });
    const lesson = await Lesson.create({ title, content, videoUrl, order, CourseId: courseId });
    res.status(201).json(lesson);
  } catch (e) { next(e); }
}

export async function updateLesson(req, res, next) {
  try {
    const { id } = req.params;
    const found = await Lesson.findByPk(id);
    if (!found) return res.status(404).json({ message: "Not found" });
    await found.update(req.body);
    res.json(found);
  } catch (e) { next(e); }
}

export async function deleteLesson(req, res, next) {
  try {
    const { id } = req.params;
    const deleted = await Lesson.destroy({ where: { id } });
    if (!deleted) return res.status(404).json({ message: "Not found" });
    res.json({ ok: true });
  } catch (e) { next(e); }
}
