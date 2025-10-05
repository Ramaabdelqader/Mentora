import { Op } from "sequelize";
import { Lesson, Course, Enrollment } from "../models/index.js";

/**
 * Public list (safe fields only). Optional filter by ?courseId=#
 * Returns: [{ id, title, order }]
 */
export async function listLessons(req, res, next) {
  try {
    const { courseId } = req.query;
    const where = {};
    if (courseId) where.CourseId = Number(courseId);

    const rows = await Lesson.findAll({
      where,
      attributes: ["id", "title", "order"], // ⚠️ no content/videoUrl here
      order: [["order", "ASC"]],
    });
    res.json(rows);
  } catch (e) {
    next(e);
  }
}

/**
 * Secure: return full lesson (content + videoUrl) ONLY if enrolled
 * GET /api/lessons/:id  (requires auth)
 */
export async function getLessonSecure(req, res, next) {
  try {
    const { id } = req.params;

    const lesson = await Lesson.findByPk(id, { include: [Course] });
    if (!lesson) return res.status(404).json({ message: "Lesson not found" });

    // ✅ must be enrolled in this course
    const enr = await Enrollment.findOne({
      where: { UserId: req.user.id, CourseId: lesson.CourseId },
    });
    if (!enr) return res.status(403).json({ message: "Please enroll to access this lesson." });

    // Full lesson only after enrollment
    res.json({
      id: lesson.id,
      title: lesson.title,
      content: lesson.content,
      videoUrl: lesson.videoUrl,
      order: lesson.order,
      courseId: lesson.CourseId,
    });
  } catch (e) { next(e); }
}

/**
 * Create lesson (admin/instructor only)
 * Body: { title, content?, videoUrl?, order?, courseId }
 */
export async function createLesson(req, res, next) {
  try {
    const { title, content = null, videoUrl = null, order = 0, courseId } = req.body;
    if (!title || !courseId) {
      return res.status(400).json({ message: "title and courseId are required" });
    }

    const course = await Course.findByPk(Number(courseId));
    if (!course) return res.status(404).json({ message: "Course not found" });

    const lesson = await Lesson.create({
      title,
      content,
      videoUrl,
      order: Number(order) || 0,
      CourseId: course.id,
    });
    res.status(201).json(lesson);
  } catch (e) {
    next(e);
  }
}

/**
 * Update lesson (admin/instructor only)
 * Body may include: { title, content, videoUrl, order }
 */
export async function updateLesson(req, res, next) {
  try {
    const { id } = req.params;
    const lesson = await Lesson.findByPk(id);
    if (!lesson) return res.status(404).json({ message: "Lesson not found" });

    const { title, content, videoUrl, order } = req.body;
    await lesson.update({
      ...(title !== undefined ? { title } : {}),
      ...(content !== undefined ? { content } : {}),
      ...(videoUrl !== undefined ? { videoUrl } : {}),
      ...(order !== undefined ? { order: Number(order) } : {}),
    });

    res.json(lesson);
  } catch (e) {
    next(e);
  }
}

/**
 * Delete lesson (admin/instructor only)
 */
export async function deleteLesson(req, res, next) {
  try {
    const { id } = req.params;
    const count = await Lesson.destroy({ where: { id } });
    if (!count) return res.status(404).json({ message: "Lesson not found" });
    res.status(204).end();
  } catch (e) {
    next(e);
  }
}
